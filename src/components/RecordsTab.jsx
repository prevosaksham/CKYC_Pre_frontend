import { useState } from 'react';
import individualSample from '../assets/uploads/file-format-individual.xlsx';
import legalSample from '../assets/uploads/file-format-legal.xlsx';

const styles = `
  .records-tab {
    --rc-primary: #00569d;
    --rc-primary-light: #e8f0fa;
    --rc-dark: #1e293b;
    --rc-gray: #64748b;
    --rc-border: #e2e8f0;
    --rc-bg: #f8fafc;
  }

  .records-tab .section-card {
    border: 1px solid var(--rc-border);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s;
  }

  .records-tab .section-card:hover {
    box-shadow: 0 4px 12px rgba(0, 86, 157, 0.08);
  }

  .records-tab .section-header {
    background: var(--rc-primary);
    color: #fff;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.01em;
  }

  .records-tab .section-header i {
    font-size: 17px;
    opacity: 0.85;
  }

  .records-tab .section-body {
    padding: 24px;
  }

  .records-tab .record-type-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    border: 1px solid var(--rc-border);
    border-radius: 8px;
    background: var(--rc-bg);
    transition: all 0.2s;
  }

  .records-tab .record-type-card:hover {
    border-color: var(--rc-primary);
    background: var(--rc-primary-light);
  }

  .records-tab .record-type-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--rc-primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .records-tab .record-type-label {
    font-weight: 600;
    font-size: 15px;
    color: var(--rc-dark);
  }

  .records-tab .record-type-desc {
    font-size: 12.5px;
    color: var(--rc-gray);
    margin-top: 2px;
  }

  .records-tab .sample-table {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--rc-border);
  }

  .records-tab .sample-table thead th {
    background: var(--rc-primary-light);
    color: var(--rc-dark);
    font-weight: 600;
    font-size: 13.5px;
    padding: 12px 16px;
    border: none;
    border-bottom: 2px solid var(--rc-border);
    letter-spacing: 0.02em;
  }

  .records-tab .sample-table tbody td {
    padding: 14px 16px;
    vertical-align: middle;
    font-size: 14px;
    border-color: var(--rc-border);
  }

  .records-tab .sample-table tbody tr:hover {
    background: var(--rc-primary-light);
  }

  .records-tab .btn-download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    background: var(--rc-primary);
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .records-tab .btn-download:hover:not(:disabled) {
    background: #003f75;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 86, 157, 0.3);
  }

  .records-tab .btn-download:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .records-tab .btn-download i {
    font-size: 14px;
  }

  .records-tab .upload-method-tabs {
    display: flex;
    gap: 6px;
    border-bottom: 2px solid var(--rc-border);
    margin-bottom: 24px;
  }

  .records-tab .upload-method-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    border-radius: 6px 6px 0 0;
    margin-bottom: -2px;
    color: var(--rc-gray);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .records-tab .upload-method-tab:hover {
    color: var(--rc-primary);
    background: var(--rc-primary-light);
  }

  .records-tab .upload-method-tab.active {
    color: var(--rc-primary);
    background: var(--rc-primary-light);
    border-bottom-color: var(--rc-primary);
    font-weight: 600;
  }

  .records-tab .upload-method-tab i {
    font-size: 16px;
  }

  .records-tab .upload-content {
    animation: rcFadeIn 0.25s ease-out;
  }

  @keyframes rcFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .records-tab .doc-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 8px;
    border: 1px solid var(--rc-border);
    background: var(--rc-bg);
    flex: 1;
    transition: all 0.2s;
  }

  .records-tab .doc-type-badge:hover {
    border-color: var(--rc-primary);
    background: var(--rc-primary-light);
  }

  .records-tab .doc-type-badge .badge-icon {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .records-tab .doc-type-badge .badge-icon.poi {
    background: #dbeafe;
    color: var(--rc-primary);
  }

  .records-tab .doc-type-badge .badge-icon.poa {
    background: #e0e7ff;
    color: #3730a3;
  }

  .records-tab .format-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .records-tab .format-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--rc-border);
    font-size: 14px;
    color: var(--rc-dark);
    transition: background 0.15s;
  }

  .records-tab .format-list li:last-child {
    border-bottom: none;
  }

  .records-tab .format-list li:hover {
    background: var(--rc-bg);
  }

  .records-tab .format-list li i {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .records-tab .note-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 8px;
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
    font-size: 13.5px;
    color: #92400e;
    margin-top: 16px;
  }

  .records-tab .note-box i {
    font-size: 16px;
    margin-top: 1px;
    flex-shrink: 0;
  }

  .records-tab .sub-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--rc-gray);
    font-weight: 600;
    margin-bottom: 12px;
  }
`;

