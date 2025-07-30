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
  DollarSign,
  Shield,
  Video,
  TestTube,
  Brain,
  MessageSquare,
  Home,
  Ambulance,
} from 'lucide-react';

import './AmbulanceRequest.css';
import './PatientDashboard.css';
import { axiosCompatible } from './utils/api';

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
  const [hospitalBranches, setHospitalBranches] = useState([]);

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
    setSidebarOpen(false);
  };

  // Fetch hospital branches
  const fetchHospitalBranches = async () => {
    try {
      const response = await axiosCompatible.get('http://localhost:8080/api/branches');

      const normalizedBranches = response.data.map((branch) => ({
        id: branch.id ?? branch.BRANCHID ?? branch.branch_id,
        name: branch.name ?? branch.BRANCHNAME ?? branch.branch_name,
        location: branch.location ?? branch.LOCATION,
        address: branch.address ?? branch.ADDRESS
      }));

      setHospitalBranches(normalizedBranches);
    } catch (error) {
      console.error('Failed to fetch hospital branches:', error);
      // Use mock data when API fails
      const mockBranches = [
        { id: 'b001', name: 'Dhaka Medical Branch', address: 'Azimpur, Dhaka', location: 'Dhaka' },
        { id: 'b002', name: 'Mirpur Branch', address: 'Mirpur-10, Dhaka', location: 'Dhaka' },
        { id: 'b003', name: 'Gulshan Branch', address: 'Gulshan-2, Dhaka', location: 'Dhaka' },
        { id: 'b004', name: 'Rajshahi Branch', address: 'Kazla, Rajshahi', location: 'Rajshahi' },
        { id: 'b005', name: 'Chittagong Branch', address: 'Agrabad, Chittagong', location: 'Chittagong' },
        { id: 'b006', name: 'Sylhet Branch', address: 'Zindabazar, Sylhet', location: 'Sylhet' }
      ];
      setHospitalBranches(mockBranches);
    }
  };

  // Load hospital branches on component mount
  useEffect(() => {
    fetchHospitalBranches();
  }, []);

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
      // Extract just the hospital name from the selected value
      const destinationName = formData.destination.split(' - ')[0];
      
      const response = await axiosCompatible.post('/api/ambulance-requests', {
        userId: user?.id,
        pickupLocation: formData.pickupLocation,
        dropLocation: destinationName,
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
      const response = await axiosCompatible.get(`/api/ambulance-requests/user/${user.id}`);

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
                      placeholder="ECE, BUET"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Destination Hospital *</label>
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Hospital Branch</option>
                      {hospitalBranches.map(branch => (
                        <option key={branch.id} value={`${branch.name} - ${branch.address}`}>
                          {branch.name} - {branch.location || branch.address}
                        </option>
                      ))}
                    </select>
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
          <div className="modal-content ambulance-requests-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon">
                  <Truck size={24} />
                </div>
                <div className="modal-title-text">
                  <h2>My Ambulance Requests</h2>
                  <p>Track your ambulance service requests</p>
                </div>
              </div>
              <button className="modal-close-button" onClick={() => setShowMyRequestsModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {myRequests.length === 0 ? (
                <div className="no-requests">
                  <div className="no-requests-icon">
                    <Truck size={48} />
                  </div>
                  <div className="no-requests-text">
                    <h3>No Requests Found</h3>
                    <p>You haven't made any ambulance requests yet.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="requests-summary">
                    <div className="summary-item">
                      <span className="summary-count">{myRequests.length}</span>
                      <span className="summary-label">Total Requests</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-count">{myRequests.filter(r => r.status === 'pending').length}</span>
                      <span className="summary-label">Pending</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-count">{myRequests.filter(r => r.status === 'completed').length}</span>
                      <span className="summary-label">Completed</span>
                    </div>
                  </div>
                  
                  <div className="requests-list">
                    {myRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-card-header">
                          <div className="request-status-section">
                            <div className="request-status-indicator">
                              {request.status === 'pending' ? '⏳' : 
                               request.status === 'completed' ? '✅' : 
                               request.status === 'cancelled' ? '❌' : '📋'}
                            </div>
                            <div className="request-status-info">
                              <span className="request-id">Request #{request.id.substring(0, 8).toUpperCase()}</span>
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                          <div className="request-timestamp">
                            <Clock size={14} />
                            <span>{new Date(request.requestedTime).toLocaleDateString()}</span>
                            <span className="time-detail">{new Date(request.requestedTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>

                        <div className="request-card-body">
                          <div className="location-journey">
                            <div className="location-point pickup-point">
                              <div className="location-icon">📍</div>
                              <div className="location-details">
                                <span className="location-label">Pickup Location</span>
                                <span className="location-address">{request.pickupLocation}</span>
                              </div>
                            </div>
                            
                            <div className="journey-line">
                              <div className="journey-arrow">→</div>
                            </div>
                            
                            <div className="location-point destination-point">
                              <div className="location-icon">🏥</div>
                              <div className="location-details">
                                <span className="location-label">Destination</span>
                                <span className="location-address">{request.destination}</span>
                              </div>
                            </div>
                          </div>
                          
                          {request.vehicleNumber && (
                            <div className="vehicle-info">
                              <div className="vehicle-badge">
                                <Truck size={16} />
                                <span className="vehicle-label">Assigned Vehicle:</span>
                                <span className="vehicle-number">{request.vehicleNumber}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="request-footer">
                            <div className="request-priority">
                              {request.requestedTime ? (
                                <span className="scheduled-request">
                                  <Calendar size={12} />
                                  Scheduled Request
                                </span>
                              ) : (
                                <span className="immediate-request">
                                  <AlertTriangle size={12} />
                                  Immediate Request
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceRequest;
