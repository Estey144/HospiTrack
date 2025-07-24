import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Appointments.css';

const Appointments = ({ currentUser }) => {
  const [user, setUser] = useState(currentUser || JSON.parse(localStorage.getItem('user')));

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
  const [isLoadingDoctorsDepts, setIsLoadingDoctorsDepts] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    departmentId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  const location = useLocation();
  const showBookingForm = new URLSearchParams(location.search).get('book') === 'true';

  useEffect(() => {
    if (!user) return;

    if ((user.role || '').toLowerCase() !== 'patient') {
      setAppointmentError('Unauthorized access.');
      setIsLoadingAppointments(false);
      return;
    }

    const fetchInitialData = async () => {
      await Promise.all([
        fetchAppointments(),
        fetchDoctorsAndDepartments()
      ]);

      if (showBookingForm) {
        openNewAppointmentModal();
      }
    };

    fetchInitialData();
  }, [user, location.search]);

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    setAppointmentError('');
    try {
      const response = await axios.get(`http://localhost:8080/api/appointments/patient/${user.id}`, {
        withCredentials: true
      });

      setPatientAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointmentError('Failed to fetch appointments.');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const fetchDoctorsAndDepartments = async () => {
    setIsLoadingDoctorsDepts(true);
    try {
      // Try to fetch from API first
      const [doctorsRes, departmentsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/doctors', { withCredentials: true }),
        axios.get('http://localhost:8080/api/departments', { withCredentials: true })
      ]);

      console.log('Doctors API response:', doctorsRes.data);
      console.log('Departments API response:', departmentsRes.data);

      const normalizedDoctors = doctorsRes.data.map((d) => ({
        doctorId: d.doctorId ?? d.DOCTORID ?? d.id,
        doctorName: d.doctorName ?? d.DOCTORNAME ?? `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim(),
        specialization: d.specialization ?? d.SPECIALIZATION,
        departmentId: d.departmentId ?? d.DEPARTMENTID,
        experienceYears: d.experienceYears ?? d.EXPERIENCEYEARS,
        branchName: d.branchName ?? d.BRANCHNAME,
        imageUrl: d.imageUrl ?? d.IMAGEURL
      }));

      const normalizedDepartments = departmentsRes.data.map((dept) => ({
        id: dept.id ?? dept.DEPARTMENTID,
        name: dept.name ?? dept.DEPARTMENTNAME ?? dept.SPECIALIZATION,
      }));

      console.log('Normalized doctors:', normalizedDoctors);
      console.log('Normalized departments:', normalizedDepartments);

      setDoctors(normalizedDoctors);
      setDepartments(normalizedDepartments);

    } catch (error) {
      console.error('Failed to fetch doctors/departments:', error);
      console.log('Using mock data for testing...');
      
      // Use mock data when API fails
      const mockDepartments = [
        { id: '1', name: 'Cardiology' },
        { id: '2', name: 'Neurology' },
        { id: '3', name: 'Pediatrics' },
        { id: '4', name: 'Orthopedics' },
      ];

      const mockDoctors = [
        { doctorId: 'doc1', doctorName: 'Dr. John Smith', specialization: 'Cardiology', departmentId: '1' },
        { doctorId: 'doc2', doctorName: 'Dr. Sarah Johnson', specialization: 'Cardiology', departmentId: '1' },
        { doctorId: 'doc3', doctorName: 'Dr. Michael Brown', specialization: 'Neurology', departmentId: '2' },
        { doctorId: 'doc4', doctorName: 'Dr. Emily Davis', specialization: 'Pediatrics', departmentId: '3' },
        { doctorId: 'doc5', doctorName: 'Dr. Robert Wilson', specialization: 'Orthopedics', departmentId: '4' },
      ];

      setDepartments(mockDepartments);
      setDoctors(mockDoctors);
      setAppointmentError('Using demo data - please check your backend server.');
    } finally {
      setIsLoadingDoctorsDepts(false);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    setIsLoadingSlots(true);
    setFormErrors(prev => ({ ...prev, time: '' }));
    try {
      const response = await axios.get(`http://localhost:8080/api/appointments/available-slots/${doctorId}/${date}`, {
        withCredentials: true
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      console.log('Using mock time slots for testing...');
      
      // Use mock time slots when API fails
      const mockSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      setAvailableSlots(mockSlots);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const openNewAppointmentModal = () => {
    setSuccessMessage('');
    setAppointmentError('');
    setShowNewAppointmentModal(true);
    setNewAppointment({
      departmentId: '',
      doctorId: '',
      date: '',
      time: '',
      reason: ''
    });
    setAvailableSlots([]);
    setFormErrors({});
  };

  const handleNewAppointmentChange = (field, value) => {
    console.log(`Field changed: ${field} = ${value}`);
    
    setAppointmentError('');
    setSuccessMessage('');
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'departmentId') {
      setNewAppointment(prev => ({
        ...prev,
        departmentId: value,
        doctorId: '',
        time: ''
      }));
      setAvailableSlots([]);
    } else if (field === 'doctorId' || field === 'date') {
      const updated = { ...newAppointment, [field]: value, time: '' };
      setNewAppointment(updated);
      if (updated.doctorId && updated.date) {
        fetchAvailableSlots(updated.doctorId, updated.date);
      } else {
        setAvailableSlots([]);
      }
    } else {
      setNewAppointment(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setAppointmentError('');

    const errors = {};
    if (!newAppointment.departmentId) errors.departmentId = 'Please select a department';
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
      await axios.post('http://localhost:8080/api/appointments', {
        doctorId: newAppointment.doctorId,
        departmentId: newAppointment.departmentId,
        patientId: user.id,
        date: newAppointment.date,
        time: newAppointment.time,
        reason: newAppointment.reason
      }, {
        withCredentials: true
      });

      setSuccessMessage('Appointment booked successfully!');
      await fetchAppointments();
      setShowNewAppointmentModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Failed to book appointment:', error);
      setAppointmentError(
        error.response?.data?.message || 'Failed to book appointment. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed': return 'patient-appointment-status-confirmed';
      case 'pending': return 'patient-appointment-status-pending';
      case 'cancelled': return 'patient-appointment-status-cancelled';
      case 'completed': return 'patient-appointment-status-completed';
      default: return 'patient-appointment-status-default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(timeString)) return timeString;
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  // Get filtered doctors based on selected department
  const getFilteredDoctors = () => {
    if (!newAppointment.departmentId) return [];
    return doctors.filter(doctor => 
      String(doctor.departmentId) === String(newAppointment.departmentId)
    );
  };

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
          onClick={openNewAppointmentModal}
          aria-haspopup="dialog"
        >
          <span className="patient-appointments-new-btn-icon" aria-hidden="true">+</span>
          Book New Appointment
        </button>
      </div>

      {successMessage && (
        <div className="patient-appointment-success" role="alert">
          {successMessage}
        </div>
      )}

      {appointmentError && !showNewAppointmentModal && (
        <div className="patient-appointments-error-banner" role="alert">
          {appointmentError}
        </div>
      )}

      {patientAppointments.length === 0 ? (
        <div className="patient-appointments-empty">
          <div className="patient-appointments-empty-icon" aria-hidden="true">📅</div>
          <h3>No Appointments Scheduled</h3>
          <p>You don't have any appointments at the moment.</p>
          <button
            className="patient-appointments-schedule-btn"
            onClick={openNewAppointmentModal}
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
                  {appointment.doctorName || appointment.DOCTORNAME}
                </h3>
                <span className={`patient-appointment-status ${getStatusBadgeClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              <div className="patient-appointment-card-body">
                <div className="patient-appointment-detail">
                  <div className="patient-appointment-detail-icon" aria-hidden="true">🏥</div>
                  <div className="patient-appointment-detail-content">
                    <span className="patient-appointment-detail-label">Department</span>
                    <span className="patient-appointment-detail-value">
                      {appointment.department || appointment.SPECIALIZATION}
                    </span>
                  </div>
                </div>

                <div className="patient-appointment-detail">
                  <div className="patient-appointment-detail-icon" aria-hidden="true">📅</div>
                  <div className="patient-appointment-detail-content">
                    <span className="patient-appointment-detail-label">Date</span>
                    <span className="patient-appointment-detail-value">{formatDate(appointment.date || appointment.dateTime || appointment.appointmentDate)}</span>
                  </div>
                </div>

                <div className="patient-appointment-detail">
                  <div className="patient-appointment-detail-icon" aria-hidden="true">⏰</div>
                  <div className="patient-appointment-detail-content">
                    <span className="patient-appointment-detail-label">Time</span>
                    <span className="patient-appointment-detail-value">{formatTime(appointment.time)}</span>
                  </div>
                </div>
              </div>

              <div className="patient-appointment-card-footer">
                <button
                  className="patient-appointment-btn patient-appointment-btn-secondary"
                  aria-label={`Reschedule appointment with ${appointment.doctorName || appointment.DOCTORNAME}`}
                  disabled
                >
                  Reschedule
                </button>
                <button
                  className="patient-appointment-btn patient-appointment-btn-primary"
                  aria-label={`View details of appointment with ${appointment.doctorName || appointment.DOCTORNAME}`}
                  disabled
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewAppointmentModal && (
        <div
          className="patient-appointment-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="patient-appointment-modal">
            <div className="patient-appointment-modal-header">
              <h2 id="modal-title">Book New Appointment</h2>
              <button
                className="patient-appointment-modal-close"
                onClick={() => setShowNewAppointmentModal(false)}
                aria-label="Close booking modal"
              >
                ×
              </button>
            </div>

            {isLoadingDoctorsDepts ? (
              <div className="patient-appointments-loading">
                <div className="patient-appointments-spinner" aria-hidden="true"></div>
                <p>Loading booking form...</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="patient-appointment-form" noValidate>
                {appointmentError && (
                  <div className="patient-appointments-error-banner" role="alert">
                    {appointmentError}
                  </div>
                )}

                <div className={`patient-appointment-form-group ${formErrors.departmentId ? 'error' : ''}`}>
                  <label htmlFor="department-select">Department</label>
                  <select
                    id="department-select"
                    value={newAppointment.departmentId}
                    onChange={(e) => handleNewAppointmentChange('departmentId', e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  {formErrors.departmentId && (
                    <span className="patient-appointment-form-error" role="alert">{formErrors.departmentId}</span>
                  )}
                </div>

                <div className={`patient-appointment-form-group ${formErrors.doctorId ? 'error' : ''}`}>
                  <label htmlFor="doctor-select">Doctor</label>
                  <select
                    id="doctor-select"
                    value={newAppointment.doctorId}
                    onChange={(e) => handleNewAppointmentChange('doctorId', e.target.value)}
                    required
                    disabled={!newAppointment.departmentId}
                  >
                    <option value="">
                      {!newAppointment.departmentId ? 'Select Department First' : 'Select Doctor'}
                    </option>
                    {getFilteredDoctors().map(doctor => (
                      <option key={doctor.doctorId} value={doctor.doctorId}>
                        {doctor.doctorName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {formErrors.doctorId && (
                    <span className="patient-appointment-form-error" role="alert">{formErrors.doctorId}</span>
                  )}
                </div>

                <div className="patient-appointment-form-row">
                  <div className={`patient-appointment-form-group ${formErrors.date ? 'error' : ''}`}>
                    <label htmlFor="date-input">Preferred Date</label>
                    <input
                      id="date-input"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => handleNewAppointmentChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {formErrors.date && (
                      <span className="patient-appointment-form-error" role="alert">{formErrors.date}</span>
                    )}
                  </div>

                  <div className={`patient-appointment-form-group ${formErrors.time ? 'error' : ''} ${isLoadingSlots ? 'loading' : ''}`}>
                    <label htmlFor="time-select">Available Time Slots</label>
                    <select
                      id="time-select"
                      value={newAppointment.time}
                      onChange={(e) => handleNewAppointmentChange('time', e.target.value)}
                      required
                      disabled={!availableSlots.length || isLoadingSlots}
                    >
                      <option value="">
                        {isLoadingSlots ? 'Loading slots...' :
                          (!newAppointment.doctorId || !newAppointment.date) ? 'Select doctor and date first' :
                            !availableSlots.length ? 'No slots available' : 'Select Time'}
                      </option>
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{formatTime(slot)}</option>
                      ))}
                    </select>
                    {formErrors.time && (
                      <span className="patient-appointment-form-error" role="alert">{formErrors.time}</span>
                    )}
                  </div>
                </div>

                <div className={`patient-appointment-form-group ${formErrors.reason ? 'error' : ''}`}>
                  <label htmlFor="reason-textarea">Reason for Visit</label>
                  <textarea
                    id="reason-textarea"
                    value={newAppointment.reason}
                    onChange={(e) => handleNewAppointmentChange('reason', e.target.value)}
                    placeholder="Briefly describe your symptoms or reason for the appointment"
                    rows="3"
                    required
                  />
                  {formErrors.reason && (
                    <span className="patient-appointment-form-error" role="alert">{formErrors.reason}</span>
                  )}
                </div>

                <div className="patient-appointment-form-actions">
                  <button
                    type="submit"
                    className="patient-appointment-submit-btn"
                    disabled={isBooking}
                    aria-busy={isBooking}
                  >
                    {isBooking ? 'Booking...' : 'Book Appointment'}
                  </button>
                  <button
                    type="button"
                    className="patient-appointment-cancel-btn"
                    onClick={() => setShowNewAppointmentModal(false)}
                    disabled={isBooking}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;