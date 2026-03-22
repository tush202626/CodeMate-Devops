import { useViews } from "../../../context/ViewContext";
import { useChatRoom } from "../../../context/ChatContext";
import { Tooltip } from "react-tooltip";
import { useState, useEffect } from "react";
import { tooltipStyles , buttonStyles } from "./tootipsStyle";
import VIEW from "../../../types/view";
const SidebarButton = ({viewName , icon}) => {
    const {isSidebarOpen,setisSidebarOpen,activeView,setactiveView } = useViews();
    const [showTooltip , setShowTooltip] = useState(true);
    const handleViewClick = (viewName) => {
        if (viewName === activeView) {
            setisSidebarOpen(!isSidebarOpen)
        } else {
            setisSidebarOpen(true)
            setactiveView(viewName)
        }
    };

    const { isNewMsg } = useChatRoom();

    return (
        <div className="relative flex items-center flex-col">
        <button
            onClick={() => handleViewClick(viewName)}
            onMouseEnter={() => setShowTooltip(true)} // Show tooltip again on hover
            className={`${buttonStyles.base} ${buttonStyles.hover} ${viewName === activeView ? "border-4 border-gray-800" : ""}`}
            {...(showTooltip && {
                'data-tooltip-id': `tooltip-${viewName}`,
                'data-tooltip-content': viewName
            })}
        >
            <div className="flex items-center justify-center">
                {icon}
            </div>
            {/* Show dot for new message in chat View Button */}
            {viewName === VIEW.CHATS && isNewMsg  && (
                <div className="absolute right-1 top-0 h-2 w-2 rounded-full bg-black"></div>
            )}
        </button>
        {/* render the tooltip */}
        {showTooltip && (
                <Tooltip 
                    id={`tooltip-${viewName}`}
                    place="right"
                    offset={25}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                />
            )}
        </div>
    )
}
export default SidebarButton;