import type { ServerOptions } from 'socket.io';

export const WS_CONFIG: Partial<ServerOptions> = {
  cors: {
    origin: process.env.WS_CORS_ORIGIN?.split(',') ?? ['*'],
    credentials: true,
  },
  path: '/ws', // frontend will connect to /ws
  transports: ['websocket', 'polling'],
};
