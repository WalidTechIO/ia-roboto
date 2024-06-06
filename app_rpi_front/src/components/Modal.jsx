import { useEffect } from "react";
import '../assets/Modal.css'

export default function Modal({ callback, message }) {

    useEffect(() => {
        const timeout = setTimeout(callback, 5000)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const style = {
        position: "absolute",
        bottom: "0",
        right: "20px"
    }

    return <div style={style}>
        <div className="alert alert-info alert-dismissible fade show" role="alert">
            {message}
            <button type="button" className="btn-close" onClick={callback}></button>
        </div>
    </div>

}