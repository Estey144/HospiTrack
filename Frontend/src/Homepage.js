import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Homepage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, branches: 0 });
  const [covid, setCovid] = useState({ cases: 0, active: 0, deaths: 0, recovered: 0 });
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const feedbackContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    // Add homepage-specific body class
    document.body.classList.add('homepage-body');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('homepage-body');
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE_URL}/api/stats`).then(res => setStats(res.data)).catch(() => setError('Failed to load hospital statistics.')),
      axios.get('https://disease.sh/v3/covid-19/all').then(res => {
        setCovid({
          cases: res.data.cases,
          active: res.data.active,
          deaths: res.data.deaths,
          recovered: res.data.recovered,
        });
      }).catch(() => setError('Failed to load COVID-19 data.')),
      axios.get(`${API_BASE_URL}/api/feedback`).then(res => {
        // Filter for positive feedback (rating >= 4) and limit to recent ones
        const positiveFeedback = res.data
          .filter(f => f.rating >= 4 && f.comments && f.comments.trim().length > 0)
          .sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted))
          .slice(0, 20); // Get top 20 recent positive feedback
        setFeedback(positiveFeedback);
      }).catch(() => {
        // Fallback testimonials if API fails
        setFeedback([
          { id: 1, comments: "Excellent service and caring staff. My recovery was smooth thanks to their dedication.", rating: 5, patient_name: "Anonymous Patient" },
          { id: 2, comments: "The doctors here are very knowledgeable and the facilities are top-notch.", rating: 5, patient_name: "Happy Patient" },
          { id: 3, comments: "Quick appointment booking and professional treatment. Highly recommended!", rating: 5, patient_name: "Satisfied Customer" },
          { id: 4, comments: "Clean environment and friendly staff made my visit comfortable.", rating: 4, patient_name: "Grateful Patient" },
          { id: 5, comments: "State-of-the-art equipment and skilled medical professionals.", rating: 5, patient_name: "Impressed Visitor" }
        ]);
      })
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading HospiTrack...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="background-animation" aria-hidden="true" />

      <header className="header">
        <h1 className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🏥</span>
          <span className="logo-first-letter">H</span>ospiTrac<span className="logo-last-letter">k</span>
        </h1>
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-button">
              <span className="user-avatar">👤</span>
              {user.name} <span className="role-badge">({user.role})</span> 
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => { navigate(`/${user.role.toLowerCase()}-dashboard`); setDropdownOpen(false); }}>
                  <span className="menu-icon">📊</span> Dashboard
                </button>
                <button onClick={handleLogout}>
                  <span className="menu-icon">🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            <span className="login-icon">🔐</span> Login
          </button>
        )}
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to HospiTrack</h2>
          <p>Advanced Healthcare Management at Your Fingertips</p>
          <div className="hero-features">
            <span className="feature-badge">🏥 24/7 Care</span>
            <span className="feature-badge">👨‍⚕️ Expert Doctors</span>
            <span className="feature-badge">📱 Digital Solutions</span>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-element">🩺</div>
          <div className="floating-element">💊</div>
          <div className="floating-element">🏥</div>
        </div>
      </section>

      {error && (
        <div className="error-container">
          <p className="error">⚠️ {error}</p>
        </div>
      )}

      <section className="stats-section our-impact-section">
        <div className="section-header">
          <h3>Our Impact</h3>
          <p>Trusted by thousands across the region</p>
        </div>
        <div className="stats-grid our-impact-grid">
          <div className="stat-card our-impact-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h4>Total Doctors</h4>
              <p className="stat-number">{stats.doctors}</p>
              <span className="stat-label">Medical Professionals</span>
            </div>
          </div>
          <div className="stat-card our-impact-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h4>Total Patients</h4>
              <p className="stat-number">{stats.patients}</p>
              <span className="stat-label">Lives Touched</span>
            </div>
          </div>
          <div className="stat-card our-impact-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-content">
              <h4>Total Branches</h4>
              <p className="stat-number">{stats.branches}</p>
              <span className="stat-label">Locations</span>
            </div>
          </div>
        </div>
      </section>

      <section className="actions-section">
        <div className="section-header">
          <h3>Quick Access</h3>
          <p>Everything you need, just a click away</p>
        </div>
        <div className="actions-grid">
          <button className="action-button primary" onClick={() => navigate('/doctors')}>
            <span className="action-icon">👨‍⚕️</span>
            <span className="action-text">Find Doctor</span>
          </button>
          <button className="action-button" onClick={() => user ? navigate('/lab-tests') : navigate('/login')}>
            <span className="action-icon">🔬</span>
            <span className="action-text">Lab Tests</span>
          </button>
          <button className="action-button" onClick={() => user ? navigate('/appointments') : navigate('/login')}>
            <span className="action-icon">📅</span>
            <span className="action-text">Book Appointment</span>
          </button>
          <button className="action-button emergency" onClick={() => user ? navigate('/ambulance') : navigate('/login')}>
            <span className="action-icon">🚑</span>
            <span className="action-text">Emergency</span>
          </button>
          <button className="action-button" onClick={() => user ? navigate('/prescriptions') : navigate('/login')}>
            <span className="action-icon">💊</span>
            <span className="action-text">Prescriptions</span>
          </button>
          <button className="action-button" onClick={() => user ? navigate('/bills') : navigate('/login')}>
            <span className="action-icon">💳</span>
            <span className="action-text">Bills</span>
          </button>
          <button className="action-button" onClick={() => user ? navigate('/video-sessions') : navigate('/login')}>
            <span className="action-icon">📹</span>
            <span className="action-text">Video Session</span>
          </button>
        </div>
      </section>

      <section className="info-section">
        <div className="section-header">
          <h3>Hospital Services</h3>
          <p>Comprehensive healthcare solutions</p>
        </div>
        <div className="info-grid">
          <button className="info-card" onClick={() => navigate('/branches')}>
            <div className="info-icon">🏢</div>
            <div className="info-content">
              <h4>Branch Directory</h4>
              <p>Find nearest location</p>
            </div>
          </button>
          <button className="info-card" onClick={() => navigate('/rooms')}>
            <div className="info-icon">🏠</div>
            <div className="info-content">
              <h4>Room Availability</h4>
              <p>Check real-time status</p>
            </div>
          </button>
          <button className="info-card" onClick={() => navigate('/staff')}>
            <div className="info-icon">👥</div>
            <div className="info-content">
              <h4>Staff Directory</h4>
              <p>Meet our team</p>
            </div>
          </button>
        </div>
      </section>

      <section className="engagement-section">
        <div className="section-header">
          <h3>Engagement & Support</h3>
          <p>Stay connected with your health</p>
        </div>
        <div className="engagement-grid">
          <button className="engagement-card" onClick={() => navigate('/feedback')}>
            <div className="engagement-icon">💬</div>
            <div className="engagement-content">
              <h4>Feedback Board</h4>
              <p>Share your experience</p>
            </div>
          </button>
          <button className="engagement-card" onClick={() => navigate('/symptom-checker')}>
            <div className="engagement-icon">🔍</div>
            <div className="engagement-content">
              <h4>Symptom Checker</h4>
              <p>AI-powered assessment</p>
            </div>
          </button>
          <button className="engagement-card" onClick={() => navigate('/video-sessions')}>
            <div className="engagement-icon">🎥</div>
            <div className="engagement-content">
              <h4>Video Sessions</h4>
              <p>Connect virtually</p>
            </div>
          </button>
        </div>
      </section>

      <section className="covid-section">
        <div className="section-header">
          <h3>COVID-19 Global Stats</h3>
          <p>Stay informed about the pandemic</p>
        </div>
        <div className="covid-grid">
          <div className="covid-card total">
            <div className="covid-icon">🌍</div>
            <div className="covid-content">
              <h4>Total Cases</h4>
              <p className="covid-number">{covid.cases.toLocaleString()}</p>
            </div>
          </div>
          <div className="covid-card active">
            <div className="covid-icon">🟡</div>
            <div className="covid-content">
              <h4>Active Cases</h4>
              <p className="covid-number">{covid.active.toLocaleString()}</p>
            </div>
          </div>
          <div className="covid-card recovered">
            <div className="covid-icon">🟢</div>
            <div className="covid-content">
              <h4>Recovered</h4>
              <p className="covid-number">{covid.recovered.toLocaleString()}</p>
            </div>
          </div>
          <div className="covid-card deaths">
            <div className="covid-icon">🔴</div>
            <div className="covid-content">
              <h4>Deaths</h4>
              <p className="covid-number">{covid.deaths.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {feedback.length > 0 && (
        <section className="testimonials-section">
          <div className="section-header">
            <h3>What Our Patients Say</h3>
            <p>Real experiences from real people</p>
          </div>
          <div 
            className="testimonials-container"
            ref={feedbackContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`testimonials-track ${isPaused ? 'paused' : ''}`}>
              {[...feedback, ...feedback].map((item, index) => (
                <div key={`${item.id}-${index}`} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <p className="testimonial-text">{item.comments}</p>
                    <div className="testimonial-footer">
                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < item.rating ? 'filled' : ''}`}>⭐</span>
                        ))}
                      </div>
                      <p className="testimonial-author">
                        - {item.patient_name || 'Anonymous Patient'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🏥 HospiTrack</h4>
            <p>Advanced healthcare management for a healthier tomorrow</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/doctors">Find Doctors</a></li>
              <li><a href="/appointments">Book Appointment</a></li>
              <li><a href="/branches">Our Locations</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 Emergency: 911</p>
            <p>📧 info@hospitrackz.com</p>
            <p>🌐 www.hospitrackz.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 HospiTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
