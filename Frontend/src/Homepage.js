// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Homepage.css';
// import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// const Homepage = () => {
//   const navigate = useNavigate();

//   // State for counts from backend
//   const [stats, setStats] = useState({
//     doctors: 0,
//     patients: 0,
//     branches: 0,
//   });

//   // State for covid info
//   const [covid, setCovid] = useState({
//     cases: 0,
//     active: 0,
//     deaths: 0,
//     recovered: 0,
//   });

//   // Loading and error states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch counts from your backend
//   const fetchStats = () => {
//     return axios.get(`${API_BASE_URL}/api/stats`)
//       .then(res => {
//         setStats(res.data);
//         setError('');
//       })
//       .catch(err => {
//         console.error('Error fetching stats:', err);
//         setError('Failed to load hospital statistics.');
//       });
//   };

//   // Fetch global covid data from external API
//   const fetchCovidStats = () => {
//     return axios.get('https://disease.sh/v3/covid-19/all')
//       .then(res => {
//         setCovid({
//           cases: res.data.cases,
//           active: res.data.active,
//           deaths: res.data.deaths,
//           recovered: res.data.recovered,
//         });
//         setError('');
//       })
//       .catch(err => {
//         console.error('Error fetching covid data:', err);
//         setError('Failed to load COVID-19 data.');
//       });
//   };

//   // Fetch both stats and covid data on mount
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([fetchStats(), fetchCovidStats()])
//       .finally(() => setLoading(false));
//   }, []);

//   // Render loading, error, or main content
//   if (loading) {
//     return <p>Loading data...</p>;
//   }

//   return (
//     <div className="homepage">
//       {/* Background animation */}
//       <div className="background-animation" aria-hidden="true" />

//       {/* Header */}
//       <header className="header">
//         <h1 className="logo">HospiTrack</h1>
//         <button className="login-button" onClick={() => navigate('/login')}>
//           Login
//         </button>
//       </header>

//       {/* Hero */}
//       <section className="hero">
//         <h2>Welcome to HospiTrack</h2>
//         <p>Bringing care to your fingertips</p>
//       </section>

//       {/* Error message */}
//       {error && <p className="error">{error}</p>}

//       {/* Stats Section */}
//       <section className="stats-section">
//         <div className="stat-card">
//           <h3>Total Doctors</h3>
//           <p>{stats.doctors}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Total Patients</h3>
//           <p>{stats.patients}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Total Branches</h3>
//           <p>{stats.branches}</p>
//         </div>
//       </section>

//       {/* Action Buttons */}
//       <section className="actions-section">
//         <h3>Quick Access</h3>
//         <div className="actions-grid">
//           <button className="action-button">Find Doctor</button>
//           <button className="action-button">See Test List</button>
//           <button className="action-button">Book Appointment</button>
//           <button className="action-button">Request Ambulance</button>
//           <button className="action-button">View Prescriptions</button>
//           <button className="action-button">See Bills</button>
//           <button className="action-button">Join Video Session</button>
//         </div>
//       </section>

//       {/* Hospital Services */}
//       <section className="info-section">
//         <h3>Hospital Services</h3>
//         <div className="info-grid">
//           <div className="info-card">Branch Directory</div>
//           <div className="info-card">Room Availability</div>
//           <div className="info-card">Staff Directory</div>
//         </div>
//       </section>

//       {/* Engagement & Support */}
//       <section className="info-section">
//         <h3>Engagement & Support</h3>
//         <div className="info-grid">
//           <div className="info-card">Feedback Board</div>
//           <div className="info-card">Symptom Checker</div>
//           <div className="info-card">Upcoming Video Sessions</div>
//         </div>
//       </section>

