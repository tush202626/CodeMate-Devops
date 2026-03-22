import React, { useState, useEffect, useRef, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useSocket } from "../../context/SocketContext";
import { useAppContext } from "../../context/AppContext";

// Compare two scenes to determine if they are identical
const areScenesEqual = (scene1, scene2) => {
  if (!scene1 || !scene2) return false;
  if (scene1.elements?.length !== scene2.elements?.length) return false;

  return scene1.elements.every((el, index) => {
    const otherEl = scene2.elements[index];
    return (
      el.id === otherEl.id &&
      el.version === otherEl.version &&
      el.versionNonce === otherEl.versionNonce &&
      el.x === otherEl.x &&
      el.y === otherEl.y &&
      el.width === otherEl.width &&
      el.height === otherEl.height &&
      el.angle === otherEl.angle &&
      el.opacity === otherEl.opacity &&
      el.isDeleted === otherEl.isDeleted &&
      JSON.stringify(el.points) === JSON.stringify(otherEl.points)
    );
  });
};

const DrawingBoard = () => {
  const excalidrawRef = useRef(null);
  const { socket } = useSocket();
  const { drawingData, setDrawingData } = useAppContext();
  const [drawing, setDrawing] = useState(drawingData || { 
    elements: [], 
    appState: {}, 
    files: {} 
  });

  const latestDrawing = useRef(drawing);
  const emitTimeout = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Sync ref with current drawing state
  useEffect(() => {
    latestDrawing.current = drawing;
  }, [drawing]);

  // Debounced emission with proper cleanup
  const debouncedEmit = useCallback((data) => {
    clearTimeout(emitTimeout.current);
    emitTimeout.current = setTimeout(() => {
      socket?.emit("drawing-update", data);
    }, 300);
  }, [socket]);

  // Handle drawing changes
  const handleChange = useCallback((elements, appState) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    const updatedDrawing = {
      elements,
      appState,
      files: latestDrawing.current.files,
      timestamp: Date.now(),
      userId: socket?.id,
    };

    // Only emit when the scene has changed
    if (!areScenesEqual(updatedDrawing, latestDrawing.current)) {
      setDrawing(prev => {
        const newDrawing = { ...updatedDrawing, files: prev.files };
        debouncedEmit(newDrawing);
        return newDrawing;
      });
      setDrawingData(updatedDrawing);
    }
  }, [socket, setDrawingData, debouncedEmit]);

  // Handle remote updates from other users
  const handleRemoteUpdate = (receivedDrawing) => {
    if (receivedDrawing.userId === socket.id) return;

    if (receivedDrawing.timestamp > (latestDrawing.current?.timestamp || 0)) {
      isRemoteUpdate.current = true;

      // Update state first
      setDrawing(receivedDrawing);
      setDrawingData(receivedDrawing);

      // Force sync with Excalidraw's internal state
      excalidrawRef.current?.updateScene({
        elements: receivedDrawing.elements,
        appState: {
          ...receivedDrawing.appState,
          offsetX: excalidrawRef.current.getAppState().offsetX,
          offsetY: excalidrawRef.current.getAppState().offsetY,
          zoom: excalidrawRef.current.getAppState().zoom,
        },
        files: receivedDrawing.files,
        commitToHistory: true,
      });
    }
  };

  // Request initial state and listen for updates
  useEffect(() => {
    if (!socket) return;

    const handleInitialState = (initialDrawing) => {
      if (initialDrawing && !areScenesEqual(initialDrawing, latestDrawing.current)) {
        isRemoteUpdate.current = true;
        excalidrawRef.current?.updateScene(initialDrawing);
        setDrawing(initialDrawing);
        setDrawingData(initialDrawing);
      }
    };

    // Request initial state
    socket.emit('request-drawing-state');
    socket.on('initial-drawing-state', handleInitialState);
    socket.on("drawing-update", handleRemoteUpdate);
    socket.on("reconnect", () => socket.emit('request-drawing-state'));

    return () => {
      socket.off('initial-drawing-state', handleInitialState);
      socket.off("drawing-update", handleRemoteUpdate);
      socket.off("reconnect");
      clearTimeout(emitTimeout.current);
    };
  }, [socket, setDrawingData]);

  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw
        ref={excalidrawRef}
        initialData={drawing}
        onChange={handleChange}
        viewModeEnabled={false}
        key={drawing.timestamp}  // Force re-render with timestamp
      />
    </div>
  );
};

export default DrawingBoard;
