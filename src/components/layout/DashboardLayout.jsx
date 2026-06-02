import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/ckycform/user-login" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>

      <style>{`
        .dashboard-layout {
          min-height: 100vh;
          background-color: #f4f6f9;
        }

        .main-content {
          margin-left: var(--sidebar-width);
          margin-top: var(--header-height);
          padding: 24px;
          min-height: calc(100vh - var(--header-height));
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
