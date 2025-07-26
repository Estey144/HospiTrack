import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');  // Not used much but kept for UI consistency
  const [filterDate, setFilterDate] = useState('all');      // You can remove filters not supported by your data
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedTest, setExpandedTest] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestDetails, setShowTestDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock lab tests data
  const [labTests] = useState([
    {
      id: 'LAB-2024-0156',
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
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