//       {/* COVID Section */}
//       <section className="covid-section">
//         <h3>COVID-19 Global Stats</h3>
//         <div className="covid-grid">
//           <div className="covid-card">
//             <h4>Total Cases</h4>
//             <p>{covid.cases.toLocaleString()}</p>
//           </div>
//           <div className="covid-card">
//             <h4>Active</h4>
//             <p>{covid.active.toLocaleString()}</p>
//           </div>
//           <div className="covid-card">
//             <h4>Recovered</h4>
//             <p>{covid.recovered.toLocaleString()}</p>
//           </div>
//           <div className="covid-card">
//             <h4>Deaths</h4>
//             <p>{covid.deaths.toLocaleString()}</p>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         © 2025 HospiTrack. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Homepage;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Homepage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, branches: 0 });
  const [covid, setCovid] = useState({ cases: 0, active: 0, deaths: 0, recovered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
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
      }).catch(() => setError('Failed to load COVID-19 data.'))
    ]).finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
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

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="homepage">
      <div className="background-animation" aria-hidden="true" />

      <header className="header">
        <h1 className="logo" onClick={() => navigate('/')}>HospiTrack</h1>
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-button">
              {user.name} ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => { navigate(`/${user.role.toLowerCase()}-dashboard`); setDropdownOpen(false); }}>
                  Dashboard
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </header>

      <section className="hero">
        <h2>Welcome to HospiTrack</h2>
        <p>Bringing care to your fingertips</p>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p>{stats.doctors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>{stats.patients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Branches</h3>
          <p>{stats.branches}</p>
        </div>
      </section>

      <section className="actions-section">
        <h3>Quick Access</h3>
        <div className="actions-grid">
          <button className="action-button" onClick={() => navigate('/doctors')}>
            Find Doctor
          </button>
          <button className="action-button" onClick={() => user ? navigate('/patient-dashboard#tests') : navigate('/login')}>
            See Test List
          </button>
          <button className="action-button" onClick={() => user ? navigate('/patient-dashboard#book-appointment') : navigate('/login')}>
            Book Appointment
          </button>
          <button className="action-button" onClick={() => user ? navigate('/patient-dashboard#ambulance-request') : navigate('/login')}>
            Request Ambulance
          </button>
          <button className="action-button" onClick={() => user ? navigate('/patient-dashboard#prescriptions') : navigate('/login')}>
            View Prescriptions
          </button>
          <button className="action-button" onClick={() => user ? navigate('/patient-dashboard#bills') : navigate('/login')}>
            See Bills
          </button>
          <button className="action-button" onClick={() => user ? navigate('/patient-dashboard#video-sessions') : navigate('/login')}>
            Join Video Session
          </button>
        </div>
      </section>

      <section className="info-section">
        <h3>Hospital Services</h3>
        <div className="info-grid">
          <button className="info-card" onClick={() => navigate('/branchdirectory')}>Branch Directory</button>
          <button className="info-card" onClick={() => navigate('/rooms')}>Room Availability</button>
          <button className="info-card" onClick={() => navigate('/staffdirectory')}>Staff Directory</button>
        </div>
      </section>

      <section className="info-section">
        <h3>Engagement & Support</h3>
        <div className="info-grid">
          <button className="info-card" onClick={() => navigate('/feedback')}>Feedback Board</button>
          <button className="info-card" onClick={() => navigate('/symptom-checker')}>Symptom Checker</button>
          <button className="info-card" onClick={() => navigate('/video-sessions')}>Upcoming Video Sessions</button>
        </div>
      </section>

      <section className="covid-section">
        <h3>COVID-19 Global Stats</h3>
        <div className="covid-grid">
          <div className="covid-card">
            <h4>Total Cases</h4>
            <p>{covid.cases.toLocaleString()}</p>
          </div>
          <div className="covid-card">
            <h4>Active</h4>
            <p>{covid.active.toLocaleString()}</p>
          </div>
          <div className="covid-card">
            <h4>Recovered</h4>
            <p>{covid.recovered.toLocaleString()}</p>
          </div>
          <div className="covid-card">
            <h4>Deaths</h4>
            <p>{covid.deaths.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <footer className="footer">© 2025 HospiTrack. All rights reserved.</footer>
    </div>
  );
};

export default Homepage;