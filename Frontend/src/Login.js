import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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
        const { role } = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));

        if (role === 'patient') navigate('/patient-dashboard');
        else if (role === 'doctor') navigate('/doctor-dashboard');
        else if (role === 'admin') navigate('/admin-dashboard');
        else alert('Unknown user role');
      })
      .catch(err => {
        setError(err.message);
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p>Please log in to continue</p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-link">
          Don’t have an account? <span onClick={() => navigate('/signup')}>Create one</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
