import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, CheckCircle2, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MeetingsPage: React.FC = () => {
  const { meetings, currentUser, projects, scheduleMeeting } = useApp();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [agenda, setAgenda] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('Room 402, Academic Building 1');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/pub-meet-demo');

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const activeProject = projects[0];
    scheduleMeeting({
      projectId: activeProject.id,
      projectTitle: activeProject.title,
      supervisorName: activeProject.supervisor.name,
      studentNames: activeProject.students.map(s => s.name),
      dateTime: dateTime || '2026-10-30T10:00:00Z',
      agenda,
      location,
      meetingLink,
      actionItems: []
    });
    setAgenda('');
    setShowScheduleModal(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-pub-navy tracking-tight">Supervision Consultations & Meetings</h1>
          <p className="text-xs text-pub-muted mt-1">Official meeting agendas, scheduled sessions, and action decisions.</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)} className="btn flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" /> Request / Schedule Consultation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meetings.map(m => (
          <div key={m.id} className="bg-white border border-pub-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  m.status === 'Completed' ? 'bg-pub-success/10 text-pub-success' : 'bg-pub-cyanSurface text-pub-teal'
                }`}>
                  {m.status}
                </span>
                <h3 className="text-sm font-bold text-pub-navy mt-2">{m.agenda}</h3>
                <p className="text-xs text-pub-muted mt-0.5">Project: {m.projectTitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-pub-navy pt-2 border-t border-pub-border/60">
              <span className="flex items-center gap-1.5 font-bold"><Calendar className="w-4 h-4 text-pub-teal" /> {new Date(m.dateTime).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5 font-bold"><Clock className="w-4 h-4 text-pub-teal" /> {new Date(m.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {m.location && <span className="flex items-center gap-1.5 text-pub-muted"><MapPin className="w-4 h-4" /> {m.location}</span>}
            </div>

            {m.meetingLink && (
              <a href={m.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-pub-teal font-bold hover:underline">
                <Video className="w-4 h-4" /> Open Video Conference Room
              </a>
            )}

            {m.actionItems && m.actionItems.length > 0 && (
              <div className="bg-pub-bg p-3.5 rounded-2xl border border-pub-border space-y-2">
                <span className="text-[11px] font-bold text-pub-navy block">Assigned Action Items:</span>
                {m.actionItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${item.completed ? 'text-pub-success' : 'text-pub-muted'}`} />
                    <span className={item.completed ? 'line-through text-pub-muted' : 'text-pub-text'}>{item.task} ({item.assignedTo})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pub-navy/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pub-border">
            <h3 className="text-lg font-black text-pub-navy mb-4">Request Supervision Meeting</h3>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-pub-navy mb-1">Meeting Agenda</label>
                <input required type="text" value={agenda} onChange={e => setAgenda(e.target.value)} placeholder="e.g., Code Review & Methodology Evaluation" className="w-full text-xs p-3 bg-pub-bg border border-pub-border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-pub-navy mb-1">Date & Time</label>
                <input required type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="w-full text-xs p-3 bg-pub-bg border border-pub-border rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 text-xs text-pub-muted">Cancel</button>
                <button type="submit" className="btn text-xs py-2">Schedule Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
