import {SerialPort} from "serialport"
import NodeWebcam from "node-webcam"; //Necessite fswebcam
import WebSocket, { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 3002 })
const usb = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 9600 });

const camOpts = {
    width: 640,
    height: 480,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "base64",
    verbose: false,
};

const webcam = NodeWebcam.create(camOpts)

wss.on("listening", () => {
    console.log("Serveur WebSocket en écoute sur le port 3002")
})

wss.on("error", err => {
    console.error("WebSocket Server error" + err.message)
})

usb.on("open", () => {
    console.log("Port USB ouvert")
})

usb.on("error", err => {
    console.error("USB Erreur: " + err.message)
})

usb.on("data", data => {
    if(data.toString().trim() === "OK Arduino") {
        usb.write("[[bip]]")
    }
})

//Deplacement du robot
const computeRobotCommand = (payload) => {
    switch(payload) {
        case "forward":
            usb.write("[[mda][mga]]")
            break
        case "backward":
            usb.write("[[mdr][mgr]]")
            break
        case "left":
            usb.write("[[mda][mgr]]")
            break
        case "right":
            usb.write("[[mdr][mga]]")
            break
        case "stop":
            usb.write("[[stp]]")
            break
        default:
            return
    }
}

//Lors d'une connexion WebSocket
wss.on("connection", ws => {
    //On configure le comportement de la réception des msg qui seront reçus par les clients
    ws.on("message", msg => {
        //On recupere les donnees
        const data = JSON.parse(msg)
        //Message de controle du robot
        if(data.type === "control" && usb) {
            computeRobotCommand(data.payload)
        } else {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data))
            })
        }
    })
})

let capture = 0

setInterval(() => {
    webcam.capture("photo", (err, data) => {
        capture++
        const forBase = capture % 15 === 0
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type: "photo", payload: data, forBase }));
        })
    })
}, 333)