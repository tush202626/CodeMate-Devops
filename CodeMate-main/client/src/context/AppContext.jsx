import { createContext, useContext, useEffect, useState } from "react";
import { USER_STATUS } from "../types/user";
import ACTIVITY_STATE from "../types/activityState";
// import AuthService from "../services/authService";
// import RoomService from "../services/roomService";
// import UserService from "../services/userService";

const initialData = {
  elements: [
    {
      id: "rectangle1",
      type: "rectangle",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      strokeColor: "#000000",
      backgroundColor: "#ffffff",
      isDeleted: false,
    },
    {
      id: "text1",
      type: "text",
      x: 150,
      y: 120,
      text: "Hello, Excalidraw!",
      fontSize: 20,
      isDeleted: false,
    },
  ],
};

// Default context values
// const defaultContextValues = {
//   users: [],
//   setUsers: () => {},
//   currentUser: { username: "", roomId: "" },
//   setCurrentUser: () => {},
//   status: USER_STATUS.INITIAL,
//   setStatus: () => {},
//   activityState: ACTIVITY_STATE.IDLE,
//   setActivityState: () => {},
//   drawingData: initialData,
//   setDrawingData: () => {},
// };

const AppContext = createContext(null);

// Custom Hook
export const useAppContext = () => {
  return useContext(AppContext);
};

// App Provider Component
const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  // const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState(USER_STATUS.INITIAL);
  const [drawingData, setDrawingData] = useState(initialData);
  const [activityState, setActivityState] = useState(ACTIVITY_STATE.IDLE);
  const [room, setRoom] = useState();
  // const authService = new AuthService();
  // const userService = new UserService();
  // const roomService = new RoomService();
  // const token = authService.getToken();

  // useEffect(() => {
  //   (async () => {
  //     if(token){
  //       const { username } = authService.getUserData();

  //       const userData = await userService.getUser(username);

  //       if(userData.success)
  //         setCurrentUser(userData.user);
        
  //       // const roomData = await roomService.getRoomsByUsername(username);

  //       // if(roomData.success)
  //       //     setRooms(roomData.rooms);
  //     }
  //   })();

  // }, [token]);


  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        room,
        setRoom,
        status,
        setStatus,
        activityState,
        setActivityState,
        drawingData,
        setDrawingData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
export default AppContext;
