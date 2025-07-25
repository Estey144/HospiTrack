

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Branches.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Branches = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/branches`);
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
      const response = await axios.get(`${API_BASE_URL}/api/branches/search`, {
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
          <h1>Hospital Branches</h1>
          <p className="page-subtitle">Find and explore our hospital network</p>
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
          filteredBranches.map(branch => (
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

                  <div className="contacts-section">
                    <span className="section-title">Contact Information</span>
                    {branch.contacts && branch.contacts.length > 0 ? (
                      <div className="contacts-list">
                        {branch.contacts.map(contact => (
                          <div key={contact.id} className="contact-item">
                            <span className="contact-type">{formatContactType(contact.type)}:</span>
                            <span className="contact-number">{contact.contactNumber}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-contacts">
                        <span className="info-text">No contact information available</span>
                      </div>
                    )}
                  </div>

                  <div className="info-item establishment-date">
                    <span className="info-icon">🏥</span>
                    <span className="info-text">Established: {formatDate(branch.establishedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Branches;