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
      alert("Prescription submitted");
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
      alert("Lab test added");
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
      alert("Available hours updated");
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>
      <p>Welcome {user?.name}</p>

      {error && <div className="error">{error}</div>}

      <section className="section appointments">
        <h3>Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{a.timeSlot}</td>
                  <td>{a.patientName}</td>
                  <td>{a.type}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section patients">
        <h3>My Patients</h3>
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <table>
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
              {patients.map((p) => (
                <React.Fragment key={p.id}>
                  <tr>
                    <td>{p.name}</td>
                    <td>{new Date(p.dob).toLocaleDateString()}</td>
                    <td>{p.gender}</td>
                    <td>{p.bloodType}</td>
                    <td>{p.phone}</td>
                    <td>{p.address}</td>
                    <td>
                      <button onClick={() => toggleHistory(p.id)}>View History</button>
                    </td>
                  </tr>
                  {selectedHistory[p.id] && (
                    <tr>
                      <td colSpan="7">
                        <div className="patient-history">
                          <strong>Prescriptions:</strong>
                          <ul>
                            {selectedHistory[p.id].prescriptions?.length > 0 ? (
                              selectedHistory[p.id].prescriptions.map((pres, i) => (
                                <li key={i}>
                                  {new Date(pres.dateIssued).toLocaleDateString()}: {pres.notes}
                                </li>
                              ))
                            ) : (
                              <li>No prescriptions found.</li>
                            )}
                          </ul>
                          <strong>Lab Tests:</strong>
                          <ul>
                            {selectedHistory[p.id].labTests?.length > 0 ? (
                              selectedHistory[p.id].labTests.map((test, i) => (
                                <li key={i}>
                                  {new Date(test.testDate).toLocaleDateString()} - {test.testType}: {test.result || "Pending"}
                                </li>
                              ))
                            ) : (
                              <li>No lab tests found.</li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section lab-reports">
        <h3>Lab Reports</h3>
        {labReports.length === 0 ? (
          <p>No lab reports available.</p>
        ) : (
          <table>
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
                  <td>{r.patientName}</td>
                  <td>{r.testType}</td>
                  <td>{new Date(r.testDate).toLocaleDateString()}</td>
                  <td>{r.result}</td>
                  <td>
                    {r.fileUrl ? (
                      <a href={r.fileUrl} target="_blank" rel="noreferrer">
                        View Report
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section prescription-form">
        <h3>Write Prescription</h3>
        <form onSubmit={submitPrescription}>
          <label>
            Appointment:
            <select
              name="appointmentId"
              value={newPrescription.appointmentId}
              onChange={handlePrescriptionChange}
            >
              <option value="">Select Appointment</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patientName} - {new Date(a.appointmentDate).toLocaleDateString()} {a.timeSlot}
                </option>
              ))}
            </select>
          </label>

          <label>
            Patient:
            <select
              name="patientId"
              value={newPrescription.patientId}
              onChange={handlePrescriptionChange}
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Notes:
            <textarea
              name="notes"
              value={newPrescription.notes}
              onChange={handlePrescriptionChange}
              required
            />
          </label>

          <button type="submit">Submit Prescription</button>
        </form>
      </section>

      <section className="section lab-test-form">
        <h3>Add Lab Test</h3>
        <form onSubmit={submitTest}>
          <label>
            Patient:
            <select
              name="patientId"
              value={newTest.patientId}
              onChange={handleTestChange}
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Test Type:
            <input
              type="text"
              name="testType"
              value={newTest.testType}
              onChange={handleTestChange}
              placeholder="e.g., Blood Test, X-Ray"
              required
            />
          </label>

          <button type="submit">Add Test</button>
        </form>
      </section>

      <section className="section available-hours">
        <h3>Manage Available Hours</h3>
        <input
          type="text"
          value={availableHours}
          onChange={(e) => setAvailableHours(e.target.value)}
          placeholder="e.g., 9:00-17:00"
        />
        <button onClick={updateAvailableHours}>Update Hours</button>
      </section>
    </div>
  );
};

export default DoctorDashboard;