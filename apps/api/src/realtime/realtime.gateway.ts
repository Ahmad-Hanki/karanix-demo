// src/realtime/realtime.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { WS_CONFIG } from './ws.config';
import { WS_ROOMS, WS_EVENTS } from './ws.constants';

@WebSocketGateway(WS_CONFIG)
@Injectable()
export class RealtimeGateway {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_operation')
  handleJoinOperation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { operationId: string },
  ) {
    const room = WS_ROOMS.operation(data.operationId);
    client.join(room);
    this.logger.debug(`Client ${client.id} joined ${room}`);
  }

  @SubscribeMessage('leave_operation')
  handleLeaveOperation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { operationId: string },
  ) {
    const room = WS_ROOMS.operation(data.operationId);
    client.leave(room);
    this.logger.debug(`Client ${client.id} left ${room}`);
  }

  emitVehiclePosition(operationId: string, payload: any) {
    const room = WS_ROOMS.operation(operationId);
    this.server.to(room).emit(WS_EVENTS.VehiclePosition, payload);
  }

  emitPaxUpdated(operationId: string, payload: any) {
    const room = WS_ROOMS.operation(operationId);
    this.server.to(room).emit(WS_EVENTS.PaxUpdated, payload);
  }

  emitAlert(operationId: string, payload: any) {
    const room = WS_ROOMS.operation(operationId);
    this.server.to(room).emit(WS_EVENTS.Alert, payload);
  }
}
