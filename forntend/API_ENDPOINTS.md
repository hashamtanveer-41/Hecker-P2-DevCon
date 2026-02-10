# Frontend URLs and API Endpoints

This file lists the URLs/endpoints used by the frontend so the backend can implement matching routes.

## Base URLs

- API base URL: `http://localhost:8000`
- WebSocket URL: `ws://localhost:8000/ws/notifications`
- Socket.IO URL (env override): `VITE_SOCKET_URL` with fallback `http://localhost:3000`

## Auth

- `POST /auth/webauthn/register`
- `POST /auth/webauthn/login/verify`
- `POST /auth/logout`

## Hospitals

- `GET /hospitals`
- `POST /hospitals`
- `GET /hospitals/{id}`
- `PUT /hospitals/{id}`
- `DELETE /hospitals/{id}`

## Operating Rooms

- `GET /operating-rooms`
- `POST /operating-rooms`
- `GET /operating-rooms/{id}`
- `PUT /operating-rooms/{id}`
- `DELETE /operating-rooms/{id}`

## Staff

- `GET /staff`
- `POST /staff`
- `GET /staff/{id}`
- `PUT /staff/{id}`
- `DELETE /staff/{id}`
- `GET /staff/{id}/availability?date=YYYY-MM-DD`

## Equipment

- `GET /equipment`
- `POST /equipment`
- `GET /equipment/{id}`
- `PUT /equipment/{id}`
- `DELETE /equipment/{id}`
- `POST /equipment/{id}/sterilize`

## Surgery Requests

- `GET /surgery-requests`
- `POST /surgery-requests`
- `GET /surgery-requests/{id}`
- `PUT /surgery-requests/{id}`
- `DELETE /surgery-requests/{id}`
- `POST /surgery-requests/{id}/approve`

## Scheduler

- `POST /scheduler/run`
- `POST /scheduler/emergency`

## Schedule

- `GET /schedule`
- `GET /schedule/{id}`
- `PATCH /schedule/{id}/reschedule`

## Calendar

- `GET /calendar/day?date=YYYY-MM-DD`
- `GET /calendar/week?start_date=YYYY-MM-DD`

## Priority Queue

- `GET /priority-queue`

## Sync and Audit Logs

- `POST /sync/push`
- `GET /audit-logs` (supports query params: `action`, `user`, `start_date`, `end_date`)

