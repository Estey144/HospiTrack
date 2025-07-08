import React from 'react';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name} ({user?.email})</p>
      <ul>
        <li>Manage Doctors</li>
        <li>Manage Patients</li>
        <li>Manage Staff</li>
        <li>View Reports</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
