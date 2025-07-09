import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="patient-dashboard">
      <h2>Patient Dashboard</h2>
      <p>Hello, {user?.name}</p>
      <div className="patient-actions">
        <button onClick={() => goTo('/appointments')}>Book Appointment</button>
        <button onClick={() => goTo('/prescriptions')}>View Prescriptions</button>
        <button onClick={() => goTo('/bills')}>Billing Info</button>
        <button onClick={() => goTo('/medical-history')}>Medical History</button>
        <button onClick={() => goTo('/insurance')}>Apply for Insurance</button>
        <button onClick={() => goTo('/ambulance')}>Book Ambulance</button>
        <button onClick={() => goTo('/video-sessions')}>Join Video Session</button>
        <button onClick={() => goTo('/lab-tests')}>See Test List</button>
      </div>
    </div>
  );
};

export default PatientDashboard;