// import React from 'react';

// const AdminDashboard = () => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   return (
//     <div className="dashboard">
//       <h2>Admin Dashboard</h2>
//       <p>Welcome, {user?.name} ({user?.email})</p>
//       <ul>
//         <li>Manage Doctors</li>
//         <li>Manage Patients</li>
//         <li>Manage Staff</li>
//         <li>View Reports</li>
//       </ul>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [activeTab, setActiveTab] = useState('doctors');

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState('');
  const [formMode, setFormMode] = useState('create');

  const [reportsData, setReportsData] = useState(null);

  const API_BASE = '/api';

  const fetchData = async (entity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${entity}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      switch (entity) {
        case 'doctors': setDoctors(data); break;
        case 'patients': setPatients(data); break;
        case 'staff': setStaff(data); break;
        case 'users': setUsers(data); break;
        default: break;
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReportsData(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setSearchTerm('');
    setPage(1);
    if (activeTab === 'reports') {
      fetchReports();
    } else {
      fetchData(activeTab);
    }
  }, [activeTab]);

  const filterData = (list) => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(term)
      )
    );
  };

  const paginatedData = (list) => {
    const filtered = filterData(list);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    return { paged, totalPages };
  };

  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const openForm = (type, mode = 'create', data = {}) => {
    setFormType(type);
    setFormMode(mode);
    setFormData(data);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entity = formType === 'user' ? 'users' : formType + 's';
    const url = `${API_BASE}/${entity}${formMode === 'edit' ? `/${formData.id}` : ''}`;
    const method = formMode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save data');
      await fetchData(entity);
      closeForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const entity = type === 'user' ? 'users' : type + 's';
      const res = await fetch(`${API_BASE}/${entity}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchData(entity);
    } catch (err) {
      alert(err.message);
    }
  };

  const renderRows = (list, type) => {
    return list.map(item => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.name || item.email || item.designation || 'N/A'}</td>
        {type === 'users' && <td>{item.role}</td>}
        <td>
          <button className="btn" onClick={() => openForm(type.slice(0, -1), 'edit', item)}>Edit</button>
          <button className="btn btn-delete" onClick={() => handleDelete(type.slice(0, -1), item.id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const reportChartData = {
    labels: reportsData?.months || [],
    datasets: [
      {
        label: 'Patients Registered',
        data: reportsData?.patients || [],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Appointments',
        data: reportsData?.appointments || [],
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  const reportOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Hospital Report' },
    },
  };

  let currentData = [];
  let totalPages = 1;
  switch (activeTab) {
    case 'doctors': ({paged: currentData, totalPages} = paginatedData(doctors)); break;
    case 'patients': ({paged: currentData, totalPages} = paginatedData(patients)); break;
    case 'staff': ({paged: currentData, totalPages} = paginatedData(staff)); break;
    case 'users': ({paged: currentData, totalPages} = paginatedData(users)); break;
    default: break;
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user?.name} ({user?.email})</p>
      </header>

      <nav>
        <button className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>Manage Doctors</button>
        <button className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>Manage Patients</button>
        <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>Manage Staff</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Manage Users</button>
        <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>View Reports</button>
      </nav>

      <section className="content">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        {activeTab !== 'reports' && !loading && (
          <>
            <div className="list-controls">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
              />
              <button className="btn btn-add" onClick={() => openForm(activeTab.slice(0, -1), 'create')}>
                Add New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name / Email / Designation</th>
                  {activeTab === 'users' && <th>Role</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr><td colSpan={activeTab === 'users' ? 4 : 3}>No records found</td></tr>
                ) : (
                  renderRows(currentData, activeTab)
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </>
        )}

        {activeTab === 'reports' && reportsData && (
          <div className="reports-section">
            <Bar data={reportChartData} options={reportOptions} />
          </div>
        )}

        {formOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>{formMode === 'create' ? 'Add New' : 'Edit'} {formType.charAt(0).toUpperCase() + formType.slice(1)}</h3>
              <form onSubmit={handleSubmit}>

                {(formType === 'doctor' || formType === 'staff' || formType === 'user' || formType === 'patient') && (
                  <>
                    {formType !== 'user' && (
                      <div className="form-group">
                        <label>Name:</label>
                        <input
                          name="name"
                          type="text"
                          value={formData.name || ''}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    )}

                    {formType === 'user' && (
                      <>
                        <div className="form-group">
                          <label>Name:</label>
                          <input
                            name="name"
                            type="text"
                            value={formData.name || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email:</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Password:</label>
                          <input
                            name="password"
                            type="password"
                            value={formData.password || ''}
                            onChange={handleFormChange}
                            required={formMode === 'create'}
                            placeholder={formMode === 'edit' ? 'Leave blank to keep unchanged' : ''}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone:</label>
                          <input
                            name="phone"
                            type="text"
                            value={formData.phone || ''}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Role:</label>
                          <select
                            name="role"
                            value={formData.role || ''}
                            onChange={handleFormChange}
                            required
                          >
                            <option value="">Select Role</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="PATIENT">Patient</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </>
                    )}

                    {(formType === 'doctor' || formType === 'staff') && (
                      <>
                        <div className="form-group">
                          <label>User ID:</label>
                          <input
                            name="user_id"
                            type="text"
                            value={formData.user_id || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Branch ID:</label>
                          <input
                            name="branch_id"
                            type="text"
                            value={formData.branch_id || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                      </>
                    )}

                    {formType === 'doctor' && (
                      <>
                        <div className="form-group">
                          <label>License Number:</label>
                          <input
                            name="license_number"
                            type="text"
                            value={formData.license_number || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Experience Years:</label>
                          <input
                            name="experience_years"
                            type="number"
                            min="0"
                            value={formData.experience_years || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Available Hours:</label>
                          <input
                            name="available_hours"
                            type="text"
                            value={formData.available_hours || ''}
                            onChange={handleFormChange}
                            placeholder="e.g. 9:00-17:00"
                            required
                          />
                        </div>
                      </>
                    )}

                    {formType === 'patient' && (
                      <>
                        <div className="form-group">
                          <label>Date of Birth:</label>
                          <input
                            name="dob"
                            type="date"
                            value={formData.dob || ''}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Gender:</label>
                          <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleFormChange}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Blood Type:</label>
                          <input
                            name="blood_type"
                            type="text"
                            value={formData.blood_type || ''}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Address:</label>
                          <input
                            name="address"
                            type="text"
                            value={formData.address || ''}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Emergency Contact:</label>
                          <input
                            name="emergency_contact"
                            type="text"
                            value={formData.emergency_contact || ''}
                            onChange={handleFormChange}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn btn-save">Save</button>
                  <button type="button" className="btn btn-cancel" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;