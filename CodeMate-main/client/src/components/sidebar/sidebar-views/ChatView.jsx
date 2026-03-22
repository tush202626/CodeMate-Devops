import ListChats from "../../chats/ListChats"
import ChatIP from "../../chats/ChatIP"

const ChatView = () => {
  return (
    <div className="w-full h-full bg-white text-gray-900 shadow-lg border-black border-4 rounded-3xl flex flex-col transition-all duration-300 overflow-hidden">
      <div className="px-6 pt-6 pb-3 border-gray-200">
        <h1 className="text-2xl font-semibold text-black tracking-tight">Chats</h1>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Chat list with scrollable container */}
        <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ListChats />
        </div>

        {/* Chat input fixed at bottom */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <ChatIP />
        </div>
      </div>
    </div>
  )
}

export default ChatView

