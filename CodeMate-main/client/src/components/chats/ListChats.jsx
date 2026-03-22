"use client"

import { useAppContext } from "../../context/AppContext"
import { useChatRoom } from "../../context/ChatContext"
import { useRef, useEffect } from "react"

function ListChats() {
  const { msgs, isNewMsg, setIsNewMsg, scrollHgt, setScrollHgt } = useChatRoom()

  const { currentUser } = useAppContext()
  const msgsBoxRef = useRef(null)

  const handleScroll = (ev) => {
    const box = ev.target
    setScrollHgt(box.scrollTop)
  }

  useEffect(() => {
    if (!msgsBoxRef.current) {
      return
    }
    msgsBoxRef.current.scrollTop = msgsBoxRef.current.scrollHeight
  }, [msgs])

  useEffect(() => {
    if (isNewMsg) {
      setIsNewMsg(false)
    }
    if (msgsBoxRef.current) {
      msgsBoxRef.current.scrollTop = scrollHgt
    }
  }, [isNewMsg, setIsNewMsg, scrollHgt])

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4 h-full w-full" ref={msgsBoxRef} onScroll={handleScroll}>
      {msgs.map((msg, idx) => {
        const isCurrentUser = msg.username === currentUser.username
        return (
          <div key={idx} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-xs break-words rounded-2xl p-4 text-sm shadow-sm transition-all duration-200 ${
                isCurrentUser ? "bg-black text-white" : "bg-gray-300 text-gray-900 border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center gap-4 mb-1.5">
                <span className="font-medium text-xs">{msg.username}</span>
                <span className={`text-xs ${isCurrentUser ? "text-gray-300" : "text-gray-500"}`}>{msg.time}</span>
              </div>
              <p className="leading-relaxed">{msg.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ListChats

