import React, { useRef } from "react";
import { FaFolderOpen, FaDownload } from "react-icons/fa";
import CreateFile from "../../../filesystem/CreateFile";
import FileList from "../../../filesystem/FileList";
import { useFileSystem } from "../../../context/FileContext";

const FilesView = () => {
  const { downloadFiles, openFilesFromStorage } = useFileSystem();

  return (
    <div className="w-full h-full bg-white text-gray-900 shadow-md border-x-4 border-y-4 border-black rounded-3xl flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300 rounded-t-2xl">
        <h2 className="text-2xl font-semibold">Files</h2>
        <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          <CreateFile />
        </button>
      </div>

      {/* File List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 w-full"> 
        <FileList />
      </div>

      {/* Footer Options */}
      <div className="border-t border-gray-300 p-4 flex flex-col space-y-2 rounded-b-2xl">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900" onClick={openFilesFromStorage}>
          <FaFolderOpen />
          <span>Open File</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900" onClick={downloadFiles}>
          <FaDownload />
          <span>Download Code</span>
        </button>
      </div>

      
    </div>
  );
};

export default FilesView;
