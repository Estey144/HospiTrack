import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
  // All hooks must be called before any conditional logic
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [testsToAdd, setTestsToAdd] = useState([]);
  const [availableHours, setAvailableHours] = useState("");
  const [doctorId, setDoctorId] = useState(null); // Store the actual doctor ID
  const [newPrescription, setNewPrescription] = useState({
    appointmentId: "",
    patientId: "",
    notes: "",
  });
  const [newTest, setNewTest] = useState({
    patientId: "",
    testType: "",
  });
  const [selectedHistory, setSelectedHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [formErrors, setFormErrors] = useState({
    prescription: {},
    labTest: {},
    hours: {}
  });

  const goTo = (path) => navigate(path);

  // Helper function to create axios config with JWT token
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Helper function to get doctor ID from user ID
  const getDoctorId = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Getting doctor ID for user:", user.id);
      
      const doctorRes = await axios.get(
        `http://localhost:8080/api/users/${user.id}/doctor`, 
        getAuthConfig()
      );
      
      if (doctorRes.data.error) {
        throw new Error(doctorRes.data.error);
      }
      
      console.log("Doctor mapping response:", doctorRes.data);
      return doctorRes.data.doctorId;
    } catch (error) {
      console.error("Error getting doctor ID:", error);
      throw error;
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Early validation
    if (!user) {
      console.error("No user found in localStorage");
      navigate('/login');
      return;
    }
    
    if (!user.id) {
      console.error("User object missing ID:", user);
      alert("Invalid user session. Please login again.");
      navigate('/login');
      return;
    }
    
    if (user.role !== 'doctor') {
      console.warn("User is not a doctor:", user.role);
      alert("Access denied. This dashboard is for doctors only.");
      navigate('/');
      return;
    }

    // Check if JWT token exists
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found");
      alert("Authentication required. Please login again.");
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Fetching data for user:", user.id);
        
        // First, get the doctor ID from the user ID
        const fetchedDoctorId = await getDoctorId();
        setDoctorId(fetchedDoctorId);
        
        console.log("Found doctor ID:", fetchedDoctorId, "for user ID:", user.id);
        
        // Now fetch all doctor data using the correct doctor ID with JWT headers
        const authConfig = getAuthConfig();
        
        const [appRes, patRes, labRes, prescRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/doctors/${fetchedDoctorId}/appointments`, authConfig),
          axios.get(`http://localhost:8080/api/doctors/${fetchedDoctorId}/patients`, authConfig),
          axios.get(`http://localhost:8080/api/doctors/${fetchedDoctorId}/labreports`, authConfig),
          axios.get(`http://localhost:8080/api/doctors/${fetchedDoctorId}/prescriptions`, authConfig),
        ]);
        
        console.log("Appointments response:", appRes.data);
        console.log("Patients response:", patRes.data);
        console.log("Lab reports response:", labRes.data);
        console.log("Prescriptions response:", prescRes.data);
        
        setAppointments(appRes.data);
        setPatients(patRes.data);
        setLabReports(labRes.data);
        setPrescriptions(prescRes.data);
        setAvailableHours(user.availableHours || "");
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("API Error details:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        } else if (err.response?.status === 403) {
          setError("Access denied. Please check your permissions.");
        } else if (err.response?.status === 404) {
          setError("Doctor not found or dashboard endpoints not available. Please contact support.");
        } else if (err.response?.status === 500) {
          setError("Server error occurred. Please try again later.");
        } else {
          setError(`Error loading dashboard data: ${err.message}`);
        }
        
        // Set default empty data to allow the dashboard to display
        setAppointments([]);
        setPatients([]);
        setLabReports([]);
        setPrescriptions([]);
        setAvailableHours(user.availableHours || "9:00 AM - 5:00 PM");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Get user from localStorage after hooks
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Debug and validation - moved after hooks
  console.log("DoctorDashboard - User from localStorage:", user);
  
  // Early returns should happen after all hooks are declared
  if (!user) {
    return null; // Already handled in useEffect
  }

  const handlePrescriptionChange = (e) => {
    setNewPrescription({
      ...newPrescription,
      [e.target.name]: e.target.value,
    });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    
    // Reset form errors
    setFormErrors(prev => ({ ...prev, prescription: {} }));
    
    // Validation
    const errors = {};
    if (!newPrescription.appointmentId) errors.appointmentId = "Please select an appointment";
    if (!newPrescription.patientId) errors.patientId = "Please select a patient";
    if (!newPrescription.notes.trim()) errors.notes = "Please enter prescription notes";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, prescription: errors }));
      setError("Please fill all required fields for prescription");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Submitting prescription:", newPrescription);
      
      // Add doctorId to the prescription data
      const prescriptionData = {
        ...newPrescription,
        doctorId: doctorId || user.id // Use the stored doctorId, fallback to user.id
      };
      
      const response = await axios.post(
        "http://localhost:8080/api/prescriptions", 
        prescriptionData,
        getAuthConfig()
      );
      console.log("Prescription response:", response.data);
      
      setNewPrescription({ appointmentId: "", patientId: "", notes: "" });
      setError("");
      setFormErrors(prev => ({ ...prev, prescription: {} }));
      
      alert("Prescription submitted successfully!");
      
      // Refresh prescriptions data to show the new prescription
      try {
        const prescRes = await axios.get(
          `http://localhost:8080/api/doctors/${doctorId || user.id}/prescriptions`,
          getAuthConfig()
        );
        setPrescriptions(prescRes.data);
        console.log("Prescriptions refreshed:", prescRes.data);
      } catch (refreshErr) {
        console.warn("Could not refresh prescriptions:", refreshErr);
      }
    } catch (err) {
      console.error("Prescription error:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError("Prescription API endpoint not found");
      } else if (err.response?.status === 500) {
        setError("Server error while submitting prescription");
      } else {
        setError(`Error submitting prescription: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestChange = (e) => {
    setNewTest({
      ...newTest,
      [e.target.name]: e.target.value,
    });
  };

  const submitTest = async (e) => {
    e.preventDefault();
    
    // Reset form errors
    setFormErrors(prev => ({ ...prev, labTest: {} }));
    
    // Validation
    const errors = {};
    if (!newTest.patientId) errors.patientId = "Please select a patient";
    if (!newTest.testType.trim()) errors.testType = "Please enter test type";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, labTest: errors }));
      setError("Please fill all required fields for lab test");
      return;
    }
    
    try {
      setLoading(true);
      const testData = {
        patientId: newTest.patientId,
        testType: newTest.testType,
        testDate: new Date(),
        doctorId: doctorId || user.id, // Use the stored doctorId, fallback to user.id
      };
      console.log("Submitting lab test:", testData);
      
      const response = await axios.post(
        "http://localhost:8080/api/labtests", 
        testData,
        getAuthConfig()
      );
      console.log("Lab test response:", response.data);
      
      setNewTest({ patientId: "", testType: "" });
      setError("");
      setFormErrors(prev => ({ ...prev, labTest: {} }));
      
      alert("Lab test added successfully!");
      
      // Refresh lab reports data
      try {
        const labRes = await axios.get(
          `http://localhost:8080/api/doctors/${doctorId || user.id}/labreports`,
          getAuthConfig()
        );
        setLabReports(labRes.data);
      } catch (refreshErr) {
        console.warn("Could not refresh lab reports:", refreshErr);
      }
    } catch (err) {
      console.error("Lab test error:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError("Lab test API endpoint not found");
      } else if (err.response?.status === 500) {
        setError("Server error while adding lab test");
      } else {
        setError(`Error adding lab test: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateAvailableHours = async () => {
    // Reset form errors
    setFormErrors(prev => ({ ...prev, hours: {} }));
    
    if (!availableHours.trim()) {
      setFormErrors(prev => ({ ...prev, hours: { availableHours: "Please enter available hours" } }));
      setError("Please enter available hours");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Updating available hours for doctor:", doctorId || user.id, "to:", availableHours);
      
      const response = await axios.put(
        `http://localhost:8080/api/doctors/${doctorId || user.id}/availablehours`,
        { availableHours },
        getAuthConfig()
      );
      console.log("Update hours response:", response.data);
      setError("");
      setFormErrors(prev => ({ ...prev, hours: {} }));
      
      alert("Available hours updated successfully!");
    } catch (err) {
      console.error("Update hours error:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError("Update hours API endpoint not found");
      } else if (err.response?.status === 500) {
        setError("Server error while updating hours");
      } else {
        setError(`Error updating hours: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      console.log("Approving appointment:", appointmentId);
      
      const response = await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/approve`,
        {},
        getAuthConfig()
      );
      console.log("Approve appointment response:", response.data);
      
      // Update the local state to reflect the change
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === appointmentId 
            ? { ...app, status: 'confirmed' }
            : app
        )
      );
      
      setError("");
      alert("Appointment approved successfully!");
    } catch (err) {
      console.error("Approve appointment error:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError("Appointment not found or approval endpoint not available");
      } else if (err.response?.status === 500) {
        setError("Server error while approving appointment");
      } else {
        setError(`Error approving appointment: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleHistory = async (patientId) => {
    if (selectedHistory[patientId]) {
      setSelectedHistory((prev) => {
        const copy = { ...prev };
        delete copy[patientId];
        return copy;
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching history for patient:", patientId);
      
      const res = await axios.get(
        `http://localhost:8080/api/patients/${patientId}/history`,
        getAuthConfig()
      );
      console.log("Patient history response:", res.data);
      setSelectedHistory((prev) => ({
        ...prev,
        [patientId]: res.data,
      }));
    } catch (err) {
      console.error("Patient history error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 401) {
        alert("Authentication failed. Please login again.");
        navigate('/login');
      } else if (err.response?.status === 404) {
        alert("Patient history not found for this patient.");
      } else if (err.response?.status === 500) {
        alert("Server error while fetching patient history. Please try again.");
      } else {
        alert(`Error fetching patient history: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const filteredAppointments = appointments.filter(appointment => {
    if (appointmentFilter === "all") return true;
    return appointment.status.toLowerCase() === appointmentFilter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "#4caf50";
      case "pending": return "#ff9800";
      case "cancelled": return "#f44336";
      case "completed": return "#2196f3";
      default: return "#757575";
    }
  };

  const getTodaysAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(app => 
      new Date(app.appointmentDate).toDateString() === today
    );
  };

  const getPendingReports = () => {
    return labReports.filter(report => !report.result || report.result === "Pending");
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  // Console logging for development (can be removed in production)
  console.log("Doctor Dashboard - Current user:", user);
  console.log("Doctor ID:", doctorId);
  console.log("Appointments count:", appointments.length);
  console.log("Patients count:", patients.length);
  console.log("Lab reports count:", labReports.length);
  console.log("Prescriptions count:", prescriptions.length);

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}</h1>
            <p className="date">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => goTo('/')} 
              className="home-button"
            >
              <Home size={16} style={{ marginRight: 5 }} />
              Go to Homepage
            </button>
          </div>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{appointments.length}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{patients.length}</div>
            <div className="stat-label">Total Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{labReports.length}</div>
            <div className="stat-label">Lab Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{prescriptions.length}</div>
            <div className="stat-label">Prescriptions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getTodaysAppointments().length}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button 
          className={`tab-button ${activeTab === "patients" ? "active" : ""}`}
          onClick={() => setActiveTab("patients")}
        >
          Patients
        </button>
        <button 
          className={`tab-button ${activeTab === "lab-reports" ? "active" : ""}`}
          onClick={() => setActiveTab("lab-reports")}
        >
          Lab Reports
        </button>
        <button 
          className={`tab-button ${activeTab === "prescriptions" ? "active" : ""}`}
          onClick={() => setActiveTab("prescriptions")}
        >
          Prescriptions
        </button>
        <button 
          className={`tab-button ${activeTab === "actions" ? "active" : ""}`}
          onClick={() => setActiveTab("actions")}
        >
          Actions
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="tab-content">
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Recent Appointments</h3>
              {appointments.length === 0 ? (
                <p className="empty-state">No appointments found</p>
              ) : (
                <div className="appointment-list">
                  {appointments.slice(0, 5).map((app) => (
                    <div key={app.id} className="appointment-item">
                      <div className="appointment-date">{new Date(app.appointmentDate).toLocaleDateString()}</div>
                      <div className="appointment-time">{app.timeSlot}</div>
                      <div className="appointment-patient">{app.patientName}</div>
                      <div className="appointment-status" style={{ color: getStatusColor(app.status) }}>
                        {app.status}
                      </div>
                      {app.status.toLowerCase() === 'pending' && (
                        <button 
                          onClick={() => approveAppointment(app.id)}
                          className="approve-button-small"
                          disabled={loading}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="overview-card">
              <h3>My Patients</h3>
              {patients.length === 0 ? (
                <p className="empty-state">No patients found</p>
              ) : (
                <div className="patient-list">
                  {patients.slice(0, 5).map((patient) => (
                    <div key={patient.id} className="patient-item">
                      <div className="patient-name">{patient.name}</div>
                      <div className="patient-contact">{patient.phone}</div>
                      <div className="patient-blood">{patient.bloodType}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="overview-card">
              <h3>Recent Lab Reports</h3>
              {labReports.slice(0, 5).length === 0 ? (
                <p className="empty-state">No recent reports</p>
              ) : (
                <div className="report-list">
                  {labReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="report-item">
                      <div className="report-patient">{report.patientName}</div>
                      <div className="report-test">{report.testType}</div>
                      <div className="report-status">
                        {report.result || "Pending"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Appointments</h2>
            <div className="filter-group">
              <select 
                value={appointmentFilter} 
                onChange={(e) => setAppointmentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Appointments</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state-card">
              <p>No appointments found for the selected filter.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((a) => (
                    <tr key={a.id}>
                      <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                      <td className="time-slot">{a.timeSlot}</td>
                      <td className="patient-name">{a.patientName}</td>
                      <td>{a.type}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: getStatusColor(a.status) }}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status.toLowerCase() === 'pending' ? (
                          <button 
                            onClick={() => approveAppointment(a.id)}
                            className="approve-button"
                            disabled={loading}
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="approved-text">
                            {a.status.toLowerCase() === 'confirmed' ? 'Approved' : a.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "patients" && (
        <div className="tab-content">
          <div className="section-header">
            <h2>My Patients</h2>
            <div className="search-group">
              <input
                type="text"
                placeholder="Search patients by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="empty-state-card">
              <p>No patients found matching your search.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Blood Type</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <React.Fragment key={p.id}>
                      <tr>
                        <td className="patient-name">{p.name}</td>
                        <td>{new Date(p.dob).toLocaleDateString()}</td>
                        <td>{p.gender}</td>
                        <td className="blood-type">{p.bloodType}</td>
                        <td>{p.phone}</td>
                        <td>{p.address}</td>
                        <td>
                          <button 
                            onClick={() => toggleHistory(p.id)}
                            className="action-button"
                          >
                            {selectedHistory[p.id] ? "Hide History" : "View History"}
                          </button>
                        </td>
                      </tr>
                      {selectedHistory[p.id] && (
                        <tr className="history-row">
                          <td colSpan="7">
                            <div className="patient-history">
                              <div className="history-section">
                                <h4>Prescriptions</h4>
                                {selectedHistory[p.id].prescriptions?.length > 0 ? (
                                  <ul>
                                    {selectedHistory[p.id].prescriptions.map((pres, i) => (
                                      <li key={i}>
                                        <strong>{new Date(pres.dateIssued).toLocaleDateString()}</strong>: {pres.notes}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="no-data">No prescriptions found.</p>
                                )}
                              </div>
                              <div className="history-section">
                                <h4>Lab Tests</h4>
                                {selectedHistory[p.id].labTests?.length > 0 ? (
                                  <ul>
                                    {selectedHistory[p.id].labTests.map((test, i) => (
                                      <li key={i}>
                                        <strong>{new Date(test.testDate).toLocaleDateString()}</strong> - {test.testType}: 
                                        <span className={`test-result ${test.result ? 'completed' : 'pending'}`}>
                                          {test.result || "Pending"}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="no-data">No lab tests found.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "lab-reports" && (
        <div className="tab-content">
          <h2>Lab Reports</h2>
          {labReports.length === 0 ? (
            <div className="empty-state-card">
              <p>No lab reports available.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Test Type</th>
                    <th>Test Date</th>
                    <th>Result</th>
                    <th>Report File</th>
                  </tr>
                </thead>
                <tbody>
                  {labReports.map((r) => (
                    <tr key={r.id}>
                      <td className="patient-name">{r.patientName}</td>
                      <td>{r.testType}</td>
                      <td>{new Date(r.testDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`test-result ${r.result ? 'completed' : 'pending'}`}>
                          {r.result || "Pending"}
                        </span>
                      </td>
                      <td>
                        {r.fileUrl ? (
                          <a href={r.fileUrl} target="_blank" rel="noreferrer" className="file-link">
                            View Report
                          </a>
                        ) : (
                          <span className="no-file">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "prescriptions" && (
        <div className="tab-content">
          <h2>Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <div className="empty-state-card">
              <p>No prescriptions available.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date Issued</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Prescription Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td>{new Date(prescription.dateIssued).toLocaleDateString()}</td>
                      <td className="patient-name">{prescription.patientName}</td>
                      <td>{prescription.appointmentDate ? new Date(prescription.appointmentDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="prescription-notes">{prescription.notes}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: '#28a745' }}>
                          Issued
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "actions" && (
        <div className="tab-content">
          <div className="actions-grid">
            <div className="action-card">
              <h3>Write Prescription</h3>
              <form onSubmit={submitPrescription} className="action-form">
                <div className="form-group">
                  <label>Appointment</label>
                  <select
                    name="appointmentId"
                    value={newPrescription.appointmentId}
                    onChange={handlePrescriptionChange}
                    className={formErrors.prescription.appointmentId ? 'error' : ''}
                    required
                  >
                    <option value="">Select Appointment</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.patientName} - {new Date(a.appointmentDate).toLocaleDateString()} {a.timeSlot}
                      </option>
                    ))}
                  </select>
                  {formErrors.prescription.appointmentId && (
                    <div className="error-message">
                      ⚠️ {formErrors.prescription.appointmentId}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Patient</label>
                  <select
                    name="patientId"
                    value={newPrescription.patientId}
                    onChange={handlePrescriptionChange}
                    className={formErrors.prescription.patientId ? 'error' : ''}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.prescription.patientId && (
                    <div className="error-message">
                      ⚠️ {formErrors.prescription.patientId}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Prescription Notes</label>
                  <textarea
                    name="notes"
                    value={newPrescription.notes}
                    onChange={handlePrescriptionChange}
                    placeholder="Enter prescription details..."
                    rows="4"
                    className={formErrors.prescription.notes ? 'error' : ''}
                    required
                  />
                  {formErrors.prescription.notes && (
                    <div className="error-message">
                      ⚠️ {formErrors.prescription.notes}
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Prescription'}
                </button>
              </form>
            </div>

            <div className="action-card">
              <h3>Add Lab Test</h3>
              <form onSubmit={submitTest} className="action-form">
                <div className="form-group">
                  <label>Patient</label>
                  <select
                    name="patientId"
                    value={newTest.patientId}
                    onChange={handleTestChange}
                    className={formErrors.labTest.patientId ? 'error' : ''}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.labTest.patientId && (
                    <div className="error-message">
                      ⚠️ {formErrors.labTest.patientId}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Test Type</label>
                  <input
                    type="text"
                    name="testType"
                    value={newTest.testType}
                    onChange={handleTestChange}
                    placeholder="e.g., Blood Test, X-Ray, MRI"
                    className={formErrors.labTest.testType ? 'error' : ''}
                    required
                  />
                  {formErrors.labTest.testType && (
                    <div className="error-message">
                      ⚠️ {formErrors.labTest.testType}
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Submitting...' : 'Add Lab Test'}
                </button>
              </form>
            </div>

            <div className="action-card">
              <h3>Manage Available Hours</h3>
              <div className="action-form">
                <div className="form-group">
                  <label>Available Hours</label>
                  <input
                    type="text"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(e.target.value)}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    className={formErrors.hours.availableHours ? 'error' : ''}
                  />
                  {formErrors.hours.availableHours && (
                    <div className="error-message">
                      ⚠️ {formErrors.hours.availableHours}
                    </div>
                  )}
                </div>
                <button onClick={updateAvailableHours} className="submit-button" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Hours'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
