// import { useAppContext } from "../context/AppContext";
// import { useSocket } from "../context/SocketContext";
// import { SocketEvent } from "../types/socket";
// import { USER_STATUS } from "../types/user";
// import { useEffect, useRef } from "react";
// import { toast } from "react-hot-toast";
// import { useLocation, useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import logo from "../assets/logo3.svg";

// const FormComponent = () => {
//     const location = useLocation();
//     const { currentUser, setCurrentUser, status, setStatus, users } = useAppContext();
//     const { socket } = useSocket();
//     const usernameRef = useRef(null);
//     const navigate = useNavigate();

//     const createNewRoomId = () => {
//         const newRoomId = uuidv4();
//         setCurrentUser((prevUser) => ({ ...prevUser, roomId: newRoomId }));
//         toast.success("Created a new Room Id");
//         usernameRef.current?.focus();
//     };

//     const handleInputChanges = (e) => {
//         const { name, value } = e.target;
//         setCurrentUser((prevUser) => ({ ...prevUser, [name]: value }));
//     };

//     const validateForm = () => {
//         if (currentUser.username.trim().length < 3) {
//             toast.error("Username must be at least 3 characters long");
//             return false;
//         }
//         if (currentUser.roomId.trim().length < 5) {
//             toast.error("Room ID must be at least 5 characters long");
//             return false;
//         }
//         return true;
//     };

//     const joinRoom = (e) => {
//         e.preventDefault();
//         if (status === USER_STATUS.ATTEMPTING_JOIN) return;
//         if (!validateForm()) return;

//         toast.loading("Joining room...");
//         setStatus(USER_STATUS.ATTEMPTING_JOIN);
//         socket.emit(SocketEvent.JOIN_REQUEST, currentUser);
//         toast.dismiss();
//     };

//     useEffect(() => {
//         if (!currentUser.roomId && location.state?.roomId) {
//             setCurrentUser({ ...currentUser, roomId: location.state.roomId });
//             toast.success("Enter your username");
//         }
//     }, [currentUser, location.state?.roomId, setCurrentUser]);

//     useEffect(() => {
//         if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
//             socket.connect();
//             return;
//         }

//         const isRedirect = sessionStorage.getItem("redirect");

//         if (status === USER_STATUS.JOINED && !isRedirect) {
//             sessionStorage.setItem("redirect", "true");
//             navigate(`/editor/${currentUser.roomId}`, {
//                 state: { username: currentUser.username },
//             });
//         } else if (status === USER_STATUS.JOINED && isRedirect) {
//             sessionStorage.removeItem("redirect");
//             setStatus(USER_STATUS.DISCONNECTED);
//             socket.disconnect();
//             socket.connect();
//         }
//     }, [currentUser, navigate, setStatus, socket, status]);

//     return (
//         <div className="flex min-h-screen w-full items-center justify-center px-4">
//   <div className="w-full max-w-md flex flex-col items-center gap-6 rounded-2xl bg-gray-900 p-8 shadow-2xl sm:w-[500px]">
    
//     {/* Heading */}
//     <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Join a Room</h2>
//     <p className="text-gray-300 text-center text-sm sm:text-base">
//       Enter a Room ID and username to start collaborating in real-time.
//     </p>

//     {/* Form */}
//     <form onSubmit={joinRoom} className="w-full flex flex-col gap-4">
//       <input
//         type="text"
//         name="roomId"
//         placeholder="Enter Room ID"
//         className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         onChange={handleInputChanges}
//         value={currentUser.roomId}
//       />
//       <input
//         type="text"
//         name="username"
//         placeholder="Enter Username"
//         className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         onChange={handleInputChanges}
//         value={currentUser.username}
//         ref={usernameRef}
//       />
//       <button
//         type="submit"
//         className="mt-2 w-full rounded-lg bg-blue-600 text-white px-6 py-3 text-lg font-semibold transition duration-300 hover:bg-blue-500 active:scale-95"
//       >
//         Join Room
//       </button>
//     </form>

