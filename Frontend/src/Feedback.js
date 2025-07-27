import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Menu,
  X,
  User,
  Calendar,
  FileText,
  DollarSign,
  Shield,
  Activity,
  Video,
  TestTube,
  Brain,
  MessageSquare
} from 'lucide-react';
import './Feedback.css';
import './PatientDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Feedback = () => {
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
    
    // 3. From localStorage (fallback)
    return JSON.parse(localStorage.getItem('user') || '{}');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    targetType: 'Hospital',
    targetId: '',
    targetName: '',
    rating: 0,
    category: '',
    comments: '',
  });
  const [user, setUser] = useState(getUserFromParams());
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  // Navigation items for sidebar
  const navigationItems = [
    { path: '/patient-dashboard', label: 'Patient Dashboard', icon: User, color: 'text-blue-600' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText, color: 'text-cyan-600' },
    { path: '/bills', label: 'Bills', icon: DollarSign, color: 'text-yellow-600' },
    { path: '/medical-history', label: 'Medical History', icon: FileText, color: 'text-lime-600' },
    { path: '/insurance', label: 'Insurance', icon: Shield, color: 'text-sky-600' },
    { path: '/ambulance', label: 'Ambulance', icon: Activity, color: 'text-rose-600' },
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

  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
    }
  }, [location.state, searchParams]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);

    fetchDoctorsAndBranches();
  }, []);

  const fetchDoctorsAndBranches = async () => {
    try {
      const [doctorsRes, branchesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/doctors`),
        axios.get(`${API_BASE_URL}/api/branches`)
      ]);

      // Transform doctors data - backend already returns correct field names
      const doctorsData = doctorsRes.data
        .map(d => ({
          doctorId: d.doctorId,
          doctorName: d.doctorName,
          specialization: d.departmentName || ''
        }))
        .filter(doctor => 
          doctor.doctorId && 
          doctor.doctorName && 
          doctor.doctorName.trim() !== ''
        );

      console.log('Loaded doctors:', doctorsData);

      setDoctors(doctorsData);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Failed to fetch doctors/branches:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.targetType) newErrors.targetType = 'Please select feedback type';
    if (formData.targetType !== 'Hospital' && !formData.targetId) {
      newErrors.targetId = `Please select a ${formData.targetType.toLowerCase()}`;
    }
    if (!formData.rating || formData.rating === 0) newErrors.rating = 'Please provide a rating';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.comments.trim()) newErrors.comments = 'Please provide your feedback';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'targetType') {
      setFormData(prev => ({ ...prev, targetId: '', targetName: '' }));
    }

    if (name === 'targetId') {
      let targetName = '';
      if (formData.targetType === 'Doctor') {
        const doctor = doctors.find(d => d.doctorId.toString() === value.toString());
        targetName = doctor ? `Dr. ${doctor.doctorName}` : '';
      } else if (formData.targetType === 'Branch') {
        const branch = branches.find(b => b.id.toString() === value.toString());
        targetName = branch ? branch.name : '';
      }
      setFormData(prev => ({ ...prev, targetName }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const getRatingDescription = () => {
    const currentRating = hoverRating || formData.rating;
    const descriptions = {
      1: 'Poor - Very unsatisfied',
      2: 'Fair - Below expectations',
      3: 'Good - Meets expectations',
      4: 'Very Good - Above expectations',
      5: 'Excellent - Outstanding experience'
    };
    return descriptions[currentRating] || 'Please select a rating';
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Please login to submit feedback.');
      setMessageType('error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const feedbackData = {
        patientId: user.id,
        targetType: formData.targetType,
        targetId: formData.targetId || null,
        targetName: formData.targetName || 'Hospital',
        rating: formData.rating,
        category: formData.category,
        comments: formData.comments
      };

      await axios.post(`${API_BASE_URL}/api/feedback`, feedbackData);

      setMessage('Thank you for your valuable feedback! We appreciate your input.');
      setMessageType('success');

      setFormData({
        targetType: 'Hospital',
        targetId: '',
        targetName: '',
        rating: 0,
        category: '',
        comments: ''
      });
      setErrors({});

    } catch (err) {
      console.error('Feedback submission error:', err);
      setMessage('Failed to submit feedback. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackCategories = [
    { id: 'service', label: 'Service Quality', icon: '🏥' },
    { id: 'staff', label: 'Staff Behavior', icon: '👨‍⚕️' },
    { id: 'facilities', label: 'Facilities', icon: '🏢' },
    { id: 'cleanliness', label: 'Cleanliness', icon: '✨' },
    { id: 'waiting', label: 'Waiting Time', icon: '⏰' },
    { id: 'billing', label: 'Billing', icon: '💰' }
  ];

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
        <div className="feedback-page">
      <style jsx>{`
        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
          margin-bottom: 2rem;
        }
        
        .header-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .home-btn:hover {
          background: linear-gradient(135deg, #4CAF50, #45a049);
        }
        
        .dashboard-btn:hover {
          background: linear-gradient(135deg, #2196F3, #1976D2);
        }
        
        .btn-icon {
          font-size: 1.2rem;
        }
        
        .btn-text {
          font-weight: 600;
        }
        
        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .breadcrumb-current {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .current-icon {
          font-size: 1.2rem;
        }
        
        .current-text {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .header-icon-large {
          font-size: 4rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .header-text h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2.5rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header-text p {
          margin: 0;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
        }
        
        .feedback-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
      `}</style>
      
      <div className="page-header">
        <div className="header-nav">
          <div className="breadcrumb">
            <button 
              className="nav-btn home-btn" 
              onClick={() => navigate('/')}
            >
              <span className="btn-icon">🏠</span>
              <span className="btn-text">Home</span>
            </button>
            <span className="breadcrumb-separator">•</span>
            <button 
              className="nav-btn dashboard-btn" 
              onClick={() => navigate('/patient-dashboard')}
            >
              <span className="btn-icon">📊</span>
              <span className="btn-text">Dashboard</span>
            </button>
            <span className="breadcrumb-separator">•</span>
            <span className="breadcrumb-current">
              <span className="current-icon">💬</span>
              <span className="current-text">Feedback</span>
            </span>
          </div>
        </div>
        
        <div className="header-content">
          <button 
            className="patient-sidebar-toggle-main"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              marginRight: '1.5rem'
            }}
          >
            <Menu size={20} />
          </button>
          <div className="header-icon-large">💬</div>
          <div className="header-text">
            <h1>Patient Feedback</h1>
            <p>Share your experience to help us improve our services</p>
          </div>
        </div>
      </div>

      <div className="feedback-container">

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-form-section">
            <div className="feedback-form-row">
              <div className={`feedback-form-group required ${errors.targetType ? 'error' : ''}`}>
                <label>Feedback Type</label>
                <select 
                  name="targetType" 
                  value={formData.targetType} 
                  onChange={handleChange}
                  required
                >
                  <option value="Hospital">General Hospital Experience</option>
                  <option value="Doctor">Specific Doctor</option>
                  <option value="Branch">Hospital Branch</option>
                </select>
                {errors.targetType && <span className="feedback-form-error">{errors.targetType}</span>}
              </div>

              {formData.targetType === 'Doctor' && (
                <div className={`feedback-form-group required ${errors.targetId ? 'error' : ''}`}>
                  <label>Select Doctor</label>
                  <select
                    name="targetId"
                    value={formData.targetId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.length === 0 ? (
                      <option disabled>Loading doctors...</option>
                    ) : (
                      doctors.map(doctor => (
                        <option key={doctor.doctorId} value={doctor.doctorId}>
                          Dr. {doctor.doctorName}
                          {doctor.specialization && ` - ${doctor.specialization}`}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.targetId && <span className="feedback-form-error">{errors.targetId}</span>}
                </div>
              )}

              {formData.targetType === 'Branch' && (
                <div className={`feedback-form-group required ${errors.targetId ? 'error' : ''}`}>
                  <label>Select Branch</label>
                  <select
                    name="targetId"
                    value={formData.targetId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a branch</option>
                    {branches.map(branch => (
                      <option key={`branch-${branch.id}`} value={branch.id}>
                        {branch.name} - {branch.address}
                      </option>
                    ))}
                  </select>
                  {errors.targetId && <span className="feedback-form-error">{errors.targetId}</span>}
                </div>
              )}
            </div>

            <div className={`feedback-rating-group ${errors.rating ? 'error' : ''}`}>
              <label className="feedback-rating-label">Overall Rating</label>
              <div className="feedback-rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`feedback-star ${star <= (hoverRating || formData.rating) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <div className={`feedback-rating-description ${(hoverRating || formData.rating) ? 'visible' : ''}`}>
                {getRatingDescription()}
              </div>
              {errors.rating && <span className="feedback-form-error">{errors.rating}</span>}
            </div>

            <div className={`feedback-form-group required ${errors.category ? 'error' : ''}`}>
              <label>Feedback Category</label>
              <div className="feedback-category-grid">
                {feedbackCategories.map(cat => (
                  <div
                    key={cat.id}
                    className={`feedback-category-item ${formData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span className="feedback-category-icon">{cat.icon}</span>
                    <span className="feedback-category-label">{cat.label}</span>
                  </div>
                ))}
              </div>
              {errors.category && <span className="feedback-form-error">{errors.category}</span>}
            </div>

            <div className={`feedback-form-group required ${errors.comments ? 'error' : ''}`}>
              <label>Your Feedback</label>
              <textarea
                name="comments"
                rows="5"
                placeholder="Please share your detailed experience, suggestions for improvement, or any concerns you may have..."
                value={formData.comments}
                onChange={handleChange}
                required
              />
              {errors.comments && <span className="feedback-form-error">{errors.comments}</span>}
            </div>

            <button 
              type="submit" 
              className={`feedback-submit-btn ${submitting ? 'loading' : ''}`}
              disabled={submitting}
            >
              {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
            </button>

            {message && (
              <div className={`feedback-message ${messageType}`}>
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Feedback;