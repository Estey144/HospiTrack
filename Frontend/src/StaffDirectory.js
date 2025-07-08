import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StaffDirectory.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const StaffDirectory = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/staff`)
      .then(res => {
        setStaffList(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load staff directory.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading staff directory...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="staff-directory">
      <h2>Staff Directory</h2>
      {staffList.length === 0 ? (
        <p>No staff found.</p>
      ) : (
        <table className="staff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.name}</td>
                <td>{staff.position}</td>
                <td>{staff.department}</td>
                <td>{staff.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffDirectory;