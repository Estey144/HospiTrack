import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FileText
} from 'lucide-react';
import './Prescriptions.css';

const Prescriptions = () => {
  const navigate = useNavigate();

  // State management
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

  // Sample data based on backend structure
  const getSamplePrescriptions = () => [
    {
      id: 'pr001',
      prescriptionNumber: 'PR001',
      appointmentId: 'a002',
      doctorId: 'doc002',
      patientId: 'p002',
      doctorName: 'Dr. Sarah Johnson',
      patientName: 'Maria Garcia',
      patientAge: 32,
      diagnosis: 'Hypertension Management',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with food' }
      ],
      instructions: 'Take medication after meals. Follow up in 1 week.',
      issueDate: '2024-01-16',
      expiryDate: '2024-02-15',
      status: 'active',
      refillsRemaining: 2,
      totalRefills: 3
    },
    {
      id: 'pr002',
      prescriptionNumber: 'PR002',
      appointmentId: 'a005',
      doctorId: 'doc005',
      patientId: 'p005',
      doctorName: 'Dr. Michael Chen',
      patientName: 'David Wilson',
      patientAge: 28,
      diagnosis: 'Skin Condition',
      medications: [
        { name: 'Hydrocortisone Cream', dosage: '1%', frequency: 'Twice daily', duration: '14 days', instructions: 'Apply thin layer' }
      ],
      instructions: 'Apply cream twice daily. Avoid sun exposure.',
      issueDate: '2024-01-19',
      expiryDate: '2024-02-02',
      status: 'active',
      refillsRemaining: 1,
      totalRefills: 2
    },
    {
      id: 'pr003',
      prescriptionNumber: 'PR003',
      appointmentId: 'a007',
      doctorId: 'doc007',
      patientId: 'p007',
      doctorName: 'Dr. Lisa Wang',
      patientName: 'Jennifer Brown',
      patientAge: 35,
      diagnosis: 'Bacterial Infection',
      medications: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Complete full course' }
      ],
      instructions: 'Complete antibiotic course. Rest for 3 days.',
      issueDate: '2024-01-21',
      expiryDate: '2024-01-28',
      status: 'completed',
      refillsRemaining: 0,
      totalRefills: 0
    },
    {
      id: 'pr004',
      prescriptionNumber: 'PR004',
      appointmentId: 'a010',
      doctorId: 'doc010',
      patientId: 'p010',
      doctorName: 'Dr. Emily Davis',
      patientName: 'Robert Taylor',
      patientAge: 67,
      diagnosis: 'Hypertension',
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take before breakfast' }
      ],
      instructions: 'Take before breakfast. Monitor blood pressure.',
      issueDate: '2024-01-24',
      expiryDate: '2024-02-23',
      status: 'active',
      refillsRemaining: 2,
      totalRefills: 3
    },
    {
      id: 'pr005',
      prescriptionNumber: 'PR005',
      appointmentId: 'a001',
      doctorId: 'doc001',
      patientId: 'p001',
      doctorName: 'Dr. John Smith',
      patientName: 'Lisa Anderson',
      patientAge: 29,
      diagnosis: 'Anxiety Management',
      medications: [
        { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with water' }
      ],
      instructions: 'Take with water. No alcohol consumption.',
      issueDate: '2024-01-15',
      expiryDate: '2024-02-14',
      status: 'expired',
      refillsRemaining: 0,
      totalRefills: 2
    }
  ];

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrescriptions(getSamplePrescriptions());
      } catch (err) {
        setError('Failed to fetch prescriptions');
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPrescriptions(getSamplePrescriptions());
    } catch (err) {
      setError('Failed to fetch prescriptions');
    }
    setLoading(false);
  };

  // Filter and search logic
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || prescription.doctorName === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  // Get unique doctors for filter
  const uniqueDoctors = [...new Set(prescriptions.map(p => p.doctorName))];

  // Open prescription details modal
  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

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

  const exportToPDF = () => {
    // Implementation for PDF export
    alert('Export to PDF functionality would be implemented here');
  };

  return (
    <div className="prescriptions-page">
      {/* Header */}
      <div className="prescriptions-header">
        <div className="prescriptions-header-left">
          <div className="navigation-buttons">
            <button 
              className="nav-button nav-button--secondary"
              onClick={() => navigate('/patient-dashboard')}
            >
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button 
              className="nav-button nav-button--outline"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              Home
            </button>
          </div>
          <div className="page-title">
            <h1>
              <Pill size={24} />
              My Prescriptions
            </h1>
            <p>View and manage your prescription medications</p>
          </div>
        </div>
        <div className="prescriptions-header-right">
          <button 
            className="btn btn-secondary"
            onClick={exportToPDF}
          >
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
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <User size={16} />
            <select 
              value={filterDoctor} 
              onChange={(e) => setFilterDoctor(e.target.value)}
            >
              <option value="all">All Doctors</option>
              {uniqueDoctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Prescriptions Table */}
      <div className="prescriptions-table-container">
        <table className="prescriptions-table">
          <thead>
            <tr>
              <th>Prescription #</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
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
                  <td>
                    <div className="prescription-number">
                      {prescription.prescriptionNumber}
                    </div>
                  </td>
                  <td>
                    <div className="patient-info">
                      <div className="patient-name">{prescription.patientName}</div>
                      <div className="patient-age">Age: {prescription.patientAge}</div>
                    </div>
                  </td>
                  <td>{prescription.doctorName}</td>
                  <td>{prescription.diagnosis}</td>
                  <td>
                    <div className="medications-list">
                      {prescription.medications.slice(0, 2).map((med, index) => (
                        <div key={index} className="medication-item">
                          {med.name} - {med.dosage}
                        </div>
                      ))}
                      {prescription.medications.length > 2 && (
                        <div className="medication-more">
                          +{prescription.medications.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      {new Date(prescription.issueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>{getStatusBadge(prescription.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view"
                        onClick={() => openModal(prescription)}
                        title="View Details"
                      >
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
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Prescription Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="prescription-details">
                  <div className="details-header">
                    <h4>Prescription #{selectedPrescription?.prescriptionNumber}</h4>
                    {getStatusBadge(selectedPrescription?.status)}
                  </div>
                  
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Patient:</label>
                      <span>{selectedPrescription?.patientName} (Age: {selectedPrescription?.patientAge})</span>
                    </div>
                    <div className="detail-item">
                      <label>Doctor:</label>
                      <span>{selectedPrescription?.doctorName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Diagnosis:</label>
                      <span>{selectedPrescription?.diagnosis}</span>
                    </div>
                    <div className="detail-item">
                      <label>Issue Date:</label>
                      <span>{new Date(selectedPrescription?.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Expiry Date:</label>
                      <span>{new Date(selectedPrescription?.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Refills:</label>
                      <span>{selectedPrescription?.refillsRemaining}/{selectedPrescription?.totalRefills}</span>
                    </div>
                  </div>

                  <div className="medications-section">
                    <h5>Medications:</h5>
                    {selectedPrescription?.medications.map((med, index) => (
                      <div key={index} className="medication-detail">
                        <div className="med-name">{med.name}</div>
                        <div className="med-info">
                          <span>Dosage: {med.dosage}</span>
                          <span>Frequency: {med.frequency}</span>
                          <span>Duration: {med.duration}</span>
                        </div>
                        {med.instructions && (
                          <div className="med-instructions">
                            Instructions: {med.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedPrescription?.instructions && (
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
  );
};

export default Prescriptions;
