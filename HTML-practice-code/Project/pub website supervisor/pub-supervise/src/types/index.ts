export type UserRole = 'student' | 'supervisor' | 'admin';

export type MilestoneStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Revision Required'
  | 'Approved'
  | 'Overdue'
  | 'Completed';

export type ProjectStatus = 
  | 'Proposal Pending'
  | 'In Progress'
  | 'Under Review'
  | 'Revision Required'
  | 'Ready for Defense'
  | 'Completed'
  | 'On Hold';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  studentId?: string;
  designation?: string;
  batch?: string;
  phone?: string;
}

export interface SubmissionVersion {
  id: string;
  versionNumber: number;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  submittedAt: string;
  submittedBy: string;
  studentNote: string;
  feedback?: {
    id: string;
    reviewerId: string;
    reviewerName: string;
    decision: 'Approved' | 'Revision Required';
    rubricScores?: {
      methodology: number;
      implementation: number;
      documentation: number;
      presentation: number;
    };
    comments: string;
    reviewedAt: string;
  };
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  dueDate: string;
  status: MilestoneStatus;
  submissionRequirements: string;
  assignedTo: string;
  approvedAt?: string;
  versions: SubmissionVersion[];
}

export interface Task {
  id: string;
  projectId: string;
  milestoneId: string;
  title: string;
  completed: boolean;
  assignedTo: string;
  dueDate: string;
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  department: string;
  batch: string;
  status: ProjectStatus;
  progress: number;
  createdAt: string;
  targetDefenseDate: string;
  students: {
    id: string;
    name: string;
    studentId: string;
    avatarUrl?: string;
    roleInTeam: string;
  }[];
  supervisor: {
    id: string;
    name: string;
    designation: string;
    avatarUrl?: string;
    email: string;
  };
  milestones: Milestone[];
  tasks: Task[];
  repositoryUrl?: string;
  datasetUrl?: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  projectTitle: string;
  supervisorName: string;
  studentNames: string[];
  dateTime: string;
  agenda: string;
  status: 'Requested' | 'Scheduled' | 'Completed' | 'Declined';
  meetingLink?: string;
  location?: string;
  decisions?: string;
  actionItems?: {
    id: string;
    task: string;
    assignedTo: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface ActivityLog {
  id: string;
  projectId: string;
  projectTitle: string;
  actorName: string;
  actorRole: UserRole;
  actionType: 
    | 'PROJECT_CREATED'
    | 'PROPOSAL_SUBMITTED'
    | 'REVIEW_STARTED'
    | 'REVISION_REQUESTED'
    | 'REVISED_VERSION_SUBMITTED'
    | 'MILESTONE_APPROVED'
    | 'MEETING_SCHEDULED'
    | 'MEETING_COMPLETED'
    | 'FINAL_REPORT_SUBMITTED'
    | 'PROJECT_COMPLETED';
  description: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'review' | 'deadline' | 'meeting' | 'system' | 'revision';
  read: boolean;
  createdAt: string;
  actionLink?: string;
}

export interface InsightRisk {
  id: string;
  projectId: string;
  projectTitle: string;
  milestoneId?: string;
  milestoneTitle?: string;
  level: RiskLevel;
  reason: string;
  elapsedOrDueDate: string;
  recommendation: string;
}
