import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = ({ onSwitch }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field-level error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.password2) errs.password2 = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // DRF returns field-level errors like { username: ["..."], password: ["..."] }
        const fieldErrors = {};
        let generalError = '';
        for (const [key, val] of Object.entries(data)) {
          if (Array.isArray(val)) {
            fieldErrors[key] = val.join(' ');
          } else if (typeof val === 'string') {
            generalError = val;
          }
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setErrors({ general: generalError || 'Registration failed.' });
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🚀</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join AI Resume Analyzer</p>
        </div>

        {errors.general && (
          <div className="auth-error">
            <span>⚠️</span> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-first">First Name</label>
              <input
                id="signup-first"
                name="first_name"
                type="text"
                className="auth-input"
                placeholder="John"
                value={form.first_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-last">Last Name</label>
              <input
                id="signup-last"
                name="last_name"
                type="text"
                className="auth-input"
                placeholder="Doe"
                value={form.last_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-username">Username *</label>
            <input
              id="signup-username"
              name="username"
              type="text"
              className={`auth-input ${errors.username ? 'auth-input-error' : ''}`}
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={loading}
            />
            {errors.username && <span className="auth-field-error">{errors.username}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email *</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-role">Role</label>
            <select
              id="signup-role"
              name="role"
              className="auth-input"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="HR">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">Password *</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password2">Confirm Password *</label>
            <input
              id="signup-password2"
              name="password2"
              type="password"
              className={`auth-input ${errors.password2 ? 'auth-input-error' : ''}`}
              placeholder="Repeat your password"
              value={form.password2}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.password2 && <span className="auth-field-error">{errors.password2}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner animate-spin" style={{ width: '1.2rem', height: '1.2rem', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button className="auth-link" onClick={onSwitch}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
