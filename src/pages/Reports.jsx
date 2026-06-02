import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Reports = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('list'); // 'list', 'detail', 'config'
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('uat'); // 'uat', 'prod'
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getHealthConfigs();
      if (response.data.success) {
        setConfigs(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      const response = await dashboardAPI.refreshAllHealth();
      if (response.data.success) {
        setConfigs(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh all health:', error);
      alert('Failed to refresh health statuses');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshSingle = async (id) => {
    try {
      const response = await dashboardAPI.refreshHealth(id);
      if (response.data.success) {
        // Update the specific config in the list
        setConfigs(prev => prev.map(c => c.id === id ? response.data.data : c));
        if (selectedConfig && selectedConfig.id === id) {
          setSelectedConfig(response.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to refresh health:', error);
    }
  };

  const handleOpenDetail = (config) => {
    setSelectedConfig(config);
    setView('detail');
    setActiveTab('uat');
  };

  const handleOpenConfig = (config = null) => {
    if (config) {
      setSelectedConfig(config);
      setFormData({ ...config });
    } else {
      setSelectedConfig(null);
      setFormData({
        clientName: '',
        uatDomain: '',
        uatOrgName: '',
        uatFiCode: '',
        uatRegionCode: '',
        uatBranchCode: '',
        uatBulkRegionCode: '',
        uatSftpHost: '',
        uatMakerId: '',
        uatCheckerId: '',
        uatMakerPassword: '',
        uatCheckerPassword: '',
        prodDomain: '',
        prodOrgName: '',
        prodFiCode: '',
        prodRegionCode: '',
        prodBranchCode: '',
        prodBulkRegionCode: '',
        prodSftpHost: '',
        prodMakerId: '',
        prodCheckerId: '',
        prodMakerPassword: '',
        prodCheckerPassword: '',
        uatServer1PublicIp: '',
        uatServer1PrivateIp: '',
        uatServer1ServiceType: 'SFTP',
        uatServer2PublicIp: '',
        uatServer2PrivateIp: '',
        uatServer2ServiceType: 'API',
        prodServer1PublicIp: '',
        prodServer1PrivateIp: '',
        prodServer1ServiceType: 'SFTP',
        prodServer2PublicIp: '',
        prodServer2PrivateIp: '',
        prodServer2ServiceType: 'API',
      });
    }
    setView('config');
    setActiveTab('uat');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      
      // If clientName is changed, sync it with Org Names
      if (name === 'clientName') {
        newState.uatOrgName = value;
        newState.prodOrgName = value;
      }
      
      // If active environment's Org Name is changed, sync it with clientName
      if (name === `${activeTab}OrgName`) {
        newState.clientName = value;
        newState[`${activeTab === 'uat' ? 'prod' : 'uat'}OrgName`] = value;
      }

      // If Server 1 Service Type is SFTP, auto set Server 2 to API
      if (name === `${activeTab}Server1ServiceType` && value === 'SFTP') {
        newState[`${activeTab}Server2ServiceType`] = 'API';
      }
      
      return newState;
    });
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      const response = await dashboardAPI.saveHealthConfig(formData);
      if (response.data.success) {
        alert('Configuration saved successfully');
        fetchConfigs();
        setView('list');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Failed to save configuration');
    }
  };

  const handleDeleteConfig = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client configuration?')) return;
    try {
      const response = await dashboardAPI.deleteHealthConfig(id);
      if (response.data.success) {
        setConfigs(prev => prev.filter(c => c.id !== id));
        setView('list');
      }
    } catch (error) {
      console.error('Failed to delete config:', error);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'ONLINE') return <span className="health-badge online"><i className="bi bi-circle-fill"></i> ONLINE</span>;
    if (status === 'OFFLINE') return <span className="health-badge offline"><i className="bi bi-circle-fill"></i> OFFLINE</span>;
    return <span className="health-badge unknown"><i className="bi bi-circle-fill"></i> NO URL</span>;
  };

  const getStatusDot = (status) => {
    if (status === 'ONLINE') return <i className="bi bi-circle-fill" style={{ color: '#22c55e' }}></i>;
    if (status === 'OFFLINE') return <i className="bi bi-circle-fill" style={{ color: '#ef4444' }}></i>;
    return <i className="bi bi-circle-fill" style={{ color: '#94a3b8' }}></i>;
  };

  if (loading && view === 'list') {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading health reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-container fade-in">
      {/* View Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            {view === 'list' && 'Dashboard'}
            {view === 'detail' && `${selectedConfig?.clientName}`}
            {view === 'config' && (selectedConfig ? `Edit ${selectedConfig.clientName}` : 'Add New Client')}
          </h1>
          <p className="text-muted small mb-0">
            {view === 'list' && 'Manage client updates with a clean, searchable workflow.'}
            {view === 'detail' && `${configs.find(c => c.id === selectedConfig?.id)?.prodStatus === 'ONLINE' ? 2 : 1} environment(s) configured`}
            {view === 'config' && 'Manage CKYC client details and SFTP credentials for each environment.'}
          </p>
        </div>
        {view === 'list' && (
          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm border d-flex align-items-center gap-2" onClick={handleRefreshAll} disabled={refreshing}>
              {refreshing ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-arrow-repeat"></i>}
              Refresh All
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenConfig()}>
              <i className="bi bi-plus-lg me-1"></i> Add Client
            </button>
          </div>
        )}
        {view !== 'list' && (
          <button className="btn btn-light btn-sm border" onClick={() => setView('list')}>
            <i className="bi bi-arrow-left me-1"></i> Back to clients
          </button>
        )}
      </div>

      {/* Welcome message for Dashboard */}
      {view === 'list' && (
        <div className="alert alert-success border-0 shadow-sm rounded-4 mb-4" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
          Welcome back.
        </div>
      )}

      {/* Dashboard Statistics */}
      {view === 'list' && (
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="stats-card-premium">
              <span className="text-muted small d-block mb-1">Total clients</span>
              <h2 className="fw-bold mb-0">{configs.length}</h2>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stats-card-premium">
              <span className="text-muted small d-block mb-1">Online Environments</span>
              <h2 className="fw-bold mb-0">
                {configs.reduce((acc, c) => acc + (c.uatStatus === 'ONLINE' ? 1 : 0) + (c.prodStatus === 'ONLINE' ? 1 : 0), 0)}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Organization Health Monitor Section */}
      {view === 'list' && (
        <div className="health-monitor-section">
          <div className="d-flex align-items-center gap-2 mb-3">
            <h5 className="fw-bold mb-0">🏢 Organization Health Monitor</h5>
          </div>
          <p className="text-muted small mb-4">Live domain reachability status for all configured environments.</p>

          <div className="row g-4">
            {configs.map(config => (
              <div key={config.id} className="col-md-6">
                <div className="client-health-card shadow-sm" onClick={() => handleOpenDetail(config)}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="client-initial">
                      {config.clientName.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{config.clientName}</h6>
                      <span className="text-muted extra-small">2 env(s)</span>
                    </div>
                  </div>
                  
                  <div className="env-status-list">
                    <div className="env-status-item">
                      <div className="d-flex align-items-center gap-2">
                        {getStatusDot(config.prodStatus)}
                        <span className="fw-bold small">PROD</span>
                        <span className="text-muted extra-small text-truncate" style={{ maxWidth: '150px' }}>
                          — {config.prodOrgName || 'N/A'}
                        </span>
                      </div>
                      {getStatusBadge(config.prodStatus)}
                    </div>
                    <div className="env-status-item">
                      <div className="d-flex align-items-center gap-2">
                        {getStatusDot(config.uatStatus)}
                        <span className="fw-bold small">UAT</span>
                        <span className="text-muted extra-small text-truncate" style={{ maxWidth: '150px' }}>
                          — {config.uatOrgName || 'N/A'}
                        </span>
                      </div>
                      {getStatusBadge(config.uatStatus)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {configs.length === 0 && (
              <div className="col-12 text-center py-5 border rounded-4 bg-light">
                <i className="bi bi-building text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>No clients configured yet</h5>
                <button className="btn btn-primary mt-3" onClick={() => handleOpenConfig()}>Add Your First Client</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed View */}
      {view === 'detail' && selectedConfig && (
        <div className="detail-view-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="client-initial">
                {selectedConfig.clientName.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h5 className="fw-bold mb-0">{selectedConfig.clientName}</h5>
                <span className="text-muted small">2 environment(s) configured</span>
              </div>
            </div>
            <button className="btn btn-dark-cyan px-4 rounded-3 d-flex align-items-center gap-2" onClick={() => handleOpenConfig(selectedConfig)}>
              <i className="bi bi-gear"></i> Configure
            </button>
          </div>

          <div className="env-tabs shadow-sm mb-4">
            <button className={`env-tab ${activeTab === 'uat' ? 'active' : ''}`} onClick={() => setActiveTab('uat')}>
              <i className="bi bi-circle-fill text-warning small me-2"></i> Testbed
            </button>
            <button className={`env-tab ${activeTab === 'prod' ? 'active' : ''}`} onClick={() => setActiveTab('prod')}>
              <i className="bi bi-circle-fill text-success small me-2"></i> Production
            </button>
          </div>

          <div className="row g-4">
            <div className="col-12">
              <div className="env-detail-card shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className={`badge-indicator ${activeTab === 'prod' ? 'bg-success' : 'bg-warning'}`}></span>
                  <h6 className="fw-bold mb-0">{activeTab === 'prod' ? 'Production' : 'Testbed'}</h6>
                </div>

                {/* Domain Link Card */}
                {selectedConfig[`${activeTab}Domain`] && (
                   <div className="domain-link-card mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="domain-icon">
                        <i className="bi bi-globe"></i>
                      </div>
                      <span className="fw-medium">{selectedConfig[`${activeTab}Domain`]}</span>
                      <a href={selectedConfig[`${activeTab}Domain`]} target="_blank" rel="noreferrer" className="text-muted">
                        <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                )}

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="info-item">
                      <span className="info-label">ORGANIZATION</span>
                      <span className="info-value">{selectedConfig[`${activeTab}OrgName`] || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">REGION CODE</span>
                      <span className="info-value">{selectedConfig[`${activeTab}RegionCode`] || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">BULK REGION CODE</span>
                      <span className="info-value">{selectedConfig[`${activeTab}BulkRegionCode`] || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">MAKER ID</span>
                      <span className="info-value">{selectedConfig[`${activeTab}MakerId`] || '—'}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <span className="info-label">FI CODE</span>
                      <span className="info-value">{selectedConfig[`${activeTab}FiCode`] || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">BRANCH CODE</span>
                      <span className="info-value">{selectedConfig[`${activeTab}BranchCode`] || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">SFTP HOST</span>
                      <span className="info-value">{selectedConfig[`${activeTab}SftpHost`] || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">CHECKER ID</span>
                      <span className="info-value">{selectedConfig[`${activeTab}CheckerId`] || '—'}</span>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="section-header d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-server text-muted"></i>
                  <h6 className="fw-bold mb-0">Server Information</h6>
                </div>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="server-detail-box p-3 border rounded-3 bg-light">
                      <span className="badge bg-white text-dark border extra-small mb-2">SERVER 1</span>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="extra-small text-muted">Public IP</span>
                        <span className="small fw-medium">{selectedConfig[`${activeTab}Server1PublicIp`] || '—'}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="extra-small text-muted">Private IP</span>
                        <span className="small fw-medium">{selectedConfig[`${activeTab}Server1PrivateIp`] || '—'}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="extra-small text-muted">Service Type</span>
                        <span className="small fw-medium">{selectedConfig[`${activeTab}Server1ServiceType`] || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="server-detail-box p-3 border rounded-3 bg-light">
                      <span className="badge bg-white text-dark border extra-small mb-2">SERVER 2</span>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="extra-small text-muted">Public IP</span>
                        <span className="small fw-medium">{selectedConfig[`${activeTab}Server2PublicIp`] || '—'}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="extra-small text-muted">Private IP</span>
                        <span className="small fw-medium">{selectedConfig[`${activeTab}Server2PrivateIp`] || '—'}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="extra-small text-muted">Service Type</span>
                        <span className="small fw-medium">{selectedConfig[`${activeTab}Server2ServiceType`] || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="section-header d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-shield-lock text-muted"></i>
                  <h6 className="fw-bold mb-0">Credentials</h6>
                </div>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="info-item">
                      <span className="info-label">MAKER PASSWORD</span>
                      <span className="info-value">{selectedConfig[`${activeTab}MakerPassword`] ? '••••••••' : '—'}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <span className="info-label">CHECKER PASSWORD</span>
                      <span className="info-value">{selectedConfig[`${activeTab}CheckerPassword`] ? '••••••••' : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form View */}
      {view === 'config' && (
        <form onSubmit={handleSaveConfig} className="config-form-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">{formData.clientName || 'New Client'} — Configuration</h5>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-light btn-sm border" onClick={() => setView('list')}>Cancel</button>
              {selectedConfig && (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteConfig(selectedConfig.id)}>
                  <i className="bi bi-trash"></i> Delete
                </button>
              )}
              <button type="submit" className="btn btn-dark-cyan btn-sm px-3">
                <i className="bi bi-save me-1"></i> Save All Environments
              </button>
            </div>
          </div>

          <div className="env-tabs shadow-sm mb-4">
            <button type="button" className={`env-tab ${activeTab === 'uat' ? 'active' : ''}`} onClick={() => setActiveTab('uat')}>
              <i className="bi bi-circle-fill text-warning small me-2"></i> Testbed
            </button>
            <button type="button" className={`env-tab ${activeTab === 'prod' ? 'active' : ''}`} onClick={() => setActiveTab('prod')}>
              <i className="bi bi-circle-fill text-success small me-2"></i> Production
            </button>
          </div>

          <div className="config-card shadow-sm mb-4">
            <div className="section-header d-flex align-items-center gap-3 mb-4">
              <div className="section-icon"><i className="bi bi-globe"></i></div>
              <div>
                <h6 className="fw-bold mb-0">Domain URL — {activeTab === 'uat' ? 'Testbed' : 'Production'}</h6>
                <span className="text-muted extra-small">The primary access domain for this environment.</span>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">Environment Domain</label>
              <div className="d-flex gap-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}Domain`}
                  value={formData[`${activeTab}Domain`] || ''}
                  onChange={handleInputChange}
                  placeholder="https://ckyc.example.com"
                />
                <button type="button" className="btn btn-dark-cyan d-flex align-items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                  <i className="bi bi-save"></i> Save Domain
                </button>
                <button type="button" className="btn btn-light border d-flex align-items-center gap-2">
                  <i className="bi bi-globe"></i> Open Domain
                </button>
              </div>
            </div>

            {/* Server Information */}
            <div className="section-header d-flex align-items-center gap-3 mb-4 mt-5">
              <div className="section-icon"><i className="bi bi-server"></i></div>
              <div>
                <h6 className="fw-bold mb-0">Server Information — {activeTab === 'uat' ? 'Testbed' : 'Production'}</h6>
                <span className="text-muted extra-small">Public and private IP addresses for the environment servers.</span>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-12">
                <div className="server-info-row p-3 border rounded-3 mb-3">
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-light text-dark border extra-small">SERVER 1</span>
                    <span className="badge bg-light-orange text-orange extra-small">APPLICATION VM</span>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label extra-small fw-bold">Public IP</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        name={`${activeTab}Server1PublicIp`}
                        value={formData[`${activeTab}Server1PublicIp`] || ''}
                        onChange={handleInputChange}
                        placeholder="203.0.113.10"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label extra-small fw-bold">Private IP</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        name={`${activeTab}Server1PrivateIp`}
                        value={formData[`${activeTab}Server1PrivateIp`] || ''}
                        onChange={handleInputChange}
                        placeholder="10.0.1.5"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label extra-small fw-bold">Service Type</label>
                      <select 
                        className="form-select form-select-sm"
                        name={`${activeTab}Server1ServiceType`}
                        value={formData[`${activeTab}Server1ServiceType`] || 'SFTP'}
                        onChange={handleInputChange}
                      >
                        <option value="SFTP">SFTP</option>
                        <option value="API">API</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="server-info-row p-3 border rounded-3">
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-light text-dark border extra-small">SERVER 2</span>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label extra-small fw-bold">Public IP</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        name={`${activeTab}Server2PublicIp`}
                        value={formData[`${activeTab}Server2PublicIp`] || ''}
                        onChange={handleInputChange}
                        placeholder="203.0.113.11"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label extra-small fw-bold">Private IP</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        name={`${activeTab}Server2PrivateIp`}
                        value={formData[`${activeTab}Server2PrivateIp`] || ''}
                        onChange={handleInputChange}
                        placeholder="10.0.1.6"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label extra-small fw-bold">Service Type</label>
                      <select 
                        className="form-select form-select-sm"
                        name={`${activeTab}Server2ServiceType`}
                        value={formData[`${activeTab}Server2ServiceType`] || 'API'}
                        onChange={handleInputChange}
                      >
                        <option value="SFTP">SFTP</option>
                        <option value="API">API</option>
                        <option value="DB">DB</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="section-header d-flex align-items-center gap-3 mb-4 mt-5">
              <div className="section-icon"><i className="bi bi-building"></i></div>
              <div>
                <h6 className="fw-bold mb-0">Client Details — {activeTab === 'uat' ? 'Testbed' : 'Production'}</h6>
                <span className="text-muted extra-small">Organization and regional identifiers for the environment.</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label extra-small fw-bold">Client Display Name (Used for Dashboard)</label>
              <input 
                type="text" 
                className="form-control" 
                name="clientName"
                value={formData.clientName || ''}
                onChange={handleInputChange}
                placeholder="5 STAR"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label extra-small fw-bold">Organization Name</label>
              <input 
                type="text" 
                className="form-control" 
                name={`${activeTab}OrgName`}
                value={formData[`${activeTab}OrgName`] || ''}
                onChange={handleInputChange}
                placeholder="ABC Finance Ltd."
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">FI Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}FiCode`}
                  value={formData[`${activeTab}FiCode`] || ''}
                  onChange={handleInputChange}
                  placeholder="FI001"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Region Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}RegionCode`}
                  value={formData[`${activeTab}RegionCode`] || ''}
                  onChange={handleInputChange}
                  placeholder="RGN01"
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Branch Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}BranchCode`}
                  value={formData[`${activeTab}BranchCode`] || ''}
                  onChange={handleInputChange}
                  placeholder="BR001"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Region Code for Bulk Search</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}BulkRegionCode`}
                  value={formData[`${activeTab}BulkRegionCode`] || ''}
                  onChange={handleInputChange}
                  placeholder="BULK-RGN01"
                />
              </div>
            </div>

            {/* SFTP Details */}
            <div className="section-header d-flex align-items-center gap-3 mb-4 mt-5">
              <div className="section-icon"><i className="bi bi-shield-lock"></i></div>
              <div>
                <h6 className="fw-bold mb-0">SFTP Details — {activeTab === 'uat' ? 'Testbed' : 'Production'}</h6>
                <span className="text-muted extra-small">Secure file transfer credentials for the environment.</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label extra-small fw-bold">SFTP Host URL</label>
              <input 
                type="text" 
                className="form-control" 
                name={`${activeTab}SftpHost`}
                value={formData[`${activeTab}SftpHost`] || ''}
                onChange={handleInputChange}
                placeholder="sftp://example.com:22"
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Maker User ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}MakerId`}
                  value={formData[`${activeTab}MakerId`] || ''}
                  onChange={handleInputChange}
                  placeholder="Maker login ID"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Maker Password</label>
                <div className="input-group">
                  <input 
                    type="password" 
                    className="form-control" 
                    name={`${activeTab}MakerPassword`}
                    value={formData[`${activeTab}MakerPassword`] || ''}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                  <span className="input-group-text bg-white border-start-0 text-muted"><i className="bi bi-eye"></i></span>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Checker User ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name={`${activeTab}CheckerId`}
                  value={formData[`${activeTab}CheckerId`] || ''}
                  onChange={handleInputChange}
                  placeholder="Checker login ID"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label extra-small fw-bold">Checker Password</label>
                <div className="input-group">
                  <input 
                    type="password" 
                    className="form-control" 
                    name={`${activeTab}CheckerPassword`}
                    value={formData[`${activeTab}CheckerPassword`] || ''}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                  <span className="input-group-text bg-white border-start-0 text-muted"><i className="bi bi-eye"></i></span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      <style>{`
        .reports-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-card-premium {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.03);
        }

        .client-health-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .client-health-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }

        .client-initial {
          width: 48px;
          height: 48px;
          background: #e6f6f4;
          color: #0d9488;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
        }

        .env-status-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .env-status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .health-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .health-badge.online {
          background: #ecfdf5;
          color: #10b981;
        }
        
        .health-badge.offline {
          background: #fee2e2;
          color: #991b1b;
        }

        .health-badge.unknown {
          background: #f3f4f6;
          color: #4b5563;
        }

        .extra-small {
          font-size: 11px;
        }

        .env-tabs {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 6px;
          width: fit-content;
        }

        .env-tab {
          border: none;
          background: transparent;
          padding: 8px 24px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }

        .env-tab.active {
          background: #f3f4f6;
          color: #000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .env-detail-card, .config-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
        }

        .badge-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .domain-link-card {
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 12px;
          padding: 16px 20px;
        }

        .domain-icon {
          width: 32px;
          height: 32px;
          background: white;
          color: #4f46e5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .info-value {
          display: block;
          font-size: 15px;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .btn-dark-cyan {
          background: #0d9488;
          color: white;
          border: none;
        }

        .btn-dark-cyan:hover {
          background: #0f766e;
          color: white;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #4b5563;
        }

        .text-orange { color: #f97316; }
        .bg-light-orange { background: #fff7ed; }

        .form-label { margin-bottom: 6px; }
        .form-control:focus, .form-select:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Reports;
