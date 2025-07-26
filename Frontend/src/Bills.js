import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import './Bills.css';

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
      case 'paid': return <CheckCircle size={16} color="#28a745" />;
      case 'pending': return <Clock size={16} color="#ffc107" />;
      case 'overdue': return <AlertCircle size={16} color="#dc3545" />;
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
      <div className="bills-header">
        <div className="bills-header-left">
          <div className="navigation-buttons">
            <button
              className="bills-nav-button bills-nav-button--secondary"
              onClick={() => navigate('/patient-dashboard', { state: { user } })}
            >
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button
              className="bills-nav-button bills-nav-button--outline"
              onClick={() => navigate('/', { state: { user } })}
            >
              <Home size={16} />
              Home
            </button>
          </div>
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
                <strong>Total Amount:</strong> {formatCurrency(bill.totalAmount)}
              </footer>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Bills;
