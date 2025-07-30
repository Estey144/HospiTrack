

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Branches.css';
import { axiosCompatible } from './utils/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Branches = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axiosCompatible.get(`${API_BASE_URL}/api/branches`);
      setBranches(response.data);
      setFilteredBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      alert('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredBranches(branches);
      return;
    }

    try {
      setSearching(true);
      const response = await axiosCompatible.get(`${API_BASE_URL}/api/branches/search`, {
        params: { query: query.trim() }
      });
      setFilteredBranches(response.data);
    } catch (error) {
      console.error('Error searching branches:', error);
      // Fallback to client-side filtering
      const filtered = branches.filter(branch => {
        const name = branch.name || '';
        const address = branch.address || '';
        return name.toLowerCase().includes(query.toLowerCase()) ||
          address.toLowerCase().includes(query.toLowerCase());
      });

      setFilteredBranches(filtered);
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContactType = (type) => {
    switch (type?.toLowerCase()) {
      case 'phone':
        return 'Phone';
      case 'mobile':
        return 'Mobile';
      case 'fax':
        return 'Fax';
      case 'emergency':
        return 'Emergency';
      default:
        return type || 'Contact';
    }
  };

  const openBranchModal = (branch) => {
    setSelectedBranch(branch);
    setShowBranchModal(true);
  };

  const closeBranchModal = () => {
    setSelectedBranch(null);
    setShowBranchModal(false);
  };

  const getEmergencyContact = (contacts) => {
    if (!contacts || contacts.length === 0) return null;
    return contacts.find(contact => contact.type?.toLowerCase() === 'emergency') || contacts[0];
  };

  if (loading) {
    return (
      <div className="branches-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading hospital branches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="branches-page">
      <div className="branch-page-header">
        <div className="header-main">
          <h1>Discover Our Healthcare Network</h1>
          <button onClick={() => navigate('/')} className="homepage-btn">
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Homepage
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search branches by name or address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">
            {searching ? (
              <div className="search-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="results-info">
        <span className="results-count">
          {filteredBranches.length} {filteredBranches.length === 1 ? 'branch' : 'branches'} found
        </span>
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => handleSearch('')}
          >
            Clear search
          </button>
        )}
      </div>

      <div className="branches-grid">
        {filteredBranches.length === 0 ? (
          <div className="no-results">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No branches found</h3>
            <p>Try adjusting your search terms or browse all branches</p>
          </div>
        ) : (
          filteredBranches.map(branch => {
            const emergencyContact = getEmergencyContact(branch.contacts);
            return (
              <div key={branch.id} className="branch-card">
                <div className="branch-header">
                  <h2 className="branch-name">{branch.name}</h2>
                </div>

                <div className="branch-content">
                  <div className="branch-info">
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span className="info-text">{branch.address}</span>
                    </div>

                    {emergencyContact && (
                      <div className="info-item emergency-contact">
                        <span className="info-icon">🚨</span>
                        <div className="contact-info">
                          <span className="contact-label">Emergency Contact:</span>
                          <span className="contact-number">{emergencyContact.contactNumber}</span>
                        </div>
                      </div>
                    )}

                    <button 
                      className="view-details-btn"
                      onClick={() => openBranchModal(branch)}
                    >
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Branch Detail Modal */}
      {showBranchModal && selectedBranch && (
        <div className="modal-overlay" onClick={closeBranchModal}>
          <div className="branch-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBranch.name}</h2>
              <button className="modal-close" onClick={closeBranchModal}>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="modal-info-text">
                    <h4>Address</h4>
                    <p>{selectedBranch.address}</p>
                  </div>
                </div>

                <div className="modal-info-item">
                  <div className="modal-info-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="modal-info-text">
                    <h4>Established</h4>
                    <p>{formatDate(selectedBranch.establishedDate)}</p>
                  </div>
                </div>

                {selectedBranch.contacts && selectedBranch.contacts.length > 0 && (
                  <div className="modal-info-item full-width">
                    <div className="modal-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="modal-info-text">
                      <h4>Contact Information</h4>
                      <div className="contacts-grid">
                        {selectedBranch.contacts.map(contact => (
                          <div key={contact.id} className="contact-detail">
                            <span className="contact-type">{formatContactType(contact.type)}:</span>
                            <span className="contact-number">{contact.contactNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;