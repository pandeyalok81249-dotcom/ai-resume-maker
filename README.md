# ResumeAI – Intelligent AI Resume Maker & Builder

A production-ready, full-stack AI Resume Builder platform designed with a premium SaaS user experience. Helps students, fresh graduates, job seekers, and experienced executives create professional, ATS-friendly resumes using Artificial Intelligence.

---

## 🌟 Key Features

### 1. 🤖 AI-Powered Resume Intelligence
- **1-Click AI Resume Tailorer:** Automatically scans any job posting, tailors your summary, weaves in high-priority keywords, updates experience bullets with verified metrics, and projects your ATS score boost before applying.
- **AI Interview Prep & Mock Coach:** Generates customized interview questions (STAR Behavioral, Technical Deep Dive, System Architecture, Team Collaboration) linked directly to your resume achievements, providing sample answers, talking points, and interactive practice with instant AI answer evaluation (0–100 score, strengths, and improvements).
- **AI Salary & Career Market Insights:** Calculates compensation bands (25th, Median, 75th, Top 10%), tracks high-demand skill premiums (e.g. Kubernetes, System Design, GenAI), and outlines milestone career trajectory roadmaps.
- **AI Professional Summary Generator:** Crafts customized 3-sentence executive summaries tailored by target role, years of experience, key competencies, and custom tone (Professional, Executive, Confident, Technical, Entry-Level).
- **AI Bullet Point Generator:** Turns basic duty descriptions into high-impact, outcome-oriented accomplishments with strong action verbs and quantified metrics.
- **AI Resume Content Improver:** Enhances grammar, sentence structure, active voice, and professional tone without fabricating false qualifications or employment history.
- **ATS Resume Compatibility Checker:** Analyzes formatting, keyword density, section hierarchy, and completeness to calculate an overall ATS score (0–100) and grade (A+, A, B, C) with actionable suggestions.
- **Job Description Keyword Matching:** Paste any job posting description to extract required hard and soft skills, calculate match percentage, view matched vs. missing keywords, and get tailored summary recommendations.
- **AI Career Objective Generator:** Generates specialized career objectives for students, freshers, and career switchers.
- **AI Cover Letter Generator:** Automatically writes a matching, tailored cover letter customized to the target employer and position.
- **LinkedIn Profile Optimizer:** Generates punchy headlines, engaging "About" bios, and industry hashtags.
- **Intelligent Demo Engine & Live AI Providers:** Runs out of the box with zero setup using an intelligent rule-based heuristic engine, with full support for OpenAI (`gpt-4o-mini`), Google Gemini (`gemini-1.5-flash`), or local Ollama when API keys are configured.

### 2. 🌐 Multi-Format Export & Sharing Suite
- **Public Web Portfolio Link:** Publish an instant, recruiter-friendly web link with verified credentials, interactive view, direct candidate contact button (`mailto:`), and 1-click PDF download.
- **ATS Plain Text (.txt) Copy:** Generates clean, standard ASCII text format for copy-pasting directly into Workday, Taleo, Greenhouse, and Lever application text boxes without broken styling.
- **JSON Resume Standard:** Import and export standard `jsonresume.org` JSON schema with 1 click for seamless data portability.
- **GitHub Markdown (.md) Export:** Clean formatted Markdown for developer READMEs and personal knowledge bases.

### 2. 🎨 8 Professionally Designed Resume Templates
1. **Modern Professional:** Clean 2-column sidebar layout with indigo accents and high ATS readability.
2. **Classic Corporate:** Traditional single-column format with serif typography (Merriweather), horizontal rules, and pedigree.
3. **Minimalist:** Swiss-style grid with generous whitespace and razor-sharp focus on content.
4. **Software Developer:** Tech-focused layout with monospace font (Fira Code), stack chips, and GitHub links.
5. **Fresher Resume:** Prioritizes university education, GPA, academic projects, and campus achievements first.
6. **Creative Resume:** Vibrant header gradients (Purple/Cyan), stylized experience timeline, and visual badges.
7. **Executive Resume:** Leadership competencies matrix, board memberships, and business metrics.
8. **Academic CV:** Comprehensive Curriculum Vitae format for research publications, grants, and teaching appointments.

