"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, X, Check } from "lucide-react";
import { useState, useEffect } from "react";

export const CodeEditor = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "User1 joined the room", type: "success" },
    { id: 2, text: "URL copied to clipboard", type: "info" },
  ]);
  const [showFullScreen, setShowFullScreen] = useState(false);

  useEffect(() => {
    // Simulate notifications
    const timer1 = setTimeout(() => {
      addNotification("User1 joined the room", "success");
    }, 2000);

    const timer2 = setTimeout(() => {
      addNotification("URL copied to clipboard", "info");
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const addNotification = (text, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <div className="flex h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-xl">
      {/* Left Sidebar */}
      <div className="w-64 bg-white text-black border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Connected Users</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
              a
            </div>
            <div>
              <p className="font-medium">admin (You)</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div>
              <p className="font-medium">User1</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Users className="w-5 h-5" />
            </motion.div>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Copy className="w-5 h-5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 relative bg-[#1E1E1E]">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF605C]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD44]"></div>
            <div className="w-3 h-3 rounded-full bg-[#00CA4E]"></div>
            <span className="ml-2 text-white/60 text-sm">index.cpp</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFullScreen(true)}
              className="px-2 py-1 text-xs text-white/60 border border-white/20 rounded hover:bg-white/5"
            >
              To exit full screen, press and hold <span className="px-1 py-0.5 bg-white/10 rounded">Esc</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 font-mono text-sm">
          <div className="flex">
            <div className="text-gray-500 w-8 text-right pr-4 select-none">1</div>
            <div className="text-white">
              <span className="text-[#569CD6]">#include</span> <span className="text-[#CE9178]">&lt;iostream&gt;</span>
            </div>
          </div>
          <div className="flex">
            <div className="text-gray-500 w-8 text-right pr-4 select-none">2</div>
            <div className="text-white">
              <span className="text-[#569CD6]">int</span> <span className="text-[#DCDCAA]">main</span>() {"{"}{" "}
              <span className="text-[#569CD6]">std</span>::cout &lt;&lt;
              <span className="text-[#CE9178]">" "Hello, World!"</span>; <span className="text-[#C586C0]">return</span>{" "}
              0; {"}"}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, x: "50%", scale: 0.9 }}
              animate={{ opacity: 1, y: 20, x: "50%", scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`fixed top-0 right-0 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === "success"
                  ? "bg-white text-black border border-gray-200"
                  : "bg-white text-black border border-gray-200"
              }`}
            >
              {notification.type === "success" && <Check className="w-4 h-4 text-green-500" />}
              <span>{notification.text}</span>
              <button
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
                className="hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
