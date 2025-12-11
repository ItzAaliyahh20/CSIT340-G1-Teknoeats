import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './services/api';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoginActive, setIsLoginActive] = useState(true);

  const navigate = useNavigate();

  // Update switch state when component mounts or route changes
  React.useEffect(() => {
    setIsLoginActive(window.location.pathname === '/login/admin');
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Email is required';
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
        // First check hardcoded admin credentials
        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'admin123';

        if (formData.username === ADMIN_USERNAME && formData.password === ADMIN_PASSWORD) {
          // Create admin user object for hardcoded login
          const adminUser = {
            userId: 1,
            email: 'admin@teknoeats.com',
            firstName: 'System',
            lastName: 'Administrator',
            role: 'Admin'
          };

          // Save to localStorage
          localStorage.setItem('user', JSON.stringify(adminUser));

          alert(`Welcome back, System Administrator!`);

          // Redirect to admin dashboard
          navigate('/admin/dashboard');

          setFormData({ username: '', password: '' });
          return;
        }

        // If not hardcoded credentials, try database authentication
        const response = await authAPI.adminLogin({
          username: formData.username,
          password: formData.password
        });

        console.log('Admin login response:', response.data);
        let userData = response.data;

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to admin dashboard
        navigate('/admin/dashboard');

        setFormData({ username: '', password: '' });
      } catch (error) {
        console.error('Admin login error:', error);

        // Properly extract error message from response
        let errorMessage = 'Invalid admin credentials. Access denied.';
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }

        setLoginError(errorMessage);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img src="/teknoeats-logo.png" alt="TeknoEats" className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
          <div className="header-buttons">
            <div className="switch-container">
              <button
                className={`switch-option ${!isLoginActive ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginActive(false);
                  navigate('/signup');
                }}
              >
                Admin
              </button>
              <button
                className={`switch-option ${isLoginActive ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginActive(true);
                  navigate('/login');
                }}
              >
                Customer
              </button>
              <div className={`switch-slider ${isLoginActive ? 'login-active' : 'signup-active'}`}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-bg-elements">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>
        <div className="card-container">
          <div className="card">
            <div className="flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600 mr-2" />
              <h2 className="card-title">ADMIN ACCESS</h2>
              <Shield className="w-8 h-8 text-red-600 ml-2" />
            </div>
            <p className="card-subtitle">Authorized personnel only.</p>

            <div className="form-fields">
              {loginError && (
                <div className="login-error-message">
                  {loginError}
                </div>
              )}
              {/* Username Input */}
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Admin Email"
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
                    placeholder="Admin Password"
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


              {/* Submit Button */}
              <button onClick={handleSubmit} className="submit-button">
                Log In
              </button>
            </div>

            {/* Footer Text */}
            <p className="footer-text">
              Not an admin?{' '}
              <a href="/login" className="login-link">Customer Log in</a>
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .app-container {
          min-height: 100vh;
          background:
            linear-gradient(-45deg, #f9fafb, #ffffff, #f3f4f6, #f9fafb);
          background-size: 400% 400%, 400% 400%, 400% 400%, 400% 400%;
          animation: gradientShift 15s ease infinite, floatingParticles 20s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .app-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 50% 50%, rgba(185, 28, 28, 0.02) 0%, transparent 25%);
          animation: particleFloat 25s ease-in-out infinite;
          pointer-events: none;
        }

        .header {
          background: linear-gradient(to right, #dc2626, #b91c1c);
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
          position: relative;
        }

        .logo {
          height: auto;
          width: 180px;
          margin: 0;
        }

        .header-buttons {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #fecaca;
        }

        .switch-container {
          position: relative;
          display: flex;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 2px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          width: 180px;
        }

        .switch-option {
          padding: 0.5rem;
          border-radius: 23px;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s ease;
          cursor: pointer;
          color: #ffffff;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
        }

        .switch-option.active {
          color: #dc2626;
        }

        .switch-option:hover {
          color: #fecaca;
        }

        .switch-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: calc(50% - 2px);
          height: calc(100% - 4px);
          background: white;
          border-radius: 21px;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .switch-slider.login-active {
          transform: translateX(100%);
        }

        .switch-slider.signup-active {
          transform: translateX(0);
        }

        /* ... (rest of the CSS as in the original, copied below for completeness) */

        .main-content {
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          position: relative;
        }

        .hero-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          backdrop-filter: blur(40px);
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          animation: floatShape1 8s ease-in-out infinite;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: 10%;
          animation: floatShape2 10s ease-in-out infinite;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: 20%;
          animation: floatShape3 12s ease-in-out infinite;
        }

        .card-container {
          width: 100%;
          max-width: 450px;
        }

        .card {
          background: #ffffff;
          border-radius: 1rem;
          padding: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(239, 68, 68, 0.1);
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent);
          animation: cardShimmer 3s ease-in-out infinite;
          pointer-events: none;
        }

        .card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .card-title {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          font-family: 'Marykate', sans-serif;
          color: #dc2626;
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
          gap: 1rem;
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
          background-color: #ffffff;
        }

        .input-field:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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

        .login-error-message {
          background-color: #fef2f2;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          text-align: center;
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

        .submit-button {
          width: 100%;
          padding: 0.875rem 1rem;
          background: linear-gradient(to bottom right, #dc2626, #b91c1c);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          background: linear-gradient(to bottom right, #dc2626, #991b1b);
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .submit-button:active {
          transform: scale(0.98);
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .submit-button:hover .button-glow {
          left: 100%;
        }

        .footer-text {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .login-link {
          color: #dc2626;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .login-link:hover {
          color: #b91c1c;
          text-decoration: underline;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes cardShimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(100%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes floatingParticles {
          0%, 100% {
            background-position: 0% 0%, 0% 0%, 0% 0%, 0% 50%;
          }
          25% {
            background-position: 100% 100%, 100% 100%, 100% 100%, 100% 50%;
          }
          50% {
            background-position: 0% 100%, 0% 100%, 0% 100%, 0% 50%;
          }
          75% {
            background-position: 100% 0%, 100% 0%, 100% 0%, 100% 50%;
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
            opacity: 0.5;
          }
        }

        @keyframes floatShape1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          33% {
            transform: translateY(-30px) translateX(20px) scale(1.1);
          }
          66% {
            transform: translateY(-15px) translateX(-10px) scale(0.9);
          }
        }

        @keyframes floatShape2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) translateX(-15px) scale(1.2);
          }
        }

        @keyframes floatShape3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% {
            transform: translateY(-20px) translateX(25px) scale(0.8);
          }
          75% {
            transform: translateY(-35px) translateX(-5px) scale(1.1);
          }
        }

        @media (max-width: 768px) {
          .header-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-links {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .card {
            padding: 1.5rem;
          }

          .card-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}