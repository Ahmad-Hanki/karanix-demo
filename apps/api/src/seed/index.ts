import {
  CheckinMethod,
  OperationStatus,
  PaxStatus,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  //---------------------------------------------------------------------
  // USERS
  //---------------------------------------------------------------------
  const opsManager = await prisma.user.create({
    data: {
      name: 'Operations Manager',
      email: 'admin@karanix.com',
      role: UserRole.OPS_MANAGER,
      password: await hash('12345'),
    },
  });

  const driver = await prisma.user.create({
    data: {
      name: 'John Driver',
      email: 'driver@example.com',
      role: UserRole.DRIVER,
      password: await hash('12345'),
    },
  });

  const guide = await prisma.user.create({
    data: {
      name: 'Sarah Guide',
      email: 'guide@example.com',
      role: UserRole.GUIDE,
      password: await hash('12345'),
    },
  });

  //---------------------------------------------------------------------
  // VEHICLE
  //---------------------------------------------------------------------
  const vehicle = await prisma.vehicle.create({
    data: {
      plate: '34ABC123',
      name: 'Sprinter Van 1',
      driverId: driver.id,
      lastLat: 41.0082,
      lastLng: 28.9784,
      lastSpeed: 32,
      lastHeading: 180,
      lastPingAt: new Date(),
    },
  });

  //---------------------------------------------------------------------
  // OPERATIONS (Today + Tomorrow)
  //---------------------------------------------------------------------
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // normalize hours
  today.setHours(9, 0, 0, 0);
  tomorrow.setHours(9, 0, 0, 0);

  const op1 = await prisma.operation.create({
    data: {
      code: 'OP-TODAY-001',
      tourName: 'City Morning Tour',
      date: today,
      startTime: today,
      status: OperationStatus.PLANNED,
      totalPax: 5,

      vehicleId: vehicle.id,
      driverId: driver.id,
      guideId: guide.id,

      route: [
        { lat: 41.0082, lng: 28.9784 },
        { lat: 41.0151, lng: 28.9795 },
      ],
    },
  });

  const op2 = await prisma.operation.create({
    data: {
      code: 'OP-TOMORROW-002',
      tourName: 'Historic City Tour',
      date: tomorrow,
      startTime: tomorrow,
      status: OperationStatus.PLANNED,
      totalPax: 5,

      vehicleId: vehicle.id,
      driverId: driver.id,
      guideId: guide.id,

      route: [
        { lat: 41.01, lng: 28.97 },
        { lat: 41.02, lng: 28.99 },
      ],
    },
  });

  //---------------------------------------------------------------------
  // PAX for operation 1
  //---------------------------------------------------------------------
  const paxNames = ['Ali', 'Mehmet', 'Anna', 'David', 'Fatma'];

  for (let i = 0; i < paxNames.length; i++) {
    await prisma.pax.create({
      data: {
        name: paxNames[i],
        operationId: op1.id,
        pickupLat: 41.008 + i * 0.002,
        pickupLng: 28.98 + i * 0.002,
        pickupAddress: `Hotel ${paxNames[i]}`,
        seatNo: i + 1,
        status: PaxStatus.WAITING,
      },
    });
  }

  //---------------------------------------------------------------------
  // PAX for operation 2
  //---------------------------------------------------------------------
  const paxNames2 = ['John', 'Maria', 'Yuki', 'Hassan', 'Emily'];

  for (let i = 0; i < paxNames2.length; i++) {
    await prisma.pax.create({
      data: {
        name: paxNames2[i],
        operationId: op2.id,
        pickupLat: 41.01 + i * 0.002,
        pickupLng: 28.97 + i * 0.002,
        pickupAddress: `Hotel ${paxNames2[i]}`,
        seatNo: i + 1,
        status: PaxStatus.WAITING,
      },
    });
  }

  //---------------------------------------------------------------------
  // HEARTBEATS
  //---------------------------------------------------------------------
  await prisma.heartbeat.createMany({
    data: [
      {
        vehicleId: vehicle.id,
        operationId: op1.id,
        lat: 41.009,
        lng: 28.979,
        speed: 40,
        heading: 90,
        timestamp: new Date(),
      },
      {
        vehicleId: vehicle.id,
        operationId: op1.id,
        lat: 41.01,
        lng: 28.98,
        speed: 38,
        heading: 95,
        timestamp: new Date(),
      },
    ],
  });

  //---------------------------------------------------------------------
  // CHECK-IN EVENTS (2 pax checked in)
  //---------------------------------------------------------------------
  const paxList = await prisma.pax.findMany({ where: { operationId: op1.id } });

  await prisma.checkinEvent.create({
    data: {
      eventId: 'event-1',
      paxId: paxList[0].id,
      operationId: op1.id,
      method: CheckinMethod.MANUAL,
      gpsLat: paxList[0].pickupLat,
      gpsLng: paxList[0].pickupLng,
    },
  });

  await prisma.checkinEvent.create({
    data: {
      eventId: 'event-2',
      paxId: paxList[1].id,
      operationId: op1.id,
      method: CheckinMethod.MANUAL,
      gpsLat: paxList[1].pickupLat,
      gpsLng: paxList[1].pickupLng,
    },
  });

  // update checkedInCount
  await prisma.operation.update({
    where: { id: op1.id },
    data: { checkedInCount: 2 },
  });

  console.log('🌱 Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
