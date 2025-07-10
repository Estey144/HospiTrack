// import React, { useEffect, useState } from 'react';
// import './AdminDashboard.css';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register ChartJS components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const AdminDashboard = () => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   const [activeTab, setActiveTab] = useState('doctors');

//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [staff, setStaff] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;

//   const [formOpen, setFormOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [formType, setFormType] = useState('');
//   const [formMode, setFormMode] = useState('create');

//   const [reportsData, setReportsData] = useState(null);

//   const API_BASE = '/api';

//   const fetchData = async (entity) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/${entity}`);
//       if (!res.ok) throw new Error('Failed to fetch data');
//       const data = await res.json();
//       switch (entity) {
//         case 'doctors': setDoctors(data); break;
//         case 'patients': setPatients(data); break;
//         case 'staff': setStaff(data); break;
//         case 'users': setUsers(data); break;
//         default: break;
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   const fetchReports = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/reports`);
//       if (!res.ok) throw new Error('Failed to fetch reports');
//       const data = await res.json();
//       setReportsData(data);
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     setSearchTerm('');
//     setPage(1);
//     if (activeTab === 'reports') {
//       fetchReports();
//     } else {
//       fetchData(activeTab);
//     }
//   }, [activeTab]);

//   const filterData = (list) => {
//     if (!searchTerm) return list;
//     const term = searchTerm.toLowerCase();
//     return list.filter(item =>
//       Object.values(item).some(val =>
//         val && val.toString().toLowerCase().includes(term)
//       )
//     );
//   };

//   const paginatedData = (list) => {
//     const filtered = filterData(list);
//     const totalPages = Math.ceil(filtered.length / itemsPerPage);
//     const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
//     return { paged, totalPages };
//   };

//   const handleFormChange = (e) => {
//     setFormData({...formData, [e.target.name]: e.target.value});
//   };

//   const openForm = (type, mode = 'create', data = {}) => {
//     setFormType(type);
//     setFormMode(mode);
//     setFormData(data);
//     setFormOpen(true);
//   };

//   const closeForm = () => {
//     setFormOpen(false);
//     setFormData({});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const entity = formType === 'user' ? 'users' : formType + 's';
//     const url = `${API_BASE}/${entity}${formMode === 'edit' ? `/${formData.id}` : ''}`;
//     const method = formMode === 'edit' ? 'PUT' : 'POST';

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) throw new Error('Failed to save data');
//       await fetchData(entity);
//       closeForm();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleDelete = async (type, id) => {
//     if (!window.confirm('Are you sure you want to delete this record?')) return;
//     try {
//       const entity = type === 'user' ? 'users' : type + 's';
//       const res = await fetch(`${API_BASE}/${entity}/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('Failed to delete');
//       await fetchData(entity);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const renderRows = (list, type) => {
//     return list.map(item => (
//       <tr key={item.id}>
//         <td>{item.id}</td>
//         <td>{item.name || item.email || item.designation || 'N/A'}</td>
//         {type === 'users' && <td>{item.role}</td>}
//         <td>
//           <button className="btn" onClick={() => openForm(type.slice(0, -1), 'edit', item)}>Edit</button>
//           <button className="btn btn-delete" onClick={() => handleDelete(type.slice(0, -1), item.id)}>Delete</button>
//         </td>
//       </tr>
//     ));
//   };

//   const reportChartData = {
//     labels: reportsData?.months || [],
//     datasets: [
//       {
//         label: 'Patients Registered',
//         data: reportsData?.patients || [],
//         backgroundColor: 'rgba(75,192,192,0.6)',
//       },
//       {
//         label: 'Appointments',
//         data: reportsData?.appointments || [],
//         backgroundColor: 'rgba(153,102,255,0.6)',
//       },
//     ],
//   };

//   const reportOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Monthly Hospital Report' },
//     },
//   };

