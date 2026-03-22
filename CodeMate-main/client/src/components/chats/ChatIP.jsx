"use client"

import { useAppContext } from "../../context/AppContext"
import { useSocket } from "../../context/SocketContext"
import { SocketEvent } from "../../types/socket"
import { useChatRoom } from "../../context/ChatContext"
import { useRef } from "react"
import { Send } from "lucide-react"
import { v4 as uid } from "uuid"
import getDate from "../../utils/dateFormater"

function ChatIP() {
  const { currentUser } = useAppContext()
  const { socket } = useSocket()
  const { setMsgs } = useChatRoom()
  const ipRef = useRef(null)

  const sendMessage = (ev) => {
    ev.preventDefault()

    const val = ipRef.current?.value.trim()

    if (val && val.length > 0) {
      const msg = {
        id: uid(),
        message: val,
        username: currentUser.username,
        time: getDate(new Date().toISOString()),
      }

      socket.emit(SocketEvent.SEND_MESSAGE, { msg })
      setMsgs((msgs) => [...msgs, msg])

      if (ipRef.current) {
        ipRef.current.value = ""
      }
    }
  }

  return (
    <form onSubmit={sendMessage} className="flex items-center gap-3 w-full">
      <input
        type="text"
        className="flex-grow px-4 py-3 text-sm border border-gray-200 rounded-xl 
                 bg-white placeholder:text-gray-400
                 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                 transition-all duration-200"
        placeholder="Type your message..."
        ref={ipRef}
      />
      <button
        className="flex items-center justify-center p-3 rounded-xl
                 bg-black text-white hover:bg-gray-800
                 transition-all duration-200 shadow-sm"
        type="submit"
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}

export default ChatIP

