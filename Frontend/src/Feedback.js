import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Feedback = () => {
  const [formData, setFormData] = useState({
    targetType: 'Hospital',
    targetId: '',
    targetName: '',
    rating: 0,
    category: '',
    comments: '',
  });
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
    
    // Fetch doctors and branches for selection
    fetchDoctorsAndBranches();
  }, []);

  const fetchDoctorsAndBranches = async () => {
    try {
      const [doctorsRes, branchesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/doctors`),
        axios.get(`${API_BASE_URL}/api/branches`)
      ]);
      setDoctors(doctorsRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Failed to fetch doctors/branches:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.targetType) newErrors.targetType = 'Please select feedback type';
    if (formData.targetType !== 'Hospital' && !formData.targetId) {
      newErrors.targetId = `Please select a ${formData.targetType.toLowerCase()}`;
    }
    if (!formData.rating || formData.rating === 0) newErrors.rating = 'Please provide a rating';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.comments.trim()) newErrors.comments = 'Please provide your feedback';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear target selection when type changes
    if (name === 'targetType') {
      setFormData(prev => ({ ...prev, targetId: '', targetName: '' }));
    }
    
    // Set target name when target ID changes
    if (name === 'targetId') {
      let targetName = '';
      if (formData.targetType === 'Doctor') {
        const doctor = doctors.find(d => d.id.toString() === value);
        targetName = doctor ? `Dr. ${doctor.name}` : '';
      } else if (formData.targetType === 'Branch') {
        const branch = branches.find(b => b.id.toString() === value);
        targetName = branch ? branch.name : '';
      }
      setFormData(prev => ({ ...prev, targetName }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const getRatingDescription = () => {
    const currentRating = hoverRating || formData.rating;
    const descriptions = {
      1: 'Poor - Very unsatisfied',
      2: 'Fair - Below expectations',
      3: 'Good - Meets expectations',
      4: 'Very Good - Above expectations',
      5: 'Excellent - Outstanding experience'
    };
    return descriptions[currentRating] || 'Please select a rating';
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('Please login to submit feedback.');
      setMessageType('error');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        patient_id: user.id,
        target_type: formData.targetType,
        target_id: formData.targetId || null,
        target_name: formData.targetName || 'Hospital',
        rating: formData.rating,
        category: formData.category,
        comments: formData.comments,
      });
      
      setMessage('Thank you for your valuable feedback! We appreciate your input.');
      setMessageType('success');
      
      // Reset form
      setFormData({ 
        targetType: 'Hospital', 
        targetId: '', 
        targetName: '',
        rating: 0, 
        category: '',
        comments: '' 
      });
      setErrors({});
      
    } catch (err) {
      setMessage('Failed to submit feedback. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackCategories = [
    { id: 'service', label: 'Service Quality', icon: '🏥' },
    { id: 'staff', label: 'Staff Behavior', icon: '👨‍⚕️' },
    { id: 'facilities', label: 'Facilities', icon: '🏢' },
    { id: 'cleanliness', label: 'Cleanliness', icon: '✨' },
    { id: 'waiting', label: 'Waiting Time', icon: '⏰' },
    { id: 'billing', label: 'Billing', icon: '💰' }
  ];

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h2>Share Your Experience</h2>
          <p className="feedback-subtitle">
            Your feedback helps us improve our services and provide better care
          </p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-form-section">
            <div className="feedback-form-row">
              <div className={`feedback-form-group required ${errors.targetType ? 'error' : ''}`}>
                <label>Feedback Type</label>
                <select 
                  name="targetType" 
                  value={formData.targetType} 
                  onChange={handleChange}
                  required
                >
                  <option value="Hospital">General Hospital Experience</option>
                  <option value="Doctor">Specific Doctor</option>
                  <option value="Branch">Hospital Branch</option>
                </select>
                {errors.targetType && <span className="feedback-form-error">{errors.targetType}</span>}
              </div>

              {formData.targetType === 'Doctor' && (
                <div className={`feedback-form-group required ${errors.targetId ? 'error' : ''}`}>
                  <label>Select Doctor</label>
                  <select
                    name="targetId"
                    value={formData.targetId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {errors.targetId && <span className="feedback-form-error">{errors.targetId}</span>}
                </div>
              )}

              {formData.targetType === 'Branch' && (
                <div className={`feedback-form-group required ${errors.targetId ? 'error' : ''}`}>
                  <label>Select Branch</label>
                  <select
                    name="targetId"
                    value={formData.targetId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} - {branch.location}
                      </option>
                    ))}
                  </select>
                  {errors.targetId && <span className="feedback-form-error">{errors.targetId}</span>}
                </div>
              )}
            </div>

            <div className={`feedback-rating-group ${errors.rating ? 'error' : ''}`}>
              <label className="feedback-rating-label">Overall Rating</label>
              <div className="feedback-rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`feedback-star ${star <= (hoverRating || formData.rating) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <div className={`feedback-rating-description ${(hoverRating || formData.rating) ? 'visible' : ''}`}>
                {getRatingDescription()}
              </div>
              {errors.rating && <span className="feedback-form-error">{errors.rating}</span>}
            </div>

            <div className={`feedback-form-group required ${errors.category ? 'error' : ''}`}>
              <label>Feedback Category</label>
              <div className="feedback-category-grid">
                {feedbackCategories.map(cat => (
                  <div
                    key={cat.id}
                    className={`feedback-category-item ${formData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span className="feedback-category-icon">{cat.icon}</span>
                    <span className="feedback-category-label">{cat.label}</span>
                  </div>
                ))}
              </div>
              {errors.category && <span className="feedback-form-error">{errors.category}</span>}
            </div>

            <div className={`feedback-form-group required ${errors.comments ? 'error' : ''}`}>
              <label>Your Feedback</label>
              <textarea
                name="comments"
                rows="5"
                placeholder="Please share your detailed experience, suggestions for improvement, or any concerns you may have..."
                value={formData.comments}
                onChange={handleChange}
                required
              />
              {errors.comments && <span className="feedback-form-error">{errors.comments}</span>}
            </div>

            <button 
              type="submit" 
              className={`feedback-submit-btn ${submitting ? 'loading' : ''}`}
              disabled={submitting}
            >
              {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
            </button>

            {message && (
              <div className={`feedback-message ${messageType}`}>
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;