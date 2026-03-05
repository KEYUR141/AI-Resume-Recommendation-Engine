
import React, { useState } from 'react';
import { uploadResume } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const ResumeRecommendation = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const data = await uploadResume(formData);
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to get recommendations. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🔍 Quick Resume Search</h2>
          <p className="text-gray-600">Upload your resume for instant keyword-based internship matching</p>
        </div>
        
        <div className="internship-card max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                📄 Upload Your Resume
              </label>
              
              <div className="file-input">
                <input 
                  id="resume-search-upload"
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <label 
                  htmlFor="resume-search-upload" 
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
            
            {loading && (
              <div className="progress-container">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Matching skills...</span>
                  <span className="text-sm text-gray-500">⚡ Keyword Matching</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '70%'}}></div>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || !file}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-3"
            >
              {loading ? (
                <>
                  <div className="spinner animate-spin mr-3" style={{width: '1.5rem', height: '1.5rem'}}></div>
                  Searching Matches...
                </>
              ) : (
                <>
                  🔍 Find Matching Internships
                </>
              )}
            </button>
          </form>
          
          {result && (
            <div className="mt-8">
              {result.error ? (
                <div className="error-card">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">❌</div>
                    <h3 className="text-lg font-semibold">Search Failed</h3>
                  </div>
                  <p className="text-sm">{result.error}</p>
                </div>
              ) : (
                <div className="success-card">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🎉</div>
                    <h3 className="text-xl font-semibold">Matches Found!</h3>
                  </div>
                  
                  {result.recommendations && result.recommendations.length > 0 ? (
                    <div>
                      <p className="mb-4 text-sm opacity-90">
                        Found {result.recommendations.length} matching internships based on your skills:
                      </p>
                      <div className="recommendation-grid">
                        {result.recommendations.slice(0, 6).map((rec, index) => (
                          <div key={index} className="recommendation-item">
                            <h4 className="font-semibold text-gray-900 mb-1">{rec.position || rec.role}</h4>
                            <p className="text-sm text-gray-600 mb-2">{rec.company}</p>
                            {rec.match_score && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Match Score:</span>
                                <span className="text-xs font-medium text-green-600">{Math.round(rec.match_score * 100)}%</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-green-100 mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Response:</h4>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-64">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Info section */}
        <div className="feature-info-banner mt-8">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold text-gray-900 mb-1">How Quick Search Works</h3>
          <p className="text-sm text-gray-600">
            Your resume is parsed for keywords like skills, qualifications, and experience. 
            These are matched against internship listings using a fast keyword-based algorithm for instant results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeRecommendation;
