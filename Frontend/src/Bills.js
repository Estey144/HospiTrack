import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Receipt, 
  ArrowLeft, 
  Home, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Download, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  FileText,
  User,
  Building,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import './Bills.css';

const Bills = ({ currentUser }) => {
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
    console.log('Bills page - User ID from params:', searchParams.get('userId'));
    console.log('Bills page - User from state:', location.state?.user);
    console.log('Bills page - Current user:', user);
  }, [searchParams, location.state, user]);

  // Update user state when navigation state or URL params change
  useEffect(() => {
    const newUser = getUserFromParams();
    if (newUser && newUser.id !== user?.id) {
      setUser(newUser);
      console.log('Bills page - User updated:', newUser);
    }
  }, [location.state, searchParams]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedBill, setExpandedBill] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock bills data - would normally be fetched based on user ID
  const [bills] = useState([
    {
      id: 'INV-2024-0087',
      patientId: user?.id || 'PAT-001', // Use actual user ID
      date: '2024-12-15',
      dueDate: '2025-01-15',
      status: 'pending',
      type: 'Consultation',
      department: 'Cardiology',
      doctor: 'Dr. Sarah Johnson',
      visitDate: '2024-12-15',
      totalAmount: 425.00,
      paidAmount: 0.00,
      balanceAmount: 425.00,
      services: [
        { description: 'Cardiology Consultation', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: 'ECG Test', quantity: 1, unitPrice: 75.00, total: 75.00 },
        { description: 'Blood Pressure Monitoring', quantity: 1, unitPrice: 25.00, total: 25.00 },
        { description: 'Prescription Medications', quantity: 3, unitPrice: 58.33, total: 175.00 }
      ],
      insurance: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789',
        coveragePercent: 80,
        coveredAmount: 340.00,
        deductible: 500.00,
        deductibleMet: 350.00
      },
      paymentHistory: []
    },
    {
      id: 'INV-2024-0078',
      patientId: user?.id || 'PAT-001', // Use actual user ID
      date: '2024-11-28',
      dueDate: '2024-12-28',
      status: 'paid',
      type: 'Emergency',
      department: 'Emergency Medicine',
      doctor: 'Dr. Michael Chen',
      visitDate: '2024-11-28',
      totalAmount: 1250.00,
      paidAmount: 1250.00,
      balanceAmount: 0.00,
      services: [
        { description: 'Emergency Room Visit', quantity: 1, unitPrice: 500.00, total: 500.00 },
        { description: 'Chest X-ray', quantity: 1, unitPrice: 200.00, total: 200.00 },
        { description: 'Blood Tests (CBC, CMP)', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: 'IV Fluids and Medications', quantity: 1, unitPrice: 300.00, total: 300.00 },
        { description: 'Emergency Physician Fee', quantity: 1, unitPrice: 100.00, total: 100.00 }
      ],
      insurance: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789',
        coveragePercent: 80,
        coveredAmount: 1000.00,
        deductible: 500.00,
        deductibleMet: 500.00
      },
      paymentHistory: [
        { date: '2024-12-05', amount: 250.00, method: 'Credit Card', reference: 'CC-2024-1205' },
        { date: '2024-12-15', amount: 1000.00, method: 'Insurance', reference: 'INS-BC-5547' }
      ]
    },
    {
      id: 'INV-2024-0065',
      patientId: user?.id || 'PAT-001', // Use actual user ID
      date: '2024-10-10',
      dueDate: '2024-11-10',
      status: 'overdue',
      type: 'Preventive Care',
      department: 'Family Medicine',
      doctor: 'Dr. Emily Rodriguez',
      visitDate: '2024-10-10',
      totalAmount: 320.00,
      paidAmount: 100.00,
      balanceAmount: 220.00,
      services: [
        { description: 'Annual Physical Examination', quantity: 1, unitPrice: 200.00, total: 200.00 },
        { description: 'Blood Work (Lipid Panel)', quantity: 1, unitPrice: 80.00, total: 80.00 },
        { description: 'Flu Vaccination', quantity: 1, unitPrice: 40.00, total: 40.00 }
      ],
      insurance: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789',
        coveragePercent: 80,
        coveredAmount: 200.00,
        deductible: 500.00,
        deductibleMet: 200.00
      },
      paymentHistory: [
        { date: '2024-10-20', amount: 100.00, method: 'Credit Card', reference: 'CC-2024-1020' }
      ]
    },
    {
      id: 'INV-2024-0052',
      patientId: user?.id || 'PAT-001', // Use actual user ID
      date: '2024-09-05',
      dueDate: '2024-10-05',
      status: 'paid',
      type: 'Specialist',
      department: 'Ophthalmology',
      doctor: 'Dr. James Wilson',
      visitDate: '2024-09-05',
      totalAmount: 280.00,
      paidAmount: 280.00,
      balanceAmount: 0.00,
      services: [
        { description: 'Eye Examination', quantity: 1, unitPrice: 120.00, total: 120.00 },
        { description: 'Vision Test', quantity: 1, unitPrice: 60.00, total: 60.00 },
        { description: 'Prescription Glasses', quantity: 1, unitPrice: 100.00, total: 100.00 }
      ],
      insurance: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789',
        coveragePercent: 70,
        coveredAmount: 196.00,
        deductible: 500.00,
        deductibleMet: 100.00
      },
      paymentHistory: [
        { date: '2024-09-12', amount: 84.00, method: 'Credit Card', reference: 'CC-2024-0912' },
        { date: '2024-09-20', amount: 196.00, method: 'Insurance', reference: 'INS-BC-4421' }
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

  // Filter and sort bills
  const filteredBills = bills
    .filter(bill => {
      const matchesSearch = bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
      
      const matchesDate = filterDate === 'all' || (() => {
        const billDate = new Date(bill.date);
        const now = new Date();
        const diffTime = now - billDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(filterDate) {
          case '30': return diffDays <= 30;
          case '90': return diffDays <= 90;
          case '365': return diffDays <= 365;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.totalAmount - a.totalAmount;
        case 'amount-asc': return a.totalAmount - b.totalAmount;
        case 'status': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'paid': return 'bill-badge--success';
      case 'pending': return 'bill-badge--warning';
      case 'overdue': return 'bill-badge--danger';
      default: return 'bill-badge--default';
    }
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

  const toggleBillExpansion = (billId) => {
    setExpandedBill(expandedBill === billId ? null : billId);
  };

  const handlePayBill = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const getTotalBalance = () => {
    return bills.reduce((total, bill) => total + bill.balanceAmount, 0);
  };

  const getOverdueBills = () => {
    return bills.filter(bill => bill.status === 'overdue').length;
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
    <div className="bills-page">
      {/* Header */}
      <div className="bills-header">
        <div className="bills-header-left">
          <div className="navigation-buttons">
            <button className="bills-nav-button bills-nav-button--secondary" onClick={() => navigate('/patient-dashboard', { state: { user } })}>
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button className="bills-nav-button bills-nav-button--outline" onClick={() => navigate('/', { state: { user } })}>
              <Home size={16} />
              Home
            </button>
          </div>
          <div className="bills-page-title">
            <h1><Receipt size={24} /> My Bills & Payments</h1>
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
        </div>
      </div>

      {/* Controls */}
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
            <Filter size={16} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
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
            <DollarSign size={16} />
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

      {/* Bills */}
      <div className="bills-container">
        {filteredBills.length === 0 ? (
          <div className="no-data">
            <Receipt size={64} />
            <p>No bills found</p>
            <span>Try adjusting your search or filter criteria</span>
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div key={bill.id} className="bill-card">
              <div className="bill-header" onClick={() => toggleBillExpansion(bill.id)}>
                <div className="bill-main-info">
                  <div className="bill-title-row">
                    <div className="bill-id-status">
                      <span className="bill-id">{bill.id}</span>
                      <span className={`bill-badge ${getStatusBadgeClass(bill.status)}`}>
                        {getStatusIcon(bill.status)}
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </div>
                    <span className="bill-date">{formatDate(bill.date)}</span>
                  </div>
                  <div className="bill-details-row">
                    <div className="bill-service-info">
                      <span className="service-type">{bill.type}</span>
                      <span className="doctor-name">{bill.doctor}</span>
                      <span className="department">{bill.department}</span>
                    </div>
                    <div className="bill-amount-info">
                      <span className="total-amount">{formatCurrency(bill.totalAmount)}</span>
                      {bill.balanceAmount > 0 && (
                        <span className="balance-amount">Balance: {formatCurrency(bill.balanceAmount)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bill-actions">
                  {bill.balanceAmount > 0 && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePayBill(bill);
                      }}
                    >
                      <CreditCard size={14} />
                      Pay Now
                    </button>
                  )}
                  <div className="bill-expand-button">
                    {expandedBill === bill.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedBill === bill.id && (
                <div className="bill-details">
                  <div className="bill-details-grid">
                    {/* Services */}
                    <div className="detail-section">
                      <h4>Services & Charges</h4>
                      <div className="services-table">
                        <div className="services-header">
                          <span>Description</span>
                          <span>Qty</span>
                          <span>Unit Price</span>
                          <span>Total</span>
                        </div>
                        {bill.services.map((service, index) => (
                          <div key={index} className="service-row">
                            <span className="service-description">{service.description}</span>
                            <span className="service-quantity">{service.quantity}</span>
                            <span className="service-unit-price">{formatCurrency(service.unitPrice)}</span>
                            <span className="service-total">{formatCurrency(service.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insurance */}
                    <div className="detail-section">
                      <h4>Insurance Information</h4>
                      <div className="insurance-info">
                        <div className="insurance-details">
                          <div className="info-row">
                            <span className="info-label">Provider:</span>
                            <span className="info-value">{bill.insurance.provider}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Policy Number:</span>
                            <span className="info-value">{bill.insurance.policyNumber}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Coverage:</span>
                            <span className="info-value">{bill.insurance.coveragePercent}%</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Covered Amount:</span>
                            <span className="info-value">{formatCurrency(bill.insurance.coveredAmount)}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Deductible Met:</span>
                            <span className="info-value">{formatCurrency(bill.insurance.deductibleMet)} / {formatCurrency(bill.insurance.deductible)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div className="detail-section">
                      <h4>Payment History</h4>
                      {bill.paymentHistory.length > 0 ? (
                        <div className="payment-history">
                          {bill.paymentHistory.map((payment, index) => (
                            <div key={index} className="payment-item">
                              <div className="payment-info">
                                <span className="payment-date">{formatDate(payment.date)}</span>
                                <span className="payment-method">{payment.method}</span>
                                <span className="payment-reference">{payment.reference}</span>
                              </div>
                              <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-payments">No payments made yet</p>
                      )}
                    </div>

                    {/* Bill Summary */}
                    <div className="detail-section">
                      <h4>Bill Summary</h4>
                      <div className="bill-summary">
                        <div className="summary-row">
                          <span>Total Amount:</span>
                          <span>{formatCurrency(bill.totalAmount)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Paid Amount:</span>
                          <span>{formatCurrency(bill.paidAmount)}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Balance Due:</span>
                          <span>{formatCurrency(bill.balanceAmount)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Due Date:</span>
                          <span className={bill.status === 'overdue' ? 'overdue-date' : ''}>{formatDate(bill.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bill-detail-actions">
                    <button className="btn btn-outline">
                      <Download size={16} />
                      Download PDF
                    </button>
                    <button className="btn btn-outline">
                      <FileText size={16} />
                      View Full Statement
                    </button>
                    {bill.balanceAmount > 0 && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handlePayBill(bill)}
                      >
                        <CreditCard size={16} />
                        Make Payment
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make Payment</h3>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="payment-details">
                <div className="payment-info-section">
                  <h4>Bill Information</h4>
                  <div className="payment-bill-info">
                    <div className="info-row">
                      <span>Invoice Number:</span>
                      <span>{selectedBill.id}</span>
                    </div>
                    <div className="info-row">
                      <span>Service Date:</span>
                      <span>{formatDate(selectedBill.visitDate)}</span>
                    </div>
                    <div className="info-row">
                      <span>Doctor:</span>
                      <span>{selectedBill.doctor}</span>
                    </div>
                    <div className="info-row">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedBill.totalAmount)}</span>
                    </div>
                    <div className="info-row">
                      <span>Amount Paid:</span>
                      <span>{formatCurrency(selectedBill.paidAmount)}</span>
                    </div>
                    <div className="info-row total">
                      <span>Balance Due:</span>
                      <span>{formatCurrency(selectedBill.balanceAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="payment-form-section">
                  <h4>Payment Method</h4>
                  <div className="payment-methods">
                    <div className="payment-method-option">
                      <input type="radio" id="credit-card" name="payment-method" defaultChecked />
                      <label htmlFor="credit-card">
                        <CreditCard size={16} />
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="payment-method-option">
                      <input type="radio" id="bank-transfer" name="payment-method" />
                      <label htmlFor="bank-transfer">
                        <Building size={16} />
                        Bank Transfer
                      </label>
                    </div>
                  </div>

                  <div className="payment-amount-section">
                    <label>Payment Amount</label>
                    <input 
                      type="number" 
                      defaultValue={selectedBill.balanceAmount}
                      max={selectedBill.balanceAmount}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">
                <CreditCard size={16} />
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
