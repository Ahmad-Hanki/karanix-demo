
export const WS_ROOMS = {
  operation: (id: string) => `operation:${id}`,
  vehicle: (id: string) => `vehicle:${id}`,
} as const;

export const WS_EVENTS = {
  VehiclePosition: 'vehicle_position',
  PaxUpdated: 'pax_updated',
  Alert: 'operation_alert',
} as const;
