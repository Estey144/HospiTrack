// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./DoctorDashboard.css";

// const DoctorDashboard = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [appointments, setAppointments] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [labReports, setLabReports] = useState([]);
//   const [testsToAdd, setTestsToAdd] = useState([]);
//   const [availableHours, setAvailableHours] = useState("");
//   const [newPrescription, setNewPrescription] = useState({
//     appointmentId: "",
//     patientId: "",
//     notes: "",
//   });
//   const [newTest, setNewTest] = useState({
//     patientId: "",
//     testType: "",
//   });
//   const [selectedHistory, setSelectedHistory] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [appRes, patRes, labRes] = await Promise.all([
//           axios.get(`/api/doctors/${user.id}/appointments`),
//           axios.get(`/api/doctors/${user.id}/patients`),
//           axios.get(`/api/doctors/${user.id}/labreports`),
//         ]);
//         setAppointments(appRes.data);
//         setPatients(patRes.data);
//         setLabReports(labRes.data);
//         setAvailableHours(user.availableHours || "");
//       } catch (err) {
//         setError("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   const handlePrescriptionChange = (e) => {
//     setNewPrescription({
//       ...newPrescription,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const submitPrescription = async (e) => {
//     e.preventDefault();
//     if (!newPrescription.appointmentId || !newPrescription.patientId) {
//       setError("Select appointment and patient for prescription");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post("/api/prescriptions", newPrescription);
//       setNewPrescription({ appointmentId: "", patientId: "", notes: "" });
//       alert("Prescription submitted");
//     } catch {
//       setError("Failed to submit prescription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTestChange = (e) => {
//     setNewTest({
//       ...newTest,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const submitTest = async (e) => {
//     e.preventDefault();
//     if (!newTest.patientId || !newTest.testType) {
//       setError("Select patient and test type");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post("/api/labtests", {
//         patientId: newTest.patientId,
//         testType: newTest.testType,
//         testDate: new Date(),
//         doctorId: user.id,
//       });
//       setNewTest({ patientId: "", testType: "" });
//       alert("Lab test added");
//     } catch {
//       setError("Failed to add lab test");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAvailableHours = async () => {
//     try {
//       setLoading(true);
//       await axios.put(`/api/doctors/${user.id}/availablehours`, {
//         availableHours,
//       });
//       alert("Available hours updated");
//     } catch {
//       setError("Failed to update available hours");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleHistory = async (patientId) => {
//     if (selectedHistory[patientId]) {
//       setSelectedHistory((prev) => {
//         const copy = { ...prev };
//         delete copy[patientId];
//         return copy;
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/patients/${patientId}/history`);
//       setSelectedHistory((prev) => ({
//         ...prev,
//         [patientId]: res.data,
//       }));
//     } catch {
//       alert("Failed to load medical history.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="doctor-dashboard">
//       <h2>Doctor Dashboard</h2>
//       <p>Welcome {user?.name}</p>

//       {error && <div className="error">{error}</div>}

//       <section className="section appointments">
//         <h3>Appointments</h3>
//         {appointments.length === 0 ? (
//           <p>No appointments found.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Time Slot</th>
//                 <th>Patient</th>
//                 <th>Type</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.map((a) => (
//                 <tr key={a.id}>
//                   <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
//                   <td>{a.timeSlot}</td>
//                   <td>{a.patientName}</td>
//                   <td>{a.type}</td>
//                   <td>{a.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <section className="section patients">
//         <h3>My Patients</h3>
//         {patients.length === 0 ? (
//           <p>No patients found.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>DOB</th>
//                 <th>Gender</th>
//                 <th>Blood Type</th>
//                 <th>Contact</th>
//                 <th>Address</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.map((p) => (
//                 <React.Fragment key={p.id}>
//                   <tr>
//                     <td>{p.name}</td>
//                     <td>{new Date(p.dob).toLocaleDateString()}</td>
//                     <td>{p.gender}</td>
//                     <td>{p.bloodType}</td>
//                     <td>{p.phone}</td>
//                     <td>{p.address}</td>
//                     <td>
//                       <button onClick={() => toggleHistory(p.id)}>View History</button>
//                     </td>
//                   </tr>
//                   {selectedHistory[p.id] && (
//                     <tr>
//                       <td colSpan="7">
//                         <div className="patient-history">
//                           <strong>Prescriptions:</strong>
//                           <ul>
//                             {selectedHistory[p.id].prescriptions?.length > 0 ? (
//                               selectedHistory[p.id].prescriptions.map((pres, i) => (
//                                 <li key={i}>
//                                   {new Date(pres.dateIssued).toLocaleDateString()}: {pres.notes}
//                                 </li>
//                               ))
//                             ) : (
//                               <li>No prescriptions found.</li>
//                             )}
//                           </ul>
//                           <strong>Lab Tests:</strong>
//                           <ul>
//                             {selectedHistory[p.id].labTests?.length > 0 ? (
//                               selectedHistory[p.id].labTests.map((test, i) => (
//                                 <li key={i}>
//                                   {new Date(test.testDate).toLocaleDateString()} - {test.testType}: {test.result || "Pending"}
//                                 </li>
//                               ))
//                             ) : (
//                               <li>No lab tests found.</li>
//                             )}
//                           </ul>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <section className="section lab-reports">
//         <h3>Lab Reports</h3>
//         {labReports.length === 0 ? (
//           <p>No lab reports available.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Patient</th>
//                 <th>Test Type</th>
//                 <th>Test Date</th>
//                 <th>Result</th>
//                 <th>Report File</th>
//               </tr>
//             </thead>
//             <tbody>
//               {labReports.map((r) => (
//                 <tr key={r.id}>
//                   <td>{r.patientName}</td>
//                   <td>{r.testType}</td>
//                   <td>{new Date(r.testDate).toLocaleDateString()}</td>
//                   <td>{r.result}</td>
//                   <td>
//                     {r.fileUrl ? (
//                       <a href={r.fileUrl} target="_blank" rel="noreferrer">
//                         View Report
//                       </a>
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <section className="section prescription-form">
//         <h3>Write Prescription</h3>
//         <form onSubmit={submitPrescription}>
//           <label>
//             Appointment:
//             <select
//               name="appointmentId"
//               value={newPrescription.appointmentId}
//               onChange={handlePrescriptionChange}
//             >
//               <option value="">Select Appointment</option>
//               {appointments.map((a) => (
//                 <option key={a.id} value={a.id}>
//                   {a.patientName} - {new Date(a.appointmentDate).toLocaleDateString()} {a.timeSlot}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label>
//             Patient:
//             <select
//               name="patientId"
//               value={newPrescription.patientId}
//               onChange={handlePrescriptionChange}
//             >
//               <option value="">Select Patient</option>
//               {patients.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label>
//             Notes:
//             <textarea
//               name="notes"
//               value={newPrescription.notes}
//               onChange={handlePrescriptionChange}
//               required
//             />
//           </label>

//           <button type="submit">Submit Prescription</button>
//         </form>
//       </section>

//       <section className="section lab-test-form">
//         <h3>Add Lab Test</h3>
//         <form onSubmit={submitTest}>
//           <label>
//             Patient:
//             <select
//               name="patientId"
//               value={newTest.patientId}
//               onChange={handleTestChange}
//             >
//               <option value="">Select Patient</option>
//               {patients.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label>
//             Test Type:
//             <input
//               type="text"
//               name="testType"
//               value={newTest.testType}
//               onChange={handleTestChange}
//               placeholder="e.g., Blood Test, X-Ray"
//               required
//             />
//           </label>

//           <button type="submit">Add Test</button>
//         </form>
//       </section>

//       <section className="section available-hours">
//         <h3>Manage Available Hours</h3>
//         <input
//           type="text"
//           value={availableHours}
//           onChange={(e) => setAvailableHours(e.target.value)}
//           placeholder="e.g., 9:00-17:00"
//         />
//         <button onClick={updateAvailableHours}>Update Hours</button>
//       </section>
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [testsToAdd, setTestsToAdd] = useState([]);
  const [availableHours, setAvailableHours] = useState("");
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

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, patRes, labRes] = await Promise.all([
          axios.get(`/api/doctors/${user.id}/appointments`),
          axios.get(`/api/doctors/${user.id}/patients`),
          axios.get(`/api/doctors/${user.id}/labreports`),
        ]);
        setAppointments(appRes.data);
        setPatients(patRes.data);
        setLabReports(labRes.data);
        setAvailableHours(user.availableHours || "");
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handlePrescriptionChange = (e) => {
    setNewPrescription({
      ...newPrescription,
      [e.target.name]: e.target.value,
    });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    if (!newPrescription.appointmentId || !newPrescription.patientId) {
      setError("Select appointment and patient for prescription");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/prescriptions", newPrescription);
      setNewPrescription({ appointmentId: "", patientId: "", notes: "" });
      alert("Prescription submitted successfully!");
    } catch {
      setError("Failed to submit prescription");
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
    if (!newTest.patientId || !newTest.testType) {
      setError("Select patient and test type");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/labtests", {
        patientId: newTest.patientId,
        testType: newTest.testType,
        testDate: new Date(),
        doctorId: user.id,
      });
      setNewTest({ patientId: "", testType: "" });
      alert("Lab test added successfully!");
    } catch {
      setError("Failed to add lab test");
    } finally {
      setLoading(false);
    }
  };

  const updateAvailableHours = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/doctors/${user.id}/availablehours`, {
        availableHours,
      });
      alert("Available hours updated successfully!");
    } catch {
      setError("Failed to update available hours");
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
      const res = await axios.get(`/api/patients/${patientId}/history`);
      setSelectedHistory((prev) => ({
        ...prev,
        [patientId]: res.data,
      }));
    } catch {
      alert("Failed to load medical history.");
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

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, Dr. {user?.name}</h1>
          <p className="date">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{getTodaysAppointments().length}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{patients.length}</div>
            <div className="stat-label">Total Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getPendingReports().length}</div>
            <div className="stat-label">Pending Reports</div>
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
              <h3>Today's Schedule</h3>
              {getTodaysAppointments().length === 0 ? (
                <p className="empty-state">No appointments today</p>
              ) : (
                <div className="appointment-list">
                  {getTodaysAppointments().map((app) => (
                    <div key={app.id} className="appointment-item">
                      <div className="appointment-time">{app.timeSlot}</div>
                      <div className="appointment-patient">{app.patientName}</div>
                      <div className="appointment-status" style={{ color: getStatusColor(app.status) }}>
                        {app.status}
                      </div>
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
                    required
                  >
                    <option value="">Select Appointment</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.patientName} - {new Date(a.appointmentDate).toLocaleDateString()} {a.timeSlot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Patient</label>
                  <select
                    name="patientId"
                    value={newPrescription.patientId}
                    onChange={handlePrescriptionChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Prescription Notes</label>
                  <textarea
                    name="notes"
                    value={newPrescription.notes}
                    onChange={handlePrescriptionChange}
                    placeholder="Enter prescription details..."
                    rows="4"
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  Submit Prescription
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
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Test Type</label>
                  <input
                    type="text"
                    name="testType"
                    value={newTest.testType}
                    onChange={handleTestChange}
                    placeholder="e.g., Blood Test, X-Ray, MRI"
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  Add Lab Test
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
                  />
                </div>
                <button onClick={updateAvailableHours} className="submit-button">
                  Update Hours
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