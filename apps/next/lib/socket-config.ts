// shared/socket.config.ts
import { config } from "@/config/config";
import { io, Socket } from "socket.io-client";

export const SOCKET_URL = config.socketUrl;

export const createSocket = (): Socket => {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
  });
};
