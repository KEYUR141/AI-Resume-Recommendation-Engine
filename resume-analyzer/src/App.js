
import './App.css';
import React, { useState } from 'react';
import InternshipList from './components/InternshipList';
import ResumeRecommendation from './components/ResumeRecommendation';
import ResumeUpload from './components/ResumeUpload';
import AIRecommendation from './components/AIRecommendation';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [page, setPage] = useState('list');
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'signup'
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Show loading spinner while checking auth state on mount
  if (loading) {
    return (
      <div className="auth-page">
        <div className="spinner animate-spin" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  // If not authenticated, show login/signup
  if (!isAuthenticated) {
    return authPage === 'login'
      ? <LoginPage onSwitch={() => setAuthPage('signup')} />
      : <SignupPage onSwitch={() => setAuthPage('login')} />;
  }

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
                onClick={() => { setPage('search'); setMenuOpen(false); }}
                className={`nav-btn ${page === 'search' ? 'active' : ''}`}
              >
                🔍 Quick Search
              </button>
              <button 
                onClick={() => { setPage('upload'); setMenuOpen(false); }}
                className={`nav-btn ${page === 'upload' ? 'active' : ''}`}
              >
                📤 Upload Resume
              </button>
              <button 
                onClick={() => { setPage('ai'); setMenuOpen(false); }}
                className={`nav-btn ${page === 'ai' ? 'active' : ''}`}
              >
                🤖 AI Recommend
              </button>

              {/* User Info & Logout */}
              <div className="nav-user">
                <span className="nav-user-name">👤 {user?.username || user?.first_name || 'User'}</span>
                <button onClick={logout} className="nav-btn nav-logout-btn">
                  Logout
                </button>
              </div>
              
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
        {page === 'search' && <ResumeRecommendation />}
        {page === 'upload' && <ResumeUpload />}
        {page === 'ai' && <AIRecommendation />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
