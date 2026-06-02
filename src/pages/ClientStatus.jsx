import { useState, useEffect } from 'react';
import { formAPI } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

const defaultChecklist = [
  { sr_no: "1", category: "Pre-Requisite", subtask: "Verify Hardware Requirements (RAM / CPU / Storage)", owner: "Protean", days: "2 Day", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "2", category: "Pre-Requisite", subtask: "Validate OS Version & Kernel", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "3", category: "Pre-Requisite", subtask: "Confirm Sudo / Root Access", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "4", category: "Pre-Requisite", subtask: "Validate SSH Access to Server", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "5", category: "Pre-Requisite", subtask: "Confirm Required Ports Open (80,443,5432,3001,9092,2181,3100,9090,3000 etc.)", owner: "Protean + FiveStar", days: "", uat_status: "WIP", prod_status: "Pending", remark: "Ports are yet to be Opened for UAT" },
  { sr_no: "6", category: "Pre-Requisite", subtask: "Validate Firewall / Security Restrictions", owner: "Protean + FiveStar", days: "", uat_status: "WIP", prod_status: "Pending", remark: "" },
  { sr_no: "7", category: "Pre-Requisite", subtask: "Validate SELinux Disabled or Permissive", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "8", category: "Pre-Requisite", subtask: "Validate Internet Connectivity (docker pull / certbot)", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "9", category: "Pre-Requisite", subtask: "Verify Docker Installed & Running", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "10", category: "Pre-Requisite", subtask: "Verify Docker-Compose Installed", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "11", category: "Pre-Requisite", subtask: "Validate Domain Mapping", owner: "Protean + FiveStar", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "12", category: "Pre-Requisite", subtask: "Confirm SSL plan (Certbot / External Certificate)", owner: "FiveStar", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "13", category: "Pre-Requisite", subtask: "Confirm Folder Permissions for Deployment", owner: "Protean", days: "", uat_status: "Completed", prod_status: "Pending", remark: "" },
  { sr_no: "14", category: "Pre-Requisite", subtask: "Pre-Requisite Sign-Off", owner: "Protean", days: "", uat_status: "WIP", prod_status: "Pending", remark: "" },
  { sr_no: "15", category: "Deployment", subtask: "Deploy CKYC Stack via Docker-Compose", owner: "Protean", days: "4 Days", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "16", category: "Deployment", subtask: "Configure Keycloak Realm / Client / Roles", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "17", category: "Deployment", subtask: "Deploy Backend image using updatenv.sh", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "18", category: "Deployment", subtask: "Deploy Frontend image using updatenv.sh", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "19", category: "Deployment", subtask: "Deploy Kafka + Zookeeper", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "20", category: "Deployment", subtask: "Deploy Redis", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "21", category: "Deployment", subtask: "Deploy Postgres & DB schema", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "22", category: "Deployment", subtask: "Deploy Logging (Loki)", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "23", category: "Deployment", subtask: "Deploy Monitoring (Prometheus + Grafana)", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "24", category: "Deployment", subtask: "Deploy Nginx Reverse Proxy", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "25", category: "Deployment", subtask: "Enable SSL / Certbot certificate", owner: "Protean + FiveStar", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "26", category: "Deployment", subtask: "Backup & Snapshot before go-live", owner: "FiveStar", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "27", category: "Deployment", subtask: "Deployment Completion Approval", owner: "Protean + FiveStar", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "28", category: "Testing", subtask: "Functional Testing (UI + API)", owner: "Protean", days: "3 Days", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "29", category: "Testing", subtask: "Integration Testing (Kafka / Redis / Keycloak / DB / External)", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "30", category: "Testing", subtask: "Regression Testing", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "31", category: "Testing", subtask: "Load / Performance Testing", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "32", category: "Testing", subtask: "Security Testing (Token / Role / Session)", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "33", category: "Testing", subtask: "Issue Fix Validation & Retesting", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "34", category: "Testing", subtask: "Testing Sign-Off", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "35", category: "Sign-Off", subtask: "UAT Sign-Off", owner: "FiveStar", days: "2 Day", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "36", category: "Sign-Off", subtask: "Production Sign-Off", owner: "FiveStar", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" },
  { sr_no: "37", category: "Sign-Off", subtask: "Project Closure Email to Client", owner: "Protean", days: "", uat_status: "Yet to Start", prod_status: "Pending", remark: "" }
];

const generateChecklist = (clientName, overallStatus) => {
  return defaultChecklist.map(t => {
    const task = { ...t };
    if (task.owner.includes("FiveStar")) {
      task.owner = task.owner.replace("FiveStar", clientName);
    } else if (task.owner === "FiveStar") {
      task.owner = clientName;
    }
    
    if (overallStatus === 'Active') {
      task.uat_status = 'Completed';
      task.prod_status = 'Completed';
    } else if (overallStatus === 'Suspended') {
      task.uat_status = 'Completed';
      task.prod_status = 'Pending';
    } else if (overallStatus === 'Pending Connection') {
      task.uat_status = 'Completed';
      task.prod_status = 'Yet to Start';
    } else {
      if (parseInt(task.sr_no) <= 10) {
        task.uat_status = 'Completed';
      } else if (parseInt(task.sr_no) <= 14) {
        task.uat_status = 'WIP';
      } else {
        task.uat_status = 'Yet to Start';
      }
      task.prod_status = 'Yet to Start';
    }
    return task;
  });
};

const getBaseClients = () => {
  const base = [
    {
      id: 'mock-1',
      customerName: 'FiveStar',
      projectName: 'CKYC Project Implementation',
      ckycEnvironment: 'Production',
      fiCode: 'FI0045',
      regionCode: 'SOUTH-CHE',
      branchCode: 'CHE001',
      clientFPR: 'Vikram Grover',
      startDate: '2026-05-01',
      expectedEndDate: '2026-12-16',
      uatStatus: 'WIP',
      prodStatus: 'Yet to Start',
      status: 'Setup Stage',
      remark: 'Ports are yet to be Opened for UAT',
      creator: { fullName: 'System' },
      technicalSPOCName: 'Vikram Grover',
      technicalSPOCEmail: 'vikram.g@fivestar.com',
      technicalSPOCPhone: '+91 9988776655',
      businessSPOCName: 'Suresh Kumar',
      businessSPOCEmail: 'suresh.k@fivestar.com',
      businessSPOCPhone: '+91 9988776611',
      certificateInfo: 'SHA256 valid till Dec 2026',
      apiIPWhitelisting: '115.240.23.14',
      sftpUrl: 'sftp.fivestar.co.in',
      sftpPortNo: '22',
      created_at: '2026-05-01'
    },
    {
      id: 'mock-2',
      customerName: 'WorldLine Epayment bank',
      projectName: 'CKYC Project Integration V2',
      ckycEnvironment: 'Production',
      fiCode: 'FI0089',
      regionCode: 'WEST-MUM',
      branchCode: 'MUM001',
      clientFPR: 'Sanjay Deshmukh',
      startDate: '2026-04-15',
      expectedEndDate: '2026-10-15',
      uatStatus: 'Completed',
      prodStatus: 'Completed',
      status: 'Active',
      remark: 'Project successfully completed and handed over.',
      creator: { fullName: 'Admin User' },
      technicalSPOCName: 'Sanjay Deshmukh',
      technicalSPOCEmail: 'sanjay.d@worldline.com',
      technicalSPOCPhone: '+91 9988776655',
      businessSPOCName: 'Amit Pathak',
      businessSPOCEmail: 'amit.p@worldline.com',
      businessSPOCPhone: '+91 9988776611',
      certificateInfo: 'SHA256 valid till Dec 2026',
      apiIPWhitelisting: '115.240.23.14, 115.240.23.15',
      sftpUrl: 'sftp.worldline.co.in',
      sftpPortNo: '22',
      created_at: '2026-04-15'
    },
    {
      id: 'mock-3',
      customerName: 'Altum Credo',
      projectName: 'CKYC API Integration Phase 1',
      ckycEnvironment: 'UAT',
      fiCode: 'FI0345',
      regionCode: 'WEST-PUN',
      branchCode: 'PUN002',
      clientFPR: 'Amit Sharma',
      startDate: '2026-05-10',
      expectedEndDate: '2026-11-20',
      uatStatus: 'WIP',
      prodStatus: 'Yet to Start',
      status: 'Setup Stage',
      remark: 'OS validation & root credentials pending check.',
      creator: { fullName: 'Systems Operator' },
      technicalSPOCName: 'Amit Sharma',
      technicalSPOCEmail: 'amit.s@altumcredo.com',
      technicalSPOCPhone: '+91 9123456780',
      businessSPOCName: 'Rohit Sen',
      businessSPOCEmail: 'rohit.s@altumcredo.com',
      businessSPOCPhone: '+91 9123456781',
      certificateInfo: 'CSR pending signature',
      apiIPWhitelisting: 'Pending',
      sftpUrl: 'sftp.uat.altumcredo.com',
      sftpPortNo: '22',
      created_at: '2026-05-10'
    },
    {
      id: 'mock-4',
      customerName: 'Fusion Finance',
      projectName: 'CKYC Bulk Upload System',
      ckycEnvironment: 'Production',
      fiCode: 'FI0911',
      regionCode: 'NORTH-DLH',
      branchCode: 'DLH001',
      clientFPR: 'Preeti Verma',
      startDate: '2026-05-20',
      expectedEndDate: '2026-12-10',
      uatStatus: 'Completed',
      prodStatus: 'Yet to Start',
      status: 'Pending Connection',
      remark: 'Certificates configured, waiting for firewall clearance.',
      creator: { fullName: 'Finance Admin' },
      technicalSPOCName: 'Preeti Verma',
      technicalSPOCEmail: 'preeti.v@fusionfinance.com',
      technicalSPOCPhone: '+91 9898989898',
      businessSPOCName: 'Sanjay Dutt',
      businessSPOCEmail: 'sanjay.d@fusionfinance.com',
      businessSPOCPhone: '+91 9898989899',
      certificateInfo: 'SHA256 valid till Oct 2026',
      apiIPWhitelisting: '121.240.10.90',
      sftpUrl: 'Not Configured',
      sftpPortNo: '-',
      created_at: '2026-05-20'
    },
    {
      id: 'mock-5',
      customerName: 'Tyger Corp',
      projectName: 'CKYC Portal V1 Rollout',
      ckycEnvironment: 'Production',
      fiCode: 'FI1102',
      regionCode: 'SOUTH-BLR',
      branchCode: 'BLR004',
      clientFPR: 'Rohan Sen',
      startDate: '2026-05-25',
      expectedEndDate: '2026-12-15',
      uatStatus: 'Completed',
      prodStatus: 'Completed',
      status: 'Active',
      remark: 'All milestone validations completed successfully.',
      creator: { fullName: 'Systems Operator' },
      technicalSPOCName: 'Rohan Sen',
      technicalSPOCEmail: 'rohan.s@tygercorp.com',
      technicalSPOCPhone: '+91 9123456888',
      businessSPOCName: 'Rahul Dev',
      businessSPOCEmail: 'rahul.d@tygercorp.com',
      businessSPOCPhone: '+91 9123456889',
      certificateInfo: 'SHA256 valid till Dec 2026',
      apiIPWhitelisting: '115.240.90.10',
      sftpUrl: 'sftp.tygercorp.com',
      sftpPortNo: '22',
      created_at: '2026-05-25'
    }
  ];
  return base.map(c => ({
    ...c,
    tasks: generateChecklist(c.customerName, c.status)
  }));
};

const ClientStatus = () => {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('client_status_records');
    return saved ? JSON.parse(saved) : getBaseClients();
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('checklist'); // 'checklist' or 'details'

  // Edit / Add States
  const [isEditing, setIsEditing] = useState(false);
  const [backupClients, setBackupClients] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // New Client States
  const [newClientName, setNewClientName] = useState('');
  const [newClientProject, setNewClientProject] = useState('');
  const [newClientFPR, setNewClientFPR] = useState('');
  const [newClientStartDate, setNewClientStartDate] = useState('');
  const [newClientEndDate, setNewClientEndDate] = useState('');
  const [newClientEnv, setNewClientEnv] = useState('UAT');
  const [newClientStatus, setNewClientStatus] = useState('Setup Stage');

  useEffect(() => {
    // Populate localStorage on very first visit
    const saved = localStorage.getItem('client_status_records');
    const parsed = saved ? JSON.parse(saved) : null;
    const hasOldData = parsed && parsed.some(c => 
      c.customerName.includes('HDFC') || 
      c.customerName.includes('ICICI') || 
      c.customerName.includes('Reliance')
    );
    if (!saved || hasOldData) {
      const base = getBaseClients();
      localStorage.setItem('client_status_records', JSON.stringify(base));
      setClients(base);
    }
    setLoading(false);
  }, []);

  // Edit Mode toggle
  const handleEditToggle = () => {
    setBackupClients(JSON.parse(JSON.stringify(clients)));
    setIsEditing(true);
  };

  // Save changes to localStorage
  const handleSave = () => {
    localStorage.setItem('client_status_records', JSON.stringify(clients));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Revert changes
  const handleCancel = () => {
    setClients(backupClients);
    setIsEditing(false);
  };

  // Field change handler in table rows
  const handleClientFieldChange = (clientId, field, val) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updated = { ...c, [field]: val };
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updated);
        }
        return updated;
      }
      return c;
    }));
  };

  // Task checklist change handler inside modal
  const handleTaskFieldChange = (clientId, taskSrNo, field, val) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updatedTasks = c.tasks.map(t => {
          if (t.sr_no === taskSrNo) {
            return { ...t, [field]: val };
          }
          return t;
        });
        const updatedClient = { ...c, tasks: updatedTasks };
        setSelectedClient(updatedClient);
        return updatedClient;
      }
      return c;
    }));
  };

  // Add new client submit
  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const exists = clients.some(c => c.customerName.toLowerCase() === newClientName.trim().toLowerCase());
    if (exists) {
      alert("A client with this name already exists.");
      return;
    }

    const uatVal = newClientStatus === 'Active' ? 'Completed' : 'WIP';
    const preProdVal = newClientStatus === 'Active' ? 'Completed' : 'Yet to Start';
    const prodVal = newClientStatus === 'Active' ? 'Completed' : 'Yet to Start';

    const newClient = {
      id: `client-new-${Date.now()}`,
      customerName: newClientName.trim(),
      projectName: newClientProject.trim() || 'CKYC Assessment',
      ckycEnvironment: newClientEnv,
      fiCode: `FI${Math.floor(1000 + Math.random() * 9000)}`,
      regionCode: 'WEST-MUM',
      branchCode: 'MUM001',
      clientFPR: newClientFPR.trim() || 'Protean Support',
      startDate: newClientStartDate || new Date().toISOString().split('T')[0],
      expectedEndDate: newClientEndDate || '2026-12-16',
      uatStatus: uatVal,
      preProdStatus: preProdVal,
      prodStatus: prodVal,
      status: newClientStatus,
      remark: 'New project pipeline initialized.',
      creator: { fullName: 'User' },
      technicalSPOCName: newClientFPR.trim() || 'N/A',
      technicalSPOCEmail: 'support@protean.com',
      technicalSPOCPhone: 'N/A',
      businessSPOCName: 'N/A',
      businessSPOCEmail: 'N/A',
      businessSPOCPhone: 'N/A',
      certificateInfo: 'Pending configuration',
      apiIPWhitelisting: 'Pending',
      sftpUrl: 'Not Configured',
      sftpPortNo: '-',
      created_at: new Date().toISOString().split('T')[0]
    };

    newClient.tasks = generateChecklist(newClient.customerName, newClient.status);

    const updated = [...clients, newClient];
    setClients(updated);
    localStorage.setItem('client_status_records', JSON.stringify(updated));
    
    setNewClientName('');
    setNewClientProject('');
    setNewClientFPR('');
    setNewClientStartDate('');
    setNewClientEndDate('');
    setNewClientEnv('UAT');
    setNewClientStatus('Setup Stage');
    setShowAddClientModal(false);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesEnv = envFilter === 'All' || c.ckycEnvironment === envFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesEnv && matchesStatus;
  });

  // Calculate statistics
  const totalClients = clients.length;
  const activeClientsCount = clients.filter(c => c.status === 'Active').length;
  const setupClientsCount = clients.filter(c => c.status === 'Setup Stage').length;
  const issueClientsCount = clients.filter(c => c.status === 'Pending Connection' || c.status === 'Suspended').length;

  const handleOpenDetails = (client) => {
    setSelectedClient(client);
    setModalTab('checklist');
    setShowModal(true);
  };

  const renderStatusPill = (status) => {
    let badgeClass = "bg-secondary text-white";
    if (status === 'Completed') {
      badgeClass = "bg-success text-white";
    } else if (status === 'WIP') {
      badgeClass = "bg-warning text-dark";
    } else if (status === 'Yet to Start') {
      badgeClass = "bg-light text-secondary border";
    } else if (status === 'Pending') {
      badgeClass = "bg-info text-dark";
    } else if (status === 'NA') {
      badgeClass = "bg-secondary-light text-muted border";
    }
    return <span className={`badge px-2 py-1 ${badgeClass}`}>{status}</span>;
  };

  const getStatusBadge = (status) => {
    let badgeClass = "bg-secondary text-white";
    if (status === 'Active') {
      badgeClass = "bg-success text-white";
    } else if (status === 'Setup Stage') {
      badgeClass = "bg-primary text-white";
    } else if (status === 'Pending Connection') {
      badgeClass = "bg-warning text-dark";
    } else if (status === 'Suspended') {
      badgeClass = "bg-danger text-white";
    }
    return <span className={`badge px-3 py-2 rounded-pill ${badgeClass}`} style={{ fontSize: '12px' }}>{status}</span>;
  };

  return (
    <div className="client-status-container py-4">
      {/* Header and Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Client Milestone Status</h2>
          <p className="text-muted mb-0">Track and manage client onboarding pipelines, pre-requisite configurations, and environment rollouts.</p>
        </div>
        <div className="d-flex gap-2">
          {isEditing ? (
            <>
              <button className="btn btn-success px-4 rounded-pill shadow-sm" onClick={handleSave}>
                <i className="bi bi-check-circle me-1"></i> Save Changes
              </button>
              <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={handleCancel}>
                <i className="bi bi-x-circle me-1"></i> Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-indigo text-white px-4 rounded-pill shadow-sm" onClick={handleEditToggle}>
                <i className="bi bi-pencil-square me-1"></i> Edit Mode
              </button>
              <button className="btn btn-outline-primary px-4 rounded-pill" onClick={() => setShowAddClientModal(true)}>
                <i className="bi bi-plus-circle me-1"></i> Add Client
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-blue">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Total Pipelines</span>
                <h3 className="fw-bold text-dark mb-0 mt-1">{totalClients}</h3>
              </div>
              <div className="kpi-icon-box bg-light-blue text-blue">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-green">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Active Environments</span>
                <h3 className="fw-bold text-green mb-0 mt-1">{activeClientsCount}</h3>
              </div>
              <div className="kpi-icon-box bg-light-green text-green">
                <i className="bi bi-cloud-check-fill"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">In Setup Phase</span>
                <h3 className="fw-bold text-warning mb-0 mt-1">{setupClientsCount}</h3>
              </div>
              <div className="kpi-icon-box bg-light-warning text-warning">
                <i className="bi bi-gear-wide-connected"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-danger">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Pending/Suspended</span>
                <h3 className="fw-bold text-danger mb-0 mt-1">{issueClientsCount}</h3>
              </div>
              <div className="kpi-icon-box bg-light-danger text-danger">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar Section */}
      <div className="filter-card bg-white p-3 rounded-4 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by client or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small text-nowrap">Environment:</span>
              <select className="form-select bg-light" value={envFilter} onChange={(e) => setEnvFilter(e.target.value)}>
                <option value="All">All Environments</option>
                <option value="UAT">UAT / Testbed</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small text-nowrap">Status:</span>
              <select className="form-select bg-light" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Setup Stage">Setup Stage</option>
                <option value="Pending Connection">Pending Connection</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="col-md-2 d-flex justify-content-end">
            <button className="btn btn-outline-secondary w-100 btn-sm" onClick={() => { setSearchQuery(''); setEnvFilter('All'); setStatusFilter('All'); }}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Integration Grid Table */}
      <div className="dashboard-card bg-white p-0 rounded-4 shadow-sm overflow-hidden mb-4">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light-gradient">
          <h5 className="mb-0 fw-bold text-dark">Technical Validation Matrices</h5>
          <span className="badge bg-secondary">{filteredClients.length} of {totalClients} Listed</span>
        </div>
        
        {filteredClients.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-shield-slash text-muted" style={{ fontSize: '48px' }}></i>
            <p className="mt-3 text-muted">No integration profiles match your search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table mb-0 align-middle">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Sr No</th>
                  <th>Client Name</th>
                  <th>Form Filled Date</th>
                  <th style={{ width: '150px' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, idx) => (
                  <tr key={client.id} className="client-row-hover">
                    <td>{idx + 1}</td>
                    <td>
                      {isEditing ? (
                        <>
                          <input 
                            type="text" 
                            className="form-control form-control-sm border fw-semibold mb-1" 
                            value={client.customerName}
                            onChange={(e) => handleClientFieldChange(client.id, 'customerName', e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="form-control form-control-sm border small text-muted" 
                            value={client.projectName}
                            placeholder="Project Name"
                            onChange={(e) => handleClientFieldChange(client.id, 'projectName', e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <div className="fw-semibold text-dark">{client.customerName}</div>
                          <div className="text-muted extra-small">{client.projectName}</div>
                        </>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input 
                          type="date" 
                          className="form-control form-control-sm border font-monospace" 
                          value={client.startDate ? client.startDate.split('T')[0] : ''}
                          onChange={(e) => handleClientFieldChange(client.id, 'startDate', e.target.value)}
                        />
                      ) : (
                        <span className="badge bg-light text-dark border px-2 py-1 font-monospace">
                          {formatDate(client.startDate)}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-outline-primary btn-sm px-3 rounded-pill btn-view-configs fw-bold" onClick={() => handleOpenDetails(client)}>
                        <i className="bi bi-info-circle me-1"></i> Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details drawer / modal */}
      {showModal && selectedClient && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              
              {/* Modal Header */}
              <div className="modal-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="modal-header-icon-box">
                    <i className="bi bi-card-checklist text-white"></i>
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">{selectedClient.customerName}</h5>
                    <span className="extra-small text-muted-light">{selectedClient.projectName} ({selectedClient.ckycEnvironment})</span>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 bg-light-gray" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
                
                {/* Status KPI Banner */}
                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded-3 shadow-sm mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">Status Indicator:</span>
                    {getStatusBadge(selectedClient.status)}
                  </div>
                  <div className="small text-muted">
                    FPR Action Owner: <strong className="text-indigo">{selectedClient.clientFPR || 'N/A'}</strong>
                  </div>
                </div>

                {/* Modal Tab Selector */}
                <div className="d-flex border-bottom mb-4 bg-white rounded-3 shadow-sm p-1">
                  <button 
                    className={`btn btn-sm flex-grow-1 py-2 rounded-2 fw-bold border-0 ${modalTab === 'checklist' ? 'bg-indigo text-white shadow-sm' : 'text-muted bg-transparent'}`}
                    onClick={() => setModalTab('checklist')}
                  >
                    <i className="bi bi-card-checklist me-2"></i> Project Checklist
                  </button>
                  <button 
                    className={`btn btn-sm flex-grow-1 py-2 rounded-2 fw-bold border-0 ${modalTab === 'details' ? 'bg-indigo text-white shadow-sm' : 'text-muted bg-transparent'}`}
                    onClick={() => setModalTab('details')}
                  >
                    <i className="bi bi-info-circle me-2"></i> Client Information
                  </button>
                </div>

                {modalTab === 'checklist' ? (
                  <div className="modal-section-card bg-transparent mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded-3 shadow-sm border">
                      <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-check-all me-2 text-indigo"></i>CKYC Project Pipeline Checklist</h5>
                        <span className="badge bg-indigo-light text-indigo fw-bold">{selectedClient.tasks ? selectedClient.tasks.length : 37} Milestones Tracked</span>
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="d-flex gap-2">
                            <button className="btn btn-success btn-sm px-3 rounded-pill fw-bold shadow-sm" onClick={handleSave}>
                              <i className="bi bi-check-circle me-1"></i> Save Changes
                            </button>
                            <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-bold" onClick={handleCancel}>
                              <i className="bi bi-x-circle me-1"></i> Cancel
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-outline-indigo btn-sm px-3 rounded-pill fw-bold" onClick={handleEditToggle}>
                            <i className="bi bi-pencil-square me-1"></i> Edit Status
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '5px' }}>
                      {["Pre-Requisite", "Deployment", "Testing", "Sign-Off"].map((cat) => {
                        const catTasks = (selectedClient.tasks || []).filter(t => t.category === cat);
                        return (
                          <div key={cat} className="mb-4 bg-white rounded-3 shadow-sm p-3 border border-left-indigo-thick">
                            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                              <h6 className="fw-bold mb-0 text-indigo d-flex align-items-center gap-2">
                                <span className="category-marker bg-indigo"></span>
                                {cat} Milestone Steps
                              </h6>
                              <span className="badge bg-light text-indigo border px-2 py-1">{catTasks.length} Tasks</span>
                            </div>
                            
                            <div className="table-responsive">
                              <table className="table table-bordered table-hover align-middle small mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th style={{ width: '60px' }} className="text-center">Sr</th>
                                    <th>Milestone Subtask Description</th>
                                    <th style={{ width: '160px' }}>Action Owner</th>
                                    <th style={{ width: '90px' }} className="text-center">Days</th>
                                    <th style={{ width: '100px' }} className="text-center">UAT</th>
                                    <th style={{ width: '100px' }} className="text-center">Prod</th>
                                    <th>Remarks / Blockers</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {catTasks.map((task) => (
                                    <tr key={task.sr_no}>
                                      <td className="text-center fw-bold text-secondary">{task.sr_no}</td>
                                      <td className="fw-semibold text-dark">{task.subtask}</td>
                                      <td>
                                        {isEditing ? (
                                          <input 
                                            type="text" 
                                            className="form-control form-control-sm border" 
                                            value={task.owner}
                                            onChange={(e) => handleTaskFieldChange(selectedClient.id, task.sr_no, 'owner', e.target.value)}
                                          />
                                        ) : (
                                          <span className="badge bg-light text-dark border">{task.owner}</span>
                                        )}
                                      </td>
                                      <td className="text-center text-muted font-monospace">{task.days || '-'}</td>
                                      <td className="text-center">
                                        {isEditing ? (
                                          <select 
                                            className="form-select form-select-sm" 
                                            value={task.uat_status}
                                            onChange={(e) => handleTaskFieldChange(selectedClient.id, task.sr_no, 'uat_status', e.target.value)}
                                          >
                                            <option value="Completed">Completed</option>
                                            <option value="WIP">WIP</option>
                                            <option value="Yet to Start">Yet to Start</option>
                                            <option value="Pending">Pending</option>
                                            <option value="NA">NA</option>
                                          </select>
                                        ) : (
                                          renderStatusPill(task.uat_status)
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {isEditing ? (
                                          <select 
                                            className="form-select form-select-sm" 
                                            value={task.prod_status}
                                            onChange={(e) => handleTaskFieldChange(selectedClient.id, task.sr_no, 'prod_status', e.target.value)}
                                          >
                                            <option value="Completed">Completed</option>
                                            <option value="WIP">WIP</option>
                                            <option value="Yet to Start">Yet to Start</option>
                                            <option value="Pending">Pending</option>
                                            <option value="NA">NA</option>
                                          </select>
                                        ) : (
                                          renderStatusPill(task.prod_status)
                                        )}
                                      </td>
                                      <td>
                                        {isEditing ? (
                                          <input 
                                            type="text" 
                                            className="form-control form-control-sm border" 
                                            value={task.remark}
                                            onChange={(e) => handleTaskFieldChange(selectedClient.id, task.sr_no, 'remark', e.target.value)}
                                          />
                                        ) : (
                                          <span className="text-muted extra-small">
                                            {selectedClient.customerName === 'FiveStar' && task.sr_no === '5' 
                                              ? 'Ports are yet to be Opened for UAT' 
                                              : (task.remark || '-')}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {/* Column 1: Organization Data */}
                    <div className="col-md-6">
                      <div className="modal-section-card bg-white p-3 rounded-3 shadow-sm h-100">
                        <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark"><i className="bi bi-building me-2 text-blue"></i>Org Identifiers</h6>
                        <div className="info-detail-row">
                          <span className="info-detail-label">FI Code</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end fw-semibold" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.fiCode || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'fiCode', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val">{selectedClient.fiCode}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Region Code</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end fw-semibold" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.regionCode || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'regionCode', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val">{selectedClient.regionCode}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Branch Code</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end fw-semibold" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.branchCode || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'branchCode', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val">{selectedClient.branchCode}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Form Filled Date</span>
                          {isEditing ? (
                            <input 
                              type="date" 
                              className="form-control form-control-sm border text-end font-monospace" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.startDate ? selectedClient.startDate.split('T')[0] : ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'startDate', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val font-monospace">{formatDate(selectedClient.startDate)}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Expected End Date</span>
                          {isEditing ? (
                            <input 
                              type="date" 
                              className="form-control form-control-sm border text-end font-monospace" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.expectedEndDate ? selectedClient.expectedEndDate.split('T')[0] : ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'expectedEndDate', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val font-monospace">{formatDate(selectedClient.expectedEndDate)}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Client FPR</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end fw-semibold" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.clientFPR || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'clientFPR', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val text-indigo">{selectedClient.clientFPR || 'N/A'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Connectivity & Whitelisting */}
                    <div className="col-md-6">
                      <div className="modal-section-card bg-white p-3 rounded-3 shadow-sm h-100">
                        <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark"><i className="bi bi-shield-lock me-2 text-green"></i>Security & Credentials</h6>
                        <div className="info-detail-row">
                          <span className="info-detail-label">API Whitelist</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.apiIPWhitelisting || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'apiIPWhitelisting', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val text-truncate" style={{ maxWidth: '150px' }} title={selectedClient.apiIPWhitelisting}>{selectedClient.apiIPWhitelisting}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">SFTP URL</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.sftpUrl || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'sftpUrl', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val text-truncate" style={{ maxWidth: '150px' }} title={selectedClient.sftpUrl}>{selectedClient.sftpUrl}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">SFTP Port</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.sftpPortNo || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'sftpPortNo', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val">{selectedClient.sftpPortNo}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Cert Expiry</span>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-control form-control-sm border text-end" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.certificateInfo || ''}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'certificateInfo', e.target.value)}
                            />
                          ) : (
                            <span className="info-detail-val">{selectedClient.certificateInfo}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Assessed Env</span>
                          {isEditing ? (
                            <select 
                              className="form-select form-select-sm text-end fw-bold text-success" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.ckycEnvironment || 'UAT'}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'ckycEnvironment', e.target.value)}
                            >
                              <option value="UAT">UAT</option>
                              <option value="Production">Production</option>
                            </select>
                          ) : (
                            <span className="info-detail-val text-success fw-bold">{selectedClient.ckycEnvironment}</span>
                          )}
                        </div>
                        <div className="info-detail-row">
                          <span className="info-detail-label">Overall Status</span>
                          {isEditing ? (
                            <select 
                              className="form-select form-select-sm text-end fw-bold text-indigo" 
                              style={{ maxWidth: '180px' }}
                              value={selectedClient.status || 'Setup Stage'}
                              onChange={(e) => handleClientFieldChange(selectedClient.id, 'status', e.target.value)}
                            >
                              <option value="Active">Active</option>
                              <option value="Setup Stage">Setup Stage</option>
                              <option value="Pending Connection">Pending Connection</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          ) : (
                            <span className="info-detail-val text-indigo fw-bold">{selectedClient.status}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Row: SPOC details */}
                    <div className="col-12">
                      <div className="modal-section-card bg-white p-3 rounded-3 shadow-sm">
                        <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark"><i className="bi bi-people me-2 text-warning"></i>Points of Contact</h6>
                        <div className="row g-3">
                          <div className="col-md-6 border-end">
                            <div className="fw-bold small text-blue mb-2">Technical SPOC Details</div>
                            <div className="small mb-1">
                              Name: 
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm border mt-1" 
                                  value={selectedClient.technicalSPOCName || ''}
                                  onChange={(e) => handleClientFieldChange(selectedClient.id, 'technicalSPOCName', e.target.value)}
                                />
                              ) : (
                                <strong> {selectedClient.technicalSPOCName}</strong>
                              )}
                            </div>
                            <div className="small mb-1">
                              Email: 
                              {isEditing ? (
                                <input 
                                  type="email" 
                                  className="form-control form-control-sm border mt-1" 
                                  value={selectedClient.technicalSPOCEmail || ''}
                                  onChange={(e) => handleClientFieldChange(selectedClient.id, 'technicalSPOCEmail', e.target.value)}
                                />
                              ) : (
                                <a href={`mailto:${selectedClient.technicalSPOCEmail}`} className="text-decoration-none"> {selectedClient.technicalSPOCEmail}</a>
                              )}
                            </div>
                            <div className="small">
                              Phone: 
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm border mt-1" 
                                  value={selectedClient.technicalSPOCPhone || ''}
                                  onChange={(e) => handleClientFieldChange(selectedClient.id, 'technicalSPOCPhone', e.target.value)}
                                />
                              ) : (
                                <strong> {selectedClient.technicalSPOCPhone}</strong>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="fw-bold small text-green mb-2">Business SPOC Details</div>
                            <div className="small mb-1">
                              Name: 
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm border mt-1" 
                                  value={selectedClient.businessSPOCName || ''}
                                  onChange={(e) => handleClientFieldChange(selectedClient.id, 'businessSPOCName', e.target.value)}
                                />
                              ) : (
                                <strong> {selectedClient.businessSPOCName}</strong>
                              )}
                            </div>
                            <div className="small mb-1">
                              Email: 
                              {isEditing ? (
                                <input 
                                  type="email" 
                                  className="form-control form-control-sm border mt-1" 
                                  value={selectedClient.businessSPOCEmail || ''}
                                  onChange={(e) => handleClientFieldChange(selectedClient.id, 'businessSPOCEmail', e.target.value)}
                                />
                              ) : (
                                <a href={`mailto:${selectedClient.businessSPOCEmail}`} className="text-decoration-none"> {selectedClient.businessSPOCEmail}</a>
                              )}
                            </div>
                            <div className="small">
                              Phone: 
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm border mt-1" 
                                  value={selectedClient.businessSPOCPhone || ''}
                                  onChange={(e) => handleClientFieldChange(selectedClient.id, 'businessSPOCPhone', e.target.value)}
                                />
                              ) : (
                                <strong> {selectedClient.businessSPOCPhone}</strong>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-light-gradient border-top p-3 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={() => setShowModal(false)}>Close Status</button>
                <button type="button" className="btn btn-indigo text-white px-4 rounded-pill shadow-sm" onClick={() => alert('Configurations exported successfully to technical parameters list.')}>
                  <i className="bi bi-download me-1"></i> Export Profile
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Add New Client Modal */}
      {showAddClientModal && (
        <div className="add-date-modal-backdrop" onClick={() => setShowAddClientModal(false)}>
          <div className="add-date-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="add-date-modal-header">
              <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-person-plus me-2 text-indigo"></i>Add New Client Profile</h5>
              <button className="btn-close" onClick={() => setShowAddClientModal(false)} aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddClientSubmit}>
              <div className="add-date-modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary small">Client / Bank Display Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 border"
                    placeholder="e.g., FiveStar, HDFC Bank Ltd."
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary small">Project Name / Description</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 border"
                    placeholder="e.g., CKYC Project Implementation"
                    value={newClientProject}
                    onChange={(e) => setNewClientProject(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary small">FPR Resource (Action Owner)</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 border"
                    placeholder="e.g., Rajesh Nair, Vikram Grover"
                    value={newClientFPR}
                    onChange={(e) => setNewClientFPR(e.target.value)}
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Start Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-3 border"
                      value={newClientStartDate}
                      onChange={(e) => setNewClientStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Expected End Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-3 border"
                      value={newClientEndDate}
                      onChange={(e) => setNewClientEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Assessed Environment</label>
                    <select className="form-select border rounded-3" value={newClientEnv} onChange={(e) => setNewClientEnv(e.target.value)}>
                      <option value="UAT">UAT / Testbed</option>
                      <option value="Production">Production</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Overall Project Status</label>
                    <select className="form-select border rounded-3" value={newClientStatus} onChange={(e) => setNewClientStatus(e.target.value)}>
                      <option value="Setup Stage">Setup Stage</option>
                      <option value="Active">Active</option>
                      <option value="Pending Connection">Pending Connection</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="add-date-modal-footer p-3 bg-light d-flex justify-content-end gap-2 border-top">
                <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowAddClientModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-indigo text-white px-4 rounded-pill shadow-sm">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {saveSuccess && (
        <div className="success-toast-container shadow">
          <i className="bi bi-check-circle-fill"></i>
          <span>Changes Saved Successfully!</span>
        </div>
      )}
      <style>{`
        .client-status-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* KPI Cards Layout */
        .kpi-card {
          position: relative;
          transition: all 0.25s ease;
          border-left: 4px solid transparent;
        }
        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
        }
        .border-left-blue { border-left-color: #3b82f6; }
        .border-left-green { border-left-color: #10b981; }
        .border-left-warning { border-left-color: #f59e0b; }
        .border-left-danger { border-left-color: #ef4444; }
        .border-left-indigo-thick { border-left: 5px solid #4f46e5 !important; }
        .category-marker {
          width: 5px;
          height: 15px;
          background-color: #4f46e5;
          border-radius: 5px;
          display: inline-block;
        }

        .kpi-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .bg-light-blue { background-color: rgba(59, 130, 246, 0.1); }
        .text-blue { color: #3b82f6; }
        .bg-light-green { background-color: rgba(16, 185, 129, 0.1); }
        .text-green { color: #10b981; }
        .bg-light-warning { background-color: rgba(245, 158, 11, 0.1); }
        .text-warning { color: #f59e0b; }
        .bg-light-danger { background-color: rgba(239, 68, 68, 0.1); }
        .text-danger { color: #ef4444; }

        /* Filter elements */
        .filter-card {
          border: 1px solid rgba(0, 0, 0, 0.03);
        }

        /* Modern Table Adjustments */
        .client-row-hover:hover {
          background-color: #f8fafc;
        }
        .bg-light-gradient {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        /* Checklist Indicators */
        .check-success { color: #10b981; font-size: 16px; }
        .check-danger { color: #ef4444; font-size: 16px; }
        .check-warning { color: #f59e0b; font-size: 16px; }
        .check-muted { color: #94a3b8; font-size: 16px; }

        /* Status Pills */
        .status-pill {
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }
        .bg-success-gradient { background: var(--success-gradient); }
        .bg-warning-gradient { background: var(--warning-gradient); }
        .bg-danger-gradient { background: var(--danger-gradient); }
        .bg-orange-gradient { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }

        .btn-view-configs {
          transition: all 0.2s ease;
        }
        .btn-view-configs:hover {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: white !important;
        }

        /* Modal specific */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(4px);
        }
        .modal-dialog.modal-xl {
          width: 95% !important;
          max-width: 1600px !important;
          margin: 1.75rem auto;
        }
        .modal-header-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .text-muted-light {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }
        .bg-light-gray {
          background-color: #f8fafc;
        }
        .info-detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #e2e8f0;
        }
        .info-detail-row:last-child {
          border-bottom: none;
        }
        .info-detail-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }
        .info-detail-val {
          color: #1e293b;
          font-size: 13px;
          font-weight: 600;
        }
        .text-blue { color: #3b82f6 !important; }

        .btn-indigo {
          background-color: #4f46e5;
          color: white;
        }
        .btn-indigo:hover {
          background-color: #4338ca;
          color: white;
        }
        .bg-indigo {
          background-color: #4f46e5 !important;
        }
        .bg-indigo-light {
          background-color: rgba(79, 70, 229, 0.1) !important;
        }
        .text-indigo {
          color: #4f46e5 !important;
        }
        .btn-outline-indigo {
          border-color: #4f46e5;
          color: #4f46e5;
          background: transparent;
          transition: all 0.2s ease;
        }
        .btn-outline-indigo:hover {
          background-color: #4f46e5;
          color: white;
        }
        .table-success-light {
          background-color: rgba(16, 185, 129, 0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default ClientStatus;
