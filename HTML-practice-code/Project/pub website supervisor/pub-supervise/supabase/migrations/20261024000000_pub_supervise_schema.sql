-- ============================================================
-- PUB SuperVise: Complete Production Database Schema & RLS
-- Pundra University of Science & Technology
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments & Batches
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  faculty VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academic_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  batch_number VARCHAR(50) NOT NULL,
  session VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles (Extends Supabase auth.users)
CREATE TYPE user_role_type AS ENUM ('student', 'supervisor', 'admin');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role_type NOT NULL DEFAULT 'student',
  department_id UUID REFERENCES departments(id),
  batch_id UUID REFERENCES academic_batches(id),
  student_id VARCHAR(50),
  designation VARCHAR(100),
  phone VARCHAR(30),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects
CREATE TYPE project_status_type AS ENUM (
  'Proposal Pending',
  'In Progress',
  'Under Review',
  'Revision Required',
  'Ready for Defense',
  'Completed',
  'On Hold'
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(300) NOT NULL,
  abstract TEXT NOT NULL,
  domain VARCHAR(100) NOT NULL,
  department_id UUID REFERENCES departments(id),
  batch_id UUID REFERENCES academic_batches(id),
  status project_status_type NOT NULL DEFAULT 'Proposal Pending',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_defense_date DATE,
  repository_url TEXT,
  dataset_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Project Members & Supervisor Assignments
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_team VARCHAR(50) DEFAULT 'Researcher',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, student_id)
);

CREATE TABLE IF NOT EXISTS supervisor_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  supervisor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_lead BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, supervisor_id)
);

-- 5. Milestones & Tasks
CREATE TYPE milestone_status_type AS ENUM (
  'Not Started',
  'In Progress',
  'Submitted',
  'Under Review',
  'Revision Required',
  'Approved',
  'Overdue',
  'Completed'
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  due_date DATE NOT NULL,
  status milestone_status_type DEFAULT 'Not Started',
  submission_requirements TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Submissions & Revisions History
CREATE TABLE IF NOT EXISTS submission_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  student_note TEXT,
  submitted_by UUID REFERENCES profiles(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(milestone_id, version_number)
);

CREATE TABLE IF NOT EXISTS submission_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_id UUID REFERENCES submission_versions(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  decision VARCHAR(50) NOT NULL CHECK (decision IN ('Approved', 'Revision Required')),
  methodology_score NUMERIC(3,1),
  implementation_score NUMERIC(3,1),
  documentation_score NUMERIC(3,1),
  presentation_score NUMERIC(3,1),
  comments TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Meetings & Decisions
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  supervisor_id UUID REFERENCES profiles(id),
  date_time TIMESTAMPTZ NOT NULL,
  agenda TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Requested' CHECK (status IN ('Requested', 'Scheduled', 'Completed', 'Declined')),
  meeting_link TEXT,
  location VARCHAR(200),
  decisions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meeting_action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE
);

-- 8. Notifications & Activity Logs
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id),
  actor_name VARCHAR(200) NOT NULL,
  actor_role user_role_type NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for authorization
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_assigned_supervisor(p_id UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM supervisor_assignments WHERE project_id = p_id AND supervisor_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_project_member(p_id UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members WHERE project_id = p_id AND student_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users view all profiles within institution, edit only their own; Admins manage all
CREATE POLICY "Public profiles can be viewed" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access on profiles" ON profiles FOR ALL USING (is_admin());

-- Projects: Members, Assigned Supervisors, and Admins can view
CREATE POLICY "View projects" ON projects FOR SELECT USING (
  is_admin() OR is_assigned_supervisor(id) OR is_project_member(id)
);
CREATE POLICY "Admins or students can create projects" ON projects FOR INSERT WITH CHECK (
  is_admin() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'student'
);
CREATE POLICY "Supervisors or Admins update projects" ON projects FOR UPDATE USING (
  is_admin() OR is_assigned_supervisor(id)
);

-- Submissions & Feedback
CREATE POLICY "View submissions" ON submission_versions FOR SELECT USING (
  is_admin() OR 
  EXISTS (SELECT 1 FROM milestones m WHERE m.id = milestone_id AND (is_assigned_supervisor(m.project_id) OR is_project_member(m.project_id)))
);

CREATE POLICY "Students insert submissions" ON submission_versions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM milestones m WHERE m.id = milestone_id AND is_project_member(m.project_id))
);

CREATE POLICY "Supervisors submit feedback" ON submission_feedback FOR INSERT WITH CHECK (
  is_admin() OR 
  EXISTS (
    SELECT 1 FROM submission_versions sv 
    JOIN milestones m ON m.id = sv.milestone_id 
    WHERE sv.id = version_id AND is_assigned_supervisor(m.project_id)
  )
);

-- Storage bucket configuration for project documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Private documents download" ON storage.objects FOR SELECT USING (
  bucket_id = 'project-documents' AND (
    is_admin() OR 
    (storage.foldername(name))[1] IN (
      SELECT project_id::text FROM project_members WHERE student_id = auth.uid()
      UNION
      SELECT project_id::text FROM supervisor_assignments WHERE supervisor_id = auth.uid()
    )
  )
);

CREATE POLICY "Document uploads by members" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-documents' AND (
    is_admin() OR 
    (storage.foldername(name))[1] IN (
      SELECT project_id::text FROM project_members WHERE student_id = auth.uid()
    )
  )
);
