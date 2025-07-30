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
import { apiCall } from './utils/api';

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

      // Step 1: Get patientId from userId - this endpoint is not under /api
      const patientIdResponse = await fetch(`http://localhost:8080/patients/by-user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!patientIdResponse.ok) throw new Error("Failed to fetch patient ID");
      const patientId = await patientIdResponse.text();

      // Step 2: Use patientId to fetch prescriptions
      const data = await apiCall(`/prescriptions/patient/${patientId}`);
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

  // Export all prescriptions to PDF function
  const exportToPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HospiTrack - Prescription Report', margin, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Patient: ${user?.name || 'N/A'}`, margin, yPosition);
      
      yPosition += 7;
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`, margin, yPosition);
      
      yPosition += 15;

      // Process each prescription
      filteredPrescriptions.forEach((prescription, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = margin;
        }

        // Prescription header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Prescription #${prescription.prescriptionNumber || prescription.id}`, margin, yPosition);
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Basic info
        pdf.text(`Doctor: ${prescription.doctorName || prescription.doctorId || 'N/A'}`, margin, yPosition);
        yPosition += 5;
        pdf.text(`Date Issued: ${prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString() : 'N/A'}`, margin, yPosition);
        yPosition += 5;
        pdf.text(`Status: ${prescription.status || 'Active'}`, margin, yPosition);
        yPosition += 8;

        // Medications
        if (prescription.medications && prescription.medications.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Medications:', margin, yPosition);
          yPosition += 5;
          pdf.setFont('helvetica', 'normal');

          prescription.medications.forEach((med, medIndex) => {
            pdf.text(`${medIndex + 1}. ${med.medicineName}`, margin + 5, yPosition);
            yPosition += 4;
            pdf.text(`   Dosage: ${med.dosage} | Duration: ${med.duration}`, margin + 5, yPosition);
            if (med.frequency) {
              yPosition += 4;
              pdf.text(`   Frequency: ${med.frequency}`, margin + 5, yPosition);
            }
            yPosition += 6;
          });
        }

        // Notes
        if (prescription.notes) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Notes:', margin, yPosition);
          yPosition += 5;
          pdf.setFont('helvetica', 'normal');
          
          const noteLines = pdf.splitTextToSize(prescription.notes, pageWidth - 2 * margin);
          noteLines.forEach(line => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += 4;
          });
        }

        yPosition += 10; // Space between prescriptions
      });

      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        pdf.text('HospiTrack Patient Portal', margin, pageHeight - 10);
      }

      pdf.save(`${user?.name || 'Patient'}_Prescriptions_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF');
    }
  };

  // Export individual prescription to PDF
  const exportIndividualPrescriptionToPDF = (prescription) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Header with prescription number
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HospiTrack Medical Prescription', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.text(`Prescription #${prescription.prescriptionNumber || prescription.id}`, margin, yPosition);
      
      yPosition += 15;

      // Patient Information Box
      pdf.setDrawColor(0, 123, 255);
      pdf.setFillColor(240, 248, 255);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 123, 255);
      pdf.text('PATIENT INFORMATION', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Name: ${prescription.patientName || user?.name || 'N/A'}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Patient ID: ${prescription.patientId || user?.id || 'N/A'}`, margin + 5, yPosition);
      
      yPosition += 20;

      // Doctor Information Box
      pdf.setDrawColor(40, 167, 69);
      pdf.setFillColor(240, 255, 240);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 167, 69);
      pdf.text('PRESCRIBING PHYSICIAN', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Doctor: ${prescription.doctorName || prescription.doctorId || 'N/A'}`, margin + 5, yPosition);
      
      yPosition += 20;

      // Prescription Details
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 53, 69);
      pdf.text('PRESCRIBED MEDICATIONS', margin, yPosition);
      
      yPosition += 10;

      if (prescription.medications && prescription.medications.length > 0) {
        prescription.medications.forEach((med, index) => {
          // Medication box
          pdf.setDrawColor(108, 117, 125);
          pdf.setFillColor(248, 249, 250);
          pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 2, 2, 'FD');
          
          yPosition += 8;
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${index + 1}. ${med.medicineName}`, margin + 5, yPosition);
          
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Dosage: ${med.dosage}`, margin + 10, yPosition);
          
          yPosition += 5;
          pdf.text(`Duration: ${med.duration}`, margin + 10, yPosition);
          
          if (med.frequency) {
            yPosition += 5;
            pdf.text(`Frequency: ${med.frequency}`, margin + 10, yPosition);
          }
          
          yPosition += 15;
        });
      }

      // Additional Information
      if (prescription.notes || prescription.instructions) {
        yPosition += 5;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 193, 7);
        pdf.text('ADDITIONAL INSTRUCTIONS', margin, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        if (prescription.notes) {
          const noteLines = pdf.splitTextToSize(prescription.notes, pageWidth - 2 * margin);
          noteLines.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });
        }
        
        if (prescription.instructions) {
          yPosition += 3;
          const instructionLines = pdf.splitTextToSize(prescription.instructions, pageWidth - 2 * margin);
          instructionLines.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });
        }
      }

      // Footer information
      yPosition = pageHeight - 40;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(108, 117, 125);
      pdf.text(`Date Issued: ${prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'N/A'}`, margin, yPosition);
      
      yPosition += 6;
      pdf.text(`Status: ${prescription.status || 'Active'}`, margin, yPosition);
      
      yPosition += 6;
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })} at ${new Date().toLocaleTimeString()}`, margin, yPosition);

      // Bottom line
      pdf.setDrawColor(108, 117, 125);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      yPosition = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.text('HospiTrack Patient Portal - Digital Prescription', margin, yPosition);
      pdf.text('This is a digitally generated prescription', pageWidth - margin - 60, yPosition);

      pdf.save(`Prescription_${prescription.prescriptionNumber || prescription.id}_${user?.name || 'Patient'}.pdf`);
    } catch (err) {
      console.error('Error exporting individual prescription PDF:', err);
      alert('Failed to export prescription PDF');
    }
  };

  // Enhanced print function for individual prescription
  const printPrescription = (prescription) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription #${prescription.prescriptionNumber || prescription.id}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.6;
            }
            .prescription-header {
              text-align: center;
              border-bottom: 3px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .prescription-title {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
              margin: 0;
            }
            .prescription-number {
              font-size: 18px;
              color: #666;
              margin: 10px 0;
            }
            .info-section {
              background: #f8f9fa;
              border-left: 4px solid #007bff;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-title {
              font-size: 16px;
              font-weight: bold;
              color: #007bff;
              margin-bottom: 10px;
            }
            .info-row {
              margin: 8px 0;
              display: flex;
              justify-content: space-between;
            }
            .info-label {
              font-weight: 600;
              color: #495057;
            }
            .info-value {
              color: #212529;
            }
            .medications-section {
              margin: 30px 0;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #dc3545;
              border-bottom: 2px solid #dc3545;
              padding-bottom: 5px;
              margin-bottom: 20px;
            }
            .medication-item {
              background: white;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .medication-name {
              font-size: 18px;
              font-weight: bold;
              color: #495057;
              margin-bottom: 10px;
            }
            .medication-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .medication-detail {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              border-bottom: 1px solid #f1f3f4;
            }
            .notes-section {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }
            .notes-title {
              font-size: 16px;
              font-weight: bold;
              color: #856404;
              margin-bottom: 10px;
            }
            .notes-content {
              color: #533f03;
              line-height: 1.7;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 12px;
              color: #6c757d;
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="prescription-header">
            <h1 class="prescription-title">HospiTrack Medical Prescription</h1>
            <div class="prescription-number">Prescription #${prescription.prescriptionNumber || prescription.id}</div>
          </div>

          <div class="info-section">
            <div class="info-title">Patient Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${prescription.patientName || user?.name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Patient ID:</span>
              <span class="info-value">${prescription.patientId || user?.id || 'N/A'}</span>
            </div>
          </div>

          <div class="info-section">
            <div class="info-title">Prescribing Physician</div>
            <div class="info-row">
              <span class="info-label">Doctor:</span>
              <span class="info-value">${prescription.doctorName || prescription.doctorId || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date Issued:</span>
              <span class="info-value">${prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${prescription.status || 'Active'}</span>
            </div>
          </div>

          <div class="medications-section">
            <div class="section-title">Prescribed Medications</div>
            ${prescription.medications && prescription.medications.length > 0 
              ? prescription.medications.map((med, index) => `
                <div class="medication-item">
                  <div class="medication-name">${index + 1}. ${med.medicineName}</div>
                  <div class="medication-details">
                    <div class="medication-detail">
                      <span class="info-label">Dosage:</span>
                      <span class="info-value">${med.dosage}</span>
                    </div>
                    <div class="medication-detail">
                      <span class="info-label">Duration:</span>
                      <span class="info-value">${med.duration}</span>
                    </div>
                    ${med.frequency ? `
                      <div class="medication-detail">
                        <span class="info-label">Frequency:</span>
                        <span class="info-value">${med.frequency}</span>
                      </div>
                    ` : ''}
                    ${med.instructions ? `
                      <div class="medication-detail" style="grid-column: 1 / -1;">
                        <span class="info-label">Instructions:</span>
                        <span class="info-value">${med.instructions}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')
              : '<div class="medication-item">No medications listed</div>'
            }
          </div>

          ${(prescription.notes || prescription.instructions) ? `
            <div class="notes-section">
              <div class="notes-title">Additional Instructions & Notes</div>
              <div class="notes-content">
                ${prescription.notes ? `<div><strong>Doctor's Notes:</strong><br>${prescription.notes}</div>` : ''}
                ${prescription.instructions ? `<div style="margin-top: 10px;"><strong>Special Instructions:</strong><br>${prescription.instructions}</div>` : ''}
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <div>Generated on ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} at ${new Date().toLocaleTimeString()}</div>
            <div style="margin-top: 5px;">HospiTrack Patient Portal - Digital Prescription</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
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
          <button className="btn btn-secondary" onClick={exportToPDF} title="Export all prescriptions to PDF">
            <Download size={16} />
            Export All PDF
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
                      <button className="btn-icon btn-view" onClick={() => openModal(prescription)} title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon btn-download" onClick={() => exportIndividualPrescriptionToPDF(prescription)} title="Export PDF">
                        <Download size={16} />
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
        <div className="modal-overlay" onClick={closeModal}>
          <div className="prescription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prescription-modal-header">
              <div className="modal-header-content">
                <div className="prescription-icon">
                  <Pill size={24} />
                </div>
                <div className="prescription-title-section">
                  <h2>Prescription Details</h2>
                  <p>Complete medication information</p>
                </div>
              </div>
              <div className="modal-header-actions">
                {getStatusBadge(selectedPrescription.status || 'active')}
                <button className="modal-close-btn" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="prescription-modal-body">
              {/* Prescription Summary Card */}
              <div className="prescription-summary-card">
                <div className="summary-header">
                  <div className="prescription-number">
                    <span className="prescription-label">Prescription #</span>
                    <span className="prescription-id">
                      {selectedPrescription.prescriptionNumber || selectedPrescription.id}
                    </span>
                  </div>
                  <div className="prescription-date">
                    <Calendar size={16} />
                    <span>
                      {selectedPrescription.dateIssued 
                        ? new Date(selectedPrescription.dateIssued).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Date not available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Information */}
              <div className="prescription-info-grid">
                <div className="info-card patient-info-card">
                  <div className="info-card-header">
                    <User size={20} />
                    <h3>Patient Information</h3>
                  </div>
                  <div className="info-card-content">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">
                        {selectedPrescription.patientName || selectedPrescription.patientId || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-card doctor-info-card">
                  <div className="info-card-header">
                    <User size={20} />
                    <h3>Prescribing Doctor</h3>
                  </div>
                  <div className="info-card-content">
                    <div className="info-item">
                      <span className="info-label">Doctor</span>
                      <span className="info-value">
                        {selectedPrescription.doctorName || selectedPrescription.doctorId || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medications Section */}
              <div className="medications-section">
                <div className="section-header">
                  <Pill size={20} />
                  <h3>Prescribed Medications</h3>
                </div>
                <div className="medications-list">
                  {selectedPrescription.medications && selectedPrescription.medications.length > 0 ? (
                    selectedPrescription.medications.map((med, index) => (
                      <div key={index} className="medication-card">
                        <div className="medication-header">
                          <div className="medication-name">{med.medicineName}</div>
                          <div className="medication-index">#{index + 1}</div>
                        </div>
                        <div className="medication-details">
                          <div className="medication-detail-item">
                            <span className="detail-label">Dosage</span>
                            <span className="detail-value">{med.dosage}</span>
                          </div>
                          <div className="medication-detail-item">
                            <span className="detail-label">Duration</span>
                            <span className="detail-value">{med.duration}</span>
                          </div>
                          {med.frequency && (
                            <div className="medication-detail-item">
                              <span className="detail-label">Frequency</span>
                              <span className="detail-value">{med.frequency}</span>
                            </div>
                          )}
                          {med.instructions && (
                            <div className="medication-detail-item">
                              <span className="detail-label">Instructions</span>
                              <span className="detail-value">{med.instructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-medications">
                      <Pill size={32} />
                      <p>No medications listed</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes & Instructions Section */}
              {(selectedPrescription.notes || selectedPrescription.instructions) && (
                <div className="notes-section">
                  <div className="section-header">
                    <FileText size={20} />
                    <h3>Additional Notes</h3>
                  </div>
                  <div className="notes-content">
                    {selectedPrescription.notes && (
                      <div className="note-item">
                        <span className="note-label">Doctor's Notes:</span>
                        <p className="note-text">{selectedPrescription.notes}</p>
                      </div>
                    )}
                    {selectedPrescription.instructions && (
                      <div className="note-item">
                        <span className="note-label">Special Instructions:</span>
                        <p className="note-text">{selectedPrescription.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="prescription-modal-actions">
                <button className="btn btn-secondary" onClick={closeModal}>
                  <ArrowLeft size={16} />
                  Close
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => printPrescription(selectedPrescription)}
                  title="Print prescription with enhanced formatting"
                >
                  <FileText size={16} />
                  Print
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => exportIndividualPrescriptionToPDF(selectedPrescription)}
                  title="Export prescription as PDF"
                >
                  <Download size={16} />
                  Export PDF
                </button>
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
