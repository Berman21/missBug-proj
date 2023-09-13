import { eventBusService } from "../services/event-bus.service.js"

const { useState, useEffect } = React
eventBusService

export function UserMsg() {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', msg => {
            setMsg(msg)
            setTimeout(() => {
                onCloseMsg()
            }, 2000);
        })

        return unsubscribe
    }, [])

    function onCloseMsg() {
        setMsg(null)
    }

    if (!msg) return ''
    return (
        <div className={"user-msg " + msg.type}>
            <p>{msg.txt}</p>
            <button onClick={onCloseMsg}>X</button>
        </div>
    )
}
