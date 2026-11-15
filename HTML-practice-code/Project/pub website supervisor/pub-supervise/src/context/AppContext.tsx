import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Project, Meeting, ActivityLog, NotificationItem, 
  UserRole, MilestoneStatus, InsightRisk 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_PROJECTS, INITIAL_MEETINGS, 
  INITIAL_ACTIVITIES, INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  projects: Project[];
  meetings: Meeting[];
  activities: ActivityLog[];
  notifications: NotificationItem[];
  risks: InsightRisk[];
  switchUserRole: (role: UserRole) => void;
  createProject: (newProjectData: Partial<Project>) => Project;
  submitMilestoneArtifact: (
    projectId: string, 
    milestoneId: string, 
    file: { name: string; size: string }, 
    note: string
  ) => void;
  reviewMilestoneSubmission: (
    projectId: string,
    milestoneId: string,
    versionId: string,
    decision: 'Approved' | 'Revision Required',
    comments: string,
    rubricScores: { methodology: number; implementation: number; documentation: number; presentation: number }
  ) => void;
  scheduleMeeting: (meetingData: Omit<Meeting, 'id' | 'status'>) => void;
  updateMeetingStatus: (meetingId: string, status: 'Scheduled' | 'Completed' | 'Declined', decisions?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleTaskCompletion: (projectId: string, taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Default to student: Md. Jamiul Islam Sunny
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pub_supervise_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('pub_supervise_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('pub_supervise_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pub_supervise_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Save to local storage for realistic persistence
  useEffect(() => {
    localStorage.setItem('pub_supervise_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pub_supervise_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('pub_supervise_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('pub_supervise_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Switch Role / Persona for instant seamless demonstration
  const switchUserRole = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role) || allUsers[0];
    setCurrentUser(targetUser);
  };

  // Rule-based SuperVise Insight Engine
  const calculateRisks = (): InsightRisk[] => {
    const detectedRisks: InsightRisk[] = [];
    const now = new Date('2026-10-24T12:00:00Z'); // Fixed baseline for consistency

    projects.forEach(project => {
      // 1. Check for Overdue Milestones
      project.milestones.forEach(m => {
        const dueDate = new Date(m.dueDate);
        const isPast = dueDate < now;
        
        if (isPast && (m.status === 'In Progress' || m.status === 'Not Started')) {
          detectedRisks.push({
            id: `risk-overdue-${m.id}`,
            projectId: project.id,
            projectTitle: project.title,
            milestoneId: m.id,
            milestoneTitle: m.title,
            level: 'High',
            reason: `Milestone deadline (${m.dueDate}) has elapsed without artifact submission.`,
            elapsedOrDueDate: m.dueDate,
            recommendation: 'Contact supervisor immediately to request a schedule realignment.'
          });
        } else if (!isPast && (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24) <= 7 && m.status === 'Not Started') {
          detectedRisks.push({
            id: `risk-upcoming-${m.id}`,
            projectId: project.id,
            projectTitle: project.title,
            milestoneId: m.id,
            milestoneTitle: m.title,
            level: 'Medium',
            reason: `Milestone is due within 7 days (${m.dueDate}) but work has not begun.`,
            elapsedOrDueDate: m.dueDate,
            recommendation: 'Initialize repository branch and upload preliminary draft.'
          });
        }

        // 2. Multiple Revisions Requested
        const revisionCount = m.versions.filter(v => v.feedback?.decision === 'Revision Required').length;
        if (revisionCount >= 2 && m.status !== 'Approved') {
          detectedRisks.push({
            id: `risk-revisions-${m.id}`,
            projectId: project.id,
            projectTitle: project.title,
            milestoneId: m.id,
            milestoneTitle: m.title,
            level: 'High',
            reason: `Multiple revision iterations (${revisionCount}) requested without approval.`,
            elapsedOrDueDate: m.dueDate,
            recommendation: 'Schedule a dedicated one-on-one consultation with lead supervisor.'
          });
        }

        // 3. Submissions Waiting for Review > 4 days
        const latestVersion = m.versions[m.versions.length - 1];
        if (latestVersion && !latestVersion.feedback && m.status === 'Under Review') {
          const submittedAt = new Date(latestVersion.submittedAt);
          const daysWaiting = Math.floor((now.getTime() - submittedAt.getTime()) / (1000 * 3600 * 24));
          if (daysWaiting >= 4) {
            detectedRisks.push({
              id: `risk-pending-review-${m.id}`,
              projectId: project.id,
              projectTitle: project.title,
              milestoneId: m.id,
              milestoneTitle: m.title,
              level: 'Medium',
              reason: `Submission has been in supervisor review queue for ${daysWaiting} days.`,
              elapsedOrDueDate: `${daysWaiting} days pending`,
              recommendation: 'Send gentle notification reminder to supervisor review queue.'
            });
          }
        }
      });
    });

    return detectedRisks;
  };

  const risks = calculateRisks();

  // Create Project
  const createProject = (newProjectData: Partial<Project>): Project => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: newProjectData.title || 'Untitled Thesis Project',
      abstract: newProjectData.abstract || 'No abstract provided.',
      domain: newProjectData.domain || 'Computer Science & Engineering',
      department: newProjectData.department || currentUser.department || 'Computer Science & Engineering',
      batch: newProjectData.batch || '26th Batch',
      status: 'Proposal Pending',
      progress: 10,
      createdAt: new Date().toISOString().split('T')[0],
      targetDefenseDate: newProjectData.targetDefenseDate || '2027-01-15',
      students: [
        {
          id: currentUser.id,
          name: currentUser.name,
          studentId: currentUser.studentId || 'PUB-26-TEMP',
          roleInTeam: 'Principal Researcher',
          avatarUrl: currentUser.avatarUrl
        }
      ],
      supervisor: newProjectData.supervisor || {
        id: 'user-supervisor-1',
        name: 'Prof. Dr. Md. Rafiqul Ahsan',
        designation: 'Professor & Head',
        email: 'rafiqul.ahsan@pundrauniversity.edu.bd'
      },
      milestones: [
        {
          id: `m-init-1`,
          projectId: `proj-${Date.now()}`,
          title: 'Research Proposal & Feasibility',
          description: 'Official research proposal submission.',
          order: 1,
          dueDate: '2026-11-15',
          status: 'In Progress',
          submissionRequirements: 'PDF Research Proposal + Presentation slides',
          assignedTo: currentUser.name,
          versions: []
        },
        {
          id: `m-init-2`,
          projectId: `proj-${Date.now()}`,
          title: 'Literature Review & Methodology',
          description: 'Survey of relevant academic publications.',
          order: 2,
          dueDate: '2026-12-05',
          status: 'Not Started',
          submissionRequirements: 'Literature matrix + methodology chapter',
          assignedTo: currentUser.name,
          versions: []
        }
      ],
      tasks: []
    };

    setProjects(prev => [newProj, ...prev]);

    // Record activity
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId: newProj.id,
      projectTitle: newProj.title,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType: 'PROJECT_CREATED',
      description: `Registered new academic project "${newProj.title}".`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);

    return newProj;
  };

  // Submit Milestone Version (Student Action)
  const submitMilestoneArtifact = (
    projectId: string, 
    milestoneId: string, 
    file: { name: string; size: string }, 
    note: string
  ) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;

      const updatedMilestones = p.milestones.map(m => {
        if (m.id !== milestoneId) return m;

        const nextVersionNum = m.versions.length + 1;
        const newVersion = {
          id: `v-${Date.now()}`,
          versionNumber: nextVersionNum,
          fileName: file.name,
          fileSize: file.size,
          fileUrl: '#',
          submittedAt: new Date().toISOString(),
          submittedBy: currentUser.name,
          studentNote: note
        };

        return {
          ...m,
          status: 'Under Review' as MilestoneStatus,
          versions: [...m.versions, newVersion]
        };
      });

      return {
        ...p,
        status: 'Under Review',
        milestones: updatedMilestones
      };
    }));

    // Log Activity
    const currentProj = projects.find(p => p.id === projectId);
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId,
      projectTitle: currentProj?.title || 'Project',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType: 'REVISED_VERSION_SUBMITTED',
      description: `Uploaded artifact submission for milestone.`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);

    // Notify Supervisor
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentProj?.supervisor.id || 'user-supervisor-1',
      title: 'New Milestone Submission',
      message: `${currentUser.name} uploaded a submission for review on ${currentProj?.title}.`,
      type: 'review',
      read: false,
      createdAt: new Date().toISOString(),
      actionLink: `/supervisor/review-queue`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Review Milestone Submission (Supervisor Action)
  const reviewMilestoneSubmission = (
    projectId: string,
    milestoneId: string,
    versionId: string,
    decision: 'Approved' | 'Revision Required',
    comments: string,
    rubricScores: { methodology: number; implementation: number; documentation: number; presentation: number }
  ) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;

      const updatedMilestones = p.milestones.map(m => {
        if (m.id !== milestoneId) return m;

        const updatedVersions = m.versions.map(v => {
          if (v.id !== versionId) return v;
          return {
            ...v,
            feedback: {
              id: `fb-${Date.now()}`,
              reviewerId: currentUser.id,
              reviewerName: currentUser.name,
              decision,
              comments,
              rubricScores,
              reviewedAt: new Date().toISOString()
            }
          };
        });

        const newStatus: MilestoneStatus = decision === 'Approved' ? 'Approved' : 'Revision Required';

        return {
          ...m,
          status: newStatus,
          approvedAt: decision === 'Approved' ? new Date().toISOString() : undefined,
          versions: updatedVersions
        };
      });

      // Recalculate Project Progress
      const approvedCount = updatedMilestones.filter(m => m.status === 'Approved').length;
      const totalCount = updatedMilestones.length || 1;
      const progress = Math.round((approvedCount / totalCount) * 100);

      return {
        ...p,
        progress,
        status: decision === 'Approved' ? (progress >= 100 ? 'Ready for Defense' : 'In Progress') : 'Revision Required',
        milestones: updatedMilestones
      };
    }));

    const currentProj = projects.find(p => p.id === projectId);
    // Log Activity
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId,
      projectTitle: currentProj?.title || 'Project',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType: decision === 'Approved' ? 'MILESTONE_APPROVED' : 'REVISION_REQUESTED',
      description: `${decision === 'Approved' ? 'Approved' : 'Requested revisions on'} milestone submission with comprehensive rubric review.`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);

    // Notify Students
    currentProj?.students.forEach(st => {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}-${st.id}`,
        userId: st.id,
        title: decision === 'Approved' ? 'Milestone Approved! 🎉' : 'Revision Requested ⚠️',
        message: `${currentUser.name} evaluated your submission: "${comments.slice(0, 70)}..."`,
        type: decision === 'Approved' ? 'review' : 'revision',
        read: false,
        createdAt: new Date().toISOString(),
        actionLink: `/workspace/${projectId}`
      };
      setNotifications(prev => [notif, ...prev]);
    });
  };

  // Schedule Meeting
  const scheduleMeeting = (meetingData: Omit<Meeting, 'id' | 'status'>) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: `meet-${Date.now()}`,
      status: 'Scheduled'
    };
    setMeetings(prev => [newMeeting, ...prev]);

    // Record activity
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId: meetingData.projectId,
      projectTitle: meetingData.projectTitle,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType: 'MEETING_SCHEDULED',
      description: `Arranged supervision consultation meeting for ${new Date(meetingData.dateTime).toLocaleDateString()}.`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const updateMeetingStatus = (meetingId: string, status: 'Scheduled' | 'Completed' | 'Declined', decisions?: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return {
        ...m,
        status,
        decisions: decisions || m.decisions
      };
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleTaskCompletion = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      };
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      allUsers,
      projects,
      meetings,
      activities,
      notifications,
      risks,
      switchUserRole,
      createProject,
      submitMilestoneArtifact,
      reviewMilestoneSubmission,
      scheduleMeeting,
      updateMeetingStatus,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      toggleTaskCompletion
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
