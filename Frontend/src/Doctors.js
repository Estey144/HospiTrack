import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Doctors.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Doctors = ({ user }) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/doctors`)
      .then(res => {
        const normalized = res.data.map(doc => ({
          id: doc.DOCTORID,
          name: doc.DOCTORNAME,
          specialization: doc.SPECIALIZATION,
          experienceYears: doc.EXPERIENCEYEARS,
          branchName: doc.BRANCHNAME,
          imageUrl: doc.IMAGEURL,
          title: doc.TITLE
        }));
        setDoctors(normalized);
        setFilteredDoctors(normalized);
      })
      .catch(() => setError('Failed to load doctors'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBranch) {
      filtered = filtered.filter(doctor => doctor.branchName === selectedBranch);
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedBranch, selectedSpecialty, doctors]);

  const getRandomAvatar = (name) => {
    const avatars = [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(name),
      "https://api.dicebear.com/7.x/personas/svg?seed=" + encodeURIComponent(name),
      "https://api.dicebear.com/7.x/fun-emoji/svg?seed=" + encodeURIComponent(name)
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const branches = [...new Set(doctors.map(doctor => doctor.branchName))];
  const specialties = [...new Set(doctors.map(doctor => doctor.specialization))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-message">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="page-title">Select branch or department to find a specific doctor</h1>
            <button onClick={() => navigate('/')} className="homepage-btn">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Homepage
            </button>
          </div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Find a Doctor"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-toggle-container">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle-btn"
          >
            <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filter-options">
            <div className="filter-grid">
              <div className="filter-group">
                <label className="filter-label">Select Hospital/Branch</label>
                <select
                  className="filter-select"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Select Speciality</label>
                <select
                  className="filter-select"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialities</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-content">
        <h2 className="section-title">Our Specialists</h2>

        {filteredDoctors.length === 0 ? (
          <div className="no-results">
            <p>No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-card-content">
                  <div className="doctor-image-container">
                    <div className="doctor-image-wrapper">
                      <img
                        src={doctor.imageUrl || getRandomAvatar(doctor.name)}
                        alt={doctor.name}
                        className="doctor-image"
                        onError={(e) => {
                          e.target.src = getRandomAvatar(doctor.name);
                        }}
                      />
                    </div>
                  </div>

                  <div className="doctor-info">
                    <h3 className="doctor-name">{doctor.name}</h3>
                    <p className="doctor-title">{doctor.title || doctor.specialization}</p>

                    <div className="doctor-detail">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                      {doctor.experienceYears} years experience
                    </div>

                    <div className="doctor-detail">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9" />
                      </svg>
                      {doctor.branchName}
                    </div>

                    <button
                      className="appointment-btn"
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                        } else if (user.role?.toLowerCase() === 'doctor') {
                          alert('Doctors cannot book appointments.');
                        } else {
                          navigate('/appointments?book=true');
                        }
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