//     {/* Generate Room ID Button */}
//     <button
//       className="text-sm font-semibold text-blue-400 underline transition duration-300 hover:text-blue-300"
//       onClick={createNewRoomId}
//     >
//       Generate Unique Room ID
//     </button>
//   </div>
// </div>

//       );
// };

// export default FormComponent;

"use client"

import { useAppContext } from "../context/AppContext"
import { useSocket } from "../context/SocketContext"
import { SocketEvent } from "../types/socket"
import { USER_STATUS } from "../types/user"
import { useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { ArrowRight, RefreshCw, Users } from "lucide-react"

const FormComponent = () => {
  const location = useLocation()
  const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
  const { socket } = useSocket()
  const usernameRef = useRef(null)
  const navigate = useNavigate()

  const createNewRoomId = () => {
    const newRoomId = uuidv4()
    setCurrentUser((prevUser) => ({ ...prevUser, roomId: newRoomId }))
    toast.success("Created a new Room ID")
    usernameRef.current?.focus()
  }

  const handleInputChanges = (e) => {
    const { name, value } = e.target
    setCurrentUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  const validateForm = () => {
    if (currentUser.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long")
      return false
    }
    if (currentUser.roomId.trim().length < 5) {
      toast.error("Room ID must be at least 5 characters long")
      return false
    }
    return true
  }

  const joinRoom = (e) => {
    e.preventDefault()
    if (status === USER_STATUS.ATTEMPTING_JOIN) return
    if (!validateForm()) return

    toast.loading("Joining room...")
    setStatus(USER_STATUS.ATTEMPTING_JOIN)
    socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    toast.dismiss()
  }

  useEffect(() => {
    if (!currentUser.roomId && location.state?.roomId) {
      setCurrentUser({ ...currentUser, roomId: location.state.roomId })
      toast.success("Enter your username")
    }
  }, [currentUser, location.state?.roomId, setCurrentUser])

  useEffect(() => {
    if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
      socket.connect()
      return
    }

    const isRedirect = sessionStorage.getItem("redirect")

    if (status === USER_STATUS.JOINED && !isRedirect) {
      sessionStorage.setItem("redirect", "true")
      navigate(`/editor/${currentUser.roomId}`, {
        state: { username: currentUser.username },
      })
    } else if (status === USER_STATUS.JOINED && isRedirect) {
      sessionStorage.removeItem("redirect")
      setStatus(USER_STATUS.DISCONNECTED)
      socket.disconnect()
      socket.connect()
    }
  }, [currentUser, navigate, setStatus, socket, status])

  const isJoining = status === USER_STATUS.ATTEMPTING_JOIN

  return (
    <div className="w-full bg-white p-6 rounded-lg">
  <form onSubmit={joinRoom} className="w-full flex flex-col gap-5">
    <div className="space-y-3">
      <div className="relative group">
        <div className="relative">
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-600 mb-1 ml-1">
            Room ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users size={18} className="text-gray-500" />
            </div>
            <input
              id="roomId"
              type="text"
              name="roomId"
              placeholder="Enter Room ID"
              className="w-full pl-10 rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              onChange={handleInputChanges}
              value={currentUser.roomId}
            />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="relative">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1 ml-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter Username"
            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            onChange={handleInputChanges}
            value={currentUser.username}
            ref={usernameRef}
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      disabled={isJoining}
      className={`relative mt-2 w-full rounded-lg bg-black text-white px-6 py-3.5 text-lg font-semibold transition duration-300 hover:bg-black/80 active:scale-[0.98] ${
        isJoining ? "opacity-80 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isJoining ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            <span>Joining...</span>
          </>
        ) : (
          <>
            <span>Join Room</span>
            <ArrowRight size={20} />
          </>
        )}
      </div>
    </button>
  </form>

  <div className="mt-6 flex justify-center">
    <button
      className="flex items-center gap-2 text-sm font-medium text-black transition duration-300 hover:text-gray-700"
      onClick={createNewRoomId}
    >
      <RefreshCw size={16} className="transition-transform duration-500 group-hover:rotate-180" />
      <span className="underline-offset-4 hover:underline">Generate Unique Room ID</span>
    </button>
  </div>
</div>

  )
}

export default FormComponent