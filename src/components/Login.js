// src/Login.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import ResetPassword from './ResetPassword'; // Import ResetPassword component

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false); // State to control visibility of ResetPassword component

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Call callback on successful login
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleResetPasswordClick = () => {
    setShowResetPassword(true); // Show ResetPassword component when button is clicked
  };

  const handleResetPasswordClose = () => {
    setShowResetPassword(false); // Hide ResetPassword component when done
  };

  return (
    <div>
      {showResetPassword ? (
        // Display ResetPassword component when showResetPassword is true
        <ResetPassword onClose={handleResetPasswordClose} />
      ) : (
        // Display Login form when showResetPassword is false
        <form onSubmit={handleLogin} className="container mt-5">
          <div className="card shadow p-3 mb-5 bg-white rounded">
            <div className="card-body other-color">
              <h2 className="card-title text-center mb-4">Login</h2>
              <div className="form-group mb-3">
                <label className="form-label">Email:</label>
                <input type="email" className="form-control orderLogin" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Password:</label>
                <input type="password" className="form-control orderLogin" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-success w-100 mb-3 myButton">Login</button>
              <button type="button" className="btn btn-primary w-100 forgotPassword" onClick={handleResetPasswordClick}>Forgot Password?</button>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
