import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from '../../assets/logo.png';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user && user.isAdmin;

  const menuItems = isAdmin
    ? [
        { path: '/ckycform/dashboard', icon: 'bi-house-door', label: 'Dashboard' },
        { path: '/ckycform/dashboard/forms', icon: 'bi-file-earmark-list', label: 'Form List' },
        // { path: '/ckycform/dashboard/client-status', icon: 'bi-shield-check', label: 'Client Status' },
        // { path: '/ckycform/dashboard/ckyc-data-count', icon: 'bi-bar-chart-line', label: 'CKYC Data Count' },
        { path: '/ckycform/dashboard/users', icon: 'bi-people', label: 'Users' },
      ]
    : [
        { path: '/ckycform/dashboard/forms', icon: 'bi-file-earmark-list', label: 'My Forms' },
      ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logoImg} alt="Protean Logo" style={{ height: '40px', width: 'auto', marginRight: '10px' }} />
          <span className="logo-text">Prerequisites</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-category">Main Menu</div>
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/ckycform/dashboard'}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background-color: var(--sidebar-bg);
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .nav-category {
          padding: 10px 20px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #b8bcc2;
          text-decoration: none;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background-color: var(--sidebar-hover);
          color: white;
        }

        .nav-item.active {
          background-color: rgba(59, 130, 246, 0.15);
          border-left-color: var(--sidebar-active);
          color: white;
        }

        .nav-item i {
          font-size: 18px;
          width: 24px;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
