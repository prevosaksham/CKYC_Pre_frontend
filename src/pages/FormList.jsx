import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { formAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  // Handler to show info icon tooltip on hover
  const handleInfoMouseEnter = (e) => {
    const title = e.currentTarget.getAttribute('data-tip');
    if (title) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        text: title,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handleInfoMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Handler to show info icon title on click
  const handleInfoClick = (e) => {
    const title = e.currentTarget.getAttribute('data-tip');
    if (title) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        text: title,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      // Auto-hide tooltip after 3 seconds
      setTimeout(() => {
        setTooltip(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await formAPI.getAll();
      if (response.data.success) {
        setForms(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch forms:', error);
      alert('Error loading forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (formId) => {
    setShowModal(true);
    setModalLoading(true);
    try {
      const response = await formAPI.getById(formId);
      if (response.data.success) {
        setSelectedForm(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch form details:', error);
      alert('Error loading form details.');
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedForm) return;
    if (!window.confirm(`Are you sure you want to mark this form as ${status}?`)) return;

    setUpdating(true);
    try {
      const response = await formAPI.updateStatus(selectedForm.id, status);
      if (response.data.success) {
        alert(response.data.message);
        setShowModal(false);
        setSelectedForm(null);
        fetchForms();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Error updating status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteForm = async (formId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete the form for "${customerName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await formAPI.delete(formId);
      if (response.data.success) {
        alert('Form deleted successfully');
        fetchForms();
      }
    } catch (error) {
      console.error('Failed to delete form:', error);
      alert(error.response?.data?.message || 'Failed to delete form');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: 'status-pending',
      Approved: 'status-approved',
      Rejected: 'status-rejected',
    };
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStatusBadgeInline = (status) => {
    if (status === 'Yes') return <span className="badge bg-success">Yes</span>;
    if (status === 'No') return <span className="badge bg-danger">No</span>;
    if (status === 'Pass') return <span className="badge bg-success">Pass</span>;
    if (status === 'Fail') return <span className="badge bg-danger">Fail</span>;
    if (status === 'NA') return <span className="badge bg-secondary">N/A</span>;
    return <span className="badge bg-secondary">-</span>;
  };

  const getServerType = (selectedForm) => {
    if (!selectedForm) return '-';
    const types = [];
    if (selectedForm.serverTypePhysical) types.push('Physical');
    if (selectedForm.serverTypeCloud) types.push('Cloud');
    return types.length > 0 ? types.join(', ') : '-';
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-card">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-list-page">
      {/* Custom Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            zIndex: 9999,
            maxWidth: '250px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          onClick={() => setTooltip(prev => ({ ...prev, show: false }))}
        >
          {tooltip.text}
        </div>
      )}

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-0 fw-bold">All Pre-Requisite Forms</h5>
            {statusFilter && (
              <div className="mt-2">
                <span className="badge bg-light text-dark border me-2">
                  Status: {statusFilter}
                  <button 
                    type="button" 
                    className="btn-close ms-2" 
                    style={{ fontSize: '0.5rem' }}
                    onClick={() => setSearchParams({})}
                  ></button>
                </span>
                <button 
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={() => setSearchParams({})}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          {(!user || user.isAdmin || forms.length === 0) && (
            <Link to="/ckycform/form" className="btn btn-primary btn-sm">
              <i className="bi bi-plus-circle me-1"></i> New Form
            </Link>
          )}
        </div>

        {forms.filter(f => !statusFilter || f.status === statusFilter).length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '48px' }}></i>
            <p className="mt-3 text-muted">
              {statusFilter 
                ? `No forms found with status "${statusFilter}".` 
                : "No forms submitted yet."
              }
            </p>
            {!statusFilter ? (
              <Link to="/ckycform/form" className="btn btn-primary">
                <i className="bi bi-plus-circle me-1"></i> Create First Form
              </Link>
            ) : (
              <button 
                className="btn btn-outline-primary"
                onClick={() => setSearchParams({})}
              >
                Show All Forms
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover" id="formsTable">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Project Name</th>
                  <th>Environment</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms
                  .filter(f => !statusFilter || f.status === statusFilter)
                  .map((form, index) => (
                  <tr key={form.id}>
                    <td>{index + 1}</td>
                    <td>{form.customerName || '-'}</td>
                    <td>{form.projectName || '-'}</td>
                    <td>{form.ckycEnvironment || '-'}</td>
                    <td>{formatDate(form.created_at)}</td>
                    <td>{getStatusBadge(form.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-view"
                          onClick={() => handleViewDetails(form.id)}
                        >
                          <i className="bi bi-eye me-1"></i>View
                        </button>
                        {user && user.isAdmin && (
                          <button
                            className="btn btn-outline-danger btn-view"
                            onClick={() => handleDeleteForm(form.id, form.customerName)}
                            title="Delete Form"
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        )}
                        {user && !user.isAdmin && (
                          <>
                            {form.status === 'Pending' && (
                              <button
                                className="btn btn-outline-primary btn-view"
                                onClick={() => navigate(`/ckycform/form?id=${form.id}`)}
                              >
                                <i className="bi bi-pencil me-1"></i>Edit
                              </button>
                            )}
                            {form.ckycEnvironment === 'UAT' && !forms.some(f => f.ckycEnvironment === 'Production') && (
                              <button
                                className="btn btn-success btn-view"
                                onClick={() => navigate('/ckycform/form?env=prod')}
                              >
                                <i className="bi bi-plus-circle me-1"></i>Fill PROD Form
                              </button>
                            )}
                            {form.status === 'Rejected' && (
                              <button
                                className="btn btn-outline-secondary btn-view"
                                onClick={() => alert('This form has been rejected. Please contact the Protean team for further assistance.')}
                                title="Contact Protean team"
                              >
                                <i className="bi bi-telephone me-1"></i>Contact
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !modalLoading && setShowModal(false)}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-text me-2"></i>Form Details
                  {selectedForm && (
                    <span className="ms-2">{getStatusBadge(selectedForm.status)}</span>
                  )}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  disabled={modalLoading}
                ></button>
              </div>
              <div className="modal-body">
                {modalLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading details...</p>
                  </div>
                ) : selectedForm ? (
                  <>
                    {/* Section 1: Customer & Project Details */}
                    <div className="detail-section">
                      <h6><i className="bi bi-building me-2"></i>Customer & Project Details</h6>
                      <div className="detail-row"><span className="detail-label">Customer Name</span><span className="detail-value">{selectedForm.customerName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Project Name</span><span className="detail-value">{selectedForm.projectName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Environment</span><span className="detail-value">{selectedForm.ckycEnvironment ? <span className={`badge ${selectedForm.ckycEnvironment === 'UAT' ? 'bg-info' : 'bg-primary'}`}>{selectedForm.ckycEnvironment}</span> : '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Server Type</span><span className="detail-value">{getServerType(selectedForm)}</span></div>
                      <div className="detail-row"><span className="detail-label">Cloud/DC Provider</span><span className="detail-value">{selectedForm.cloudDCProvider || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Date of Assessment</span><span className="detail-value">{formatDate(selectedForm.dateOfAssessment)}</span></div>
                      <div className="detail-row"><span className="detail-label">Submitted By</span><span className="detail-value">{selectedForm.creator?.fullName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Submitted On</span><span className="detail-value">{formatDateTime(selectedForm.created_at)}</span></div>
                    </div>

                    {/* Section 2: Infrastructure Validation */}
                    <div className="detail-section">
                      <h6><i className="bi bi-hdd-network me-2"></i>Infrastructure Validation</h6>
                      <div className="detail-row"><span className="detail-label">Hardware Status</span><span className="detail-value">{renderStatusBadgeInline(selectedForm.hardwareUATStatus || selectedForm.hardwareProdStatus)}</span></div>
                      <div className="detail-row"><span className="detail-label">Hardware Remarks</span><span className="detail-value">{selectedForm.hardwareUATRemarks || selectedForm.hardwareProdRemarks || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Internet Connectivity</span><span className="detail-value">{renderStatusBadgeInline(selectedForm.internetConnectivityStatus)}</span></div>
                      <div className="detail-row"><span className="detail-label">Internet Remarks</span><span className="detail-value">{selectedForm.internetConnectivityRemarks || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">DNS Mapping</span><span className="detail-value">{renderStatusBadgeInline(selectedForm.dnsMappingStatus)}</span></div>
                      <div className="detail-row"><span className="detail-label">DNS Remarks</span><span className="detail-value">{selectedForm.dnsMappingRemarks || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Port 80/443</span><span className="detail-value">{renderStatusBadgeInline(selectedForm.port80443Status)}</span></div>
                      <div className="detail-row"><span className="detail-label">Port Remarks</span><span className="detail-value">{selectedForm.port80443Remarks || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Firewall</span><span className="detail-value">{renderStatusBadgeInline(selectedForm.firewallStatus)}</span></div>
                      <div className="detail-row"><span className="detail-label">Firewall Remarks</span><span className="detail-value">{selectedForm.firewallRemarks || '-'}</span></div>
                    </div>

                    {/* Section 3: Organization Details */}
                    <div className="detail-section">
                      <h6><i className="bi bi-building-check me-2"></i>Organization Onboarding</h6>
                      <div className="detail-row"><span className="detail-label">Organization Name</span><span className="detail-value">{selectedForm.organizationName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">FI Code</span><span className="detail-value">{selectedForm.fiCode || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Region Code</span><span className="detail-value">{selectedForm.regionCode || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Branch Code</span><span className="detail-value">{selectedForm.branchCode || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">KYC Branch</span><span className="detail-value">{selectedForm.kycBranch || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Verifier Name</span><span className="detail-value">{selectedForm.verifierName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Employee Code</span><span className="detail-value">{selectedForm.employeeCode || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Designation</span><span className="detail-value">{selectedForm.designation || '-'}</span></div>
                    </div>

                    {/* Section 4: Maker/Checker & SFTP */}
                    <div className="detail-section">
                      <h6><i className="bi bi-shield-lock me-2"></i>Credentials & SFTP</h6>
                      <div className="detail-row"><span className="detail-label">Maker User ID</span><span className="detail-value">{selectedForm.makerUserId || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Checker User ID</span><span className="detail-value">{selectedForm.checkerUserId || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">SFTP URL</span><span className="detail-value">{selectedForm.sftpUrl || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">SFTP Port</span><span className="detail-value">{selectedForm.sftpPortNo || '-'}</span></div>
                    </div>

                    {/* Section 5: Certificate & Bulk Download */}
                    <div className="detail-section">
                      <h6><i className="bi bi-file-earmark-lock me-2"></i>Certificate & Bulk Download</h6>
                      <div className="detail-row"><span className="detail-label">Certificate Info</span><span className="detail-value">{selectedForm.certificateInfo || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Bulk Download</span><span className="detail-value">{selectedForm.bulkDownloadEnabled ? <span className="badge bg-success">Enabled</span> : <span className="badge bg-secondary">Disabled</span>}</span></div>
                    </div>

                    {/* Section 6: IP Whitelisting */}
                    <div className="detail-section">
                      <h6><i className="bi bi-globe me-2"></i>API & IP Whitelisting</h6>
                      <div className="detail-row"><span className="detail-label">API IP Whitelisting</span><span className="detail-value">{selectedForm.apiIPWhitelisting || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Microservice IP</span><span className="detail-value">{selectedForm.microserviceIPWhitelisting || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">IP Whitelisting Confirmed</span><span className="detail-value">{selectedForm.ipWhitelistingConfirmed || '-'}</span></div>
                    </div>

                    {/* Section 7: Points of Contact */}
                    <div className="detail-section">
                      <h6><i className="bi bi-people me-2"></i>Points of Contact</h6>
                      <div className="detail-row"><span className="detail-label">Technical SPOC</span><span className="detail-value">{selectedForm.technicalSPOCName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Technical Email</span><span className="detail-value">{selectedForm.technicalSPOCEmail || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Technical Phone</span><span className="detail-value">{selectedForm.technicalSPOCPhone || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Business SPOC</span><span className="detail-value">{selectedForm.businessSPOCName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Business Email</span><span className="detail-value">{selectedForm.businessSPOCEmail || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Business Phone</span><span className="detail-value">{selectedForm.businessSPOCPhone || '-'}</span></div>
                    </div>

                    {/* Section 8: Sign-Off */}
                    <div className="detail-section">
                      <h6><i className="bi bi-pen me-2"></i>Sign-Off</h6>
                      <div className="detail-row"><span className="detail-label">Sign-Off Name</span><span className="detail-value">{selectedForm.signOffName || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Designation</span><span className="detail-value">{selectedForm.signOffDesignation || '-'}</span></div>
                      <div className="detail-row"><span className="detail-label">Sign-Off Date</span><span className="detail-value">{formatDate(selectedForm.signOffDate)}</span></div>
                    </div>
                  </>
                ) : (
                  <div className="alert alert-danger">Error loading form details.</div>
                )}
              </div>
              <div className="modal-footer">
                {user && user.isAdmin && selectedForm && selectedForm.status === 'Pending' && (
                  <div className="me-auto d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleStatusUpdate('Approved')}
                      disabled={updating}
                    >
                      {updating && <span className="spinner-border spinner-border-sm me-1"></span>}
                      <i className="bi bi-check-circle me-1"></i>Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate('Rejected')}
                      disabled={updating}
                    >
                      {updating && <span className="spinner-border spinner-border-sm me-1"></span>}
                      <i className="bi bi-x-circle me-1"></i>Reject
                    </button>
                  </div>
                )}
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}


      <style>{`
        .dashboard-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-approved { background-color: #d4edda; color: #155724; }
        .status-rejected { background-color: #f8d7da; color: #721c24; }
        .btn-view { padding: 4px 12px; font-size: 13px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: flex-start; justify-content: center; z-index: 1050; padding: 20px; overflow-y: auto; }
        .modal-dialog { width: 100%; max-width: 1000px; margin: 30px auto; position: relative; }
        .modal-content { background: white; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 60px); }
        .modal-header { padding: 16px 20px; border-bottom: 1px solid #dee2e6; flex-shrink: 0; }
        .modal-body { padding: 20px; overflow-y: auto; flex: 1 1 auto; min-height: 0; }
        .modal-footer { padding: 16px 20px; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; flex-shrink: 0; }
        .detail-section { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .detail-section h6 { color: #495057; border-bottom: 2px solid #dee2e6; padding-bottom: 10px; margin-bottom: 15px; }
        .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .detail-label { font-weight: 500; color: #6c757d; min-width: 200px; flex-shrink: 0; }
        .detail-value { color: #212529; }
        .btn-close-white { filter: invert(1); }
      `}</style>
    </div>
  );
};

export default FormList;
