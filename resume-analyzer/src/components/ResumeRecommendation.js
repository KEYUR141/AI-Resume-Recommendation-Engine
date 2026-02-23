
import React, { useState } from 'react';
import { uploadResume } from '../api';

const ResumeRecommendation = ({ onRecommend }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      if (onRecommend) onRecommend(data);
    } catch (err) {
      setResult({ error: 'Failed to get recommendation.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Resume Upload & Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Get Recommendation'}</button>
      </form>
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Recommendation Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeRecommendation;
