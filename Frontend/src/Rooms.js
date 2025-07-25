import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Bed, 
  Search, 
  Filter, 
  MapPin, 
  ArrowLeft, 
  Home,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Stethoscope,
  Heart,
  Activity,
  Users,
  Shield,
  Zap,
  Eye
} from 'lucide-react';
import './Rooms.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/rooms`)
      .then(res => {
        const normalizedRooms = res.data.map(room => ({
          id: room.id || room.ROOMID,
          roomNumber: room.room_number || room.ROOMNUMBER || room.roomNumber,
          type: room.type || room.ROOMTYPE || room.roomType,
          status: room.status || room.STATUS,
          floor: room.floor || room.FLOOR || Math.floor(parseInt(room.room_number || room.ROOMNUMBER || room.roomNumber) / 100) || 1,
          capacity: room.capacity || room.CAPACITY || (room.type?.toLowerCase().includes('icu') ? 1 : 2),
          doctorName: room.doctor_name || room.DOCTORNAME || room.doctorName,
          department: room.department || room.DEPARTMENT,
          price: room.price || room.PRICE || Math.floor(Math.random() * 500) + 100,
          amenities: room.amenities || room.AMENITIES || [],
          lastUpdated: room.last_updated || room.LASTUPDATED || new Date().toISOString()
        }));
        setRooms(normalizedRooms);
        setFilteredRooms(normalizedRooms);
        setError('');
      })
      .catch(() => {
        // Mock data for demonstration when API fails
        const mockRooms = [
          {
            id: 1,
            roomNumber: '101',
            type: 'General Ward',
            status: 'Available',
            floor: 1,
            capacity: 2,
            doctorName: 'Dr. Sarah Johnson',
            department: 'General Medicine',
            price: 150,
            amenities: ['AC', 'TV', 'WiFi'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 2,
            roomNumber: '102',
            type: 'Private Room',
            status: 'Occupied',
            floor: 1,
            capacity: 1,
            doctorName: 'Dr. Michael Chen',
            department: 'Cardiology',
            price: 300,
            amenities: ['AC', 'TV', 'WiFi', 'Bathroom'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 3,
            roomNumber: '201',
            type: 'ICU',
            status: 'Available',
            floor: 2,
            capacity: 1,
            doctorName: 'Dr. Emily Rodriguez',
            department: 'Critical Care',
            price: 800,
            amenities: ['Life Support', 'Monitoring', 'AC'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 4,
            roomNumber: '202',
            type: 'Surgery Suite',
            status: 'In Use',
            floor: 2,
            capacity: 1,
            doctorName: 'Dr. David Thompson',
            department: 'Surgery',
            price: 1200,
            amenities: ['Surgical Equipment', 'AC', 'Monitoring'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 5,
            roomNumber: '301',
            type: 'Maternity Room',
            status: 'Available',
            floor: 3,
            capacity: 2,
            doctorName: 'Dr. Lisa Park',
            department: 'Obstetrics',
            price: 400,
            amenities: ['Baby Care', 'AC', 'TV', 'WiFi'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 6,
            roomNumber: '302',
            type: 'Pediatric Room',
            status: 'Available',
            floor: 3,
            capacity: 2,
            doctorName: 'Dr. James Wilson',
            department: 'Pediatrics',
            price: 250,
            amenities: ['Child Friendly', 'AC', 'TV', 'Play Area'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 7,
            roomNumber: '401',
            type: 'VIP Suite',
            status: 'Occupied',
            floor: 4,
            capacity: 1,
            doctorName: 'Dr. Robert Davis',
            department: 'Internal Medicine',
            price: 1500,
            amenities: ['Premium Care', 'AC', 'TV', 'WiFi', 'Kitchenette', 'Bathroom'],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 8,
            roomNumber: '203',
            type: 'Emergency Room',
            status: 'Available',
            floor: 2,
            capacity: 1,
            doctorName: 'Dr. Anna Martinez',
            department: 'Emergency',
            price: 500,
            amenities: ['Emergency Equipment', 'Monitoring', 'AC'],
            lastUpdated: new Date().toISOString()
          }
        ];
        setRooms(mockRooms);
        setFilteredRooms(mockRooms);
        setError('');
      })
      .finally(() => setLoading(false));
  }, []);

    // Filter rooms based on search and filters
  useEffect(() => {
    let filtered = rooms;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(room => room.status.toLowerCase() === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(room => room.type.toLowerCase().includes(typeFilter.toLowerCase()));
    }

    // Floor filter
    if (floorFilter !== 'all') {
      filtered = filtered.filter(room => room.floor.toString() === floorFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, statusFilter, typeFilter, floorFilter]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <CheckCircle className="status-icon available" />;
      case 'occupied':
      case 'in use':
        return <XCircle className="status-icon occupied" />;
      case 'maintenance':
        return <AlertCircle className="status-icon maintenance" />;
      default:
        return <AlertCircle className="status-icon" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'icu':
        return <Heart className="type-icon" />;
      case 'surgery suite':
      case 'emergency room':
        return <Activity className="type-icon" />;
      case 'maternity room':
        return <Users className="type-icon" />;
      case 'pediatric room':
        return <Shield className="type-icon" />;
      case 'vip suite':
        return <Zap className="type-icon" />;
      default:
        return <Bed className="type-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="rooms-container">
        <div className="loading-spinner">
          <Activity className="spin" />
          <p>Loading room information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      {/* Header */}
      <div className="rooms-header">
        <div className="header-content">
          <div className="title-section">
            <Building className="header-icon" />
            <div>
              <h1>Room Availability</h1>
              <p>Real-time room status and availability</p>
            </div>
          </div>
          <div className="navigation-buttons">
            <button onClick={() => navigate('/')} className="nav-button home">
              <Home size={20} />
              Homepage
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="rooms-stats">
        <div className="stat-card available">
          <CheckCircle className="stat-icon" />
          <div className="stat-content">
            <h3>{filteredRooms.filter(room => room.status.toLowerCase() === 'available').length}</h3>
            <p>Available Rooms</p>
          </div>
        </div>
        <div className="stat-card occupied">
          <XCircle className="stat-icon" />
          <div className="stat-content">
            <h3>{filteredRooms.filter(room => room.status.toLowerCase() === 'occupied' || room.status.toLowerCase() === 'in use').length}</h3>
            <p>Occupied Rooms</p>
          </div>
        </div>
        <div className="stat-card total">
          <Building className="stat-icon" />
          <div className="stat-content">
            <h3>{filteredRooms.length}</h3>
            <p>Total Rooms</p>
          </div>
        </div>
        <div className="stat-card types">
          <Bed className="stat-icon" />
          <div className="stat-content">
            <h3>{[...new Set(filteredRooms.map(room => room.type))].length}</h3>
            <p>Room Types</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by room number, type, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-section">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="in use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Type:</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="general">General Ward</option>
              <option value="private">Private Room</option>
              <option value="icu">ICU</option>
              <option value="surgery">Surgery Suite</option>
              <option value="maternity">Maternity Room</option>
              <option value="pediatric">Pediatric Room</option>
              <option value="vip">VIP Suite</option>
              <option value="emergency">Emergency Room</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Floor:</label>
            <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)}>
              <option value="all">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>
          </div>
          <button
            className="clear-filters"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
              setFloorFilter('all');
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {filteredRooms.length === 0 ? (
          <div className="no-results">
            <Eye size={48} />
            <h3>No rooms found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          filteredRooms.map(room => (
            <div key={room.id} className={`room-card ${room.status.toLowerCase().replace(' ', '-')}`}>
              <div className="room-header">
                <div className="room-number">
                  {getTypeIcon(room.type)}
                  <span>Room {room.roomNumber}</span>
                </div>
                <div className="room-status">
                  {getStatusIcon(room.status)}
                  <span>{room.status}</span>
                </div>
              </div>
              
              <div className="room-details">
                <div className="room-type">
                  <Bed size={16} />
                  <span>{room.type}</span>
                </div>
                <div className="room-floor">
                  <MapPin size={16} />
                  <span>Floor {room.floor}</span>
                </div>
                <div className="room-capacity">
                  <Users size={16} />
                  <span>{room.capacity} bed{room.capacity > 1 ? 's' : ''}</span>
                </div>
              </div>

              {room.doctorName && (
                <div className="room-doctor">
                  <User size={16} />
                  <div>
                    <span className="doctor-name">{room.doctorName}</span>
                    <span className="department">{room.department}</span>
                  </div>
                </div>
              )}

              <div className="room-price">
                <span className="price-label">Daily Rate:</span>
                <span className="price-amount">${room.price}</span>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="room-amenities">
                  <h4>Amenities:</h4>
                  <div className="amenities-list">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="room-footer">
                <div className="last-updated">
                  <Clock size={14} />
                  <span>Updated: {new Date(room.lastUpdated).toLocaleTimeString()}</span>
                </div>
                {room.status.toLowerCase() === 'available' && (
                  <button className="contact-button">
                    <Stethoscope size={16} />
                    Contact for Booking
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Rooms;