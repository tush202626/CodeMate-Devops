import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import RoomService from '../../services/roomService';
import AuthService from '../../services/authService';
import UserService from '../../services/userService';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext'; 
import { USER_STATUS } from '../../types/user';
import { SocketEvent } from '../../types/socket';
import { Loader } from 'lucide-react'; // 👈 Lucide Loader Icon

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [loading, setLoading] = useState(false); // 👈 Loading state
  const [loadingRooms, setLoadingRooms] = useState(true); // 👈 Room fetch loader

  const navigate = useNavigate();
  const { socket } = useSocket();
  const { status, setStatus, currentUser, setCurrentUser } = useAppContext();

  const authService = new AuthService();
  const roomService = new RoomService();
  const userService = new UserService();
  const { id, name, username } = authService.getUserData();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const roomsData = await roomService.getRoomsByUsername(username);
      if (!roomsData.success) toast.error(roomsData.message);
      else setRooms(roomsData.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if ((status === USER_STATUS.DISCONNECTED || status === USER_STATUS.INITIAL) && !socket.connected) {
      // console.log("user status new");
      socket.connect();
      return;
    }

    if (status === USER_STATUS.JOINED) {
      navigate(`/editor/${joinRoomId}`, {
        state: { username: currentUser.username },
      });
    }
  }, [setStatus, socket, status]);

  useEffect(() => {
    (async () => {
      const token = authService.getToken();
      if (token) {
        const { username } = authService.getUserData();
        const userData = await userService.getUser(username);
        if (userData.success) setCurrentUser(userData.user);
      }
    })();
  }, []);

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      const response = await roomService.createRoom(id, roomTitle);
      if (response.success) {
        setRooms([...rooms, response.room]);
        setShowCreateModal(false);
        setRoomTitle('');
        if (status === USER_STATUS.ATTEMPTING_JOIN) return;

        const data = {
          username: currentUser.username,
          roomId: response.room._id,
        };

        setJoinRoomId(response.room._id);
        toast.loading('Joining room...');
        setStatus(USER_STATUS.ATTEMPTING_JOIN);
        socket.emit(SocketEvent.JOIN_REQUEST, data);
        toast.dismiss();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    try {
      
      if (status === USER_STATUS.ATTEMPTING_JOIN) return;
      
      setLoading(true);

      const roomData = await roomService.getRoomById(joinRoomId);

      if(roomData.success)
      {
        const data = {
          username: currentUser.username,
          roomId: joinRoomId,
        };
        setJoinRoomId(joinRoomId);
        toast.loading('Joining room...');
        setStatus(USER_STATUS.ATTEMPTING_JOIN);
        socket.emit(SocketEvent.JOIN_REQUEST, data);
        toast.dismiss();
      }
      else
      {
        toast.error(roomData.message);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (roomId) => {
    if (status === USER_STATUS.ATTEMPTING_JOIN) return;

    setLoading(true);

    const roomData = await roomService.getRoomById(roomId);
    // console.log("roomdata: ", roomData);
    if(roomData.success)
    {
      const data = {
        username: currentUser.username,
        roomId: roomId,
      };
      setJoinRoomId(roomId);
      toast.loading('Joining room...');
      setStatus(USER_STATUS.ATTEMPTING_JOIN);
      socket.emit(SocketEvent.JOIN_REQUEST, data);
      toast.dismiss();
      setLoading(false);
    }
    else
    {
      toast.error(roomData.message);
      setLoading(false);
    }

  };

  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* Floating Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gray-200 opacity-60 animate-float-slow"></div>
        <div className="absolute top-1/4 -right-12 w-36 h-36 rounded-full bg-gray-300 opacity-50 animate-float"></div>
        <div className="absolute bottom-1/3 -left-16 w-48 h-48 rounded-full bg-gray-400 opacity-40 animate-float-reverse"></div>
      </div>

      <Navbar />

      {/* Full screen loader */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 z-30 flex justify-center items-center">
          <Loader className="w-10 h-10 text-black animate-spin" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome back, {name} 👋</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-xl shadow-md"
            >
              + Create Room
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-xl shadow-md"
            >
              🔗 Join Room
            </button>
          </div>
        </div>

        {/* Room Cards */}
        {loadingRooms ? (
          <div className="flex justify-center mt-20">
            <Loader className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            You haven't created any rooms yet. Start by creating one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">{room.title}</h2>
                <p className="text-gray-600 mb-4">
                  Created: {new Date(room.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleJoin(room._id)}
                  className="bg-black hover:bg-black/80 text-white w-full py-2 rounded-xl shadow-lg"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Create New Room</h2>
              <input
                type="text"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                placeholder="Enter room title"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Join Room</h2>
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
              <input
                type="text"
                value={`Username - ${username}`}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                disabled="true"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinRoom}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;