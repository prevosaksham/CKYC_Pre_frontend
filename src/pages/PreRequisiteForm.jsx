import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { formAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from '../assets/logo.png';

// Add custom styles for better visibility and premium feel
const customStyles = `
  .form-select {
    cursor: pointer !important;
    border: 1px solid #ced4da !important;
    transition: all 0.2s ease-in-out !important;
    background-color: #f8f9fa !important;
    font-weight: 500 !important;
  }
  .form-select:hover {
    border-color: #eb9200 !important;
    background-color: #ffffff !important;
  }
  .form-select:focus {
    border-color: #eb9200 !important;
    box-shadow: 0 0 0 0.25rem rgba(235, 146, 0, 0.25) !important;
    outline: 0 !important;
  }
  .view-mode input, .view-mode select, .view-mode textarea {
    pointer-events: none !important;
    background-color: #e9ecef !important;
    color: #6c757d !important;
  }
  .view-mode .infra-table th:nth-child(3), .view-mode .infra-table td:nth-child(3),
  .view-mode .infra-table th:nth-child(4), .view-mode .infra-table td:nth-child(4) {
    display: none;
  }
  .view-mode .org-table th:nth-child(4), .view-mode .org-table td:nth-child(4) {
    display: none;
  }
  .view-mode .text-danger {
    display: none !important;
  }
  .user-profile-section {
    position: relative;
  }
  .user-pill {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 50px;
    padding: 2px 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .user-pill:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
  .user-avatar-sm {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #eb9200 0%, #ffb347 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
  }
  .user-name-link-sm {
    font-weight: 600;
    color: #374151;
    text-decoration: none;
    padding: 0 10px;
    font-size: 13px;
    border-left: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
    transition: color 0.2s;
  }
  .user-name-link-sm:hover {
    color: #eb9200;
  }
  .profile-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-width: 180px;
    padding: 8px 0;
    z-index: 1000;
  }
  .dropdown-item-custom {
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
    font-size: 14px;
    text-decoration: none;
  }
  .dropdown-item-custom:hover {
    background-color: #f3f4f6;
  }
  .dropdown-divider-custom {
    margin: 8px 0;
    border-top: 1px solid #e5e7eb;
  }
  .zoom-lightbox-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    animation: fadeIn 0.25s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .zoom-lightbox-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
    z-index: 2002;
  }
  .zoom-lightbox-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .zoom-lightbox-close {
    background: none;
    border: none;
    color: rgba(255,255,255,0.8);
    font-size: 1.8rem;
    cursor: pointer;
    transition: color 0.2s;
  }
  .zoom-lightbox-close:hover {
    color: white;
  }
  .zoom-lightbox-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: grab;
  }
  .zoom-lightbox-viewport.dragging {
    cursor: grabbing;
  }
  .zoom-lightbox-image {
    max-width: 90%;
    max-height: 80%;
    object-fit: contain;
    transition: transform 0.1s ease-out;
    transform-origin: center center;
    pointer-events: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  .zoom-lightbox-controls {
    position: absolute;
    bottom: 30px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2002;
  }
  .zoom-btn {
    background: none;
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }
  .zoom-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  .zoom-btn:active {
    transform: scale(0.95);
  }
  .zoom-scale-indicator {
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    min-width: 60px;
    text-align: center;
  }
  .clickable-arch-img {
    cursor: zoom-in;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .clickable-arch-img:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
  }
`;

const PreRequisiteForm = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isViewMode = queryParams.get('mode') === 'view';
  const envParam = queryParams.get('env');

  const [activeTab, setActiveTab] = useState(envParam === 'prod' ? 'prod' : 'uat');
  const [activeInnerTab, setActiveInnerTab] = useState('infra');
  const [showArchModal, setShowArchModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showImportantNote, setShowImportantNote] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [formError, setFormError] = useState('');
  const [activeProdInnerTab, setActiveProdInnerTab] = useState('infra');
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  // Zoom Lightbox States
  const [zoomImageSrc, setZoomImageSrc] = useState(null);
  const [zoomImageTitle, setZoomImageTitle] = useState('');
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleOpenZoom = (src, title) => {
    setZoomImageSrc(src);
    setZoomImageTitle(title);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCloseZoom = () => {
    setZoomImageSrc(null);
    setZoomImageTitle('');
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Inject custom styles
  useState(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
  }, []);

  // Get today's date in YYYY-MM-DD format for date validation
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    // Customer & Project Details
    customerName: '',
    projectName: 'CKYC',
    environmentUAT: true,
    environmentProd: false,
    serverTypePhysical: false,
    serverTypeCloud: false,
    cloudDCProvider: '',
    dateOfAssessment: '',

    // Infrastructure Validation
    hardwareUATStatus: '',
    hardwareUATRemarks: '',
    osNameVersion: '',
    osNameVersionRemarks: '',
    internetConnectivityStatus: '',
    internetConnectivityRemarks: '',

    dnsMappingStatus: '',
    dnsMappingRemarks: '',
    portStatus: '',
    portRemarks: '',
    firewallStatus: '',
    firewallRemarks: '',

    rootAccessStatus: '',
    rootAccessRemarks: '',

    vmPort5000Status: '',
    vmPort5000Remarks: '',
    sslRequiredStatus: '',
    sslRequiredRemarks: '',
    twoIpsNatStatus: '',
    twoIpsNatRemarks: '',
    ocrDependenciesStatus: '',
    ocrDependenciesRemarks: '',
    s3BucketStatus: '',
    s3BucketRemarks: '',


    // Organization Details
    organizationName: '',
    organizationNameRemarks: '',
    fiCodeOrgCode: '',
    fiCodeOrgCodeRemarks: '',
    regionCode: '',
    regionCodeRemarks: '',
    branchCode: '',
    branchCodeRemarks: '',
    kycVerificationBranch: '',
    kycVerificationBranchRemarks: '',
    kycVerifierName: '',
    kycVerifierNameRemarks: '',
    kycVerifierEmployeeCode: '',
    kycVerifierEmployeeCodeRemarks: '',
    kycVerifierDesignation: '',
    kycVerifierDesignationRemarks: '',
    makerUserId: '',
    makerUserIdRemarks: '',
    makerPassword: '',
    makerPasswordRemarks: '',
    checkerUserId: '',
    checkerUserIdRemarks: '',
    checkerPassword: '',
    checkerPasswordRemarks: '',
    sftpUrl: '',
    sftpUrlRemarks: '',
    sftpPortNo: '',
    sftpPortNoRemarks: '',

    // Certificate Configuration
    certificateInfoRemarks: '',
    certificatePasswordInfoRemarks: '',

    // Bulk Download & SFTP
    bulkDownloadRequired: 'false',
    bulkDownloadRequiredRemarks: '',

    // API & IP Whitelisting
    apiFunctionality: '',
    apiFunctionalityRemarks: '',
    sftpFunctionality: '',
    sftpFunctionalityRemarks: '',
    ipWhitelistingConfirmed: 'false',
    ipWhitelistingConfirmedRemarks: '',

    // Points of Contact
    technicalSPOCName: '',
    technicalSPOCEmail: '',
    technicalSPOCPhone: '',
    technicalSPOCRemarks: '',
    businessSPOCName: '',
    businessSPOCEmail: '',
    businessSPOCPhone: '',
    businessSPOCRemarks: '',

    // Sign-Off
    acceptanceConfirmed: false,
    signOffCustomerName: '',
    designation: '',
    signOffDate: '',

    // PROD - Customer & Project Details
    prodCustomerName: '',
    prodServerTypePhysical: false,
    prodServerTypeCloud: false,
    prodCloudDCProvider: '',
    prodDateOfAssessment: '',

    // PROD - Infrastructure Validation
    prodHardwareProdStatus: '',
    prodHardwareProdRemarks: '',
    prodOsNameVersion: '',
    prodOsNameVersionRemarks: '',
    prodInternetConnectivityStatus: '',
    prodInternetConnectivityRemarks: '',

    prodDnsMappingStatus: '',
    prodDnsMappingRemarks: '',
    prodPortStatus: '',
    prodPortRemarks: '',
    prodFirewallStatus: '',
    prodFirewallRemarks: '',

    prodRootAccessStatus: '',
    prodRootAccessRemarks: '',
    prodTimeSyncRemarks: '',
    prodDrRequiredStatus: '',
    prodDrRequiredRemarks: '',

    // PROD - Organization Details
    prodOrganizationName: '',
    prodOrganizationNameRemarks: '',
    prodFiCodeOrgCode: '',
    prodFiCodeOrgCodeRemarks: '',
    prodRegionCode: '',
    prodRegionCodeRemarks: '',
    prodBranchCode: '',
    prodBranchCodeRemarks: '',
    prodKycVerificationBranch: '',
    prodKycVerificationBranchRemarks: '',
    prodKycVerifierName: '',
    prodKycVerifierNameRemarks: '',
    prodKycVerifierEmployeeCode: '',
    prodKycVerifierEmployeeCodeRemarks: '',
    prodKycVerifierDesignation: '',
    prodKycVerifierDesignationRemarks: '',
    prodMakerUserId: '',
    prodMakerUserIdRemarks: '',
    prodMakerPassword: '',
    prodMakerPasswordRemarks: '',
    prodCheckerUserId: '',
    prodCheckerUserIdRemarks: '',
    prodCheckerPassword: '',
    prodCheckerPasswordRemarks: '',
    prodSftpUrl: '',
    prodSftpUrlRemarks: '',
    prodSftpPortNo: '',
    prodSftpPortNoRemarks: '',

    // PROD - Certificate Configuration
    prodCertificateInfoRemarks: '',
    prodCertificatePasswordInfoRemarks: '',

    // PROD - Bulk Download & SFTP
    prodBulkDownloadRequired: 'false',
    prodBulkDownloadRequiredRemarks: '',

    // PROD - API & IP Whitelisting
    prodApiFunctionality: '',
    prodApiFunctionalityRemarks: '',
    prodSftpFunctionality: '',
    prodSftpFunctionalityRemarks: '',
    prodIpWhitelistingConfirmed: 'false',
    prodIpWhitelistingConfirmedRemarks: '',

    // PROD - Points of Contact
    prodTechnicalSPOCName: '',
    prodTechnicalSPOCEmail: '',
    prodTechnicalSPOCPhone: '',
    prodTechnicalSPOCRemarks: '',
    prodBusinessSPOCName: '',
    prodBusinessSPOCEmail: '',
    prodBusinessSPOCPhone: '',
    prodBusinessSPOCRemarks: '',

    // PROD - Sign-Off
    prodAcceptanceConfirmed: false,
    prodSignOffCustomerName: '',
    prodDesignation: '',
    prodSignOffDate: '',
  });

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

  const formId = queryParams.get('id');

  useEffect(() => {
    if (formId) {
      setLoading(true);
      formAPI.getById(formId)
        .then(res => {
          if (res.data.success) {
            const data = res.data.data;
            if (data.ckycEnvironment === 'Production') {
              setActiveTab('prod');
              setFormData(prev => ({
                ...prev,
                prodCustomerName: data.customerName || '',
                projectName: data.projectName || '',
                prodServerTypePhysical: data.serverTypePhysical || false,
                prodServerTypeCloud: data.serverTypeCloud || false,
                prodCloudDCProvider: data.cloudDCProvider || '',
                prodDateOfAssessment: data.dateOfAssessment || '',
                // Infrastructure
                prodHardwareProdStatus: data.hardwareProdStatus || '',
                prodHardwareProdRemarks: data.hardwareProdRemarks || '',
                prodInternetConnectivityStatus: data.internetConnectivityStatus || '',
                prodInternetConnectivityRemarks: data.internetConnectivityRemarks || '',
                prodPublicIPStatus: data.publicIPStatus || '',
                prodPublicIPRemarks: data.publicIPRemarks || '',
                prodDnsMappingStatus: data.dnsMappingStatus || '',
                prodDnsMappingRemarks: data.dnsMappingRemarks || '',
                prodPortStatus: data.port80443Status || '',
                prodPortRemarks: data.port80443Remarks || '',
                prodFirewallStatus: data.firewallStatus || '',
                prodFirewallRemarks: data.firewallRemarks || '',
                prodOpenSSLStatus: data.openSSLStatus || '',
                prodOpenSSLRemarks: data.openSSLRemarks || '',
                prodSslEligibilityStatus: data.sslEligibilityStatus || '',
                prodSslEligibilityRemarks: data.sslEligibilityRemarks || '',
                prodSshAccessStatus: data.sshAccessStatus || '',
                prodSshAccessRemarks: data.sshAccessRemarks || '',
                prodRootAccessStatus: data.rootAccessStatus || '',
                prodRootAccessRemarks: data.rootAccessRemarks || '',
                prodTimeSyncStatus: data.timeSyncStatus || '',
                prodTimeSyncRemarks: data.timeSyncRemarks || '',
                prodDrRequiredStatus: data.drRequiredStatus || '',
                prodDrRequiredRemarks: data.drRequiredRemarks || '',
                // Organization
                prodOrganizationName: data.organizationName || '',
                prodOrganizationNameRemarks: data.organizationNameRemarks || '',
                prodFiCodeOrgCode: data.fiCode || '',
                prodFiCodeOrgCodeRemarks: data.fiCodeRemarks || '',
                prodRegionCode: data.regionCode || '',
                prodRegionCodeRemarks: data.regionCodeRemarks || '',
                prodBranchCode: data.branchCode || '',
                prodBranchCodeRemarks: data.branchCodeRemarks || '',
                prodKycVerificationBranch: data.kycBranch || '',
                prodKycVerificationBranchRemarks: data.kycBranchRemarks || '',
                prodKycVerifierName: data.verifierName || '',
                prodKycVerifierNameRemarks: data.verifierNameRemarks || '',
                prodKycVerifierEmployeeCode: data.employeeCode || '',
                prodKycVerifierEmployeeCodeRemarks: data.employeeCodeRemarks || '',
                prodKycVerifierDesignation: data.designation || '',
                prodKycVerifierDesignationRemarks: data.designationRemarks || '',
                prodMakerUserId: data.makerUserId || '',
                prodMakerUserIdRemarks: data.makerUserIdRemarks || '',
                prodMakerPassword: data.makerPassword || '',
                prodMakerPasswordRemarks: data.makerPasswordRemarks || '',
                prodCheckerUserId: data.checkerUserId || '',
                prodCheckerUserIdRemarks: data.checkerUserIdRemarks || '',
                prodSftpUrl: data.sftpUrl || '',
                prodSftpUrlRemarks: data.sftpUrlRemarks || '',
                prodSftpPortNo: data.sftpPortNo || '',
                prodSftpPortNoRemarks: data.sftpPortNoRemarks || '',
                prodCertificateInfoRemarks: data.certificateInfo || '',
                prodBulkDownloadRequired: data.bulkDownloadEnabled ? 'true' : 'false',
                prodBulkDownloadRequiredRemarks: data.bulkDownloadRequiredRemarks || '',
                prodApiFunctionality: data.apiIPWhitelisting || '',
                prodApiFunctionalityRemarks: data.apiIPWhitelistingRemarks || '',
                prodSftpFunctionality: data.microserviceIPWhitelisting || '',
                prodSftpFunctionalityRemarks: data.microserviceIPWhitelistingRemarks || '',
                prodIpWhitelistingConfirmed: data.ipWhitelistingConfirmed === 'Yes' ? 'true' : 'false',
                prodIpWhitelistingConfirmedRemarks: data.ipWhitelistingConfirmedRemarks || '',
                prodTechnicalSPOCName: data.technicalSPOCName || '',
                prodTechnicalSPOCEmail: data.technicalSPOCEmail || '',
                prodTechnicalSPOCPhone: data.technicalSPOCPhone || '',
                prodBusinessSPOCName: data.businessSPOCName || '',
                prodBusinessSPOCEmail: data.businessSPOCEmail || '',
                prodBusinessSPOCPhone: data.businessSPOCPhone || '',
                prodSignOffCustomerName: data.signOffName || '',
                prodDesignation: data.signOffDesignation || '',
                prodSignOffDate: data.signOffDate || '',
                prodAcceptanceConfirmed: true
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                ...data,
                portStatus: data.port80443Status || '',
                portRemarks: data.port80443Remarks || '',
                fiCodeOrgCode: data.fiCode || '',
                fiCodeOrgCodeRemarks: data.fiCodeRemarks || '',
                kycVerificationBranch: data.kycBranch || '',
                kycVerificationBranchRemarks: data.kycBranchRemarks || '',
                bulkDownloadRequired: data.bulkDownloadEnabled ? 'true' : 'false',
                ipWhitelistingConfirmed: data.ipWhitelistingConfirmed === 'Yes' ? 'true' : 'false',
                signOffCustomerName: data.signOffName || '',
                apiFunctionality: data.apiIPWhitelisting || '',
                apiFunctionalityRemarks: data.apiIPWhitelistingRemarks || '',
                sftpFunctionality: data.microserviceIPWhitelisting || '',
                sftpFunctionalityRemarks: data.microserviceIPWhitelistingRemarks || '',
                acceptanceConfirmed: true
              }));
            }
          }
        })
        .catch(err => {
          console.error('Failed to load form details:', err);
          setAlertMessage({ type: 'danger', message: 'Failed to load form details.' });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [formId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler to save bulk download setting to database immediately
  const handleBulkDownloadChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    try {
      const environment = name === 'bulkDownloadRequired' ? 'UAT' : 'Production';
      await formAPI.submit({
        customerName: formData.customerName || 'Bulk Download Setting',
        projectName: formData.projectName || 'CKYC',
        bulkDownloadEnabled: value === 'true',
        sftpEnabled: value === 'true',
        ckycEnvironment: environment,
      });
    } catch (error) {
      console.error('Failed to save bulk download setting:', error);
    }
  };

  const handleServerTypeChange = (e, prefix = '') => {
    const { value } = e.target;
    const physicalField = prefix ? `${prefix}ServerTypePhysical` : 'serverTypePhysical';
    const cloudField = prefix ? `${prefix}ServerTypeCloud` : 'serverTypeCloud';

    setFormData(prev => ({
      ...prev,
      [physicalField]: value === 'physical',
      [cloudField]: value === 'cloud'
    }));
  };

  const handleAlphabeticChange = (e) => {
    const { name, value } = e.target;
    // Only allow alphabetic characters and spaces
    const alphabeticValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: alphabeticValue
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    // Allow valid email characters: alphanumeric, @, ., _, -, +
    const emailValue = value.replace(/[^a-zA-Z0-9@._\-+]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: emailValue
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and + (for country code)
    const phoneValue = value.replace(/[^0-9+]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: phoneValue
    }));
  };

  const handleAlphanumericChange = (e) => {
    const { name, value } = e.target;
    // Only allow alphanumeric characters
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: alphanumericValue
    }));
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    // Allow URL-valid characters: alphanumeric, dots, hyphens, underscores, slashes, colons, @, ?, &, =, %, +, ~
    const urlValue = value.replace(/[^a-zA-Z0-9.\-_/:@?&=%+~]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: urlValue
    }));
  };

  const handleStatusUpdate = async (status) => {
    if (!formId) return;
    if (!window.confirm(`Are you sure you want to mark this form as ${status}?`)) return;

    setLoading(true);
    try {
      const response = await formAPI.updateStatus(formId, status);
      if (response.data.success) {
        alert(response.data.message);
        navigate('/ckycform/dashboard/forms');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Error updating status.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextUatInfra = () => {
    const requiredFields = [
      'hardwareUATStatus', 'osNameVersion', 'internetConnectivityStatus',
      'dnsMappingStatus', 'portStatus', 'firewallStatus', 'rootAccessStatus',
      'vmPort5000Status', 'sslRequiredStatus', 'twoIpsNatStatus',
      'ocrDependenciesStatus', 's3BucketStatus'
    ];
    const missing = requiredFields.some(field => !formData[field]);
    if (!isViewMode && missing) {
      setFormError("Please fill all mandatory status fields in the Infrastructure section before proceeding.");
      setTimeout(() => setFormError(''), 4000);
      return;
    }
    setFormError('');
    setActiveInnerTab('org');
  };

  const handleNextProdInfra = () => {
    const requiredFields = [
      'prodHardwareProdStatus', 'prodOsNameVersion', 'prodInternetConnectivityStatus',
      'prodDnsMappingStatus', 'prodPortStatus', 'prodFirewallStatus', 'prodRootAccessStatus'
    ];
    const missing = requiredFields.some(field => !formData[field]);
    if (!isViewMode && missing) {
      setFormError("Please fill all mandatory status fields in the Infrastructure section before proceeding.");
      setTimeout(() => setFormError(''), 4000);
      return;
    }
    setFormError('');
    setActiveProdInnerTab('org');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check acceptance based on active tab
    const isAccepted = activeTab === 'uat'
      ? formData.acceptanceConfirmed
      : formData.prodAcceptanceConfirmed;

    if (!isAccepted) {
      setAlertMessage({ type: 'danger', message: 'Please accept the confirmation statement before submitting.' });
      return;
    }

    // Skip validation and submission if in view mode
    if (isViewMode) return;

    // Validate mandatory fields based on active tab
    const missingFields = [];

    if (activeTab === 'uat') {
      // UAT mandatory fields validation
      if (!formData.customerName?.trim()) missingFields.push('Customer Name');
      if (!formData.hardwareUATStatus) missingFields.push('Hardware Status (UAT)');
      if (!formData.osNameVersion) missingFields.push('OS Name & Version');
      if (!formData.internetConnectivityStatus) missingFields.push('Internet Connectivity');
      if (!formData.dnsMappingStatus) missingFields.push('Domain/DNS Mapping');
      if (!formData.portStatus) missingFields.push('Cross VM Connectivity (Ports)');
      if (!formData.firewallStatus) missingFields.push('Firewall');
      if (!formData.rootAccessStatus) missingFields.push('Root Access');
      if (!formData.vmPort5000Status) missingFields.push('VM connected on Port 5000');
      if (!formData.sslRequiredStatus) missingFields.push('SSL Certificate Required');
      if (!formData.twoIpsNatStatus) missingFields.push('2 IP for API & SFTP');
      if (!formData.ocrDependenciesStatus) missingFields.push('Need to install dependencies for OCR');
      if (!formData.s3BucketStatus) missingFields.push('S3 Bucket/file server');
      if (!formData.organizationName?.trim()) missingFields.push('Organization Name');
      if (!formData.fiCodeOrgCode?.trim()) missingFields.push('FI Code / Org Code');
      if (!formData.regionCode?.trim()) missingFields.push('Region Code');
      if (!formData.branchCode?.trim()) missingFields.push('Branch Code');
      if (!formData.kycVerificationBranch?.trim()) missingFields.push('KYC Verification Branch');
      if (!formData.makerUserId?.trim()) missingFields.push('Maker User ID');
      if (!formData.checkerUserId?.trim()) missingFields.push('Checker User ID');
      if (!formData.sftpUrl?.trim()) missingFields.push('SFTP URL');
      if (!formData.sftpPortNo?.trim()) missingFields.push('SFTP Port No.');
      if (!formData.apiFunctionality?.trim()) missingFields.push('API Functionality IP');
      if (!formData.sftpFunctionality?.trim()) missingFields.push('SFTP Functionality IP');
      if (!formData.technicalSPOCName?.trim()) missingFields.push('Technical SPOC Name');
      if (!formData.technicalSPOCEmail?.trim()) missingFields.push('Technical SPOC Email');
      if (!formData.technicalSPOCPhone?.trim()) missingFields.push('Technical SPOC Phone');
    } else {
      // PROD mandatory fields validation
      if (!formData.prodCustomerName?.trim()) missingFields.push('Customer Name');
      if (!formData.prodHardwareProdStatus) missingFields.push('Hardware Status (PROD)');
      if (!formData.prodOsNameVersion) missingFields.push('OS Name & Version');
      if (!formData.prodInternetConnectivityStatus) missingFields.push('Internet Connectivity');
      if (!formData.prodDnsMappingStatus) missingFields.push('Domain/DNS Mapping');
      if (!formData.prodPortStatus) missingFields.push('Cross VM Connectivity (Ports)');
      if (!formData.prodFirewallStatus) missingFields.push('Firewall');
      if (!formData.prodRootAccessStatus) missingFields.push('Root Access');
      if (!formData.prodOrganizationName?.trim()) missingFields.push('Organization Name');
      if (!formData.prodFiCodeOrgCode?.trim()) missingFields.push('FI Code / Org Code');
      if (!formData.prodRegionCode?.trim()) missingFields.push('Region Code');
      if (!formData.prodBranchCode?.trim()) missingFields.push('Branch Code');
      if (!formData.prodKycVerificationBranch?.trim()) missingFields.push('KYC Verification Branch');
      if (!formData.prodMakerUserId?.trim()) missingFields.push('Maker User ID');
      if (!formData.prodCheckerUserId?.trim()) missingFields.push('Checker User ID');
      if (!formData.prodSftpUrl?.trim()) missingFields.push('SFTP URL');
      if (!formData.prodSftpPortNo?.trim()) missingFields.push('SFTP Port No.');
      if (!formData.prodApiFunctionality?.trim()) missingFields.push('API Functionality IP');
      if (!formData.prodSftpFunctionality?.trim()) missingFields.push('SFTP Functionality IP');
      if (!formData.prodTechnicalSPOCName?.trim()) missingFields.push('Technical SPOC Name');
      if (!formData.prodTechnicalSPOCEmail?.trim()) missingFields.push('Technical SPOC Email');
      if (!formData.prodTechnicalSPOCPhone?.trim()) missingFields.push('Technical SPOC Phone');
    }

    if (missingFields.length > 0) {
      setAlertMessage({
        type: 'danger',
        message: `Please fill in the following mandatory fields: ${missingFields.join(', ')}`
      });
      return;
    }

    setLoading(true);
    setAlertMessage({ type: '', message: '' });

    try {
      let submitData;

      if (activeTab === 'uat') {
        // UAT submission - map UAT fields to database field names
        submitData = {
          customerName: formData.customerName,
          projectName: formData.projectName,
          serverTypePhysical: formData.serverTypePhysical,
          serverTypeCloud: formData.serverTypeCloud,
          cloudDCProvider: formData.cloudDCProvider,
          dateOfAssessment: formData.dateOfAssessment,
          // Infrastructure
          hardwareUATStatus: formData.hardwareUATStatus,
          hardwareUATRemarks: formData.hardwareUATRemarks,
          internetConnectivityStatus: formData.internetConnectivityStatus,
          internetConnectivityRemarks: formData.internetConnectivityRemarks,
          publicIPStatus: formData.publicIPStatus,
          publicIPRemarks: formData.publicIPRemarks,
          dnsMappingStatus: formData.dnsMappingStatus,
          dnsMappingRemarks: formData.dnsMappingRemarks,
          port80443Status: formData.portStatus,
          port80443Remarks: formData.portRemarks,
          firewallStatus: formData.firewallStatus,
          firewallRemarks: formData.firewallRemarks,
          openSSLStatus: formData.openSSLStatus,
          openSSLRemarks: formData.openSSLRemarks,
          sslEligibilityStatus: formData.sslEligibilityStatus,
          sslEligibilityRemarks: formData.sslEligibilityRemarks,
          sshAccessStatus: formData.sshAccessStatus,
          sshAccessRemarks: formData.sshAccessRemarks,
          rootAccessStatus: formData.rootAccessStatus,
          rootAccessRemarks: formData.rootAccessRemarks,
          timeSyncStatus: formData.timeSyncStatus,
          timeSyncRemarks: formData.timeSyncRemarks,
          vmPort5000Status: formData.vmPort5000Status,
          vmPort5000Remarks: formData.vmPort5000Remarks,
          sslRequiredStatus: formData.sslRequiredStatus,
          sslRequiredRemarks: formData.sslRequiredRemarks,
          twoIpsNatStatus: formData.twoIpsNatStatus,
          twoIpsNatRemarks: formData.twoIpsNatRemarks,
          ocrDependenciesStatus: formData.ocrDependenciesStatus,
          ocrDependenciesRemarks: formData.ocrDependenciesRemarks,
          s3BucketStatus: formData.s3BucketStatus,
          s3BucketRemarks: formData.s3BucketRemarks,
          // Organization - map to correct field names
          organizationName: formData.organizationName,
          organizationNameRemarks: formData.organizationNameRemarks,
          fiCode: formData.fiCodeOrgCode,
          fiCodeRemarks: formData.fiCodeOrgCodeRemarks,
          regionCode: formData.regionCode,
          regionCodeRemarks: formData.regionCodeRemarks,
          branchCode: formData.branchCode,
          branchCodeRemarks: formData.branchCodeRemarks,
          kycBranch: formData.kycVerificationBranch,
          kycBranchRemarks: formData.kycVerificationBranchRemarks,
          verifierName: formData.kycVerifierName,
          verifierNameRemarks: formData.kycVerifierNameRemarks,
          employeeCode: formData.kycVerifierEmployeeCode,
          employeeCodeRemarks: formData.kycVerifierEmployeeCodeRemarks,
          designation: formData.kycVerifierDesignation,
          designationRemarks: formData.kycVerifierDesignationRemarks,
          makerUserId: formData.makerUserId,
          makerUserIdRemarks: formData.makerUserIdRemarks,
          makerPassword: formData.makerPassword,
          makerPasswordRemarks: formData.makerPasswordRemarks,
          checkerUserId: formData.checkerUserId,
          checkerUserIdRemarks: formData.checkerUserIdRemarks,
          sftpUrl: formData.sftpUrl,
          sftpUrlRemarks: formData.sftpUrlRemarks,
          sftpPortNo: formData.sftpPortNo,
          sftpPortNoRemarks: formData.sftpPortNoRemarks,
          // Certificate
          certificateInfo: formData.certificateInfoRemarks,
          // Bulk Download & SFTP
          bulkDownloadEnabled: formData.bulkDownloadRequired === 'true',
          sftpEnabled: formData.bulkDownloadRequired === 'true',
          bulkDownloadRequiredRemarks: formData.bulkDownloadRequiredRemarks,
          sftpEnabledRemarks: formData.bulkDownloadRequiredRemarks,
          // API & IP Whitelisting
          apiIPWhitelisting: formData.apiFunctionality,
          apiIPWhitelistingRemarks: formData.apiFunctionalityRemarks,
          microserviceIPWhitelisting: formData.sftpFunctionality,
          microserviceIPWhitelistingRemarks: formData.sftpFunctionalityRemarks,
          ipWhitelistingConfirmed: formData.ipWhitelistingConfirmed === 'true' ? 'Yes' : 'No',
          ipWhitelistingConfirmedRemarks: formData.ipWhitelistingConfirmedRemarks,
          // Points of Contact
          technicalSPOCName: formData.technicalSPOCName,
          technicalSPOCEmail: formData.technicalSPOCEmail,
          technicalSPOCPhone: formData.technicalSPOCPhone,
          businessSPOCName: formData.businessSPOCName,
          businessSPOCEmail: formData.businessSPOCEmail,
          businessSPOCPhone: formData.businessSPOCPhone,
          // Sign-Off
          signOffName: formData.signOffCustomerName,
          signOffDesignation: formData.designation,
          signOffDate: formData.signOffDate,
          // Environment
          ckycEnvironment: 'UAT',
        };
      } else {
        // PROD submission - map prod fields to standard field names
        submitData = {
          customerName: formData.prodCustomerName,
          projectName: formData.projectName,
          serverTypePhysical: formData.prodServerTypePhysical,
          serverTypeCloud: formData.prodServerTypeCloud,
          cloudDCProvider: formData.prodCloudDCProvider,
          dateOfAssessment: formData.prodDateOfAssessment,
          // Infrastructure - using Prod status fields
          hardwareProdStatus: formData.prodHardwareProdStatus,
          hardwareProdRemarks: formData.prodHardwareProdRemarks,
          internetConnectivityStatus: formData.prodInternetConnectivityStatus,
          internetConnectivityRemarks: formData.prodInternetConnectivityRemarks,
          publicIPStatus: formData.prodPublicIPStatus,
          publicIPRemarks: formData.prodPublicIPRemarks,
          dnsMappingStatus: formData.prodDnsMappingStatus,
          dnsMappingRemarks: formData.prodDnsMappingRemarks,
          port80443Status: formData.prodPortStatus,
          port80443Remarks: formData.prodPortRemarks,
          firewallStatus: formData.prodFirewallStatus,
          firewallRemarks: formData.prodFirewallRemarks,
          openSSLStatus: formData.prodOpenSSLStatus,
          openSSLRemarks: formData.prodOpenSSLRemarks,
          sslEligibilityStatus: formData.prodSslEligibilityStatus,
          sslEligibilityRemarks: formData.prodSslEligibilityRemarks,
          sshAccessStatus: formData.prodSshAccessStatus,
          sshAccessRemarks: formData.prodSshAccessRemarks,
          rootAccessStatus: formData.prodRootAccessStatus,
          rootAccessRemarks: formData.prodRootAccessRemarks,
          timeSyncStatus: formData.prodTimeSyncStatus,
          timeSyncRemarks: formData.prodTimeSyncRemarks,
          drRequiredStatus: formData.prodDrRequiredStatus,
          drRequiredRemarks: formData.prodDrRequiredRemarks,
          // Organization
          organizationName: formData.prodOrganizationName,
          organizationNameRemarks: formData.prodOrganizationNameRemarks,
          fiCode: formData.prodFiCodeOrgCode,
          fiCodeRemarks: formData.prodFiCodeOrgCodeRemarks,
          regionCode: formData.prodRegionCode,
          regionCodeRemarks: formData.prodRegionCodeRemarks,
          branchCode: formData.prodBranchCode,
          branchCodeRemarks: formData.prodBranchCodeRemarks,
          kycBranch: formData.prodKycVerificationBranch,
          kycBranchRemarks: formData.prodKycVerificationBranchRemarks,
          verifierName: formData.prodKycVerifierName,
          verifierNameRemarks: formData.prodKycVerifierNameRemarks,
          employeeCode: formData.prodKycVerifierEmployeeCode,
          employeeCodeRemarks: formData.prodKycVerifierEmployeeCodeRemarks,
          designation: formData.prodKycVerifierDesignation,
          designationRemarks: formData.prodKycVerifierDesignationRemarks,
          makerUserId: formData.prodMakerUserId,
          makerUserIdRemarks: formData.prodMakerUserIdRemarks,
          makerPassword: formData.prodMakerPassword,
          makerPasswordRemarks: formData.prodMakerPasswordRemarks,
          checkerUserId: formData.prodCheckerUserId,
          checkerUserIdRemarks: formData.prodCheckerUserIdRemarks,
          sftpUrl: formData.prodSftpUrl,
          sftpUrlRemarks: formData.prodSftpUrlRemarks,
          sftpPortNo: formData.prodSftpPortNo,
          sftpPortNoRemarks: formData.prodSftpPortNoRemarks,
          // Certificate
          certificateInfo: formData.prodCertificateInfoRemarks,
          // Bulk Download & SFTP
          bulkDownloadEnabled: formData.prodBulkDownloadRequired === 'true',
          sftpEnabled: formData.prodBulkDownloadRequired === 'true',
          bulkDownloadRequiredRemarks: formData.prodBulkDownloadRequiredRemarks,
          sftpEnabledRemarks: formData.prodBulkDownloadRequiredRemarks,
          // API & IP Whitelisting
          apiIPWhitelisting: formData.prodApiFunctionality,
          apiIPWhitelistingRemarks: formData.prodApiFunctionalityRemarks,
          microserviceIPWhitelisting: formData.prodSftpFunctionality,
          microserviceIPWhitelistingRemarks: formData.prodSftpFunctionalityRemarks,
          ipWhitelistingConfirmed: formData.prodIpWhitelistingConfirmed === 'true' ? 'Yes' : 'No',
          ipWhitelistingConfirmedRemarks: formData.prodIpWhitelistingConfirmedRemarks,
          // Points of Contact
          technicalSPOCName: formData.prodTechnicalSPOCName,
          technicalSPOCEmail: formData.prodTechnicalSPOCEmail,
          technicalSPOCPhone: formData.prodTechnicalSPOCPhone,
          businessSPOCName: formData.prodBusinessSPOCName,
          businessSPOCEmail: formData.prodBusinessSPOCEmail,
          businessSPOCPhone: formData.prodBusinessSPOCPhone,
          // Sign-Off
          signOffName: formData.prodSignOffCustomerName,
          signOffDesignation: formData.prodDesignation,
          signOffDate: formData.prodSignOffDate,
          // Environment
          ckycEnvironment: 'Production',
        };
      }

      if (formId) {
        await formAPI.update(formId, submitData);
        alert('Form updated successfully!');
      } else {
        await formAPI.submit(submitData);
        alert('Form submitted successfully!');
      }
      navigate('/ckycform/dashboard/forms');
    } catch (error) {
      console.error('Failed to submit form:', error);
      setAlertMessage({ type: 'danger', message: 'Failed to save form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    const isAdmin = user?.isAdmin;
    logout();
    navigate(isAdmin ? '/ckycform/login' : '/ckycform/user-login');
  };

  return (
    <div className="min-vh-100 bg-light">
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

      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <Link to="/ckycform/" className="navbar-brand d-flex align-items-center">
            <img src={logoImg} alt="Protean Logo" style={{ height: '40px', width: 'auto', marginRight: '10px' }} />
            <span className="fw-semibold">Prerequisites</span>
          </Link>

          {user && (
            <div className="user-profile-section">
              <div className="user-pill">
                <div className="user-avatar-sm" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                  <i className="bi bi-person"></i>
                </div>
                <Link to="/ckycform/dashboard/forms" className="user-name-link-sm" title="View My Forms">
                  {user.fullName || 'User'}
                </Link>
                <div className="px-2" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                  <i className="bi bi-chevron-down small"></i>
                </div>
              </div>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <Link to="/ckycform/dashboard/forms" className="dropdown-item-custom" onClick={() => setShowProfileDropdown(false)}>
                    <i className="bi bi-file-earmark-list"></i>
                    My Forms
                  </Link>
                  <div className="dropdown-divider-custom"></div>
                  <button className="dropdown-item-custom text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="container py-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0 text-center">CKYC Pre-Requisite & Sign-Off Form</h4>
          </div>
          <div className="card-body">
            {isViewMode && (
              <div className="alert alert-light border shadow-sm mb-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle p-2 me-3">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">View Mode</h5>
                    <p className="mb-0 text-muted small">Viewing full document. All fields are read-only.</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate('/ckycform/dashboard/forms')}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to List
                  </button>
                  {user && user.isAdmin && (
                    <>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate('Approved')}
                        disabled={loading}
                      >
                        <i className="bi bi-check-circle me-1"></i> Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate('Rejected')}
                        disabled={loading}
                      >
                        <i className="bi bi-x-circle me-1"></i> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            <form id="preRequisiteForm" onSubmit={handleSubmit} className={isViewMode ? 'view-mode' : ''}>
              {/* Main Tabs Navigation */}
              <ul className="nav nav-tabs mb-4" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'uat' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('uat')}
                  >
                    <i className="bi bi-server me-2"></i>UAT
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'prod' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('prod')}
                  >
                    <i className="bi bi-person-check me-2"></i>PROD
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {/* UAT Tab */}
                <div className={`tab-pane fade ${activeTab === 'uat' ? 'show active' : ''}`}>
                  {/* Inner Tabs */}
                  <ul className="nav nav-pills mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeInnerTab === 'infra' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setActiveInnerTab('infra')}
                      >
                        <i className="bi bi-hdd-network me-2"></i>Infra
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeInnerTab === 'org' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setActiveInnerTab('org')}
                      >
                        <i className="bi bi-building-check me-2"></i>Org Onboarding
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        type="button"
                        onClick={() => setShowArchModal(true)}
                      >
                        <i className="bi bi-diagram-3 me-2"></i>Architecture
                      </button>
                    </li>
                  </ul>

                  {/* Inner Tab Content */}
                  <div className="tab-content">
                    {/* Infra Tab */}
                    {activeInnerTab === 'infra' && (
                      <div className="tab-pane fade show active">
                        {/* Section 1: Customer & Project Details */}
                        <h5 className="mb-3">1. Customer & Project Details</h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead className="table-secondary">
                              <tr>
                                <th style={{ width: '30%' }}>Field</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Customer Name <span className="text-danger">*</span></td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleAlphabeticChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Server Type</td>
                                <td>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="serverType"
                                      value="physical"
                                      checked={formData.serverTypePhysical}
                                      onChange={(e) => handleServerTypeChange(e)}
                                    />
                                    <label className="form-check-label">On-prem</label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="serverType"
                                      value="cloud"
                                      checked={formData.serverTypeCloud}
                                      onChange={(e) => handleServerTypeChange(e)}
                                    />
                                    <label className="form-check-label">Cloud</label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>Cloud / DC Provider</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="cloudDCProvider"
                                    value={formData.cloudDCProvider}
                                    onChange={handleAlphabeticChange}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Date of Assessment</td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="dateOfAssessment"
                                    value={formData.dateOfAssessment}
                                    onChange={handleChange}
                                    min={today}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 2: Infrastructure Validation */}
                        <h5 className="mb-3">2. Infrastructure, Network & Platform Validation</h5>
                        <div className="table-responsive">
                          <table className="table table-bordered align-middle infra-table">
                            <thead className="table-secondary">
                              <tr className="text-center align-middle">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '45%' }}>Pre-Requisite Check</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                               <tr>
                                <td>1</td>
                                <td>
                                  Hardware Requirements (UAT)<br />
                                  <small className="text-muted">Recomended : 2 vCPUs / 16 GB RAM / 50 GB SSD (2 Servers)</small>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="hardwareUATStatus"
                                    value={formData.hardwareUATStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="hardwareUATRemarks"
                                    value={formData.hardwareUATRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  OS Name & Version <span className="text-danger">*</span><br />
                                  <small className="text-muted">Ubuntu version 24 & above / RHEL version 9.7</small>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="osNameVersion"
                                    value={formData.osNameVersion}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Ubuntu">Ubuntu</option>
                                    <option value="RHEL">RHEL</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="osNameVersionRemarks"
                                    value={formData.osNameVersionRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Internet Connectivity <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="VM can download packages & Docker images"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="internetConnectivityStatus"
                                    value={formData.internetConnectivityStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="internetConnectivityRemarks"
                                    value={formData.internetConnectivityRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Domain <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Domain to Access the Application"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="dnsMappingStatus"
                                    value={formData.dnsMappingStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="dnsMappingRemarks"
                                    value={formData.dnsMappingRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>5</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Cross VM Connectivity <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Communication between VMs"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="portStatus"
                                    value={formData.portStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="portRemarks"
                                    value={formData.portRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>6</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <div>
                                      Firewall <span className="text-danger">*</span><br />
                                      <small className="text-muted">Port 443. Port 80 allow only when Load balancer is used</small>
                                    </div>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Required ports allowed"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="firewallStatus"
                                    value={formData.firewallStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="firewallRemarks"
                                    value={formData.firewallRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>7</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Root Access <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Admin/Sudo access required"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="rootAccessStatus"
                                    value={formData.rootAccessStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="rootAccessRemarks"
                                    value={formData.rootAccessRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>8</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <div>
                                      VM connected on Port <span className="text-danger">*</span><br />
                                      <small className="text-muted">Port 5000</small>
                                    </div>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Port 5000"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="vmPort5000Status"
                                    value={formData.vmPort5000Status}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="vmPort5000Remarks"
                                    value={formData.vmPort5000Remarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>9</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SSL certificate required <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Required for secure HTTPS connection"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="sslRequiredStatus"
                                    value={formData.sslRequiredStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="sslRequiredRemarks"
                                    value={formData.sslRequiredRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>10</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>2 IP for API & SFTP <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="NAT Outbound IPs"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="twoIpsNatStatus"
                                    value={formData.twoIpsNatStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="twoIpsNatRemarks"
                                    value={formData.twoIpsNatRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>11</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Need to install dependencies for OCR <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="If required"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="ocrDependenciesStatus"
                                    value={formData.ocrDependenciesStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="ocrDependenciesRemarks"
                                    value={formData.ocrDependenciesRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>12</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>S3 Bucket/file server <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="File storage"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="s3BucketStatus"
                                    value={formData.s3BucketStatus}
                                    onChange={handleChange}
                                    required={!isViewMode && activeTab === 'uat'}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="s3BucketRemarks"
                                    value={formData.s3BucketRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {formError && (
                          <div className="alert alert-danger mt-3">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {formError}
                          </div>
                        )}

                        <div className="text-end mt-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleNextUatInfra}
                          >
                            Next <i className="bi bi-arrow-right ms-1"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Org Onboarding Tab */}
                    {activeInnerTab === 'org' && (
                      <div className="tab-pane fade show active">
                        {/* Section 3: Organization Details */}
                        <h5 className="mb-3"><i className="bi bi-building me-2"></i>3: Organization & CKYC Registration Details</h5>
                        <p className="text-muted mb-1">Purpose: Establish identity and CKYC-side mappings. All mandatory unless marked optional.</p>
                        <p className="text-info mb-3 small">
                          <strong>Note:</strong> To verify the details please login & verify. <br />
                          <strong>UAT Domain:</strong> <a href="https://testbed.ckycindia.in/ckyc/index.php" target="_blank" rel="noopener noreferrer">https://testbed.ckycindia.in/ckyc/index.php</a>
                        </p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Organization Name <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="As registered with CKYC"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleAlphabeticChange}
                                    placeholder="Enter organization name"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="organizationNameRemarks"
                                    value={formData.organizationNameRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>FI Code / Org Code <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Unique CKYC-mapped identifier"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="fiCodeOrgCode"
                                    value={formData.fiCodeOrgCode}
                                    onChange={handleChange}
                                    placeholder="Enter FI/Org code"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="fiCodeOrgCodeRemarks"
                                    value={formData.fiCodeOrgCodeRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Region Code <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Required for CKYC & SFTP routing"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="regionCode"
                                    value={formData.regionCode}
                                    onChange={handleChange}
                                    placeholder="Enter region code"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="regionCodeRemarks"
                                    value={formData.regionCodeRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Branch Code <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Used for user & SFTP mapping"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="branchCode"
                                    value={formData.branchCode}
                                    onChange={handleChange}
                                    placeholder="Enter branch code"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="branchCodeRemarks"
                                    value={formData.branchCodeRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>5</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verification Branch <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Assigned verification branch"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerificationBranch"
                                    value={formData.kycVerificationBranch}
                                    onChange={handleChange}
                                    placeholder="Enter verification branch"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerificationBranchRemarks"
                                    value={formData.kycVerificationBranchRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>6</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verifier Name</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Optional if auto-mapped"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerifierName"
                                    value={formData.kycVerifierName}
                                    onChange={handleAlphabeticChange}
                                    placeholder="Enter verifier name"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerifierNameRemarks"
                                    value={formData.kycVerifierNameRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>7</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verifier Employee Code</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Optional"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerifierEmployeeCode"
                                    value={formData.kycVerifierEmployeeCode}
                                    onChange={handleChange}
                                    placeholder="Enter employee code"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerifierEmployeeCodeRemarks"
                                    value={formData.kycVerifierEmployeeCodeRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>8</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verifier Designation</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Optional"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerifierDesignation"
                                    value={formData.kycVerifierDesignation}
                                    onChange={handleAlphabeticChange}
                                    placeholder="Enter designation"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="kycVerifierDesignationRemarks"
                                    value={formData.kycVerifierDesignationRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>9</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Maker User ID <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Maker user identifier"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="makerUserId"
                                    value={formData.makerUserId}
                                    onChange={handleAlphanumericChange}
                                    placeholder="Enter maker user ID"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="makerUserIdRemarks"
                                    value={formData.makerUserIdRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>10</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Maker Password</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Maker password"></i>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center px-3 py-2 rounded" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                                    <i className="bi bi-lock-fill me-2 text-warning"></i>
                                    <span className="text-muted">Will be shared personally over mail : <a href="mailto:ps_sakshaml@proteantech.in">ps_sakshaml@proteantech.in</a></span>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="makerPasswordRemarks"
                                    value={formData.makerPasswordRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>11</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Checker User ID <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Checker user identifier"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="checkerUserId"
                                    value={formData.checkerUserId}
                                    onChange={handleAlphanumericChange}
                                    placeholder="Enter checker user ID"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="checkerUserIdRemarks"
                                    value={formData.checkerUserIdRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>12</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Checker Password</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Checker password"></i>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center px-3 py-2 rounded" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                                    <i className="bi bi-lock-fill me-2 text-warning"></i>
                                    <span className="text-muted">Will be shared personally over mail : <a href="mailto:ps_sakshaml@proteantech.in">ps_sakshaml@proteantech.in</a></span>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="checkerPasswordRemarks"
                                    value={formData.checkerPasswordRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>13</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SFTP URL <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="SFTP server URL"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sftpUrl"
                                    value={formData.sftpUrl}
                                    onChange={handleUrlChange}
                                    placeholder="Enter SFTP URL"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sftpUrlRemarks"
                                    value={formData.sftpUrlRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>14</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SFTP Port No. <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="SFTP port number"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sftpPortNo"
                                    value={formData.sftpPortNo}
                                    onChange={handleAlphanumericChange}
                                    placeholder="Enter SFTP port number"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sftpPortNoRemarks"
                                    value={formData.sftpPortNoRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 4: Certificate Configuration */}
                        <h5 className="mb-3">
                          <i className="bi bi-shield-lock me-2"></i>4: Certificate Configuration
                        </h5>
                        <p className="text-muted mb-3">Purpose: Ensure correct CKYC environment and cryptographic readiness.</p>

                        <p className="text-muted mb-1">Note: Please share the certificate to this mail ID : <a href="mailto:ps_sakshaml@proteantech.in">ps_sakshaml@proteantech.in</a></p>

                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Certificate</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Used for API / SFTP / Download"></i>
                                  </div>
                                </td>
                                <td>
                                  <div className="alert alert-warning mb-0 py-2">
                                    <i className="bi bi-lock me-1"></i> Will be shared personally (one to one)
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="certificateInfoRemarks"
                                    value={formData.certificateInfoRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Certificate Password</td>
                                <td>
                                  <div className="alert alert-warning mb-0 py-2">
                                    <i className="bi bi-lock me-1"></i> Will be shared personally (one to one)
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="certificatePasswordInfoRemarks"
                                    value={formData.certificatePasswordInfoRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 5: Bulk Download & SFTP */}
                        <h5 className="mb-3">
                          <i className="bi bi-cloud-download me-2"></i>5: Bulk Download & SFTP Enablement
                        </h5>
                        <p className="text-muted mb-3">Purpose: Activated only if bulk operations are required.</p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Bulk Download Required <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Master switch"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="bulkDownloadRequired"
                                    value={formData.bulkDownloadRequired}
                                    onChange={handleBulkDownloadChange}
                                  >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="bulkDownloadRequiredRemarks"
                                    value={formData.bulkDownloadRequiredRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 6: API & IP Whitelisting */}
                        <h5 className="mb-3">
                          <i className="bi bi-globe me-2"></i>6: API & Microservice IP Whitelisting
                        </h5>
                        <p className="text-muted mb-1">Purpose: CERSAI firewall approval.</p>
                        <p className="text-muted mb-3">Note: API and SFTP IP Should be different.</p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>API FUNCTIONALITY <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Must be unique"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="apiFunctionality"
                                    value={formData.apiFunctionality}
                                    onChange={handleChange}
                                    placeholder="Enter API IP address"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="apiFunctionalityRemarks"
                                    value={formData.apiFunctionalityRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SFTP FUNCTIONALITY <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Must differ from above"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sftpFunctionality"
                                    value={formData.sftpFunctionality}
                                    onChange={handleChange}
                                    placeholder="Enter SFTP IP address"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sftpFunctionalityRemarks"
                                    value={formData.sftpFunctionalityRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <div>
                                      <span>IP Whitelisting Confirmed & Enabled <span className="text-danger">*</span></span><br />
                                      <small className="text-muted">For both API & SFTP functionality</small>
                                    </div>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="By CERSAI"></i>
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="ipWhitelistingConfirmed"
                                    value={formData.ipWhitelistingConfirmed}
                                    onChange={handleChange}
                                  >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="ipWhitelistingConfirmedRemarks"
                                    value={formData.ipWhitelistingConfirmedRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 7: Points of Contact */}
                        <h5 className="mb-3">
                          <i className="bi bi-people me-2"></i>7: Points of Contact
                        </h5>
                        <p className="text-muted mb-3">Purpose: Operational clarity.</p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '15%' }}>Role</th>
                                <th style={{ width: '20%' }}>Name</th>
                                <th style={{ width: '20%' }}>Email</th>
                                <th style={{ width: '15%' }}>Phone</th>
                                <th style={{ width: '25%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Technical SPOC <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Mandatory Details"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="technicalSPOCName"
                                    value={formData.technicalSPOCName}
                                    onChange={handleAlphabeticChange}
                                    placeholder="Name"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="technicalSPOCEmail"
                                    value={formData.technicalSPOCEmail}
                                    onChange={handleEmailChange}
                                    placeholder="Email"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="tel"
                                    className="form-control"
                                    name="technicalSPOCPhone"
                                    value={formData.technicalSPOCPhone}
                                    onChange={handlePhoneChange}
                                    placeholder="Phone"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="technicalSPOCRemarks"
                                    value={formData.technicalSPOCRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Business SPOC</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Mandatory Details"></i>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="businessSPOCName"
                                    value={formData.businessSPOCName}
                                    onChange={handleAlphabeticChange}
                                    placeholder="Name"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="businessSPOCEmail"
                                    value={formData.businessSPOCEmail}
                                    onChange={handleEmailChange}
                                    placeholder="Email"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="tel"
                                    className="form-control"
                                    name="businessSPOCPhone"
                                    value={formData.businessSPOCPhone}
                                    onChange={handlePhoneChange}
                                    placeholder="Phone"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="businessSPOCRemarks"
                                    value={formData.businessSPOCRemarks}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Customer Sign-Off */}
                        <h5 className="mb-3">
                          <i className="bi bi-pen me-2"></i>Customer Confirmation & Sign-Off
                        </h5>
                        <div className="alert alert-info d-flex justify-content-between align-items-center">
                          <span>
                            I confirm that the above infrastructure and access prerequisites have been validated and are ready for deployment.
                            Any delays due to unmet prerequisites may impact project timelines.
                          </span>
                          <i className="bi bi-info-circle" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Please review and confirm the prerequisites before submitting"></i>
                        </div>
                        <div className="form-check mb-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="acceptanceConfirmed"
                            checked={formData.acceptanceConfirmed}
                            onChange={handleChange}
                          />
                          <label className="form-check-label fw-bold">
                            I accept and confirm the above statement <span className="text-danger">*</span>
                          </label>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <label className="form-label">Customer Name</label>
                            <input
                              className="form-control"
                              name="signOffCustomerName"
                              value={formData.signOffCustomerName}
                              onChange={handleAlphabeticChange}
                              placeholder="Enter customer name"
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Designation</label>
                            <input
                              className="form-control"
                              name="designation"
                              value={formData.designation}
                              onChange={handleAlphabeticChange}
                              placeholder="Enter designation"
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Sign-Off Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="signOffDate"
                              value={formData.signOffDate}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Alert Box */}
                        {alertMessage.message && (
                          <div className={`alert alert-${alertMessage.type}`}>
                            {alertMessage.message}
                          </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setActiveInnerTab('infra')}
                          >
                            <i className="bi bi-arrow-left me-1"></i> Previous
                          </button>
                          {!isViewMode && (
                            <div>
                              <button
                                type="button"
                                className="btn btn-outline-secondary me-2"
                                onClick={handleReset}
                              >
                                Reset
                              </button>
                              <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                              >
                                {loading && (
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                )}
                                <i className="bi bi-check-circle me-1"></i> Submit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PROD Tab */}
                <div className={`tab-pane fade ${activeTab === 'prod' ? 'show active' : ''}`}>
                  {/* Inner Tabs */}
                  <ul className="nav nav-pills mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeProdInnerTab === 'infra' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setActiveProdInnerTab('infra')}
                      >
                        <i className="bi bi-hdd-network me-2"></i>Infra
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeProdInnerTab === 'org' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setActiveProdInnerTab('org')}
                      >
                        <i className="bi bi-building-check me-2"></i>Org Onboarding
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        type="button"
                        onClick={() => setShowArchModal(true)}
                      >
                        <i className="bi bi-diagram-3 me-2"></i>Architecture
                      </button>
                    </li>
                  </ul>

                  {/* PROD Inner Tab Content */}
                  <div className="tab-content">
                    {/* PROD Infra Tab */}
                    {activeProdInnerTab === 'infra' && (
                      <div className="tab-pane fade show active">
                        {/* Section 1: Customer & Project Details */}
                        <h5 className="mb-3">1. Customer & Project Details</h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead className="table-secondary">
                              <tr>
                                <th style={{ width: '30%' }}>Field</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Customer Name <span className="text-danger">*</span></td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="prodCustomerName"
                                    value={formData.prodCustomerName}
                                    onChange={handleAlphabeticChange}
                                    required={!isViewMode && activeTab === 'prod'}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Server Type</td>
                                <td>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="prodServerType"
                                      value="physical"
                                      checked={formData.prodServerTypePhysical}
                                      onChange={(e) => handleServerTypeChange(e, 'prod')}
                                    />
                                    <label className="form-check-label">On-prem</label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="prodServerType"
                                      value="cloud"
                                      checked={formData.prodServerTypeCloud}
                                      onChange={(e) => handleServerTypeChange(e, 'prod')}
                                    />
                                    <label className="form-check-label">Cloud</label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>Cloud / DC Provider</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="prodCloudDCProvider"
                                    value={formData.prodCloudDCProvider}
                                    onChange={handleAlphabeticChange}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Date of Assessment</td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="prodDateOfAssessment"
                                    value={formData.prodDateOfAssessment}
                                    onChange={handleChange}
                                    min={today}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 2: Infrastructure Validation */}
                        <h5 className="mb-3">2. Infrastructure, Network & Platform Validation</h5>
                        <div className="table-responsive">
                          <table className="table table-bordered align-middle infra-table">
                            <thead className="table-secondary">
                              <tr className="text-center align-middle">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '45%' }}>Pre-Requisite Check</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  Hardware Requirements (Prod)<br />
                                  <small className="text-muted">Recomended : 12 vCPUs / 32 GB RAM / 150 GB SSD (2 Servers)</small>
                                </td>
                                <td>
                                  <select className="form-select" name="prodHardwareProdStatus" value={formData.prodHardwareProdStatus} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodHardwareProdRemarks" value={formData.prodHardwareProdRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>OS Name & Version <span className="text-danger">*</span><br /><small className="text-muted">Ubuntu version 24 & above / RHEL version 9.7</small></td>
                                <td>
                                  <select className="form-select" name="prodOsNameVersion" value={formData.prodOsNameVersion} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Ubuntu">Ubuntu</option>
                                    <option value="RHEL">RHEL</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodOsNameVersionRemarks" value={formData.prodOsNameVersionRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Internet Connectivity <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="VM can download packages & Docker images"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodInternetConnectivityStatus" value={formData.prodInternetConnectivityStatus} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodInternetConnectivityRemarks" value={formData.prodInternetConnectivityRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Domain <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Domain to Access the Application"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodDnsMappingStatus" value={formData.prodDnsMappingStatus} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodDnsMappingRemarks" value={formData.prodDnsMappingRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>5</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Cross VM Connectivity <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Communication between VMs"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodPortStatus" value={formData.prodPortStatus} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodPortRemarks" value={formData.prodPortRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>6</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <div>
                                      Firewall<br />
                                      <small className="text-muted">Open port 443 for public HTTPS access. Open port 80 publicly only for Let's Encrypt validation. If SSL is terminated at the Load Balancer, port 80 is used only for LB-to-VM forwarding and is not exposed to the public.</small>
                                    </div>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Required ports allowed"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodFirewallStatus" value={formData.prodFirewallStatus} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodFirewallRemarks" value={formData.prodFirewallRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>7</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Root Access <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="ROOT user access provided"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodRootAccessStatus" value={formData.prodRootAccessStatus} onChange={handleChange} required={!isViewMode && activeTab === 'prod'}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodRootAccessRemarks" value={formData.prodRootAccessRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>8</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>DR Required</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Disaster Recovery setup requirement"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodDrRequiredStatus" value={formData.prodDrRequiredStatus} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td><input className="form-control" name="prodDrRequiredRemarks" value={formData.prodDrRequiredRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {formError && (
                          <div className="alert alert-danger mt-3">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {formError}
                          </div>
                        )}

                        <div className="text-end mt-4">
                          <button type="button" className="btn btn-primary" onClick={handleNextProdInfra}>
                            Next <i className="bi bi-arrow-right ms-1"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PROD Org Onboarding Tab */}
                    {activeProdInnerTab === 'org' && (
                      <div className="tab-pane fade show active">
                        {/* Section 3: Organization Details */}
                        <h5 className="mb-3"><i className="bi bi-building me-2"></i>3: Organization & CKYC Registration Details</h5>
                        <p className="text-muted mb-1">Purpose: Establish identity and CKYC-side mappings. All mandatory unless marked optional.</p>
                        <p className="text-info mb-3 small">
                          <strong>Note:</strong> To verify the details please login & verify. <br />
                          <strong>PROD Domain:</strong> <a href="https://www.ckycindia.in/ckyc/index.php" target="_blank" rel="noopener noreferrer">https://www.ckycindia.in/ckyc/index.php</a>
                        </p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Organization Name <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="As registered with CKYC"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodOrganizationName" value={formData.prodOrganizationName} onChange={handleAlphabeticChange} placeholder="Enter organization name" /></td>
                                <td><input type="text" className="form-control" name="prodOrganizationNameRemarks" value={formData.prodOrganizationNameRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>FI Code / Org Code <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Unique CKYC-mapped identifier"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodFiCodeOrgCode" value={formData.prodFiCodeOrgCode} onChange={handleChange} placeholder="Enter FI/Org code" /></td>
                                <td><input type="text" className="form-control" name="prodFiCodeOrgCodeRemarks" value={formData.prodFiCodeOrgCodeRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Region Code <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Required for CKYC & SFTP routing"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodRegionCode" value={formData.prodRegionCode} onChange={handleChange} placeholder="Enter region code" /></td>
                                <td><input type="text" className="form-control" name="prodRegionCodeRemarks" value={formData.prodRegionCodeRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Branch Code <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Used for user & SFTP mapping"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodBranchCode" value={formData.prodBranchCode} onChange={handleChange} placeholder="Enter branch code" /></td>
                                <td><input type="text" className="form-control" name="prodBranchCodeRemarks" value={formData.prodBranchCodeRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>5</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verification Branch <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Assigned verification branch"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodKycVerificationBranch" value={formData.prodKycVerificationBranch} onChange={handleChange} placeholder="Enter verification branch" /></td>
                                <td><input type="text" className="form-control" name="prodKycVerificationBranchRemarks" value={formData.prodKycVerificationBranchRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>6</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verifier Name</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Optional if auto-mapped"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodKycVerifierName" value={formData.prodKycVerifierName} onChange={handleAlphabeticChange} placeholder="Enter verifier name" /></td>
                                <td><input type="text" className="form-control" name="prodKycVerifierNameRemarks" value={formData.prodKycVerifierNameRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>7</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verifier Employee Code</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Optional"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodKycVerifierEmployeeCode" value={formData.prodKycVerifierEmployeeCode} onChange={handleChange} placeholder="Enter employee code" /></td>
                                <td><input type="text" className="form-control" name="prodKycVerifierEmployeeCodeRemarks" value={formData.prodKycVerifierEmployeeCodeRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>8</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>KYC Verifier Designation</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Optional"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodKycVerifierDesignation" value={formData.prodKycVerifierDesignation} onChange={handleAlphabeticChange} placeholder="Enter designation" /></td>
                                <td><input type="text" className="form-control" name="prodKycVerifierDesignationRemarks" value={formData.prodKycVerifierDesignationRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>9</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Maker User ID <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Maker user identifier"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodMakerUserId" value={formData.prodMakerUserId} onChange={handleAlphanumericChange} placeholder="Enter maker user ID" /></td>
                                <td><input type="text" className="form-control" name="prodMakerUserIdRemarks" value={formData.prodMakerUserIdRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>10</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Maker Password</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Maker password"></i>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center px-3 py-2 rounded" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                                    <i className="bi bi-lock-fill me-2 text-warning"></i>
                                    <span className="text-muted">Will be shared personally over mail : <a href="mailto:ps_sakshaml@proteantech.in">ps_sakshaml@proteantech.in</a></span>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodMakerPasswordRemarks" value={formData.prodMakerPasswordRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>11</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Checker User ID <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Checker user identifier"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodCheckerUserId" value={formData.prodCheckerUserId} onChange={handleAlphanumericChange} placeholder="Enter checker user ID" /></td>
                                <td><input type="text" className="form-control" name="prodCheckerUserIdRemarks" value={formData.prodCheckerUserIdRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>12</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Checker Password</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Checker password"></i>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center px-3 py-2 rounded" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                                    <i className="bi bi-lock-fill me-2 text-warning"></i>
                                    <span className="text-muted">Will be shared personally over mail : <a href="mailto:ps_sakshaml@proteantech.in">ps_sakshaml@proteantech.in</a></span>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodCheckerPasswordRemarks" value={formData.prodCheckerPasswordRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>13</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SFTP URL <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="SFTP server URL"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodSftpUrl" value={formData.prodSftpUrl} onChange={handleUrlChange} placeholder="Enter SFTP URL" /></td>
                                <td><input type="text" className="form-control" name="prodSftpUrlRemarks" value={formData.prodSftpUrlRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>14</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SFTP Port No. <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="SFTP port number"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodSftpPortNo" value={formData.prodSftpPortNo} onChange={handleAlphanumericChange} placeholder="Enter SFTP port number" /></td>
                                <td><input type="text" className="form-control" name="prodSftpPortNoRemarks" value={formData.prodSftpPortNoRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 4: Certificate Configuration */}
                        <h5 className="mb-3"><i className="bi bi-shield-lock me-2"></i>4: Certificate Configuration</h5>
                        <p className="text-muted mb-3">Purpose: Ensure correct CKYC environment and cryptographic readiness.</p>
                        <p className="text-muted mb-1">Note: Please share the certificate to this mail ID : <a href="mailto:ps_sakshaml@proteantech.in">ps_sakshaml@proteantech.in</a></p>

                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Certificate</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Used for API / SFTP / Download"></i>
                                  </div>
                                </td>
                                <td><div className="alert alert-warning mb-0 py-2"><i className="bi bi-lock me-1"></i> Will be shared personally (one to one)</div></td>
                                <td><input type="text" className="form-control" name="prodCertificateInfoRemarks" value={formData.prodCertificateInfoRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Certificate Password</td>
                                <td><div className="alert alert-warning mb-0 py-2"><i className="bi bi-lock me-1"></i> Will be shared personally (one to one)</div></td>
                                <td><input type="text" className="form-control" name="prodCertificatePasswordInfoRemarks" value={formData.prodCertificatePasswordInfoRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 5: Bulk Download & SFTP */}
                        <h5 className="mb-3"><i className="bi bi-cloud-download me-2"></i>5: Bulk Download & SFTP Enablement</h5>
                        <p className="text-muted mb-3">Purpose: Activated only if bulk operations are required.</p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Bulk Download Required <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Master switch"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodBulkDownloadRequired" value={formData.prodBulkDownloadRequired} onChange={handleBulkDownloadChange}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                  </select>
                                </td>
                                <td><input type="text" className="form-control" name="prodBulkDownloadRequiredRemarks" value={formData.prodBulkDownloadRequiredRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 6: API & IP Whitelisting */}
                        <h5 className="mb-3"><i className="bi bi-globe me-2"></i>6: API & Microservice IP Whitelisting</h5>
                        <p className="text-muted mb-1">Purpose: CERSAI firewall approval.</p>
                        <p className="text-muted mb-3">Note: API and SFTP IP Should be different.</p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Field</th>
                                <th style={{ width: '35%' }}>Value</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>API FUNCTIONALITY <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Must be unique"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodApiFunctionality" value={formData.prodApiFunctionality} onChange={handleChange} placeholder="Enter API IP address" /></td>
                                <td><input type="text" className="form-control" name="prodApiFunctionalityRemarks" value={formData.prodApiFunctionalityRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>SFTP FUNCTIONALITY <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Must differ from above"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodSftpFunctionality" value={formData.prodSftpFunctionality} onChange={handleChange} placeholder="Enter SFTP IP address" /></td>
                                <td><input type="text" className="form-control" name="prodSftpFunctionalityRemarks" value={formData.prodSftpFunctionalityRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <div>
                                      <span>IP Whitelisting Confirmed & Enabled <span className="text-danger">*</span></span><br />
                                      <small className="text-muted">For both API & SFTP functionality</small>
                                    </div>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="By CERSAI"></i>
                                  </div>
                                </td>
                                <td>
                                  <select className="form-select" name="prodIpWhitelistingConfirmed" value={formData.prodIpWhitelistingConfirmed} onChange={handleChange}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                  </select>
                                </td>
                                <td><input type="text" className="form-control" name="prodIpWhitelistingConfirmedRemarks" value={formData.prodIpWhitelistingConfirmedRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Section 7: Points of Contact */}
                        <h5 className="mb-3"><i className="bi bi-people me-2"></i>7: Points of Contact</h5>
                        <p className="text-muted mb-3">Purpose: Operational clarity.</p>
                        <div className="table-responsive mb-4">
                          <table className="table table-bordered align-middle org-table">
                            <thead className="table-secondary">
                              <tr className="text-center">
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '15%' }}>Role</th>
                                <th style={{ width: '20%' }}>Name</th>
                                <th style={{ width: '20%' }}>Email</th>
                                <th style={{ width: '15%' }}>Phone</th>
                                <th style={{ width: '25%' }}>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Technical SPOC <span className="text-danger">*</span></span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Mandatory Details"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodTechnicalSPOCName" value={formData.prodTechnicalSPOCName} onChange={handleAlphabeticChange} placeholder="Name" /></td>
                                <td><input type="email" className="form-control" name="prodTechnicalSPOCEmail" value={formData.prodTechnicalSPOCEmail} onChange={handleEmailChange} placeholder="Email" /></td>
                                <td><input type="tel" className="form-control" name="prodTechnicalSPOCPhone" value={formData.prodTechnicalSPOCPhone} onChange={handlePhoneChange} placeholder="Phone" /></td>
                                <td><input type="text" className="form-control" name="prodTechnicalSPOCRemarks" value={formData.prodTechnicalSPOCRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>Business SPOC</span>
                                    <i className="bi bi-info-circle-fill text-primary" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Mandatory Details"></i>
                                  </div>
                                </td>
                                <td><input type="text" className="form-control" name="prodBusinessSPOCName" value={formData.prodBusinessSPOCName} onChange={handleAlphabeticChange} placeholder="Name" /></td>
                                <td><input type="email" className="form-control" name="prodBusinessSPOCEmail" value={formData.prodBusinessSPOCEmail} onChange={handleEmailChange} placeholder="Email" /></td>
                                <td><input type="tel" className="form-control" name="prodBusinessSPOCPhone" value={formData.prodBusinessSPOCPhone} onChange={handlePhoneChange} placeholder="Phone" /></td>
                                <td><input type="text" className="form-control" name="prodBusinessSPOCRemarks" value={formData.prodBusinessSPOCRemarks} onChange={handleChange} placeholder="Remarks" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-4" />

                        {/* Customer Sign-Off */}
                        <h5 className="mb-3"><i className="bi bi-pen me-2"></i>Customer Confirmation & Sign-Off</h5>
                        <div className="alert alert-info d-flex justify-content-between align-items-center">
                          <span>
                            I confirm that the above infrastructure and access prerequisites have been validated and are ready for deployment.
                            Any delays due to unmet prerequisites may impact project timelines.
                          </span>
                          <i className="bi bi-info-circle" style={{ cursor: 'pointer' }} onClick={handleInfoClick} onMouseEnter={handleInfoMouseEnter} onMouseLeave={handleInfoMouseLeave} data-tip="Please review and confirm the prerequisites before submitting"></i>
                        </div>
                        <div className="form-check mb-4">
                          <input className="form-check-input" type="checkbox" name="prodAcceptanceConfirmed" checked={formData.prodAcceptanceConfirmed} onChange={handleChange} />
                          <label className="form-check-label fw-bold">
                            I accept and confirm the above statement <span className="text-danger">*</span>
                          </label>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <label className="form-label">Customer Name</label>
                            <input className="form-control" name="prodSignOffCustomerName" value={formData.prodSignOffCustomerName} onChange={handleAlphabeticChange} placeholder="Enter customer name" />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Designation</label>
                            <input className="form-control" name="prodDesignation" value={formData.prodDesignation} onChange={handleAlphabeticChange} placeholder="Enter designation" />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Sign-Off Date</label>
                            <input type="date" className="form-control" name="prodSignOffDate" value={formData.prodSignOffDate} onChange={handleChange} />
                          </div>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" className="btn btn-secondary" onClick={() => setActiveProdInnerTab('infra')}>
                            <i className="bi bi-arrow-left me-1"></i> Previous
                          </button>
                          {!isViewMode && (
                            <div>
                              <button type="button" className="btn btn-outline-secondary me-2" onClick={handleReset}>Reset</button>
                              <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                <i className="bi bi-check-circle me-1"></i> Submit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Architecture Modal */}
      {showArchModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-diagram-3 me-2"></i>System Architecture
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowArchModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <i className="bi bi-image me-2"></i>Architecture Diagram 1
                      </div>
                      <div className="card-body text-center">
                        <img
                          src={`${import.meta.env.BASE_URL}images/architecture1.svg?v=2`}
                          alt="Architecture Diagram 1"
                          className="img-fluid rounded clickable-arch-img"
                          style={{ maxHeight: '400px' }}
                          onClick={() => handleOpenZoom(`${import.meta.env.BASE_URL}images/architecture1.svg?v=2`, 'Architecture Diagram 1')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <i className="bi bi-image me-2"></i>Architecture Diagram 2
                      </div>
                      <div className="card-body text-center">
                        <img
                          src={`${import.meta.env.BASE_URL}images/architecture2.svg?v=2`}
                          alt="Architecture Diagram 2"
                          className="img-fluid rounded clickable-arch-img"
                          style={{ maxHeight: '400px' }}
                          onClick={() => handleOpenZoom(`${import.meta.env.BASE_URL}images/architecture2.svg?v=2`, 'Architecture Diagram 2')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowArchModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Note Modal */}
      {showImportantNote && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>Important Note
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImportantNote(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger mb-3">
                  <h6 className="alert-heading"><i className="bi bi-exclamation-triangle-fill me-2"></i>CERSAI Registration Required</h6>
                  <p className="mb-2"><strong>Organization Onboarding must be initiated before infrastructure deployment.</strong></p>
                  <p className="mb-2">This process involves registration and validation with CERSAI, which typically takes <strong>10–15 working days</strong> to receive confirmation.</p>
                  <p className="mb-0">Deployment activities can proceed only after CERSAI approval and submission of all required onboarding details.</p>
                </div>


              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowImportantNote(false)}>
                  <i className="bi bi-check-lg me-2"></i>I Understand, Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Zoom Lightbox */}
      {zoomImageSrc && (
        <div className="zoom-lightbox-backdrop" onClick={handleCloseZoom}>
          <div className="zoom-lightbox-header" onClick={(e) => e.stopPropagation()}>
            <span className="zoom-lightbox-title">
              <i className="bi bi-diagram-3 me-2"></i>{zoomImageTitle}
            </span>
            <button className="zoom-lightbox-close" onClick={handleCloseZoom} title="Close Zoom">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div
            className={`zoom-lightbox-viewport ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const zoomFactor = 0.15;
              if (e.deltaY < 0) {
                setZoomScale(prev => Math.min(prev + zoomFactor, 4));
              } else {
                setZoomScale(prev => Math.max(prev - zoomFactor, 0.5));
              }
            }}
            onClick={handleCloseZoom}
          >
            <img
              src={zoomImageSrc}
              alt={zoomImageTitle}
              className="zoom-lightbox-image"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (zoomScale === 1) {
                  setZoomScale(2);
                } else if (!isDragging) {
                  handleZoomReset();
                }
              }}
            />
          </div>

          <div className="zoom-lightbox-controls" onClick={(e) => e.stopPropagation()}>
            <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out" disabled={zoomScale <= 0.5}>
              <i className="bi bi-dash-lg"></i>
            </button>
            <span className="zoom-scale-indicator">{Math.round(zoomScale * 100)}%</span>
            <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In" disabled={zoomScale >= 4}>
              <i className="bi bi-plus-lg"></i>
            </button>
            <button className="zoom-btn" onClick={handleZoomReset} title="Reset Zoom">
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreRequisiteForm;
