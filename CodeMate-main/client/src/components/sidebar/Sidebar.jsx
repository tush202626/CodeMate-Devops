import { useAppContext } from "../../context/AppContext";
import SidebarHeader from "./SidebarHeader";
import { useViews } from "../../context/ViewContext";
import { useSocket } from "../../context/SocketContext";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { SocketEvent } from "../../types/socket";
import VIEW from "../../types/view";
import { IoCodeSlash } from "react-icons/io5"
import { MdOutlineDraw } from "react-icons/md"
import SidebarButton from "./sidebar-views/SidebarButton";
import ACTIVITY_STATE from "../../types/activityState";
import { tooltipStyles } from "./sidebar-views/tootipsStyle";
const Sidebar = () => {

    const { activityState, setActivityState } = useAppContext();
    const {
        isSidebarOpen,
        setisSidebarOpen,
        viewComponents,
        viewIcons,
        activeView,
    } = useViews();
    const { socket } = useSocket();
    const [showTooltip, setShowTooltip] = useState(true)

    const changeState = () => {
        setShowTooltip(false)
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING)
            socket.emit(SocketEvent.REQUEST_DRAWING)
        } else {
            setActivityState(ACTIVITY_STATE.CODING)
        }
    }
    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto ">
            <div
                className={
                    `fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-8 self-end overflow-hidden border-t bg-dark p-2 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4 rounded`

                }>
                <SidebarButton
                    viewName={VIEW.FILES}
                    icon={viewIcons[VIEW.FILES]}
                />
                <SidebarButton
                    viewName={VIEW.CHATS}
                    icon={viewIcons[VIEW.CHATS]}
                />
                <SidebarButton
                    viewName={VIEW.RUN}
                    icon={viewIcons[VIEW.RUN]}
                />
                <SidebarButton
                    viewName={VIEW.CLIENTS}
                    icon={viewIcons[VIEW.CLIENTS]}
                />

                {/* Button to change activity state coding or drawing */}
                {/* <div className="flex items-center justify-center h-fit">
                    <button className="flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:border-4 hover:border-gray-800 p-1.5"
                        onClick={changeState}
                        onMouseEnter={() => setShowTooltip(true)}
                        data-tooltip-id="activity-state-tooltip"
                        data-tooltip-content={
                            activityState === ACTIVITY_STATE.CODING
                                ? "Switch to Drawing Mode"
                                : "Switch to Coding Mode"
                        }>
                        {activityState === ACTIVITY_STATE.CODING ? (
                            <MdOutlineDraw size={40} />
                        ) : (
                            <IoCodeSlash size={40} />
                        )}
                    </button>
                    {showTooltip && (
                        <Tooltip
                            id="activity-state-tooltip"
                            place="right"
                            offset={15}
                            className="!z-50"
                            style={tooltipStyles}
                            noArrow={false}
                            positionStrategy="fixed"
                            float={true}
                        />
                    )}
                </div> */}
            </div>
            <div
                className={`absolute left-0 top-0 w-full flex-col bg-dark md:static md:min-w-[300px] m-1 border-black border- 
        transition-all duration-700 ease-in-out ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                    }`}
            >
                {/* Render the active view component */}
                {viewComponents[activeView]}
            </div>

        </aside>
    )
};

export default Sidebar;
