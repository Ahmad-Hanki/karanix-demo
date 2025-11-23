# 🚌 Real-Time Operation Tracking System

NestJS + Prisma + MySQL + Socket.IO + Next.js

This project is a real-time operations dashboard for a tour/transportation company.
Managers can:

View today/tomorrow operations

See live vehicle GPS movement (via WebSocket)

View passenger manifest (pax list)

Check-in passengers

Receive automatic alerts (70% rule)

Track pickup points on Google Maps

This project includes:

Backend: NestJS, Prisma ORM, MySQL, Socket.IO

Frontend: Next.js, React, Google Maps API

## ⚙️ 1. Backend Setup
### 1.1 Install dependencies
```
cd apps/api
npm install
```

### 1.2 Environment variables

Create a .env file → see .env.example.

### 1.3 Prisma migrate & seed
```
cd apps/api
npm run db:push
npm run db:seed
```

## 🧭 2. Frontend Setup

### 2.1 Install dependencies
```
cd apps/next
npm install
```
### 2.2 Environment variables

Create a .env file → see .env.example.

## 🔐 3. Login

Use seeded credentials to test:

Email: admin@karanix.com
Password: 12345

## 🧩 4. About the Project

### 4.1 Authentication (JWT)

POST /auth/login → login

GET /auth/me → get user data (manager, driver, or guide)

Frontend uses proxies + cookies + guards to protect all routes

Backend verifies Authorization: Bearer <token>

## 📡 5. REST API Documentation (Backend)

### 5.1 List Operations

GET /api/operations?date=&status=

### 5.2 Get Operation Detail

GET /api/operations/:id


Returns pax, driver, guide, vehicle, route, last vehicle position.

### 5.3 Start Operation

POST /api/operations/:id/start


Sets status → ACTIVE
Emits WS event: operation_alert with type: STATUS_CHANGE.

### 5.4 Send Heartbeat (vehicle position)
POST /api/vehicles/:id/heartbeat


Updates DB + emits WS event: vehicle_position.

### 5.5 Check-In Passenger
POST /api/pax/:id/checkin


Updates pax status, increments checkedInCount, and emits: pax_updated.

### 5.6 70% Rule: Check Alert
POST /api/operations/:id/check-alert


If:

Operation is ACTIVE

Start time + 15 min passed

checkedInCount / totalPax < 0.7

Then emits:
operation_alert with type: LOW_CHECKIN


## 🎨 6. Frontend Architecture (API-Style Documentation)

### 6.1 WebSocket Events

Connected via:

io(NEXT_PUBLIC_SOCKET_URL)

Join room
socket.emit("join_operation", { operationId });

### 6.2 React Query (Queries & Mutations)

All write operations (check-in, start operation, heartbeat test, etc.) use React Query mutations.

Example:
```
export const useCheckIn = ({ mutationConfig } = {}) =>
  useMutation({
    mutationFn: CheckIn,
    ...mutationConfig,
  });
```

Mutations handle success/error/loading automatically.

### 6.3 React Query restApi Client

All requests use a shared Axios client (restApi) to maintain:

authorization headers

consistent error handling

unified API base URL

### 6.4 Server-Side Fetching with cache()

Operation list + detail pages fetch data server-side

Uses React cache() for deduplication + preventing double fetches

Ensures stable SSR hydration + better performance

### 6.5 URL State Management with nuqs

Used for Today/Tomorrow filtering.

URL params synced with useQueryStates

shallow: false ensures full SSR fetch on change

Example:
```
const [params, setParams] = useQueryStates(operationsSearchParams, {
  shallow: false,
  scroll: true,
  startTransition,
});
```
### 6.6 Smooth UI Updates with useTransition

Changing filters is wrapped inside React useTransition

Allows non-blocking UI updates

isPending controls lightweight loading states