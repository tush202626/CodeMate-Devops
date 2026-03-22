import { SocketEvent } from "../types/socket";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const defaultContextValues = {
    msgs: [],
    setMsgs: () => {},
    isNewMsg: false,
    setIsNewMsg: () => {},
    scrollHgt: 0,
    setScrollHgt: () => {},
}

const ChatContext = createContext(defaultContextValues);

export const useChatRoom = () => {
    const cxt = useContext(ChatContext);

    if(!cxt)
    {
        throw new Error("Error in useChatRoom");
    }
    return cxt;
}

function ChatContextProvider({ children })
{
    const {socket} = useSocket();
    const [msgs, setMsgs] = useState([]);
    const [isNewMsg, setIsNewMsg] = useState(false);
    const [scrollHgt, setScrollHgt] = useState(0);

    useEffect(() => {
        socket.on(SocketEvent.RECEIVE_MESSAGE, ({msg}) => {
            setMsgs((msgs) => [...msgs, msg]);
            setIsNewMsg(true);
        });

        return () => {
            socket.off(SocketEvent.RECEIVE_MESSAGE);
        }
    }, [socket]);

    return (
        <ChatContext.Provider
            value = {{
                msgs,
                setMsgs,
                isNewMsg,
                setIsNewMsg,
                scrollHgt,
                setScrollHgt,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContextProvider };
export default ChatContext;