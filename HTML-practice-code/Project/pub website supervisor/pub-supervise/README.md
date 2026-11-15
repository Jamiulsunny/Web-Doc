# PUB SuperVise — Academic Project & Thesis Supervision Platform
**Pundra University of Science & Technology (PUB), Bogura, Bangladesh**

![PUB SuperVise Visual Identity](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Quick Start (Running in VS Code)

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm or yarn

### Step 1: Install Dependencies
Open your terminal in VS Code:
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🎯 Live Role Switcher (Hackathon Demo Mode)
The application comes pre-seeded with rich, realistic institutional data for Pundra University:
- **Student Persona:** Md. Jamiul Islam Sunny (ID: 03225105101002, 26th Batch, CSE)
- **Supervisor Persona:** Prof. Dr. Md. Rafiqul Ahsan (Professor & Head, CSE)
- **Admin Persona:** Academic Affairs Division / IQAC

You can click the **Role Demo buttons (Student / Supervisor / Admin)** directly in the top navigation bar to test all user journeys seamlessly.

---

## 🏛️ Features Overview
1. **8-Stage Milestone Engine:** Proposal -> Literature Review -> System Architecture -> Core Implementation -> QA & Testing -> Final Defense.
2. **Version-Preserving Artifacts:** Student submissions are archived with immutable version history (v1.0, v2.0) and student notes without overwriting previous work.
3. **Four-Tier Rubric Assessment:** Supervisors grade Methodology, Implementation, Documentation, and Presentation with live score calculation (out of 10).
4. **SuperVise Insight™ Risk Detection:** Automated rule-based engine alerting on elapsed deadlines, stalled reviews, and excessive revisions.
5. **Supervision Meeting Management:** Agendas, Google Meet video links, and action item checklists.
6. **Supabase PostgreSQL & RLS Migrations:** Production-ready schema with Row Level Security in `supabase/migrations/`.

---

## 🔐 Database Setup (Supabase Production Mode)
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL script located in `supabase/migrations/20261024000000_pub_supervise_schema.sql` in the Supabase SQL Editor.
3. Copy your project URL and anon key into `.env`:
   ```env
   VITE_DEMO_MODE=false
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
