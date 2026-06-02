import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bgImage from '../assets/bg-login.dc8356e609b03e354325.png';
import logoImg from '../assets/logo.png';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signup(fullName, email, password);
      if (response.data.success) {
        // Auto-login after successful registration
        login({
          userId: response.data.userId,
          username: response.data.username,
          fullName: response.data.fullName,
          isAdmin: response.data.isAdmin,
          token: response.data.token,
        });
        // Redirect to form so they can fill it
        navigate('/ckycform/form');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">
            <img src={logoImg} alt="Protean Logo" />
          </div>
          <h2>Create Account</h2>
          <p>Register to submit a new CKYC form</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <i className="bi bi-person-badge input-icon"></i>
              <input
                type="text"
                id="fullName"
                className="form-control"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <i className="bi bi-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="bi bi-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control pe-5"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none"
                onClick={() => setShowPassword(!showPassword)}
                style={{ zIndex: 10 }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus"></i>
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/ckycform/user-login" className="back-link" style={{ marginBottom: '10px', display: 'block' }}>
            Already have an account? Sign In
          </Link>
          <Link to="/ckycform/" className="back-link">
            <i className="bi bi-arrow-left"></i>
            Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          background: url('${bgImage}') no-repeat center center / cover;
          padding: 20px 12%;
        }

        .login-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .login-logo img {
          height: 100px;
          width: auto;
        }

        .login-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .login-header p {
          color: #6b7280;
          margin: 0;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .alert-danger {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .form-control {
          width: 100%;
          padding: 12px 14px 12px 44px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
        }

        .btn-login {
          width: 100%;
          padding: 14px;
          background: #eb9200;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .btn-login:hover:not(:disabled) {
          background: #d48400;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(235, 146, 0, 0.4);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .back-link {
          color: #667eea;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #764ba2;
        }
      `}</style>
    </div>
  );
};

export default Signup;
