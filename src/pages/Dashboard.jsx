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
      color: '#00569d',
      status: 'All'
    },
    {
      title: 'Approved Forms',
      value: stats.approved,
      icon: 'bi-check-circle',
      color: '#059669',
      status: 'Approved'
    },
    {
      title: 'Pending Forms',
      value: stats.pending,
      icon: 'bi-clock-history',
      color: '#d97706',
      status: 'Pending'
    },
    {
      title: 'Rejected Forms',
      value: stats.rejected,
      icon: 'bi-x-circle',
      color: '#dc2626',
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
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
        </div>
        <Link to="/ckycform/form" className="btn-new-form">
          <i className="bi bi-plus-lg" style={{ marginRight: '6px' }}></i>
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
            <div className="stats-card-left" style={{ borderLeftColor: card.color }}>
              <div className="stats-icon" style={{ color: card.color }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="stats-info">
                <span className="stats-value">{card.value}</span>
                <span className="stats-label">{card.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="quick-actions-section">
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
          margin-bottom: 28px;
        }

        .page-header h1 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .page-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0 0;
        }

        .btn-new-form {
          display: inline-flex;
          align-items: center;
          padding: 8px 20px;
          background: #00569d;
          color: white;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .btn-new-form:hover {
          background: #003f75;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
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
          border-radius: 18px;
          padding: 24px;
          text-decoration: none;
          display: block;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 86, 157, 0.06);
          border: 1px solid rgba(0, 86, 157, 0.08);
          transition: box-shadow 0.2s, border-color 0.2s;
        }

        .stats-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(232,240,250,0.4) 100%);
          pointer-events: none;
        }

        .stats-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 86, 157, 0.03) 100%);
          border-radius: 0 0 18px 18px;
          pointer-events: none;
        }

        .stats-card:hover {
          box-shadow: 0 3px 14px rgba(0, 86, 157, 0.09);
          border-color: rgba(0, 86, 157, 0.12);
        }

        .stats-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
          border-left: 3px solid;
          padding-left: 14px;
          position: relative;
          z-index: 1;
        }

        .stats-icon {
          font-size: 22px;
          flex-shrink: 0;
        }

        .stats-info {
          display: flex;
          flex-direction: column;
        }

        .stats-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }

        .stats-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .quick-actions-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .quick-actions-section h2 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 18px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
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
          gap: 10px;
          padding: 22px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          text-decoration: none;
          color: #374151;
          transition: border-color 0.2s, background 0.2s;
        }

        .action-card:hover {
          border-color: #00569d;
          background: #e8f0fa;
          color: #00569d;
        }

        .action-card i {
          font-size: 24px;
          color: #00569d;
        }

        .action-card span {
          font-weight: 500;
          font-size: 13px;
          text-align: center;
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
