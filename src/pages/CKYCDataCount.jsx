import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ckycData from '../data/ckyc-data.json';

const CKYCDataCount = () => {
  // 1. Initialize state with granular flat Excel records (Supporting LocalStorage Persistence)
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('ckyc_records');
    if (!saved) return ckycData.records;
    
    try {
      const parsed = JSON.parse(saved);
      let updated = false;
      
      const merged = parsed.map(pRec => {
        const dbRec = ckycData.records.find(dRec => dRec.client_name === pRec.client_name && dRec.date === pRec.date);
        if (dbRec) {
          const dbSum = dbRec.single_search + dbRec.bulk_search + dbRec.bulk_sftp + dbRec.download_api + dbRec.download_sftp + dbRec.upload;
          const pSum = pRec.single_search + pRec.bulk_search + pRec.bulk_sftp + pRec.download_api + pRec.download_sftp + pRec.upload;
          if (dbSum > pSum) {
            updated = true;
            return { ...pRec, ...dbRec };
          }
        }
        return pRec;
      });

      ckycData.records.forEach(dRec => {
        const exists = merged.some(mRec => mRec.client_name === dRec.client_name && mRec.date === dRec.date);
        if (!exists) {
          merged.push(dRec);
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem('ckyc_records', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch (e) {
      console.error("Error parsing ckyc_records from localStorage", e);
      return ckycData.records;
    }
  });

  // Dynamically compute clients and dates from current records state
  const uniqueClients = Array.from(new Set(records.map(r => r.client_name)));
  const uniqueDates = Array.from(new Set(records.map(r => r.date)));

  const [activeClient, setActiveClient] = useState(uniqueClients[0] || 'Speel Finance');
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedDate, setSelectedDate] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit, Save, and Add Record States
  const [isEditing, setIsEditing] = useState(false);
  const [backupRecords, setBackupRecords] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState('');

  // Spreadsheet pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // 2. Dynamic Calculations from React State (Filtered by active client)
  const clientRecords = records.filter(r => r.client_name === activeClient);
  const totalSingleSearch = clientRecords.reduce((acc, r) => acc + r.single_search, 0);
  const totalBulkSearch = clientRecords.reduce((acc, r) => acc + r.bulk_search, 0);
  const totalBulkSftp = clientRecords.reduce((acc, r) => acc + r.bulk_sftp, 0);
  const totalDownloadApi = clientRecords.reduce((acc, r) => acc + r.download_api, 0);
  const totalDownloadSftp = clientRecords.reduce((acc, r) => acc + r.download_sftp, 0);
  const totalUpload = clientRecords.reduce((acc, r) => acc + r.upload, 0);

  // 3. Recalculate Chart Data dynamically for the selected client & range
  const getRecalculatedChartData = () => {
    const grouped = {};
    uniqueDates.forEach(d => {
      grouped[d] = 0;
    });

    // Group only for the currently active client! (Adds highly focused client analytics)
    records.forEach(r => {
      if (r.client_name === activeClient) {
        const rowSum = 
          r.single_search + r.bulk_search + r.bulk_sftp + 
          r.download_api + r.download_sftp + r.upload;
        if (grouped[r.date] !== undefined) {
          grouped[r.date] += rowSum;
        }
      }
    });

    const formattedData = uniqueDates.map(date => ({
      label: date,
      value: grouped[date]
    }));

    if (timeRange === 'today') {
      return formattedData.slice(-6);
    }
    if (timeRange === '7days') {
      return formattedData.slice(-7);
    }
    return formattedData; // 30 Days / All active dates
  };

  const activeChartData = getRecalculatedChartData();

  // Handler for inline data cell editing
  const handleCellEdit = (id, field, value) => {
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0) return;

    setRecords(prev => prev.map(rec => 
      rec.id === id ? { ...rec, [field]: numericValue } : rec
    ));
  };

  // Start editing mode
  const handleEditToggle = () => {
    setBackupRecords(JSON.parse(JSON.stringify(records)));
    setIsEditing(true);
  };

  // Save changes to localStorage
  const handleSave = () => {
    localStorage.setItem('ckyc_records', JSON.stringify(records));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Revert changes
  const handleCancel = () => {
    setRecords(backupRecords);
    setIsEditing(false);
  };

  // Add new date record initialized to 0 for all clients
  const handleAddNewDate = (e) => {
    e.preventDefault();
    if (!newDate.trim()) return;

    const dateExists = records.some(r => r.date.toLowerCase() === newDate.trim().toLowerCase());
    if (dateExists) {
      alert("This date already exists. You can select it from the date filter above and edit its values.");
      return;
    }

    const newRecords = uniqueClients.map((client, idx) => ({
      id: `rec-new-${Date.now()}-${idx}`,
      client_name: client,
      date: newDate.trim(),
      single_search: 0,
      bulk_search: 0,
      bulk_sftp: 0,
      download_api: 0,
      download_sftp: 0,
      upload: 0
    }));

    const updated = [...records, ...newRecords];
    setRecords(updated);
    localStorage.setItem('ckyc_records', JSON.stringify(updated));
    setSelectedDate(newDate.trim());
    setNewDate('');
    setShowAddModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper to parse date strings for sorting (e.g. "6 May", "16 & 17 May", "2 June")
  const parseCustomDate = (dateStr) => {
    if (!dateStr) return 0;
    const cleaned = dateStr.trim();
    const parts = cleaned.split(/\s+/);
    let monthStr = '';
    let dayNum = 1;
    if (parts.length > 0) {
      monthStr = parts[parts.length - 1].toLowerCase();
      const numbers = cleaned.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        dayNum = Math.max(...numbers.map(Number));
      }
    }
    const monthMap = {
      may: 4,
      jun: 5, june: 5
    };
    const monthIdx = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 4;
    return new Date(2026, monthIdx, dayNum).getTime();
  };

  // Filter and sort records from newest (today's date) to oldest
  const filteredRecords = records
    .filter(r => {
      const matchesClient = r.client_name === activeClient;
      const matchesDate = selectedDate === 'All' || r.date === selectedDate;
      const matchesSearch = r.date.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesClient && matchesDate && matchesSearch;
    })
    .sort((a, b) => parseCustomDate(b.date) - parseCustomDate(a.date));

  // Paginated client rows
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Dynamic CSV Export scoped to the active client
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Client Name,Date,Single Search,Bulk Search,Bulk Search SFTP,Download API,Download SFTP,Data Upload,Total Row Volume\n`;
    
    records.filter(r => r.client_name === activeClient).forEach(r => {
      const rowSum = r.single_search + r.bulk_search + r.bulk_sftp + r.download_api + r.download_sftp + r.upload;
      csvContent += `"${r.client_name}","${r.date}",${r.single_search},${r.bulk_search},${r.bulk_sftp},${r.download_api},${r.download_sftp},${r.upload},${rowSum}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ckyc_excel_${activeClient.replace(/\s+/g, '_')}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for rendering custom SVG spline chart beautifully
  const renderSVGChart = () => {
    const dataPoints = activeChartData;
    const width = 800;
    const height = 280;
    const paddingLeft = 60;
    const paddingRight = 30;
    const paddingTop = 35;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...dataPoints.map(d => d.value)) * 1.15 || 1000;
    const minVal = 0;

    // Map coordinates
    const coordinates = dataPoints.map((point, index) => {
      const x = paddingLeft + (index / (dataPoints.length - 1 || 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((point.value - minVal) / (maxVal - minVal || 1)) * chartHeight;
      return { x, y, label: point.label, val: point.value };
    });

    // Spline curve construction
    let pathD = '';
    if (coordinates.length > 0) {
      pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
      for (let i = 0; i < coordinates.length - 1; i++) {
        const cpX1 = coordinates[i].x + (coordinates[i + 1].x - coordinates[i].x) / 3;
        const cpY1 = coordinates[i].y;
        const cpX2 = coordinates[i].x + 2 * (coordinates[i + 1].x - coordinates[i].x) / 3;
        const cpY2 = coordinates[i + 1].y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coordinates[i + 1].x} ${coordinates[i + 1].y}`;
      }
    }

    // Gradient area path definition
    let areaD = '';
    if (coordinates.length > 0) {
      areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${paddingTop + chartHeight} L ${coordinates[0].x} ${paddingTop + chartHeight} Z`;
    }

    // Grid values
    const gridCount = 4;
    const gridLines = [];
    for (let i = 0; i <= gridCount; i++) {
      const val = minVal + (i / gridCount) * (maxVal - minVal);
      const y = paddingTop + chartHeight - (i / gridCount) * chartHeight;
      gridLines.push({ y, val: Math.round(val) });
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart-element w-100 h-100">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line 
              x1={paddingLeft} 
              y1={line.y} 
              x2={width - paddingRight} 
              y2={line.y} 
              stroke="#e2e8f0" 
              strokeWidth="1" 
              strokeDasharray={idx === 0 ? "0" : "5,5"}
            />
            <text 
              x={paddingLeft - 10} 
              y={line.y + 4} 
              fill="#94a3b8" 
              fontSize="10" 
              textAnchor="end"
              fontWeight="500"
            >
              {line.val >= 1000 ? `${(line.val / 1000).toFixed(1)}k` : line.val}
            </text>
          </g>
        ))}

        {/* Gradient fill under curve */}
        {areaD && <path d={areaD} fill="url(#chartGradient)" />}

        {/* The smooth curve path */}
        {pathD && (
          <path 
            d={pathD} 
            fill="none" 
            stroke="url(#lineGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
        )}

        {/* Data points & tooltips */}
        {coordinates.map((pt, idx) => {
          const totalPoints = coordinates.length;
          const labelInterval = totalPoints > 15 ? Math.ceil(totalPoints / 7) : (totalPoints > 8 ? 2 : 1);
          const showLabel = idx % labelInterval === 0 || idx === totalPoints - 1;

          return (
            <g key={idx} className="chart-node-group">
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="4.5" 
                fill="#ffffff" 
                stroke="#6366f1" 
                strokeWidth="2.5" 
              />
              {/* Value popover text */}
              <text 
                x={pt.x} 
                y={pt.y - 12} 
                fill="#4f46e5" 
                fontSize="9" 
                fontWeight="bold" 
                textAnchor="middle"
                className="chart-value-label"
              >
                {pt.val.toLocaleString()}
              </text>
              {/* Axis Label */}
              {showLabel && (
                <text 
                  x={pt.x} 
                  y={paddingTop + chartHeight + 20} 
                  fill="#64748b" 
                  fontSize="10" 
                  fontWeight="600" 
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="ckyc-data-count-container fade-in-up">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">CKYC Spreadsheet & Live Analytics</h1>
          <p className="text-muted small mb-0">Select a client below to filter, view, and edit their Excel transactional log metrics in real-time.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {isEditing ? (
            <>
              <button className="btn btn-success btn-sm d-flex align-items-center gap-1 shadow-sm px-3 rounded-pill fw-bold" onClick={handleSave}>
                <i className="bi bi-check-circle"></i> Save Changes
              </button>
              <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm px-3 rounded-pill fw-bold bg-white" onClick={handleCancel}>
                <i className="bi bi-x-circle"></i> Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm px-3 rounded-pill fw-bold" onClick={handleEditToggle}>
                <i className="bi bi-pencil-square"></i> Edit Mode
              </button>
              <button className="btn btn-indigo btn-sm d-flex align-items-center gap-1 shadow-sm px-3 rounded-pill fw-bold text-white" onClick={() => setShowAddModal(true)}>
                <i className="bi bi-calendar-plus"></i> Add New Date
              </button>
            </>
          )}
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 px-3 rounded-pill fw-bold" onClick={exportToCSV}>
            <i className="bi bi-file-earmark-spreadsheet"></i> Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Recalculates reactively) */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 col-6">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-blue">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted extra-small d-block mb-1">Single Search</span>
                <h3 className="fw-bold mb-0 text-dark">{totalSingleSearch.toLocaleString()}</h3>
              </div>
              <div className="kpi-icon-box bg-light-blue text-blue">
                <i className="bi bi-search"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-green">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted extra-small d-block mb-1">Bulk Search</span>
                <h3 className="fw-bold mb-0 text-success">{totalBulkSearch.toLocaleString()}</h3>
              </div>
              <div className="kpi-icon-box bg-light-green text-green">
                <i className="bi bi-file-earmark-medical"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-cyan">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted extra-small d-block mb-1">Bulk Search SFTP</span>
                <h3 className="fw-bold mb-0 text-cyan">{totalBulkSftp.toLocaleString()}</h3>
              </div>
              <div className="kpi-icon-box bg-light-cyan text-cyan">
                <i className="bi bi-folder-symlink"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted extra-small d-block mb-1">Download API</span>
                <h3 className="fw-bold mb-0 text-warning">{totalDownloadApi.toLocaleString()}</h3>
              </div>
              <div className="kpi-icon-box bg-light-warning text-warning">
                <i className="bi bi-cloud-download"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-indigo">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted extra-small d-block mb-1">Download SFTP</span>
                <h3 className="fw-bold mb-0 text-indigo">{totalDownloadSftp.toLocaleString()}</h3>
              </div>
              <div className="kpi-icon-box bg-light-indigo text-indigo">
                <i className="bi bi-download"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6">
          <div className="kpi-card bg-white p-3 rounded-4 shadow-sm border-left-purple">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted extra-small d-block mb-1">Data Upload</span>
                <h3 className="fw-bold mb-0 text-purple">{totalUpload.toLocaleString()}</h3>
              </div>
              <div className="kpi-icon-box bg-light-purple text-purple">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recalculating Chart Card (Scoped to the active client!) */}
      <div className="dashboard-card bg-white p-4 rounded-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-0 fw-bold text-dark">{activeClient} — Data Volume Trajectory</h5>
            <span className="text-muted extra-small">Real-time updating transaction distribution curves for the active client</span>
          </div>
          
          {/* Time range controller */}
          <div className="btn-group shadow-sm rounded-pill p-1 bg-light border" role="group">
            <button 
              type="button" 
              className={`btn btn-sm rounded-pill border-0 px-3 ${timeRange === 'today' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
              onClick={() => setTimeRange('today')}
            >
              Today
            </button>
            <button 
              type="button" 
              className={`btn btn-sm rounded-pill border-0 px-3 ${timeRange === '7days' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
              onClick={() => setTimeRange('7days')}
            >
              Last 7 Days
            </button>
            <button 
              type="button" 
              className={`btn btn-sm rounded-pill border-0 px-3 ${timeRange === '30days' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
              onClick={() => setTimeRange('30days')}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Spline Chart */}
        <div className="chart-wrapper rounded-3 p-2 bg-light-gradient border border-light" style={{ height: '300px' }}>
          {renderSVGChart()}
        </div>
      </div>

      {/* Live spreadsheet editor matrix */}
      <div className="dashboard-card bg-white p-0 rounded-4 shadow-sm overflow-hidden mb-4">
        
        {/* CLIENT TABS (Click to filter client) */}
        <div className="border-bottom p-1 bg-light">
          <ul className="nav nav-pills client-pill-bar d-flex flex-nowrap overflow-auto gap-2 p-2">
            {uniqueClients.map(c => (
              <li key={c} className="nav-item">
                <button 
                  className={`nav-link rounded-3 px-4 py-2 border-0 fw-bold d-flex align-items-center gap-2 ${activeClient === c ? 'active bg-indigo text-white shadow-sm' : 'text-muted bg-white'}`}
                  onClick={() => { setActiveClient(c); setCurrentPage(1); }}
                >
                  <i className="bi bi-building"></i>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* DATE FILTERS (Above the fields) */}
        <div className="p-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 bg-light-gradient">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-indigo-light text-indigo px-3 py-2 rounded-3 fw-bold">Active Client: {activeClient}</span>
          </div>
          
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="d-flex align-items-center gap-2" style={{ minWidth: '180px' }}>
              <span className="text-muted small text-nowrap">Filter Date:</span>
              <select className="form-select form-select-sm bg-white border" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}>
                <option value="All">All Dates</option>
                {uniqueDates.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ maxWidth: '200px' }}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control bg-white border-start-0"
                  placeholder="Search dates..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Excel Spreadsheet Fields below the date filters */}
        {currentRecords.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '48px' }}></i>
            <p className="mt-3 text-muted">No records match the active date filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table mb-0 align-middle table-spreadsheet">
              <thead>
                <tr>
                  <th style={{ width: '60px' }} className="text-center">#</th>
                  <th style={{ width: '150px' }}>Date</th>
                  <th className="text-center">Single Search</th>
                  <th className="text-center">Bulk Search</th>
                  <th className="text-center">Bulk Search SFTP</th>
                  <th className="text-center">Download API</th>
                  <th className="text-center">Download SFTP</th>
                  <th className="text-center">Data Upload</th>
                  <th className="text-center bg-indigo-light text-indigo fw-bold" style={{ width: '130px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((row, index) => {
                  const absoluteIdx = indexOfFirstRecord + index + 1;
                  const rowSum = row.single_search + row.bulk_search + row.bulk_sftp + row.download_api + row.download_sftp + row.upload;
                  
                  return (
                    <tr key={row.id} className="spreadsheet-row">
                      <td className="text-center text-muted small bg-light-cell">{absoluteIdx}</td>
                      <td className="fw-bold text-dark bg-light-cell">{row.date}</td>
                      
                      {/* Interactive inline editable cells */}
                      <td className="p-0 text-center">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={row.single_search}
                            onChange={(e) => handleCellEdit(row.id, 'single_search', e.target.value)}
                            className="spreadsheet-input"
                            min="0"
                          />
                        ) : (
                          <span className="spreadsheet-value">{row.single_search.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-0 text-center">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={row.bulk_search}
                            onChange={(e) => handleCellEdit(row.id, 'bulk_search', e.target.value)}
                            className="spreadsheet-input"
                            min="0"
                          />
                        ) : (
                          <span className="spreadsheet-value">{row.bulk_search.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-0 text-center">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={row.bulk_sftp}
                            onChange={(e) => handleCellEdit(row.id, 'bulk_sftp', e.target.value)}
                            className="spreadsheet-input"
                            min="0"
                          />
                        ) : (
                          <span className="spreadsheet-value">{row.bulk_sftp.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-0 text-center">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={row.download_api}
                            onChange={(e) => handleCellEdit(row.id, 'download_api', e.target.value)}
                            className="spreadsheet-input"
                            min="0"
                          />
                        ) : (
                          <span className="spreadsheet-value">{row.download_api.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-0 text-center">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={row.download_sftp}
                            onChange={(e) => handleCellEdit(row.id, 'download_sftp', e.target.value)}
                            className="spreadsheet-input"
                            min="0"
                          />
                        ) : (
                          <span className="spreadsheet-value">{row.download_sftp.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-0 text-center">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={row.upload}
                            onChange={(e) => handleCellEdit(row.id, 'upload', e.target.value)}
                            className="spreadsheet-input"
                            min="0"
                          />
                        ) : (
                          <span className="spreadsheet-value">{row.upload.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="text-center fw-bold bg-light-indigo text-indigo">
                        {rowSum.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light-gradient">
            <span className="text-muted extra-small">
              Showing rows {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length}
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0 rounded-pill shadow-sm overflow-hidden border">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link border-0 px-3" onClick={() => handlePageChange(currentPage - 1)}>
                    <i className="bi bi-chevron-left"></i> Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link border-0 px-3" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link border-0 px-3" onClick={() => handlePageChange(currentPage + 1)}>
                    Next <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Styled Sheets */}
      <style>{`
        .ckyc-data-count-container {
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
        .border-left-cyan { border-left-color: #06b6d4; }
        .border-left-warning { border-left-color: #f59e0b; }
        .border-left-indigo { border-left-color: #6366f1; }
        .border-left-purple { border-left-color: #8b5cf6; }

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
        .bg-light-cyan { background-color: rgba(6, 182, 212, 0.1); }
        .text-cyan { color: #06b6d4; }
        .bg-light-warning { background-color: rgba(245, 158, 11, 0.1); }
        .text-warning { color: #f59e0b; }
        .bg-light-indigo { background-color: rgba(99, 102, 241, 0.1); }
        .text-indigo { color: #6366f1; }
        .bg-light-purple { background-color: rgba(139, 92, 246, 0.1); }
        .text-purple { color: #8b5cf6; }

        /* Chart configurations */
        .chart-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svg-chart-element {
          display: block;
        }

        .chart-node-group:hover circle {
          r: 6;
          fill: #4f46e5;
          stroke: #ffffff;
        }

        .chart-node-group .chart-value-label {
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
        }

        .chart-node-group:hover .chart-value-label {
          opacity: 1;
        }

        /* Client Pill Bar */
        .client-pill-bar {
          padding-bottom: 5px;
        }
        .client-pill-bar button {
          transition: all 0.25s ease;
          font-size: 14px;
        }
        .bg-indigo {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        }
        .text-indigo {
          color: #4f46e5 !important;
        }
        .bg-indigo-light {
          background-color: rgba(79, 70, 229, 0.1);
        }

        /* Spreadsheet Styling */
        .table-spreadsheet th {
          background-color: #f8fafc;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #cbd5e1;
          padding: 12px 8px;
        }
        .spreadsheet-row {
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.15s;
        }
        .spreadsheet-row:hover {
          background-color: #f1f5f9;
        }
        .bg-light-cell {
          background-color: #f8fafc;
        }
        .bg-total-cell {
          background-color: #f1f5f9;
          font-size: 13.5px;
          color: #1e293b !important;
        }
        .spreadsheet-input {
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          text-align: center;
          padding: 8px 4px;
          font-size: 13px;
          font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #334155;
          transition: all 0.15s ease;
          border-radius: 4px;
        }
        .spreadsheet-input:hover {
          background-color: #ffffff;
          border-color: #cbd5e1;
        }
        .spreadsheet-input:focus {
          background-color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
          outline: none;
          font-weight: 600;
        }
        
        .spreadsheet-input::-webkit-outer-spin-button,
        .spreadsheet-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .spreadsheet-input[type=number] {
          -moz-appearance: textfield;
        }

        .bg-light-gradient {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .spreadsheet-value {
          display: block;
          padding: 8px 4px;
          font-size: 13px;
          font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #334155;
          font-weight: 500;
        }

        .btn-indigo {
          background-color: #4f46e5;
          color: white;
        }
        .btn-indigo:hover {
          background-color: #4338ca;
          color: white;
        }

        /* Add Date Modal Styling */
        .add-date-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .add-date-modal-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalSlideUp {
          from { transform: translateY(30px) scale(0.96); }
          to { transform: translateY(0) scale(1); }
        }

        .add-date-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .success-toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2100;
          background: #10b981;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes toastSlideIn {
          from { transform: translateY(20px) opacity: 0; }
          to { transform: translateY(0) opacity: 1; }
        }
      `}</style>

      {/* Add New Date Modal */}
      {showAddModal && (
        <div className="add-date-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="add-date-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="add-date-modal-header">
              <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-calendar-plus me-2 text-indigo"></i>Add New Date Record</h5>
              <button className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddNewDate}>
              <div className="add-date-modal-body p-4">
                <p className="text-muted small mb-4">Entering a new date will automatically initialize transaction cells to 0 for all unique clients, allowing you to edit them in Edit Mode.</p>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary small">Enter Date / Period Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg rounded-3 border"
                    placeholder="e.g., 23 May, 3 June"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    autoFocus
                  />
                  <div className="form-text extra-small text-muted mt-2">Use the format of existing dates (e.g. "23 May" or "23 & 24 May").</div>
                </div>
              </div>
              <div className="add-date-modal-footer p-3 bg-light d-flex justify-content-end gap-2 border-top">
                <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-indigo text-white px-4 rounded-pill shadow-sm">Create Date</button>
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
    </div>
  );
};

export default CKYCDataCount;
