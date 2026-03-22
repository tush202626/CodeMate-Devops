const USER_CONNECTION_STATUS = {
    OFFLINE: "offline",
    ONLINE: "online",
};

const USER_STATUS = {
    INITIAL: "initial",
    CONNECTING: "connecting",
    ATTEMPTING_JOIN: "attempting-join",
    JOINED: "joined",
    CONNECTION_FAILED: "connection-failed",
    DISCONNECTED: "disconnected",
};

const createUser = (username, roomId) => ({
    username,
    roomId,
});

const createRemoteUser = (username, roomId, status, cursorPosition, typing, currentFile, socketId) => ({
    username,
    roomId,
    status,
    cursorPosition,
    typing,
    currentFile,
    socketId,
});

export { USER_CONNECTION_STATUS, USER_STATUS, createRemoteUser, createUser };
