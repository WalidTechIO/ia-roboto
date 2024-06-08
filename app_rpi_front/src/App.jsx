import './assets/App.css'
import Control from './components/Control'
import Modal from './components/Modal'
import useRobot from './hooks/useRobot'
import { useState } from 'react'

function App() {
  const [modal, setModal] = useState(undefined)
  const [image, setImage] = useState(undefined)
  const [box, setBox] = useState({print: false, coords: undefined, color: undefined})

  const handleLocationMessage = payload => {
    setModal(<Modal message={"Emplacement du robot détecté: " + payload[1]} callback={() => setModal(undefined)} delay={1500}/>)
    setBox({print: true, coords: payload[0], color: payload[2]})
    setTimeout(() => {
      setBox({ print: false, coords: undefined, color: undefined })
    }, 333)
  }

  const receive = msg => {
    switch(msg.type) {
      case "location":
        handleLocationMessage(msg.payload)
        break
      case "photo":
        setImage(msg.payload)
        break
    }
  }

  const { forward, backward, right, left, stop } = useRobot({ receive })

  return (
    <div>
      <h1>IA Roboto</h1>
      {modal}
      <div className="card">
        <div className="keyboard">
          <div className="top-row">
            <Control onPress={forward} onRelease={stop}>
              <p>Z</p>
            </Control>
          </div>
          <div className="bottom-row">
            <Control onPress={left} onRelease={stop} className="key">
              <p>Q</p>
            </Control>
            <Control onPress={backward} onRelease={stop} className="key">
              <p>S</p>
            </Control>
            <Control onPress={right} onRelease={stop} className="key">
              <p>D</p>
            </Control>
          </div>
        </div>
      </div>
      <div className="img-container">
        <img alt="Vue du robot" src={image}/>
        {box.print && <div className="box" style={{top: box.coords?.top, left: box.coords?.left, height: box.coords?.height, width: box.coords?.width, borderColor: box.color}}></div>}
      </div>
    </div>
  )
}

export default App
