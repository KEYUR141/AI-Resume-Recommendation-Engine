
import './App.css';
import React, { useState } from 'react';
import InternshipList from './components/InternshipList';
import ResumeRecommendation from './components/ResumeRecommendation';

function App() {
  const [page, setPage] = useState('list');

  return (
    <div className="App">
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage('list')}>Internships List</button>
        <button onClick={() => setPage('recommend')}>Resume Recommendation</button>
      </nav>
      {page === 'list' && <InternshipList />}
      {page === 'recommend' && <ResumeRecommendation />}
    </div>
  );
}

export default App;
