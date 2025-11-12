import { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react';
import { authAPI } from './services/api';
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;

    if (name === 'phoneNumber') {
      // Remove non-digits and limit to 10 digits
      let cleaned = value.replace(/\D/g, '').slice(0, 10);
      // Prevent starting with 0
      if (cleaned.length > 0 && cleaned[0] === '0') {
        cleaned = cleaned.slice(1);
      }
      // Format as XXX XXX XXXX
      let formatted = '';
      if (cleaned.length <= 3) {
        formatted = cleaned;
      } else if (cleaned.length <= 6) {
        formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      } else {
        formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      processedValue = formatted;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    
    return newErrors;
  };

  const handleSubmit = async () => {
  const newErrors = validateForm();
  
  if (Object.keys(newErrors).length === 0) {
    try {
      const response = await authAPI.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role
      });
      
      console.log('Success:', response.data); // Debug log
      alert(`Account created successfully! Welcome ${response.data.email}`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: '',
        agreeTerms: false,
      });
    } catch (error) {
      console.error('Error:', error); // Debug log
      const errorMsg = error.response?.data || 'Registration failed. Please try again.';
      alert(errorMsg);
    }
  } else {
    alert('Please fix the errors in the form.');
    setErrors(newErrors);
  }
};

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">TeknoEats</h1>
          <div className="header-buttons">
            <a href="/signup" className="btn-signup">Sign Up</a>
            <a href="/login" className="btn-login">Log In</a>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="card-container">
          <div className="card">
            <h2 className="card-title">Create an account</h2>
            
            <div className="form-fields">
              {/* Name Fields - Side by Side */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className={`input-field ${errors.firstName ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                </div>
                
                <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className={`input-field ${errors.lastName ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email and Phone - Side by Side */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`input-field ${errors.email ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                
                <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Password and Confirm Password - Side by Side */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
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
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                
                <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="toggle-password"
                    >
                      {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Role - Full Width */}
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`input-field ${errors.role ? 'input-error' : ''}`}
                  >
                    <option value="">Select your role</option>
                    <option value="Customer">Customer</option>
                    <option value="Canteen Personnel">Canteen Personnel</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                {errors.role && <p className="error-message">{errors.role}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    I agree to the <a href="/terms" className="terms-link">Terms and Conditions</a>
                  </span>
                </label>
                {errors.agreeTerms && <p className="error-message">{errors.agreeTerms}</p>}
              </div>

              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
            </div>

            <p className="footer-text">
              Already have an account?{' '}
              <a href="/login" className="login-link">Log in</a>
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
          font-size: 1.875rem;
          font-weight: bold;
          color: #7f1d1d;
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
        }

        .btn-signup {
          background: white;
          color: #7f1d1d;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-login {
          background: transparent;
          color: #7f1d1d;
        }

        .btn-signup:hover {
          background: #f9fafb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .btn-login:hover {
          background: #ca8a04;
        }

        .main-content {
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card-container {
          width: 100%;
          max-width: 700px;
        }

        .card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
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
          margin-bottom: 2rem;
          color: #1a202c;
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
          border-radius: 8px;
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

        .submit-button {
          width: 100%;
          padding: 0.75rem 1rem;
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
          color: #6b7280;
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
        }

        .checkbox-group {
          margin-top: 0.5rem;
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

        .terms-link {
          color: #ca8a04;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .terms-link:hover {
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
        }
      `}</style>
    </div>
  );
}