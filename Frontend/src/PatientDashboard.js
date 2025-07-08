import React from 'react';

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard">
      <h2>Patient Dashboard</h2>
      <p>Hello, {user?.name}</p>
      <ul>
        <li>Book Appointment</li>
        <li>View Prescriptions</li>
        <li>Billing Info</li>
        <li>Medical History</li>
      </ul>
    </div>
  );
};

export default PatientDashboard;
