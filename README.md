# 🎓 DSP Learning Platform

An interactive, responsive digital learning platform for **Digital Signal Processing (DSP)** academic courses and laboratory sessions. Built with **React 19 + Vite 8 + Tailwind CSS + React Router 7 + Supabase**.

---

## 🚀 Quick Run (تشغيل فوري)

### Option 1: Standalone Desktop EXE (No Node.js Required)
1. Download or clone this repository.
2. Double-click **`Run-DSP-Platform.bat`** (or open `release/DSP-Platform.exe`).
3. The platform starts locally and opens your browser automatically at `http://localhost:5173`.

### Option 2: Development Mode (npm)
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (Supabase)
cp .env.example .env.local
# Add your Supabase URL & Anon Key into .env.local

# 3. Start local development server
npm run dev

# 4. Open in browser: http://localhost:5173
```

---

## 🗄️ Supabase Backend Setup

The platform uses Supabase for Authentication and Progress tracking:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Under **Project Settings → API Keys**, copy:
   - `Project URL`
   - `anon / public key`
4. Paste them into `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. In **Authentication → URL Configuration**, add `http://localhost:5173` to the Redirect URLs allowlist.

---

## 📚 Course Content & Materials

Connected directly to the official Google Drive course folders:
- **Lectures 01 to 08**: Full lecture presentations with direct embedded PDF viewing and downloads.
- **Sections & Labs**: MATLAB / Python lab recitations and starter code.
- **Exam Bank**: Quizzes, practice assessments, and question files.

---

## 🗺️ Application Route Map

| Path | Screen | Description |
|---|---|---|
| `/login` | Login | Email & password authentication |
| `/signup` | Registration | Create new student account |
| `/dashboard` | Dashboard | Course overview, progress metrics, recent lectures |
| `/lectures` | Lectures Catalog | Browse all 8 lectures with video & PDF filters |
| `/lectures/:id` | Lecture Player | Video player & interactive slides card |
| `/lectures/:id/pdf` | PDF Viewer | Full interactive document viewer with zoom & download |
| `/lectures/:id/video`| Video Session | Google Drive video & lab recording sessions |
| `/sections` | Sections | Recitations, practical labs, and assignments |
| `/exams` | Exam Bank | Quizzes, distraction-free test runner, and results |
| `/progress` | Learning Analytics | Topic mastery matrix & syllabus tracking |
| `/settings` | Settings | Profile, credentials, and account preferences |

---

## 🛠️ Scripts & Build

```bash
npm run dev        # Starts Vite dev server
npm run build      # Builds production bundle to dist/
npm run preview    # Previews production build
npm run lint       # Runs Oxlint code linter
```

---

## 👥 Architecture & Team Structure

Follows modular domain-driven feature architecture (`src/features/`):
- `src/features/auth/`: Authentication flow
- `src/features/dashboard/`: Student metrics & hub
- `src/features/lectures/`: Lectures, video players, and PDF viewer
- `src/features/sections/`: Recitation & lab workspaces
- `src/features/exams/`: Assessment engine & exam bank
- `src/features/progress/`: Analytics & syllabus tracking
