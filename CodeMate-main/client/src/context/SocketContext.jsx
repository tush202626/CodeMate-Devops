import { SocketEvent , SocketContext as SocketContextType} from "../types/socket";
import { createRemoteUser , createUser , USER_STATUS } from "../types/user";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react"
import { toast } from "react-hot-toast" 
import { io } from "socket.io-client"
import { useAppContext } from "./AppContext"
import UserService from "../services/userService";

const SocketContext = createContext(SocketContextType)

export const useSocket = () => {
    const context = useContext(SocketContext)
    if(!context)
        {
            throw new console.error("useSocketContext must be used within a Socketprovider");
            
        }
        return context;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SocketProvider = ({children}) =>{
    const {
        users,
        setUsers,
        setStatus,
        setCurrentUser,
        // drawingData,
        // setDrawingData,
    } = useAppContext()
    
    const userService = new UserService();

    const socket = useMemo(
        () => 
            io(BACKEND_URL ,{
                autoConnect: false,
                reconnectionAttempts : 1,
            }),
            []  
    )

    const handleError = useCallback(
        (err) => {
            console.log("socket error", err)
            setStatus(USER_STATUS.CONNECTION_FAILED)
            toast.dismiss()
            toast.error("Failed to connect to the server")
        },
        [setStatus],
    )

    const handleUsernameExist = useCallback(() => {
        toast.dismiss()
        setStatus(USER_STATUS.INITIAL)
        toast.error(
            "The username you chose already exists in the room. Please choose a different username.",
        )
    }, [setStatus])

    const handleJoiningAccept = useCallback(
        async ({ user, users }) => {
            
            const data = await userService.getUser(user.username);



            if(data.success)
            {
                setCurrentUser(data.user);
                setUsers(users);
                // toast.dismiss()
                setStatus(USER_STATUS.JOINED);
            }


            // if (users.length > 1) {
            //     toast.loading("Syncing data, please wait...")
            // } 
        },
        [setCurrentUser, setStatus, setUsers],
    )

    const handleUserLeft = useCallback(
        ({ user }) => {
            toast.success(`${user.username} left the room`)
            setUsers(users.filter((u) => u.username !== user.username))
        },
        [setUsers, users],
    )

    // const handleUserJoined = useCallback(
    //     ({ user, users }) => {
    //         setUsers(users);
    //         toast.success(`${user.username} joined the room`)
    //     },
    //     [setUsers],
    // )

    useEffect(() => {
        socket.on(SocketEvent.CONNECTTION_ERROR, handleError)
        socket.on(SocketEvent.CONNECTTION_FAILED, handleError)
        socket.on(SocketEvent.USERNAME_EXISTS, handleUsernameExist)
        socket.on(SocketEvent.JOIN_ACCEPTED, handleJoiningAccept)
        socket.on(SocketEvent.USER_DISCONNECTED, handleUserLeft)
        // socket.on(SocketEvent.USER_JOINED, handleUserJoined)
        // socket.on(SocketEvent.REQUEST_DRAWING, handleRequestDrawing)
        // socket.on(SocketEvent.SYNC_DRAWING, handleDrawingSync)

        return () => {
            socket.off(SocketEvent.CONNECTTION_ERROR)
            socket.off(SocketEvent.CONNECTTION_FAILED)
            socket.off(SocketEvent.USERNAME_EXISTS)
            socket.off(SocketEvent.JOIN_ACCEPTED)
            // socket.off(SocketEvent.USER_JOINED)
            socket.off(SocketEvent.USER_DISCONNECTED)
            // socket.off(SocketEvent.REQUEST_DRAWING)
            // socket.off(SocketEvent.SYNC_DRAWING)
        }
    }, [
        // handleDrawingSync,
        handleError,
        handleJoiningAccept,
        // handleRequestDrawing,
        handleUserLeft,
        handleUsernameExist,
        // handleUserJoined,
        setUsers,
        socket,
    ])
    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}
export { SocketProvider }
export default SocketContext