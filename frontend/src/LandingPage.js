import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoginActive, setIsLoginActive] = React.useState(false);

  // Handle scrolling to sections when URL has hash
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#footer') {
      setTimeout(() => {
        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (hash === '#features') {
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Ordering",
      description: "Skip the lines and order your favorite canteen items in seconds"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "CIT-U Exclusive",
      description: "Designed specifically for Cebu Institute of Technology - University community"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Assured",
      description: "Fresh, delicious food from trusted campus canteens"
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img src="/teknoeats-logo.png" alt="TeknoEats" className="logo" />
          <div className="header-buttons">
            <div className="nav-links">
              <a href="#features" className="nav-link" onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}>Features</a>
              <a href="#contact" className="nav-link" onClick={(e) => {
                e.preventDefault();
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
              }}>Contact</a>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">TeknoEats</span>
            </h1>
            <p className="hero-subtitle">
              Your digital canteen companion. Order delicious food from campus canteens
              without leaving your seat. Fast, fresh, and convenient!
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => navigate('/signup')}
                className="cta-button primary"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card-1">
                <div className="card-icon">🍕</div>
                <div className="card-text">Pizza</div>
              </div>
              <div className="card-2">
                <div className="card-icon">🍔</div>
                <div className="card-text">Burger</div>
              </div>
              <div className="card-3">
                <div className="card-icon">🥤</div>
                <div className="card-text">Smoothie</div>
              </div>
              <div className="card-4">
                <div className="card-icon">🍜</div>
                <div className="card-text">Noodles</div>
              </div>
              <div className="card-5">
                <div className="card-icon">🥗</div>
                <div className="card-text">Salad</div>
              </div>
              <div className="card-6">
                <div className="card-icon">☕</div>
                <div className="card-text">Coffee</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bg-elements">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose TeknoEats?</h2>
            <p className="section-subtitle">
              Experience the future of campus dining with our innovative platform
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30+</div>
              <div className="stat-label">Menu Items</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5★</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Ordering?</h2>
            <p className="cta-subtitle">
              Join thousands of CIT-U students who are already enjoying convenient campus dining
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/signup')}
                className="cta-button primary large"
              >
                Create Your Account
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/teknoeats-logo.png" alt="TeknoEats" className="footer-logo" />
              <p className="footer-tagline">Your Digital Canteen Companion</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
              <div className="footer-section">
                <h4>Contact Us</h4>
                <p style={{ color: '#a0aec0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  📧 Email: info@teknoeats.edu.ph
                </p>
                <p style={{ color: '#a0aec0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  📱 Phone: +63 917 123 4567
                </p>
                <p style={{ color: '#a0aec0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  📍 Address: Cebu Institute of Technology - University
                </p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 TeknoEats. Made for CIT-U Community.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% 80%, rgba(250, 204, 21, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(251, 191, 36, 0.05) 0%, transparent 50%),
            linear-gradient(-45deg, #f9fafb, #ffffff, #f3f4f6, #f9fafb);
          background-size: 400% 400%, 400% 400%, 400% 400%, 400% 400%;
          animation: gradientShift 15s ease infinite, floatingParticles 20s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .landing-page::before {
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

        /* Header Styles */
        .header {
          background: linear-gradient(to right, #facc15, #eab308);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 1rem 0;
          height: 80px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
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
          align-items: center;
          gap: 2rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #7f1d1d;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #450a0a;
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
          color: #7f1d1d;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
        }

        .switch-option.active {
          color: #7f1d1d;
        }

        .switch-option:hover {
          color: #450a0a;
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

        .switch-slider.signup-active {
          transform: translateX(0);
        }

        .switch-slider.login-active {
          transform: translateX(100%);
        }

        /* Hero Section */
        .hero-section {
          padding: 120px 2rem 80px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text {
          z-index: 2;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          color: #1a202c;
        }

        .brand-highlight {
          color: #facc15;
          -webkit-text-stroke: 1px #7f1d1d;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          max-width: 500px;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .cta-button.primary {
          background: linear-gradient(to right, #991b1b, #7f1d1d);
          color: white;
          border: none;
          box-shadow: 0 10px 25px rgba(127, 29, 29, 0.3);
        }

        .cta-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(127, 29, 29, 0.4);
        }

        .cta-button.secondary {
          background: white;
          color: #7f1d1d;
          border: 2px solid #facc15;
        }

        .cta-button.secondary:hover {
          background: #facc15;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(250, 204, 21, 0.3);
        }

        .hero-visual {
          position: relative;
          z-index: 2;
        }

        .floating-cards {
          position: relative;
          height: 400px;
        }

        .card-1, .card-2, .card-3, .card-4, .card-5, .card-6 {
          position: absolute;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: floatCard 6s ease-in-out infinite;
        }

        .card-1 {
          top: 5%;
          left: 5%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 35%;
          right: -5%;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 5%;
          left: 45%;
          transform: translateX(-50%);
          animation-delay: 4s;
        }

        .card-4 {
          top: 10%;
          right: 5%;
          animation-delay: 6s;
        }

        .card-5 {
          bottom: 25%;
          left: -5%;
          animation-delay: 8s;
        }

        .card-6 {
          top: 65%;
          right: 15%;
          animation-delay: 10s;
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .card-text {
          font-weight: 600;
          color: #374151;
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

        /* Features Section */
        .features-section {
          padding: 80px 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(250, 204, 21, 0.1);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          color: #facc15;
          margin-bottom: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(250, 204, 21, 0.1);
          border-radius: 50%;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .feature-description {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          padding: 60px 0;
          background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-item {
          color: white;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          -webkit-text-stroke: 1px #7f1d1d;
        }

        .stat-label {
          font-size: 1.1rem;
          font-weight: 600;
          opacity: 0.9;
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 0;
          background: rgba(255, 255, 255, 0.9);
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .cta-subtitle {
          font-size: 1.1rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-button.large {
          padding: 1.25rem 3rem;
          font-size: 1.2rem;
        }

        /* Footer */
        .footer {
          background: #1a202c;
          color: white;
          padding: 60px 0 30px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 2rem;
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-logo {
          height: 60px;
          width: auto;
          margin-bottom: 1rem;
        }

        .footer-tagline {
          color: #a0aec0;
          font-size: 0.95rem;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .footer-section h4 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #facc15;
        }

        .footer-section a {
          color: #a0aec0;
          text-decoration: none;
          display: block;
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #facc15;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links span {
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .social-links span:hover {
          transform: scale(1.2);
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 2rem;
          text-align: center;
          color: #a0aec0;
        }

        /* Animations */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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

        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
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

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-title {
            font-size: 3rem;
          }

          .floating-cards {
            display: none;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
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

          .hero-section {
            padding: 100px 1rem 60px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-links {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}