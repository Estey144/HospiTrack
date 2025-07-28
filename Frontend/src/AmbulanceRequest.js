import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Truck,
  FileText,
  Menu,
  X,
  User,
  Calendar,
  MapPin,
  Heart,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';

import './AmbulanceRequest.css';
import './PatientDashboard.css';

const AmbulanceRequest = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getUserFromParams = () => {
    if (location.state?.user) return location.state.user;
    const userIdFromParams = searchParams.get('userId');
    if (userIdFromParams) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.id === userIdFromParams) return storedUser;
    }
    if (currentUser) return currentUser;
    return JSON.parse(localStorage.getItem('user') || '{}');
  };

  const [user, setUser] = useState(getUserFromParams());

  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    requestedTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { path: '/patient-dashboard', label: 'Patient Dashboard', icon: User, color: 'text-blue-600' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
    { path: '/ambulance', label: 'Ambulance', icon: Truck, color: 'text-rose-600' },
  ];

  const handleSidebarNavigation = (path) => {
    const separator = path.includes('?') ? '&' : '?';
    const pathWithUserId = `${path}${separator}userId=${user?.id}`;
    navigate(pathWithUserId, { state: { user } });
    setSidebarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/ambulance-requests', {
        userId: user?.id,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.destination,
        requestedTime: formData.requestedTime || null,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setFormData({
          pickupLocation: '',
          destination: '',
          requestedTime: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Failed to submit ambulance request.');
      }
    } catch (err) {
      console.error('Error submitting ambulance request:', err);
      if (err.response?.status === 503) {
        setError("All ambulances are currently busy. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    setLoading(false);
  };

  const fetchMyRequests = async () => {
    try {
      const response = await axios.get(`/api/ambulance-requests/user/${user.id}`);

      // Map backend keys (uppercase) to frontend camelCase keys
      const mappedRequests = response.data.map(req => ({
        id: req.ID,
        patientId: req.PATIENT_ID,
        ambulanceId: req.AMBULANCE_ID,
        requestedTime: req.REQUEST_TIME,
        pickupLocation: req.PICKUP_LOCATION,
        destination: req.DROP_LOCATION,
        status: req.STATUS?.toLowerCase(),
        vehicleNumber: req.VEHICLE_NUMBER,
        ambulanceStatus: req.AMBULANCE_STATUS,
      }));

      setMyRequests(mappedRequests);
      setShowMyRequestsModal(true);
    } catch (error) {
      console.error('Failed to fetch your ambulance requests:', error);
      setError('Failed to fetch your ambulance requests.');
    }
  };

  const getStatusBadge = (status) => {
    const colorClass =
      status === 'pending' ? 'badge-pending' :
      status === 'completed' ? 'badge-completed' :
      status === 'cancelled' ? 'badge-cancelled' :
      'badge-default';
    return <span className={`request-badge ${colorClass}`}>{status}</span>;
  };

  return (
    <div className="patient-dashboard-wrapper">
      {/* Sidebar */}
      <div className={`patient-sidebar ${sidebarOpen ? 'patient-sidebar--open' : ''}`}>
        <div className="patient-sidebar-header">
          <div className="patient-sidebar-title">
            <h2>Patient Portal</h2>
            <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
          </div>
        </div>

        <div className="patient-sidebar-user">
          <div className="patient-sidebar-user-avatar"><User size={24} /></div>
          <div>
            <div className="patient-sidebar-user-name">{user?.name || 'Patient'}</div>
            <div className="patient-sidebar-user-id">ID: {user?.id || 'N/A'}</div>
          </div>
        </div>

        <nav className="patient-sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleSidebarNavigation(item.path)}
                className="patient-nav-item"
              >
                <Icon size={18} className={item.color} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="patient-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="patient-main">
        <div className="ambulance-page">
          <div className="ambulance-header">
            <div className="ambulance-header-left">
              <div className="page-title">
                <div className="ambulance-title-with-sidebar">
                  <button className="patient-sidebar-toggle-main" onClick={() => setSidebarOpen(true)}>
                    <Menu size={20} />
                  </button>
                  <h1><Truck size={24} /> Request Ambulance</h1>
                </div>
              </div>
            </div>

            <div className="ambulance-header-right">
              <button 
                className="btn btn-secondary"
                onClick={fetchMyRequests}
              >
                <FileText size={16} /> View My Requests
              </button>
            </div>
          </div>

          {success && (
            <div className="success-message">
              <CheckCircle size={16} />
              Your ambulance request has been submitted successfully!
              <button onClick={() => setSuccess(false)}>×</button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertTriangle size={16} />
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div className="emergency-notice">
            <div className="emergency-icon"><Heart size={24} /></div>
            <div className="emergency-text">
              <h3>Emergency Services</h3>
              <p>For life-threatening emergencies, call <strong>911</strong> immediately.</p>
            </div>
          </div>

          {/* Ambulance Request Form */}
          <div className="request-form-container">
            <div className="form-header">
              <h2><Truck size={20} /> Ambulance Request Form</h2>
              <p>Please provide accurate information.</p>
            </div>

            <form onSubmit={handleSubmit} className="ambulance-request-form">
              <div className="form-section">
                <h3><MapPin size={18} /> Location Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Pickup Location *</label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Destination *</label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="City Hospital"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Requested Time</label>
                  <input
                    type="datetime-local"
                    name="requestedTime"
                    value={formData.requestedTime}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <small>Leave blank for immediate request</small>
                </div>
              </div>

              <div className="form-submit">
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Ambulance Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for My Requests */}
      {showMyRequestsModal && (
        <div className="modal-overlay" onClick={() => setShowMyRequestsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FileText size={20} /> My Ambulance Requests</h2>
              <button className="modal-close-button" onClick={() => setShowMyRequestsModal(false)}><X size={20} /></button>
            </div>
            {myRequests.length === 0 ? (
              <div className="no-requests">
                <Truck size={48} />
                <p>No ambulance requests found</p>
              </div>
            ) : (
              <div className="requests-list">
                {myRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-card-header">
                      <div className="request-info">
                        <h4>Request #{request.id.substring(0, 8)}</h4>
                        <div className="request-meta">
                          <Calendar size={14} />
                          {new Date(request.requestedTime).toLocaleString()}
                        </div>
                      </div>
                      <div className="request-badges">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>

                    <div className="request-card-body">
                      <div className="request-details">
                        <div className="detail-row">
                          <MapPin size={14} />
                          <span><strong>From:</strong> {request.pickupLocation}</span>
                        </div>
                        <div className="detail-row">
                          <MapPin size={14} />
                          <span><strong>To:</strong> {request.destination}</span>
                        </div>
                        {request.vehicleNumber && (
                          <div className="detail-row">
                            <Truck size={14} />
                            <span><strong>Vehicle:</strong> {request.vehicleNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceRequest;
