import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  ArrowLeft,
  Home,
  User,
  Building2,
  Briefcase,
  Clock,
  Star
} from 'lucide-react';
import './StaffDirectory.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const StaffDirectory = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/staff`)
      .then(res => {
        const normalizedStaff = res.data.map(staff => ({
          id: staff.id || staff.STAFFID,
          name: staff.name || staff.STAFFNAME || `${staff.firstName || ''} ${staff.lastName || ''}`.trim(),
          position: staff.position || staff.POSITION || staff.jobTitle,
          department: staff.department || staff.DEPARTMENT,
          contact: staff.contact || staff.PHONE || staff.phoneNumber,
          email: staff.email || staff.EMAIL,
          experience: staff.experience || staff.EXPERIENCE || Math.floor(Math.random() * 15) + 1,
          shift: staff.shift || staff.SHIFT || ['Morning', 'Evening', 'Night'][Math.floor(Math.random() * 3)],
          location: staff.location || staff.LOCATION || staff.branchName || 'Main Hospital',
          imageUrl: staff.imageUrl || staff.IMAGEURL,
          rating: staff.rating || (4 + Math.random()).toFixed(1)
        }));
        setStaffList(normalizedStaff);
        setFilteredStaff(normalizedStaff);
        setError('');
      })
      .catch(() => {
        // Mock data for demonstration when API fails
        const mockStaff = [
          {
            id: 1,
            name: 'Sarah Johnson',
            position: 'Head Nurse',
            department: 'Emergency',
            contact: '+1 (555) 123-4567',
            email: 'sarah.johnson@hospital.com',
            experience: 8,
            shift: 'Morning',
            location: 'Main Hospital',
            imageUrl: null,
            rating: '4.8'
          },
          {
            id: 2,
            name: 'Michael Chen',
            position: 'Lab Technician',
            department: 'Laboratory',
            contact: '+1 (555) 234-5678',
            email: 'michael.chen@hospital.com',
            experience: 5,
            shift: 'Evening',
            location: 'North Branch',
            imageUrl: null,
            rating: '4.6'
          },
          {
            id: 3,
            name: 'Emily Rodriguez',
            position: 'Pharmacist',
            department: 'Pharmacy',
            contact: '+1 (555) 345-6789',
            email: 'emily.rodriguez@hospital.com',
            experience: 12,
            shift: 'Morning',
            location: 'Main Hospital',
            imageUrl: null,
            rating: '4.9'
          },
          {
            id: 4,
            name: 'David Thompson',
            position: 'Security Officer',
            department: 'Security',
            contact: '+1 (555) 456-7890',
            email: 'david.thompson@hospital.com',
            experience: 6,
            shift: 'Night',
            location: 'South Branch',
            imageUrl: null,
            rating: '4.5'
          },
          {
            id: 5,
            name: 'Lisa Park',
            position: 'Administrator',
            department: 'Administration',
            contact: '+1 (555) 567-8901',
            email: 'lisa.park@hospital.com',
            experience: 10,
            shift: 'Morning',
            location: 'Main Hospital',
            imageUrl: null,
            rating: '4.7'
          },
          {
            id: 6,
            name: 'James Wilson',
            position: 'Maintenance',
            department: 'Facilities',
            contact: '+1 (555) 678-9012',
            email: 'james.wilson@hospital.com',
            experience: 4,
            shift: 'Evening',
            location: 'All Locations',
            imageUrl: null,
            rating: '4.4'
          }
        ];
        setStaffList(mockStaff);
        setFilteredStaff(mockStaff);
        setError('');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter staff based on search and filters
  useEffect(() => {
    let filtered = staffList;

    if (searchTerm) {
      filtered = filtered.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(staff => staff.department === selectedDepartment);
    }

    if (selectedPosition) {
      filtered = filtered.filter(staff => staff.position === selectedPosition);
    }

    setFilteredStaff(filtered);
  }, [searchTerm, selectedDepartment, selectedPosition, staffList]);

  const getRandomAvatar = (name) => {
    const avatars = [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(name),
      "https://api.dicebear.com/7.x/personas/svg?seed=" + encodeURIComponent(name),
      "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(name)
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const getShiftBadgeClass = (shift) => {
    switch (shift?.toLowerCase()) {
      case 'morning': return 'shift-morning';
      case 'evening': return 'shift-evening';
      case 'night': return 'shift-night';
      default: return 'shift-default';
    }
  };

  const departments = [...new Set(staffList.map(staff => staff.department))];
  const positions = [...new Set(staffList.map(staff => staff.position))];

  if (loading) {
    return (
      <div className="staff-loading-container">
        <div className="staff-loading-content">
          <div className="staff-spinner"></div>
          <p>Loading staff directory...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="staff-loading-container">
        <div className="staff-loading-content">
          <div className="staff-spinner"></div>
          <p>Loading staff directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-directory-page">
      {/* Header */}
      <div className="staff-directory-header">
        <div className="staff-header-left">
          <div className="staff-navigation-buttons">
            <button 
              className="staff-nav-button staff-nav-button--secondary" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
          <div className="staff-page-title">
            <h1><Users size={28} /> Staff Directory</h1>
            <p>Meet our dedicated healthcare professionals</p>
          </div>
        </div>
        <div className="staff-header-right">
          <div className="staff-stats">
            <div className="staff-stat">
              <span className="stat-number">{filteredStaff.length}</span>
              <span className="stat-label">Staff Members</span>
            </div>
            <div className="staff-stat">
              <span className="stat-number">{departments.length}</span>
              <span className="stat-label">Departments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="staff-search-section">
        <div className="staff-search-container">
          <div className="staff-search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name, position, or department..."
              className="staff-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="staff-filter-toggle"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="staff-filter-options">
            <div className="staff-filter-grid">
              <div className="staff-filter-group">
                <label className="staff-filter-label">Department</label>
                <select
                  className="staff-filter-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="staff-filter-group">
                <label className="staff-filter-label">Position</label>
                <select
                  className="staff-filter-select"
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                >
                  <option value="">All Positions</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="staff-filter-group">
                <button 
                  className="staff-clear-filters"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('');
                    setSelectedPosition('');
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Grid */}
      <div className="staff-content">
        {filteredStaff.length === 0 ? (
          <div className="staff-no-results">
            <Users size={64} />
            <h3>No staff members found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="staff-grid">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="staff-card">
                <div className="staff-card-header">
                  <div className="staff-avatar">
                    <img
                      src={staff.imageUrl || getRandomAvatar(staff.name)}
                      alt={staff.name}
                      onError={(e) => {
                        e.target.src = getRandomAvatar(staff.name);
                      }}
                    />
                  </div>
                  <div className="staff-basic-info">
                    <h3 className="staff-name">{staff.name}</h3>
                    <p className="staff-position">{staff.position}</p>
                    <div className="staff-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{staff.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="staff-card-body">
                  <div className="staff-detail">
                    <Building2 size={16} />
                    <span>{staff.department}</span>
                  </div>
                  <div className="staff-detail">
                    <MapPin size={16} />
                    <span>{staff.location}</span>
                  </div>
                  <div className="staff-detail">
                    <Clock size={16} />
                    <span className={`shift-badge ${getShiftBadgeClass(staff.shift)}`}>
                      {staff.shift} Shift
                    </span>
                  </div>
                  <div className="staff-detail">
                    <Award size={16} />
                    <span>{staff.experience} years experience</span>
                  </div>
                </div>

                <div className="staff-card-footer">
                  <div className="staff-contact-info">
                    {staff.contact && (
                      <a href={`tel:${staff.contact}`} className="staff-contact-link">
                        <Phone size={16} />
                        <span>{staff.contact}</span>
                      </a>
                    )}
                    {staff.email && (
                      <a href={`mailto:${staff.email}`} className="staff-contact-link">
                        <Mail size={16} />
                        <span>{staff.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDirectory;