import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socket = useMemo(() => io('http://localhost:5000', { autoConnect: false }), []);

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
