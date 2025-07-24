import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './Homepage';
import Login from './Login';
import Signup from './Signup';

import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

import Appointments from './Appointments';
import Prescriptions from './Prescriptions';
import Bills from './Bills';
import Insurance from './Insurance';
import AmbulanceRequest from './AmbulanceRequest';
import VideoSessions from './VideoSessions';
import LabTests from './LabTests';
import MedicalHistory from './MedicalHistory';

import BranchDirectory from './BranchDirectory';
import StaffDirectory from './StaffDirectory';
import Rooms from './Rooms';
import Doctors from './Doctors';
import Feedback from './Feedback';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Homepage user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctors" element={<Doctors user={user} />} />
        <Route path="/branches" element={<BranchDirectory />} />
        <Route path="/staff" element={<StaffDirectory />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/feedback" element={<Feedback />} />
        

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard user={user} />} />
        <Route path="/patient-dashboard" element={<PatientDashboard user={user} />} />

        {/* Patient Functional Pages - Pass user prop */}
        <Route path="/appointments" element={<Appointments currentUser={user} />} />
        <Route path="/prescriptions" element={<Prescriptions currentUser={user} />} />
        <Route path="/bills" element={<Bills currentUser={user} />} />
        <Route path="/insurance" element={<Insurance currentUser={user} />} />
        <Route path="/ambulance" element={<AmbulanceRequest currentUser={user} />} />
        <Route path="/video-sessions" element={<VideoSessions currentUser={user} />} />
    
        <Route path="/lab-tests" element={<LabTests currentUser={user} />} />
        <Route path="/medical-history" element={<MedicalHistory currentUser={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
