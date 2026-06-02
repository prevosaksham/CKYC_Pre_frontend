import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Redirect normal users to their forms list
  if (user && !user.isAdmin) {
    return <Navigate to="/ckycform/dashboard/forms" replace />;
  }

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Forms',
      value: stats.total,
      icon: 'bi-file-earmark-check',
      color: 'blue',
      status: 'All'
    },
    {
      title: 'Approved Forms',
      value: stats.approved,
      icon: 'bi-check-circle',
      color: 'green',
      status: 'Approved'
    },
    {
      title: 'Pending Forms',
      value: stats.pending,
      icon: 'bi-clock-history',
      color: 'amber',
      status: 'Pending'
    },
    {
      title: 'Rejected Forms',
      value: stats.rejected,
      icon: 'bi-x-circle',
      color: 'red',
      status: 'Rejected'
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page fade-in-up">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <Link to="/ckycform/form" className="btn-gradient">
          <i className="bi bi-plus-lg"></i>
          New Form
        </Link>
      </div>

      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <Link 
            key={index} 
            to={card.status === 'All' ? '/ckycform/dashboard/forms' : `/ckycform/dashboard/forms?status=${card.status}`}
            className="stats-card"
          >
            <div className="stats-content">
              <div className={`icon-box ${card.color}`}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="stats-info">
                <h3>{card.value}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/ckycform/form" className="action-card">
            <i className="bi bi-file-earmark-plus"></i>
            <span>Create New Form</span>
          </Link>
          <Link to="/ckycform/dashboard/forms" className="action-card">
            <i className="bi bi-list-ul"></i>
            <span>View All Forms</span>
          </Link>
          <Link to="/ckycform/dashboard/reports" className="action-card">
            <i className="bi bi-graph-up"></i>
            <span>View Reports</span>
          </Link>
          <Link to="/ckycform/dashboard/settings" className="action-card">
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </Link>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
          text-decoration: none;
          display: block;
          cursor: pointer;
        }
        
        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .stats-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stats-info h3 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .stats-info p {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0 0;
        }

        .quick-actions {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .quick-actions h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
          text-decoration: none;
          color: #374151;
          transition: all 0.2s;
          gap: 12px;
        }

        .action-card:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }

        .action-card i {
          font-size: 28px;
        }

        .action-card span {
          font-weight: 500;
          font-size: 14px;
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