### 3. ⚡ Split-Screen Real-Time Editor
- **Left Side:** Step-by-step form editor (Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Additional Sections) with section enable/disable toggles.
- **Right Side:** Instant real-time preview of the selected template as you type, with zoom controls (70%–140%), accent color palette, font selector, and spacing adjustments.
- **PDF Export:** Vector-rendered downloadable A4 PDF with exact margins, consistent alignment, and clean page breaks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, html2pdf.js, Canvas Confetti |
| **Backend** | Java 17/21, Spring Boot 3.3.4, Spring Data JPA, Spring Security (JWT), OpenPDF |
| **Database** | H2 Database (Default zero-config), PostgreSQL, MySQL |
| **AI Layer** | Multi-engine abstraction (OpenAI, Gemini, Ollama, Intelligent Rule Engine) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17 or 21** installed
- **Node.js 18+ and npm** installed
- **Maven** (A bundled Apache Maven 3.9.6 is pre-configured in the scratch directory)

### 1. Launch Spring Boot Backend
```powershell
cd backend
# Run with bundled Maven or system mvn:
mvn spring-boot:run
```
> The backend boots on **`http://localhost:8080`**. It automatically initializes default templates and creates the demo user account.

### 2. Launch React Vite Frontend
```powershell
cd frontend
npm install
npm run dev
```
> The frontend will be available at **`http://localhost:5173`**.

### 3. One-Click Runner (PowerShell)
You can also launch everything with a single script:
```powershell
.\run-app.ps1
```

---

## 🔑 Demo Login Credentials

For quick evaluation without manual sign-up, use the **1-Click Demo** button on the Login page or enter:
- **Email:** `demo@resumeai.com`
- **Password:** `demo1234`

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login and obtain JWT token
- `POST /api/auth/logout` – Logout
- `GET /api/auth/me` – Current authenticated user profile
- `POST /api/auth/reset-password-request` – Request password reset
- `POST /api/auth/reset-password` – Reset password

### Resumes
- `GET /api/resumes` – List current user's resumes
- `POST /api/resumes` – Create new resume
- `GET /api/resumes/{id}` – Get resume by ID
- `PUT /api/resumes/{id}` – Update resume content, sections, and styling
- `DELETE /api/resumes/{id}` – Delete resume
- `POST /api/resumes/{id}/duplicate` – Duplicate existing resume
- `GET /api/resumes/{id}/download` – Download high-precision PDF
- `GET /api/resumes/public/{id}` – Public recruiter web view (no authentication required if public)
- `POST /api/resumes/{id}/toggle-public` – Toggle public shareable link access

### AI Intelligence
- `POST /api/ai/tailor-resume` – 1-Click AI resume tailorer with JD keyword injection & score projection
- `POST /api/ai/interview-prep` – Generate tailored STAR behavioral, technical, and architectural questions
- `POST /api/ai/evaluate-answer` – Real-time mock interview answer evaluator with score and refined phrasing
- `POST /api/ai/salary-insights` – Compensation benchmarks, skill multipliers, and career roadmap
- `POST /api/ai/generate-summary` – Generate professional summary
- `POST /api/ai/generate-bullets` – Convert tasks into high-impact bullet points
- `POST /api/ai/improve-content` – Enhance grammar, tone, and action verbs
- `POST /api/ai/ats-analysis` – Calculate ATS score, detect keywords, provide suggestions
- `POST /api/ai/job-match` – Match resume against job description
- `POST /api/ai/career-objective` – Generate personalized career objectives
- `POST /api/ai/cover-letter` – Generate matching cover letter
- `POST /api/ai/linkedin-summary` – Generate headline and About section

### Templates & User
- `GET /api/templates` – List all 8 resume templates
- `GET /api/user/profile` – Get user profile
- `PUT /api/user/profile` – Update target role & industry
- `GET /api/user/stats` – Dashboard analytics (total resumes, average ATS score)

---

## ⚙️ Environment Variables & Configuration

The application works out of the box in `dev` mode with an embedded persistent H2 database. To configure production databases or live LLM API keys:

```yaml
# application.yml
app:
  ai:
    provider: openai # demo, openai, gemini, ollama
    openai:
      api-key: ${OPENAI_API_KEY}
    gemini:
      api-key: ${GEMINI_API_KEY}

# Switch profile:
# spring.profiles.active: postgres / mysql / dev
```

---

## ☁️ Deploying to Render (Free Tier)

This repository includes a multi-stage `Dockerfile` and `render.yaml` for 1-click deployment on [Render](https://render.com).

1. Push this repository to GitHub.
2. In the Render Dashboard, click **New +** ➔ **Blueprint** and select your repository.
3. Render automatically builds the unified full-stack image and deploys it with SSL:
   `https://<your-app-name>.onrender.com`

For complete details, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📄 License
MIT License. Built for job seekers, developers, and students worldwide.

