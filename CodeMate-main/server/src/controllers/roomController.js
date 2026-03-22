const { Room, File, Message } = require('../models/Room');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const { owner, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: 'Invalid owner ID' });
    }
    const validOwnerId = new mongoose.Types.ObjectId(owner);

    const ownerExists = await User.findById(validOwnerId);
    if (!ownerExists) {
      return res.status(404).json({ message: 'Owner does not exist' });
    }

    const name = "index.cpp";
    const content = "#include <iostream>\nint main() { std::cout << \"Hello, World!\"; return 0; }";
    const newFile = new File({ name, content });

    const room = new Room({ owner: validOwnerId, title, files: [newFile] });
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (err) {
    res.status(500).json({ message: 'Error creating room', error: err.message });
  }
};

// Get Rooms by Username
exports.getRoomsByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rooms = await Room.find({ owner: user._id });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms', error: err.message });
  }
};

// Get Room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Room ID" });
    }

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching room', error: err.message });
  }
};

// Add File to Room
exports.addFileToRoom = async (req, res) => {
  try {
    const { roomId, file } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Invalid Room ID" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isFileInRoom = room.files.some((f) => f.name === file.name);
    if (isFileInRoom) {
      return res.status(400).json({ message: 'File with same name already exists' });
    }

    const newFile = new File({ name: file.name, content: file.content });
    await newFile.save();

    room.files.push(newFile);
    await room.save();

    res.status(200).json({ message: 'File added to room', file: newFile });
  } catch (err) {
    res.status(500).json({ message: 'Error adding file to room', error: err.message });
  }
};

// Update File Name
exports.updateFile = async (req, res) => {
  try {
    const { roomId, fileId, newFileName } = req.body;

    if (!newFileName || typeof newFileName !== 'string') {
      return res.status(400).json({ message: 'New file name is required and must be a string' });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid Room ID or File ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const fileIndex = room.files.findIndex(file => file._id.equals(fileId));
    if (fileIndex === -1) return res.status(404).json({ message: 'File not found' });

    const isDuplicate = room.files.some((f, idx) => f.name === newFileName && idx !== fileIndex);
    if (isDuplicate) {
      return res.status(400).json({ message: 'Another file with the same name already exists' });
    }

    room.files[fileIndex].name = newFileName;
    await room.save();

    res.status(200).json({ message: 'File name updated successfully', file: room.files[fileIndex] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating file name', error: err.message });
  }
};

// Add Message to Room
exports.addMessagetoRoom = async (req, res) => {
  try {
    const { roomId, message, user } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: 'Invalid Room ID or User ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const userObj = await User.findById(user);
    if (!userObj) return res.status(404).json({ message: 'User not found' });

    const newMessage = new Message({ user: userObj._id, message });
    await newMessage.save();

    room.messages.push(newMessage);
    await room.save();

    res.status(200).json({ message: 'Message added to room', room });
  } catch (err) {
    res.status(500).json({ message: 'Error adding message to room', error: err.message });
  }
};

// Update File Code
exports.updateFileCode = async (req, res) => {
  try {
    const { roomId, fileId, code } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid Room ID or File ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const fileIndex = room.files.findIndex(file => file._id.equals(fileId));
    if (fileIndex === -1) return res.status(404).json({ message: 'File not found' });

    room.files[fileIndex].content = code;
    await room.save();

    res.status(200).json({ message: 'File code updated successfully', file: room.files[fileIndex] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating code', error: err.message });
  }
};

// Delete File from Room
exports.deleteFile = async (req, res) => {
  try {
    const { roomId, fileId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid Room ID or File ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const fileIndex = room.files.findIndex(file => file._id.equals(fileId));
    if (fileIndex === -1) return res.status(404).json({ message: 'File not found' });

    room.files.splice(fileIndex, 1);
    await room.save();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting file', error: err.message });
  }
};
