export default function Control({children, onRelease, onPress}) {
    return <div onMouseDown={onPress} onMouseUp={onRelease} onTouchStart={onPress} onTouchEnd={onRelease} className="key">
        {children}
    </div>
}