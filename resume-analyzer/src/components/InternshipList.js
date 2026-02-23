import React, { useEffect, useState } from 'react';
import { fetchInternships } from '../api';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchInternships();
        setInternships(data);
      } catch (err) {
        setError(err.message || 'Failed to load internships');
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2>Internships</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>Error: {error}</div>}
      <ul>
        {internships && internships.length > 0 ? internships.map((intern, idx) => (
          <li key={intern.id || idx}>
            <strong>{intern.position || intern.role}</strong> at {intern.company} ({intern.location})
          </li>
        )) : !loading && <li>No internships available.</li>}
      </ul>
    </div>
  );
};

export default InternshipList;