//   let currentData = [];
//   let totalPages = 1;
//   switch (activeTab) {
//     case 'doctors': ({paged: currentData, totalPages} = paginatedData(doctors)); break;
//     case 'patients': ({paged: currentData, totalPages} = paginatedData(patients)); break;
//     case 'staff': ({paged: currentData, totalPages} = paginatedData(staff)); break;
//     case 'users': ({paged: currentData, totalPages} = paginatedData(users)); break;
//     default: break;
//   }

//   return (
//     <div className="admin-dashboard">
//       <header>
//         <h2>Admin Dashboard</h2>
//         <p>Welcome, {user?.name} ({user?.email})</p>
//       </header>

//       <nav>
//         <button className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>Manage Doctors</button>
//         <button className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>Manage Patients</button>
//         <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>Manage Staff</button>
//         <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Manage Users</button>
//         <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>View Reports</button>
//       </nav>

//       <section className="content">
//         {loading && <p>Loading...</p>}
//         {error && <p className="error">Error: {error}</p>}

//         {activeTab !== 'reports' && !loading && (
//           <>
//             <div className="list-controls">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
//               />
//               <button className="btn btn-add" onClick={() => openForm(activeTab.slice(0, -1), 'create')}>
//                 Add New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
//               </button>
//             </div>

//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name / Email / Designation</th>
//                   {activeTab === 'users' && <th>Role</th>}
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentData.length === 0 ? (
//                   <tr><td colSpan={activeTab === 'users' ? 4 : 3}>No records found</td></tr>
//                 ) : (
//                   renderRows(currentData, activeTab)
//                 )}
//               </tbody>
//             </table>

//             <div className="pagination">
//               <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
//               <span>Page {page} of {totalPages}</span>
//               <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
//             </div>
//           </>
//         )}

//         {activeTab === 'reports' && reportsData && (
//           <div className="reports-section">
//             <Bar data={reportChartData} options={reportOptions} />
//           </div>
//         )}

//         {formOpen && (
//           <div className="modal">
//             <div className="modal-content">
//               <h3>{formMode === 'create' ? 'Add New' : 'Edit'} {formType.charAt(0).toUpperCase() + formType.slice(1)}</h3>
//               <form onSubmit={handleSubmit}>

//                 {(formType === 'doctor' || formType === 'staff' || formType === 'user' || formType === 'patient') && (
//                   <>
//                     {formType !== 'user' && (
//                       <div className="form-group">
//                         <label>Name:</label>
//                         <input
//                           name="name"
//                           type="text"
//                           value={formData.name || ''}
//                           onChange={handleFormChange}
//                           required
//                         />
//                       </div>
//                     )}

//                     {formType === 'user' && (
//                       <>
//                         <div className="form-group">
//                           <label>Name:</label>
//                           <input
//                             name="name"
//                             type="text"
//                             value={formData.name || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Email:</label>
//                           <input
//                             name="email"
//                             type="email"
//                             value={formData.email || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Password:</label>
//                           <input
//                             name="password"
//                             type="password"
//                             value={formData.password || ''}
//                             onChange={handleFormChange}
//                             required={formMode === 'create'}
//                             placeholder={formMode === 'edit' ? 'Leave blank to keep unchanged' : ''}
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Phone:</label>
//                           <input
//                             name="phone"
//                             type="text"
//                             value={formData.phone || ''}
//                             onChange={handleFormChange}
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Role:</label>
//                           <select
//                             name="role"
//                             value={formData.role || ''}
//                             onChange={handleFormChange}
//                             required
//                           >
//                             <option value="">Select Role</option>
//                             <option value="DOCTOR">Doctor</option>
//                             <option value="PATIENT">Patient</option>
//                             <option value="STAFF">Staff</option>
//                             <option value="ADMIN">Admin</option>
//                           </select>
//                         </div>
//                       </>
//                     )}

//                     {(formType === 'doctor' || formType === 'staff') && (
//                       <>
//                         <div className="form-group">
//                           <label>User ID:</label>
//                           <input
//                             name="user_id"
//                             type="text"
//                             value={formData.user_id || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Branch ID:</label>
//                           <input
//                             name="branch_id"
//                             type="text"
//                             value={formData.branch_id || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                       </>
//                     )}

//                     {formType === 'doctor' && (
//                       <>
//                         <div className="form-group">
//                           <label>License Number:</label>
//                           <input
//                             name="license_number"
//                             type="text"
//                             value={formData.license_number || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Experience Years:</label>
//                           <input
//                             name="experience_years"
//                             type="number"
//                             min="0"
//                             value={formData.experience_years || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Available Hours:</label>
//                           <input
//                             name="available_hours"
//                             type="text"
//                             value={formData.available_hours || ''}
//                             onChange={handleFormChange}
//                             placeholder="e.g. 9:00-17:00"
//                             required
//                           />
//                         </div>
//                       </>
//                     )}

//                     {formType === 'patient' && (
//                       <>
//                         <div className="form-group">
//                           <label>Date of Birth:</label>
//                           <input
//                             name="dob"
//                             type="date"
//                             value={formData.dob || ''}
//                             onChange={handleFormChange}
//                             required
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Gender:</label>
//                           <select
//                             name="gender"
//                             value={formData.gender || ''}
//                             onChange={handleFormChange}
//                             required
//                           >
//                             <option value="">Select Gender</option>
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                             <option value="Other">Other</option>
//                           </select>
//                         </div>
//                         <div className="form-group">
//                           <label>Blood Type:</label>
//                           <input
//                             name="blood_type"
//                             type="text"
//                             value={formData.blood_type || ''}
//                             onChange={handleFormChange}
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Address:</label>
//                           <input
//                             name="address"
//                             type="text"
//                             value={formData.address || ''}
//                             onChange={handleFormChange}
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Emergency Contact:</label>
//                           <input
//                             name="emergency_contact"
//                             type="text"
//                             value={formData.emergency_contact || ''}
//                             onChange={handleFormChange}
//                           />
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}

