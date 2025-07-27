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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const feedbackContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimeoutRef = useRef(null);
  const [animationKey, setAnimationKey] = useState(0);

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
    // Load data in background without showing loading screen
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
        // Filter for feedback (rating >= 3) to show variety in star ratings
        const goodFeedback = res.data
          .filter(f => f.rating >= 3 && f.comments && f.comments.trim().length > 0)
          .sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted))
          .slice(0, 20); // Get top 20 recent feedback
        
        // If no feedback found, use fallback testimonials
        if (goodFeedback.length === 0) {
          setFeedback([
            { id: 1, comments: "Excellent service and caring staff. My recovery was smooth thanks to their dedication.", rating: 5, patientName: "Anonymous Patient" },
            { id: 2, comments: "The doctors here are very knowledgeable and the facilities are top-notch.", rating: 5, patientName: "Happy Patient" },
            { id: 3, comments: "Quick appointment booking and professional treatment. Highly recommended!", rating: 4, patientName: "Satisfied Customer" },
            { id: 4, comments: "Clean environment and friendly staff made my visit comfortable.", rating: 4, patientName: "Grateful Patient" },
            { id: 5, comments: "Good experience overall, room for improvement in waiting times.", rating: 3, patientName: "Honest Patient" }
          ]);
        } else {
          setFeedback(goodFeedback);
        }
      }).catch(() => {
        // Fallback testimonials if API fails
        setFeedback([
          { id: 1, comments: "Excellent service and caring staff. My recovery was smooth thanks to their dedication.", rating: 5, patientName: "Anonymous Patient" },
          { id: 2, comments: "The doctors here are very knowledgeable and the facilities are top-notch.", rating: 5, patientName: "Happy Patient" },
          { id: 3, comments: "Quick appointment booking and professional treatment. Highly recommended!", rating: 4, patientName: "Satisfied Customer" },
          { id: 4, comments: "Clean environment and friendly staff made my visit comfortable.", rating: 4, patientName: "Grateful Patient" },
          { id: 5, comments: "Good experience overall, room for improvement in waiting times.", rating: 3, patientName: "Honest Patient" }
        ]);
      })
    ]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear timeout on cleanup
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
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
    setIsDragging(false);
    if (feedbackContainerRef.current) {
      feedbackContainerRef.current.style.cursor = 'grab';
    }
    // Clear any existing timeout and resume auto-scroll after a short delay
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    autoScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 1000);
  };

  // Drag scroll functionality
  const handleMouseDown = (e) => {
    if (!feedbackContainerRef.current) return;
    setIsDragging(true);
    setIsAutoScrolling(false); // Disable auto-scroll when dragging
    
    // Clear any existing timeout
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    
    setStartX(e.pageX - feedbackContainerRef.current.offsetLeft);
    setScrollLeft(feedbackContainerRef.current.scrollLeft);
    feedbackContainerRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !feedbackContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - feedbackContainerRef.current.offsetLeft;
    const walk = (x - startX) * 0.8; // Reduced from 2 to 0.8 for slower dragging
    feedbackContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (!feedbackContainerRef.current) return;
    setIsDragging(false);
    feedbackContainerRef.current.style.cursor = 'grab';
    
    // Clear any existing timeout and set a new one
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    
    // Re-enable auto-scroll after a delay, but force a restart
    autoScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(false); // First disable
      setAnimationKey(prev => prev + 1); // Force re-render to restart animation
      setTimeout(() => {
        setIsAutoScrolling(true); // Then enable to restart animation
      }, 50); // Small delay to force restart
    }, 2000); // 2 seconds delay before auto-scroll resumes
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
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h4>Total Patients</h4>
              <p className="stat-number">{stats.patients}</p>
              <span className="stat-label">Lives Touched</span>
            </div>
          </div>
          <div className="stat-card our-impact-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h4>Total Branches</h4>
              <p className="stat-number">{stats.branches}</p>
              <span className="stat-label">Locations</span>
            </div>
          </div>
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
          <button className="info-card" onClick={() => navigate('/doctors')}>
            <div className="info-icon">🥼</div>
            <div className="info-content">
              <h4>Doctor Directory</h4>
              <p>Find our medical professionals</p>
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
          <button
            className="engagement-card"
            onClick={() => user ? navigate('/appointments') : navigate('/login')}
          >
            <div className="engagement-icon">🗓️</div>
            <div className="engagement-content">
              <h4>Appointments</h4>
              <p>Schedule your visit</p>
            </div>
          </button>

          <button className="engagement-card" onClick={() => navigate('/symptom-checker')}>
            <div className="engagement-icon">🔍</div>
            <div className="engagement-content">
              <h4>Symptom Checker</h4>
              <p>AI-powered assessment</p>
            </div>
          </button>
          <button className="engagement-card" onClick={() => navigate('/staff')}>
            <div className="engagement-icon">👷‍♂️</div>
            <div className="engagement-content">
              <h4>Staff Directory</h4>
              <p>Meet our team</p>
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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div key={animationKey} className={`testimonials-track ${isPaused || !isAutoScrolling ? 'paused' : ''}`}>
              {[...feedback, ...feedback].map((item, index) => (
                <div key={`${item.id}-${index}`} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <p className="testimonial-text">{item.comments}</p>
                    <div className="testimonial-footer">
                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < item.rating ? 'filled' : ''}`}>
                            {i < item.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <p className="testimonial-author">
                        - {item.patientName || 'Anonymous Patient'}
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
