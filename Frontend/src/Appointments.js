import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Appointments.css';

const Appointments = () => {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    department: '',
    date: '',
    time: '',
    reason: ''
  });
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Patient') {
      setAppointmentError('Unauthorized access.');
      setIsLoadingAppointments(false);
      return;
    }

    // Fetch appointments
    axios.get(`/api/appointments/patient/${currentUser.id}`)
      .then((response) => {
        setPatientAppointments(response.data);
        setIsLoadingAppointments(false);
      })
      .catch(() => {
        setAppointmentError('Failed to fetch appointments.');
        setIsLoadingAppointments(false);
      });

    // Fetch doctors and departments for new appointment booking
    fetchDoctorsAndDepartments();
  }, [currentUser]);

  const fetchDoctorsAndDepartments = async () => {
    try {
      const [doctorsRes, departmentsRes] = await Promise.all([
        axios.get('/api/doctors'),
        axios.get('/api/departments')
      ]);
      setDoctors(doctorsRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Failed to fetch doctors/departments:', error);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    setIsLoadingSlots(true);
    try {
      const response = await axios.get(`/api/appointments/available-slots/${doctorId}/${date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAvailableSlots([]);
      setFormErrors(prev => ({ 
        ...prev, 
        time: 'Unable to fetch available slots. Please try again.' 
      }));
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleNewAppointmentChange = (field, value) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error and success messages
    setAppointmentError('');
    setSuccessMessage('');
    
    // Fetch available slots when doctor and date are selected
    if (field === 'doctorId' || field === 'date') {
      const doctorId = field === 'doctorId' ? value : newAppointment.doctorId;
      const date = field === 'date' ? value : newAppointment.date;
      if (doctorId && date) {
        // Clear time selection when doctor or date changes
        setNewAppointment(prev => ({ ...prev, time: '' }));
        fetchAvailableSlots(doctorId, date);
      } else {
        setAvailableSlots([]);
      }
    }
    
    // Clear doctor selection when department changes
    if (field === 'department') {
      setNewAppointment(prev => ({ 
        ...prev, 
        doctorId: '', 
        time: '' 
      }));
      setAvailableSlots([]);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({});
    setAppointmentError('');
    
    // Validate form
    const errors = {};
    if (!newAppointment.department) errors.department = 'Please select a department';
    if (!newAppointment.doctorId) errors.doctorId = 'Please select a doctor';
    if (!newAppointment.date) errors.date = 'Please select a date';
    if (!newAppointment.time) errors.time = 'Please select a time slot';
    if (!newAppointment.reason.trim()) errors.reason = 'Please provide a reason for the visit';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsBooking(true);
    
    try {
      const appointmentData = {
        ...newAppointment,
        patientId: currentUser.id
      };
      
      await axios.post('/api/appointments', appointmentData);
      
      // Show success message
      setSuccessMessage('Appointment booked successfully! You will receive a confirmation shortly.');
      
      // Refresh appointments list
      const response = await axios.get(`/api/appointments/patient/${currentUser.id}`);
      setPatientAppointments(response.data);
      
      // Reset form and close modal after a short delay
      setTimeout(() => {
        setNewAppointment({
          doctorId: '',
          department: '',
          date: '',
          time: '',
          reason: ''
        });
        setShowNewAppointmentModal(false);
        setAvailableSlots([]);
        setSuccessMessage('');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to book appointment:', error);
      setAppointmentError(
        error.response?.data?.message || 
        'Failed to book appointment. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'patient-appointment-status-confirmed';
      case 'pending':
        return 'patient-appointment-status-pending';
      case 'cancelled':
        return 'patient-appointment-status-cancelled';
      case 'completed':
        return 'patient-appointment-status-completed';
      default:
        return 'patient-appointment-status-default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoadingAppointments) {
    return (
      <div className="patient-appointments-wrapper">
        <div className="patient-appointments-loading">
          <div className="patient-appointments-spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (appointmentError) {
    return (
      <div className="patient-appointments-wrapper">
        <div className="patient-appointments-error">
          <div className="patient-appointments-error-icon">⚠️</div>
          <h3>Unable to Load Appointments</h3>
          <p>{appointmentError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-appointments-wrapper">
      <div className="patient-appointments-header">
        <div className="patient-appointments-header-content">
          <h1 className="patient-appointments-title">My Appointments</h1>
          <p className="patient-appointments-subtitle">
            View and manage your upcoming medical appointments
          </p>
        </div>
        <button 
          className="patient-appointments-new-btn"
          onClick={() => setShowNewAppointmentModal(true)}
        >
          <span className="patient-appointments-new-btn-icon">+</span>
          Book New Appointment
        </button>
      </div>

      {successMessage && (
        <div className="patient-appointment-success">
          {successMessage}
        </div>
      )}

      {appointmentError && (
        <div className="patient-appointments-error-banner">
          {appointmentError}
        </div>
      )}

      {patientAppointments.length === 0 ? (
        <div className="patient-appointments-empty">
          <div className="patient-appointments-empty-icon">📅</div>
          <h3>No Appointments Scheduled</h3>
          <p>You don't have any appointments at the moment.</p>
          <button 
            className="patient-appointments-schedule-btn"
            onClick={() => setShowNewAppointmentModal(true)}
          >
            Schedule New Appointment
          </button>
        </div>
      ) : (
        <div className="patient-appointments-grid">
          {patientAppointments.map((appointment) => (
            <div key={appointment.id} className="patient-appointment-card">
              <div className="patient-appointment-card-header">
                <h3 className="patient-appointment-doctor-name">
                  Dr. {appointment.doctorName}
                </h3>
                <span className={`patient-appointment-status ${getStatusBadgeClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              <div className="patient-appointment-card-body">
                <div className="patient-appointment-detail">
                  <div className="patient-appointment-detail-icon">🏥</div>
                  <div className="patient-appointment-detail-content">
                    <span className="patient-appointment-detail-label">Department</span>
                    <span className="patient-appointment-detail-value">{appointment.department}</span>
                  </div>
                </div>

                <div className="patient-appointment-detail">
                  <div className="patient-appointment-detail-icon">📅</div>
                  <div className="patient-appointment-detail-content">
                    <span className="patient-appointment-detail-label">Date</span>
                    <span className="patient-appointment-detail-value">{formatDate(appointment.date)}</span>
                  </div>
                </div>

                <div className="patient-appointment-detail">
                  <div className="patient-appointment-detail-icon">⏰</div>
                  <div className="patient-appointment-detail-content">
                    <span className="patient-appointment-detail-label">Time</span>
                    <span className="patient-appointment-detail-value">{formatTime(appointment.time)}</span>
                  </div>
                </div>
              </div>

              <div className="patient-appointment-card-footer">
                <button className="patient-appointment-btn patient-appointment-btn-secondary">
                  Reschedule
                </button>
                <button className="patient-appointment-btn patient-appointment-btn-primary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="patient-appointment-modal-overlay">
          <div className="patient-appointment-modal">
            <div className="patient-appointment-modal-header">
              <h2>Book New Appointment</h2>
              <button 
                className="patient-appointment-modal-close"
                onClick={() => setShowNewAppointmentModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="patient-appointment-form">
              <div className={`patient-appointment-form-group ${formErrors.department ? 'error' : ''}`}>
                <label>Department</label>
                <select
                  value={newAppointment.department}
                  onChange={(e) => handleNewAppointmentChange('department', e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                {formErrors.department && (
                  <span className="patient-appointment-form-error">{formErrors.department}</span>
                )}
              </div>

              <div className={`patient-appointment-form-group ${formErrors.doctorId ? 'error' : ''}`}>
                <label>Doctor</label>
                <select
                  value={newAppointment.doctorId}
                  onChange={(e) => handleNewAppointmentChange('doctorId', e.target.value)}
                  required
                  disabled={!newAppointment.department}
                >
                  <option value="">Select Doctor</option>
                  {doctors
                    .filter(doctor => !newAppointment.department || doctor.department === newAppointment.department)
                    .map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))
                  }
                </select>
                {formErrors.doctorId && (
                  <span className="patient-appointment-form-error">{formErrors.doctorId}</span>
                )}
              </div>

              <div className="patient-appointment-form-row">
                <div className={`patient-appointment-form-group ${formErrors.date ? 'error' : ''}`}>
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => handleNewAppointmentChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {formErrors.date && (
                    <span className="patient-appointment-form-error">{formErrors.date}</span>
                  )}
                </div>

                <div className={`patient-appointment-form-group ${formErrors.time ? 'error' : ''} ${isLoadingSlots ? 'loading' : ''}`}>
                  <label>Available Time Slots</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => handleNewAppointmentChange('time', e.target.value)}
                    required
                    disabled={!availableSlots.length || isLoadingSlots}
                  >
                    <option value="">
                      {isLoadingSlots ? 'Loading slots...' : 'Select Time'}
                    </option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{formatTime(slot)}</option>
                    ))}
                  </select>
                  {formErrors.time && (
                    <span className="patient-appointment-form-error">{formErrors.time}</span>
                  )}
                  {!newAppointment.doctorId && !newAppointment.date && (
                    <span className="patient-appointment-form-error">Please select doctor and date first</span>
                  )}
                </div>
              </div>

              <div className={`patient-appointment-form-group ${formErrors.reason ? 'error' : ''}`}>
                <label>Reason for Visit</label>
                <textarea
                  value={newAppointment.reason}
                  onChange={(e) => handleNewAppointmentChange('reason', e.target.value)}
                  placeholder="Briefly describe your symptoms or reason for the appointment"
                  rows="3"
                  required
                />
                {formErrors.reason && (
                  <span className="patient-appointment-form-error">{formErrors.reason}</span>
                )}
              </div>

              <div className="patient-appointment-form-actions">
                <button 
                  type="button" 
                  className="patient-appointment-btn patient-appointment-btn-secondary"
                  onClick={() => setShowNewAppointmentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="patient-appointment-btn patient-appointment-btn-primary"
                  disabled={isBooking}
                >
                  {isBooking ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;