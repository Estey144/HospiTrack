import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import { Home, Activity, Settings, Shield, Database, Bell, Building, Car, Stethoscope, Bed } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiCall } from './utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [testReports, setTestReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [reportsData, setReportsData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    activeUsers: 0,
    serverLoad: '12%'
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const goToHomepage = () => {
    navigate("/");
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSidebarOpen(false); // Close sidebar when switching tabs
  };

  const getEntityDisplayName = (entity) => {
    const entityNames = {
      'doctors': 'Doctors',
      'patients': 'Patients',
      'staff': 'Staff',
      'users': 'Users',
      'rooms': 'Rooms',
      'branches': 'Branches',
      'ambulances': 'Ambulances',
      'departments': 'Departments',
      'equipment': 'Equipment',
      'ambulance-requests': 'Ambulance Requests',
      'prescriptions': 'Prescriptions',
      'test-reports': 'Test Reports',
      'appointments': 'Appointments',
      'bills': 'Bills'
    };
    return entityNames[entity] || entity.charAt(0).toUpperCase() + entity.slice(1);
  };

  const getEntitySingular = (entity) => {
    const singularNames = {
      'doctors': 'doctor',
      'patients': 'patient',
      'staff': 'staff',
      'users': 'user',
      'rooms': 'room',
      'branches': 'branch',
      'ambulances': 'ambulance',
      'departments': 'department',
      'equipment': 'equipment',
      'ambulance-requests': 'ambulance-request',
      'prescriptions': 'prescription',
      'test-reports': 'test-report',
      'appointments': 'appointment',
      'bills': 'bill'
    };
    return singularNames[entity] || entity.slice(0, -1);
  };

  const getApiEntityName = (formType) => {
    const apiNames = {
      'doctor': 'doctors',
      'patient': 'patients',
      'staff': 'staff',
      'user': 'users',
      'room': 'rooms',
      'branch': 'branches',
      'ambulance': 'ambulances',
      'department': 'departments',
      'equipment': 'equipment',
      'ambulance-request': 'ambulance-requests',
      'prescription': 'prescriptions',
      'test-report': 'test-reports',
      'appointment': 'appointments',
      'bill': 'bills'
    };
    return apiNames[formType] || formType + 's';
  };

  const getSampleData = (entity) => {
    const sampleData = {
      doctors: [
        { id: 1, name: 'Dr. Sarah Johnson', user_id: 1, branch_id: 1, license_number: 'MD12345', experience_years: 15, available_hours: '9:00-17:00', active: true },
        { id: 2, name: 'Dr. Michael Chen', user_id: 2, branch_id: 1, license_number: 'MD12346', experience_years: 8, available_hours: '8:00-16:00', active: true },
        { id: 3, name: 'Dr. Emily Davis', user_id: 3, branch_id: 2, license_number: 'MD12347', experience_years: 12, available_hours: '10:00-18:00', active: true }
      ],
      patients: [
        { id: 1, name: 'John Smith', dob: '1985-05-15', gender: 'Male', blood_type: 'O+', address: '123 Oak St', emergency_contact: '+1-555-9001', active: true },
        { id: 2, name: 'Maria Garcia', dob: '1990-08-22', gender: 'Female', blood_type: 'A-', address: '456 Pine Ave', emergency_contact: '+1-555-9002', active: true },
        { id: 3, name: 'Robert Wilson', dob: '1975-12-10', gender: 'Male', blood_type: 'B+', address: '789 Elm St', emergency_contact: '+1-555-9003', active: true }
      ],
      staff: [
        { id: 1, name: 'Alice Cooper', user_id: 4, branch_id: 1, designation: 'Head Nurse', active: true },
        { id: 2, name: 'Bob Thompson', user_id: 5, branch_id: 1, designation: 'Lab Technician', active: true },
        { id: 3, name: 'Carol White', user_id: 6, branch_id: 2, designation: 'Pharmacist', active: true }
      ],
      users: [
        { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hospital.com', phone: '+1-555-0101', role: 'DOCTOR', active: true },
        { id: 2, name: 'Dr. Michael Chen', email: 'michael.chen@hospital.com', phone: '+1-555-0102', role: 'DOCTOR', active: true },
        { id: 3, name: 'Dr. Emily Davis', email: 'emily.davis@hospital.com', phone: '+1-555-0103', role: 'DOCTOR', active: true },
        { id: 4, name: 'Alice Cooper', email: 'alice.cooper@hospital.com', phone: '+1-555-0104', role: 'STAFF', active: true },
        { id: 5, name: 'Bob Thompson', email: 'bob.thompson@hospital.com', phone: '+1-555-0105', role: 'STAFF', active: true },
        { id: 6, name: 'Carol White', email: 'carol.white@hospital.com', phone: '+1-555-0106', role: 'STAFF', active: true }
      ],
      rooms: [
        { id: 1, room_number: 'ICU-101', room_type: 'ICU', floor: 1, capacity: 2, branch_id: 1, active: true },
        { id: 2, room_number: 'GW-201', room_type: 'General', floor: 2, capacity: 4, branch_id: 1, active: true },
        { id: 3, room_number: 'ER-001', room_type: 'Emergency', floor: 1, capacity: 1, branch_id: 1, active: true }
      ],
      branches: [
        { id: 1, name: 'Main Hospital', location: 'Downtown', address: '123 Main St, City, State', phone: '+1-555-0100', email: 'main@hospital.com', active: true },
        { id: 2, name: 'North Branch', location: 'North District', address: '456 North Ave, City, State', phone: '+1-555-0200', email: 'north@hospital.com', active: true }
      ],
      ambulances: [
        { id: 1, vehicle_number: 'AMB-001', driver_name: 'John Smith', driver_phone: '+1-555-1001', status: 'Available', branch_id: 1, active: true },
        { id: 2, vehicle_number: 'AMB-002', driver_name: 'Jane Doe', driver_phone: '+1-555-1002', status: 'In Use', branch_id: 1, active: true }
      ],
      departments: [
        { id: 1, name: 'Cardiology', head_doctor: 'Dr. Smith', description: 'Heart and cardiovascular care', branch_id: 1, active: true },
        { id: 2, name: 'Emergency Medicine', head_doctor: 'Dr. Johnson', description: 'Emergency and trauma care', branch_id: 1, active: true }
      ],
      equipment: [
        { id: 1, equipment_name: 'MRI Scanner', equipment_type: 'Imaging', manufacturer: 'Siemens', model: 'Magnetom', condition: 'Good', purchase_date: '2020-01-15', department_id: 1, active: true },
        { id: 2, equipment_name: 'Ventilator', equipment_type: 'Life Support', manufacturer: 'Medtronic', model: 'PB980', condition: 'Excellent', purchase_date: '2021-03-10', department_id: 2, active: true }
      ],
      'ambulance-requests': [
        { id: 1, patient_name: 'John Emergency', pickup_location: '123 Main St', destination: 'Main Hospital', request_time: '2024-01-15 14:30', status: 'Pending', priority: 'High', contact_number: '+1-555-9999', active: true },
        { id: 2, patient_name: 'Jane Urgent', pickup_location: '456 Oak Ave', destination: 'North Branch', request_time: '2024-01-15 15:45', status: 'Dispatched', priority: 'Medium', contact_number: '+1-555-8888', active: true }
      ],
      prescriptions: [
        { id: 1, patient_name: 'John Smith', doctor_name: 'Dr. Sarah Johnson', medication: 'Amoxicillin 500mg', dosage: '3 times daily', duration: '7 days', date_prescribed: '2024-01-15', status: 'Active', active: true },
        { id: 2, patient_name: 'Maria Garcia', doctor_name: 'Dr. Michael Chen', medication: 'Lisinopril 10mg', dosage: 'Once daily', duration: '30 days', date_prescribed: '2024-01-14', status: 'Active', active: true }
      ],
      'test-reports': [
        { id: 1, patient_name: 'John Smith', test_type: 'Blood Test', report_date: '2024-01-15', result: 'Normal', doctor_name: 'Dr. Sarah Johnson', lab_technician: 'Bob Thompson', status: 'Completed', active: true },
        { id: 2, patient_name: 'Maria Garcia', test_type: 'X-Ray Chest', report_date: '2024-01-14', result: 'Clear', doctor_name: 'Dr. Michael Chen', lab_technician: 'Bob Thompson', status: 'Completed', active: true }
      ],
      appointments: [
        { id: 1, patient_name: 'John Smith', doctor_name: 'Dr. Sarah Johnson', appointment_date: '2024-01-20', appointment_time: '10:00 AM', department: 'Cardiology', status: 'Scheduled', notes: 'Follow-up consultation', active: true },
        { id: 2, patient_name: 'Maria Garcia', doctor_name: 'Dr. Michael Chen', appointment_date: '2024-01-21', appointment_time: '2:00 PM', department: 'Emergency Medicine', status: 'Confirmed', notes: 'Regular checkup', active: true }
      ],
      bills: [
        { id: 1, patient_name: 'John Smith', bill_date: '2024-01-15', total_amount: 1250.00, paid_amount: 1250.00, balance: 0.00, status: 'Paid', payment_method: 'Insurance', active: true },
        { id: 2, patient_name: 'Maria Garcia', bill_date: '2024-01-14', total_amount: 850.00, paid_amount: 400.00, balance: 450.00, status: 'Partial', payment_method: 'Cash', active: true }
      ]
    };
    return sampleData[entity] || [];
  };

  const API_BASE = 'http://localhost:8080';

  // Helper function to get the correct API endpoint for each entity
  const getApiEndpoint = (entity) => {
    const endpoints = {
      'doctors': '/api/doctors',
      'patients': '/patients/with-names',
      'staff': '/api/staff',
      'users': '/api/users',
      'rooms': '/api/rooms',
      'branches': '/api/branches',
      'ambulances': '/api/ambulances',
      'departments': '/api/departments',
      'equipment': '/api/equipment',
      'ambulance-requests': '/api/ambulance-requests',
      'prescriptions': '/api/prescriptions',
      'test-reports': '/api/lab-tests',
      'appointments': '/api/appointments',
      'bills': '/api/bills'
    };
    return endpoints[entity] || `/api/${entity}`;
  };

  // Helper function to get CRUD endpoints (different from fetch endpoints for some entities)
  const getCrudEndpoint = (entity) => {
    const endpoints = {
      'doctors': '/api/doctors',
      'patients': '/patients', // CRUD operations use the base patients endpoint
      'staff': '/api/staff',
      'users': '/api/users',
      'rooms': '/api/rooms',
      'branches': '/api/branches',
      'ambulances': '/api/ambulances',
      'departments': '/api/departments',
      'equipment': '/api/equipment',
      'ambulance-requests': '/api/ambulance-requests',
      'prescriptions': '/api/prescriptions',
      'test-reports': '/api/lab-tests',
      'appointments': '/api/appointments',
      'bills': '/api/bills'
    };
    return endpoints[entity] || `/api/${entity}`;
  };

  // Helper function to fetch users data for patient names
  const fetchUsersData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    return [];
  };

  // Data transformation functions to normalize backend data
  const transformDoctorData = (backendData) => {
    return backendData.map(item => ({
      id: item.DOCTORID || item.id,
      name: item.DOCTORNAME || item.name,
      experience_years: item.EXPERIENCEYEARS || item.experience_years,
      license_number: item.LICENSENUMBER || item.license_number,
      available_hours: item.AVAILABLEHOURS || item.available_hours,
      department: item.DEPARTMENTNAME || item.department,
      branch: item.BRANCHNAME || item.branch,
      image_url: item.IMAGEURL || item.image_url,
      active: item.active !== false
    }));
  };

  const transformPatientData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      name: item.name || 'Unknown Patient',
      user_id: item.userId,
      dob: item.dob,
      gender: item.gender,
      blood_type: item.bloodType || item.blood_type,
      address: item.address,
      phone: item.phone || 'N/A',
      emergency_contact: item.emergencyContact || item.emergency_contact,
      active: item.active !== false
    }));
  };

  const transformUserData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      name: item.name || 'Unknown User',
      email: item.email || 'N/A',
      phone: item.phone || 'N/A',
      role: item.role || 'USER',
      created_at: item.createdAt || item.created_at,
      active: item.active !== false
    }));
  };

  const transformAppointmentData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      patient_id: item.patientId,
      doctor_id: item.doctorId,
      appointment_date: item.appointmentDate,
      time_slot: item.timeSlot,
      type: item.type,
      status: item.status,
      patient_name: item.patientName || `Patient ${item.patientId}`,
      doctor_name: item.doctorName || `Doctor ${item.doctorId}`,
      active: item.active !== false
    }));
  };

  const transformPrescriptionData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      appointment_id: item.appointmentId,
      doctor_id: item.doctorId,
      patient_id: item.patientId,
      notes: item.notes,
      date_issued: item.dateIssued,
      medications: item.medications,
      patient_name: item.patientName || `Patient ${item.patientId}`,
      doctor_name: item.doctorName || `Doctor ${item.doctorId}`,
      active: item.active !== false
    }));
  };

  const transformBillData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      patient_id: item.patientId,
      appointment_id: item.appointmentId,
      total_amount: item.totalAmount,
      status: item.status,
      issue_date: item.issueDate,
      items: item.items,
      doctor_name: item.doctorName || `Doctor ${item.doctorId}`,
      patient_name: item.patientName || `Patient ${item.patientId}`,
      appointment_type: item.appointmentType,
      department: item.department,
      visit_date: item.visitDate,
      active: item.active !== false
    }));
  };

  const transformRoomData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      room_number: item.roomNumber,
      room_type: item.type,
      status: item.status,
      active: item.active !== false
    }));
  };

  const transformTestReportData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      test_type: item.testType,
      result: item.result,
      file_url: item.fileUrl,
      test_date: item.testDate,
      doctor_name: item.doctorName || 'N/A',
      patient_name: item.patientName || 'N/A',
      active: item.active !== false
    }));
  };

  const transformAmbulanceRequestData = (backendData) => {
    return backendData.map(item => ({
      id: item.ID || item.id,
      name: item.PATIENT_NAME || item.patientName || 'N/A', // Show patient name in the name column
      patient_name: item.PATIENT_NAME || item.patientName || 'N/A',
      pickup_location: item.PICKUP_LOCATION || item.pickupLocation,
      drop_location: item.DROP_LOCATION || item.dropLocation,
      request_time: item.REQUEST_TIME || item.requestTime,
      vehicle_number: item.VEHICLE_NUMBER || item.vehicleNumber || 'N/A',
      priority: item.PRIORITY || item.priority || 'Medium',
      status: item.STATUS || item.status || 'Pending',
      active: item.active !== false
    }));
  };

  const transformAmbulanceData = (backendData) => {
    return backendData.map(item => ({
      id: item.id,
      name: item.vehicleNumber || 'N/A', // Show vehicle number in the name column
      vehicle_number: item.vehicleNumber,
      status: item.status || 'Available',
      location: item.location,
      branch_id: item.branchId,
      active: item.active !== false
    }));
  };

  const fetchData = async (entity) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = getApiEndpoint(entity);
      const data = await apiCall(endpoint);
      
      if (!data) {
        console.warn(`API call failed for ${entity}, using sample data`);
        const sampleData = getSampleData(entity);
        switch (entity) {
          case 'doctors': setDoctors(sampleData); break;
          case 'patients': setPatients(sampleData); break;
          case 'staff': setStaff(sampleData); break;
          case 'users': setUsers(sampleData); break;
          case 'rooms': setRooms(sampleData); break;
          case 'branches': setBranches(sampleData); break;
          case 'ambulances': setAmbulances(sampleData); break;
          case 'departments': setDepartments(sampleData); break;
          case 'equipment': setEquipment(sampleData); break;
          case 'ambulance-requests': setAmbulanceRequests(sampleData); break;
          case 'prescriptions': setPrescriptions(sampleData); break;
          case 'test-reports': setTestReports(sampleData); break;
          case 'appointments': setAppointments(sampleData); break;
          case 'bills': setBills(sampleData); break;
          default: break;
        }
      } else {
        console.log(`Fetched ${entity} data:`, data);
        
        // Transform and set data based on entity type
        switch (entity) {
          case 'doctors': 
            setDoctors(transformDoctorData(data)); 
            break;
          case 'patients': 
            // First check if patients endpoint exists, otherwise use sample data
            if (Array.isArray(data)) {
              setPatients(transformPatientData(data));
            } else {
              setPatients(getSampleData('patients'));
            }
            break;
          case 'staff': setStaff(Array.isArray(data) ? data : getSampleData('staff')); break;
          case 'users': 
            if (Array.isArray(data)) {
              setUsers(transformUserData(data));
            } else {
              setUsers(getSampleData('users'));
            }
            break;
          case 'rooms': 
            if (Array.isArray(data)) {
              setRooms(transformRoomData(data));
            } else {
              setRooms(getSampleData('rooms'));
            }
            break;
          case 'branches': setBranches(Array.isArray(data) ? data : getSampleData('branches')); break;
          case 'ambulances': 
            if (Array.isArray(data)) {
              setAmbulances(transformAmbulanceData(data));
            } else {
              setAmbulances(getSampleData('ambulances'));
            }
            break;
          case 'departments': setDepartments(Array.isArray(data) ? data : getSampleData('departments')); break;
          case 'equipment': setEquipment(Array.isArray(data) ? data : getSampleData('equipment')); break;
          case 'ambulance-requests': 
            if (Array.isArray(data)) {
              setAmbulanceRequests(transformAmbulanceRequestData(data));
            } else {
              setAmbulanceRequests(getSampleData('ambulance-requests'));
            }
            break;
          case 'prescriptions': 
            if (Array.isArray(data)) {
              setPrescriptions(transformPrescriptionData(data));
            } else {
              setPrescriptions(getSampleData('prescriptions'));
            }
            break;
          case 'test-reports': 
            if (Array.isArray(data)) {
              setTestReports(transformTestReportData(data));
            } else {
              setTestReports(getSampleData('test-reports'));
            }
            break;
          case 'appointments': 
            if (Array.isArray(data)) {
              setAppointments(transformAppointmentData(data));
            } else {
              setAppointments(getSampleData('appointments'));
            }
            break;
          case 'bills': 
            if (Array.isArray(data)) {
              setBills(transformBillData(data));
            } else {
              setBills(getSampleData('bills'));
            }
            break;
          default: break;
        }
      }
    } catch (err) {
      console.error(`Error fetching ${entity}:`, err);
      // If network error, provide sample data
      const sampleData = getSampleData(entity);
      switch (entity) {
        case 'doctors': setDoctors(sampleData); break;
        case 'patients': setPatients(sampleData); break;
        case 'staff': setStaff(sampleData); break;
        case 'users': setUsers(sampleData); break;
        case 'rooms': setRooms(sampleData); break;
        case 'branches': setBranches(sampleData); break;
        case 'ambulances': setAmbulances(sampleData); break;
        case 'departments': setDepartments(sampleData); break;
        case 'equipment': setEquipment(sampleData); break;
        case 'ambulance-requests': setAmbulanceRequests(sampleData); break;
        case 'prescriptions': setPrescriptions(sampleData); break;
        case 'test-reports': setTestReports(sampleData); break;
        case 'appointments': setAppointments(sampleData); break;
        case 'bills': setBills(sampleData); break;
        default: break;
      }
    }
    setLoading(false);
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReportsData(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchSystemHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate system health data - replace with actual API call
      const healthData = {
        status: 'healthy',
        uptime: '99.9%',
        activeUsers: Math.floor(Math.random() * 100) + 50,
        serverLoad: Math.floor(Math.random() * 30) + 10 + '%',
        dbConnections: Math.floor(Math.random() * 20) + 5,
        memoryUsage: Math.floor(Math.random() * 40) + 30 + '%'
      };
      setSystemHealth(healthData);
      
      // Simulate notifications
      const sampleNotifications = [
        {
          id: 1,
          type: 'info',
          message: 'System backup completed successfully',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'warning',
          message: 'High server load detected',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        }
      ];
      setNotifications(sampleNotifications);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching audit logs from:', `${API_BASE}/api/audit-logs`);
      const res = await fetch(`${API_BASE}/api/audit-logs`);
      console.log('Audit logs response status:', res.status);
      if (!res.ok) {
        console.warn('API call failed for audit logs, using sample data');
        // Fallback to sample data if API fails
        const logs = [
          {
            id: 1,
            action: 'User Created',
            user: 'Admin',
            details: 'Created new doctor account',
            timestamp: new Date().toISOString(),
            severity: 'info'
          },
          {
            id: 2,
            action: 'Data Export',
            user: 'Admin',
            details: 'Exported patient data',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            severity: 'warning'
          },
          {
            id: 3,
            action: 'System Backup',
            user: 'System',
            details: 'Automated backup completed',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            severity: 'success'
          }
        ];
        setAuditLogs(logs);
      } else {
        const data = await res.json();
        console.log('Audit logs data received:', data);
        setAuditLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setSearchTerm('');
    setPage(1);
    if (activeTab === 'reports') {
      fetchReports();
    } else if (activeTab === 'dashboard') {
      fetchSystemHealth();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    } else if (activeTab === 'settings' || activeTab === 'backup') {
      // These tabs don't need data fetching
    } else if (['doctors', 'patients', 'staff', 'users', 'rooms', 'branches', 'ambulances', 'departments', 'equipment'].includes(activeTab)) {
      fetchData(activeTab);
    }
  }, [activeTab]);

  // Initial data fetch for all entities when component mounts
  useEffect(() => {
    const fetchAllInitialData = async () => {
      try {
        await Promise.all([
          fetchData('doctors'),
          fetchData('patients'), 
          fetchData('staff'),
          fetchData('users'),
          fetchData('rooms'),
          fetchData('branches'),
          fetchData('ambulances'),
          fetchData('departments'),
          fetchData('equipment'),
          fetchData('ambulance-requests'),
          fetchData('prescriptions'),
          fetchData('test-reports'),
          fetchData('appointments'),
          fetchData('bills')
        ]);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      }
    };
    
    fetchAllInitialData();
    fetchSystemHealth(); // Load dashboard data by default
  }, []);

  const filterData = (list) => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(term)
      )
    );
  };

  const sortData = (list) => {
    return [...list].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  };

  const paginatedData = (list) => {
    const filtered = filterData(list);
    const sorted = sortData(filtered);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paged = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    return { paged, totalPages, total: sorted.length };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const openForm = (type, mode = 'create', data = {}) => {
    setFormType(type);
    setFormMode(mode);
    setFormData(data);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const entity = getApiEntityName(formType);
    const baseEndpoint = getCrudEndpoint(entity);
    const endpoint = `${baseEndpoint}${formMode === 'edit' ? `/${formData.id}` : ''}`;
    const method = formMode === 'edit' ? 'PUT' : 'POST';

    console.log(`Attempting to ${method} ${entity} at endpoint: ${endpoint}`, formData);

    try {
      const data = await apiCall(endpoint, {
        method,
        body: JSON.stringify(formData),
      });
      
      console.log(`Successfully ${formMode === 'edit' ? 'updated' : 'created'} ${entity}`);
      await fetchData(entity);
      closeForm();
      setError(`${getEntityDisplayName(entity).slice(0, -1)} ${formMode === 'edit' ? 'updated' : 'created'} successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    try {
      const entity = getApiEntityName(type);
      const baseEndpoint = getCrudEndpoint(entity);
      const endpoint = `${baseEndpoint}/${id}`;
      console.log(`Attempting to delete ${entity} with ID ${id} at endpoint: ${endpoint}`);
      
      await apiCall(endpoint, { method: 'DELETE' });
      
      console.log(`Successfully deleted ${entity} with ID ${id}`);
      await fetchData(entity);
      setError(`${getEntityDisplayName(entity).slice(0, -1)} deleted successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const statusClass = status ? 'adm-badge--success' : 'adm-badge--danger';
    return <span className={`adm-badge ${statusClass}`}>{status ? 'Active' : 'Inactive'}</span>;
  };

  const renderRows = (list, type) => {
    return list.map(item => (
      <tr key={item.id} className="adm-table__row">
        <td className="adm-table__cell">{item.id}</td>
        {type !== 'test-reports' && (
          <td className="adm-table__cell adm-table__cell--primary">
            {item.name || item.email || item.designation || item.room_number || item.vehicle_number || item.equipment_name || item.patient_name || item.notes || item.medication || 'N/A'}
          </td>
        )}
        {type === 'test-reports' && (
          <td className="adm-table__cell adm-table__cell--primary">
            {item.test_type || 'N/A'}
          </td>
        )}
        {type === 'users' && <td className="adm-table__cell">{item.role}</td>}
        {type === 'doctors' && (
          <>
            <td className="adm-table__cell">{item.department || 'N/A'}</td>
            <td className="adm-table__cell">{item.experience_years || 0} years</td>
            <td className="adm-table__cell">{item.available_hours || 'N/A'}</td>
          </>
        )}
        {type === 'patients' && <td className="adm-table__cell">{item.blood_type || 'N/A'}</td>}
        {type === 'rooms' && <td className="adm-table__cell">{item.room_type || 'N/A'}</td>}
        {type === 'branches' && <td className="adm-table__cell">{item.address || 'N/A'}</td>}
        {type === 'ambulances' && <td className="adm-table__cell">{item.status || 'Available'}</td>}
        {type === 'departments' && <td className="adm-table__cell">{item.head_doctor || 'N/A'}</td>}
        {type === 'equipment' && <td className="adm-table__cell">{item.condition || 'Good'}</td>}
        {type === 'ambulance-requests' && <td className="adm-table__cell">{item.priority || 'Medium'}</td>}
        {type === 'prescriptions' && <td className="adm-table__cell">{item.doctor_name || 'N/A'}</td>}
        {type === 'test-reports' && <td className="adm-table__cell">{item.patient_name || 'N/A'}</td>}
        {type === 'test-reports' && <td className="adm-table__cell">{item.doctor_name || 'N/A'}</td>}
        {type === 'test-reports' && <td className="adm-table__cell">{item.result || 'Pending'}</td>}
        {type === 'appointments' && <td className="adm-table__cell">{item.doctor_name || 'N/A'}</td>}
        {type === 'bills' && <td className="adm-table__cell">{item.patient_name || 'N/A'}</td>}
        {type === 'bills' && <td className="adm-table__cell">{item.doctor_name || 'N/A'}</td>}
        {type === 'bills' && <td className="adm-table__cell">₹{item.total_amount || 0}</td>}
        <td className="adm-table__cell">
          {getStatusBadge(item.active !== false)}
        </td>
        <td className="adm-table__cell adm-table__cell--actions">
          <button 
            className="adm-btn adm-btn--small adm-btn--secondary" 
            onClick={() => openForm(getEntitySingular(type), 'edit', item)}
          >
            Edit
          </button>
          <button 
            className="adm-btn adm-btn--small adm-btn--danger" 
            onClick={() => handleDelete(getEntitySingular(type), item.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const reportChartData = {
    labels: reportsData?.months || [],
    datasets: [
      {
        label: 'Patients Registered',
        data: reportsData?.patients || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Appointments',
        data: reportsData?.appointments || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const reportOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: { 
        display: true, 
        text: 'Monthly Hospital Analytics',
        font: { size: 18, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getEntityStats = () => {
    return {
      doctors: doctors.length,
      patients: patients.length,
      staff: staff.length,
      users: users.length,
      rooms: rooms.length,
      branches: branches.length,
      ambulances: ambulances.length,
      departments: departments.length,
    };
  };

  const stats = getEntityStats();

  let currentData = [];
  let totalPages = 1;
  let totalItems = 0;
  
  if (['doctors', 'patients', 'staff', 'users', 'rooms', 'branches', 'ambulances', 'departments', 'equipment', 'ambulance-requests', 'prescriptions', 'test-reports', 'appointments', 'bills'].includes(activeTab)) {
    switch (activeTab) {
      case 'doctors': ({paged: currentData, totalPages, total: totalItems} = paginatedData(doctors)); break;
      case 'patients': ({paged: currentData, totalPages, total: totalItems} = paginatedData(patients)); break;
      case 'staff': ({paged: currentData, totalPages, total: totalItems} = paginatedData(staff)); break;
      case 'users': ({paged: currentData, totalPages, total: totalItems} = paginatedData(users)); break;
      case 'rooms': ({paged: currentData, totalPages, total: totalItems} = paginatedData(rooms)); break;
      case 'branches': ({paged: currentData, totalPages, total: totalItems} = paginatedData(branches)); break;
      case 'ambulances': ({paged: currentData, totalPages, total: totalItems} = paginatedData(ambulances)); break;
      case 'departments': ({paged: currentData, totalPages, total: totalItems} = paginatedData(departments)); break;
      case 'equipment': ({paged: currentData, totalPages, total: totalItems} = paginatedData(equipment)); break;
      case 'ambulance-requests': ({paged: currentData, totalPages, total: totalItems} = paginatedData(ambulanceRequests)); break;
      case 'prescriptions': ({paged: currentData, totalPages, total: totalItems} = paginatedData(prescriptions)); break;
      case 'test-reports': ({paged: currentData, totalPages, total: totalItems} = paginatedData(testReports)); break;
      case 'appointments': ({paged: currentData, totalPages, total: totalItems} = paginatedData(appointments)); break;
      case 'bills': ({paged: currentData, totalPages, total: totalItems} = paginatedData(bills)); break;
      default: break;
    }
  }

  return (
    <div className="adm-dashboard">
      <div className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar--open' : ''}`}>
        <div className="adm-sidebar__header">
          <h2 className="adm-sidebar__title">Admin Panel</h2>
          <button 
            className="adm-sidebar__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
        
        <div className="adm-sidebar__stats">
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.doctors}</div>
            <div className="adm-stat-card__label">Doctors</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.patients}</div>
            <div className="adm-stat-card__label">Patients</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.rooms}</div>
            <div className="adm-stat-card__label">Rooms</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.branches}</div>
            <div className="adm-stat-card__label">Branches</div>
          </div>
        </div>

        <nav className="adm-sidebar__nav">
          <button 
            className={`adm-nav-btn ${activeTab === 'dashboard' ? 'adm-nav-btn--active' : ''}`} 
            onClick={() => handleTabChange('dashboard')}
          >
            <Activity size={18} style={{ marginRight: '8px' }} />
            System Overview
          </button>
          
          <div className="adm-nav-section">
            <div className="adm-nav-section-title">👥 People Management</div>
            <button 
              className={`adm-nav-btn ${activeTab === 'doctors' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('doctors')}
            >
              <Stethoscope size={18} style={{ marginRight: '8px' }} />
              Manage Doctors
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'patients' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('patients')}
            >
              👥 Manage Patients
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'staff' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('staff')}
            >
              👨‍💼 Manage Staff
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'users' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('users')}
            >
              👤 Manage Users
            </button>
          </div>

          <div className="adm-nav-section">
            <div className="adm-nav-section-title">📋 Patient Management</div>
            <button 
              className={`adm-nav-btn ${activeTab === 'prescriptions' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('prescriptions')}
            >
              💊 Manage Prescriptions
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'test-reports' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('test-reports')}
            >
              🧪 Test Reports
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'appointments' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('appointments')}
            >
              📅 Manage Appointments
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'bills' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('bills')}
            >
              💰 Manage Bills
            </button>
          </div>

          <div className="adm-nav-section">
            <div className="adm-nav-section-title">🏥 Facility Management</div>
            <button 
              className={`adm-nav-btn ${activeTab === 'branches' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('branches')}
            >
              <Building size={18} style={{ marginRight: '8px' }} />
              Hospital Branches
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'departments' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('departments')}
            >
              🏢 Departments
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'rooms' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('rooms')}
            >
              <Bed size={18} style={{ marginRight: '8px' }} />
              Room Management
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'equipment' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('equipment')}
            >
              ⚕️ Medical Equipment
            </button>
          </div>

          <div className="adm-nav-section">
            <div className="adm-nav-section-title">🚑 Emergency Services</div>
            <button 
              className={`adm-nav-btn ${activeTab === 'ambulances' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('ambulances')}
            >
              <Car size={18} style={{ marginRight: '8px' }} />
              Ambulance Fleet
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'ambulance-requests' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('ambulance-requests')}
            >
              🚨 Ambulance Requests
            </button>
          </div>

          <div className="adm-nav-section">
            <div className="adm-nav-section-title">📊 Reports & Settings</div>
            <button 
              className={`adm-nav-btn ${activeTab === 'reports' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('reports')}
            >
              📊 View Reports
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'audit' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('audit')}
            >
              <Shield size={18} style={{ marginRight: '8px' }} />
              Audit Logs
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'settings' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('settings')}
            >
              <Settings size={18} style={{ marginRight: '8px' }} />
              System Settings
            </button>
            <button 
              className={`adm-nav-btn ${activeTab === 'backup' ? 'adm-nav-btn--active' : ''}`} 
              onClick={() => handleTabChange('backup')}
            >
              <Database size={18} style={{ marginRight: '8px' }} />
              Backup & Restore
            </button>
          </div>
        </nav>
      </div>

      <div className="adm-main">
        <header className="adm-header">
          <button 
            className="adm-mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="adm-header__title">
            <h1>Hospital Management System</h1>
            <p>Welcome back, <strong>{user?.name}</strong> ({user?.email})</p>
          </div>
          <div className="adm-header__actions">
            <button 
              className="adm-home-button"
              onClick={goToHomepage}
            >
              <Home size={16} style={{ marginRight: '5px' }} />
              Go to Homepage
            </button>
            <div className="adm-header__user">
              <div className="adm-user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="adm-content">
          {loading && (
            <div className="adm-loading">
              <div className="adm-loading__spinner"></div>
              <p>Loading...</p>
            </div>
          )}
          
          {error && (
            <div className="adm-alert adm-alert--error">
              <span>⚠️ Error: {error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {['doctors', 'patients', 'staff', 'users', 'rooms', 'branches', 'ambulances', 'departments', 'equipment', 'ambulance-requests', 'prescriptions', 'test-reports', 'appointments', 'bills'].includes(activeTab) && !loading && (
            <div className="adm-data-section">
              <div className="adm-data-header">
                <h2 className="adm-data-title">
                  {getEntityDisplayName(activeTab)} Management
                </h2>
                <div className="adm-data-actions">
                  <div className="adm-search-box">
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                      className="adm-search-input"
                    />
                  </div>
                  <button 
                    className="adm-btn adm-btn--primary" 
                    onClick={() => openForm(getEntitySingular(activeTab), 'create')}
                  >
                    + Add New {getEntityDisplayName(activeTab).slice(0, -1)}
                  </button>
                </div>
              </div>

              <div className="adm-table-container">
                <table className="adm-table">
                  <thead className="adm-table__head">
                    <tr>
                      <th className="adm-table__header" onClick={() => handleSort('id')}>
                        ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      {activeTab !== 'test-reports' && (
                        <th className="adm-table__header" onClick={() => handleSort('name')}>
                          Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                      )}
                      {activeTab === 'test-reports' && <th className="adm-table__header">Test Type</th>}
                      {activeTab === 'users' && <th className="adm-table__header">Role</th>}
                      {activeTab === 'doctors' && (
                        <>
                          <th className="adm-table__header">Department</th>
                          <th className="adm-table__header">Experience</th>
                          <th className="adm-table__header">Available Hours</th>
                        </>
                      )}
                      {activeTab === 'patients' && <th className="adm-table__header">Blood Type</th>}
                      {activeTab === 'rooms' && <th className="adm-table__header">Room Type</th>}
                      {activeTab === 'branches' && <th className="adm-table__header">Address</th>}
                      {activeTab === 'ambulances' && <th className="adm-table__header">Status</th>}
                      {activeTab === 'departments' && <th className="adm-table__header">Head Doctor</th>}
                      {activeTab === 'equipment' && <th className="adm-table__header">Condition</th>}
                      {activeTab === 'ambulance-requests' && <th className="adm-table__header">Priority</th>}
                      {activeTab === 'prescriptions' && <th className="adm-table__header">Doctor</th>}
                      {activeTab === 'test-reports' && <th className="adm-table__header">Patient</th>}
                      {activeTab === 'test-reports' && <th className="adm-table__header">Doctor</th>}
                      {activeTab === 'test-reports' && <th className="adm-table__header">Result</th>}
                      {activeTab === 'appointments' && <th className="adm-table__header">Doctor</th>}
                      {activeTab === 'bills' && <th className="adm-table__header">Patient</th>}
                      {activeTab === 'bills' && <th className="adm-table__header">Doctor</th>}
                      {activeTab === 'bills' && <th className="adm-table__header">Amount</th>}
                      <th className="adm-table__header">Status</th>
                      <th className="adm-table__header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="adm-table__body">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="adm-table__empty">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      renderRows(currentData, activeTab)
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adm-pagination">
                <div className="adm-pagination__info">
                  Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, totalItems)} of {totalItems} entries
                </div>
                <div className="adm-pagination__controls">
                  <button 
                    className="adm-btn adm-btn--outline" 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="adm-pagination__current">
                    Page {page} of {totalPages}
                  </span>
                  <button 
                    className="adm-btn adm-btn--outline" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && reportsData && (
            <div className="adm-reports">
              <div className="adm-reports__header">
                <h2>Analytics Dashboard</h2>
                <p>Monthly performance overview</p>
              </div>
              <div className="adm-chart-container">
                <Bar data={reportChartData} options={reportOptions} />
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="adm-system-overview">
              <div className="adm-data-section">
                <div className="adm-data-header">
                  <h2 className="adm-data-title">System Health Overview</h2>
                </div>
                <div className="adm-health-grid">
                  <div className="adm-health-card">
                    <div className="adm-health-card__icon">🟢</div>
                    <div className="adm-health-card__content">
                      <h3>System Status</h3>
                      <p className="adm-health-card__value">{systemHealth.status}</p>
                    </div>
                  </div>
                  <div className="adm-health-card">
                    <div className="adm-health-card__icon">⏱️</div>
                    <div className="adm-health-card__content">
                      <h3>Uptime</h3>
                      <p className="adm-health-card__value">{systemHealth.uptime}</p>
                    </div>
                  </div>
                  <div className="adm-health-card">
                    <div className="adm-health-card__icon">👥</div>
                    <div className="adm-health-card__content">
                      <h3>Active Users</h3>
                      <p className="adm-health-card__value">{systemHealth.activeUsers}</p>
                    </div>
                  </div>
                  <div className="adm-health-card">
                    <div className="adm-health-card__icon">⚡</div>
                    <div className="adm-health-card__content">
                      <h3>Server Load</h3>
                      <p className="adm-health-card__value">{systemHealth.serverLoad}</p>
                    </div>
                  </div>
                  <div className="adm-health-card">
                    <div className="adm-health-card__icon">🔗</div>
                    <div className="adm-health-card__content">
                      <h3>DB Connections</h3>
                      <p className="adm-health-card__value">{systemHealth.dbConnections}</p>
                    </div>
                  </div>
                  <div className="adm-health-card">
                    <div className="adm-health-card__icon">💾</div>
                    <div className="adm-health-card__content">
                      <h3>Memory Usage</h3>
                      <p className="adm-health-card__value">{systemHealth.memoryUsage}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {notifications.length > 0 && (
                <div className="adm-data-section">
                  <div className="adm-data-header">
                    <h2 className="adm-data-title">
                      <Bell size={20} style={{ marginRight: '8px' }} />
                      Recent Notifications
                    </h2>
                  </div>
                  <div className="adm-notifications-list">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`adm-notification adm-notification--${notification.type}`}>
                        <div className="adm-notification__content">
                          <p>{notification.message}</p>
                          <small>{new Date(notification.timestamp).toLocaleString()}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="adm-data-section">
              <div className="adm-data-header">
                <h2 className="adm-data-title">Audit Logs</h2>
                <div className="adm-data-actions">
                  <button className="adm-btn adm-btn--primary">
                    Export Logs
                  </button>
                </div>
              </div>
              <div className="adm-table-container">
                <table className="adm-table">
                  <thead className="adm-table__head">
                    <tr>
                      <th className="adm-table__header">Action</th>
                      <th className="adm-table__header">User</th>
                      <th className="adm-table__header">Details</th>
                      <th className="adm-table__header">IP Address</th>
                      <th className="adm-table__header">Timestamp</th>
                      <th className="adm-table__header">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="adm-table__body">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="adm-table__row">
                        <td className="adm-table__cell adm-table__cell--primary">{log.action}</td>
                        <td className="adm-table__cell">{log.user}</td>
                        <td className="adm-table__cell">{log.details}</td>
                        <td className="adm-table__cell">{log.ipAddress || 'N/A'}</td>
                        <td className="adm-table__cell">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="adm-table__cell">
                          <span className={`adm-badge adm-badge--${
                            log.severity === 'error' ? 'danger' : 
                            log.severity === 'warning' ? 'danger' : 
                            log.severity === 'success' ? 'success' : 
                            'secondary'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="adm-data-section">
              <div className="adm-data-header">
                <h2 className="adm-data-title">System Settings</h2>
              </div>
              <div className="adm-settings-content">
                <div className="adm-settings-section">
                  <h3>Hospital Configuration</h3>
                  <div className="adm-form__group">
                    <label className="adm-form__label">Hospital Name</label>
                    <input className="adm-form__input" type="text" defaultValue="HospiTrack Medical Center" />
                  </div>
                  <div className="adm-form__group">
                    <label className="adm-form__label">Contact Email</label>
                    <input className="adm-form__input" type="email" defaultValue="admin@hospitracker.com" />
                  </div>
                  <div className="adm-form__group">
                    <label className="adm-form__label">Emergency Contact</label>
                    <input className="adm-form__input" type="tel" defaultValue="+1-555-0123" />
                  </div>
                </div>
                <div className="adm-settings-section">
                  <h3>System Preferences</h3>
                  <div className="adm-form__group">
                    <label className="adm-form__label">Timezone</label>
                    <select className="adm-form__select">
                      <option>UTC-5 (Eastern)</option>
                      <option>UTC-6 (Central)</option>
                      <option>UTC-7 (Mountain)</option>
                      <option>UTC-8 (Pacific)</option>
                    </select>
                  </div>
                  <div className="adm-form__group">
                    <label className="adm-form__label">
                      <input type="checkbox" defaultChecked /> Enable Email Notifications
                    </label>
                  </div>
                  <div className="adm-form__group">
                    <label className="adm-form__label">
                      <input type="checkbox" defaultChecked /> Enable Audit Logging
                    </label>
                  </div>
                </div>
                <div className="adm-settings-actions">
                  <button className="adm-btn adm-btn--primary">Save Settings</button>
                  <button className="adm-btn adm-btn--secondary">Reset to Defaults</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="adm-data-section">
              <div className="adm-data-header">
                <h2 className="adm-data-title">Backup & Restore</h2>
              </div>
              <div className="adm-backup-content">
                <div className="adm-backup-section">
                  <h3>Database Backup</h3>
                  <p>Create a backup of all hospital data including patients, appointments, and medical records.</p>
                  <div className="adm-backup-actions">
                    <button className="adm-btn adm-btn--primary">Create Full Backup</button>
                    <button className="adm-btn adm-btn--secondary">Incremental Backup</button>
                  </div>
                </div>
                <div className="adm-backup-section">
                  <h3>Restore Data</h3>
                  <p>Restore system data from a previous backup. Use with caution.</p>
                  <div className="adm-backup-actions">
                    <input type="file" accept=".sql,.bak" className="adm-form__input" />
                    <button className="adm-btn adm-btn--danger">Restore from File</button>
                  </div>
                </div>
                <div className="adm-backup-section">
                  <h3>Scheduled Backups</h3>
                  <div className="adm-form__group">
                    <label className="adm-form__label">Backup Frequency</label>
                    <select className="adm-form__select">
                      <option>Daily at 2:00 AM</option>
                      <option>Weekly on Sunday</option>
                      <option>Monthly on 1st</option>
                    </select>
                  </div>
                  <div className="adm-form__group">
                    <label className="adm-form__label">
                      <input type="checkbox" defaultChecked /> Enable Automatic Backups
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {formOpen && (
        <div className="adm-modal">
          <div className="adm-modal__backdrop" onClick={closeForm}></div>
          <div className="adm-modal__content">
            <div className="adm-modal__header">
              <h3>
                {formMode === 'create' ? 'Add New' : 'Edit'} {formType.charAt(0).toUpperCase() + formType.slice(1)}
              </h3>
              <button className="adm-modal__close" onClick={closeForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="adm-form">
              <div className="adm-form__body">
                {(formType === 'doctor' || formType === 'staff' || formType === 'user' || formType === 'patient' || formType === 'room' || formType === 'branch' || formType === 'ambulance' || formType === 'department' || formType === 'equipment') && (
                  <>
                    <div className="adm-form__group">
                      <label className="adm-form__label">
                        {formType === 'room' ? 'Room Number' : 
                         formType === 'ambulance' ? 'Vehicle Number' :
                         formType === 'equipment' ? 'Equipment Name' : 'Name'}
                      </label>
                      <input
                        name={formType === 'room' ? 'room_number' : 
                              formType === 'ambulance' ? 'vehicle_number' :
                              formType === 'equipment' ? 'equipment_name' : 'name'}
                        type="text"
                        value={formData[formType === 'room' ? 'room_number' : 
                                      formType === 'ambulance' ? 'vehicle_number' :
                                      formType === 'equipment' ? 'equipment_name' : 'name'] || ''}
                        onChange={handleFormChange}
                        required
                        className="adm-form__input"
                      />
                    </div>

                    {formType === 'user' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Password</label>
                          <input
                            name="password"
                            type="password"
                            value={formData.password || ''}
                            onChange={handleFormChange}
                            required={formMode === 'create'}
                            placeholder={formMode === 'edit' ? 'Leave blank to keep unchanged' : ''}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Phone</label>
                          <input
                            name="phone"
                            type="text"
                            value={formData.phone || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Role</label>
                          <select
                            name="role"
                            value={formData.role || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Role</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="PATIENT">Patient</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </>
                    )}

                    {(formType === 'doctor' || formType === 'staff') && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">User ID</label>
                          <input
                            name="user_id"
                            type="text"
                            value={formData.user_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Branch ID</label>
                          <input
                            name="branch_id"
                            type="text"
                            value={formData.branch_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'doctor' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">License Number</label>
                          <input
                            name="license_number"
                            type="text"
                            value={formData.license_number || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Experience Years</label>
                          <input
                            name="experience_years"
                            type="number"
                            min="0"
                            value={formData.experience_years || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Available Hours</label>
                          <input
                            name="available_hours"
                            type="text"
                            value={formData.available_hours || ''}
                            onChange={handleFormChange}
                            placeholder="e.g. 9:00-17:00"
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'patient' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Date of Birth</label>
                          <input
                            name="dob"
                            type="date"
                            value={formData.dob || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Blood Type</label>
                          <input
                            name="blood_type"
                            type="text"
                            value={formData.blood_type || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Address</label>
                          <input
                            name="address"
                            type="text"
                            value={formData.address || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Emergency Contact</label>
                          <input
                            name="emergency_contact"
                            type="text"
                            value={formData.emergency_contact || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'room' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Room Type</label>
                          <select
                            name="room_type"
                            value={formData.room_type || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Room Type</option>
                            <option value="ICU">ICU</option>
                            <option value="Emergency">Emergency</option>
                            <option value="General">General Ward</option>
                            <option value="Surgery">Surgery</option>
                            <option value="Maternity">Maternity</option>
                            <option value="Pediatric">Pediatric</option>
                          </select>
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Floor</label>
                          <input
                            name="floor"
                            type="number"
                            min="1"
                            value={formData.floor || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Branch ID</label>
                          <input
                            name="branch_id"
                            type="text"
                            value={formData.branch_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Capacity</label>
                          <input
                            name="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'branch' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Address</label>
                          <textarea
                            name="address"
                            value={formData.address || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                            rows="3"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Phone</label>
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'ambulance' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Status</label>
                          <select
                            name="status"
                            value={formData.status || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Status</option>
                            <option value="Available">Available</option>
                            <option value="In Use">In Use</option>
                            <option value="Maintenance">Under Maintenance</option>
                            <option value="Out of Service">Out of Service</option>
                          </select>
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Branch ID</label>
                          <input
                            name="branch_id"
                            type="text"
                            value={formData.branch_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'department' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Head Doctor</label>
                          <input
                            name="head_doctor"
                            type="text"
                            value={formData.head_doctor || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Description</label>
                          <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                            rows="3"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Branch ID</label>
                          <input
                            name="branch_id"
                            type="text"
                            value={formData.branch_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'equipment' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Equipment Type</label>
                          <select
                            name="equipment_type"
                            value={formData.equipment_type || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Equipment Type</option>
                            <option value="Diagnostic">Diagnostic</option>
                            <option value="Surgical">Surgical</option>
                            <option value="Monitoring">Monitoring</option>
                            <option value="Life Support">Life Support</option>
                            <option value="Laboratory">Laboratory</option>
                            <option value="Imaging">Imaging</option>
                          </select>
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Manufacturer</label>
                          <input
                            name="manufacturer"
                            type="text"
                            value={formData.manufacturer || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Model</label>
                          <input
                            name="model"
                            type="text"
                            value={formData.model || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Condition</label>
                          <select
                            name="condition"
                            value={formData.condition || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Condition</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="Out of Order">Out of Order</option>
                          </select>
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Purchase Date</label>
                          <input
                            name="purchase_date"
                            type="date"
                            value={formData.purchase_date || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Department ID</label>
                          <input
                            name="department_id"
                            type="text"
                            value={formData.department_id || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="adm-form__footer">
                <button type="button" className="adm-btn adm-btn--secondary" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn--primary">
                  {formMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;