import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, FileCheck, Users, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { switchUserRole } = useApp();

  return (
    <div className="min-h-screen bg-pub-bg text-pub-text flex flex-col">
     {/* Hero Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* এখানে তোমার লোগোর ইমেজ লিঙ্ক বসাও */}
          <img 
            src="https://cdn.imgpile.com/f/cjImrid_wm.webp" 
            alt="PUB Logo" 
            className="w-10 h-10 rounded-xl object-contain" 
          />
          <span className="font-black text-xl text-pub-navy tracking-tight">PUB Super<span className="text-pub-cyan">Vise</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" onClick={() => switchUserRole('student')} className="btn text-xs py-2">
            Launch Platform Demo
          </Link>
        </div>
      </nav>

      {/* Hero Body */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center space-y-6">
        <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full bg-pub-cyanSurface text-pub-teal border border-pub-cyan/30 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pub-cyan" /> Pundra University Academic Thesis SaaS
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-pub-navy tracking-tight leading-tight">
          Your Research Journey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pub-teal to-pub-cyan">Organized.</span>
        </h1>
        <p className="text-base text-pub-muted max-w-2xl mx-auto leading-relaxed">
          From proposal defense to final dissertation publication: plan milestones, upload version-aware artifacts, receive rubric supervisor feedback, and mitigate deadline risks in one unified academic workspace.
        </p>

        {/* Quick Launch Buttons for Hackathon Evaluators */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link to="/dashboard" onClick={() => switchUserRole('student')} className="btn text-xs px-6 py-3 shadow-lg shadow-pub-cyan/20">
            Enter as Student (Jamiul Sunny) <ArrowRight className="w-4 h-4 ml-1.5 inline" />
          </Link>
          <Link to="/dashboard" onClick={() => switchUserRole('supervisor')} className="bg-pub-teal text-white hover:bg-pub-navy font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md">
            Enter as Supervisor (Prof. Rafiqul Ahsan)
          </Link>
          <Link to="/dashboard" onClick={() => switchUserRole('admin')} className="bg-white border border-pub-border text-pub-navy hover:bg-pub-bg font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm">
            Enter as Admin (Academic Affairs)
          </Link>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm space-y-2">
          <FileCheck className="w-8 h-8 text-pub-cyan mb-2" />
          <h3 className="font-extrabold text-base text-pub-navy">Version-Preserving Submissions</h3>
          <p className="text-xs text-pub-muted leading-relaxed">Never overwrite student research. Every revision iteration is archived with student notes and reviewer rubric marks.</p>
        </div>
        <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm space-y-2">
          <ShieldCheck className="w-8 h-8 text-pub-teal mb-2" />
          <h3 className="font-extrabold text-base text-pub-navy">Institutional Row Level Security</h3>
          <p className="text-xs text-pub-muted leading-relaxed">Enforced data boundary isolation preventing students from accessing peer submissions or supervisor grade sheets.</p>
        </div>
        <div className="bg-white border border-pub-border p-6 rounded-3xl shadow-sm space-y-2">
          <Sparkles className="w-8 h-8 text-pub-accent mb-2" />
          <h3 className="font-extrabold text-base text-pub-navy">SuperVise Insight™ Engine</h3>
          <p className="text-xs text-pub-muted leading-relaxed">Rule-based risk detection automatically flagging deadline slippages and stalled review queues.</p>
        </div>
      </section>

      <footer className="mt-auto border-t border-pub-border py-6 text-center text-xs text-pub-muted">
        &copy; 2026 Pundra University of Science &amp; Technology &middot; Department of Computer Science &amp; Engineering.
      </footer>
    </div>
  );
};
