import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Doctors.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/doctors`)
      .then(res => setDoctors(res.data))
      .catch(() => alert('Failed to load doctors'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="doctors-page">
      <h2>Doctors List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience (years)</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.specialization}</td>
              <td>{doc.experienceYears}</td>
              <td>{doc.branchName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctors;