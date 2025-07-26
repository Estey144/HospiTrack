import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  User,
  Building,
  ChevronDown,
  ChevronUp,
  Info,
  Activity
} from 'lucide-react';
import './LabTests.css';

const LabTests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedTest, setExpandedTest] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestDetails, setShowTestDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to get user from various sources
  const getUserFromParams = () => {
    // Try navigation state first (highest priority)
    if (location.state?.user) {
      console.log('LabTests: User found in navigation state:', location.state.user);
      return location.state.user;
    }
    
    // Try URL parameters
    const userIdFromUrl = searchParams.get('userId');
    if (userIdFromUrl) {
      console.log('LabTests: User ID found in URL params:', userIdFromUrl);
      return { id: userIdFromUrl };
    }
    
    // Try localStorage as fallback
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('LabTests: User found in localStorage:', parsedUser);
        return parsedUser;
      } catch (error) {
        console.error('LabTests: Error parsing stored user:', error);
      }
    }
    
    console.log('LabTests: No user found in any source');
    return null;
  };

  // Mock lab tests data
  const [labTests] = useState([
    {
      id: 'LAB-2024-0156',
      patientId: user?.id || '12345',
      date: '2024-12-15',
      orderedBy: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      testType: 'Lipid Panel',
      status: 'completed',
      priority: 'routine',
      results: [
        { 
          name: 'Total Cholesterol', 
          value: 185, 
          unit: 'mg/dL', 
          normalRange: '< 200', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'LDL Cholesterol', 
          value: 115, 
          unit: 'mg/dL', 
          normalRange: '< 100', 
          status: 'high',
          trend: 'up'
        },
        { 
          name: 'HDL Cholesterol', 
          value: 52, 
          unit: 'mg/dL', 
          normalRange: '> 40', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Triglycerides', 
          value: 89, 
          unit: 'mg/dL', 
          normalRange: '< 150', 
          status: 'normal',
          trend: 'down'
        }
      ],
      notes: 'LDL cholesterol slightly elevated. Recommend dietary modifications and follow-up in 3 months.',
      attachments: ['Lipid Panel Report.pdf', 'Reference Ranges.pdf']
    },
    {
      id: 'LAB-2024-0142',
      patientId: user?.id || '12345',
      date: '2024-11-28',
      orderedBy: 'Dr. Michael Chen',
      department: 'Emergency Medicine',
      testType: 'Complete Blood Count (CBC)',
      status: 'completed',
      priority: 'urgent',
      results: [
        { 
          name: 'White Blood Cells', 
          value: 7.2, 
          unit: 'K/μL', 
          normalRange: '4.0-11.0', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Red Blood Cells', 
          value: 4.8, 
          unit: 'M/μL', 
          normalRange: '4.2-5.4', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Hemoglobin', 
          value: 14.2, 
          unit: 'g/dL', 
          normalRange: '12.0-16.0', 
          status: 'normal',
          trend: 'up'
        },
        { 
          name: 'Hematocrit', 
          value: 42.1, 
          unit: '%', 
          normalRange: '36.0-46.0', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Platelets', 
          value: 285, 
          unit: 'K/μL', 
          normalRange: '150-450', 
          status: 'normal',
          trend: 'stable'
        }
      ],
      notes: 'All blood count parameters within normal limits. No signs of infection or anemia.',
      attachments: ['CBC Results.pdf', 'Lab Summary.pdf']
    },
    {
      id: 'LAB-2024-0128',
      patientId: user?.id || '12345',
      date: '2024-10-10',
      orderedBy: 'Dr. Emily Rodriguez',
      department: 'Family Medicine',
      testType: 'Comprehensive Metabolic Panel',
      status: 'completed',
      priority: 'routine',
      results: [
        { 
          name: 'Glucose', 
          value: 92, 
          unit: 'mg/dL', 
          normalRange: '70-99', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Sodium', 
          value: 142, 
          unit: 'mEq/L', 
          normalRange: '136-145', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Potassium', 
          value: 4.1, 
          unit: 'mEq/L', 
          normalRange: '3.5-5.0', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Creatinine', 
          value: 0.9, 
          unit: 'mg/dL', 
          normalRange: '0.6-1.2', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'BUN', 
          value: 18, 
          unit: 'mg/dL', 
          normalRange: '7-20', 
          status: 'normal',
          trend: 'stable'
        }
      ],
      notes: 'Metabolic panel shows normal kidney function and electrolyte balance.',
      attachments: ['Metabolic Panel.pdf']
    },
    {
      id: 'LAB-2024-0089',
      patientId: user?.id || '12345',
      date: '2024-09-05',
      orderedBy: 'Dr. Lisa Park',
      department: 'Endocrinology',
      testType: 'Thyroid Function Panel',
      status: 'completed',
      priority: 'routine',
      results: [
        { 
          name: 'TSH', 
          value: 2.8, 
          unit: 'mIU/L', 
          normalRange: '0.4-4.0', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Free T4', 
          value: 1.2, 
          unit: 'ng/dL', 
          normalRange: '0.8-1.8', 
          status: 'normal',
          trend: 'stable'
        },
        { 
          name: 'Free T3', 
          value: 3.1, 
          unit: 'pg/mL', 
          normalRange: '2.3-4.2', 
          status: 'normal',
          trend: 'up'
        }
      ],
      notes: 'Thyroid function is normal. Continue current monitoring schedule.',
      attachments: ['Thyroid Panel.pdf', 'Trend Analysis.pdf']
    },
    {
      id: 'LAB-2024-0067',
      patientId: user?.id || '12345',
      date: '2024-08-20',
      orderedBy: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      testType: 'HbA1c',
      status: 'pending',
      priority: 'routine',
      results: [],
      notes: 'Test ordered for diabetes monitoring. Results pending.',
      attachments: []
    }
  ]);

  const [testCategories] = useState([
    { name: 'Blood Chemistry', count: 8, color: '#ef4444' },
    { name: 'Hematology', count: 5, color: '#f59e0b' },
    { name: 'Endocrinology', count: 4, color: '#10b981' },
    { name: 'Immunology', count: 3, color: '#3b82f6' },
    { name: 'Microbiology', count: 2, color: '#8b5cf6' },
    { name: 'Pathology', count: 1, color: '#ec4899' }
  ]);

  useEffect(() => {
    // Get user data when component mounts
    const userData = getUserFromParams();
    setUser(userData);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.state, searchParams]);

  // Filter and sort tests
  const filteredTests = labTests
    .filter(test => {
      const matchesSearch = test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
      const matchesType = filterType === 'all' || test.testType.toLowerCase().includes(filterType.toLowerCase());
      
      const matchesDate = filterDate === 'all' || (() => {
        const testDate = new Date(test.date);
        const now = new Date();
        const diffTime = now - testDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(filterDate) {
          case '30': return diffDays <= 30;
          case '90': return diffDays <= 90;
          case '365': return diffDays <= 365;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'test-type': return a.testType.localeCompare(b.testType);
        case 'status': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'abnormal': return <AlertTriangle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed': return 'test-badge--success';
      case 'pending': return 'test-badge--warning';
      case 'abnormal': return 'test-badge--danger';
      default: return 'test-badge--default';
    }
  };

  const getResultStatusIcon = (status) => {
    switch(status) {
      case 'normal': return <CheckCircle size={14} />;
      case 'high': return <TrendingUp size={14} />;
      case 'low': return <TrendingDown size={14} />;
      default: return <Minus size={14} />;
    }
  };

  const getResultStatusClass = (status) => {
    switch(status) {
      case 'normal': return 'result-status--normal';
      case 'high': return 'result-status--high';
      case 'low': return 'result-status--low';
      default: return 'result-status--default';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp size={12} />;
      case 'down': return <TrendingDown size={12} />;
      case 'stable': return <Minus size={12} />;
      default: return null;
    }
  };

  const getTrendClass = (trend) => {
    switch(trend) {
      case 'up': return 'trend--up';
      case 'down': return 'trend--down';
      case 'stable': return 'trend--stable';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
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

  const getAbnormalResults = () => {
    return labTests
      .filter(test => test.status === 'completed')
      .flatMap(test => test.results)
      .filter(result => result.status !== 'normal').length;
  };

  const getPendingTests = () => {
    return labTests.filter(test => test.status === 'pending').length;
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

  return (
    <div className="lab-tests-page">
      {/* Header */}
      <div className="lab-tests-header">
        <div className="lab-tests-header-left">
          <div className="navigation-buttons">
            <button 
              className="lab-nav-button lab-nav-button--secondary" 
              onClick={() => navigate('/patient-dashboard', { 
                state: { user },
                replace: false 
              })}
            >
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

      {/* Quick Stats */}
      <div className="lab-quick-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FlaskConical size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tests</span>
            <span className="stat-value">{labTests.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{labTests.filter(t => t.status === 'completed').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{getPendingTests()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Abnormal Values</span>
            <span className="stat-value">{getAbnormalResults()}</span>
          </div>
        </div>
      </div>

      {/* Test Categories */}
      <div className="test-categories">
        <h3>Test Categories</h3>
        <div className="categories-grid">
          {testCategories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-info">
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  <Activity size={20} />
                </div>
                <div className="category-details">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count} tests</span>
                </div>
              </div>
            </div>
          ))}
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
        
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </div>
          
          <div className="filter-group">
            <FlaskConical size={16} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="blood">Blood Tests</option>
              <option value="chemistry">Chemistry</option>
              <option value="thyroid">Thyroid</option>
              <option value="lipid">Lipid Panel</option>
            </select>
          </div>
          
          <div className="filter-group">
            <Calendar size={16} />
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="all">All Dates</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div className="filter-group">
            <Info size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="test-type">By Test Type</option>
              <option value="status">By Status</option>
            </select>
          </div>
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
                      <span className={`test-badge ${getStatusBadgeClass(test.status)}`}>
                        {getStatusIcon(test.status)}
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </span>
                    </div>
                    <span className="test-date">{formatDate(test.date)}</span>
                  </div>
                  <div className="test-details-row">
                    <div className="test-info">
                      <h3 className="test-type">{test.testType}</h3>
                      <div className="test-meta">
                        <span className="ordered-by">Ordered by {test.orderedBy}</span>
                        <span className="department">{test.department}</span>
                      </div>
                    </div>
                    {test.results.length > 0 && (
                      <div className="test-summary">
                        <span className="result-count">{test.results.length} parameters</span>
                        {test.results.some(r => r.status !== 'normal') && (
                          <span className="abnormal-indicator">
                            <AlertTriangle size={14} />
                            {test.results.filter(r => r.status !== 'normal').length} abnormal
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="test-actions">
                  {test.status === 'completed' && (
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
                  )}
                  <div className="test-expand-button">
                    {expandedTest === test.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedTest === test.id && (
                <div className="test-details">
                  {test.results.length > 0 ? (
                    <div className="results-section">
                      <h4>Test Results</h4>
                      <div className="results-table">
                        <div className="results-header">
                          <span>Parameter</span>
                          <span>Value</span>
                          <span>Normal Range</span>
                          <span>Status</span>
                          <span>Trend</span>
                        </div>
                        {test.results.map((result, index) => (
                          <div key={index} className="result-row">
                            <span className="result-name">{result.name}</span>
                            <span className="result-value">
                              {result.value} {result.unit}
                            </span>
                            <span className="result-range">{result.normalRange}</span>
                            <span className={`result-status ${getResultStatusClass(result.status)}`}>
                              {getResultStatusIcon(result.status)}
                              {result.status}
                            </span>
                            <span className={`result-trend ${getTrendClass(result.trend)}`}>
                              {getTrendIcon(result.trend)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="pending-results">
                      <Clock size={24} />
                      <span>Results pending - will be available once test is completed</span>
                    </div>
                  )}

                  {test.notes && (
                    <div className="notes-section">
                      <h4>Clinical Notes</h4>
                      <p className="test-notes">{test.notes}</p>
                    </div>
                  )}

                  {test.attachments.length > 0 && (
                    <div className="attachments-section">
                      <h4>Reports & Documents</h4>
                      <div className="attachments-list">
                        {test.attachments.map((attachment, index) => (
                          <button key={index} className="attachment-item">
                            <FileText size={16} />
                            <span>{attachment}</span>
                            <Download size={14} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="test-detail-actions">
                    <button className="btn btn-outline">
                      <Download size={16} />
                      Download Report
                    </button>
                    {test.status === 'completed' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleViewTest(test)}
                      >
                        <Eye size={16} />
                        View Full Results
                      </button>
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
                      <span className="overview-value">{formatDate(selectedTest.date)}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Ordered by:</span>
                      <span className="overview-value">{selectedTest.orderedBy}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Department:</span>
                      <span className="overview-value">{selectedTest.department}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Status:</span>
                      <span className={`test-badge ${getStatusBadgeClass(selectedTest.status)}`}>
                        {getStatusIcon(selectedTest.status)}
                        {selectedTest.status.charAt(0).toUpperCase() + selectedTest.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTest.results.length > 0 && (
                  <div className="detailed-results">
                    <h4>Detailed Results</h4>
                    <div className="detailed-results-grid">
                      {selectedTest.results.map((result, index) => (
                        <div key={index} className="detailed-result-card">
                          <div className="result-header">
                            <span className="result-parameter">{result.name}</span>
                            <span className={`result-status-indicator ${getResultStatusClass(result.status)}`}>
                              {getResultStatusIcon(result.status)}
                            </span>
                          </div>
                          <div className="result-content">
                            <div className="result-value-section">
                              <span className="result-main-value">{result.value}</span>
                              <span className="result-unit">{result.unit}</span>
                            </div>
                            <div className="result-info">
                              <div className="result-info-item">
                                <span className="info-label">Normal Range:</span>
                                <span className="info-value">{result.normalRange}</span>
                              </div>
                              <div className="result-info-item">
                                <span className="info-label">Status:</span>
                                <span className={`info-value ${getResultStatusClass(result.status)}`}>
                                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                </span>
                              </div>
                              <div className="result-info-item">
                                <span className="info-label">Trend:</span>
                                <span className={`info-value ${getTrendClass(result.trend)}`}>
                                  {getTrendIcon(result.trend)}
                                  {result.trend}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTest.notes && (
                  <div className="detailed-notes">
                    <h4>Clinical Interpretation</h4>
                    <div className="notes-content">
                      <p>{selectedTest.notes}</p>
                    </div>
                  </div>
                )}
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
