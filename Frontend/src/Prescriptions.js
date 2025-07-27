import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Home,
  Search,
  Filter,
  Eye,
  Pill,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  FileText,
  DollarSign,
  Shield,
  Ambulance,
  Video,
  TestTube,
  Brain,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import './Prescriptions.css';
import './PatientDashboard.css';

const Prescriptions = ({ currentUser }) => {
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
  
  // Debug logging to verify user ID is received
  useEffect(() => {
    console.log('Prescriptions page - User ID from params:', searchParams.get('userId'));
    console.log('Prescriptions page - User from state:', location.state?.user);
    console.log('Prescriptions page - Current user:', user);
  }, [searchParams, location.state, user]);

  // Update user state when navigation state or URL params change
  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
      console.log('Prescriptions page - User updated:', newUser);
    }
  }, [location.state, searchParams]);

  // State
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const itemsPerPage = 10;

  // Fetch data
  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions();
    }
  }, [user?.id]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) throw new Error("User not found");

      // Step 1: Get patientId from userId
      const patientIdResponse = await fetch(`http://localhost:8080/patients/by-user/${user.id}`);
      if (!patientIdResponse.ok) throw new Error("Failed to fetch patient ID");
      const patientId = await patientIdResponse.text();

      // Step 2: Use patientId to fetch prescriptions
      const response = await fetch(`http://localhost:8080/api/prescriptions/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(data);

    } catch (err) {
      setError(err.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  // Filter + search
  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch =
      (p.patientName || p.patientId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.doctorName || p.doctorId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.prescriptionNumber || p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.diagnosis || p.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || (p.doctorName || p.doctorId) === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  // Unique doctors (by doctorName or doctorId)
  const uniqueDoctors = [...new Set(prescriptions.map(p => p.doctorName || p.doctorId))];

  // Modal handlers
  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', icon: CheckCircle, text: 'Active' },
      completed: { color: 'info', icon: CheckCircle, text: 'Completed' },
      expired: { color: 'danger', icon: XCircle, text: 'Expired' },
      cancelled: { color: 'warning', icon: AlertCircle, text: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span className={`prescription-badge prescription-badge--${config.color}`}>
        <Icon size={14} />
        {config.text}
      </span>
    );
  };

  // Export to PDF function
  const exportToPDF = () => {
    const input = document.querySelector('.prescriptions-table-container');

    if (!input) {
      alert('Table not found!');
      return;
    }

    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('prescriptions.pdf');
    }).catch(err => {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF');
    });
  };

  // --- JSX Return ---
  return (
    <div className="patient-dashboard-wrapper">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="patient-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            {user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div className="patient-sidebar-user-info">
            <div className="patient-sidebar-user-name">{user?.name || 'Patient'}</div>
            <div className="patient-sidebar-user-id">ID: {user?.id || 'N/A'}</div>
          </div>
        </div>

        <nav className="patient-sidebar-nav">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = window.location.pathname === item.path;
            
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
            onClick={() => navigate('/')}
            className="patient-home-button"
          >
            <Home size={16} />
            <span>Back to Homepage</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="patient-main">
        <div className="prescriptions-page">
      {/* Header */}
      <div className="prescriptions-header">
        <div className="prescriptions-header-left">
          <div className="navigation-buttons">
            <button 
              className="patient-sidebar-toggle-main"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
          <div className="prescriptions-page-title">
            <h1><Pill size={24} /> My Prescriptions</h1>
            <p>View and manage your prescription medications</p>
          </div>
        </div>
        <div className="prescriptions-header-right">
          <button className="btn btn-secondary" onClick={exportToPDF}>
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="prescriptions-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by patient, doctor, prescription number, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <User size={16} />
            <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
              <option value="all">All Doctors</option>
              {uniqueDoctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading prescriptions...</p>
        </div>
      )}

      {/* Table */}
      <div className="prescriptions-table-container">
        <table className="prescriptions-table">
          <thead>
            <tr>
              <th>Prescription #</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Notes</th>
              <th>Medications</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPrescriptions.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <FileText size={48} />
                  <p>No prescriptions found</p>
                </td>
              </tr>
            ) : (
              paginatedPrescriptions.map(prescription => (
                <tr key={prescription.id}>
                  <td>{prescription.prescriptionNumber || prescription.id}</td>
                  <td>
                    <div className="patient-info">
                      <div className="patient-name">{prescription.patientName || prescription.patientId}</div>
                      {/* Optional age calculation if you have DOB */}
                    </div>
                  </td>
                  <td>{prescription.doctorName || prescription.doctorId}</td>
                  <td>{prescription.notes || '-'}</td>
                  <td>
                    <div className="medications-list">
                      {prescription.medications?.slice(0, 2).map((med, i) => (
                        <div key={i} className="medication-item">
                          {med.medicineName} - {med.dosage} ({med.duration})
                        </div>
                      ))}
                      {prescription.medications?.length > 2 && (
                        <div className="medication-more">
                          +{prescription.medications.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      {prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td>{getStatusBadge(prescription.status || 'active')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-view" onClick={() => openModal(prescription)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPrescriptions.length)} of {filteredPrescriptions.length} prescriptions
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Prescription Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="prescription-details">
                <div className="details-header">
                  <h4>Prescription #{selectedPrescription.prescriptionNumber || selectedPrescription.id}</h4>
                  {getStatusBadge(selectedPrescription.status || 'active')}
                </div>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Patient:</label> <span>{selectedPrescription.patientName || selectedPrescription.patientId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Doctor:</label> <span>{selectedPrescription.doctorName || selectedPrescription.doctorId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Notes:</label> <span>{selectedPrescription.notes || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Issue Date:</label>{' '}
                    <span>{selectedPrescription.dateIssued ? new Date(selectedPrescription.dateIssued).toLocaleDateString() : '-'}</span>
                  </div>
                  {/* You can add expiryDate and refills if you add them later */}
                </div>
                <div className="medications-section">
                  <h5>Medications:</h5>
                  {selectedPrescription.medications?.map((med, index) => (
                    <div key={index} className="medication-detail">
                      <div className="med-name">{med.medicineName}</div>
                      <div className="med-info">
                        <span>Dosage: {med.dosage}</span>{' '}
                        {/* Add frequency or instructions if available */}
                        <span>Duration: {med.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedPrescription.instructions && (
                  <div className="notes-section">
                    <h5>Instructions:</h5>
                    <p>{selectedPrescription.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
