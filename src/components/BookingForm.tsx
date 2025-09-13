
import React, { useState } from 'react';
import './Booking.css';

interface BookingFormData {
  facilityName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  purpose: string;
  contactEmail: string;
  specialRequirements: string;
}

interface BookingFormErrors {
  facilityName?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string;
  purpose?: string;
  contactEmail?: string;
  specialRequirements?: string;
}

interface BookingFormProps {
  user?: {
    id: string;
    username: string;
    email?: string;
    role: string;
  };
  onBookingSubmit?: (bookingData: BookingFormData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ user, onBookingSubmit }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    facilityName: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    attendees: 1,
    purpose: '',
    contactEmail: user?.email || '',
    specialRequirements: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [success, setSuccess] = useState(false);

  const facilities = [
    'Conference Room A (8 people)',
    'Conference Room B (12 people)', 
    'Conference Room C (6 people)',
    'Training Room A (20 people)',
    'Training Room B (15 people)',
    'Board Room (10 people)',
    'Auditorium (100 people)',
    'Meeting Pod 1 (4 people)',
    'Meeting Pod 2 (4 people)',
    'Presentation Room (25 people)'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 1 : value
    }));
    
    if (errors[name as keyof BookingFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

    if (!formData.facilityName) {
      newErrors.facilityName = 'Please select a facility';
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.bookingDate = 'Cannot book for past dates';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Please select start time';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Please select end time';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (formData.attendees < 1 || formData.attendees > 200) {
      newErrors.attendees = 'Attendees must be between 1 and 200';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please describe the purpose';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📋 Booking submitted:', formData);
      onBookingSubmit?.(formData);
      if (typeof window !== 'undefined' && (window as any).eventBus) {
        (window as any).eventBus.emit('booking:created', {
          payload: {
            ...formData,
            id: Date.now().toString(),
            bookedBy: user?.username || 'Unknown',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        });
      }
      
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          facilityName: '',
          bookingDate: '',
          startTime: '',
          endTime: '',
          attendees: 1,
          purpose: '',
          contactEmail: user?.email || '',
          specialRequirements: ''
        });
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('❌ Booking submission error:', error);
      setErrors({ purpose: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        options.push(
          <option key={timeString} value={timeString}>
            {displayTime}
          </option>
        );
      }
    }
    return options;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="booking-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Booking Request Submitted!</h2>
          <p>Your facility booking request has been submitted successfully.</p>
          <p>You will receive a confirmation email once it's been reviewed.</p>
          <div className="success-details">
            <strong>Booking Details:</strong>
            <ul>
              <li>Facility: {formData.facilityName}</li>
              <li>Date: {new Date(formData.bookingDate).toLocaleDateString()}</li>
              <li>Time: {new Date(`2000-01-01T${formData.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(`2000-01-01T${formData.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</li>
              <li>Attendees: {formData.attendees}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-form-header">
        <h2>🏢 Book a Facility</h2>
        <p>Reserve a meeting room or facility for your event</p>
        {user && (
          <div className="user-context">
            Booking as: <strong>{user.username}</strong> ({user.role})
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-section">
          <h3>📍 Facility & Date</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="facilityName" className="form-label required">
                Facility
              </label>
              <select
                id="facilityName"
                name="facilityName"
                value={formData.facilityName}
                onChange={handleInputChange}
                className={`form-input ${errors.facilityName ? 'error' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select a facility...</option>
                {facilities.map(facility => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
              {errors.facilityName && (
                <span className="error-text">{errors.facilityName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bookingDate" className="form-label required">
                Date
              </label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                min={getTodayDate()}
                className={`form-input ${errors.bookingDate ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.bookingDate && (
                <span className="error-text">{errors.bookingDate}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime" className="form-label required">
                Start Time
              </label>
              <select
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className={`form-input ${errors.startTime ? 'error' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select start time...</option>
                {generateTimeOptions()}
              </select>
              {errors.startTime && (
                <span className="error-text">{errors.startTime}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="endTime" className="form-label required">
                End Time
              </label>
              <select
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className={`form-input ${errors.endTime ? 'error' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select end time...</option>
                {generateTimeOptions()}
              </select>
              {errors.endTime && (
                <span className="error-text">{errors.endTime}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>👥 Event Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="attendees" className="form-label required">
                Number of Attendees
              </label>
              <input
                type="number"
                id="attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
                min="1"
                max="200"
                className={`form-input ${errors.attendees ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.attendees && (
                <span className="error-text">{errors.attendees}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail" className="form-label required">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="your.email@company.com"
                className={`form-input ${errors.contactEmail ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.contactEmail && (
                <span className="error-text">{errors.contactEmail}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="purpose" className="form-label required">
              Purpose of Meeting
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the purpose of your meeting or event..."
              rows={3}
              className={`form-input ${errors.purpose ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.purpose && (
              <span className="error-text">{errors.purpose}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="specialRequirements" className="form-label">
              Special Requirements (Optional)
            </label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              placeholder="Any special equipment, catering, or setup requirements..."
              rows={2}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Submitting Request...
              </>
            ) : (
              <>
                📋 Submit Booking Request
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                facilityName: '',
                bookingDate: '',
                startTime: '',
                endTime: '',
                attendees: 1,
                purpose: '',
                contactEmail: user?.email || '',
                specialRequirements: ''
              });
              setErrors({});
            }}
            className="reset-button"
            disabled={isSubmitting}
          >
            🔄 Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;