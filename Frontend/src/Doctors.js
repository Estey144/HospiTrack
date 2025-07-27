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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/doctors`)
      .then(res => {
        const normalized = res.data.map(doc => ({
          id: doc.DOCTORID,
          name: doc.DOCTORNAME,
          specialization: doc.DEPARTMENTNAME || doc.SPECIALIZATION, // Use DEPARTMENTNAME from API
          experienceYears: doc.EXPERIENCEYEARS,
          branchName: doc.BRANCHNAME,
          imageUrl: doc.IMAGEURL,
          title: doc.TITLE || `${doc.DEPARTMENTNAME} Specialist`,
          availableHours: doc.AVAILABLEHOURS,
          licenseNumber: doc.LICENSENUMBER
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
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.branchName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const closeDoctorModal = () => {
    setSelectedDoctor(null);
    setShowDoctorModal(false);
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
            <h1 className="page-title">Find Your Perfect Healthcare Specialist</h1>
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
              placeholder="Search doctors by name, specialty, or department..."
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
                <label className="filter-label">Hospital Branch</label>
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
                <label className="filter-label">Medical Department</label>
                <select
                  className="filter-select"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Departments</option>
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
        <h2 className="section-title">Meet Our Expert Medical Team</h2>

        {filteredDoctors.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">👨‍⚕️</div>
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria or browse all available specialists.</p>
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedBranch('');
                setSelectedSpecialty('');
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card" onClick={() => openDoctorModal(doctor)}>
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
                    <p className="doctor-title">{doctor.title || `${doctor.specialization} Specialist`}</p>

                    <div className="doctor-detail">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                      {doctor.experienceYears} years experience
                    </div>

                    <div className="doctor-detail">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {doctor.branchName}
                    </div>

                    <div className="click-hint">
                      Click to view full profile
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Detail Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="modal-overlay" onClick={closeDoctorModal}>
          <div className="doctor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-doctor-image">
                <img
                  src={selectedDoctor.imageUrl || getRandomAvatar(selectedDoctor.name)}
                  alt={selectedDoctor.name}
                  onError={(e) => {
                    e.target.src = getRandomAvatar(selectedDoctor.name);
                  }}
                />
              </div>
              <div className="modal-doctor-basic">
                <h2>{selectedDoctor.name}</h2>
                <p className="modal-doctor-title">{selectedDoctor.title || `${selectedDoctor.specialization} Specialist`}</p>
              </div>
              <button className="modal-close" onClick={closeDoctorModal}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <div className="modal-info-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="modal-info-text">
                    <h4>Department</h4>
                    <p>{selectedDoctor.specialization}</p>
                  </div>
                </div>

                <div className="modal-info-item">
                  <div className="modal-info-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    </svg>
                  </div>
                  <div className="modal-info-text">
                    <h4>Experience</h4>
                    <p>{selectedDoctor.experienceYears} years</p>
                  </div>
                </div>

                <div className="modal-info-item">
                  <div className="modal-info-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="modal-info-text">
                    <h4>Location</h4>
                    <p>{selectedDoctor.branchName}</p>
                  </div>
                </div>

                {selectedDoctor.availableHours && (
                  <div className="modal-info-item">
                    <div className="modal-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="modal-info-text">
                      <h4>Available Hours</h4>
                      <p>{selectedDoctor.availableHours}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="modal-appointment-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      navigate('/login');
                    } else if (user.role?.toLowerCase() === 'doctor') {
                      alert('Doctors cannot book appointments.');
                    } else {
                      navigate('/appointments?book=true');
                    }
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
