"use client";

import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useSocket } from "../../../context/SocketContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Copy, Share, LogOut } from "lucide-react";
import Users from "../../common/Users";
import { USER_STATUS } from "../../../types/user";
// import { useAppContext } from "../../../context/AppContext";

const UserView = () => {
  const { setStatus, room } = useAppContext();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(null);

  const copy = async () => {
    const url = room._id;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Room ID copied to clipboard", {
        style: {
          border: "1px solid #000",
          padding: "16px",
          color: "#000",
          backgroundColor: "#fff",
        },
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },
      });
    } catch (err) {
      toast.error("Could not copy URL");
      console.log(err);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.share({ url });
    } catch (err) {
      toast.error("Could not share URL");
      console.log(err);
    }
  };

  const leave = () => {
    socket.disconnect();
    setStatus(USER_STATUS.DISCONNECTED);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="w-full h-full bg-white text-gray-900 shadow-lg  border-black border-4 rounded-3xl flex flex-col transition-all duration-300 overflow-hidden">
      <h1 className="text-2xl font-semibold text-black my-6 text-center tracking-tight">
        Connected Users
      </h1>

      {/* Scrollable Users Container */}
      <div className="flex-1 w-full max-w-lg md:max-w-xl mx-auto overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Users />
      </div>

      {/* Fixed Buttons at Bottom */}
      <div className="flex gap-6 p-6 justify-center w-full bg-gray-50 border-t border-gray-200 mt-4">
        <button
          onClick={leave}
          onMouseEnter={() => setIsHovering("leave")}
          onMouseLeave={() => setIsHovering(null)}
          title="Leave room"
          className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-200 shadow-sm"
        >
          <LogOut
            className={`w-5 h-5 ${isHovering === "leave" ? "scale-110" : "scale-100"} transition-transform duration-200`}
          />
          <span className="sr-only">Leave room</span>
        </button>

        <button
          onClick={share}
          onMouseEnter={() => setIsHovering("share")}
          onMouseLeave={() => setIsHovering(null)}
          title="Share URL"
          className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-200 shadow-sm"
        >
          <Share
            className={`w-5 h-5 ${isHovering === "share" ? "scale-110" : "scale-100"} transition-transform duration-200`}
          />
          <span className="sr-only">Share URL</span>
        </button>

        <button
          onClick={copy}
          onMouseEnter={() => setIsHovering("copy")}
          onMouseLeave={() => setIsHovering(null)}
          title="Copy URL"
          className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-200 shadow-sm"
        >
          <Copy
            className={`w-5 h-5 ${isHovering === "copy" ? "scale-110" : "scale-100"} transition-transform duration-200`}
          />
          <span className="sr-only">Copy URL</span>
        </button>
      </div>
    </div>
  );
};

export default UserView;
