import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, LayoutDashboard, FolderGit2, Calendar, 
  Bell, UserCheck, ShieldAlert, CheckCircle2, ChevronDown, 
  Menu, X, Search, FileCheck, Users, Activity, Sparkles, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AppHeader: React.FC = () => {
  const { currentUser, notifications, markAllNotificationsAsRead, switchUserRole } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pub-border px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Left Section */}
      <div className="flex items-center gap-4">
       <Link to="/" className="flex items-center gap-2.5 group">
          {/* GraduationCap icon-er poriborte ekhane tomar logo-r link boshao */}
          <img 
            src="https://cdn.imgpile.com/f/cjImrid_wm.webp" 
            alt="PUB Logo" 
            className="w-10 h-10 rounded-xl object-contain" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-pub-navy">PUB Super<span className="text-pub-cyan">Vise</span></span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pub-cyanSurface text-pub-teal border border-pub-cyan/30 uppercase tracking-wider">v1.0</span>
            </div>
            <p className="text-[11px] text-pub-muted font-medium hidden sm:block">Pundra University Academic Supervision</p>
          </div>
        </Link>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-pub-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search projects, thesis milestones, supervisors, action items..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-pub-bg border border-pub-border rounded-xl focus:outline-none focus:border-pub-cyan focus:bg-white transition-all text-pub-text placeholder:text-pub-muted"
          />
        </div>
      </div>

      {/* Right Controls: Role Switcher & Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher Banner */}
        <div className="hidden sm:flex items-center bg-pub-cyanSurface/80 border border-pub-cyan/40 p-1 rounded-xl">
          <span className="text-[11px] font-bold px-2 text-pub-teal flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pub-cyan" /> Role Demo:
          </span>
          {(['student', 'supervisor', 'admin'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => switchUserRole(role)}
              className={`text-xs px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                currentUser.role === role 
                  ? 'bg-pub-teal text-white shadow-sm' 
                  : 'text-pub-muted hover:text-pub-navy'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-pub-muted hover:text-pub-navy hover:bg-pub-bg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pub-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-pub-border p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-pub-border">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-pub-navy">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-pub-cyanSurface text-pub-teal font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-pub-cyan hover:underline font-semibold"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-pub-border/50 max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`py-3 px-1 transition-colors ${n.read ? 'opacity-70' : 'bg-pub-cyanSurface/20'}`}>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full mt-1.5 bg-pub-cyan shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-pub-navy">{n.title}</p>
                        <p className="text-[11px] text-pub-muted mt-0.5 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-pub-muted/80 mt-1 block">
                          {new Date(n.createdAt).toLocaleDateString()} &middot; {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-pub-border">
         <img 
  src={currentUser.avatarUrl} 
  alt={currentUser.name} 
  className="w-8 h-8 rounded-full object-cover ring-2 ring-pub-cyan/40"
/>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-pub-navy truncate max-w-[140px]">{currentUser.name}</p>
            <span className="text-[10px] font-semibold text-pub-teal capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pub-success" />
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export const AppSidebar: React.FC = () => {
  const { currentUser } = useApp();
  const location = useLocation();

  const getLinks = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { to: '/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
          { to: '/workspace/proj-101', label: 'My Project Workspace', icon: FolderGit2, badge: 'Active' },
          { to: '/meetings', label: 'Supervision Meetings', icon: Calendar },
          { to: '/activities', label: 'Activity Timeline', icon: Activity },
          { to: '/supervise-insight', label: 'SuperVise Insight', icon: Sparkles }
        ];
      case 'supervisor':
        return [
          { to: '/dashboard', label: 'Supervisor Desk', icon: LayoutDashboard },
          { to: '/supervisor/review-queue', label: 'Review Queue', icon: FileCheck, badge: '1 Pending' },
          { to: '/supervisor/my-students', label: 'Assigned Students', icon: Users },
          { to: '/meetings', label: 'Scheduled Consultations', icon: Calendar },
          { to: '/supervise-insight', label: 'Risk Monitor', icon: ShieldAlert }
        ];
      case 'admin':
        return [
          { to: '/dashboard', label: 'Admin Command', icon: LayoutDashboard },
          { to: '/admin/projects', label: 'All University Projects', icon: FolderGit2 },
          { to: '/admin/users', label: 'Faculty & Student Directory', icon: Users },
          { to: '/supervise-insight', label: 'Institutional Risks', icon: Sparkles },
          { to: '/activities', label: 'System Audit Logs', icon: Activity }
        ];
    }
  };

  const navLinks = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-pub-border hidden md:flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="p-4 space-y-6">
        {/* User Context Banner */}
        <div className="p-3 bg-gradient-to-br from-pub-cyanSurface to-white border border-pub-cyan/30 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase text-pub-teal tracking-wider block">Logged In Perspective</span>
          <p className="text-xs font-bold text-pub-navy truncate mt-0.5">{currentUser.name}</p>
          <p className="text-[11px] text-pub-muted">{currentUser.department}</p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-pub-teal text-white shadow-md shadow-pub-teal/20' 
                    : 'text-pub-muted hover:text-pub-navy hover:bg-pub-bg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-pub-cyan' : 'text-pub-muted'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-pub-cyanSurface text-pub-teal'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* University Branding footer in sidebar */}
      <div className="p-4 border-t border-pub-border bg-pub-bg/50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-pub-teal" />
          <span className="text-[11px] font-bold text-pub-navy">Pundra University</span>
        </div>
        <p className="text-[10px] text-pub-muted mt-0.5">Bogura, Bangladesh &middot; Spring 2026</p>
      </div>
    </aside>
  );
};