//                 <div className="form-actions">
//                   <button type="submit" className="btn btn-save">Save</button>
//                   <button type="button" className="btn btn-cancel" onClick={closeForm}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </section>
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
  const itemsPerPage = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [reportsData, setReportsData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const sortData = (list) => {
    return [...list].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  };

  const paginatedData = (list) => {
    const filtered = filterData(list);
    const sorted = sortData(filtered);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paged = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    return { paged, totalPages, total: sorted.length };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
    setLoading(true);

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
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    try {
      const entity = type === 'user' ? 'users' : type + 's';
      const res = await fetch(`${API_BASE}/${entity}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchData(entity);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const statusClass = status ? 'adm-badge--success' : 'adm-badge--danger';
    return <span className={`adm-badge ${statusClass}`}>{status ? 'Active' : 'Inactive'}</span>;
  };

  const renderRows = (list, type) => {
    return list.map(item => (
      <tr key={item.id} className="adm-table__row">
        <td className="adm-table__cell">{item.id}</td>
        <td className="adm-table__cell adm-table__cell--primary">
          {item.name || item.email || item.designation || 'N/A'}
        </td>
        {type === 'users' && <td className="adm-table__cell">{item.role}</td>}
        {type === 'doctors' && <td className="adm-table__cell">{item.experience_years || 0} years</td>}
        {type === 'patients' && <td className="adm-table__cell">{item.blood_type || 'N/A'}</td>}
        <td className="adm-table__cell">
          {getStatusBadge(item.active !== false)}
        </td>
        <td className="adm-table__cell adm-table__cell--actions">
          <button 
            className="adm-btn adm-btn--small adm-btn--secondary" 
            onClick={() => openForm(type.slice(0, -1), 'edit', item)}
          >
            Edit
          </button>
          <button 
            className="adm-btn adm-btn--small adm-btn--danger" 
            onClick={() => handleDelete(type.slice(0, -1), item.id)}
          >
            Delete
          </button>
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
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Appointments',
        data: reportsData?.appointments || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const reportOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: { 
        display: true, 
        text: 'Monthly Hospital Analytics',
        font: { size: 18, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getEntityStats = () => {
    return {
      doctors: doctors.length,
      patients: patients.length,
      staff: staff.length,
      users: users.length,
    };
  };

  const stats = getEntityStats();

  let currentData = [];
  let totalPages = 1;
  let totalItems = 0;
  switch (activeTab) {
    case 'doctors': ({paged: currentData, totalPages, total: totalItems} = paginatedData(doctors)); break;
    case 'patients': ({paged: currentData, totalPages, total: totalItems} = paginatedData(patients)); break;
    case 'staff': ({paged: currentData, totalPages, total: totalItems} = paginatedData(staff)); break;
    case 'users': ({paged: currentData, totalPages, total: totalItems} = paginatedData(users)); break;
    default: break;
  }

  return (
    <div className="adm-dashboard">
      <div className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar--open' : ''}`}>
        <div className="adm-sidebar__header">
          <h2 className="adm-sidebar__title">Admin Panel</h2>
          <button 
            className="adm-sidebar__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
        
        <div className="adm-sidebar__stats">
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.doctors}</div>
            <div className="adm-stat-card__label">Doctors</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.patients}</div>
            <div className="adm-stat-card__label">Patients</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.staff}</div>
            <div className="adm-stat-card__label">Staff</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-card__number">{stats.users}</div>
            <div className="adm-stat-card__label">Users</div>
          </div>
        </div>

        <nav className="adm-sidebar__nav">
          <button 
            className={`adm-nav-btn ${activeTab === 'doctors' ? 'adm-nav-btn--active' : ''}`} 
            onClick={() => setActiveTab('doctors')}
          >
            👨‍⚕️ Manage Doctors
          </button>
          <button 
            className={`adm-nav-btn ${activeTab === 'patients' ? 'adm-nav-btn--active' : ''}`} 
            onClick={() => setActiveTab('patients')}
          >
            👥 Manage Patients
          </button>
          <button 
            className={`adm-nav-btn ${activeTab === 'staff' ? 'adm-nav-btn--active' : ''}`} 
            onClick={() => setActiveTab('staff')}
          >
            👨‍💼 Manage Staff
          </button>
          <button 
            className={`adm-nav-btn ${activeTab === 'users' ? 'adm-nav-btn--active' : ''}`} 
            onClick={() => setActiveTab('users')}
          >
            👤 Manage Users
          </button>
          <button 
            className={`adm-nav-btn ${activeTab === 'reports' ? 'adm-nav-btn--active' : ''}`} 
            onClick={() => setActiveTab('reports')}
          >
            📊 View Reports
          </button>
        </nav>
      </div>

      <div className="adm-main">
        <header className="adm-header">
          <button 
            className="adm-mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="adm-header__title">
            <h1>Hospital Management System</h1>
            <p>Welcome back, <strong>{user?.name}</strong> ({user?.email})</p>
          </div>
          <div className="adm-header__user">
            <div className="adm-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="adm-content">
          {loading && (
            <div className="adm-loading">
              <div className="adm-loading__spinner"></div>
              <p>Loading...</p>
            </div>
          )}
          
          {error && (
            <div className="adm-alert adm-alert--error">
              <span>⚠️ Error: {error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {activeTab !== 'reports' && !loading && (
            <div className="adm-data-section">
              <div className="adm-data-header">
                <h2 className="adm-data-title">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h2>
                <div className="adm-data-actions">
                  <div className="adm-search-box">
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                      className="adm-search-input"
                    />
                  </div>
                  <button 
                    className="adm-btn adm-btn--primary" 
                    onClick={() => openForm(activeTab.slice(0, -1), 'create')}
                  >
                    + Add New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                  </button>
                </div>
              </div>

              <div className="adm-table-container">
                <table className="adm-table">
                  <thead className="adm-table__head">
                    <tr>
                      <th className="adm-table__header" onClick={() => handleSort('id')}>
                        ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="adm-table__header" onClick={() => handleSort('name')}>
                        Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      {activeTab === 'users' && <th className="adm-table__header">Role</th>}
                      {activeTab === 'doctors' && <th className="adm-table__header">Experience</th>}
                      {activeTab === 'patients' && <th className="adm-table__header">Blood Type</th>}
                      <th className="adm-table__header">Status</th>
                      <th className="adm-table__header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="adm-table__body">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="adm-table__empty">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      renderRows(currentData, activeTab)
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adm-pagination">
                <div className="adm-pagination__info">
                  Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, totalItems)} of {totalItems} entries
                </div>
                <div className="adm-pagination__controls">
                  <button 
                    className="adm-btn adm-btn--outline" 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="adm-pagination__current">
                    Page {page} of {totalPages}
                  </span>
                  <button 
                    className="adm-btn adm-btn--outline" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && reportsData && (
            <div className="adm-reports">
              <div className="adm-reports__header">
                <h2>Analytics Dashboard</h2>
                <p>Monthly performance overview</p>
              </div>
              <div className="adm-chart-container">
                <Bar data={reportChartData} options={reportOptions} />
              </div>
            </div>
          )}
        </main>
      </div>

      {formOpen && (
        <div className="adm-modal">
          <div className="adm-modal__backdrop" onClick={closeForm}></div>
          <div className="adm-modal__content">
            <div className="adm-modal__header">
              <h3>
                {formMode === 'create' ? 'Add New' : 'Edit'} {formType.charAt(0).toUpperCase() + formType.slice(1)}
              </h3>
              <button className="adm-modal__close" onClick={closeForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="adm-form">
              <div className="adm-form__body">
                {(formType === 'doctor' || formType === 'staff' || formType === 'user' || formType === 'patient') && (
                  <>
                    <div className="adm-form__group">
                      <label className="adm-form__label">Name</label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        required
                        className="adm-form__input"
                      />
                    </div>

                    {formType === 'user' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Password</label>
                          <input
                            name="password"
                            type="password"
                            value={formData.password || ''}
                            onChange={handleFormChange}
                            required={formMode === 'create'}
                            placeholder={formMode === 'edit' ? 'Leave blank to keep unchanged' : ''}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Phone</label>
                          <input
                            name="phone"
                            type="text"
                            value={formData.phone || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Role</label>
                          <select
                            name="role"
                            value={formData.role || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
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
                        <div className="adm-form__group">
                          <label className="adm-form__label">User ID</label>
                          <input
                            name="user_id"
                            type="text"
                            value={formData.user_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Branch ID</label>
                          <input
                            name="branch_id"
                            type="text"
                            value={formData.branch_id || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'doctor' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">License Number</label>
                          <input
                            name="license_number"
                            type="text"
                            value={formData.license_number || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Experience Years</label>
                          <input
                            name="experience_years"
                            type="number"
                            min="0"
                            value={formData.experience_years || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Available Hours</label>
                          <input
                            name="available_hours"
                            type="text"
                            value={formData.available_hours || ''}
                            onChange={handleFormChange}
                            placeholder="e.g. 9:00-17:00"
                            required
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}

                    {formType === 'patient' && (
                      <>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Date of Birth</label>
                          <input
                            name="dob"
                            type="date"
                            value={formData.dob || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleFormChange}
                            required
                            className="adm-form__select"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Blood Type</label>
                          <input
                            name="blood_type"
                            type="text"
                            value={formData.blood_type || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Address</label>
                          <input
                            name="address"
                            type="text"
                            value={formData.address || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                        <div className="adm-form__group">
                          <label className="adm-form__label">Emergency Contact</label>
                          <input
                            name="emergency_contact"
                            type="text"
                            value={formData.emergency_contact || ''}
                            onChange={handleFormChange}
                            className="adm-form__input"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="adm-form__footer">
                <button type="button" className="adm-btn adm-btn--secondary" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn--primary">
                  {formMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;