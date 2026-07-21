import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const isAdmin = user?.isAdmin;
    logout();
    navigate(isAdmin ? '/ckycform/login' : '/ckycform/user-login');
  };


  const {pathname} = useLocation();

  const pageTitles = {
    '/ckycform/dashboard':'Dashboard',
    '/ckycform/dashboard/forms':'Form List',
    '/ckycform/dashboard/users':'Users List',
  }

  const pageTitle = pageTitles[pathname] || '';

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{pageTitle}</h1>
        </div>

        <div className="header-right">
          <div className="user-dropdown" ref={dropdownRef}>
            <div className="user-btn-group">
              <button
                className="user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  <i className="bi bi-person"></i>
                </div>
              </button>
              <span className="user-name-link">
                {user?.fullName || ''}
              </span>
              <button 
                className="chevron-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-chevron-down"></i>
              </button>
            </div>

            {showDropdown && (
              <div className="dropdown-menu show">
                <Link to="/ckycform/dashboard/forms" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <i className="bi bi-file-earmark-list"></i>
                  My Forms
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .main-header {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: var(--header-height);
          background: white;
          border-bottom: 1px solid #e5e7eb;
          z-index: 999;
        }

        .header-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-dropdown {
          position: relative;
        }

        .user-btn-group {
          display: flex;
          align-items: center;
          background-color: #f8f9fa;
          border: 1px solid #c5d8ef;
          border-radius: 50px;
          padding: 3px;
          transition: all 0.2s;
        }

        .user-btn-group:hover {
          background-color: #f3f4f6;
          border-color: #00569d;
        }

        .user-btn, .chevron-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #00569d;
          padding: 4px 8px;
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #00569d 0%, #0074d9 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
        }

        .user-name-link {
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          padding: 0 12px;
          font-size: 14px;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          transition: color 0.2s;
        }

        .user-name-link:hover {
          color: #00569d;
        }

        .chevron-btn {
          font-size: 12px;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          padding: 8px 0;
          display: none;
        }

        .dropdown-menu.show {
          display: block;
          animation: fadeIn 0.2s ease-out;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: none;
          color: #374151;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: left;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .dropdown-item.text-danger {
          color: #dc2626;
        }

        .dropdown-divider {
          margin: 8px 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </header>
  );
};

export default Header;
