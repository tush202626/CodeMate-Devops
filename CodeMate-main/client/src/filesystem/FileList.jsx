import React, { useState, useEffect } from "react";
import { useFileSystem } from "../context/FileContext";
import {
  FaFileAlt, FaJs, FaHtml5, FaCss3Alt, FaPython, FaJava, FaFileCode, FaFilePdf, FaFileWord, FaFileExcel,
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
const FileList = () => {
  const { files, setActiveFile, setOpenFiles, renameFile, deleteFile } = useFileSystem();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, fileId: null });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleContextMenu = (e, fileId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      fileId,
    });
  };

  const handleRename = (fileId) => {
    const newName = prompt("Enter new file name:");
    if (newName) {
      renameFile(fileId, newName);
    }
    setContextMenu({ visible: false });
  };

  const handleDeleteClick = (fileId) => {
    setFileToDelete(fileId);
    setDeleteModalVisible(true);
    setContextMenu({ visible: false });
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete);
      setFileToDelete(null);
      setDeleteModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setFileToDelete(null);
    setDeleteModalVisible(false);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false });
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="h-screen w-full bg-gray-100 shadow-lg border-r">
      {/* <h2 className="px-4 py-3 text-lg font-semibold text-gray-800 border-b">Explorer</h2> */}
      <ul className="py-2 max-h-[calc(100vh-100px)] overflow-y-auto">
        {files.map((file) => (
          <li
            key={file._id}
            onClick={() => {
              setActiveFile(file);
              setOpenFiles((prevFiles) =>
                prevFiles.some((openFile) => openFile._id === file._id)
                  ? prevFiles
                  : [...prevFiles, file]
              );
            }}
            onContextMenu={(e) => handleContextMenu(e, file._id)}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
          >
            {getFileIcon(file.name)}
            <span className="ml-2 text-sm">{file.name}</span>
          </li>
        ))}
      </ul>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white shadow-md rounded-md py-1 border border-gray-200 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x, minWidth: "150px" }}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleRename(contextMenu.fileId)}
          >
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            onClick={() => handleDeleteClick(contextMenu.fileId)}
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this file?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
