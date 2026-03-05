
import React, { useState, useEffect, useCallback } from 'react';
import { getAIRecommendations, fetchMyResumes } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const AIRecommendation = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [inputMode, setInputMode] = useState('select'); // 'select' or 'paste'
  const { isDark } = useTheme();

  const loadResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const data = await fetchMyResumes();
      const resumeList = Array.isArray(data) ? data : [];
      setResumes(resumeList.filter(r => r.status === 'completed'));
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
    setLoadingResumes(false);
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let textToSend = resumeText;
    
    if (inputMode === 'select' && selectedResumeId) {
      // The backend will use the resume embeddings from FAISS
      // We just send the resume_text which the backend uses for engine matching
      const selected = resumes.find(r => String(r.id) === String(selectedResumeId));
      if (!selected) return;
      textToSend = selectedResumeId; // Send resume ID; backend will retrieve parsed_text
    }
    
    if (!textToSend.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await getAIRecommendations(textToSend);
      setResult(data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to get AI recommendations. Please try again.';
      setResult({ status: false, error: errorMsg });
    }
    setLoading(false);
  };

  const canSubmit = inputMode === 'paste' ? resumeText.trim().length > 0 : selectedResumeId !== '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🤖 AI Resume Recommendations</h2>
          <p className="text-gray-600">Get intelligent internship matches powered by FAISS semantic search & LLM analysis</p>
        </div>

        <div className="internship-card max-w-3xl mx-auto">
          {/* Input Mode Toggle */}
          <div className="input-mode-toggle mb-6">
            <button
              type="button"
              className={`mode-btn ${inputMode === 'select' ? 'active' : ''}`}
              onClick={() => setInputMode('select')}
            >
              📁 Select Uploaded Resume
            </button>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'paste' ? 'active' : ''}`}
              onClick={() => setInputMode('paste')}
            >
              📝 Paste Resume Text
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {inputMode === 'select' ? (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  📁 Choose from Your Processed Resumes
                </label>
                
                {loadingResumes ? (
                  <div className="text-center py-4">
                    <div className="spinner animate-spin mx-auto mb-2" style={{width: '1.5rem', height: '1.5rem'}}></div>
                    <p className="text-sm text-gray-500">Loading your resumes...</p>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="text-3xl mb-2">📭</div>
                    <p className="font-medium text-gray-700 mb-1">No processed resumes available</p>
                    <p className="text-sm text-gray-500">
                      Upload a resume in the <strong>"Upload Resume"</strong> section first and wait for processing to complete.
                    </p>
                  </div>
                ) : (
                  <div className="resume-select-list">
                    {resumes.map((resume, index) => (
                      <label 
                        key={resume.id || index} 
                        className={`resume-select-item ${String(selectedResumeId) === String(resume.id) ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="resume-select"
                          value={resume.id}
                          checked={String(selectedResumeId) === String(resume.id)}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="resume-radio"
                        />
                        <div className="resume-select-info">
                          <div className="font-medium text-gray-900">
                            📄 {resume.file ? resume.file.split('/').pop() : `Resume #${index + 1}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            Uploaded: {new Date(resume.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </div>
                        </div>
                        <span className="resume-status-badge status-completed">✅ Ready</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  📝 Paste Your Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here... Include your skills, experience, education, and qualifications for best results."
                  className="resume-textarea"
                  rows={10}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {resumeText.length} characters entered
                </p>
              </div>
            )}

            {loading && (
              <div className="progress-container">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">AI is analyzing...</span>
                  <span className="text-sm text-gray-500">🤖 FAISS + LLM Processing</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill ai-progress" style={{width: '60%'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This may take 10-30 seconds as we search through embeddings and consult the AI model.
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !canSubmit}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-3"
            >
              {loading ? (
                <>
                  <div className="spinner animate-spin mr-3" style={{width: '1.5rem', height: '1.5rem'}}></div>
                  AI is Recommending...
                </>
              ) : (
                <>
                  🤖 Get AI Recommendations
                </>
              )}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-8">
              {result.error || result.status === false ? (
                <div className="error-card">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">❌</div>
                    <h3 className="text-lg font-semibold">Recommendation Failed</h3>
                  </div>
                  <p className="text-sm">{result.error || 'Something went wrong. Please try again.'}</p>
                </div>
              ) : (
                <div className="success-card">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🎉</div>
                    <h3 className="text-xl font-semibold">AI Recommendations Ready!</h3>
                  </div>

                  {result.result && Array.isArray(result.result) && result.result.length > 0 ? (
                    <div>
                      <p className="mb-4 text-sm opacity-90">
                        The AI found {result.result.length} curated internship recommendations for you:
                      </p>
                      <div className="ai-recommendation-grid">
                        {result.result.map((rec, index) => (
                          <div key={index} className="ai-recommendation-card">
                            <div className="ai-rec-header">
                              <span className="ai-rec-rank">#{index + 1}</span>
                              <h4 className="ai-rec-title">{rec.position || rec.role || rec.title}</h4>
                            </div>
                            {rec.company && (
                              <p className="ai-rec-company">🏢 {rec.company}</p>
                            )}
                            {rec.location && (
                              <p className="ai-rec-detail">📍 {rec.location}</p>
                            )}
                            {rec.stipend && (
                              <p className="ai-rec-detail">💰 {rec.stipend}</p>
                            )}
                            {rec.reason && (
                              <div className="ai-rec-reason">
                                <span className="font-medium text-xs">Why this match:</span>
                                <p className="text-xs mt-1">{rec.reason}</p>
                              </div>
                            )}
                            {rec.match_score && (
                              <div className="ai-rec-score">
                                <span className="text-xs text-gray-500">AI Score:</span>
                                <span className="text-xs font-bold text-purple-600">
                                  {typeof rec.match_score === 'number' 
                                    ? `${Math.round(rec.match_score * 100)}%` 
                                    : rec.match_score}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-green-100 mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">AI Response:</h4>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-64">
                        {JSON.stringify(result.result || result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="feature-info-banner mt-8 max-w-3xl mx-auto">
          <div className="text-2xl mb-2">🧠</div>
          <h3 className="font-semibold text-gray-900 mb-1">How AI Recommendations Work</h3>
          <p className="text-sm text-gray-600">
            Your resume is matched against our internship database using <strong>FAISS vector similarity search</strong>. 
            The top semantic matches are then analyzed by a <strong>Large Language Model (LLM)</strong> 
            that provides curated recommendations with explanations for why each internship suits your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
