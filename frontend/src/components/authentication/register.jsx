import React, { useState } from 'react';
import { registerUser } from '../../services/authApi';
import './register.css';

export default function Register({ onRegisterSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', secondaryPhone: '', password: '', city: '', state: '', photo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        latitude: 13.0012,
        longitude: 80.2565,
        profileImage: formData.photo || '',
      };
      const data = await registerUser(payload);

      if (data.status !== 'success') {
        throw new Error(data.message || 'Registration failed. Identity proof mismatched or fields invalid.');
      }

      alert('Account registered! Proceeding to platform interface gateway.');
      const userPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        secondaryPhone: formData.secondaryPhone || '',
        address: `${formData.city || ''}${formData.city && formData.state ? ', ' : ''}${formData.state || ''}`,
        photo: formData.photo || '',
      };
      onRegisterSuccess(userPayload);
    } catch (err) {
      setError(err.message || 'Network connection context interrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="auth-card glassmorphism">
        <div className="auth-header">
          <h2>Join Green Circle</h2>
          <p>Build your trusted hyperlocal share infrastructure profile</p>
        </div>

      {error && <div className="auth-error-banner">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="auth-form-scrollable">
        <div className="form-group">
          <label >Full Name</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Additional Phone (optional)</label>
          <input type="text" name="secondaryPhone" onChange={handleChange} placeholder="Secondary contact" />
        </div>
        <div className="form-group">
          <label>Secure Password</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              onChange={handleChange} 
              required 
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Photo URL (optional)</label>
          <input type="text" name="photo" onChange={handleChange} placeholder="https://..." />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Processing Legal Shield KYC...' : 'CREATE VERIFIED PROFILE'}
        </button>
      </form>

        <div className="auth-footer">
          Already registered? <span onClick={switchToLogin} className="auth-link">Sign in</span>
        </div>
        <div className="company-footer">
          © 2026 <span className="company-name">SR Tech Solutions</span>. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}