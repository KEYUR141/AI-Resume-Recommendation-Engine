
import React, { useState, useEffect, useCallback } from 'react';
import { uploadResumeForEmbedding, fetchMyResumes } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const STATUS_LABELS = {
  pending: { label: 'Pending', icon: '⏳', className: 'status-pending' },
  processing: { label: 'Processing', icon: '⚙️', className: 'status-processing' },
  completed: { label: 'Completed', icon: '✅', className: 'status-completed' },
  failed: { label: 'Failed', icon: '❌', className: 'status-failed' },
};

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const { isDark } = useTheme();

  const loadResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const data = await fetchMyResumes();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
    setLoadingResumes(false);
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const data = await uploadResumeForEmbedding(formData);
      setUploadResult({ success: true, message: data.message || 'Resume uploaded successfully!' });
      setFile(null);
      // Reset file input
      const input = document.getElementById('resume-embed-upload');
      if (input) input.value = '';
      // Refresh resume list
      loadResumes();
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to upload resume. Please try again.';
      setUploadResult({ success: false, message: errMsg });
    }
    setUploading(false);
  };

  const getStatusInfo = (status) => {
    return STATUS_LABELS[status] || { label: status, icon: '❓', className: 'status-pending' };
  };

  const hasPendingResumes = resumes.some(r => r.status === 'pending' || r.status === 'processing');

  // Auto-refresh if there are pending/processing resumes
  useEffect(() => {
    if (!hasPendingResumes) return;
    const interval = setInterval(() => {
      loadResumes();
    }, 5000);
    return () => clearInterval(interval);
  }, [hasPendingResumes, loadResumes]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">📤 Upload Resume for AI Processing</h2>
          <p className="text-gray-600">Upload your resume to generate embeddings for AI-powered recommendations</p>
        </div>

        {/* Upload Form */}
        <div className="internship-card max-w-3xl mx-auto mb-8">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                📄 Select Resume File
              </label>
              
              <div className="file-input">
                <input 
                  id="resume-embed-upload"
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label 
                  htmlFor="resume-embed-upload" 
                  className={`file-input-label ${file ? 'has-file' : ''}`}
                >
                  {file ? (
                    <>
                      <div className="upload-icon">✅</div>
                      <div className="upload-text">File Selected: {file.name}</div>
                      <div className="upload-subtext">Click to change file</div>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon">📎</div>
                      <div className="upload-text">Click to upload your resume</div>
                      <div className="upload-subtext">PDF, DOC, DOCX files supported • Max 10MB</div>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading || !file}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-3"
            >
              {uploading ? (
                <>
                  <div className="spinner animate-spin mr-3" style={{width: '1.5rem', height: '1.5rem'}}></div>
                  Uploading...
                </>
              ) : (
                <>
                  📤 Upload & Process Resume
                </>
              )}
            </button>
          </form>

          {uploadResult && (
            <div className={`mt-6 ${uploadResult.success ? 'success-card' : 'error-card'}`}>
              <div className="flex items-center">
                <div className="text-2xl mr-3">{uploadResult.success ? '✅' : '❌'}</div>
                <p className="font-medium">{uploadResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* My Resumes Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">📁 My Uploaded Resumes</h3>
            <button 
              onClick={loadResumes} 
              disabled={loadingResumes}
              className="btn-secondary text-sm"
            >
              {loadingResumes ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {loadingResumes && resumes.length === 0 ? (
            <div className="internship-card text-center py-8">
              <div className="spinner animate-spin mx-auto mb-4" style={{width: '2rem', height: '2rem'}}></div>
              <p className="text-gray-600">Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="internship-card text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-600 mb-2">No resumes uploaded yet</p>
              <p className="text-sm text-gray-500">Upload a resume above to get started with AI recommendations</p>
            </div>
          ) : (
            <div className="resume-list">
              {resumes.map((resume, index) => {
                const statusInfo = getStatusInfo(resume.status);
                return (
                  <div key={resume.id || index} className="resume-list-item">
                    <div className="resume-list-item-info">
                      <div className="resume-list-item-name">
                        📄 {resume.file ? resume.file.split('/').pop() : `Resume #${index + 1}`}
                      </div>
                      <div className="resume-list-item-date">
                        Uploaded: {new Date(resume.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className={`resume-status-badge ${statusInfo.className}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasPendingResumes && (
            <div className="feature-info-banner mt-4">
              <p className="text-sm text-gray-600">
                ⏳ Some resumes are still being processed. This page auto-refreshes every 5 seconds.
              </p>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="feature-info-banner mt-8 max-w-3xl mx-auto">
          <div className="text-2xl mb-2">🧠</div>
          <h3 className="font-semibold text-gray-900 mb-1">How Embedding Upload Works</h3>
          <p className="text-sm text-gray-600">
            Your resume is uploaded and processed by our AI pipeline. Text is extracted and converted into 
            vector embeddings using a Sentence Transformer model. Once processing completes, 
            you can use the <strong>AI Recommendations</strong> feature for FAISS-powered semantic matching.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