const RecordsTab = () => {
  const [activeMethod, setActiveMethod] = useState('api');

  return (
    <div className="tab-pane fade show active records-tab">
      <style>{styles}</style>

      <h5 className="mb-2" style={{ color: '#1e293b', fontWeight: 700 }}>
        <i className="bi bi-journal-text me-2" style={{ color: '#00569d' }}></i>
        Records - Information &amp; User Guide
      </h5>
      <p style={{ color: '#64748b', fontSize: '14.5px', marginBottom: '28px' }}>
        This field provides CKYC Record uploaded at Protean CKYC APP Sample Files.
      </p>

      {/* 1. Types of Record */}
      <div className="section-card mb-4">
        <div className="section-header">
          <i className="bi bi-list-check"></i>
          1. Types of Record
        </div>
        <div className="section-body">
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="record-type-card">
                <div className="record-type-icon">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <div className="record-type-label">Individual</div>
                  <div className="record-type-desc">Personal CKYC records for individual customers</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="record-type-card">
                <div className="record-type-icon">
                  <i className="bi bi-building-fill"></i>
                </div>
                <div>
                  <div className="record-type-label">Legal Entity</div>
                  <div className="record-type-desc">CKYC records for organizations and legal entities</div>
                </div>
              </div>
            </div>
          </div>

          <p className="sub-label">Sample Sheets</p>
          <div className="table-responsive">
            <table className="table sample-table mb-0">
              <thead>
                <tr>
                  <th><i className="bi bi-file-earmark me-2"></i>File Name</th>
                  <th style={{ width: '160px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-file-earmark-excel me-2" style={{ color: '#16a34a', fontSize: '18px' }}></i>
                    <span style={{ fontWeight: 500 }}>Individual - Sample Sheet</span>
                  </td>
                  <td>
                    <a href={individualSample} download="file-format-individual.xlsx" className="btn-download">
                      <i className="bi bi-download"></i>
                      Download
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="bi bi-file-earmark-excel me-2" style={{ color: '#16a34a', fontSize: '18px' }}></i>
                    <span style={{ fontWeight: 500 }}>Legal Entity - Sample Sheet</span>
                  </td>
                  <td>
                    <a href={legalSample} download="file-format-legal.xlsx" className="btn-download">
                      <i className="bi bi-download"></i>
                      Download
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Protean CKYC Application Data Upload Methods */}
      <div className="section-card mb-4">
        <div className="section-header">
          <i className="bi bi-cloud-upload"></i>
          2. Protean CKYC Application Data Upload Methods
        </div>
        <div className="section-body">
          <p style={{ color: '#1e293b', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
            There are three supported methods for uploading records in CKYC application.
            Select a method below to view details.
          </p>

          <p className="sub-label mt-3">Document Types</p>
          <div className="d-flex gap-3 mb-4 flex-wrap">
            <div className="doc-type-badge">
              <div className="badge-icon poi">
                <i className="bi bi-card-heading"></i>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>POI</div>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>Proof of Identity</div>
              </div>
            </div>
            <div className="doc-type-badge">
              <div className="badge-icon poa">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>POA</div>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>Proof of Address</div>
              </div>
            </div>
          </div>

          {/* TODO:: un-comment if needed, or delete if not */}

          <p className="sub-label">POI,POA Images Upload Methods</p>
          <div className="upload-method-tabs">
            <button
              className={`upload-method-tab ${activeMethod === 'api' ? 'active' : ''}`}
              onClick={() => setActiveMethod('api')}
            >
              <i className="bi bi-braces"></i> API
            </button>
            <button
              className={`upload-method-tab ${activeMethod === 'excel' ? 'active' : ''}`}
              onClick={() => setActiveMethod('excel')}
            >
              <i className="bi bi-file-earmark-excel"></i> Excel
            </button>
            <button
              className={`upload-method-tab ${activeMethod === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveMethod('manual')}
            >
              <i className="bi bi-hand-index"></i> Manual
            </button>
          </div>

          {/* API Content */}
          {activeMethod === 'api' && (
            <div className="upload-content" key="api">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>API upload method details.</div>
                </div>
              </div>
            </div>
          )}

          {/* Excel Content */}
          {activeMethod === 'excel' && (
            <div className="upload-content" key="excel">
              <p style={{ fontSize: '14px', color: '#475569' }}>
                Users can upload CKYC application data using the prescribed Excel sample format.
                The Excel file should include the required application details along with POI and POA
                document references in the supported formats.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '20px' }}>
                <i className="bi bi-file-earmark-excel" style={{ fontSize: '32px', color: '#16a34a' }}></i>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Use the Sample Sheet</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Download the sample template from the &quot;Types of Record&quot; section above to ensure correct formatting.</div>
                </div>
              </div>

              <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>
                POI and POA documents can be provided using any of the following formats:
              </p>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <ul className="format-list">
                  <li>
                    <i style={{ background: '#fef3c7', color: '#d97706' }}><span className="bi bi-cloud"></span></i>
                    Bucket - GCP, AWS, AZURE
                  </li>
                  <li>
                    <i style={{ background: '#f1f5f9', color: '#475569' }}><span className="bi bi-code-slash"></span></i>
                    Base64 Encoded Data
                  </li>
                  <li>
                    <i style={{ background: '#e8f0fa', color: '#00569d' }}><span className="bi bi-link-45deg"></span></i>
                    Drive Link
                  </li>
                </ul>
              </div>
              <div className="note-box">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>
                  <strong>Note:</strong> Any Drive or external file link provided must be <strong>publicly accessible</strong> so the system can retrieve the documents successfully.
                </div>
              </div>
            </div>
          )}

          {/* Manual Content */}
          {activeMethod === 'manual' && (
            <div className="upload-content" key="manual">
              <p style={{ fontSize: '14px', color: '#475569' }}>
                For manual uploads, users can upload POI and POA documents directly from their local device.
                The application provides a file browser to select and upload the required image or document files.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <i className="bi bi-upload" style={{ fontSize: '32px', color: '#00569d' }}></i>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Direct File Upload</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Browse and select POI/POA documents from your local device for upload.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordsTab;
