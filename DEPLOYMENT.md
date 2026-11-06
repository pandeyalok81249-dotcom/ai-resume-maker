# 🚀 Render Deployment Guide — AI Resume Maker

This project is pre-configured for **1-Click Free Deployment on [Render](https://render.com)** using a unified, multi-stage Docker container (`Dockerfile` + `render.yaml`).

Both the **React 18 Frontend** and the **Spring Boot 3.3 Backend** run within a single lightweight container, requiring **zero CORS configuration** and fitting 100% within Render's free tier.

---

## ⚡ Option 1: Automatic Blueprint Deploy (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: production ready full-stack ai resume maker"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

2. **Open Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **New +** in the top right, then select **Blueprint**.
   - Connect your GitHub repository.
   - Render will automatically detect `render.yaml` and configure:
     - **Service Name**: `ai-resume-maker`
     - **Runtime**: `Docker`
     - **Instance Type**: `Free`
     - **Health Check**: `/api/health`
     - **JWT Secret**: Auto-generated cryptographically secure token
   - Click **Apply**.

3. **Your App is Live**:
   Render will build both the frontend and backend, test the health check, and assign you a free HTTPS URL:
   `https://ai-resume-maker.onrender.com`

---

## 🛠️ Option 2: Manual Web Service Deploy (Step-by-Step)

If you prefer not using Blueprints:

1. In Render Dashboard, click **New +** ➔ **Web Service**.
2. Select your connected GitHub repository.
3. Configure settings:
   - **Name**: `ai-resume-maker`
   - **Language**: `Docker`
   - **Branch**: `main`
   - **Region**: Any (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
   - **Instance Type**: `Free`
4. Expand **Advanced**:
   - **Health Check Path**: `/api/health`
   - **Environment Variables**:
     - `PORT` = `8080`
     - `SPRING_PROFILES_ACTIVE` = `dev`
     - `AI_PROVIDER` = `demo` *(change to `openai` or `gemini` if providing keys)*
     - `JWT_SECRET` = `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
5. Click **Create Web Service**.

---

## 🤖 Configuring Live AI Providers (Optional)

Out of the box, the project uses the zero-config **Intelligent Demo Engine** which generates realistic bullet points, STAR interview questions, ATS scores, and salary benchmarks without external API keys.

To use live LLMs on Render, add these environment variables in the Render Dashboard under **Environment**:

### OpenAI (GPT-4o Mini / GPT-4o)
- `AI_PROVIDER`: `openai`
- `OPENAI_API_KEY`: `sk-proj-...`

### Google Gemini (Gemini 1.5 Flash / Pro)
- `AI_PROVIDER`: `gemini`
- `GEMINI_API_KEY`: `AIzaSy...`

---

## 🗄️ Database Options on Render

1. **Default (H2 Embedded Persistent Database)**:
   - Uses persistent disk storage on Render (default `dev` profile).
   - Zero setup required.
   
2. **Managed PostgreSQL on Render (Optional)**:
   - Click **New +** ➔ **PostgreSQL** in Render.
   - Set `SPRING_PROFILES_ACTIVE` = `postgres`.
   - Add environment variable `SPRING_DATASOURCE_URL` pointing to the Internal Database URL provided by Render.

---

## 🧪 Verifying Your Render Deployment

Once Render finishes deploying (Status: `Live`):
- Visit `https://your-service.onrender.com`
- Check health: `https://your-service.onrender.com/api/health`
- Default seeded login: `demo@resumeai.com` / `demo1234`

