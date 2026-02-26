
import './App.css';
import React, { useState } from 'react';
import InternshipList from './components/InternshipList';
import ResumeRecommendation from './components/ResumeRecommendation';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const [page, setPage] = useState('list');
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200" style={{boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="nav-container">
            <div className="nav-brand">
              <h1 className="text-xl font-bold text-gray-900">AI Resume Analyzer</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
              <button 
                onClick={() => { setPage('list'); setMenuOpen(false); }}
                className={`nav-btn ${page === 'list' ? 'active' : ''}`}
              >
                📋 Internships
              </button>
              <button 
                onClick={() => { setPage('recommend'); setMenuOpen(false); }}
                className={`nav-btn ${page === 'recommend' ? 'active' : ''}`}
              >
                🎯 Resume Match
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {page === 'list' && <InternshipList />}
        {page === 'recommend' && <ResumeRecommendation />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
