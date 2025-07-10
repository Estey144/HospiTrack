// import React, { useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setUser }) => {  // Accept setUser here
  
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError(''); // Clear error on input
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     fetch('http://localhost:8080/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     })
//       .then(res => {
//         if (!res.ok) throw new Error('Invalid email or password');
//         return res.json();
//       })
//       .then(data => {
//         const role = data.user.role.trim().toLowerCase();

//         // Save user in localStorage
//         localStorage.setItem('user', JSON.stringify(data.user));

//         // Update user state in App component
//         setUser(data.user);

//         // if (role === 'patient') navigate('/patient-dashboard');
//         // else if (role === 'doctor') navigate('/doctor-dashboard');
//         // else if (role === 'admin') navigate('/admin-dashboard');
//         // else alert('Unknown user role');
//         navigate('/');

//       })
//       .catch(err => {
//         setError(err.message);
//       });
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2>Welcome Back</h2>
//         <p>Please log in to continue</p>

//         {error && <p className="error-msg">{error}</p>}

//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit" className="login-btn">Login</button>
//         </form>

//         <p className="signup-link">
//           Don’t have an account? <span onClick={() => navigate('/signup')}>Create one</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {  // Accept setUser here
  
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid email or password');
        return res.json();
      })
      .then(data => {
        const role = data.user.role.trim().toLowerCase();

        // Save user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update user state in App component
        setUser(data.user);

        if (role === 'patient') navigate('/patient-dashboard');
        else if (role === 'doctor') navigate('/doctor-dashboard');
        else if (role === 'admin') navigate('/admin-dashboard');
        else {
          console.error('Unknown user role:', role);
          alert('Unknown user role');
          navigate('/');
        }

      })
      .catch(err => {
        setError(err.message);
      });
  };

  return (
    <div className="auth-login-page">
      <div className="auth-login-background">
        <div className="auth-login-floating-shapes">
          <div className="auth-login-shape auth-login-shape-1"></div>
          <div className="auth-login-shape auth-login-shape-2"></div>
          <div className="auth-login-shape auth-login-shape-3"></div>
          <div className="auth-login-shape auth-login-shape-4"></div>
        </div>
      </div>
      
      <div className="auth-login-container">
        <div className="auth-login-card">
          <div className="auth-login-header">
            <div className="auth-login-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.11 3.89 21 5 21H11V19H5V3H13V9H21Z" fill="currentColor"/>
                <path d="M16 12V18H18V20H16C14.9 20 14 19.1 14 18V12H16Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="auth-login-title">Welcome Back</h2>
            <p className="auth-login-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="auth-login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-login-form">
            <div className="auth-login-input-group">
              <label htmlFor="email" className="auth-login-label">Email</label>
              <div className="auth-login-input-wrapper">
                <svg className="auth-login-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-login-input"
                  required
                />
              </div>
            </div>

            <div className="auth-login-input-group">
              <label htmlFor="password" className="auth-login-label">Password</label>
              <div className="auth-login-input-wrapper">
                <svg className="auth-login-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-login-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-login-btn">
              <span>Sign In</span>
              <svg className="auth-login-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
              </svg>
            </button>
          </form>

          <div className="auth-login-footer">
            <p className="auth-login-signup-text">
              Don't have an account? 
              <span onClick={() => navigate('/signup')} className="auth-login-signup-link">
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
