import React from 'react';
import Login from './authentication/login';
import Register from './authentication/register';
import './AuthFlow.css';

export default function AuthFlow({ authView, onAuthSuccess, onSwitchToLogin, onSwitchToRegister }) {
  return (
    <div className="modal-overlay auth-flow-overlay">
      {authView === 'login' ? (
        <Login onAuthSuccess={onAuthSuccess} switchToRegister={onSwitchToRegister} />
      ) : (
        <Register onRegisterSuccess={onAuthSuccess} switchToLogin={onSwitchToLogin} />
      )}
    </div>
  );
}
