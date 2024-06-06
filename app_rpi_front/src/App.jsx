import './assets/App.css'
import Control from './components/Control'
import Modal from './components/Modal'
import useRobot from './hooks/useRobot'
import { useState } from 'react'

function App() {
  const [modal, setModal] = useState(undefined)
  const [image, setImage] = useState(undefined)

  const showModal = msg => {
    setModal(<Modal message={msg} callback={() => setModal(undefined)} />)
  }

  const receive = msg => {
    switch(msg.type) {
      case "location":
        console.log("Localisation du robot : " + msg.payload)
        showModal("Emplacement du robot détecté: " + msg.payload)
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
      <div>
        <img alt="Vue du robot" src={image}/>
      </div>
    </div>
  )
}

export default App
