const socketMiddleware = (socket) => (store) => (next) => (action) => {
    // Emit events based on actions
    if (action.type === 'fileSystem/createFile') {
      socket.emit('fileCreated', action.payload); // Emit file creation event
    }
  
    // Pass action to the reducer
    const result = next(action);
  
    // Handle socket event listeners (only set up once)
    if (!socket.hasListeners) {
      socket.on('fileCreated', (newFile) => {
        store.dispatch({ type: 'fileSystem/createFile', payload: newFile });
      });
  
      socket.hasListeners = true; // Prevent duplicate listeners
    }
  
    return result;
  };
  
  export default socketMiddleware;
  