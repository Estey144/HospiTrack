import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FlaskConical, 
  ArrowLeft, 
  Home, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  FileText,
  Info,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './LabTests.css';

const LabTests = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId || null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');  // Not used much but kept for UI consistency
  const [filterDate, setFilterDate] = useState('all');      // You can remove filters not supported by your data
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedTest, setExpandedTest] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestDetails, setShowTestDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [labTests, setLabTests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('No user ID provided.');
      return;
    }

    const fetchLabTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8080/api/lab-tests/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch lab tests');
        const data = await response.json();
        setLabTests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [userId]);

  // Simple search & filter based on available fields
  const filteredTests = labTests
    .filter(test => {
      const matchesSearch = test.testType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Since your backend data doesn't have 'status' or 'date' filters, just ignore those filters
      return matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date-desc': return new Date(b.testDate) - new Date(a.testDate);
        case 'date-asc': return new Date(a.testDate) - new Date(b.testDate);
        case 'test-type': return (a.testType || '').localeCompare(b.testType || '');
        default: return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleTestExpansion = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  const handleViewTest = (test) => {
    setSelectedTest(test);
    setShowTestDetails(true);
  };

  if (loading) {
    return (
      <div className="lab-tests-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading lab test results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lab-tests-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="lab-tests-page">
      {/* Header */}
      <div className="lab-tests-header">
        <div className="lab-tests-header-left">
          <div className="navigation-buttons">
            <button className="lab-nav-button lab-nav-button--secondary" onClick={() => navigate('/patient-dashboard')}>
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button className="lab-nav-button lab-nav-button--outline" onClick={() => navigate('/')}>
              <Home size={16} />
              Home
            </button>
          </div>
          <div className="lab-page-title">
            <h1><FlaskConical size={24} /> Lab Tests & Results</h1>
            <p>View your laboratory test results and reports</p>
          </div>
        </div>
        <div className="lab-tests-header-right">
          <button className="btn btn-outline">
            <Download size={16} />
            Export Results
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="lab-tests-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by test type, doctor, or test ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lab Tests */}
      <div className="lab-tests-container">
        {filteredTests.length === 0 ? (
          <div className="no-data">
            <FlaskConical size={64} />
            <p>No lab tests found</p>
            <span>Try adjusting your search or filter criteria</span>
          </div>
        ) : (
          filteredTests.map((test) => (
            <div key={test.id} className="lab-test-card">
              <div className="test-header" onClick={() => toggleTestExpansion(test.id)}>
                <div className="test-main-info">
                  <div className="test-title-row">
                    <div className="test-id-status">
                      <span className="test-id">{test.id}</span>
                      <span className="test-badge--default">No status</span>
                    </div>
                    <span className="test-date">{formatDate(test.testDate)}</span>
                  </div>
                  <div className="test-details-row">
                    <div className="test-info">
                      <h3 className="test-type">{test.testType}</h3>
                      <div className="test-meta">
                        <span className="ordered-by">Doctor: {test.doctorName || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="test-actions">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewTest(test);
                    }}
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  <div className="test-expand-button">
                    {expandedTest === test.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedTest === test.id && (
                <div className="test-details">
                  <div className="summary-section">
                    <p><strong>Result:</strong> {test.result || 'Not available'}</p>
                    <p><strong>Test Date:</strong> {formatDate(test.testDate)}</p>
                    <p><strong>Doctor:</strong> {test.doctorName || 'N/A'}</p>
                    {test.fileUrl && (
                      <p>
                        <a href={test.fileUrl} target="_blank" rel="noopener noreferrer" className="report-link">
                          View Report
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Test Details Modal */}
      {showTestDetails && selectedTest && (
        <div className="modal-overlay" onClick={() => setShowTestDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTest.testType} - Detailed Results</h3>
              <button className="modal-close" onClick={() => setShowTestDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="test-detail-content">
                <div className="test-overview">
                  <div className="overview-grid">
                    <div className="overview-item">
                      <span className="overview-label">Test ID:</span>
                      <span className="overview-value">{selectedTest.id}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Date:</span>
                      <span className="overview-value">{formatDate(selectedTest.testDate)}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Ordered by:</span>
                      <span className="overview-value">{selectedTest.doctorName || 'N/A'}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Result:</span>
                      <span className="overview-value">{selectedTest.result || 'Not available'}</span>
                    </div>
                    {selectedTest.fileUrl && (
                      <div className="overview-item">
                        <span className="overview-label">Report:</span>
                        <span className="overview-value">
                          <a href={selectedTest.fileUrl} target="_blank" rel="noopener noreferrer">
                            View Report
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowTestDetails(false)}>
                Close
              </button>
              <button className="btn btn-outline">
                <Download size={16} />
                Download PDF
              </button>
              <button className="btn btn-primary">
                <FileText size={16} />
                Share with Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTests;
