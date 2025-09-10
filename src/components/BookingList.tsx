// D:\web-dev\react-practice\mfe-demo\packages\booking\src\components\BookingList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingList.css';

interface Booking {
  id: string;
  facilityName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedBy: string;
  attendees: number;
  purpose: string;
  createdAt: string;
  specialRequirements?: string;
  contactEmail: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data
  const mockBookings: Booking[] = [
    {
      id: 'BK001',
      facilityName: 'Conference Room A',
      bookingDate: '2024-01-15',
      startTime: '09:00',
      endTime: '11:00',
      status: 'confirmed',
      bookedBy: 'John Doe',
      attendees: 12,
      purpose: 'Quarterly Review Meeting',
      createdAt: '2024-01-10T10:30:00Z',
      contactEmail: 'john.doe@example.com'
    },
    {
      id: 'BK002',
      facilityName: 'Board Room',
      bookingDate: '2024-01-16',
      startTime: '14:00',
      endTime: '16:00',
      status: 'pending',
      bookedBy: 'Jane Smith',
      attendees: 8,
      purpose: 'Client Presentation',
      createdAt: '2024-01-11T14:20:00Z',
      specialRequirements: 'Projector needed, Video conferencing setup',
      contactEmail: 'jane.smith@example.com'
    },
    {
      id: 'BK003',
      facilityName: 'Training Room',
      bookingDate: '2024-01-14',
      startTime: '10:00',
      endTime: '17:00',
      status: 'cancelled',
      bookedBy: 'Mike Johnson',
      attendees: 25,
      purpose: 'Employee Training Session',
      createdAt: '2024-01-08T09:15:00Z',
      contactEmail: 'mike.johnson@example.com'
    },
    {
      id: 'BK004',
      facilityName: 'Conference Room B',
      bookingDate: '2024-01-17',
      startTime: '13:00',
      endTime: '15:00',
      status: 'confirmed',
      bookedBy: 'Sarah Williams',
      attendees: 6,
      purpose: 'Team Standup',
      createdAt: '2024-01-12T11:45:00Z',
      contactEmail: 'sarah.williams@example.com'
    },
    {
      id: 'BK005',
      facilityName: 'Auditorium',
      bookingDate: '2024-01-20',
      startTime: '09:00',
      endTime: '12:00',
      status: 'pending',
      bookedBy: 'David Brown',
      attendees: 100,
      purpose: 'Company Town Hall',
      createdAt: '2024-01-13T16:30:00Z',
      specialRequirements: 'Microphones, Stage setup, Live streaming',
      contactEmail: 'david.brown@example.com'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadBookings = async () => {
      setLoading(true);
      try {
        // Get bookings from localStorage or use mock data
        const storedBookings = localStorage.getItem('bookings');
        const allBookings = storedBookings 
          ? [...JSON.parse(storedBookings), ...mockBookings]
          : mockBookings;
        
        // Remove duplicates based on ID
        const uniqueBookings = allBookings.filter((booking, index, self) =>
          index === self.findIndex((b) => b.id === booking.id)
        );
        
        setBookings(uniqueBookings);
        setFilteredBookings(uniqueBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  useEffect(() => {
    let filtered = [...bookings];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCreateBooking = () => {
    navigate('/create');
  };

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    
    // Update localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const parsed = JSON.parse(storedBookings);
      const updated = parsed.map((booking: Booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      localStorage.setItem('bookings', JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="booking-list">
      <div className="booking-header">
        <h2>📋 Facility Bookings</h2>
        <button className="btn-primary" onClick={handleCreateBooking}>
          ➕ Create New Booking
        </button>
      </div>

      <div className="booking-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found matching your criteria.</p>
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')} className="btn-link">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="booking-grid">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.facilityName}</h3>
                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="detail-row">
                  <span className="detail-label">📅 Date:</span>
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰ Time:</span>
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👤 Booked by:</span>
                  <span>{booking.bookedBy}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👥 Attendees:</span>
                  <span>{booking.attendees}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📝 Purpose:</span>
                  <span>{booking.purpose}</span>
                </div>
                {booking.specialRequirements && (
                  <div className="detail-row">
                    <span className="detail-label">⚡ Requirements:</span>
                    <span className="requirements">{booking.specialRequirements}</span>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button
                      className="btn-small btn-success"
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    >
                      ✅ Confirm
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    >
                      ❌ Cancel
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    className="btn-small btn-warning"
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                  >
                    🚫 Cancel Booking
                  </button>
                )}
                {booking.status === 'cancelled' && (
                  <button
                    className="btn-small btn-info"
                    onClick={() => handleStatusChange(booking.id, 'pending')}
                  >
                    🔄 Reactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;