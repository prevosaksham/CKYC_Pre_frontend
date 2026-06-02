import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await dashboardAPI.deleteUser(userId);
      if (response.data.success) {
        alert('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="container-fluid py-4">
      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold">System Users</h5>
          <button className="btn btn-primary btn-sm" onClick={fetchUsers}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people text-muted" style={{ fontSize: '48px' }}></i>
            <p className="mt-3 text-muted">No users found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Sr No</th>
                  <th>User</th>
                  <th>Organization Name</th>
                  <th>Mail ID</th>
                  <th>Login Password</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{getInitials(user.fullName)}</div>
                        <div>
                          <div className="fw-semibold">{user.fullName}</div>
                          <div className="text-muted small">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.forms && user.forms.length > 0 ? (
                        <span className="org-badge">
                          {user.forms[0].organizationName}
                        </span>
                      ) : (
                        <span className="text-muted italic">No Form Submitted</span>
                      )}
                    </td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <div className="password-masked">
                        <code>
                          {visiblePasswords[user.id] ? (user.loginPassword || 'N/A') : '********'}
                        </code>
                        <button 
                          className="btn btn-link btn-sm p-0 ms-2 text-muted" 
                          onClick={() => togglePasswordVisibility(user.id)}
                          title={visiblePasswords[user.id] ? "Hide Password" : "Show Password"}
                        >
                          <i className={`bi ${visiblePasswords[user.id] ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id, user.fullName)}
                        title="Delete User"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .custom-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .custom-table thead th {
          background-color: #f8f9fa;
          padding: 12px 16px;
          font-weight: 600;
          color: #4b5563;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
          font-size: 14px;
        }

        .custom-table tbody td {
          padding: 16px;
          vertical-align: middle;
          border-bottom: 1px solid #f3f4f6;
          color: #1f2937;
          font-size: 15px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          font-weight: 600;
          font-size: 14px;
        }

        .org-badge {
          background-color: #ecfdf5;
          color: #059669;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          display: inline-block;
        }

        .password-masked {
          display: flex;
          align-items: center;
          font-family: monospace;
          background: #f9fafb;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          width: fit-content;
        }

        .italic {
          font-style: italic;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default Users;
