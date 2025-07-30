import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  FlaskConical, 
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
  ChevronUp,
  Menu,
  X,
  User,
  DollarSign,
  Shield,
  TestTube,
  Video,
  Brain,
  MessageSquare
} from 'lucide-react';
import './LabTests.css';
import './PatientDashboard.css';
import { apiCall } from './utils/api';

const LabTests = ({ currentUser }) => {
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
  
  // Debug logging to verify user ID is received
  useEffect(() => {
    console.log('LabTests page - User ID from params:', searchParams.get('userId'));
    console.log('LabTests page - User from state:', location.state?.user);
    console.log('LabTests page - Current user:', user);
  }, [searchParams, location.state, user]);

  // Update user state when navigation state or URL params change
  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
      console.log('LabTests page - User updated:', newUser);
    }
  }, [location.state, searchParams]);

  const userId = user?.id;

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setSidebarOpen(false); // Close sidebar after navigation
  };

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
        const data = await apiCall(`/lab-tests/user/${userId}`);
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

  // Export all lab test results to PDF
  const exportLabResultsToPDF = () => {
    const input = document.querySelector('.lab-tests-container');

    if (!input) {
      alert('Lab test data not found!');
      return;
    }

    html2canvas(input, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Add title and header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Lab Test Results', 20, 20);
      
      // Add user info if available
      if (user?.name) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Patient: ${user.name}`, 20, 30);
        pdf.text(`Patient ID: ${user.id}`, 20, 38);
      }
      
      // Add generation date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 46);

      // Calculate image dimensions
      const startY = 55;
      const availableHeight = pdf.internal.pageSize.getHeight() - startY - 20;
      const scaledHeight = Math.min((imgProps.height * pdfWidth) / imgProps.width, availableHeight);

      pdf.addImage(imgData, 'PNG', 0, startY, pdfWidth, scaledHeight);
      pdf.save(`${user?.name ? user.name.replace(/\s+/g, '_') + '_' : ''}lab-test-results.pdf`);
    }).catch(err => {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF');
    });
  };

  // Export individual test result to PDF
  const exportIndividualTestToPDF = (test) => {
    if (!test) {
      alert('Test data not found!');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add title and header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lab Test Result', 20, 20);
    
    // Add user info
    if (user?.name) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Patient: ${user.name}`, 20, 35);
      pdf.text(`Patient ID: ${user.id}`, 20, 43);
    }
    
    // Add test details
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Test Information:', 20, 60);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    let yPos = 70;
    
    const addTestDetail = (label, value) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${label}:`, 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value || 'N/A', 70, yPos);
      yPos += 8;
    };
    
    addTestDetail('Test ID', test.id);
    addTestDetail('Test Type', test.testType);
    addTestDetail('Test Date', formatDate(test.testDate));
    addTestDetail('Ordered by', test.doctorName);
    addTestDetail('Result', test.result);
    
    if (test.fileUrl) {
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Report URL:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(test.fileUrl, 20, yPos + 8);
    }
    
    // Add generation timestamp
    yPos += 20;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, yPos);
    
    pdf.save(`${user?.name ? user.name.replace(/\s+/g, '_') + '_' : ''}${test.testType ? test.testType.replace(/\s+/g, '_') + '_' : ''}test-result.pdf`);
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
        <div className="lab-tests-page">
          {/* Header */}
          <div className="lab-tests-header">
            <div className="lab-tests-header-left">
              <div className="lab-page-title">
                <div className="lab-title-with-sidebar">
                  <button 
                    className="patient-sidebar-toggle-main"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu size={20} />
                  </button>
                  <h1><FlaskConical size={24} /> Lab Tests & Results</h1>
                </div>
                <p>View your laboratory test results and reports</p>
              </div>
            </div>
            <div className="lab-tests-header-right">
              <button className="btn btn-outline" onClick={exportLabResultsToPDF}>
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
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportIndividualTestToPDF(test);
                    }}
                    title="Download PDF report"
                  >
                    <Download size={14} />
                    PDF
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
              <button className="btn btn-outline" onClick={() => exportIndividualTestToPDF(selectedTest)}>
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
      </div>
    </div>
  );
};

export default LabTests;
