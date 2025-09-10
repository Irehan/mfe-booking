// D:\web-dev\react-practice\mfe-demo\packages\booking\src\App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingList from './components/BookingList';
import CreateBooking from './components/CreateBooking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="booking-app">
        <nav className="booking-nav">
          <h1>📅 Booking Management System</h1>
        </nav>
        <main className="booking-main">
          <Routes>
            <Route path="/" element={<BookingList />} />
            <Route path="/create" element={<CreateBooking />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="*" element={<BookingList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;