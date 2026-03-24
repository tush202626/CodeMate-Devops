require('dotenv').config();

const { SocketEvent, USER_CONNECTION_STATUS } = require('./types');
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const executeCodeRoutes = require("./routes/execute-routes");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let userSocketMap = [];

// SOCKET LOGIC (same as yours)
function getUsersInRoom(roomId) {
    return userSocketMap.filter((user) => user.roomId === roomId);
}

function getRoomId(socketId) {
    return userSocketMap.find((user) => user.socketId === socketId)?.roomId;
}

function getUserBySocketId(socketId) {
    return userSocketMap.find((user) => user.socketId === socketId);
}

io.on("connection", (socket) => {
    socket.on(SocketEvent.JOIN_REQUEST, ({ roomId, username }) => {
        const exists = getUsersInRoom(roomId).find(u => u.username === username);
        if (exists) {
            io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS);
            return;
        }

        const user = {
            username,
            roomId,
            status: USER_CONNECTION_STATUS.ONLINE,
            socketId: socket.id,
        };

        userSocketMap.push(user);
        socket.join(roomId);

        socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, { user });
        io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, { user });
    });

    socket.on("disconnect", () => {
        userSocketMap = userSocketMap.filter(u => u.socketId !== socket.id);
    });
});

// ROUTES
app.use("/api/code", executeCodeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/room", roomRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ FIXED HERE
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
        console.log("✅ Database connected");
    })
    .catch((err) => {
        console.log("❌ DB Error:", err);
    });