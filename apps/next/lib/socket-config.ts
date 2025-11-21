// shared/socket.config.ts
import { config } from "@/config/config";
import { io, Socket } from "socket.io-client";

export const SOCKET_URL = config.socketUrl;

export const createSocket = (token?: string): Socket => {
  return io(SOCKET_URL, {
    path: "/ws",
    transports: ["websocket"],
    autoConnect: false,
    auth: token ? { token } : undefined,
  });
};
