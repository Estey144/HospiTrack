import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
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
  Info
} from 'lucide-react';
import './Insurance.css';

const Insurance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showClaimsModal, setShowClaimsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);

  // Mock insurance providers (from Insurance_Providers table)
  const [insuranceProviders] = useState([
    {
      id: 'PROV-001',
      name: 'Blue Cross Blue Shield',
      contact_info: JSON.stringify({
        phone: '1-800-BCBS-123',
        website: 'www.bcbs.com',
        memberServices: '1-800-MEMBER-1',
        address: '123 Healthcare Blvd, Chicago, IL 60601'
      })
    },
    {
      id: 'PROV-002',
      name: 'Aetna',
      contact_info: JSON.stringify({
        phone: '1-800-AETNA-DT',
        website: 'www.aetna.com',
        memberServices: '1-800-DENTAL-1',
        address: '151 Farmington Ave, Hartford, CT 06156'
      })
    }
  ]);

  // Mock patient insurance data (from Patient_Insurance table)
  const [patientInsurance] = useState([
    {
      id: 'PI-001',
      patient_id: 'PAT-001', // Current patient ID
      provider_id: 'PROV-001',
      policy_number: 'BC123456789',
      coverage_details: JSON.stringify({
        planName: 'Premium Health Plan',
        groupNumber: 'GRP789012',
        memberID: 'MEM456789',
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        status: 'active',
        isPrimary: true,
        deductible: {
          individual: 500.00,
          family: 1500.00,
          met: 350.00,
          remaining: 150.00
        },
        outOfPocketMax: {
          individual: 3000.00,
          family: 9000.00,
          met: 850.00,
          remaining: 2150.00
        },
        copays: {
          primaryCare: 25.00,
          specialist: 50.00,
          emergency: 200.00,
          urgentCare: 75.00
        },
        coverage: {
          medical: 80,
          prescription: 75,
          dental: 70,
          vision: 60,
          mentalHealth: 80
        },
        employer: 'TechCorp Solutions',
        rxBIN: '610014',
        rxPCN: 'BCBS',
        rxGroup: 'RX12345'
      })
    },
    {
      id: 'PI-002',
      patient_id: 'PAT-001', // Current patient ID
      provider_id: 'PROV-002',
      policy_number: 'AET987654321',
      coverage_details: JSON.stringify({
        planName: 'Dental Plus Coverage',
        groupNumber: 'DENT456',
        memberID: 'DEN789012',
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        status: 'active',
        isPrimary: false,
        deductible: {
          individual: 100.00,
          family: 300.00,
          met: 75.00,
          remaining: 25.00
        },
        outOfPocketMax: {
          individual: 1500.00,
          family: 4500.00,
          met: 300.00,
          remaining: 1200.00
        },
        coverage: {
          preventive: 100,
          basic: 80,
          major: 50,
          orthodontics: 50
        },
        employer: 'TechCorp Solutions'
      })
    }
  ]);

  // Mock claims data (from Claims table)
  const [recentClaims] = useState([
    {
      id: 'CLM-2024-0087',
      appointment_id: 'APT-2024-0156',
      insurance_id: 'PI-001',
      claim_status: 'processed',
      claim_amount: 425.00,
      submitted_on: '2024-12-15',
      // Additional fields for display (would come from joins with other tables)
      provider: 'Dr. Sarah Johnson',
      service: 'Cardiology Consultation',
      approved: 340.00,
      paid: 340.00,
      patientResponsibility: 85.00,
      insurancePlan: 'Blue Cross Blue Shield'
    },
    {
      id: 'CLM-2024-0078',
      appointment_id: 'APT-2024-0145',
      insurance_id: 'PI-001',
      claim_status: 'processed',
      claim_amount: 1250.00,
      submitted_on: '2024-11-28',
      provider: 'Emergency Medical Center',
      service: 'Emergency Room Visit',
      approved: 1000.00,
      paid: 1000.00,
      patientResponsibility: 250.00,
      insurancePlan: 'Blue Cross Blue Shield'
    },
    {
      id: 'CLM-2024-0065',
      appointment_id: 'APT-2024-0134',
      insurance_id: 'PI-001',
      claim_status: 'processed',
      claim_amount: 320.00,
      submitted_on: '2024-10-10',
      provider: 'Dr. Emily Rodriguez',
      service: 'Annual Physical',
      approved: 256.00,
      paid: 256.00,
      patientResponsibility: 64.00,
      insurancePlan: 'Blue Cross Blue Shield'
    },
    {
      id: 'CLM-2024-0052',
      appointment_id: 'APT-2024-0123',
      insurance_id: 'PI-002',
      claim_status: 'processed',
      claim_amount: 150.00,
      submitted_on: '2024-09-05',
      provider: 'Dental Care Center',
      service: 'Dental Cleaning',
      approved: 150.00,
      paid: 150.00,
      patientResponsibility: 0.00,
      insurancePlan: 'Aetna Dental'
    }
  ]);

  const [benefits] = useState([
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

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const getClaimStatusBadgeClass = (claim_status) => {
    switch(claim_status) {
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
      const provider = insuranceProviders.find(p => p.id === insurance.provider_id);
      const coverageDetails = JSON.parse(insurance.coverage_details);
      const contactInfo = provider ? JSON.parse(provider.contact_info) : {};
      
      return {
        id: insurance.id,
        provider: provider?.name || 'Unknown Provider',
        policyNumber: insurance.policy_number,
        ...coverageDetails,
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

  if (loading) {
    return (
      <div className="insurance-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading insurance information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insurance-page">
      {/* Header */}
      <div className="insurance-header">
        <div className="insurance-header-left">
          <div className="navigation-buttons">
            <button className="insurance-nav-button insurance-nav-button--secondary" onClick={() => navigate('/patient-dashboard')}>
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button className="insurance-nav-button insurance-nav-button--outline" onClick={() => navigate('/')}>
              <Home size={16} />
              Home
            </button>
          </div>
          <div className="insurance-page-title">
            <h1><Shield size={24} /> Insurance & Benefits</h1>
            <p>Manage your insurance plans and view coverage details</p>
          </div>
        </div>
        <div className="insurance-header-right">
          <button className="btn btn-outline" onClick={handleAddInsurance}>
            <Plus size={16} />
            Add Insurance
          </button>
          <button className="btn btn-outline">
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
            <span className="stat-value">{formatCurrency(primaryInsurance?.deductible.met || 0)}</span>
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
            <span className="stat-value">{formatCurrency(primaryInsurance?.outOfPocketMax.met || 0)}</span>
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
            {/* Primary Insurance Card */}
            {primaryInsurance && (
              <div className="insurance-card primary-card">
                <div className="card-header">
                  <div className="card-title">
                    <Shield size={20} />
                    <span>Primary Insurance</span>
                    <span className={`insurance-badge ${getStatusBadgeClass(primaryInsurance.status)}`}>
                      {getStatusIcon(primaryInsurance.status)}
                      {primaryInsurance.status.charAt(0).toUpperCase() + primaryInsurance.status.slice(1)}
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
                        <span className="summary-value">{formatCurrency(primaryInsurance.deductible.met)} / {formatCurrency(primaryInsurance.deductible.individual)}</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${(primaryInsurance.deductible.met / primaryInsurance.deductible.individual) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Out-of-Pocket Max</span>
                        <span className="summary-value">{formatCurrency(primaryInsurance.outOfPocketMax.met)} / {formatCurrency(primaryInsurance.outOfPocketMax.individual)}</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${(primaryInsurance.outOfPocketMax.met / primaryInsurance.outOfPocketMax.individual) * 100}%`}}
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
                {primaryInsurance && Object.entries(primaryInsurance.coverage).map(([type, percentage]) => (
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
                      <span className="claim-amount">Billed: {formatCurrency(claim.claim_amount)}</span>
                      <span className="claim-paid">Paid: {formatCurrency(claim.paid)}</span>
                    </div>
                    <span className={`claim-badge ${getClaimStatusBadgeClass(claim.claim_status)}`}>
                      {claim.claim_status.charAt(0).toUpperCase() + claim.claim_status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="plans-content">
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
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
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
                  <span className="claim-date">{formatDate(claim.submitted_on)}</span>
                  <span className="claim-provider">{claim.provider}</span>
                  <span className="claim-service">{claim.service}</span>
                  <span className="claim-amount">{formatCurrency(claim.claim_amount)}</span>
                  <span className="claim-paid">{formatCurrency(claim.paid)}</span>
                  <span className={`claim-badge ${getClaimStatusBadgeClass(claim.claim_status)}`}>
                    {claim.claim_status.charAt(0).toUpperCase() + claim.claim_status.slice(1)}
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
              <div className="insurance-form">
                <div className="form-section">
                  <h4>Insurance Provider Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Insurance Provider *</label>
                      <select required>
                        <option value="">Select Provider</option>
                        {insuranceProviders.map(provider => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Plan Name *</label>
                      <input type="text" placeholder="e.g., Premium Health Plan" required />
                    </div>
                    <div className="form-group">
                      <label>Plan Type *</label>
                      <select required>
                        <option value="">Select Type</option>
                        <option value="medical">Medical</option>
                        <option value="dental">Dental</option>
                        <option value="vision">Vision</option>
                        <option value="mental-health">Mental Health</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority</label>
                      <select>
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
                      <input type="text" placeholder="Policy Number" required />
                    </div>
                    <div className="form-group">
                      <label>Member ID *</label>
                      <input type="text" placeholder="Member ID" required />
                    </div>
                    <div className="form-group">
                      <label>Group Number</label>
                      <input type="text" placeholder="Group Number" />
                    </div>
                    <div className="form-group">
                      <label>Employer/Sponsor</label>
                      <input type="text" placeholder="Employer Name" />
                    </div>
                    <div className="form-group">
                      <label>Effective Date *</label>
                      <input type="date" required />
                    </div>
                    <div className="form-group">
                      <label>Expiration Date</label>
                      <input type="date" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Contact Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="1-800-XXX-XXXX" />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input type="url" placeholder="www.example.com" />
                    </div>
                    <div className="form-group">
                      <label>Member Services Phone</label>
                      <input type="tel" placeholder="1-800-XXX-XXXX" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Prescription Information (if applicable)</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>RX BIN</label>
                      <input type="text" placeholder="RX BIN Number" />
                    </div>
                    <div className="form-group">
                      <label>RX PCN</label>
                      <input type="text" placeholder="RX PCN" />
                    </div>
                    <div className="form-group">
                      <label>RX Group</label>
                      <input type="text" placeholder="RX Group Number" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAddInsurance(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">
                <Plus size={16} />
                Add Insurance Plan
              </button>
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
                    <span className={`claim-badge ${getClaimStatusBadgeClass(selectedClaim.claim_status)}`}>
                      {selectedClaim.claim_status.charAt(0).toUpperCase() + selectedClaim.claim_status.slice(1)}
                    </span>
                    <span className="claim-date">Submitted: {formatDate(selectedClaim.submitted_on)}</span>
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
                          <span className="info-value">{formatDate(selectedClaim.submitted_on)}</span>
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
                          <span className="financial-value">{formatCurrency(selectedClaim.claim_amount)}</span>
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
                          <span className="timeline-date">{formatDate(selectedClaim.submitted_on)}</span>
                        </div>
                      </div>
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Claim Received</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submitted_on)}</span>
                        </div>
                      </div>
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Claim Processed</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submitted_on)}</span>
                        </div>
                      </div>
                      <div className="timeline-item completed">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Payment Issued</span>
                          <span className="timeline-date">{formatDate(selectedClaim.submitted_on)}</span>
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
  );
};

export default Insurance;
