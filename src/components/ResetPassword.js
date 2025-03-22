// src/ResetPassword.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { resetPassword } from '../auth';

function ResetPassword({ onClose }) {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async () => {
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset email sent successfully.');
    } catch (error) {
      setError('Failed to send password reset email.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-3 mb-5 bg-white rounded">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Reset Password</h2>
          <form>
            <div className="form-group mb-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="button" className="btn btn-success w-100 mb-3" onClick={handleReset}>Reset Password</button>
            <button type="button" className="btn btn-secondary w-100" onClick={onClose}>Back to Login</button>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
