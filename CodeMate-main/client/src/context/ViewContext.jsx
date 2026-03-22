import UserView from "../components/sidebar/sidebar-views/UserView";
import RunView from "../components/sidebar/sidebar-views/RunView";
import FilesView from "../components/sidebar/sidebar-views/FilesView";
import ChatView from "../components/sidebar/sidebar-views/ChatView";
import { LuFiles } from "react-icons/lu"
import { MdChatBubbleOutline } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { useState, createContext , useContext } from "react";
import VIEW from "../types/view";
import { color } from "@codemirror/theme-one-dark";

const defaultContextValues = {
    activeView : VIEW.FILES,
    setactiveView : () => {},
    isSidebarOpen : true,
    setisSidebarOpen :() => {},
    viewComponents : [Object.keys(VIEW)],
    viewIcons : [Object.keys(VIEW)],
}
const ViewContext = createContext(defaultContextValues);

export const useViews = () => {
    const context  = useContext(ViewContext);
    if(!context)
        {
            throw new console.error("useView  must be used within a viewProvider");
            
        }
    return context;
    }
const ViewProvider = ({children}) => {
    const [activeView, setactiveView] = useState(VIEW.FILES);
    const [isSidebarOpen, setisSidebarOpen] = useState(true);
    const [viewComponents] = useState({
        [VIEW.FILES]:<FilesView/>,
        [VIEW.RUN]:<RunView/>,
        [VIEW.CLIENTS]:<UserView/>,
        [VIEW.CHATS]:<ChatView/>,
    })
    const [viewIcons] = useState({
        [VIEW.FILES]:<LuFiles size={40}/>,
        [VIEW.CLIENTS]:<FaUserFriends size={40}/>,
        [VIEW.CHATS]:<MdChatBubbleOutline size={40}/>,
        [VIEW.RUN]:<FaPlay size={38}/>,
    })

    return (
        <ViewContext.Provider
            value={{
                activeView,
                setactiveView,
                isSidebarOpen,
                setisSidebarOpen,
                viewComponents,
                viewIcons,
            }}
        >
            {children}
        </ViewContext.Provider>
    )

}
export { ViewProvider }
export default ViewContext