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
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Patient Account</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
          <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required />
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input name="blood_type" placeholder="Blood Type (e.g. A+)" value={form.blood_type} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input name="emergency_contact" placeholder="Emergency Contact" value={form.emergency_contact} onChange={handleChange} required />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
