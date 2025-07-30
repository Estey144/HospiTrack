import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Receipt,
  ArrowLeft,
  Home,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  FileText,
  Shield,
  Ambulance,
  Video,
  TestTube,
  Brain,
  MessageSquare,
  Menu,
  X,
  User,
  Download
} from 'lucide-react';
import './PatientDashboard.css';
import './Bills.css';
import { apiCall } from './utils/api';

const Bills = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getUserFromParams = () => {
    if (location.state?.user) return location.state.user;
    const userIdFromParams = searchParams.get('userId');
    if (userIdFromParams) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.id === userIdFromParams) return storedUser;
    }
    if (currentUser) return currentUser;
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
    { path: '/bills', label: 'Bills', icon: DollarSign, color: 'text-emerald-600' },
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
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
    }
  }, [location.state, searchParams]);

  useEffect(() => {
    const fetchBills = async () => {
      if (!user?.id) {
        setError('User ID not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/bills?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bills.');
        }

        const data = await response.json();
        setBills(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user?.id]);

  const filteredBills = bills
    .filter(bill => {
      const searchLower = searchTerm.toLowerCase();
      const doctorName = (bill.doctorName || '').toLowerCase();
      const department = (bill.department || '').toLowerCase();
      const appointmentType = (bill.appointmentType || '').toLowerCase();
      const billId = (bill.id || '').toString().toLowerCase();
      const status = (bill.status || '').toLowerCase();

      const matchesSearch =
        billId.includes(searchLower) ||
        doctorName.includes(searchLower) ||
        department.includes(searchLower) ||
        appointmentType.includes(searchLower);

      const matchesStatus = filterStatus === 'all' || status === filterStatus;

      const matchesDate = filterDate === 'all' || (() => {
        if (!bill.visitDate) return false;
        const billDate = new Date(bill.visitDate);
        const now = new Date();
        const diffDays = Math.ceil((now - billDate) / (1000 * 60 * 60 * 24));
        switch (filterDate) {
          case '30': return diffDays <= 30;
          case '90': return diffDays <= 90;
          case '365': return diffDays <= 365;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.visitDate) - new Date(a.visitDate);
        case 'date-asc':
          return new Date(a.visitDate) - new Date(b.visitDate);
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bill-badge bill-badge--success';
      case 'pending': return 'bill-badge bill-badge--warning';
      case 'overdue': return 'bill-badge bill-badge--danger';
      default: return 'bill-badge bill-badge--default';
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalBalance = () => {
    return bills.reduce((total, bill) => total + (bill.totalAmount || 0), 0);
  };

  const getOverdueBills = () => {
    return bills.filter(bill => bill.status?.toLowerCase() === 'overdue').length;
  };

  // Enhanced PDF export function
  const exportToPDF = () => {
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
      pdf.text('HospiTrack - Bills & Payment Report', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Patient: ${user?.name || 'N/A'}`, margin, yPosition);
      
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
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 123, 255);
      pdf.text('BILLING SUMMARY', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Total Balance: ${formatCurrency(getTotalBalance())}`, margin + 5, yPosition);
      
      yPosition += 6;
      pdf.text(`Overdue Bills: ${getOverdueBills()}`, margin + 5, yPosition);
      
      yPosition += 6;
      pdf.text(`Total Bills: ${filteredBills.length}`, margin + 5, yPosition);
      
      yPosition += 20;

      // Bills Section Header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 53, 69);
      pdf.text('BILLING DETAILS', margin, yPosition);
      
      yPosition += 15;

      // Process each bill
      filteredBills.forEach((bill, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        // Bill header box
        const statusColor = bill.status?.toLowerCase() === 'paid' ? [40, 167, 69] : 
                           bill.status?.toLowerCase() === 'pending' ? [255, 193, 7] : 
                           bill.status?.toLowerCase() === 'overdue' ? [220, 53, 69] : [108, 117, 125];
        
        pdf.setDrawColor(...statusColor);
        pdf.setFillColor(248, 249, 250);
        pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 2, 2, 'FD');
        
        yPosition += 8;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Invoice #${bill.id}`, margin + 5, yPosition);
        
        // Status badge
        pdf.setTextColor(...statusColor);
        pdf.text(`Status: ${bill.status?.toUpperCase() || 'UNKNOWN'}`, pageWidth - margin - 40, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Doctor: ${bill.doctorName || 'N/A'}`, margin + 10, yPosition);
        
        yPosition += 5;
        pdf.text(`Department: ${bill.department || 'N/A'}`, margin + 10, yPosition);
        
        yPosition += 5;
        pdf.text(`Visit Date: ${formatDate(bill.visitDate) || 'N/A'}`, margin + 10, yPosition);
        
        yPosition += 5;
        pdf.text(`Appointment Type: ${bill.appointmentType || 'N/A'}`, margin + 10, yPosition);
        
        yPosition += 15;

        // Bill items
        if (bill.items && bill.items.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Bill Items:', margin + 5, yPosition);
          yPosition += 6;
          
          bill.items.forEach(item => {
            pdf.setFont('helvetica', 'normal');
            pdf.text(`• ${item.description}`, margin + 10, yPosition);
            pdf.text(`${formatCurrency(item.amount)}`, pageWidth - margin - 30, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        }

        // Total amount
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`Total Amount: ${formatCurrency(bill.totalAmount)}`, margin + 5, yPosition);
        
        yPosition += 20; // Space between bills
      });

      // Financial Summary at the end
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      } else {
        yPosition += 10;
      }

      // Financial summary box
      pdf.setDrawColor(40, 167, 69);
      pdf.setFillColor(240, 255, 240);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 45, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 167, 69);
      pdf.text('FINANCIAL SUMMARY', margin + 5, yPosition);
      
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      const paidBills = filteredBills.filter(b => b.status?.toLowerCase() === 'paid');
      const pendingBills = filteredBills.filter(b => b.status?.toLowerCase() === 'pending');
      const overdueBills = filteredBills.filter(b => b.status?.toLowerCase() === 'overdue');
      
      const paidAmount = paidBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const pendingAmount = pendingBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const overdueAmount = overdueBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      // Split the content into two columns to fit better
      const leftColumn = margin + 5;
      const rightColumn = margin + (pageWidth - 2 * margin) / 2;
      
      pdf.text(`Paid Bills: ${paidBills.length}`, leftColumn, yPosition);
      pdf.text(`Amount: ${formatCurrency(paidAmount)}`, rightColumn, yPosition);
      yPosition += 6;
      
      pdf.text(`Pending Bills: ${pendingBills.length}`, leftColumn, yPosition);
      pdf.text(`Amount: ${formatCurrency(pendingAmount)}`, rightColumn, yPosition);
      yPosition += 6;
      
      pdf.text(`Overdue Bills: ${overdueBills.length}`, leftColumn, yPosition);
      pdf.text(`Amount: ${formatCurrency(overdueAmount)}`, rightColumn, yPosition);

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
        pdf.text('HospiTrack Patient Portal - Billing Report', margin, pageHeight - 10);
        pdf.text('This is a digitally generated billing report', margin, pageHeight - 6);
      }

      pdf.save(`${user?.name || 'Patient'}_Billing_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF');
    }
  };

  // Export individual bill to PDF
  const exportIndividualBillToPDF = (bill) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 139);
      pdf.text('HospiTrack Medical Invoice', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.text(`Invoice #${bill.id}`, margin, yPosition);
      
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
      pdf.text(`Name: ${user?.name || 'N/A'}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Patient ID: ${user?.id || 'N/A'}`, margin + 5, yPosition);
      
      yPosition += 20;

      // Service Information Box
      pdf.setDrawColor(40, 167, 69);
      pdf.setFillColor(240, 255, 240);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 2, 2, 'FD');
      
      yPosition += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 167, 69);
      pdf.text('SERVICE INFORMATION', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Doctor: ${bill.doctorName || 'N/A'}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Department: ${bill.department || 'N/A'}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Appointment Type: ${bill.appointmentType || 'N/A'}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Visit Date: ${formatDate(bill.visitDate) || 'N/A'}`, margin + 5, yPosition);
      
      yPosition += 20;

      // Bill Items Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 53, 69);
      pdf.text('BILL ITEMS', margin, yPosition);
      
      yPosition += 10;

      if (bill.items && bill.items.length > 0) {
        // Table header
        pdf.setDrawColor(108, 117, 125);
        pdf.setFillColor(248, 249, 250);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'FD');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Description', margin + 5, yPosition + 7);
        pdf.text('Amount', pageWidth - margin - 30, yPosition + 7);
        
        yPosition += 15;

        // Table rows
        bill.items.forEach((item, index) => {
          if (index % 2 === 1) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
          }
          
          pdf.setFont('helvetica', 'normal');
          pdf.text(item.description, margin + 5, yPosition + 3);
          pdf.text(formatCurrency(item.amount), pageWidth - margin - 30, yPosition + 3);
          yPosition += 8;
        });
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.text('No items listed', margin + 5, yPosition);
        yPosition += 10;
      }

      yPosition += 10;

      // Total Amount Box
      pdf.setDrawColor(255, 193, 7);
      pdf.setFillColor(255, 252, 230);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 2, 2, 'FD');
      
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`TOTAL AMOUNT: ${formatCurrency(bill.totalAmount)}`, margin + 5, yPosition);
      
      yPosition += 20;

      // Status Box
      const statusColor = bill.status?.toLowerCase() === 'paid' ? [40, 167, 69] : 
                         bill.status?.toLowerCase() === 'pending' ? [255, 193, 7] : 
                         bill.status?.toLowerCase() === 'overdue' ? [220, 53, 69] : [108, 117, 125];
      
      pdf.setDrawColor(...statusColor);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 2, 2, 'FD');
      
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...statusColor);
      pdf.text(`STATUS: ${bill.status?.toUpperCase() || 'UNKNOWN'}`, margin + 5, yPosition);

      // Footer information
      yPosition = pageHeight - 50;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(108, 117, 125);
      pdf.text(`Issue Date: ${formatDate(bill.issueDate) || 'N/A'}`, margin, yPosition);
      
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
      pdf.text('HospiTrack Patient Portal - Medical Invoice', margin, yPosition);
      pdf.text('This is a digitally generated invoice', pageWidth - margin - 60, yPosition);

      pdf.save(`Invoice_${bill.id}_${user?.name || 'Patient'}.pdf`);
    } catch (err) {
      console.error('Error exporting individual bill PDF:', err);
      alert('Failed to export bill PDF');
    }
  };

  if (loading) {
    return (
      <div className="bills-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

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
        <div className="bills-page">
      <div className="bills-header">
        <div className="bills-header-left">
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
          <div className="bills-page-title">
            <h1><Receipt size={28} /> My Bills & Payments</h1>
            <p>View and manage your medical bills and payment history</p>
          </div>
        </div>
        <div className="bills-header-right">
          <div className="billing-summary">
            <div className="summary-item">
              <span className="summary-label">Total Balance</span>
              <span className="summary-amount balance">{formatCurrency(getTotalBalance())}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Overdue Bills</span>
              <span className="summary-count overdue">{getOverdueBills()}</span>
            </div>
          </div>
          <button 
            className="export-pdf-btn"
            onClick={exportToPDF}
            title="Export all bills as comprehensive PDF report"
          >
            <Download className="btn-icon" />
            Export All PDF
          </button>
        </div>
      </div>

      <div className="bills-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by invoice number, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={18} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="filter-group">
            <Calendar size={18} />
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="all">All Dates</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div className="filter-group">
            <DollarSign size={18} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bills-container">
        {error ? (
          <div className="no-data">
            <AlertCircle size={64} />
            <p>Error: {error}</p>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="no-data">
            <Receipt size={64} />
            <p>No bills found</p>
            <span>Try adjusting your search or filter criteria</span>
          </div>
        ) : (
          filteredBills.map((bill) => (
            <article key={bill.id} className="bill-card">
              <header className="bill-header">
                <h3 className="invoice-id">Invoice #{bill.id}</h3>
                <span className={getStatusBadgeClass(bill.status)} title={bill.status}>
                  {getStatusIcon(bill.status)} {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </span>
              </header>

              <section className="bill-details">
                <div className="bill-info-group">
                  <p><strong>Doctor:</strong> {bill.doctorName}</p>
                  <p><strong>Department:</strong> {bill.department}</p>
                  <p><strong>Appointment Type:</strong> {bill.appointmentType}</p>
                </div>

                <div className="bill-info-group">
                  <p><strong>Visit Date:</strong> {formatDate(bill.visitDate)}</p>
                  <p><strong>Issue Date:</strong> {formatDate(bill.issueDate)}</p>
                </div>
              </section>

              <section className="bill-items">
                <h4>Bill Items</h4>
                {bill.items && bill.items.length > 0 ? (
                  <table className="bill-items-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.items.map(item => (
                        <tr key={item.id || item.description}>
                          <td>{item.description}</td>
                          <td>{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-items">No items found</p>
                )}
              </section>

              <footer className="bill-total">
                <div className="bill-amount">
                  <strong>Total Amount:</strong> {formatCurrency(bill.totalAmount)}
                </div>
                <button 
                  className="bill-pdf-btn"
                  onClick={() => exportIndividualBillToPDF(bill)}
                  title="Export this bill as PDF"
                >
                  <Download size={16} />
                  Export PDF
                </button>
              </footer>
            </article>
          ))
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default Bills;
