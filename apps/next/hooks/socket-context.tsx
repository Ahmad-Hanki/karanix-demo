"use client";

import { getAuthCookieClient } from "@/lib/auth-cookies";
import { createSocket } from "@/lib/socket-config";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Socket } from "socket.io-client";

type SocketContextValue = Socket | null;

const SocketContext = createContext<SocketContextValue>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const token = getAuthCookieClient()?.accessToken;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("SocketProvider useEffect, token:", token);
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = createSocket(token);
    setSocket(s);
    s.connect();

    s.on("connect", () => {
      console.log("Socket connected", s.id);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      s.disconnect();
    };
  }, [token]);

  const memoizedSocket = useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={memoizedSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
