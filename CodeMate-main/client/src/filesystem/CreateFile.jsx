import React, { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { useFileSystem } from "../context/FileContext";

const CreateFile = () => {
  const [fileName, setFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createFile } = useFileSystem();
  const inputRef = useRef(null);

  // Open modal and focus input
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Close modal
  const handleCloseModal = () => setIsModalOpen(false);

  // Create file and close modal
  const handleCreateFile = () => {
    if (!fileName.trim()) return;
    createFile(fileName.trim());
    setFileName("");
    setIsModalOpen(false);
  };

  // Handle Enter key for quick file creation
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreateFile();
    if (e.key === "Escape") handleCloseModal();
  };

  return (
    <div>
      {/* Create File Button (Icon Only) */}
      <button
        onClick={handleOpenModal}
        className="p-2 text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded"
      >
        <FaPlus size={18} />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Create New File</h2>
            <input
              ref={inputRef}
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter file name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFile;
