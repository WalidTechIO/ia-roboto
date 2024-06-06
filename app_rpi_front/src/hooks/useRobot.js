import { useRef, useEffect } from 'react';

export default function useRobot({receive}) {

    const socketRef = useRef(null);

    const keyUpListener = e => {
        if(["z","q","s","d"].includes(e.key)) stop();
    }

    const keyDownListener = e => {
        if (e.repeat) return;

        switch(e.key) {
            case "z":
                forward()
                break
            case "s":
                backward()
                break
            case "q":
                left()
                break
            case "d":
                right()
                break
        }
    }

    useEffect(() => {
        function init() {
            window.addEventListener("keyup", keyUpListener)
            window.addEventListener("keydown", keyDownListener)
            const ws = new WebSocket("ws://" + location.hostname + ":3002");
            ws.addEventListener("open", () => {
                console.log('WebSocket connecté');
            });

            ws.addEventListener("message", msg => {
                const message = JSON.parse(msg.data);
                receive(message)
            });

            ws.addEventListener("error", err => {
                console.error(err);
            });

            socketRef.current = ws;
        }

        init();

        return () => {
            window.removeEventListener("keyup", keyUpListener)
            window.removeEventListener("keydown", keyDownListener)
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const write = (val) => {
        if (socketRef.current) {
            socketRef.current.send(val);
        }
    };

    const controlMsg = {
        type: "control",
        payload: undefined
    };

    const forward = () => {
        write(JSON.stringify({ ...controlMsg, payload: "forward" }));
    };

    const backward = () => {
        write(JSON.stringify({ ...controlMsg, payload: "backward" }));
    };

    const left = () => {
        write(JSON.stringify({ ...controlMsg, payload: "left" }));
    };

    const right = () => {
        write(JSON.stringify({ ...controlMsg, payload: "right" }));
    };

    const stop = () => {
        write(JSON.stringify({ ...controlMsg, payload: "stop" }));
    };

    return { forward, backward, right, left, stop };
}
