import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Code2 } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { USER_STATUS } from '../../types/user';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const authService = new AuthService();
  const navigate = useNavigate();
  const token = authService.getToken();
  const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const { username } = tokenData || {};
  const { socket } = useSocket();
  const { setStatus } = useAppContext();

  const handleLogout = () => {
    if(socket.connected)
    {
      setStatus(USER_STATUS.DISCONNECTED);
      socket.disconnect();
    }

    authService.logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-950 shadow-lg py-4 z-20 relative">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-extrabold text-gray-800">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-black" />
            <span className="text-xl font-bold text-gray-900">CodeMate</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{`(${username})`}</span>
          <button
            onClick={handleLogout}
            className="bg-black hover:bg-black/80 text-white px-4 py-2 rounded-3xl"
          >
            Logout  
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
