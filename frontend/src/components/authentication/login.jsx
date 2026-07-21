import React, { useState } from 'react';
import { loginUser } from '../../services/authApi';
import './login.css';

export default function Login({ onAuthSuccess, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      if (data.status !== 'success') {
        throw new Error(data.message || 'Mismatched credentials or failed system authentication.');
      }

     localStorage.setItem('token', data.token);

// 💡 SAVE FULL USER OBJECT (WITH ID) TO LOCALSTORAGE
const userToSave = {
    id: data.user?.id || data.id || 1,
    name: data.user?.name || data.username || email,
    email: data.user?.email || email,
    phone: data.user?.phone || ''
};

localStorage.setItem('currentUser', JSON.stringify(userToSave));

const profiles = JSON.parse(localStorage.getItem('userProfiles')) || {};
const normalizedKey = email.toLowerCase();
const profileFromLocal = profiles[normalizedKey] || Object.values(profiles).find(p => {
    return p.email?.toLowerCase() === normalizedKey || p.phone === email || p.secondaryPhone === email;
});

onAuthSuccess(profileFromLocal || userToSave);
    } catch (err) {
      setError(err.message || 'Server context unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card glassmorphism">
      <div className="auth-header">
        <h2>Green Circle</h2>
        <p>Secure Hyperlocal Sustainable Rental Marketplace</p>
      </div>
      
      {error && <div className="auth-error-banner">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email or Mobile Number</label>
          <input 
            type="text" 
            placeholder="name@domain.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-input-wrap">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Verifying Gateway...' : 'SIGN IN '}
        </button>
    
      </form>

      <div className="auth-footer">
        Don't have an account? <span onClick={switchToRegister} className="auth-link">Register here</span>
      </div>
      <div className="company-footer">
        © 2026 <span className="company-name">SR Tech Solutions</span>. All Rights Reserved.
      </div>
    </div>
    </div>
  );
}