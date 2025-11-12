import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import { authAPI } from './services/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // ✅ Initialize navigation hook

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await authAPI.login({
          username: formData.username,
          password: formData.password
        });
        
        console.log('Login success:', response.data);
        alert(`Welcome back, ${response.data.email || formData.username}!`);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // ✅ Redirect to homepage after successful login
        navigate('/home');

        setFormData({ username: '', password: '', rememberMe: false });
      } catch (error) {
        console.error('Login error:', error);
        const errorMsg = error.response?.data || 'Invalid credentials. Please try again.';
        alert(errorMsg);
      }
    } else {
      alert('Please fix the errors in the form.');
      setErrors(newErrors);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img src="/teknoeats-logo.png" alt="TeknoEats" className="logo" />
          <div className="header-buttons">
            <NavLink
              to="/signup"
              className={({ isActive }) => isActive ? "btn-signup active" : "btn-signup"}
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => isActive ? "btn-login active" : "btn-login"}
            >
              Log In
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="card-container">
          <div className="card">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">Log in to your TeknoEats account</p>
            
            <div className="form-fields">
              {/* Username Input */}
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username or Email"
                    className={`input-field ${errors.username ? 'input-error' : ''}`}
                  />
                </div>
                {errors.username && (
                  <p className="error-message">{errors.username}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="input-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`input-field ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                  >
                    {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="login-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button onClick={handleSubmit} className="submit-button">
                Log In
              </button>
            </div>

            {/* Footer Text */}
            <p className="footer-text">
              Don't have an account?{' '}
              <a href="/signup" className="login-link">Sign up</a>
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
        }

        .header {
          background: linear-gradient(to right, #facc15, #eab308);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 1rem 0;
          height: 80px;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          height: auto;
          width: 180px;
          margin: 0;
        }

        .header-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn-signup, .btn-login {
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          background: transparent;
          color: #7f1d1d;
        }

        .btn-signup.active, .btn-login.active {
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-signup:hover, .btn-login:hover {
          background: #f9fafb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        /* ... (rest of the CSS as in the original, copied below for completeness) */

        .main-content {
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
        }

        .card-container {
          width: 100%;
          max-width: 450px;
        }

        .card {
          background: white;
          border-radius: 1rem;
          padding: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .card-title {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 0.5rem;
          color: #1a202c;
        }

        .card-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          width: 20px;
          height: 20px;
          color: #9ca3af;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
        }

        .input-error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          margin-bottom: 0;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .toggle-password:hover {
          color: #4b5563;
        }

        .toggle-password .icon {
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #ca8a04;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: #4b5563;
        }

        .forgot-link {
          font-size: 0.875rem;
          color: #ca8a04;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #a16207;
          text-decoration: underline;
        }

        .submit-button {
          width: 100%;
          padding: 0.875rem 1rem;
          background: linear-gradient(to right, #991b1b, #7f1d1d);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .submit-button:hover {
          background: linear-gradient(to right, #7f1d1d, #450a0a);
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .submit-button:active {
          transform: scale(0.98);
        }

        .footer-text {
          text-align: center;
          margin-top: 1.5rem;
          color: #4b5563;
          font-size: 0.875rem;
        }

        .login-link {
          color: #ca8a04;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .login-link:hover {
          color: #a16207;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .card {
            padding: 1.5rem;
          }

          .card-title {
            font-size: 1.5rem;
          }

          .login-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
