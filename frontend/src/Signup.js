import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react';
import { authAPI } from './services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Update switch state when component mounts
  React.useEffect(() => {
    setIsLoginActive(false);
  }, []);

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]/.test(password),
    });
  };

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

    if (name === 'password') {
      checkPasswordStrength(value);
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
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (formData.phoneNumber.replace(/\D/g, '').length !== 10) newErrors.phoneNumber = 'Phone number is invalid';
    else {
      const digits = formData.phoneNumber.replace(/\D/g, '');
      if (digits.length !== 10) newErrors.phoneNumber = 'Phone number is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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

        console.log('Signup success:', response.data);

        // Create user object to save
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          id: response.data?.userId || Date.now().toString(),
          token: response.data?.token
        };

        // Save to localStorage immediately after signup
        localStorage.setItem('user', JSON.stringify(userData));

        // Also save to users list for admin management
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (!existingUsers.find(u => u.email === userData.email)) {
          existingUsers.push(userData);
          localStorage.setItem('users', JSON.stringify(existingUsers));
        }

        alert(`Account created successfully! Welcome ${userData.email}`);

        // Redirect based on role
        if (userData.role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'Canteen Personnel') {
          navigate('/canteen/dashboard');
        } else {
          navigate('/home');
        }

      } catch (error) {
        console.error('Signup error:', error);
        const errorMsg = error.response?.data || 'Registration failed. Please try again.';
        alert(errorMsg);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <img src="/teknoeats-logo.png" alt="TeknoEats" className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
          <div className="header-buttons">
            <div className="nav-links">
              <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/', { state: { scrollTo: 'features' } }); }}>Features</a>
              <a href="#footer" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/', { state: { scrollTo: 'footer' } }); }}>Contact</a>
            </div>
            <div className="switch-container">
              <button
                className={`switch-option ${!isLoginActive ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginActive(false);
                  navigate('/signup');
                }}
              >
                Sign Up
              </button>
              <button
                className={`switch-option ${isLoginActive ? 'active' : ''}`}
                onClick={() => {
                  setIsLoginActive(true);
                  navigate('/login');
                }}
              >
                Log In
              </button>
              <div className={`switch-slider ${isLoginActive ? 'login-active' : 'signup-active'}`}></div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-bg-elements">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>
        <div className="card-container">
          <div className="card">
            <h2 className="card-title">[ CREATE ACCOUNT ]</h2>
            <p className="card-subtitle">Skip the line and pounce on your favorites! :3</p>

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
                      className={`input-field ${errors.phoneNumber ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
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
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Password"
                      className={`input-field ${errors.password ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="toggle-password"
                    >
                      {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                    </button>
                  </div>
                  {errors.password && <p className="error-message">{errors.password}</p>}
                  {/* Password Strength Indicator */}
                  {passwordFocused && formData.password && (
                    <div className="password-strength">
                      <div className="strength-header">Password must include:</div>
                      <div className="strength-item">
                        <span className={passwordStrength.length ? 'strength-valid' : 'strength-invalid'}>{passwordStrength.length ? '( ✓ )' : '[ ✗ ]'}</span>
                        <span className={passwordStrength.length ? 'strength-text-valid' : 'strength-text-invalid'}>At least six characters</span>
                      </div>
                      <div className="strength-item">
                        <span className={passwordStrength.uppercase ? 'strength-valid' : 'strength-invalid'}>{passwordStrength.uppercase ? '( ✓ )' : '[ ✗ ]'}</span>
                        <span className={passwordStrength.uppercase ? 'strength-text-valid' : 'strength-text-invalid'}>At least one uppercase letter</span>
                      </div>
                      <div className="strength-item">
                        <span className={passwordStrength.lowercase ? 'strength-valid' : 'strength-invalid'}>{passwordStrength.lowercase ? '( ✓ )' : '[ ✗ ]'}</span>
                        <span className={passwordStrength.lowercase ? 'strength-text-valid' : 'strength-text-invalid'}>At least one lowercase letter</span>
                      </div>
                      <div className="strength-item">
                        <span className={passwordStrength.number ? 'strength-valid' : 'strength-invalid'}>{passwordStrength.number ? '( ✓ )' : '[ ✗ ]'}</span>
                        <span className={passwordStrength.number ? 'strength-text-valid' : 'strength-text-invalid'}>At least one number</span>
                      </div>
                      <div className="strength-item">
                        <span className={passwordStrength.special ? 'strength-valid' : 'strength-invalid'}>{passwordStrength.special ? '( ✓ )' : '[ ✗ ]'}</span>
                        <span className={passwordStrength.special ? 'strength-text-valid' : 'strength-text-invalid'}>At least one special character</span>
                      </div>
                    </div>
                  )}
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
                    I agree to the <span className="terms-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTermsModal(true); }}>Terms and Conditions</span>
                  </span>
                </label>
                {errors.agreeTerms && <p className="error-message">{errors.agreeTerms}</p>}
              </div>

              <button onClick={handleSubmit} className="submit-button">
                Sign Up
              </button>
            </div>

            <p className="footer-text">
              Already have an account?{' '}
              <a href="/login" className="login-link">Log in</a>
            </p>
          </div>
        </div>
      </main>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>TERMS AND CONDITIONS</h3>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="terms-content">
                <p>Welcome to TeknoEats, the official canteen ordering application for Cebu Institute of Technology - University (CIT-U). These Terms and Conditions ("Terms") govern your access to and use of the TeknoEats website and related services (collectively, the "Service").</p>
                <p>By accessing or using the Service, you agree to be bound by these Terms and the policies referenced herein. If you do not agree to these Terms, you may not use the Service.</p>

                <h4>1. User Eligibility and Scope</h4>
                <p><strong>1.1. Eligibility:</strong> The Service is intended exclusively for current students, faculty, and staff of Cebu Institute of Technology - University (CIT-U). Use of the app requires a valid and verifiable CIT-U identity.</p>
                <p><strong>1.2. Service Purpose:</strong> The Service is a digital platform that facilitates the ordering and payment for food and beverage items sold by authorized canteens located within the CIT-U campus (the "Vendors").</p>
                <p><strong>1.3. User Status Requirement:</strong> Use of the Service is strictly limited to individuals with bonafide status (current student, faculty, or staff) within CIT-U. There are no additional age restrictions on access or usage.</p>

                <h4>2. Ordering, Pricing, and Payment</h4>
                <p><strong>2.1. Order Placement:</strong> You agree that any order placed through TeknoEats constitutes a final commitment to purchase the selected items from the respective Vendor.</p>
                <p><strong>2.2. Pricing and Availability:</strong> Prices are set by the individual Vendors and are subject to change without prior notice. All orders are subject to the items' availability at the time the Vendor confirms the order.</p>
                <p><strong>2.3. Payment Methods:</strong> TeknoEats supports various payment methods as indicated in the app, which may include cash or digital payment options (e.g., integrated e-wallet, credit/debit card, etc.).</p>
                <p><strong>2.4. Payment Responsibility:</strong> You are solely responsible for ensuring that all payments are processed correctly.</p>

                <h4>3. Order Fulfilment and Responsibility</h4>
                <p><strong>3.1. Vendor Responsibility:</strong> The Vendors, not TeknoEats or CIT-U, are solely responsible for the quality, preparation, safety, and hygiene of the food and beverage items ordered. TeknoEats acts only as an intermediary platform.</p>
                <p><strong>3.2. Pickup:</strong> You are responsible for picking up your order from the designated Vendor location within the time frame specified by the app or the Vendor. Failure to pick up orders may lead to account suspension.</p>
                <p><strong>3.3. Accuracy:</strong> You must verify that the order received matches your placement details before leaving the pickup counter. Any discrepancies must be reported immediately to the Vendor staff.</p>

                <h4>4. User Conduct and Account Security</h4>
                <p><strong>4.1. Account Credentials:</strong> You are responsible for maintaining the confidentiality of your TeknoEats account and CIT-U login credentials. You are responsible for all activities that occur under your account.</p>
                <p><strong>4.2. Prohibited Conduct:</strong> You agree not to use the Service to:</p>
                <ul>
                  <li>Place fraudulent, false, or malicious orders.</li>
                  <li>Engage in any activity that harasses, abuses, or harms any other user, Vendor staff, or CIT-U personnel.</li>
                  <li>Attempt to disrupt, modify, or interfere with the functionality of the app or the ordering system.</li>
                </ul>
                <p><strong>4.3. Account Suspension:</strong> TeknoEats reserves the right, in consultation with the CIT-U Administration, to suspend or terminate your account immediately and without prior notice if you breach these Terms, particularly in cases involving fraud, misuse, or disrespect toward campus staff.</p>

                <h4>5. Intellectual Property</h4>
                <p><strong>5.1.</strong> All trademarks, logos, service marks, and copyrighted materials displayed on the TeknoEats app, including the "TeknoEats" name and CIT-U marks, are the property of CIT-U or its licensors and may not be used without prior written permission.</p>

                <h4>6. Disclaimers and Limitation of Liability</h4>
                <p><strong>6.1. "AS IS" Basis:</strong> The Service is provided on an "AS IS" and "AS AVAILABLE" basis. TeknoEats and CIT-U make no warranties, express or implied, regarding the service's continuous operation, accuracy, reliability, or freedom from errors.</p>
                <p><strong>6.2. Limitation of Liability:</strong> To the maximum extent permitted by law, TeknoEats and CIT-U shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the Service.</p>
                <p><strong>6.3. Food Quality:</strong> TeknoEats and CIT-U are not responsible for allergic reactions, food poisoning, or any adverse health effects resulting from food purchased from Vendors through the Service. All food-related concerns must be directed to the responsible Vendor.</p>

                <h4>7. Governing Law and Amendments</h4>
                <p><strong>7.1. Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines and the rules and regulations of the Cebu Institute of Technology - University.</p>
                <p><strong>7.2. Amendments:</strong> TeknoEats and CIT-U reserve the right to modify or replace these Terms at any time. We will notify users of material changes via the app or through official CIT-U channels. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>

                <h4>8. Contact Information</h4>
                <p>For technical support or questions regarding these Terms, please contact:</p>
                <p><strong>Email:</strong> francesaaliyah.maturan@cit.edu | trixieann.rentuma@cit.edu | andre.salonga@cit.edu</p>
                <p><strong>Phone:</strong> +63 917 123 4567</p>
                <p><strong>Address:</strong> Cebu Institute of Technology - University</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
            radial-gradient(circle at 25% 25%, rgba(250, 204, 21, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 75% 75%, rgba(234, 179, 8, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.02) 0%, transparent 25%);
          animation: particleFloat 25s ease-in-out infinite;
          pointer-events: none;
        }

        .header {
          background: linear-gradient(to right, #ffd700, #ffc107);
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

        .home-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #8b3a3a;
          transition: all 0.3s ease;
          position: absolute;
          left: 0;
          z-index: 10;
        }

        .home-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
          color: #7a3232;
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
          color: #8b3a3a;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #7a3232;
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
          font-size: 15px;
          transition: all 0.3s ease;
          cursor: pointer;
          color: #8b3a3a;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
        }

        .switch-option.active {
          color: #8b3a3a;
        }

        .switch-option:hover {
          color: #7a3232;
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
          background: rgba(250, 204, 21, 0.1);
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
          border: 1px solid rgba(250, 204, 21, 0.1);
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(250, 204, 21, 0.1), transparent);
          animation: cardShimmer 3s ease-in-out infinite;
          pointer-events: none;
        }

        .card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .card-title {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          font-family: 'Marykate', sans-serif;
          -webkit-text-stroke: 1px #8b3a3a;
          color: #ffd700;
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

        .input-field[type="text"], .input-field[type="email"], .input-field[type="tel"], .input-field[type="password"] {
          cursor: text;
        }

        .input-field[type="password"] {
          padding-right: 3rem;
        }

        .input-field[type="password"] + .toggle-password {
          right: 1rem;
        }

        .input-field.select-role {
          padding: 0.875rem 2.5rem 0.875rem 3rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
        }

        .input-field:focus {
          border-color: #ffd700;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
        }

        .input-field option {
          padding: 0.5rem;
          background-color: white;
          color: #1a202c;
        }

        .input-field:focus {
          border-color: #ffd700;
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
          padding: 0.875rem 1rem;
          background: linear-gradient(to bottom right, #7f1d1d, #7a3232);
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
          background: linear-gradient(to bottom right, #7f1d1d, #5c1616eb);
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .submit-button:active {
          transform: translateY(0);
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
          color: #e0a800df;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .login-link:hover {
          color: #ffc107;
          text-decoration: underline;
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
          accent-color: #ffc107;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: #4b5563;
        }

        .terms-link {
          color: #e0a800df;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .terms-link:hover {
          color: #ffc107;
          text-decoration: underline;
        }

        .password-strength {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          animation: fadeIn 0.3s ease-in-out;
        }

        .strength-header {
          font-size: 1.3rem;
          color: #8b3a3a;
          font-family: 'Marykate', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 0.5;
            transform: translateY(0);
          }
        }

        .strength-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .strength-valid {
          color: #e0a800df;
          font-weight: bold;
        }

        .strength-invalid {
          color: #9ca3af;
          font-weight: bold;
        }

        .strength-text-valid {
          color: #e0a800df;
          font-weight: bold;
        }

        .strength-text-invalid {
          color: #9ca3af;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(to bottom right, #7f1d1d, #5c1616eb);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: bold;
          color: white;
          font-family: 'Marykate', sans-serif;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: white;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .terms-content h4 {
          color: #1a202c;
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .terms-content h4:first-child {
          margin-top: 0;
        }

        .terms-content p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .terms-content ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .terms-content li {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
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

        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
            border-radius: 0;
          }

          .welcome-section {
            flex: none;
            min-height: 300px;
            padding: 2rem 1rem;
          }

          .welcome-title {
            font-size: 2.5rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
            max-width: 400px;
          }

          .welcome-features {
            flex-direction: row;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1.5rem;
          }

          .feature-item {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .form-section {
            flex: 1;
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 640px) {
          .welcome-section {
            padding: 1.5rem 1rem;
            min-height: 250px;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 0.9rem;
          }

          .welcome-features {
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
          }

          .feature-item {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .card {
            padding: 1.5rem;
            max-width: none;
          }

          .card-title {
            font-size: 1.8rem;
          }

          .modal-content {
            width: 95%;
            max-height: 90vh;
          }

          .modal-header {
            padding: 1rem;
          }

          .modal-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
