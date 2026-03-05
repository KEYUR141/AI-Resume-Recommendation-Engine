import React, { useEffect } from 'react';

const InternshipModal = ({ internship, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!internship) return null;

  const skills = internship.skills
    ? internship.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{internship.position || internship.role}</h2>
            <p className="modal-company">{internship.company}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Info Grid */}
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span className="modal-info-icon">📍</span>
              <div>
                <p className="modal-info-label">Location</p>
                <p className="modal-info-value">{internship.location}</p>
              </div>
            </div>

            <div className="modal-info-item">
              <span className="modal-info-icon">💰</span>
              <div>
                <p className="modal-info-label">Stipend</p>
                <p className="modal-info-value text-green-600">{internship.stipend}</p>
              </div>
            </div>

            <div className="modal-info-item">
              <span className="modal-info-icon">⏱️</span>
              <div>
                <p className="modal-info-label">Duration</p>
                <p className="modal-info-value text-blue-600">{internship.duration}</p>
              </div>
            </div>

            <div className="modal-info-item">
              <span className="modal-info-icon">👤</span>
              <div>
                <p className="modal-info-label">Role</p>
                <p className="modal-info-value">{internship.role}</p>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          {internship.qualifications && (
            <div className="modal-section">
              <h3 className="modal-section-title">🎓 Qualifications</h3>
              <p className="modal-section-text">{internship.qualifications}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title">🛠️ Skills Required</h3>
              <div className="modal-skills">
                {skills.map((skill, idx) => (
                  <span key={idx} className="modal-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {internship.description && (
            <div className="modal-section">
              <h3 className="modal-section-title">📄 Description</h3>
              <p className="modal-section-text">{internship.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipModal;
