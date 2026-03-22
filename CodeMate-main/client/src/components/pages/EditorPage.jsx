import SplitterComponent from "../splitter/SplitterComponent";
import WorkSpace from "../workspace/WorkSpace"
import Sidebar from "../sidebar/Sidebar";
import AuthService from "../../services/authService";
import RoomService from "../../services/roomService";
import { useFileSystem } from "../../context/FileContext";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import useUserActivity from "../../hooks/useUserActivity";
import UserService from "../../services/userService";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import { USER_STATUS } from "../../types/user";
// import { useSocket } from "../../context/SocketContext";
// import { SocketEvent } from "../../types/socket";
// import { useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
function EditorPage() {
    // const navigate = useNavigate();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { socket} = useSocket();

    // const { status, setCurrentUser, currentUser } = useAppContext();
    // const { socket } = useSocket();
    // const location = useLocation();
    const authService = new AuthService();
    const roomService = new RoomService();
    const userService = new UserService(); 
    const { setFiles, setOpenFiles, setActiveFile, activeFile } = useFileSystem();
    const { setRoom, room, users, currentUser, setStatus, status } = useAppContext();
    
    
    // hook to listen user activity events
    useUserActivity();

    
    // useEffect(() => {
    //     if (currentUser.username && currentUser.username.length > 0) return;

    //     // const username = location.state?.username;
    //     // if (!username) {
    //     //     navigate("/homepage", {
    //     //         state: { roomId },
    //     //     });
    //     // } else if (roomId) {
    //     //     const user = { username, roomId };
    //     //     setCurrentUser(user);
    //     //     socket.emit(SocketEvent.JOIN_REQUEST, user);
    //     // }
    // }, [
    //     currentUser.username,
    //     // location.state?.username,
    //     // navigate,
    //     // roomId,
    //     // setCurrentUser,
    //     // socket,
    // ]);

    useEffect(() => {
        if(status !== USER_STATUS.JOINED)
        {
            // setStatus(USER_STATUS.DISCONNECTED);
            // socket.disconnect();
            navigate('/dashboard');
        }
    }, []);
    
    useEffect(()=>{
        (async () => {
            const token = authService.getToken();
            
            if(!token) return;
            

            if(!roomId) return;
            
            const data = await roomService.getRoomById(roomId);
            if(data.success)
            {
                setRoom(data.room);
                if(data.room.files.length > 0)
                {
                    setFiles(data.room.files);
                    setOpenFiles([data.room.files[0]]);
                    setActiveFile(data.room.files[0]); 
                }
                else
                {
                    setFiles([{
                        _id: Date.now.toString(),
                        name: "index.cpp",
                        content: "#include <iostream>\nint main() { std::cout << \"Hello, World!\"; return 0; }"
                    }]);
                    setOpenFiles([{
                        _id: Date.now.toString(),
                        name: "index.cpp",
                        content: "#include <iostream>\nint main() { std::cout << \"Hello, World!\"; return 0; }"
                    }]);
                    setActiveFile({
                        _id: Date.now.toString(),
                        name: "index.cpp",
                        content: "#include <iostream>\nint main() { std::cout << \"Hello, World!\"; return 0; }"
                    });
                }
            }
            else
            {
                toast.error(data.message);
                setStatus(USER_STATUS.DISCONNECTED);
                socket.disconnect();
                navigate('/dashboard');
            }
        })();
    }, []);

    // check if the room owner exits or not in room then only allows orher users to join
    useEffect(() => {
        (async () => {

            const roomData = await roomService.getRoomById(roomId);

            if(!roomData.success)
                return;
            const owner = roomData.room.owner;

            const data = await userService.getUserById(owner);
            if(data.success)
            {
                if(users.length > 0)
                {
                    const user = users.filter((u) => u.username === data.user.username);
                    
                    if(user.length < 1)
                    {
                        toast.error("Room owner is not in room");
                        setStatus(USER_STATUS.DISCONNECTED);
                        socket.disconnect();
                        navigate('/dashboard');
                    }
                }
                else
                {
                    if(currentUser.username != data.user.username)
                    {
                        toast.error("Room owner is not in room");
                        setStatus(USER_STATUS.DISCONNECTED);
                        socket.disconnect();
                        navigate('/dashboard');
                    }
                }
            }
            else
            {

            }

        })();
        
    }, []);

    return (
                <SplitterComponent>
                    <Sidebar />
                    <WorkSpace />
                </SplitterComponent>
    );
}

export default EditorPage;
