// Import the Socket.IO library
const { Socket } = require("socket.io");

// Enum-like object for user connection status
const USER_CONNECTION_STATUS = {
    OFFLINE: "offline",
    ONLINE: "online"
}

// Enum-like object for socket events
const SocketEvent = {
    JOIN_REQUEST: "join-request",
    JOIN_ACCEPTED: "join-accepted",
    USER_JOINED: "user-joined",
    USER_DISCONNECTED: "user-disconnected",
    SET_DISCONNECT: "set-disconnect",
    SYNC_FILE_STRUCTURE: "sync-file-structure",
    DIRECTORY_CREATED: "directory-created",
    DIRECTORY_UPDATED: "directory-updated",
    DIRECTORY_RENAMED: "directory-renamed",
    DIRECTORY_DELETED: "directory-deleted",
    FILE_CREATED: "file-created",
    FILE_UPDATED: "file-updated",
    FILE_RENAMED: "file-renamed",
    FILE_DELETED: "file-deleted",
    USER_OFFLINE: "offline",
    USER_ONLINE: "online",
    SEND_MESSAGE: "send-message",
    RECEIVE_MESSAGE: "receive-message",
    TYPING_START: "typing-start",
    TYPING_PAUSE: "typing-pause",
    USERNAME_EXISTS: "username-exists",
    REQUEST_DRAWING: "request-drawing",
    SYNC_DRAWING: "sync-drawing",
    DRAWING_UPDATE: "drawing-update",
};

// Interface-like object for socket context
const SocketContext = {
    socket: Socket,
};

// Export the objects
module.exports = {
    SocketEvent,
    SocketContext,
    USER_CONNECTION_STATUS,
};
