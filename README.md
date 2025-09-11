# booking-app — Booking Micro‑Frontend

## 1) Setup
```bash
npm install
npm start     # → http://localhost:3002
npm run build # → dist/
```

## 2) Architecture Decisions
- **Exposes**: `./BookingList`, `./BookingForm` via Module Federation.
- **Data**: demo data + localStorage merge & persistence for status updates.
- **Shared singletons**: `react`, `react-dom`, `react-router-dom`.
- **Optional self‑register**: `bootstrap` POSTs manifest to `VITE_REGISTRY_URL`.

## 3) Communication Design
- **Events**: `booking:created` (payload with facility/date/time/etc.).
- **Props**: `BookingForm` can accept `user` for prefill.
- **Registry example**:
```json
{
  "name": "booking-app",
  "displayName": "Booking Management",
  "scope": "bookingApp",
  "url": "https://arh-mfe-booking.vercel.app/remoteEntry.js",
  "routes": ["/bookings", "/book"],
  "roles": ["user", "admin"],
  "module": "./BookingList"
}
```
