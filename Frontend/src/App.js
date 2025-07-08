import React from 'react';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/branches" element={<BranchDirectory />} />
        <Route path="/staff" element={<StaffDirectory />} />
        <Route path="/rooms" element={<Rooms />} />

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />

        {/* Patient Functional Pages */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/ambulance" element={<AmbulanceRequest />} />
        <Route path="/video-sessions" element={<VideoSessions />} />
        <Route path="/lab-tests" element={<LabTests />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
      </Routes>
    </Router>
  );
}

export default App;