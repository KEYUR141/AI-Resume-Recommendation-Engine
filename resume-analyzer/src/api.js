// src/api.js
// Centralized API utility for frontend using axios

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || '/api';

export async function fetchInternships() {
  const res = await axios.get(`${API_BASE}/internships/`);
  return res.data;
}

export async function uploadResume(formData) {
  const res = await axios.post(`${API_BASE}/recommend/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
