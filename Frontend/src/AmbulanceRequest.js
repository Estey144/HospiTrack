import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Truck,
  Phone,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  Activity,
  CheckCircle,
  Send,
  Calendar,
  FileText,
  Heart,
  Menu,
  X,
  DollarSign,
  Shield,
  TestTube,
  Video,
  Brain,
  MessageSquare
} from 'lucide-react';
import './AmbulanceRequest.css';
import './PatientDashboard.css';

const AmbulanceRequest = ({ currentUser }) => {
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
  
  // Debug logging to verify user ID is received
  useEffect(() => {
    console.log('AmbulanceRequest page - User ID from params:', searchParams.get('userId'));
    console.log('AmbulanceRequest page - User from state:', location.state?.user);
    console.log('AmbulanceRequest page - Current user:', user);
  }, [searchParams, location.state, user]);

  // Update user state when navigation state or URL params change
  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
      console.log('AmbulanceRequest page - User updated:', newUser);
    }
  }, [location.state, searchParams]);
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items for sidebar
  const navigationItems = [
    { path: '/patient-dashboard', label: 'Patient Dashboard', icon: User, color: 'text-blue-600' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText, color: 'text-cyan-600' },
    { path: '/bills', label: 'Bills', icon: DollarSign, color: 'text-yellow-600' },
    { path: '/medical-history', label: 'Medical History', icon: FileText, color: 'text-lime-600' },
    { path: '/insurance', label: 'Insurance', icon: Shield, color: 'text-sky-600' },
    { path: '/ambulance', label: 'Ambulance', icon: Truck, color: 'text-rose-600' },
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
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientPhone: user?.phone || '',
    emergencyContact: '',
    emergencyContactName: '',
    pickupLocation: '',
    destination: '',
    priority: 'medium',
    description: '',
    medicalCondition: '',
    specialRequirements: '',
    requestedTime: ''
  });

  // Sample patient requests history - would normally be fetched based on user ID
  const getMyRequests = () => [
    {
      id: 'AMB001',
      patientId: user?.id || 'PAT-001', // Use actual user ID
      requestNumber: 'AMB-2025-001',
      pickupLocation: '123 Main St, Downtown',
      destination: 'City General Hospital',
      priority: 'high',
      status: 'completed',
      description: 'Chest pain, difficulty breathing',
      requestedTime: '2025-01-20T14:30:00',
      completedTime: '2025-01-20T15:45:00'
    },
    {
      id: 'AMB002',
      patientId: user?.id || 'PAT-001', // Use actual user ID
      requestNumber: 'AMB-2025-002',
      pickupLocation: '456 Oak Ave, Riverside',
      destination: 'St. Mary\'s Medical Center',
      priority: 'medium',
      status: 'assigned',
      description: 'Broken leg from fall',
      requestedTime: '2025-01-22T10:15:00',
      estimatedArrival: '2025-01-22T10:35:00',
      ambulanceId: 'AMB-UNIT-05',
      driverName: 'Mike Johnson'
    }
  ];

  // Initialize data
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        // Simulate API call to get patient's request history
        await new Promise(resolve => setTimeout(resolve, 500));
        setMyRequests(getMyRequests());
      } catch (err) {
        console.error('Failed to fetch requests');
      }
    };
    
    if (user?.id) {
      fetchMyRequests();
    }
  }, [user?.id]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: user.name || prev.patientName,
        patientPhone: user.phone || prev.patientPhone
      }));
    }
  }, [user]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to submit ambulance request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new request to history
      const newRequest = {
        id: `AMB${String(myRequests.length + 1).padStart(3, '0')}`,
        patientId: user?.id || 'PAT-001', // Use actual user ID
        requestNumber: `AMB-2025-${String(myRequests.length + 1).padStart(3, '0')}`,
        pickupLocation: formData.pickupLocation,
        destination: formData.destination,
        priority: formData.priority,
        status: 'pending',
        description: formData.description,
        requestedTime: formData.requestedTime || new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };
      
      setMyRequests(prev => [newRequest, ...prev]);
      setSuccess(true);
      
      // Reset form
      setFormData({
        patientName: '',
        patientPhone: '',
        emergencyContact: '',
        emergencyContactName: '',
        pickupLocation: '',
        destination: '',
        priority: 'medium',
        description: '',
        medicalCondition: '',
        specialRequirements: '',
        requestedTime: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError('Failed to submit ambulance request. Please try again.');
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: Clock, text: 'Pending' },
      assigned: { color: 'info', icon: Truck, text: 'Assigned' },
      completed: { color: 'success', icon: CheckCircle, text: 'Completed' },
      cancelled: { color: 'danger', icon: AlertTriangle, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`status-badge status-badge--${config.color}`}>
        <Icon size={14} />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'danger', icon: AlertTriangle, text: 'High Priority' },
      medium: { color: 'warning', icon: Activity, text: 'Medium Priority' },
      low: { color: 'success', icon: CheckCircle, text: 'Low Priority' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    const Icon = config.icon;

    return (
      <span className={`priority-badge priority-badge--${config.color}`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  return (
    <div className="patient-dashboard-wrapper">
      {/* Sidebar */}
      <div className={`patient-sidebar ${sidebarOpen ? 'patient-sidebar--open' : ''}`}>
        <div className="patient-sidebar-header">
          <div className="patient-sidebar-title">
            <div className="patient-sidebar-title-text">
              <h2>Patient Portal</h2>
            </div>
            <button 
              className="patient-sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="patient-sidebar-user">
          <div className="patient-sidebar-user-avatar">
            <User size={24} />
          </div>
          <div>
            <div className="patient-sidebar-user-name">{user?.name || 'Patient'}</div>
            <div className="patient-sidebar-user-id">ID: {user?.id || 'N/A'}</div>
          </div>
        </div>

        <nav className="patient-sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleSidebarNavigation(item.path)}
                className={`patient-nav-item ${isActive ? 'patient-nav-item--active' : ''}`}
              >
                <Icon size={18} className={`patient-nav-icon ${item.color}`} />
                <span className="patient-nav-label">{item.label}</span>
                {isActive && <div className="patient-nav-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="patient-sidebar-footer">
          <button 
            onClick={() => navigate('/', { state: { user } })}
            className="patient-home-button"
          >
            <User size={16} />
            Go to Homepage
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="patient-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="patient-main">
        <div className="ambulance-page">
          {/* Header */}
          <div className="ambulance-header">
            <div className="ambulance-header-left">
              <div className="page-title">
                <div className="ambulance-title-with-sidebar">
                  <button 
                    className="patient-sidebar-toggle-main"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu size={20} />
                  </button>
                  <h1>
                    <Truck size={24} />
                    Request Ambulance
                  </h1>
                </div>
              </div>
            </div>
            <div className="ambulance-header-right">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowMyRequests(!showMyRequests)}
              >
                <FileText size={16} />
                {showMyRequests ? 'Hide' : 'View'} My Requests
              </button>
            </div>
          </div>

      {/* Success Message */}
      {success && (
        <div className="success-message">
          <CheckCircle size={16} />
          Your ambulance request has been submitted successfully! We will contact you shortly.
          <button onClick={() => setSuccess(false)}>×</button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertTriangle size={16} />
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Emergency Notice */}
      <div className="emergency-notice">
        <div className="emergency-icon">
          <Heart size={24} />
        </div>
        <div className="emergency-text">
          <h3>Emergency Services</h3>
          <p>For life-threatening emergencies, call <strong>911</strong> immediately. This form is for scheduled and non-critical ambulance requests.</p>
        </div>
      </div>

      {/* Request Form */}
      <div className="request-form-container">
        <div className="form-header">
          <h2>
            <Truck size={20} />
            Ambulance Request Form
          </h2>
          <p>Please provide accurate information for your ambulance request</p>
        </div>

        <form onSubmit={handleSubmit} className="ambulance-request-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3>
              <User size={18} />
              Personal Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Patient Phone *</label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  placeholder="+1-555-0123"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Contact person's name"
                />
              </div>
              
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="+1-555-0124"
                />
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="form-section">
            <h3>
              <MapPin size={18} />
              Location Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Pickup Location *</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, State, ZIP"
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
                  placeholder="Hospital or medical facility name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="form-section">
            <h3>
              <Heart size={18} />
              Medical Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Priority Level *</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low Priority - Routine Transport</option>
                  <option value="medium">Medium Priority - Non-Emergency</option>
                  <option value="high">High Priority - Urgent (Not Life-Threatening)</option>
                </select>
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

            <div className="form-group">
              <label>Medical Condition</label>
              <input
                type="text"
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleInputChange}
                placeholder="Brief description of medical condition"
              />
            </div>

            <div className="form-group">
              <label>Description of Situation *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Please describe the situation, symptoms, or reason for ambulance request..."
                required
              />
            </div>

            <div className="form-group">
              <label>Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special equipment needed (wheelchair, oxygen, stretcher, etc.)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit">
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Submitting Request...
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

      {/* My Requests Section */}
      {showMyRequests && (
        <div className="my-requests-container">
          <div className="my-requests-header">
            <h2>
              <FileText size={20} />
              My Ambulance Requests
            </h2>
            <p>Track your recent ambulance requests</p>
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
                      <h4>Request #{request.requestNumber}</h4>
                      <div className="request-meta">
                        <Calendar size={14} />
                        {new Date(request.requestedTime).toLocaleString()}
                      </div>
                    </div>
                    <div className="request-badges">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
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
                      {request.description && (
                        <div className="detail-row">
                          <FileText size={14} />
                          <span><strong>Description:</strong> {request.description}</span>
                        </div>
                      )}
                      {request.estimatedArrival && (
                        <div className="detail-row">
                          <Clock size={14} />
                          <span><strong>Estimated Arrival:</strong> {new Date(request.estimatedArrival).toLocaleString()}</span>
                        </div>
                      )}
                      {request.ambulanceId && (
                        <div className="detail-row">
                          <Truck size={14} />
                          <span><strong>Ambulance:</strong> {request.ambulanceId}</span>
                        </div>
                      )}
                      {request.driverName && (
                        <div className="detail-row">
                          <User size={14} />
                          <span><strong>Driver:</strong> {request.driverName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AmbulanceRequest;
