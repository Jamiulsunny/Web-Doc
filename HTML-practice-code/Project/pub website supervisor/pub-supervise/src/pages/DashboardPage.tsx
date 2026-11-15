import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, Clock, CheckCircle2, AlertTriangle, Calendar, 
  ArrowUpRight, Users, Sparkles, TrendingUp, ChevronRight, FileText,
  Activity, ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { currentUser, projects, meetings, activities, risks } = useApp();

  // Role: STUDENT DASHBOARD
  if (currentUser.role === 'student') {
    const activeProject = projects[0]; // Student primary project
    const nextMilestone = activeProject.milestones.find(m => m.status === 'In Progress' || m.status === 'Under Review') 
      || activeProject.milestones[0];
    const upcomingMeeting = meetings.find(m => m.status === 'Scheduled');

    return (
      <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-pub-navy via-pub-teal to-pub-cyan/90 text-white p-6 lg:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 tracking-wider">
              Student Academic Terminal &middot; {currentUser.batch}
            </span>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight mt-3">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="text-sm text-pub-cyanSurface mt-2 leading-relaxed">
              Your research project is <strong className="text-white font-bold">{activeProject.progress}% complete</strong>. 
              {nextMilestone && ` Current focus: ${nextMilestone.title}.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link 
                to={`/workspace/${activeProject.id}`} 
                className="bg-white text-pub-navy font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-pub-cyanSurface transition-all shadow-md flex items-center gap-2"
              >
                Open Project Workspace <ArrowUpRight className="w-4 h-4 text-pub-cyan" />
              </Link>
              <Link 
                to="/meetings" 
                className="bg-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-white/25 transition-all border border-white/20 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-pub-cyan" /> View Scheduled Meetings
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <FolderGit2 className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm hover:border-pub-cyan transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pub-muted">Overall Completion</span>
              <span className="p-2 rounded-xl bg-pub-cyanSurface text-pub-teal"><TrendingUp className="w-4 h-4" /></span>
            </div>
            <p className="text-2xl font-black text-pub-navy mt-2">{activeProject.progress}%</p>
            <div className="w-full bg-pub-bg h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-pub-teal h-full rounded-full transition-all duration-500" style={{ width: `${activeProject.progress}%` }} />
            </div>
          </div>

          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm hover:border-pub-cyan transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pub-muted">Next Critical Deadline</span>
              <span className="p-2 rounded-xl bg-pub-cyanSurface text-pub-teal"><Clock className="w-4 h-4" /></span>
            </div>
            <p className="text-lg font-black text-pub-navy mt-2 truncate">{nextMilestone?.title}</p>
            <span className="text-xs font-bold text-pub-warning flex items-center gap-1 mt-2">
              Due {nextMilestone?.dueDate}
            </span>
          </div>

          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm hover:border-pub-cyan transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pub-muted">Approved Milestones</span>
              <span className="p-2 rounded-xl bg-pub-success/10 text-pub-success"><CheckCircle2 className="w-4 h-4" /></span>
            </div>
            <p className="text-2xl font-black text-pub-navy mt-2">
              {activeProject.milestones.filter(m => m.status === 'Approved').length} / {activeProject.milestones.length}
            </p>
            <p className="text-[11px] text-pub-muted mt-2">Milestones officially signed off</p>
          </div>

          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm hover:border-pub-cyan transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pub-muted">Lead Supervisor</span>
              <span className="p-2 rounded-xl bg-pub-cyanSurface text-pub-teal"><Users className="w-4 h-4" /></span>
            </div>
            <p className="text-sm font-bold text-pub-navy mt-2 truncate">{activeProject.supervisor.name}</p>
            <p className="text-[11px] text-pub-teal font-medium mt-1">{activeProject.supervisor.designation}</p>
          </div>
        </div>

        {/* Milestone Progress Bar & Workspace Quick Link */}
        <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-pub-border">
            <div>
              <h3 className="font-extrabold text-pub-navy text-base">Current Research Milestones Roadmap</h3>
              <p className="text-xs text-pub-muted">Interactive milestone pipeline tracking each phase from proposal to defense.</p>
            </div>
            <Link to={`/workspace/${activeProject.id}`} className="text-xs font-bold text-pub-teal hover:underline flex items-center gap-1">
              Go to Workspace <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {activeProject.milestones.map((m, idx) => (
              <div 
                key={m.id}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  m.status === 'Approved'
                    ? 'bg-pub-success/5 border-pub-success/30'
                    : m.status === 'Under Review'
                    ? 'bg-pub-cyanSurface/60 border-pub-cyan/40 shadow-sm'
                    : m.status === 'Revision Required'
                    ? 'bg-pub-warning/5 border-pub-warning/30'
                    : 'bg-pub-bg/50 border-pub-border'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-pub-muted mb-1">
                  <span>Phase {idx + 1}</span>
                  {m.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5 text-pub-success" />}
                  {m.status === 'Under Review' && <Clock className="w-3.5 h-3.5 text-pub-teal animate-spin" />}
                  {m.status === 'Revision Required' && <AlertTriangle className="w-3.5 h-3.5 text-pub-warning" />}
                </div>
                <h4 className="text-xs font-bold text-pub-navy truncate">{m.title}</h4>
                <span className="text-[10px] text-pub-muted block mt-1">Due {m.dueDate}</span>
                <span className={`text-[10px] font-extrabold mt-2 inline-block px-2 py-0.5 rounded ${
                  m.status === 'Approved' ? 'bg-pub-success/15 text-pub-success' : 'bg-pub-bg text-pub-muted'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Columns: Recent Supervisor Feedback & Upcoming Meeting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Supervisor Feedback Card */}
          <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm">
            <h3 className="font-extrabold text-pub-navy text-sm mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pub-accent" /> Recent Supervisor Rubric Feedback
            </h3>
            {activeProject.milestones.flatMap(m => m.versions).filter(v => v.feedback).slice(-1).map(v => (
              <div key={v.id} className="p-4 bg-pub-bg rounded-2xl border border-pub-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-pub-navy">{v.feedback?.reviewerName}</span>
                    <span className="text-[10px] text-pub-muted block">Version {v.versionNumber}.0 Evaluation</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pub-success/10 text-pub-success border border-pub-success/20">
                    {v.feedback?.decision}
                  </span>
                </div>
                <p className="text-xs text-pub-text leading-relaxed italic bg-white p-3 rounded-xl border border-pub-border">
                  "{v.feedback?.comments}"
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-white p-2 rounded-lg border border-pub-border">
                    <span className="text-[10px] text-pub-muted block">Methodology</span>
                    <strong className="text-xs text-pub-navy">{v.feedback?.rubricScores?.methodology}/10</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-pub-border">
                    <span className="text-[10px] text-pub-muted block">Implementation</span>
                    <strong className="text-xs text-pub-navy">{v.feedback?.rubricScores?.implementation}/10</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-pub-border">
                    <span className="text-[10px] text-pub-muted block">Docs</span>
                    <strong className="text-xs text-pub-navy">{v.feedback?.rubricScores?.documentation}/10</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-pub-border">
                    <span className="text-[10px] text-pub-muted block">Presentation</span>
                    <strong className="text-xs text-pub-navy">{v.feedback?.rubricScores?.presentation}/10</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Consultation Meeting Card */}
          <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm">
            <h3 className="font-extrabold text-pub-navy text-sm mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pub-teal" /> Next Consultation Meeting
            </h3>
            {upcomingMeeting ? (
              <div className="p-4 bg-gradient-to-br from-pub-cyanSurface/60 to-white rounded-2xl border border-pub-cyan/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-pub-navy">{upcomingMeeting.agenda}</h4>
                    <span className="text-[11px] text-pub-muted mt-1 block">With {upcomingMeeting.supervisorName}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pub-teal text-white">
                    {upcomingMeeting.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-pub-navy pt-2">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-pub-teal" /> Oct 27, 2026</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-pub-teal" /> 10:00 AM</span>
                </div>
                <p className="text-[11px] text-pub-muted">{upcomingMeeting.location}</p>
                <Link to="/meetings" className="btn block text-center py-2 text-xs">
                  Review Meeting Agenda & Action Items
                </Link>
              </div>
            ) : (
              <p className="text-xs text-pub-muted">No scheduled meetings.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Role: SUPERVISOR DASHBOARD
  if (currentUser.role === 'supervisor') {
    const pendingReviews = projects.flatMap(p => 
      p.milestones.filter(m => m.status === 'Under Review').map(m => ({ project: p, milestone: m }))
    );

    return (
      <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-pub-navy tracking-tight">Supervisor Academic Console</h1>
            <p className="text-xs text-pub-muted mt-1">
              Logged in as {currentUser.name} &middot; {currentUser.department}
            </p>
          </div>
          <Link to="/supervisor/review-queue" className="btn flex items-center gap-2 self-start md:self-auto text-xs">
            Open Review Queue ({pendingReviews.length})
          </Link>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-pub-muted">Active Supervised Projects</span>
            <p className="text-2xl font-black text-pub-navy mt-1">{projects.length}</p>
            <span className="text-[11px] text-pub-success font-semibold mt-2 block">All registered in 26th Batch</span>
          </div>

          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-pub-muted">Submissions Awaiting Review</span>
            <p className="text-2xl font-black text-pub-warning mt-1">{pendingReviews.length}</p>
            <span className="text-[11px] text-pub-muted mt-2 block">Action required in Review Queue</span>
          </div>

          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-pub-muted">Active Milestone Risks</span>
            <p className="text-2xl font-black text-pub-error mt-1">{risks.length}</p>
            <span className="text-[11px] text-pub-muted mt-2 block">Calculated by Insight Engine</span>
          </div>

          <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-pub-muted">Upcoming Consultations</span>
            <p className="text-2xl font-black text-pub-teal mt-1">1 Scheduled</p>
            <span className="text-[11px] text-pub-muted mt-2 block">Room 402, Academic Bldg 1</span>
          </div>
        </div>

        {/* Priority Review Queue Preview */}
        <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-pub-border">
            <div>
              <h3 className="font-extrabold text-sm text-pub-navy">Priority Review Queue</h3>
              <p className="text-xs text-pub-muted">Milestone artifacts submitted by your students awaiting rubric evaluation.</p>
            </div>
            <Link to="/supervisor/review-queue" className="text-xs font-bold text-pub-teal hover:underline">
              View All ({pendingReviews.length})
            </Link>
          </div>

          <div className="divide-y divide-pub-border/60">
            {pendingReviews.map(({ project, milestone }) => (
              <div key={milestone.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-pub-warning/15 text-pub-warning">
                      Awaiting Evaluation
                    </span>
                    <span className="text-xs text-pub-muted">{project.department}</span>
                  </div>
                  <h4 className="text-sm font-bold text-pub-navy mt-1">{milestone.title}</h4>
                  <p className="text-xs text-pub-muted">Project: <strong>{project.title}</strong></p>
                  <p className="text-[11px] text-pub-muted mt-0.5">Submitted by {milestone.assignedTo}</p>
                </div>
                <Link to="/supervisor/review-queue" className="btn self-start md:self-auto text-xs py-2">
                  Evaluate Submission &amp; Grade Rubric
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Role: ADMIN DASHBOARD
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-pub-navy tracking-tight">Institutional Research Command Center</h1>
          <p className="text-xs text-pub-muted mt-1">
            Pundra University of Science &amp; Technology &middot; Academic Year 2026-2027
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-pub-muted">Total Thesis Projects</span>
          <p className="text-2xl font-black text-pub-navy mt-1">{projects.length}</p>
          <span className="text-[11px] text-pub-teal font-semibold mt-2 block">100% active supervision</span>
        </div>
        <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-pub-muted">Departmental Coverage</span>
          <p className="text-2xl font-black text-pub-teal mt-1">11 Departments</p>
          <span className="text-[11px] text-pub-muted mt-2 block">CSE, EEE, CE, BBA, Law, etc.</span>
        </div>
        <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-pub-muted">Compliance &amp; RLS Status</span>
          <p className="text-2xl font-black text-pub-success mt-1">Active (Strict)</p>
          <span className="text-[11px] text-pub-muted mt-2 block">Row Level Security Verified</span>
        </div>
        <div className="bg-white border border-pub-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-pub-muted">Institutional Risk Flags</span>
          <p className="text-2xl font-black text-pub-error mt-1">{risks.length}</p>
          <span className="text-[11px] text-pub-muted mt-2 block">Rule-based SuperVise Insights</span>
        </div>
      </div>

      {/* University Projects Registry */}
      <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-pub-navy">University Project &amp; Supervisor Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pub-border text-pub-muted uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Supervisor</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Target Defense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pub-border">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-pub-bg/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-pub-navy max-w-xs truncate">{p.title}</td>
                  <td className="py-3.5 px-4 text-pub-muted">{p.department}</td>
                  <td className="py-3.5 px-4 font-semibold text-pub-teal">{p.supervisor.name}</td>
                  <td className="py-3.5 px-4 font-bold">{p.progress}%</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-pub-cyanSurface text-pub-teal font-bold text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-pub-muted">{p.targetDefenseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
