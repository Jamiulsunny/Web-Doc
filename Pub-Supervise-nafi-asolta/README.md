**# PubSupervise (Pundra University of Science & Technology)

## Setup
1. Copy `.env.example` to `.env` and fill in: DATABASE_URL / DIRECT_URL (NeonDB), JWT_SECRET, SMTP_* (Gmail app password), MAIL_FROM, SEED_COORDINATOR_*, FACULTY_DEFAULT_EMAIL
2. `npm install`            (also generates the Prisma client)
3. `npx prisma db push`     (schema is `schema.prisma` in the project root)
4. `npm run db:seed`        (coordinator account + 100-entry faculty directory)
5. `npm run dev`            (runs `node server.js`: Next.js + Socket.io) then open http://localhost:3000

## Notes
- Coordinator login: username `coordinator` + SEED_COORDINATOR_PASSWORD. Faculty log in with the username emailed to them.
- File uploads (PDF, ZIP, Word, PowerPoint, PNG, JPG) up to 25 MB are stored in the database. Larger files: upload to Google Drive and paste the link.
- Faculty emails can be changed in the coordinator dashboard (single, all, or bulk).
- Real-time chat needs the custom server (`npm run dev` / `npm start`), so host on a Node server, not Vercel.
**# Academic Thesis & Project Management System (ATPMS)

## 1. System Overview & User Roles
The system operates around four primary roles with granular access controls:

*   **Student / Researcher:** Submits research proposals, uploads milestone-based deliverables, communicates with supervisors via chat, and accesses logged meeting histories.
*   **Supervisor:** Evaluates project proposals, approves or requests revisions on milestone deliverables, provides contextual feedback, and schedules progress meetings.
*   **Coordinator (Admin):** Manages faculty workloads, allocates project groups, tracks departmental milestones, identifies at-risk projects, and schedules final defenses.
*   **Board Member / Examiner:** Evaluates project defense presentations and assigns scores based on structured departmental rubrics.

---

## 2. Core Functional Modules

### Proposal Submission & Allocation Engine
*   **Team Submission:** Students submit proposals in teams, specifying title, abstract, team members, and preferred supervisor.
*   **Workload Balancing:** The Coordinator sets strict faculty load limits (e.g., maximum 4 groups per supervisor) and assigns teams accordingly.
*   **Version-Controlled Project Scope:** When a supervisor approves or suggests revisions to a proposal, the ratified scope is snapshot-versioned to prevent retroactive requirement changes.

### Milestone Lifecycle & Deadline Tracking
*   **Staged Execution:** Projects advance through discrete phases (Literature Review, System Design, Implementation, Draft Report, Final Book).
*   **Automated Flags:** Milestones passing deadlines without supervisor-accepted deliverables trigger automated Overdue flags across dashboards.

### Deliverable Auditing & Communication
*   **Immutable Submission History:** Deliverable uploads (documents, live links, repository commits) are versioned. Old versions are never overwritten or deleted, ensuring a permanent audit trail.
*   **Contextual Feedback & Direct Messaging:** Supervisors can attach comments and revision requests directly to specific file submissions, supplemented by real-time private messaging channels between team members and assigned supervisors.

### Meeting Logs & Coordinator Oversight
*   **Action-Item Tracking:** Records meeting discussions, assigned deliverables, designated assignees, and target completion dates.
*   **Risk Dashboard:** The Coordinator dashboard visualizes stagnant workflows, overdue milestones, and underperforming groups for proactive intervention.

### Final Defense & Rubric-Based Evaluation
*   **Pre-Defense Package:** Final defense readiness requires uploading plagiarism reports (e.g., Turnitin), production-ready source code, posters, and the compiled thesis document.
*   **Rubric Scoring:** Board Members grade defense presentations through a multi-factor rubric, aggregating final marks directly within the platform.

---

## 3. Departmental Research Journal Portal
An integrated publishing engine designed to convert defense-cleared work into accessible departmental assets.

### Publication Pipeline
*   **Student Submission:** Following defense clearance, students submit a formal publication package containing the finalized thesis book, source code repository link, indexed abstract, technology stacks/tags (e.g., React, Machine Learning), and a publication-formatted paper.
*   **Supervisor Review Loop:** The assigned supervisor reviews formatting, writing standards, and codebase integrity. The supervisor can initiate a revision loop or issue approval.
*   **Coordinator Verification:** The Coordinator reviews the supervisor-cleared submission against departmental publication standards and grants final approval.
*   **Public/Secured Archival:** The submission is indexed and made accessible on the departmental research portal for faculty and future batches.

### Citation & Indexing Engine
*   **Departmental DOI / Citation Generator:** Automatically generates a standardized citation code and departmental identifier (e.g., `DU-CSE-2026-TH-045`) for every published thesis, facilitating formal citation in academic CVs.

---

## 4. Authentication & User Lifecycle Workflows

### Student Registration Pipeline
*   **Registration Form:** Students submit core identification parameters: Full Name, Institutional Email, Phone Number, Student ID, and Password.
*   **Email Verification (Nodemailer OTP):** A 6-digit one-time password (OTP) is dispatched via an in-house Nodemailer service (without third-party managed auth providers like Clerk). The account entry remains unverified and inactive until the OTP is validated.
*   **Coordinator Approval Gateway:** Validated accounts enter a `Pending Coordinator Approval` state. The Coordinator manually audits credentials (ID, email domain, student profile) before setting the account to `ACTIVE`.

### Faculty & Board Member Provisioning
*   **Administrative Provisioning:** Coordinators initialize faculty accounts via an administrative console by entering the instructor's Full Name, Official Email, and assigned system role(s).
*   **Automated Credential Dispatch:** A secure, temporary password is generated and dispatched to the faculty member's official inbox via Nodemailer, prompting a password reset on first authentication.
*   **Single-Identity Persistence:** Faculty accounts are provisioned once. Existing emails prevent duplicate records across academic cycles, allowing supervisors to be reassigned to new cohorts without account recreation.

### Role Flexibility & Multi-Panel Access
*   **Dual-Role Assignment:** Faculty can hold simultaneous roles (`SUPERVISOR` and `BOARD_MEMBER`).
*   **Dynamic Access Routing:**
    *   *Supervisor Only:* Grants access to the Supervisor Dashboard.
    *   *Board Member Only:* Grants access to the Defense Evaluation Console.
    *   *Dual Role:* Grants access to an integrated interface with context-switching capabilities between the Supervisor and Board Member panels.
*   **Administrative Privilege Management:** The Coordinator can grant, adjust, or revoke role flags at any point during an academic term.

### Soft Deactivation & Lifecycle Archival
*   **Database-Level Status Flag:** User records maintain a state attribute (e.g., `isActive: Boolean` or `status: ACTIVE | DEACTIVATED | SUSPENDED`).
*   **Authentication Interception:** Inactive faculty accounts fail login with a clear rejection response: *"Your account has been deactivated. Please contact the department coordinator."*
*   **Referential Data Integrity:** Soft deactivation retains all historical relations—supervised projects, archived meeting minutes, evaluation rubrics, and journal approvals remain intact and fully queryable.
*   **Single-Click Reactivation:** Returning faculty members are reactivated when the Coordinator toggles the `isActive` state back to `true`, restoring immediate platform access with existing credentials.
