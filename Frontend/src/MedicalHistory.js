import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  FileText, ArrowLeft, Home, Calendar, Stethoscope, 
  Activity, Heart, Eye, Search, Filter, Download, Clock,
  AlertCircle, ChevronDown, ChevronUp, Pill 
} from 'lucide-react';
import './MedicalHistory.css';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock medical history data
  const [medicalRecords] = useState([
    {
      id: 1,
      date: '2024-12-15',
      type: 'Consultation',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      diagnosis: 'Hypertension - Routine Follow-up',
      symptoms: ['Mild headaches', 'Occasional dizziness'],
      treatment: 'Medication adjustment, lifestyle counseling',
      medications: ['Lisinopril 10mg', 'Hydrochlorothiazide 25mg'],
      notes: 'Blood pressure well controlled. Continue current medication regimen. Follow up in 3 months.',
      vitals: {
        bloodPressure: '128/82',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        weight: '165 lbs'
      },
      labResults: ['CBC - Normal', 'Lipid Panel - Elevated cholesterol'],
      attachments: ['ECG Report.pdf', 'Blood Test Results.pdf']
    },
    {
      id: 2,
      date: '2024-11-28',
      type: 'Emergency',
      doctor: 'Dr. Michael Chen',
      department: 'Emergency Medicine',
      diagnosis: 'Acute Bronchitis',
      symptoms: ['Persistent cough', 'Chest congestion', 'Fatigue'],
      treatment: 'Antibiotic therapy, bronchodilator inhaler',
      medications: ['Amoxicillin 500mg', 'Albuterol inhaler'],
      notes: 'Patient presented with 5-day history of productive cough. Chest X-ray clear. Prescribed 7-day antibiotic course.',
      vitals: {
        bloodPressure: '135/85',
        heartRate: '88 bpm',
        temperature: '100.2°F',
        weight: '165 lbs'
      },
      labResults: ['Chest X-ray - Clear', 'WBC - Slightly elevated'],
      attachments: ['Chest X-ray.pdf', 'Discharge Summary.pdf']
    },
    {
      id: 3,
      date: '2024-10-10',
      type: 'Preventive',
      doctor: 'Dr. Emily Rodriguez',
      department: 'Family Medicine',
      diagnosis: 'Annual Physical Examination',
      symptoms: ['No current symptoms'],
      treatment: 'Routine health screening, vaccinations updated',
      medications: ['Multivitamin daily'],
      notes: 'Overall excellent health. All screenings normal. Flu vaccine administered. Next annual exam in 12 months.',
      vitals: {
        bloodPressure: '122/78',
        heartRate: '68 bpm',
        temperature: '98.4°F',
        weight: '163 lbs'
      },
      labResults: ['Complete Metabolic Panel - Normal', 'Lipid Panel - Normal', 'HbA1c - 5.2%'],
      attachments: ['Annual Physical Report.pdf', 'Vaccination Record.pdf']
    },
    {
      id: 4,
      date: '2024-09-05',
      type: 'Specialist',
      doctor: 'Dr. James Wilson',
      department: 'Ophthalmology',
      diagnosis: 'Routine Eye Examination',
      symptoms: ['Mild eye strain from computer work'],
      treatment: 'Computer vision syndrome management, new prescription glasses',
      medications: ['Artificial tears as needed'],
      notes: 'Vision 20/25 both eyes. Mild dry eye syndrome. Recommended blue light filtering glasses for computer work.',
      vitals: {
        bloodPressure: '125/80',
        heartRate: '70 bpm',
        temperature: '98.5°F',
        weight: '164 lbs'
      },
      labResults: ['Visual Acuity Test - 20/25', 'Intraocular Pressure - Normal'],
      attachments: ['Eye Exam Report.pdf', 'Prescription Details.pdf']
    },
    {
      id: 5,
      date: '2024-07-20',
      type: 'Follow-up',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      diagnosis: 'Hypertension Management',
      symptoms: ['No symptoms'],
      treatment: 'Blood pressure monitoring, diet counseling',
      medications: ['Lisinopril 5mg', 'Low-dose aspirin'],
      notes: 'Blood pressure improved with lifestyle changes. Reduced medication dosage. Continue dietary modifications.',
      vitals: {
        bloodPressure: '118/75',
        heartRate: '65 bpm',
        temperature: '98.3°F',
        weight: '162 lbs'
      },
      labResults: ['Basic Metabolic Panel - Normal'],
      attachments: ['BP Monitoring Log.pdf']
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="medical-history-page">
      {/* Header */}
      <div className="medical-history-header">
        <div className="medical-history-header-left">
          <div className="navigation-buttons">
            <button 
              className="medical-nav-button medical-nav-button--secondary" 
              onClick={() => navigate('/patient-dashboard', { 
                state: { user },
                replace: false 
              })}
            >
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button className="medical-nav-button medical-nav-button--outline" onClick={() => navigate('/')}>
              <Home size={16} />
              Home
            </button>
          </div>
          <div className="medical-page-title">
            <h1><FileText size={24} /> Medical History</h1>
            <p>View your complete medical records and visit history</p>
          </div>
        </div>
        <div className="medical-history-header-right">
          <button className="btn btn-outline">
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
  );
};

export default MedicalHistory;
