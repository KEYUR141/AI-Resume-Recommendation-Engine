// src/api.js
// Centralized API utility for frontend using axios

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api';

console.log('API_BASE:', API_BASE);

// ─── Helper: get stored access token ────────────────────────────────
function getAccessToken() {
  return localStorage.getItem('access_token');
}

// ─── Helper: build auth header ──────────────────────────────────────
function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth API ───────────────────────────────────────────────────────
export async function registerUser({ username, email, password, password2, first_name, last_name, role }) {
  const url = `${API_BASE}/auth/register/`;
  try {
    const res = await axios.post(url, {
      username, email, password, password2,
      first_name: first_name || '',
      last_name: last_name || '',
      role: role || 'student',
    });
    return res.data;
  } catch (err) {
    console.error('Registration error:', err.response?.data || err.message);
    throw err;
  }
}

export async function loginUser({ username, password }) {
  const url = `${API_BASE}/auth/login/`;
  try {
    const res = await axios.post(url, { username, password });
    return res.data;
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    throw err;
  }
}

export async function fetchCurrentUser() {
  const url = `${API_BASE}/auth/get_user/`;
  try {
    const res = await axios.get(url, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    console.error('Fetch user error:', err.response?.data || err.message);
    throw err;
  }
}

// ─── Internships API ────────────────────────────────────────────────

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

// ─── Resume Embeddings API ──────────────────────────────────────────

// Upload resume for embedding processing (Celery task)
export async function uploadResumeForEmbedding(formData) {
  const url = `${API_BASE}/resumes/upload/`;
  console.log('Uploading resume for embedding to:', url);
  try {
    const res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeaders(),
      },
    });
    console.log('Resume uploaded for embedding:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error uploading resume for embedding:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

// Fetch current user's uploaded resumes
export async function fetchMyResumes() {
  const url = `${API_BASE}/resumes/my_resumes/`;
  console.log('Fetching my resumes from:', url);
  try {
    const res = await axios.get(url, { headers: authHeaders() });
    console.log('My resumes fetched:', res.data);
    return res.data.resumes || res.data;
  } catch (err) {
    console.error('Error fetching my resumes:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

// ─── AI Recommendation API (FAISS + LLM) ───────────────────────────

export async function getAIRecommendations(resumeText) {
  const url = `${API_BASE}/internships/recommend_by_llm/`;
  console.log('Getting AI recommendations from:', url);
  try {
    const res = await axios.post(url, { resume_text: resumeText }, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    console.log('AI recommendations received:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error getting AI recommendations:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}
