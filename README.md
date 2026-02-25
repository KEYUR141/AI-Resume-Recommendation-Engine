
<div align="center">
  <h1>AI Resume Recommendation Engine</h1>
  <p>Empowering job seekers and recruiters with intelligent resume analysis and recommendations.</p>
</div>

---

## 🛠️ Technologies Used

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Django](https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-3.16.1-red?style=for-the-badge&logo=django&logoColor=white)
![FAISS](https://img.shields.io/badge/FAISS-00ADD8?style=for-the-badge&logo=meta&logoColor=white)
![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)
![Transformers](https://img.shields.io/badge/🤗%20Transformers-FFD21E?style=for-the-badge&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white)
![REST API](https://img.shields.io/badge/REST%20API-OpenAPI-brightgreen?style=for-the-badge)


---

## 🚀 Overview

The AI Resume Recommendation Engine is an advanced, full-stack web application that streamlines the process of resume analysis and job matching for both job seekers and recruiters. By leveraging state-of-the-art Artificial Intelligence (AI), Natural Language Processing (NLP), and information retrieval techniques, the system can:

- **Automatically parse and analyze resumes** to extract key skills, experiences, and qualifications.
- **Match candidates to relevant job descriptions** using semantic search and similarity algorithms (powered by FAISS).
- **Provide actionable recommendations** to improve resumes, increasing the chances of selection.
- **Support recruiters** by ranking and filtering candidates based on job fit, saving time and improving hiring quality.

The backend is built with Django and Django REST Framework, ensuring a robust, scalable, and secure API. The architecture is modular, making it easy to extend with new AI/NLP features or integrate with external job boards and HR systems. The project is designed for real-world deployment, with best practices in authentication, testing, and deployment readiness.

This project not only demonstrates technical proficiency in backend and API development, but also showcases the application of AI to solve practical problems in recruitment and career development.

## 🛠️ Features

- Resume parsing and analysis
- Intelligent job matching and recommendations
- RESTful API backend (Django + DRF)
- Modular, scalable backend architecture
- JWT authentication and CORS support
- Ready for integration with a React frontend
- Extensible for future AI/NLP enhancements

## 🏗️ Tech Stack

- **Backend:** Python, Django, Django REST Framework, FAISS, SQLite
- **Frontend:** React (planned)
- **Other:** JWT, CORS, Docker (optional), Celery (optional)

## 📁 Project Structure

```
AI-Resume-Recommendation-Engine/
├── Backend/
│   └── Project/
│       ├── app/
│       └── Project/
├── resume-analyzer/ (frontend)
├── env/ (virtual environment)
└── Scripts/
```

## ⚡ Getting Started

### Prerequisites
- Python 3.11+
- Node.js (for frontend, optional for now)
- pip, virtualenv

### Backend Setup
```bash
cd Backend/Project
python -m venv ../../env
source ../../env/Scripts/activate  # On Windows
pip install -r requirements.txt    # Add your requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup (Planned)
```bash
cd resume-analyzer
npm install
npm start
```

## 📦 API Documentation

Interactive API docs available at `/swagger/` (if enabled).

## 🤖 AI & NLP

- Resume parsing and job matching logic can be found in the `RAG/` and `utils/` directories.
- FAISS is used for efficient similarity search.

## 🧪 Testing

Run backend tests:
```bash
python manage.py test
```

## 📄 License

This project is licensed under the MIT License.

---


