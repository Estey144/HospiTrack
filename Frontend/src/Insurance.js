import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  DollarSign,
  Building,
  Edit,
  Plus,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Info,
  Menu,
  X,
  Ambulance,
  Video,
  TestTube,
  Brain,
  MessageSquare
} from 'lucide-react';
import './Insurance.css';
import './PatientDashboard.css';

const Insurance = ({ currentUser }) => {
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
  
  // State variables for backend data
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Backend data state
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [patientInsurance, setPatientInsurance] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [error, setError] = useState(null);

  // API Base URL - adjust this to your backend URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

  // Debug logging to verify user ID is received
  useEffect(() => {
    console.log('Insurance page - User ID from params:', searchParams.get('userId'));
    console.log('Insurance page - User from state:', location.state?.user);
    console.log('Insurance page - Current user:', user);
    console.log('Insurance page - API Base URL:', API_BASE_URL);
  }, [searchParams, location.state, user]);

  // Update user state when navigation state or URL params change
  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
      console.log('Insurance page - User updated:', newUser);
    }
  }, [location.state, searchParams]);

  // Fetch data from backend when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchInsuranceData();
    }
  }, [user?.id]);

  // API Functions
  const fetchInsuranceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting to fetch insurance data for user:', user);
      console.log('API Base URL:', API_BASE_URL);
      
      // Test basic connectivity first
      const testResponse = await fetch(`${API_BASE_URL}/insurance/providers`);
      console.log('Providers endpoint test status:', testResponse.status);
      
      await Promise.all([
        fetchInsuranceProviders(),
        fetchPatientInsurance(),
        fetchRecentClaims(),
        fetchBenefitsData()
      ]);
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      setError('Failed to load insurance data. Please check your connection and try again. Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsuranceProviders = async () => {
    try {
      console.log('Fetching insurance providers...');
      const response = await fetch(`${API_BASE_URL}/insurance/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Remove Authorization header if not using JWT authentication
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch insurance providers:', response.status, response.statusText);
        throw new Error(`Failed to fetch insurance providers: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Insurance providers data received:', data);
      setInsuranceProviders(data);
    } catch (error) {
      console.error('Error fetching insurance providers:', error);
      // Set empty array on error to prevent UI crashes
      setInsuranceProviders([]);
      throw error;
    }
  };

  const fetchPatientInsurance = async () => {
    try {
      console.log('Fetching patient insurance for user ID:', user.id);
      const response = await fetch(`${API_BASE_URL}/insurance/plans?patientId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Remove Authorization header if not using JWT authentication
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch patient insurance:', response.status, response.statusText);
        throw new Error(`Failed to fetch patient insurance: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Patient insurance data received:', data);
      setPatientInsurance(data);
    } catch (error) {
      console.error('Error fetching patient insurance:', error);
      // Set empty array on error to prevent UI crashes
      setPatientInsurance([]);
      throw error;
    }
  };

  const fetchRecentClaims = async () => {
    try {
      console.log('Fetching claims for user ID:', user.id);
      const response = await fetch(`${API_BASE_URL}/insurance/claims?patientId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Remove Authorization header if not using JWT authentication
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch claims:', response.status, response.statusText);
        throw new Error(`Failed to fetch claims: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Claims data received:', data);
      setRecentClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      // Set empty array on error to prevent UI crashes
      setRecentClaims([]);
      throw error;
    }
  };

  const fetchBenefitsData = async () => {
    try {
      console.log('Fetching benefits for user ID:', user.id);
      const response = await fetch(`${API_BASE_URL}/benefits/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Remove Authorization header if not using JWT authentication
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch benefits:', response.status, response.statusText);
        throw new Error(`Failed to fetch benefits: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Benefits data received:', data);
      setBenefits(data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
      // Set default benefits structure if API fails
      setBenefits([
        {
          category: 'Medical Services',
          items: [
            { service: 'Primary Care Visits', coverage: '80% after deductible', copay: '$25' },
            { service: 'Specialist Visits', coverage: '80% after deductible', copay: '$50' },
            { service: 'Emergency Room', coverage: '80% after deductible', copay: '$200' },
            { service: 'Urgent Care', coverage: '80% after deductible', copay: '$75' },
            { service: 'Preventive Care', coverage: '100%', copay: '$0' },
            { service: 'Laboratory Tests', coverage: '80% after deductible', copay: 'Varies' },
            { service: 'Imaging (X-ray, MRI)', coverage: '80% after deductible', copay: 'Varies' }
          ]
        },
        {
          category: 'Prescription Drugs',
          items: [
            { service: 'Generic Drugs (Tier 1)', coverage: '75% after deductible', copay: '$10' },
            { service: 'Brand Name (Tier 2)', coverage: '75% after deductible', copay: '$35' },
            { service: 'Specialty Drugs (Tier 3)', coverage: '75% after deductible', copay: '$75' }
          ]
        },
        {
          category: 'Mental Health',
          items: [
            { service: 'Therapy Sessions', coverage: '80% after deductible', copay: '$50' },
            { service: 'Psychiatrist Visits', coverage: '80% after deductible', copay: '$50' },
            { service: 'Inpatient Mental Health', coverage: '80% after deductible', copay: 'Varies' }
          ]
        }
      ]);
    }
  };

  const addNewInsurance = async (insuranceData) => {
    try {
      console.log('Adding insurance with data:', insuranceData);
      const response = await fetch(`${API_BASE_URL}/patient-insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Remove Authorization header if not using JWT authentication
        },
        body: JSON.stringify({
          patientId: user.id, // Fixed: use patientId instead of patient_id to match backend DTO
          providerId: insuranceData.providerId, // Fixed: use providerId instead of provider_id
          policyNumber: insuranceData.policyNumber, // Fixed: use policyNumber instead of policy_number
          coverageDetails: insuranceData.coverageDetails // This should be a JSON string
        })
      });
      
      if (!response.ok) {
        console.error('Failed to add insurance:', response.status, response.statusText);
        throw new Error(`Failed to add insurance: ${response.status}`);
      }
      
      const newInsurance = await response.json();
      console.log('Insurance added successfully:', newInsurance);
      setPatientInsurance(prev => [...prev, newInsurance]);
      setShowAddInsurance(false);
      
      // Show success message
      alert('Insurance plan added successfully!');
    } catch (error) {
      console.error('Error adding insurance:', error);
      alert('Failed to add insurance plan: ' + error.message);
    }
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <AlertCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active': return 'insurance-badge--success';
      case 'inactive': return 'insurance-badge--danger';
      case 'pending': return 'insurance-badge--warning';
      default: return 'insurance-badge--default';
    }
  };

  const getClaimStatusBadgeClass = (claimStatus) => {
    switch(claimStatus) {
      case 'processed': return 'claim-badge--success';
      case 'pending': return 'claim-badge--warning';
      case 'denied': return 'claim-badge--danger';
      case 'submitted': return 'claim-badge--default';
      default: return 'claim-badge--default';
    }
  };

  // Helper function to get insurance plans with provider info
  const getInsurancePlansWithProviders = () => {
    return patientInsurance.map(insurance => {
      // Find the provider based on providerId from the backend
      const provider = insuranceProviders.find(p => p.id === insurance.providerId);
      
      // Parse coverage details if it's a string, otherwise use as-is
      const coverageDetails = typeof insurance.coverageDetails === 'string' 
        ? JSON.parse(insurance.coverageDetails) 
        : insurance.coverageDetails || {};
      
      // Parse contact info if provider exists and has contact info
      const contactInfo = provider && provider.contactInfo 
        ? (typeof provider.contactInfo === 'string' 
           ? JSON.parse(provider.contactInfo) 
           : provider.contactInfo)
        : {};
      
      return {
        id: insurance.id,
        provider: insurance.providerName || provider?.name || 'Unknown Provider', // Use providerName from DTO
        policyNumber: insurance.policyNumber, // Fixed: use correct field name
        status: coverageDetails.status || 'active',
        planName: coverageDetails.planName || 'Insurance Plan',
        memberID: coverageDetails.memberID || insurance.policyNumber,
        groupNumber: coverageDetails.groupNumber || '',
        effectiveDate: coverageDetails.effectiveDate || new Date().toISOString().split('T')[0],
        expirationDate: coverageDetails.expirationDate || '',
        employer: coverageDetails.employer || '',
        isPrimary: coverageDetails.isPrimary || false,
        deductible: coverageDetails.deductible || { individual: 1000, met: 0 },
        outOfPocketMax: coverageDetails.outOfPocketMax || { individual: 5000, met: 0 },
        coverage: coverageDetails.coverage || { medical: 80, dental: 70, vision: 60 },
        contact: contactInfo
      };
    });
  };

  const insurancePlans = getInsurancePlansWithProviders();
  const primaryInsurance = insurancePlans.find(plan => plan.isPrimary);

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetails(true);
  };

  const handleAddInsurance = () => {
    setShowAddInsurance(true);
  };

  const handleSubmitInsurance = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const insuranceData = {
      providerId: formData.get('provider_id'), // Fixed: use correct field name
      policyNumber: formData.get('policy_number'), // Fixed: use correct field name
      coverageDetails: JSON.stringify({
        planName: formData.get('plan_name'),
        groupNumber: formData.get('group_number'),
        memberID: formData.get('member_id'),
        effectiveDate: formData.get('effective_date'),
        expirationDate: formData.get('expiration_date'),
        status: 'active',
        isPrimary: formData.get('priority') === 'primary',
        employer: formData.get('employer'),
        rxBIN: formData.get('rx_bin'),
        rxPCN: formData.get('rx_pcn'),
        rxGroup: formData.get('rx_group'),
        deductible: { individual: 1000, met: 0 }, // Default values
        outOfPocketMax: { individual: 5000, met: 0 }, // Default values
        coverage: { medical: 80, dental: 70, vision: 60 } // Default coverage percentages
      })
    };
    
    await addNewInsurance(insuranceData);
  };

  // Export insurance cards to PDF
  const exportInsuranceCardsToPDF = () => {
    const input = document.querySelector('.insurance-cards-container');

    if (!input) {
      // If no specific container found, export the whole insurance content
      const fallbackInput = document.querySelector('.insurance-page-container');
      if (!fallbackInput) {
        alert('Insurance data not found! Please navigate to the Plans or Overview tab to export cards.');
        return;
      }
      
      html2canvas(fallbackInput, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add title to PDF
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Insurance Cards & Information', 20, 20);
        
        // Add current date
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

        // Add the image below the title
        const startY = 40;
        const availableHeight = pdf.internal.pageSize.getHeight() - startY - 20;
        const scaledHeight = Math.min(pdfHeight, availableHeight);
        const scaledWidth = (scaledHeight * imgProps.width) / imgProps.height;

        pdf.addImage(imgData, 'PNG', 20, startY, scaledWidth, scaledHeight);
        pdf.save('insurance-cards.pdf');
      }).catch(err => {
        console.error('Error exporting PDF:', err);
        alert('Failed to export PDF');
      });
      return;
    }

    html2canvas(input, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Add title and header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Insurance Cards', 20, 20);
      
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
      pdf.save(`${user?.name ? user.name.replace(/\s+/g, '_') + '_' : ''}insurance-cards.pdf`);
    }).catch(err => {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF. Please make sure you are on the Plans or Overview tab.');
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="patient-dashboard-wrapper">
        <div className="patient-main">
          <div className="insurance-page-container">
            <div className="loading-container">
              <RefreshCw size={24} className="loading-spinner" />
              <p>Loading insurance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="patient-dashboard-wrapper">
        <div className="patient-main">
          <div className="insurance-page-container">
            <div className="error-container">
              <AlertCircle size={24} className="error-icon" />
              <p>{error}</p>
              <button onClick={fetchInsuranceData} className="btn btn-primary">
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
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
        <div className="insurance-page-container">
        <div className="insurance-page">
      {/* Header */}
      <div className="insurance-header">
        <div className="insurance-header-left">
          <div className="insurance-page-title">
            <div className="insurance-title-with-sidebar">
              <button 
                className="patient-sidebar-toggle-main"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1><Shield size={24} /> Insurance & Benefits</h1>
            </div>
            <p>Manage your insurance plans and view coverage details</p>
          </div>
        </div>
        <div className="insurance-header-right">
          <button className="btn btn-outline" onClick={handleAddInsurance}>
            <Plus size={16} />
            Add Insurance
          </button>
          <button className="btn btn-outline" onClick={exportInsuranceCardsToPDF}>
            <Download size={16} />
            Download Cards
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="insurance-quick-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Plans</span>
            <span className="stat-value">{insurancePlans.filter(p => p.status === 'active').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Deductible Met</span>
            <span className="stat-value">{formatCurrency(primaryInsurance?.deductible?.met || 0)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Claims YTD</span>
            <span className="stat-value">{recentClaims.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Out-of-Pocket</span>
            <span className="stat-value">{formatCurrency(primaryInsurance?.outOfPocketMax?.met || 0)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="insurance-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Shield size={16} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'plans' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <FileText size={16} />
          Insurance Plans
        </button>
        <button 
          className={`tab ${activeTab === 'benefits' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          <Info size={16} />
          Benefits Guide
        </button>
        <button 
          className={`tab ${activeTab === 'claims' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          <FileText size={16} />
          Claims History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="insurance-cards-container">
            {/* Primary Insurance Card */}
            {primaryInsurance && (
              <div className="insurance-card primary-card">
                <div className="card-header">
                  <div className="card-title">
                    <Shield size={20} />
                    <span>Primary Insurance</span>
                    <span className={`insurance-badge ${getStatusBadgeClass(primaryInsurance.status)}`}>
                      {getStatusIcon(primaryInsurance.status)}
                      {primaryInsurance.status?.charAt(0).toUpperCase() + primaryInsurance.status?.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="insurance-info">
                    <h3>{primaryInsurance.provider}</h3>
                    <p className="plan-name">{primaryInsurance.planName}</p>
                    <div className="policy-details">
                      <div className="detail-item">
                        <span className="label">Policy Number:</span>
                        <span className="value">{primaryInsurance.policyNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Member ID:</span>
                        <span className="value">{primaryInsurance.memberID}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Group Number:</span>
                        <span className="value">{primaryInsurance.groupNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="insurance-summary">
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">Deductible</span>
                        <span className="summary-value">{formatCurrency(primaryInsurance.deductible?.met || 0)} / {formatCurrency(primaryInsurance.deductible?.individual || 0)}</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${((primaryInsurance.deductible?.met || 0) / (primaryInsurance.deductible?.individual || 1)) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Out-of-Pocket Max</span>
                        <span className="summary-value">{formatCurrency(primaryInsurance.outOfPocketMax?.met || 0)} / {formatCurrency(primaryInsurance.outOfPocketMax?.individual || 0)}</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${((primaryInsurance.outOfPocketMax?.met || 0) / (primaryInsurance.outOfPocketMax?.individual || 1)) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coverage Summary */}
            <div className="coverage-summary">
              <h3>Coverage Summary</h3>
              <div className="coverage-grid">
                {primaryInsurance && primaryInsurance.coverage && Object.entries(primaryInsurance.coverage).map(([type, percentage]) => (
                  <div key={type} className="coverage-item">
                    <span className="coverage-type">{type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                    <span className="coverage-percentage">{percentage}%</span>
                    <div className="coverage-bar">
                      <div 
                        className="coverage-fill" 
                        style={{width: `${percentage}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Claims */}
            <div className="recent-claims">
              <div className="section-header">
                <h3>Recent Claims</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('claims')}>
                  View All
                </button>
              </div>
              <div className="claims-list">
                {recentClaims.slice(0, 3).map((claim) => (
                  <div key={claim.id} className="claim-item">
                    <div className="claim-info">
                      <span className="claim-id">{claim.id}</span>
                      <span className="claim-service">{claim.service}</span>
                      <span className="claim-provider">{claim.provider}</span>
                    </div>
                    <div className="claim-amounts">
                      <span className="claim-amount">Billed: {formatCurrency(claim.claimAmount)}</span>
                      <span className="claim-paid">Paid: {formatCurrency(claim.paid)}</span>
                    </div>
                    <span className={`claim-badge ${getClaimStatusBadgeClass(claim.claimStatus)}`}>
                      {claim.claimStatus.charAt(0).toUpperCase() + claim.claimStatus.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="plans-content">
            <div className="insurance-cards-container">
            <div className="plans-grid">
              {insurancePlans.map((plan) => (
                <div key={plan.id} className={`insurance-plan-card ${plan.isPrimary ? 'primary-plan' : ''}`}>
                  <div className="plan-header">
                    <div className="plan-title">
                      <h3>{plan.provider}</h3>
                      {plan.isPrimary && <span className="primary-badge">Primary</span>}
                    </div>
                    <span className={`insurance-badge ${getStatusBadgeClass(plan.status)}`}>
                      {getStatusIcon(plan.status)}
                      {plan.status?.charAt(0).toUpperCase() + plan.status?.slice(1)}
                    </span>
                  </div>
                  <div className="plan-content">
                    <p className="plan-name">{plan.planName}</p>
                    <div className="plan-details">
                      <div className="detail-row">
                        <span>Policy Number:</span>
                        <span>{plan.policyNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span>Member ID:</span>
                        <span>{plan.memberID}</span>
                      </div>
                      <div className="detail-row">
                        <span>Effective Date:</span>
                        <span>{formatDate(plan.effectiveDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Expires:</span>
                        <span>{formatDate(plan.expirationDate)}</span>
                      </div>
                      {plan.employer && (
                        <div className="detail-row">
                          <span>Employer:</span>
                          <span>{plan.employer}</span>
                        </div>
                      )}
                    </div>
                    {plan.contact && (
                      <div className="contact-info">
                        <h4>Contact Information</h4>
                        <div className="contact-details">
                          <div className="contact-item">
                            <Phone size={14} />
                            <span>{plan.contact.phone}</span>
                          </div>
                          <div className="contact-item">
                            <ExternalLink size={14} />
                            <span>{plan.contact.website}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="plan-actions">
                      <button className="btn btn-outline btn-sm">
                        <Eye size={14} />
                        View Details
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <Download size={14} />
                        ID Card
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <Edit size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="benefits-content">
            {benefits.map((category, index) => (
              <div key={index} className="benefit-category">
                <h3>{category.category}</h3>
                <div className="benefits-table">
                  <div className="benefits-header">
                    <span>Service</span>
                    <span>Coverage</span>
                    <span>Copay</span>
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="benefit-row">
                      <span className="benefit-service">{item.service}</span>
                      <span className="benefit-coverage">{item.coverage}</span>
                      <span className="benefit-copay">{item.copay}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="claims-content">
            <div className="claims-header">
              <div className="claims-controls">
                <div className="search-box">
                  <Search size={20} />
                  <input type="text" placeholder="Search claims..." />
                </div>
                <div className="filter-group">
                  <Filter size={16} />
                  <select>
                    <option>All Claims</option>
                    <option>Processed</option>
                    <option>Pending</option>
                    <option>Denied</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="claims-table">
              <div className="claims-table-header">
                <span>Claim ID</span>
                <span>Date</span>
                <span>Provider</span>
                <span>Service</span>
                <span>Amount</span>
                <span>Paid</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {recentClaims.map((claim) => (
                <div key={claim.id} className="claim-row">
                  <span className="claim-id">{claim.id}</span>
                  <span className="claim-date">{formatDate(claim.submittedOn)}</span>
                  <span className="claim-provider">{claim.provider}</span>
                  <span className="claim-service">{claim.service}</span>
                  <span className="claim-amount">{formatCurrency(claim.claimAmount)}</span>
                  <span className="claim-paid">{formatCurrency(claim.paid)}</span>
                  <span className={`claim-badge ${getClaimStatusBadgeClass(claim.claimStatus)}`}>
                    {claim.claimStatus.charAt(0).toUpperCase() + claim.claimStatus.slice(1)}
                  </span>
                  <div className="claim-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => handleViewClaim(claim)}>
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Insurance Modal */}
      {showAddInsurance && (
        <div className="modal-overlay" onClick={() => setShowAddInsurance(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Insurance Plan</h3>
              <button className="modal-close" onClick={() => setShowAddInsurance(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="insurance-form" onSubmit={handleSubmitInsurance}>
                <div className="form-section">
                  <h4>Insurance Provider Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Insurance Provider *</label>
                      <select name="provider_id" required>
                        <option value="">Select Provider</option>
                        {insuranceProviders.map(provider => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Plan Name *</label>
                      <input name="plan_name" type="text" placeholder="e.g., Premium Health Plan" required />
                    </div>
                    <div className="form-group">
                      <label>Plan Type *</label>
                      <select name="plan_type" required>
                        <option value="">Select Type</option>
                        <option value="medical">Medical</option>
                        <option value="dental">Dental</option>
                        <option value="vision">Vision</option>
                        <option value="mental-health">Mental Health</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority</label>
                      <select name="priority">
                        <option value="primary">Primary Insurance</option>
                        <option value="secondary">Secondary Insurance</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Policy Details</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Policy Number *</label>
                      <input name="policy_number" type="text" placeholder="Policy Number" required />
                    </div>
                    <div className="form-group">
                      <label>Member ID *</label>
                      <input name="member_id" type="text" placeholder="Member ID" required />
                    </div>
                    <div className="form-group">
                      <label>Group Number</label>
                      <input name="group_number" type="text" placeholder="Group Number" />
                    </div>
                    <div className="form-group">
                      <label>Employer/Sponsor</label>
                      <input name="employer" type="text" placeholder="Employer Name" />
                    </div>
                    <div className="form-group">
                      <label>Effective Date *</label>
                      <input name="effective_date" type="date" required />
                    </div>
                    <div className="form-group">
                      <label>Expiration Date</label>
                      <input name="expiration_date" type="date" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Contact Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input name="phone" type="tel" placeholder="1-800-XXX-XXXX" />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input name="website" type="url" placeholder="www.example.com" />
                    </div>
                    <div className="form-group">
                      <label>Member Services Phone</label>
                      <input name="member_services" type="tel" placeholder="1-800-XXX-XXXX" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Prescription Information (if applicable)</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>RX BIN</label>
                      <input name="rx_bin" type="text" placeholder="RX BIN Number" />
                    </div>
                    <div className="form-group">
                      <label>RX PCN</label>
                      <input name="rx_pcn" type="text" placeholder="RX PCN" />
                    </div>
                    <div className="form-group">
                      <label>RX Group</label>
                      <input name="rx_group" type="text" placeholder="RX Group Number" />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddInsurance(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Plus size={16} />
                    Add Insurance Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Claim Details Modal */}
      {showClaimDetails && selectedClaim && (
        <div className="modal-overlay" onClick={() => setShowClaimDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Claim Details - {selectedClaim.id}</h3>
              <button className="modal-close" onClick={() => setShowClaimDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="claim-details-content">
                <div className="claim-overview">
                  <div className="claim-status-header">
                    <span className={`claim-badge ${getClaimStatusBadgeClass(selectedClaim.claimStatus)}`}>
                      {selectedClaim.claimStatus.charAt(0).toUpperCase() + selectedClaim.claimStatus.slice(1)}
                    </span>
                    <span className="claim-date">Submitted: {formatDate(selectedClaim.submittedOn)}</span>
                  </div>
                  
                  <div className="claim-summary-grid">
                    <div className="summary-section">
                      <h4>Service Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Provider:</span>
                          <span className="info-value">{selectedClaim.provider}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Service:</span>
                          <span className="info-value">{selectedClaim.service}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Date of Service:</span>
                          <span className="info-value">{formatDate(selectedClaim.submittedOn)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Insurance Plan:</span>
                          <span className="info-value">{selectedClaim.insurancePlan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="summary-section">
                      <h4>Financial Summary</h4>
                      <div className="financial-breakdown">
                        <div className="financial-item">
                          <span className="financial-label">Amount Billed:</span>
                          <span className="financial-value">{formatCurrency(selectedClaim.claimAmount)}</span>
                        </div>
                        <div className="financial-item">
                          <span className="financial-label">Amount Approved:</span>
                          <span className="financial-value approved">{formatCurrency(selectedClaim.approved)}</span>
                        </div>
                        <div className="financial-item">
                          <span className="financial-label">Insurance Paid:</span>
                          <span className="financial-value paid">{formatCurrency(selectedClaim.paid)}</span>
                        </div>
                        <div className="financial-item total">
                          <span className="financial-label">Patient Responsibility:</span>
                          <span className="financial-value">{formatCurrency(selectedClaim.patientResponsibility)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="claim-timeline">
                    <h4>Claim Timeline</h4>
                    <div className="timeline-items">
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Claim Submitted</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submittedOn)}</span>
                        </div>
                      </div>
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Claim Received</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submittedOn)}</span>
                        </div>
                      </div>
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Claim Processed</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submittedOn)}</span>
                        </div>
                      </div>
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Payment Issued</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submittedOn)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="claim-notes">
                    <h4>Explanation of Benefits</h4>
                    <div className="eob-content">
                      <p>This claim has been processed according to your plan benefits. The approved amount reflects the negotiated rate with your insurance provider. Your patient responsibility includes any applicable deductible, copayment, or coinsurance amounts.</p>
                      
                      {selectedClaim.patientResponsibility > 0 && (
                        <div className="patient-action">
                          <AlertCircle size={16} />
                          <span>You have a remaining balance of {formatCurrency(selectedClaim.patientResponsibility)} for this service.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowClaimDetails(false)}>
                Close
              </button>
              <button className="btn btn-outline">
                <Download size={16} />
                Download EOB
              </button>
              <button className="btn btn-primary">
                <FileText size={16} />
                Dispute Claim
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;