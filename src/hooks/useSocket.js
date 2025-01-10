import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

const useSocketEvent = (eventName, serverUrl = "http://localhost:4000") => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setError(null);
    });

    // Lắng nghe sự kiện được truyền vào

    newSocket.on('employeeAward', (receivedData) => {
      console.log(`Received ${eventName}:`, receivedData);
      setData(receivedData);
    });
    console.log('Listener registered');

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError(err.message);
      setIsConnected(false);
    });

    return () => {
      if (eventName) {
        newSocket.off(eventName);
      }
      newSocket.disconnect();
    };
  }, [eventName, serverUrl]);

  // Hàm để emit sự kiện
  const emit = useCallback((payload) => {
    if (socket && isConnected) {
      console.log(`Emitting event ${eventName}`, payload);
      socket.emit(payload);
    }
  }, [socket, eventName, isConnected]);

  return {
    data,
    isConnected,
    error,
    emit,
    socket
  };
};

export default useSocketEvent; 