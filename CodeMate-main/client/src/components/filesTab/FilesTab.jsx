import { useState, useRef, useEffect } from "react";
import { FaTimes, FaPlus, FaGripVertical, FaChevronLeft, FaChevronRight, FaFileCode, FaFile, FaFileAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useFileSystem } from "../../context/FileContext";
import {
   FaJs, FaHtml5, FaCss3Alt, FaPython, FaJava, FaFilePdf, FaFileWord, FaFileExcel,
} from "react-icons/fa";
const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

  const icons = {
    js: <FaJs className="text-yellow-500" />,
    html: <FaHtml5 className="text-orange-600" />,
    css: <FaCss3Alt className="text-blue-500" />,
    py: <FaPython className="text-blue-400" />,
    java: <FaJava className="text-red-500" />,
    cpp: <FaFileCode className="text-indigo-500" />,
    c: <FaFileCode className="text-indigo-500" />,
    txt: <FaFileAlt className="text-gray-500" />,
    pdf: <FaFilePdf className="text-red-600" />,
    doc: <FaFileWord className="text-blue-600" />,
    docx: <FaFileWord className="text-blue-600" />,
    xls: <FaFileExcel className="text-green-600" />,
    xlsx: <FaFileExcel className="text-green-600" />,
    default: <FaFileAlt className="text-gray-500" />,
  };

  return icons[ext] || icons["default"];
};

export default function FilesTab() {
  const { openFiles, setActiveFile, setOpenFiles, activeFile } = useFileSystem();
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [activeFileId, setActiveFileId] = useState(activeFile?._id || null);
  const scrollContainerRef = useRef(null);
  const [draggedFileId, setDraggedFileId] = useState(null);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    setActiveFileId(activeFile?._id || null);
  }, [activeFile]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const closeFile = (fileId, event) => {
    event?.stopPropagation();
    const newFiles = openFiles.filter((file) => file._id !== fileId);
    setOpenFiles(newFiles);

    if (activeFileId === fileId && newFiles.length > 0) {
      setActiveFile(newFiles[0]);
    } else if (newFiles.length === 0) {
      setActiveFile(null);
    }
  };

  const handleDragStart = (e, fileId) => {
    setDraggedFileId(fileId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetFileId) => {
    e.preventDefault();
    if (!draggedFileId) return;

    const draggedIndex = openFiles.findIndex((file) => file._id === draggedFileId);
    const targetIndex = openFiles.findIndex((file) => file._id === targetFileId);

    if (draggedIndex === targetIndex) return;

    const newFiles = [...openFiles];
    const [draggedFile] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedFile);

    setOpenFiles(newFiles);
  };
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-lg overflow-hidden m-2">
      <div className="relative flex items-center">
        {showScrollButtons && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 z-10 h-full px-1 bg-gradient-to-r from-gray-900 to-transparent"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar"  // Add no-scrollbar class here to hide scrollbar
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex space-x-1 p-2 min-w-max">
            <AnimatePresence initial={false}>
              {openFiles.map((file) => (
                <motion.div
                  key={file._id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, file._id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, file._id)}
                  onClick={() => {
                    setActiveFile(file)
                  }}
                  className={`group flex items-center px-3 py-2 cursor-pointer select-none transition-all duration-200 ease-in-out rounded-t-lg border-t border-l border-r border-transparent hover:border-gray-700 hover:bg-gray-800 ${
                    activeFileId === file._id
                      ? "bg-gray-800 text-white border-gray-700 border-b-transparent"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.name)}
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <button
                    onClick={(e) => closeFile(file._id, e)}
                    className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700"
                    title="Close file"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {showScrollButtons && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 z-10 h-full px-1 bg-gradient-to-l from-gray-800 to-transparent"
          >
            <FaChevronRight className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}
