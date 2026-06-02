import { useLocation, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const featureNames = {
  '/dashboard/users': 'Users Management',
  '/dashboard/projects': 'Projects',
  '/dashboard/reports': 'Reports & Analytics',
  '/dashboard/settings': 'Settings',
  '/dashboard/help': 'Help & Support',
  '/dashboard/profile': 'Profile',
};

const ComingSoon = () => {
  const location = useLocation();
  const featureName = featureNames[location.pathname] || 'This Feature';

  // Simulate random progress
  const progress = Math.floor(Math.random() * 60) + 20;

  return (
    <div className="coming-soon-page">
      <div className="coming-soon-card fade-in-up">
        <div className="icon-container">
          <i className="bi bi-rocket-takeoff"></i>
        </div>

        <h1>Coming Soon</h1>
        <h2>{featureName}</h2>

        <p className="description">
          We're working hard to bring you this feature.
          Stay tuned for updates!
        </p>

        <div className="progress-section">
          <div className="progress-header">
            <span>Development Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <Link to="/ckycform/dashboard" className="btn-back">
          <i className="bi bi-arrow-left"></i>
          Back to Dashboard
        </Link>
      </div>

      <style>{`
        .coming-soon-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - var(--header-height) - 48px);
        }

        .coming-soon-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .icon-container {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          animation: pulse 2s ease-in-out infinite;
        }

        .icon-container i {
          font-size: 48px;
          color: white;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        h2 {
          font-size: 20px;
          font-weight: 500;
          color: #667eea;
          margin: 0 0 16px;
        }

        .description {
          color: #6b7280;
          margin: 0 0 32px;
          line-height: 1.6;
        }

        .progress-section {
          margin-bottom: 32px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.5s ease-out;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #f3f4f6;
          border-radius: 8px;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #667eea;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
