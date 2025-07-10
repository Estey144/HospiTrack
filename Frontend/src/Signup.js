// import React, { useState } from 'react';
// import './Signup.css';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     dob: '',
//     gender: '',
//     blood_type: '',
//     address: '',
//     emergency_contact: ''
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Payload matches backend PatientSignupRequest structure
//     const payload = {
//       user: {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         phone: form.phone,
//         role: 'patient'
//       },
//       patient: {
//         dob: form.dob,
//         gender: form.gender,
//         bloodType: form.blood_type,         // camelCase - adjust if backend expects underscore
//         address: form.address,
//         emergencyContact: form.emergency_contact  // camelCase - adjust if backend expects underscore
//       }
//     };

//     try {
//       const res = await fetch('http://localhost:8080/api/signup/patient', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (res.ok) {
//         alert('Account created successfully!');
//         navigate('/login');
//       } else {
//         const errorText = await res.text();
//         alert(`Signup failed: ${res.status} - ${errorText}`);
//         console.error('Signup failed:', res.status, errorText);
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       alert('Server error during signup.');
//     }
//   };

//   return (
//     <div className="signup-page">
//       <div className="signup-container">
//         <h2>Create Patient Account</h2>
//         <form onSubmit={handleSubmit}>
//           <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
//           <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
//           <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
//           <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required />
//           <select name="gender" value={form.gender} onChange={handleChange} required>
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           <input name="blood_type" placeholder="Blood Type (e.g. A+)" value={form.blood_type} onChange={handleChange} required />
//           <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
//           <input name="emergency_contact" placeholder="Emergency Contact" value={form.emergency_contact} onChange={handleChange} required />
//           <button type="submit" className="signup-btn">Sign Up</button>
//         </form>
//         <p className="login-link">
//           Already have an account?{' '}
//           <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
//             Login here
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    blood_type: '',
    address: '',
    emergency_contact: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload matches backend PatientSignupRequest structure
    const payload = {
      user: {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: 'patient'
      },
      patient: {
        dob: form.dob,
        gender: form.gender,
        bloodType: form.blood_type,         // camelCase - adjust if backend expects underscore
        address: form.address,
        emergencyContact: form.emergency_contact  // camelCase - adjust if backend expects underscore
      }
    };

    try {
      const res = await fetch('http://localhost:8080/api/signup/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Account created successfully!');
        navigate('/login');
      } else {
        const errorText = await res.text();
        alert(`Signup failed: ${res.status} - ${errorText}`);
        console.error('Signup failed:', res.status, errorText);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error during signup.');
    }
  };

  return (
    <div className="patient-signup-page">
      <div className="patient-signup-wrapper">
        <div className="patient-signup-container">
          <div className="patient-signup-header">
            <div className="patient-signup-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9L21 9ZM3 7V9L9 9V7.5L3 7ZM9 10H15L13.5 22H10.5L9 10Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="patient-signup-title">Create Patient Account</h2>
            <p className="patient-signup-subtitle">Join our healthcare platform to manage your appointments</p>
          </div>
          
          <form onSubmit={handleSubmit} className="patient-signup-form">
            <div className="patient-signup-form-grid">
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Full Name</label>
                <input 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Create a secure password" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Phone Number</label>
                <input 
                  name="phone" 
                  placeholder="Enter your phone number" 
                  value={form.phone} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob" 
                  value={form.dob} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Gender</label>
                <select 
                  name="gender" 
                  value={form.gender} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="patient-signup-input-group">
                <label className="patient-signup-label">Blood Type</label>
                <input 
                  name="blood_type" 
                  placeholder="e.g., A+, B-, O+" 
                  value={form.blood_type} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group patient-signup-full-width">
                <label className="patient-signup-label">Address</label>
                <input 
                  name="address" 
                  placeholder="Enter your full address" 
                  value={form.address} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
              
              <div className="patient-signup-input-group patient-signup-full-width">
                <label className="patient-signup-label">Emergency Contact</label>
                <input 
                  name="emergency_contact" 
                  placeholder="Emergency contact name and phone" 
                  value={form.emergency_contact} 
                  onChange={handleChange} 
                  required 
                  className="patient-signup-input"
                />
              </div>
            </div>
            
            <button type="submit" className="patient-signup-btn">
              <span>Create Account</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L19 7L17.7 13.74L22 15.27L18.5 19.5L15.27 22L13.74 17.7L7 19L8.26 13.09L2 12L8.26 10.91L7 5L13.74 6.3L15.27 2L19.5 5.5L22 8.73L17.7 10.26L19 15L13.09 15.74L12 22L10.91 15.74L5 17L6.3 10.26L2 8.73L5.5 4.5L8.73 2L10.26 6.3L15 5L13.74 10.91L19 12L13.09 13.09L15 19L8.26 17.7L7 22L4.5 18.5L2 15.27L6.3 13.74L5 7L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </button>
          </form>
          
          <div className="patient-signup-footer">
            <p className="patient-signup-login-text">
              Already have an account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                className="patient-signup-login-link"
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;