import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, FileText, Shield, Ambulance, Video, TestTube, ChevronRight, AlertCircle, Loader, Home, Brain, MessageSquare, Menu, X, User } from 'lucide-react';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [loading, setLoading] = useState({ appointments: true, bills: true });
  const [error, setError] = useState({ appointments: null, bills: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/patient/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setUpcomingAppointments(data);
        console.log('Upcoming appointments:', data);
      } catch (err) {
        setError(prev => ({ ...prev, appointments: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, appointments: false }));
      }
    };
    if (user?.id) fetchUpcomingAppointments();
  }, [user?.id]);

  useEffect(() => {
    const fetchPendingBills = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`http://localhost:8080/api/bills?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch bills');

        const data = await response.json();

        // Filter only pending bills here (or you can filter on backend)
        const pending = data.filter(bill => bill.status?.toLowerCase() === 'pending');
        setPendingBills(pending);

        setError(prev => ({ ...prev, bills: null }));
      } catch (err) {
        setError(prev => ({ ...prev, bills: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, bills: false }));
      }
    };

    fetchPendingBills();
  }, [user?.id]);


  const goTo = (path) => {
    // Add user ID as URL parameter if not already present
    const separator = path.includes('?') ? '&' : '?';
    const pathWithUserId = `${path}${separator}userId=${user?.id}`;
    navigate(pathWithUserId, { state: { user } });
  };

  const dashboardActions = [
    { path: '/appointments?book=true', label: 'Book Appointment', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700' },
    { path: '/prescriptions', label: 'View Prescriptions', icon: FileText, color: 'bg-cyan-600 hover:bg-cyan-700' },
    { path: '/bills', label: 'Billing Info', icon: DollarSign, color: 'bg-yellow-600 hover:bg-yellow-700' },
    // Removed Medical History from here to add a custom button below
    { path: '/insurance', label: 'Apply for Insurance', icon: Shield, color: 'bg-sky-600 hover:bg-sky-700' },
    { path: '/ambulance', label: 'Book Ambulance', icon: Ambulance, color: 'bg-rose-600 hover:bg-rose-700' },
    { path: '/video-sessions', label: 'Join Video Session', icon: Video, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { path: '/lab-tests', label: 'See Test List', icon: TestTube, color: 'bg-fuchsia-600 hover:bg-fuchsia-700' },
    { path: '/symptom-checker', label: 'AI Symptom Checker', icon: Brain, color: 'bg-emerald-600 hover:bg-emerald-700' },
    { path: '/feedback', label: 'Feedback Board', icon: MessageSquare, color: 'bg-violet-600 hover:bg-violet-700' }
  ];

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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });

  const totalPendingAmount = pendingBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

  const LoadingSpinner = () => (
    <div className="patient-dash-loading">
      <Loader className="patient-dash-spinner" size={20} />
      <span>Loading...</span>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="patient-dash-error">
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );

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
        {/* Existing Dashboard Content */}
        <div className="patient-dash-container">
          <div className="patient-dash-header">
            <div className="patient-dash-welcome">
              <div className="patient-dash-header-left">
                <button
                  className="patient-sidebar-toggle-main"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                <div className="patient-dash-title-section">
                  <h1 className="patient-dash-title">Patient Dashboard</h1>
                  <p className="patient-dash-greeting">Welcome back, <span className="patient-dash-name">{user?.name}</span></p>
                </div>
              </div>
            </div>
            <div className="patient-dash-header-actions">
              <button
                onClick={() => navigate('/')}
                className="patient-home-button patient-header-home"
              >
                <Home size={16} />
                <span>Homepage</span>
              </button>
              <div className="patient-dash-id">
                <span className="patient-dash-id-label">Patient ID:</span>
                <span className="patient-dash-id-value">{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="patient-dash-content">

            {/* Quick Stats */}
            <div className="patient-dash-stats">
              <div className="patient-dash-stat-card">
                <div className="patient-dash-stat-icon patient-dash-stat-blue">
                  <Calendar size={24} />
                </div>
                <div className="patient-dash-stat-info">
                  <h3 className="patient-dash-stat-number">
                    {loading.appointments ? '-' : upcomingAppointments.length}
                  </h3>
                  <p className="patient-dash-stat-label">Upcoming Appointments</p>
                </div>
              </div>
              <div className="patient-dash-stat-card">
                <div className="patient-dash-stat-icon patient-dash-stat-orange">
                  <DollarSign size={24} />
                </div>
                <div className="patient-dash-stat-info">
                  <h3 className="patient-dash-stat-number">
                    {loading.bills ? '-' : `$${totalPendingAmount.toFixed(2)}`}
                  </h3>
                  <p className="patient-dash-stat-label">Pending Bills</p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="patient-dash-section">
              <div className="patient-dash-section-header">
                <h2 className="patient-dash-section-title">Upcoming Appointments</h2>
                <button onClick={() => goTo('/appointments')} className="patient-dash-view-all">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="patient-dash-card">
                {loading.appointments ? (
                  <LoadingSpinner />
                ) : error.appointments ? (
                  <ErrorMessage message={error.appointments} />
                ) : upcomingAppointments.length === 0 ? (
                  <div className="patient-dash-empty">
                    <Calendar size={48} className="patient-dash-empty-icon" />
                    <p className="patient-dash-empty-text">No upcoming appointments</p>
                    <button onClick={() => goTo('/appointments')} className="patient-dash-empty-button">
                      Book Your First Appointment
                    </button>
                  </div>
                ) : (
                  <div className="patient-dash-appointments-list">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="patient-dash-appointment-item">
                        <div className="patient-dash-appointment-date">
                          <div className="patient-dash-date-day">{formatDate(appointment.appointmentDate)}</div>
                          <div className="patient-dash-date-time">{appointment.appointmentTime}</div>
                        </div>
                        <div className="patient-dash-appointment-details">
                          <h4 className="patient-dash-appointment-doctor">{appointment.doctorName || 'Unknown Doctor'}</h4>
                          <p className="patient-dash-appointment-specialty">{appointment.specialty || 'Unknown Specialty'}</p>
                        </div>
                        <div className={`patient-dash-appointment-status patient-dash-status-${appointment.status}`}>
                          {appointment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Bills */}
            <div className="patient-dash-section">
              <div className="patient-dash-section-header">
                <h2 className="patient-dash-section-title">Pending Bills</h2>
                <button onClick={() => goTo('/bills')} className="patient-dash-view-all">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="patient-dash-card">
                {loading.bills ? (
                  <LoadingSpinner />
                ) : error.bills ? (
                  <ErrorMessage message={error.bills} />
                ) : pendingBills.length === 0 ? (
                  <div className="patient-dash-empty">
                    <DollarSign size={48} className="patient-dash-empty-icon" />
                    <p className="patient-dash-empty-text">No pending bills</p>
                    <p className="patient-dash-empty-subtext">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="patient-dash-bills-list">
                    {pendingBills.slice(0, 3).map((bill) => (
                      <div key={bill.id} className="patient-dash-bill-item">
                        <div className="patient-dash-bill-info">
                          <h4 className="patient-dash-bill-service">{bill.department || 'Department N/A'}</h4>
                          <p className="patient-dash-bill-date">
                            Service Date: {bill.visitDate ? formatDate(bill.visitDate) : 'N/A'}
                          </p>
                          <p className="patient-dash-bill-due">
                            Due: ${bill.totalAmount !== undefined ? bill.totalAmount.toFixed(2) : '0.00'}
                          </p>

                        </div>
                        <div className="patient-dash-bill-amount">
                          <span className="patient-dash-amount">
                            ${bill.totalAmount !== undefined ? bill.totalAmount.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {pendingBills.length > 3 && (
                      <div className="patient-dash-bills-more">
                        +{pendingBills.length - 3} more bills
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="patient-dash-section">
              <h2 className="patient-dash-section-title">Quick Actions</h2>
              <div className="patient-dash-actions-grid">
                {dashboardActions.map((action) => {
                  const IconComponent = action.icon;

                  if (action.path === '/lab-tests') {
                    return (
                      <button
                        key={action.path}
                        onClick={() => navigate(action.path, { state: { userId: user?.id } })}
                        className={`patient-dash-action-card ${action.color}`}
                      >
                        <IconComponent size={24} className="patient-dash-action-icon" />
                        <span className="patient-dash-action-label">{action.label}</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={action.path}
                      onClick={() => goTo(action.path)}
                      className={`patient-dash-action-card ${action.color}`}
                    >
                      <IconComponent size={24} className="patient-dash-action-icon" />
                      <span className="patient-dash-action-label">{action.label}</span>
                    </button>
                  );
                })}

                {/* Custom Medical History button passing userId */}
                <button
                  onClick={() => navigate('/medical-history', { state: { userId: user?.id } })}
                  className="patient-dash-action-card bg-lime-600 hover:bg-lime-700"
                >
                  <FileText size={24} className="patient-dash-action-icon" />
                  <span className="patient-dash-action-label">Medical History</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
