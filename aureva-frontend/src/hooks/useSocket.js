import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const socket = useMemo(() => io(API_URL, { autoConnect: false }), [API_URL]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [socket]);

  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const emit = (event, data) => {
    if (isConnected) {
      socket.emit(event, data);
    }
  };

  const on = (event, callback) => {
    socket.on(event, callback);
  };

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
  };
}
