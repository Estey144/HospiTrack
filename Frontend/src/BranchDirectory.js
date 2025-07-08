import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Branches.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/branches`)
      .then(res => setBranches(res.data))
      .catch(() => alert('Failed to load branches'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading branches...</p>;

  return (
    <div className="branches-page">
      <h2>Hospital Branches</h2>
      <ul>
        {branches.map(branch => (
          <li key={branch.id}>
            <h3>{branch.name}</h3>
            <p>{branch.address}</p>
            <p>Established: {new Date(branch.establishedDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Branches;