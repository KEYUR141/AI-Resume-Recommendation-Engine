import React, { useEffect, useState } from 'react';
import { fetchInternships } from '../api';
import { useTheme } from '../contexts/ThemeContext';
import InternshipModal from './InternshipModal';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        console.log('Starting to load internships...');
        const data = await fetchInternships();
        console.log('Data loaded, setting state:', data);
        setInternships(data);
      } catch (err) {
        console.error('Error in InternshipList:', err);
        setError(err.message || 'Failed to load internships');
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Internship Opportunities</h2>
          <p className="text-gray-600">Discover your next career opportunity</p>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="spinner animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading internships...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="internship-grid">
          {internships && internships.length > 0 ? internships.map((intern) => (
            <div key={intern.uuid} className="internship-card">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {intern.position || intern.role}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="font-medium">{intern.company}</span>
                </div>
                <div className="flex items-center text-gray-500 mb-3">
                  <span>{intern.location}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {intern.stipend && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Stipend:</span>
                    <span className="text-sm font-medium text-green-600">{intern.stipend}</span>
                  </div>
                )}
                {intern.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm font-medium text-blue-600">{intern.duration}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="btn-primary" onClick={() => setSelectedInternship(intern)}>
                  View Details
                </button>
              </div>
            </div>
          )) : !loading && (
            <div className="text-center py-12" style={{gridColumn: '1 / -1'}}>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No internships available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>

      {/* Internship Detail Modal */}
      {selectedInternship && (
        <InternshipModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
}

export default InternshipList;
