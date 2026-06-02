import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bgImage from '../assets/bg-login.dc8356e609b03e354325.png';
import newLogoImg from '../assets/logo.png';

const Home = () => {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-links">
            <Link to="/ckycform/login" className="nav-link btn-login">
              <i className="bi bi-box-arrow-in-right"></i>
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content fade-in-up">
          <img src={newLogoImg} alt="Protean New Logo" style={{ height: '120px', width: 'auto', marginBottom: '24px' }} />
          <h1>CKYC Pre-Requisite & Sign-Off Form</h1>
          <p>
            Streamline your customer onboarding process with our comprehensive
            infrastructure pre-requisites assessment and approval system.
          </p>
          <div className="hero-buttons">
            <Link to="/ckycform/form?mode=view" className="btn-primary">
              <i className="bi bi-eye"></i>
              View Form
            </Link>
            <Link to="/ckycform/signup" className="btn-secondary">
              <i className="bi bi-person-circle"></i>
              Login/Sign-Up
            </Link>
          </div>
        </div>
      </section>



      <footer className="footer">
        <p>CKYC Pre-Requisite Management System</p>
      </footer>

      <style>{`
        .home-page {
          min-height: 100vh;
          background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${bgImage}');
          background-repeat: no-repeat;
          background-position: center center;
          background-attachment: fixed;
          background-size: cover;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          background: transparent;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .nav-container {
          width: 100%;
          margin: 0;
          padding: 16px 24px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }

        .brand-text {
          font-size: 20px;
          font-weight: 600;
          color: white;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 10px 16px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: #f3f4f6;
        }

        .nav-link.btn-login {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link.btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .hero {
          flex: 1;
          padding: 160px 24px 100px;
          text-align: center;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .hero h1 {
          font-size: 42px;
          font-weight: 700;
          margin: 0 0 20px;
        }

        .hero p {
          font-size: 18px;
          opacity: 0.9;
          margin: 0 0 32px;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-primary {
          background: white;
          color: #667eea;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.4);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }



        @media (max-width: 600px) {


          .hero h1 {
            font-size: 28px;
          }
        }



        .footer {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          text-align: center;
          padding: 24px;
          margin-top: auto;
        }

        .footer p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
