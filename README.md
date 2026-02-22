# ATS Resume Analyzer

An enterprise-level ATS (Applicant Tracking System) Resume Analyzer built using React, Django REST Framework, and NLP. This system analyzes resumes against job descriptions, calculates ATS scores, predicts job roles, and provides a recruiter dashboard for candidate management.

---

## Features

- Upload resume and job description
- Extract skills using NLP (spaCy)
- Calculate ATS compatibility score
- Predict best matching job role
- Identify matched and missing skills
- Provide improvement suggestions
- Recruiter dashboard with candidate pipeline
- Save, update, and delete candidates
- Persistent database storage (SQLite)
- Professional ATS report with charts and PDF export

---

## Tech Stack

**Frontend**
- React.js
- Recharts
- HTML, CSS, JavaScript

**Backend**

- Django
- Django REST Framework
- Python

**NLP**
- spaCy
- Custom skill extraction engine

**Database**
- SQLite (development)
- PostgreSQL (production-ready)

---

## System Architecture

React Frontend → Django REST API → ATS Engine (Skill Extractor + ATS Calculator) → Database → Recruiter Dashboard

---

## Project Structure
ATS-Resume-Analyzer/ │ ├── backend/ │   ├── analyzer/ │   │   ├── models.py │   │   ├── views.py │   │   ├── urls.py │   │   ├── skill_extractor.py │   │   ├── resume_parser.py │   │   └── ats_calculator.py │   └── manage.py │ ├── frontend/ │   ├── src/ │   │   ├── components/ │   │   │   ├── Dashboard.js │   │   │   ├── ATSReport.js │   │   │   └── Upload.js │   │   └── App.js │ └── README.md

---

## Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### Frontend

```bash
cd frontend
npm install
npm start
