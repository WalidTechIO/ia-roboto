import { useEffect } from "react";
import '../assets/Modal.css'

export default function Modal({ callback, message, delay }) {

    useEffect(() => {
        const timeout = setTimeout(callback, delay)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const style = {
        position: "absolute",
        bottom: "0px",
        right: "20px",
        zIndex: "1000"
    }

    return <div style={style}>
        <div className="alert alert-info alert-dismissible fade show" role="alert">
            {message}
            <button type="button" className="btn-close" onClick={callback}></button>
        </div>
    </div>

}
