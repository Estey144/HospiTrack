import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, ArrowLeft, Home, Calendar, Stethoscope, 
  Activity, Heart, Eye, Search, Filter, Download, Clock,
  AlertCircle, ChevronDown, ChevronUp, Pill, DollarSign,
  Shield, Ambulance, Video, TestTube, Brain, MessageSquare,
  Menu, X, User
} from 'lucide-react';
import './MedicalHistory.css';
import './PatientDashboard.css';
import { apiCall } from './utils/api';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigationItems = [
    { path: '/patient-dashboard', label: 'Patient Dashboard', icon: User, color: 'text-blue-600' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText, color: 'text-cyan-600' },
    { path: '/bills', label: 'Bills', icon: DollarSign, color: 'text-yellow-600' },
    { path: '/medical-history', label: 'Medical History', icon: FileText, color: 'text-lime-600' },
    { path: '/insurance', label: 'Insurance', icon: Shield, color: 'text-sky-600' },
    { path: '/ambulance', label: 'Ambulance', icon: Ambulance, color: 'text-rose-600' },
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user?.id) throw new Error("User not logged in");

        const data = await apiCall(`/medical-records/user/${user.id}`);
        setMedicalRecords(data);
      } catch (err) {
        setError(err.message);
        setMedicalRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user?.id, token]);

  const filteredRecords = medicalRecords
    .filter(record => {
      const matchesSearch = (record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.department?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || (record.type?.toLowerCase() === filterType.toLowerCase());
      const matchesDate = filterDate === 'all' || (() => {
        const recordDate = new Date(record.date);
        const now = new Date();
        const diffDays = Math.ceil((now - recordDate) / (1000 * 60 * 60 * 24));
        return filterDate === '30' ? diffDays <= 30 :
               filterDate === '90' ? diffDays <= 90 :
               filterDate === '365' ? diffDays <= 365 : true;
      })();
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'doctor': return (a.doctorName || '').localeCompare(b.doctorName || '');
        case 'department': return (a.department || '').localeCompare(b.department || '');
        default: return 0;
      }
    });

  const getTypeIcon = (type) => {
    switch((type || '').toLowerCase()) {
      case 'consultation': return <Stethoscope size={16} />;
      case 'emergency': return <AlertCircle size={16} />;
      case 'preventive': return <Heart size={16} />;
      case 'specialist': return <Eye size={16} />;
      case 'follow-up': return <Activity size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch((type || '').toLowerCase()) {
      case 'consultation': return 'record-badge--primary';
      case 'emergency': return 'record-badge--danger';
      case 'preventive': return 'record-badge--success';
      case 'specialist': return 'record-badge--info';
      case 'follow-up': return 'record-badge--warning';
      default: return 'record-badge--default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const toggleRecordExpansion = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  // Enhanced PDF export function
  const exportMedicalRecordsToPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 139);
      pdf.text('HospiTrack - Medical History Report', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Patient: ${user?.username || 'N/A'}`, margin, yPosition);
      
      yPosition += 7;
      pdf.text(`Patient ID: ${user?.id || 'N/A'}`, margin, yPosition);
      
      yPosition += 7;
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })} at ${new Date().toLocaleTimeString()}`, margin, yPosition);
      
      yPosition += 20;

      // Summary Box
      pdf.setDrawColor(0, 123, 255);
      pdf.setFillColor(240, 248, 255);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 123, 255);
      pdf.text('MEDICAL HISTORY SUMMARY', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      const totalRecords = medicalRecords.length;
      const lastVisit = medicalRecords[0]?.date ? formatDate(medicalRecords[0].date) : 'N/A';
      
      // Get most common type
      const typeCounts = medicalRecords.reduce((acc, record) => {
        const type = record.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
        typeCounts[a] > typeCounts[b] ? a : b, 'N/A');
      
      pdf.text(`Total Records: ${totalRecords}`, margin + 5, yPosition);
      pdf.text(`Last Visit: ${lastVisit}`, margin + 90, yPosition);
      yPosition += 6;
      pdf.text(`Most Common Type: ${mostCommonType}`, margin + 5, yPosition);
      pdf.text(`Filtered Records: ${filteredRecords.length}`, margin + 90, yPosition);
      
      yPosition += 20;

      // Medical Records Section Header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 167, 69);
      pdf.text('MEDICAL RECORDS', margin, yPosition);
      
      yPosition += 15;

      // Process each medical record
      filteredRecords.forEach((record, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = margin;
        }

        // Record type color coding
        const typeColors = {
          'consultation': [0, 123, 255],
          'emergency': [220, 53, 69],
          'preventive': [40, 167, 69],
          'specialist': [23, 162, 184],
          'follow-up': [255, 193, 7]
        };
        const recordColor = typeColors[record.type?.toLowerCase()] || [108, 117, 125];
        
        // Record header box
        pdf.setDrawColor(...recordColor);
        pdf.setFillColor(248, 249, 250);
        pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 2, 2, 'FD');
        
        yPosition += 8;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${record.diagnosis || 'No diagnosis available'}`, margin + 5, yPosition);
        
        // Type badge
        pdf.setTextColor(...recordColor);
        pdf.text(`${record.type || 'Unknown'}`, pageWidth - margin - 40, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.text(`Date: ${formatDate(record.date)}`, margin + 10, yPosition);
        
        yPosition += 5;
        pdf.text(`Doctor: ${record.doctorName || 'Unknown Doctor'}`, margin + 10, yPosition);
        
        yPosition += 5;
        pdf.text(`Department: ${record.department || 'Unknown Department'}`, margin + 10, yPosition);
        
        // Additional details if available
        if (record.symptoms) {
          yPosition += 5;
          const symptomsText = `Symptoms: ${record.symptoms}`;
          const symptomsLines = pdf.splitTextToSize(symptomsText, pageWidth - 2 * margin - 20);
          symptomsLines.forEach(line => {
            pdf.text(line, margin + 10, yPosition);
            yPosition += 4;
          });
        }
        
        if (record.treatment) {
          yPosition += 2;
          const treatmentText = `Treatment: ${record.treatment}`;
          const treatmentLines = pdf.splitTextToSize(treatmentText, pageWidth - 2 * margin - 20);
          treatmentLines.forEach(line => {
            pdf.text(line, margin + 10, yPosition);
            yPosition += 4;
          });
        }
        
        if (record.medications) {
          yPosition += 2;
          const medicationsText = `Medications: ${record.medications}`;
          const medicationsLines = pdf.splitTextToSize(medicationsText, pageWidth - 2 * margin - 20);
          medicationsLines.forEach(line => {
            pdf.text(line, margin + 10, yPosition);
            yPosition += 4;
          });
        }
        
        if (record.notes) {
          yPosition += 2;
          const notesText = `Notes: ${record.notes}`;
          const notesLines = pdf.splitTextToSize(notesText, pageWidth - 2 * margin - 20);
          notesLines.forEach(line => {
            pdf.text(line, margin + 10, yPosition);
            yPosition += 4;
          });
        }
        
        yPosition += 15; // Space between records
      });

      // Statistics Summary at the end
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      } else {
        yPosition += 10;
      }

      // Statistics summary box
      pdf.setDrawColor(155, 89, 182);
      pdf.setFillColor(248, 240, 252);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(155, 89, 182);
      pdf.text('STATISTICS BREAKDOWN', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      // Calculate statistics
      const typeStats = Object.entries(typeCounts);
      
      typeStats.forEach(([type, count], index) => {
        const percentage = ((count / totalRecords) * 100).toFixed(1);
        pdf.text(`${type}: ${count} records (${percentage}%)`, margin + 5, yPosition);
        yPosition += 5;
      });

      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(108, 117, 125);
        
        // Footer line
        pdf.setDrawColor(108, 117, 125);
        pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        // Footer text
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        pdf.text('HospiTrack Patient Portal - Medical History', margin, pageHeight - 10);
        pdf.text('This is a digitally generated medical report', margin, pageHeight - 6);
      }

      pdf.save(`${user?.username || 'Patient'}_Medical_History_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error exporting medical records PDF:', err);
      alert('Failed to export medical records PDF');
    }
  };

  if (loading) {
    return (
      <div className="medical-history-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading medical history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-history-page">
        <div className="error-message">
          <AlertCircle size={32} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard-wrapper">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="patient-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <div className={`patient-sidebar ${sidebarOpen ? 'patient-sidebar--open' : ''}`}>
        <div className="patient-sidebar-header">
          <div className="patient-sidebar-title">
            <User size={24} className="patient-sidebar-logo" />
            <span className="patient-sidebar-title-text">Patient Portal</span>
          </div>
          <button 
            className="patient-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="patient-sidebar-user">
          <div className="patient-sidebar-user-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div className="patient-sidebar-user-info">
            <div className="patient-sidebar-user-name">{user?.username || 'Patient'}</div>
            <div className="patient-sidebar-user-id">ID: {user?.id || 'N/A'}</div>
          </div>
        </div>
        
        <nav className="patient-sidebar-nav">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleSidebarNavigation(item.path)}
                className={`patient-nav-item ${isActive ? 'patient-nav-item--active' : ''}`}
              >
                <IconComponent size={20} className={`patient-nav-icon ${item.color}`} />
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
            <Home size={16} />
            Go to Homepage
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="patient-main">
    <div className="medical-history-page">
      {/* Header */}
      <div className="medical-history-header">
        <div className="medical-history-header-left">
          <div className="navigation-buttons">
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
          <div className="medical-page-title">
            <h1><FileText size={24} /> Medical History</h1>
            <p>View your complete medical records and visit history</p>
          </div>
        </div>
        <div className="medical-history-header-right">
          <button className="btn btn-outline" onClick={exportMedicalRecordsToPDF} title="Export complete medical history as PDF">
            <Download size={16} />
            Export Records
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="medical-history-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by diagnosis, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="consultation">Consultations</option>
              <option value="emergency">Emergency</option>
              <option value="preventive">Preventive</option>
              <option value="specialist">Specialist</option>
              <option value="follow-up">Follow-up</option>
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
            <Clock size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="doctor">By Doctor</option>
              <option value="department">By Department</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="medical-records-container">
        {filteredRecords.length === 0 ? (
          <div className="no-data">
            <FileText size={64} />
            <p>No medical records found</p>
            <span>Try adjusting your search or filter criteria</span>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="medical-record-card">
              <div className="record-header" onClick={() => toggleRecordExpansion(record.id)}>
                <div className="record-main-info">
                  <div className="record-title-row">
                    <span className={`record-badge ${getTypeBadgeClass(record.type)}`}>
                      {getTypeIcon(record.type)}
                      {record.type}
                    </span>
                    <span className="record-date">{formatDate(record.date)}</span>
                  </div>
                  <h3 className="record-diagnosis">{record.diagnosis || 'No diagnosis available'}</h3>
                  <div className="record-doctor-info">
                    <span className="doctor-name">{record.doctorName || 'Unknown Doctor'}</span>
                    <span className="department">{record.department || 'Unknown Department'}</span>
                  </div>
                </div>
                <div className="record-expand-button">
                  {expandedRecord === record.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedRecord === record.id && (
                <div className="record-details">
                  {/* You can keep your expanded record details here if needed */}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="medical-summary">
        <div className="summary-card">
          <h4>Total Records</h4>
          <span className="summary-number">{medicalRecords.length}</span>
        </div>
        <div className="summary-card">
          <h4>Last Visit</h4>
          <span className="summary-date">{formatDate(medicalRecords[0]?.date)}</span>
        </div>
        <div className="summary-card">
          <h4>Most Common Type</h4>
          <span className="summary-type">Consultation</span>
        </div>
        <div className="summary-card">
          <h4>Active Medications</h4>
          <span className="summary-number">3</span>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
