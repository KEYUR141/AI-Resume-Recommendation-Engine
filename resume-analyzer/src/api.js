// src/api.js
// Centralized API utility for frontend using axios

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api';

console.log('API_BASE:', API_BASE);

export async function fetchInternships() {
  const url = `${API_BASE}/internships/get_internships/`;
  console.log('Fetching internships from:', url);
  try {
    const res = await axios.get(url);
    console.log('Internships fetched successfully:', res.data);
    // Handle custom action response format {status: true, data: [...]}
    return res.data.data || res.data;
  } catch (err) {
    console.error('Error fetching internships:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

export async function uploadResume(formData) {
  const url = `${API_BASE}/internships/recommend/`;
  console.log('Uploading resume to:', url);
  try {
    const res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Resume uploaded and recommendations received:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error uploading resume:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

// Fetch a single internship by uuid
export async function fetchInternshipDetail(uuid) {
  const url = `${API_BASE}/internships/${uuid}/`;
  console.log('Fetching internship detail from:', url);
  try {
    const res = await axios.get(url);
    console.log('Internship detail fetched successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error fetching internship detail:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}
