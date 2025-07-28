import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, DollarSign, FileText, Shield, Ambulance, Video, TestTube, Brain, MessageSquare, Menu, X, User, Home } from 'lucide-react';
import './Appointments.css';
import './PatientDashboard.css';
  import { v4 as uuidv4 } from 'uuid'; 

const Appointments = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get user from multiple sources with priority order
  const getUserFromParams = () => {
    // 1. From navigation state (highest priority)
    if (location.state?.user) return location.state.user;
    
    // 2. From URL parameters
    const userIdFromParams = searchParams.get('userId');
    if (userIdFromParams) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.id === userIdFromParams) return storedUser;
    }
    
    // 3. From props
    if (currentUser) return currentUser;
    
    // 4. From localStorage (fallback)
    return JSON.parse(localStorage.getItem('user') || '{}');
  };

  const [user, setUser] = useState(getUserFromParams());

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigationItems = [
    { path: '/patient-dashboard', label: 'Patient Dashboard', icon: User, color: 'text-blue-600' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText, color: 'text-cyan-600' },
    { path: '/bills', label: 'Bills', icon: DollarSign, color: 'text-yellow-600' },
    { path: '/medical-history', label: 'Medical History', icon: FileText, color: 'text-lime-600' },
    { path: '/insurance', label: 'Insurance', icon: Shield, color: 'text-sky-600' },
    { path: '/ambulance', label: 'Ambulance', icon: Ambulance, color: 'text-rose-600' },
    { path: '/video-sessions', label: 'Video Sessions', icon: Video, color: 'text-indigo-600' },
    { path: '/lab-tests', label: 'Lab Tests', icon: TestTube, color: 'text-fuchsia-600' },
    { path: '/symptom-checker', label: 'AI Symptom Checker', icon: Brain, color: 'text-emerald-600' },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare, color: 'text-violet-600' }
  ];

  const handleSidebarNavigation = (path) => {
    const separator = path.includes('?') ? '&' : '?';
    const pathWithUserId = `${path}${separator}userId=${user?.id}`;
    navigate(pathWithUserId, { state: { user } });
    setSidebarOpen(false); // Close sidebar after navigation
  };

  // Debug logging to verify user ID is received
  useEffect(() => {
    console.log('Appointments page - User ID from params:', searchParams.get('userId'));
    console.log('Appointments page - User from state:', location.state?.user);
    console.log('Appointments page - Current user:', user);
  }, [searchParams, location.state, user]);

  const [patientAppointments, setPatientAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingDoctorsDepts, setIsLoadingDoctorsDepts] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    branchId: '',
    departmentId: '',
    doctorId: '',
    date: '',
    time: '',
    type: ''
  });

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
      const [doctorsRes, departmentsRes, branchesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/doctors', { withCredentials: true }),
        axios.get('http://localhost:8080/api/departments', { withCredentials: true }),
        axios.get('http://localhost:8080/api/branches', { withCredentials: true })
      ]);

      console.log('Doctors API response:', doctorsRes.data);
      console.log('Raw first doctor:', doctorsRes.data[0]);
      console.log('Departments API response:', departmentsRes.data);
      console.log('Branches API response:', branchesRes.data);

      const normalizedDoctors = doctorsRes.data
        .map((d) => {
          // Find the branch ID by matching branch name
          const branch = branchesRes.data.find(b => b.name === (d.branchName ?? d.BRANCHNAME));
          
          return {
            doctorId: d.doctorId ?? d.DOCTORID ?? d.id,
            doctorName: d.doctorName ?? d.DOCTORNAME ?? `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim(),
            specialization: d.specialization ?? d.SPECIALIZATION ?? d.departmentName ?? d.DEPARTMENTNAME,
            departmentId: d.departmentId ?? d.DEPARTMENTID,
            experienceYears: d.experienceYears ?? d.EXPERIENCEYEARS,
            branchName: d.branchName ?? d.BRANCHNAME,
            branchId: branch?.id, // Map branch name to branch ID
            imageUrl: d.imageUrl ?? d.IMAGEURL
          };
        })
        .filter(doctor => 
          doctor.doctorId && 
          doctor.doctorName && 
          doctor.doctorName.trim() !== ''
        );

      const normalizedDepartments = departmentsRes.data.map((dept) => ({
        id: dept.id ?? dept.DEPARTMENTID,
        name: dept.name ?? dept.DEPARTMENTNAME ?? dept.SPECIALIZATION,
        branchId: dept.branchId ?? dept.BRANCHID ?? dept.branch_id
      }));

      const normalizedBranches = branchesRes.data.map((branch) => ({
        id: branch.id ?? branch.BRANCHID ?? branch.branch_id,
        name: branch.name ?? branch.BRANCHNAME ?? branch.branch_name,
        location: branch.location ?? branch.LOCATION,
        address: branch.address ?? branch.ADDRESS
      }));

      console.log('Normalized doctors:', normalizedDoctors);
      console.log('First normalized doctor:', normalizedDoctors[0]);
      console.log('Normalized departments:', normalizedDepartments);
      console.log('Normalized branches:', normalizedBranches);

      setDoctors(normalizedDoctors);
      setDepartments(normalizedDepartments);
      setBranches(normalizedBranches);

    } catch (error) {
      console.error('Failed to fetch doctors/departments:', error);
      console.log('Using mock data for testing...');
      
      // Use mock data when API fails
      const mockBranches = [
        { id: 'b001', name: 'Dhaka Medical Branch', address: 'Azimpur, Dhaka' },
        { id: 'b002', name: 'Mirpur Branch', address: 'Mirpur-10, Dhaka' },
        { id: 'b003', name: 'Gulshan Branch', address: 'Gulshan-2, Dhaka' },
        { id: 'b004', name: 'Rajshahi Branch', address: 'Kazla, Rajshahi' },
      ];

      const mockDepartments = [
        { id: '1', name: 'Cardiology', branchId: 'b001' },
        { id: '2', name: 'Neurology', branchId: 'b001' },
        { id: '3', name: 'Pediatrics', branchId: 'b002' },
        { id: '4', name: 'Orthopedics', branchId: 'b002' },
        { id: '5', name: 'Emergency Medicine', branchId: 'b003' },
        { id: '6', name: 'Surgery', branchId: 'b004' },
      ];

      const mockDoctors = [
        { doctorId: 'doc1', doctorName: 'Dr. John Smith', specialization: 'Cardiology', departmentId: '1', branchId: 'b001', branchName: 'Dhaka Medical Branch' },
        { doctorId: 'doc2', doctorName: 'Dr. Sarah Johnson', specialization: 'Cardiology', departmentId: '1', branchId: 'b001', branchName: 'Dhaka Medical Branch' },
        { doctorId: 'doc3', doctorName: 'Dr. Michael Brown', specialization: 'Neurology', departmentId: '2', branchId: 'b001', branchName: 'Dhaka Medical Branch' },
        { doctorId: 'doc4', doctorName: 'Dr. Emily Davis', specialization: 'Pediatrics', departmentId: '3', branchId: 'b002', branchName: 'Mirpur Branch' },
        { doctorId: 'doc5', doctorName: 'Dr. Robert Wilson', specialization: 'Orthopedics', departmentId: '4', branchId: 'b002', branchName: 'Mirpur Branch' },
        { doctorId: 'doc6', doctorName: 'Dr. Jane Cooper', specialization: 'Emergency Medicine', departmentId: '5', branchId: 'b003', branchName: 'Gulshan Branch' },
        { doctorId: 'doc7', doctorName: 'Dr. Ahmed Hassan', specialization: 'Surgery', departmentId: '6', branchId: 'b004', branchName: 'Rajshahi Branch' },
      ];

      setBranches(mockBranches);
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
      branchId: '',
      departmentId: '',
      doctorId: '',
      date: '',
      time: '',
      type: ''
    });
    setAvailableSlots([]);
    setFormErrors({});
  };

  const handleNewAppointmentChange = (field, value) => {
    console.log(`Field changed: ${field} = ${value}`);
    
    setAppointmentError('');
    setSuccessMessage('');
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'branchId') {
      setNewAppointment(prev => ({
        ...prev,
        branchId: value,
        departmentId: '',
        doctorId: '',
        time: '',
        type: ''
      }));
      setAvailableSlots([]);
    } else if (field === 'departmentId') {
      setNewAppointment(prev => ({
        ...prev,
        departmentId: value,
        doctorId: '',
        time: '',
        type: ''
      }));
      setAvailableSlots([]);
    } else if (field === 'doctorId' || field === 'date') {
      const updated = { ...newAppointment, [field]: value, time: '', type: field === 'doctorId' ? '' : newAppointment.type };
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
  if (!newAppointment.branchId) errors.branchId = 'Please select a branch';
  if (!newAppointment.departmentId) errors.departmentId = 'Please select a department';
  if (!newAppointment.doctorId) errors.doctorId = 'Please select a doctor';
  if (!newAppointment.date) errors.date = 'Please select a date';
  if (!newAppointment.time) errors.time = 'Please select a time slot';
  if (!newAppointment.type) errors.type = 'Please select appointment type';

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setIsBooking(true);

  try {
    const appointmentId = uuidv4();

    // POST to /api/appointments/user/{userId}, backend will map to patientId
    await axios.post(`http://localhost:8080/api/appointments/user/${user.id}`, {
      id: appointmentId,
      doctorId: newAppointment.doctorId,
      appointmentDate: newAppointment.date,
      timeSlot: newAppointment.time,
      type: newAppointment.type,
      status: 'pending'
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
  if (!timeString) return 'N/A';

  // If already in 12-hour format with AM/PM, just return it
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(timeString.trim())) {
    return timeString.trim();
  }

  // Parse times like "16:00" or "16:00:00"
  const parts = timeString.split(':');
  if (parts.length < 2) return 'Invalid time';

  let hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);

  if (isNaN(hour) || isNaN(minute)) return 'Invalid time';

  // Convert 24h to 12h
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // converts 0 to 12

  // Format minutes with leading zero
  const minuteStr = minute.toString().padStart(2, '0');

  return `${hour}:${minuteStr} ${ampm}`;
};



  // Get filtered departments based on selected branch
  const getFilteredDepartments = () => {
    console.log('getFilteredDepartments called with branchId:', newAppointment.branchId);
    console.log('Available departments:', departments);
    console.log('Available doctors:', doctors);
    
    if (!newAppointment.branchId) return [];
    
    // Find doctors that belong to the selected branch
    const doctorsInBranch = doctors.filter(doctor => {
      // Check if doctor has branchId or if their branchName matches the selected branch
      const selectedBranch = branches.find(b => b.id === newAppointment.branchId);
      const branchMatch = doctor.branchId === newAppointment.branchId || 
                         doctor.branchId === parseInt(newAppointment.branchId) ||
                         (selectedBranch && doctor.branchName === selectedBranch.name);
      
      console.log(`Doctor ${doctor.doctorName} - branchId: ${doctor.branchId}, branchName: ${doctor.branchName}, matches branch: ${branchMatch}`);
      return branchMatch;
    });
    
    console.log('Doctors in selected branch:', doctorsInBranch);
    
    // Get unique department names from doctors in this branch
    const departmentNamesInBranch = [...new Set(doctorsInBranch.map(doctor => doctor.specialization))];
    console.log('Department names in branch:', departmentNamesInBranch);
    
    // Filter departments by matching names
    const filtered = departments.filter(dept => 
      departmentNamesInBranch.includes(dept.name)
    );
    
    console.log('Filtered departments:', filtered);
    return filtered;
  };

  // Get filtered doctors based on selected department
  const getFilteredDoctors = () => {
    console.log('getFilteredDoctors called with departmentId:', newAppointment.departmentId);
    console.log('getFilteredDoctors called with branchId:', newAppointment.branchId);
    
    if (!newAppointment.departmentId || !newAppointment.branchId) return [];
    
    // Find the selected department name
    const selectedDept = departments.find(dept => dept.id === newAppointment.departmentId);
    const selectedBranch = branches.find(b => b.id === newAppointment.branchId);
    
    if (!selectedDept || !selectedBranch) return [];
    
    console.log('Selected department:', selectedDept);
    console.log('Selected branch:', selectedBranch);
    
    // Filter doctors by matching both department name AND branch
    const filtered = doctors.filter(doctor => {
      const departmentMatch = doctor.specialization && 
        doctor.specialization.toLowerCase() === selectedDept.name.toLowerCase();
      
      const branchMatch = doctor.branchId === newAppointment.branchId || 
                         doctor.branchId === parseInt(newAppointment.branchId) ||
                         doctor.branchName === selectedBranch.name;
      
      console.log(`Doctor ${doctor.doctorName}: dept match = ${departmentMatch}, branch match = ${branchMatch}`);
      return departmentMatch && branchMatch;
    });
    
    console.log('Filtered doctors:', filtered);
    return filtered;
  };

  return (
    <div className="patient-dashboard-wrapper">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="patient-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`patient-sidebar ${sidebarOpen ? 'patient-sidebar--open' : ''}`}>
        <div className="patient-sidebar-header">
          <div className="patient-sidebar-title">
            <User size={24} className="patient-sidebar-logo" />
            <span className="patient-sidebar-title-text">Patient Portal</span>
          </div>
          <button 
            className="patient-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="patient-sidebar-user">
          <div className="patient-sidebar-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div className="patient-sidebar-user-info">
            <div className="patient-sidebar-user-name">{user?.name || 'Patient'}</div>
            <div className="patient-sidebar-user-id">ID: {user?.id || 'N/A'}</div>
          </div>
        </div>

        <nav className="patient-sidebar-nav">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = window.location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleSidebarNavigation(item.path)}
                className={`patient-nav-item ${isActive ? 'patient-nav-item--active' : ''}`}
              >
                <IconComponent size={20} className={`patient-nav-icon ${item.color}`} />
                <span className="patient-nav-label">{item.label}</span>
                {isActive && <div className="patient-nav-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="patient-sidebar-footer">
          <button 
            onClick={() => navigate('/')}
            className="patient-home-button"
          >
            <Home size={16} />
            <span>Back to Homepage</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="patient-main">
        <div className="patient-appointments-wrapper">
      <div className="patient-appointments-header">
        <div className="patient-appointments-nav-buttons">
          <button 
            className="patient-sidebar-toggle-main"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
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
  {appointment.department || appointment.SPECIALIZATION || appointment.specialty}
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
                   <span className="patient-appointment-detail-value">{formatTime(appointment.appointmentTime)}</span>

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

                <div className={`patient-appointment-form-group ${formErrors.branchId ? 'error' : ''}`}>
                  <label htmlFor="branch-select">Branch</label>
                  <select
                    id="branch-select"
                    value={newAppointment.branchId}
                    onChange={(e) => handleNewAppointmentChange('branchId', e.target.value)}
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} {branch.location || branch.address ? ` - ${branch.location || branch.address}` : ''}
                      </option>
                    ))}
                  </select>
                  {formErrors.branchId && (
                    <span className="patient-appointment-form-error" role="alert">{formErrors.branchId}</span>
                  )}
                </div>

                <div className={`patient-appointment-form-group ${formErrors.departmentId ? 'error' : ''}`}>
                  <label htmlFor="department-select">Department</label>
                  <select
                    id="department-select"
                    value={newAppointment.departmentId}
                    onChange={(e) => handleNewAppointmentChange('departmentId', e.target.value)}
                    required
                    disabled={!newAppointment.branchId}
                  >
                    <option value="">
                      {!newAppointment.branchId ? 'Select Branch First' : 'Select Department'}
                    </option>
                    {getFilteredDepartments().map(dept => (
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

                <div className={`patient-appointment-form-group ${formErrors.type ? 'error' : ''}`}>
                  <label htmlFor="type-select">Appointment Type</label>
                  <select
                    id="type-select"
                    value={newAppointment.type}
                    onChange={(e) => handleNewAppointmentChange('type', e.target.value)}
                    required
                    disabled={!newAppointment.doctorId}
                  >
                    <option value="">
                      {!newAppointment.doctorId ? 'Select Doctor First' : 'Select Appointment Type'}
                    </option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Screening">Screening</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                  {formErrors.type && (
                    <span className="patient-appointment-form-error" role="alert">{formErrors.type}</span>
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

                <div className="patient-appointment-form-actions">
                  <button
                    type="submit"
                    className="patient-appointment-btn patient-appointment-submit-btn"
                    disabled={isBooking}
                    aria-busy={isBooking}
                  >
                    {isBooking ? 'Booking...' : 'Book Appointment'}
                  </button>
                  <button
                    type="button"
                    className="patient-appointment-btn patient-appointment-cancel-btn"
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
      </div>
    </div>
  );
};

export default Appointments;