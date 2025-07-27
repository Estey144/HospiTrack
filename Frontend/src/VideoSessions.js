import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Video, 
  ArrowLeftCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Calendar,
  Clock,
  User,
  PhoneOff,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Monitor,
  MessageCircle,
  Menu,
  X,
  DollarSign,
  Shield,
  FileText,
  TestTube,
  Brain,
  MessageSquare,
  Activity
} from 'lucide-react';
import './PatientDashboard.css';

const VideoSessions = ({ currentUser }) => {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(3600); // 1 hour placeholder
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Session data - would be fetched from backend in real implementation
  const [upcomingSessions] = useState([]);
  const [pastSessions] = useState([]);
  const [availableDoctors] = useState([]);
  
  // Update user state when navigation state or URL params change
  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
    }
  }, [location.state, searchParams]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleProgressChange = (e) => {
    const clickX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const newTime = (clickX / width) * duration;
    setCurrentTime(newTime);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: '#10b981', text: 'Confirmed' },
      pending: { color: '#f59e0b', text: 'Pending' },
      completed: { color: '#6b7280', text: 'Completed' },
      cancelled: { color: '#ef4444', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{
        background: config.color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {config.text}
      </span>
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#d1d5db' }}>★</span>
    ));
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
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          fontFamily: 'Segoe UI, sans-serif',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '30px',
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                <button 
                  className="patient-sidebar-toggle-main"
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Menu size={20} />
                </button>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Video size={32} />
                  Video Consultation Hub
                </h1>
              </div>
              <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                Secure telemedicine consultations with healthcare providers
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleSidebarNavigation('/appointments')}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                <Calendar size={18} />
                Book Appointment
              </button>
              <button
                onClick={() => handleSidebarNavigation('/ambulance')}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                <Activity size={18} />
                Emergency Ambulance
              </button>
            </div>
          </div>

          {/* Video Player Interface */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            {/* Video Screen */}
            <div style={{
              position: 'relative',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {/* Coming Soon Overlay */}
              <div style={{
                textAlign: 'center',
                zIndex: 2
              }}>
                <Video size={120} style={{ opacity: 0.3, marginBottom: '20px' }} />
                <h2 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '600' }}>
                  Video Session Coming Soon
                </h2>
                <p style={{ fontSize: '18px', opacity: 0.8, margin: 0 }}>
                  Secure video consultations will be available shortly
                </p>
              </div>

              {/* Video Controls Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <button
                  onClick={togglePlay}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '14px', minWidth: '40px' }}>
                    {formatTime(currentTime)}
                  </span>
                  <div 
                    style={{
                      flex: 1,
                      height: '4px',
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                    onClick={handleProgressChange}
                  >
                    <div style={{
                      width: `${(currentTime / duration) * 100}%`,
                      height: '100%',
                      background: '#4f46e5',
                      borderRadius: '2px'
                    }} />
                  </div>
                  <span style={{ fontSize: '14px', minWidth: '40px' }}>
                    {formatTime(duration)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={toggleMute}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{ width: '80px' }}
                  />
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Settings size={20} />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <button
                onClick={() => setMicOn(!micOn)}
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: micOn ? '#10b981' : '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                onClick={() => setCameraOn(!cameraOn)}
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: cameraOn ? '#10b981' : '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
              </button>
              <button
                onClick={() => setScreenShare(!screenShare)}
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: screenShare ? '#4f46e5' : '#6b7280',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Monitor size={20} />
              </button>
              <button
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#6b7280',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MessageCircle size={20} />
              </button>
              <button
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* Session Management Tabs */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #f1f5f9',
              marginBottom: '25px'
            }}>
              {[
                { key: 'upcoming', label: 'Upcoming Sessions', count: 0 },
                { key: 'history', label: 'Session History', count: 0 },
                { key: 'doctors', label: 'Available Doctors', count: 0 }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.key ? '3px solid #4f46e5' : '3px solid transparent',
                    color: activeTab === tab.key ? '#4f46e5' : '#64748b',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'upcoming' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: '600' }}>
                  Upcoming Video Sessions
                </h3>
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <Calendar size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <p>No upcoming video sessions scheduled</p>
                  <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                    Book appointments through the Appointments page to schedule video consultations
                  </p>
                  <button
                    onClick={() => handleSidebarNavigation('/appointments')}
                    style={{
                      marginTop: '16px',
                      padding: '12px 24px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Appointments
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: '600' }}>
                  Previous Sessions
                </h3>
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <Clock size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <p>No session history available</p>
                  <p style={{ fontSize: '14px' }}>
                    Previous video consultation sessions will appear here
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: '600' }}>
                  Available Healthcare Providers
                </h3>
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <User size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <p>Doctor directory coming soon</p>
                  <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                    Healthcare provider profiles and availability will be integrated with the appointment system
                  </p>
                  <button
                    onClick={() => handleSidebarNavigation('/appointments')}
                    style={{
                      marginTop: '16px',
                      padding: '12px 24px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    View Appointments
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoSessions;
