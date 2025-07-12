import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, FileText, Shield, Ambulance, Video, TestTube, ChevronRight, AlertCircle, Loader, Home } from 'lucide-react';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [loading, setLoading] = useState({ appointments: true, bills: true });
  const [error, setError] = useState({ appointments: null, bills: null });

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments/upcoming/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setUpcomingAppointments(data);
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
      try {
        const response = await fetch(`/api/bills/pending/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch bills');
        const data = await response.json();
        setPendingBills(data);
      } catch (err) {
        setError(prev => ({ ...prev, bills: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, bills: false }));
      }
    };
    if (user?.id) fetchPendingBills();
  }, [user?.id]);

  const goTo = (path) => navigate(path);

  const dashboardActions = [
   { path: '/appointments?book=true', label: 'Book Appointment', icon: Calendar, color: 'bg-blue-500 hover:bg-blue-600' },

    { path: '/prescriptions', label: 'View Prescriptions', icon: FileText, color: 'bg-green-500 hover:bg-green-600' },
    { path: '/bills', label: 'Billing Info', icon: DollarSign, color: 'bg-orange-500 hover:bg-orange-600' },
    { path: '/medical-history', label: 'Medical History', icon: FileText, color: 'bg-purple-500 hover:bg-purple-600' },
    { path: '/insurance', label: 'Apply for Insurance', icon: Shield, color: 'bg-teal-500 hover:bg-teal-600' },
    { path: '/ambulance', label: 'Book Ambulance', icon: Ambulance, color: 'bg-red-500 hover:bg-red-600' },
    { path: '/video-sessions', label: 'Join Video Session', icon: Video, color: 'bg-indigo-500 hover:bg-indigo-600' },
    { path: '/lab-tests', label: 'See Test List', icon: TestTube, color: 'bg-pink-500 hover:bg-pink-600' }
  ];

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });

  const totalPendingAmount = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

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
    <div className="patient-dash-container">
      <div className="patient-dash-header">
        <div className="patient-dash-welcome">
          <h1 className="patient-dash-title">Patient Dashboard</h1>
          <p className="patient-dash-greeting">Welcome back, <span className="patient-dash-name">{user?.name}</span></p>
        </div>
        <div className="patient-dash-id">
          <span className="patient-dash-id-label">Patient ID:</span>
          <span className="patient-dash-id-value">{user?.id}</span>
        </div>
        <button 
          onClick={() => goTo('/')} 
          className="patient-dash-home-btn"
        >
          <Home size={16} style={{ marginRight: 5 }} />
          Go to Homepage
        </button>
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
            {loading.appointments ? <LoadingSpinner /> :
              error.appointments ? <ErrorMessage message={error.appointments} /> :
                upcomingAppointments.length === 0 ? (
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
                          <h4 className="patient-dash-appointment-doctor">{appointment.doctorName}</h4>
                          <p className="patient-dash-appointment-specialty">{appointment.specialty}</p>
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
            {loading.bills ? <LoadingSpinner /> :
              error.bills ? <ErrorMessage message={error.bills} /> :
                pendingBills.length === 0 ? (
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
                          <h4 className="patient-dash-bill-service">{bill.serviceName}</h4>
                          <p className="patient-dash-bill-date">Service Date: {formatDate(bill.serviceDate)}</p>
                          <p className="patient-dash-bill-due">Due: {formatDate(bill.dueDate)}</p>
                        </div>
                        <div className="patient-dash-bill-amount">
                          <span className="patient-dash-amount">${bill.amount.toFixed(2)}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
