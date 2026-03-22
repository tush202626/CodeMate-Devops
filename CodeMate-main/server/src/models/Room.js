const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true }
});

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: { type: String, required: true},
  files: [fileSchema],
  createdAt: { type: Date, default: Date.now },
  messages: [messageSchema],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const File = mongoose.model('File', fileSchema);
const Room = mongoose.model('Room', roomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { File, Room, Message };