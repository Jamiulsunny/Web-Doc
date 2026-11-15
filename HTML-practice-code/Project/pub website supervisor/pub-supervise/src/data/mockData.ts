import { UserProfile, Project, Meeting, ActivityLog, NotificationItem, InsightRisk } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-student-1',
    name: 'Md. Jamiul Islam Sunny',
    email: 'jamiul.sunny@pundrauniversity.edu.bd',
    role: 'student',
    studentId: '03225105101002',
    department: 'Computer Science & Engineering',
    batch: '26th Batch',
    phone: '+880 1712 345678',
    // স্টুডেন্টের ছবি:
    avatarUrl: 'https://cdn.imgpile.com/f/ngVbDLy_wm.png' 
  },
  {
    id: 'user-supervisor-1',
    name: 'Prof. Dr. Md. Rafiqul Ahsan',
    email: 'rafiqul.ahsan@pundrauniversity.edu.bd',
    role: 'supervisor',
    designation: 'Professor & Head',
    department: 'Computer Science & Engineering',
    phone: '+880 1713 377033',
    // সুপারভাইজারের জন্য তোমার পছন্দের আলাদা ছবির লিঙ্ক:
    avatarUrl: 'https://cdn.imgpile.com/f/iFQxHFD_wm.webp' 
  },
  {
    id: 'user-admin-1',
    name: 'Academic Affairs Admin',
    email: 'admin.supervise@pundrauniversity.edu.bd',
    role: 'admin',
    designation: 'Director, Academic Research & IQAC',
    department: 'Academic Affairs Division',
    phone: '+880 1713 377037',
    // অ্যাডমিনের ছবি:
    avatarUrl: 'https://cdn.imgpile.com/f/FgZio8T_wm.webp' 
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-101',
    title: 'PUB SuperVise: AI-Driven Academic Thesis & Project Supervision Ecosystem',
    abstract: 'An integrated SaaS workspace designed for Pundra University of Science & Technology that consolidates proposal evaluation, progressive milestone tracking, version-aware artifact submissions, rubrics-based supervisor feedback, and automated deadline risk analytics.',
    domain: 'Software Engineering & Academic Informatics',
    department: 'Computer Science & Engineering',
    batch: '26th Batch',
    status: 'In Progress',
    progress: 68,
    createdAt: '2026-07-15',
    targetDefenseDate: '2026-12-10',
    repositoryUrl: 'https://github.com/pundra-university/pub-supervise-core',
    datasetUrl: 'https://data.pundrauniversity.edu.bd/academic-dataset-2026',
    students: [
      {
        id: 'user-student-1',
        name: 'Md. Jamiul Islam Sunny',
        studentId: '03225105101002',
        roleInTeam: 'Lead System Architect & Frontend Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'user-student-2',
        name: 'Sadia Tasnim',
        studentId: '03225105101008',
        roleInTeam: 'Database & Security Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      }
    ],
    supervisor: {
      id: 'user-supervisor-1',
      name: 'Prof. Dr. Md. Rafiqul Ahsan',
      designation: 'Professor & Head',
      email: 'rafiqul.ahsan@pundrauniversity.edu.bd',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    milestones: [
      {
        id: 'm-1',
        projectId: 'proj-101',
        title: 'Research Proposal & Feasibility',
        description: 'Comprehensive research proposal defining problem statement, research gap, objectives, scope, methodology, and technical architecture.',
        order: 1,
        dueDate: '2026-08-05',
        status: 'Approved',
        submissionRequirements: 'PDF Research Proposal (Max 15 pages) + Presentation Deck',
        assignedTo: 'Md. Jamiul Islam Sunny',
        approvedAt: '2026-08-07T14:30:00Z',
        versions: [
          {
            id: 'v-101-1',
            versionNumber: 1,
            fileName: 'PUB_SuperVise_Proposal_v1.0.pdf',
            fileSize: '2.4 MB',
            fileUrl: '#',
            submittedAt: '2026-08-04T10:15:00Z',
            submittedBy: 'Md. Jamiul Islam Sunny',
            studentNote: 'Initial proposal submission addressing northern region academic management bottlenecks.',
            feedback: {
              id: 'fb-1',
              reviewerId: 'user-supervisor-1',
              reviewerName: 'Prof. Dr. Md. Rafiqul Ahsan',
              decision: 'Approved',
              rubricScores: {
                methodology: 9.0,
                implementation: 8.5,
                documentation: 9.5,
                presentation: 9.0
              },
              comments: 'Exceptional proposal. The problem statement directly aligns with institutional digitization goals. Proceed immediately with Literature Review.',
              reviewedAt: '2026-08-07T14:30:00Z'
            }
          }
        ]
      },
      {
        id: 'm-2',
        projectId: 'proj-101',
        title: 'Literature Review & Gap Analysis',
        description: 'Critical analysis of 25+ recent peer-reviewed articles on automated research workflow tools, student-supervisor collaborative dynamics, and academic LMS systems.',
        order: 2,
        dueDate: '2026-09-01',
        status: 'Approved',
        submissionRequirements: 'Literature Review Matrix table + Comparative Analysis Chapter (DOCX/PDF)',
        assignedTo: 'Md. Jamiul Islam Sunny',
        approvedAt: '2026-09-03T16:00:00Z',
        versions: [
          {
            id: 'v-101-2',
            versionNumber: 1,
            fileName: 'PUB_Literature_Review_v1.0.pdf',
            fileSize: '4.8 MB',
            fileUrl: '#',
            submittedAt: '2026-08-31T20:00:00Z',
            submittedBy: 'Md. Jamiul Islam Sunny',
            studentNote: 'Compiled 30 indexed papers focusing on IEEE & ACM publication management benchmarks.',
            feedback: {
              id: 'fb-2',
              reviewerId: 'user-supervisor-1',
              reviewerName: 'Prof. Dr. Md. Rafiqul Ahsan',
              decision: 'Approved',
              rubricScores: {
                methodology: 8.5,
                implementation: 9.0,
                documentation: 8.8,
                presentation: 8.5
              },
              comments: 'Good comparative depth. Added citations are valid and contemporary.',
              reviewedAt: '2026-09-03T16:00:00Z'
            }
          }
        ]
      },
      {
        id: 'm-3',
        projectId: 'proj-101',
        title: 'System Architecture & Database Design',
        description: 'Complete Relational PostgreSQL schema, Row Level Security policies, storage bucket rules, API specifications, and high-fidelity UX wireframes.',
        order: 3,
        dueDate: '2026-09-25',
        status: 'Approved',
        submissionRequirements: 'Software Requirements Specification (SRS) + Schema ERD + Figma Mockups',
        assignedTo: 'Md. Jamiul Islam Sunny',
        approvedAt: '2026-09-28T11:00:00Z',
        versions: [
          {
            id: 'v-101-3a',
            versionNumber: 1,
            fileName: 'PUB_SRS_Schema_Draft_v1.pdf',
            fileSize: '3.6 MB',
            fileUrl: '#',
            submittedAt: '2026-09-22T14:00:00Z',
            submittedBy: 'Md. Jamiul Islam Sunny',
            studentNote: 'Draft schema included with 12 relational tables and preliminary RLS.',
            feedback: {
              id: 'fb-3a',
              reviewerId: 'user-supervisor-1',
              reviewerName: 'Prof. Dr. Md. Rafiqul Ahsan',
              decision: 'Revision Required',
              rubricScores: {
                methodology: 7.0,
                implementation: 6.5,
                documentation: 7.0,
                presentation: 7.5
              },
              comments: 'Need clearer separation of multi-version submission records and explicit audit trails. Please revise storage policies.',
              reviewedAt: '2026-09-24T09:30:00Z'
            }
          },
          {
            id: 'v-101-3b',
            versionNumber: 2,
            fileName: 'PUB_SRS_Schema_Final_Revised_v2.pdf',
            fileSize: '5.1 MB',
            fileUrl: '#',
            submittedAt: '2026-09-27T18:45:00Z',
            submittedBy: 'Md. Jamiul Islam Sunny',
            studentNote: 'Addressed all revision points: Added submission_versions table, versioning constraints, and tested storage RLS.',
            feedback: {
              id: 'fb-3b',
              reviewerId: 'user-supervisor-1',
              reviewerName: 'Prof. Dr. Md. Rafiqul Ahsan',
              decision: 'Approved',
              rubricScores: {
                methodology: 9.2,
                implementation: 9.5,
                documentation: 9.0,
                presentation: 9.0
              },
              comments: 'Revisions are comprehensive and address all previous security gaps. Excellent database architecture. Approved.',
              reviewedAt: '2026-09-28T11:00:00Z'
            }
          }
        ]
      },
      {
        id: 'm-4',
        projectId: 'proj-101',
        title: 'Core Implementation & Workspace Engine',
        description: 'Vite React TypeScript frontend, dynamic role-based shells, multi-version file upload engine, supervisor review queue, and meeting scheduling subsystem.',
        order: 4,
        dueDate: '2026-10-20',
        status: 'Under Review',
        submissionRequirements: 'Live Application Preview link + Source Code ZIP + Progress Report',
        assignedTo: 'Md. Jamiul Islam Sunny',
        versions: [
          {
            id: 'v-101-4',
            versionNumber: 1,
            fileName: 'PUB_SuperVise_Core_Build_v1.zip',
            fileSize: '14.2 MB',
            fileUrl: '#',
            submittedAt: '2026-10-19T22:10:00Z',
            submittedBy: 'Md. Jamiul Islam Sunny',
            studentNote: 'Completed all core user journeys (Student, Supervisor, Admin). Ready for supervisor assessment and rubric grading.',
            feedback: undefined
          }
        ]
      },
      {
        id: 'm-5',
        projectId: 'proj-101',
        title: 'Testing, Quality Assurance & Security Audit',
        description: 'Unit testing, end-to-end user journey validation, Cross-Site Scripting (XSS) prevention, storage leak tests, and multi-device responsive evaluations.',
        order: 5,
        dueDate: '2026-11-08',
        status: 'In Progress',
        submissionRequirements: 'QA Test Report + Performance & Security Audit Summary',
        assignedTo: 'Md. Jamiul Islam Sunny',
        versions: []
      },
      {
        id: 'm-6',
        projectId: 'proj-101',
        title: 'Final Dissertation & Defense Presentation',
        description: 'Official final dissertation bound in IEEE standard format, complete user manual, and presentation slide deck for the academic examination defense board.',
        order: 6,
        dueDate: '2026-11-28',
        status: 'Not Started',
        submissionRequirements: 'Final Thesis PDF + Signed Approval Form + Defense Slides',
        assignedTo: 'Md. Jamiul Islam Sunny',
        versions: []
      }
    ],
    tasks: [
      { id: 't-1', projectId: 'proj-101', milestoneId: 'm-4', title: 'Connect Supabase Auth and token refresh interceptors', completed: true, assignedTo: 'Md. Jamiul Islam Sunny', dueDate: '2026-10-12' },
      { id: 't-2', projectId: 'proj-101', milestoneId: 'm-4', title: 'Implement Review Queue with rubric score calculation', completed: true, assignedTo: 'Md. Jamiul Islam Sunny', dueDate: '2026-10-15' },
      { id: 't-3', projectId: 'proj-101', milestoneId: 'm-4', title: 'Build SuperVise Insight rule-based risk detection engine', completed: true, assignedTo: 'Md. Jamiul Islam Sunny', dueDate: '2026-10-18' },
      { id: 't-4', projectId: 'proj-101', milestoneId: 'm-5', title: 'Run mobile viewport tests (390px, 768px, 1024px, 1440px)', completed: false, assignedTo: 'Md. Jamiul Islam Sunny', dueDate: '2026-10-28' },
      { id: 't-5', projectId: 'proj-101', milestoneId: 'm-5', title: 'Verify RLS multi-tenant boundary isolation between projects', completed: false, assignedTo: 'Sadia Tasnim', dueDate: '2026-11-02' }
    ]
  },
  {
    id: 'proj-102',
    title: 'Autonomous Smart Grid Load Balancing for North Bengal Renewable Hubs',
    abstract: 'An Internet of Things (IoT) integrated machine learning system for predicting renewable solar microgrid surges and automated load shedding distribution in the Bogura-Rajshahi economic belt.',
    domain: 'Embedded Systems & Smart Power Distribution',
    department: 'Electrical & Electronic Engineering',
    batch: '25th Batch',
    status: 'Revision Required',
    progress: 42,
    createdAt: '2026-06-10',
    targetDefenseDate: '2026-11-20',
    students: [
      {
        id: 'user-student-3',
        name: 'Md. Shakil Mostofa',
        studentId: '03224104101015',
        roleInTeam: 'Hardware & Sensor Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      }
    ],
    supervisor: {
      id: 'user-supervisor-1',
      name: 'Prof. Dr. Md. Rafiqul Ahsan',
      designation: 'Professor & Head',
      email: 'rafiqul.ahsan@pundrauniversity.edu.bd'
    },
    milestones: [
      {
        id: 'm-201',
        projectId: 'proj-102',
        title: 'Simulation Model & Hardware Benchmark',
        description: 'Simulink electrical model and real hardware prototype data logger tests.',
        order: 1,
        dueDate: '2026-10-14',
        status: 'Revision Required',
        submissionRequirements: 'Simulation Data CSV + Hardware Validation Video & Report',
        assignedTo: 'Md. Shakil Mostofa',
        versions: [
          {
            id: 'v-201-1',
            versionNumber: 1,
            fileName: 'SmartGrid_Hardware_Sim_Draft.pdf',
            fileSize: '8.4 MB',
            fileUrl: '#',
            submittedAt: '2026-10-13T11:00:00Z',
            submittedBy: 'Md. Shakil Mostofa',
            studentNote: 'Preliminary sensor logs from solar testbed.',
            feedback: {
              id: 'fb-201',
              reviewerId: 'user-supervisor-1',
              reviewerName: 'Prof. Dr. Md. Rafiqul Ahsan',
              decision: 'Revision Required',
              rubricScores: {
                methodology: 6.5,
                implementation: 5.5,
                documentation: 6.0,
                presentation: 7.0
              },
              comments: 'Inverter surge safety threshold calculations are missing. Overdue revision required before testing with physical batteries.',
              reviewedAt: '2026-10-16T15:00:00Z'
            }
          }
        ]
      }
    ],
    tasks: []
  },
  {
    id: 'proj-103',
    title: 'Eco-Friendly Geopolymer Concrete Utilizing Industrial Waste Slag',
    abstract: 'Investigating compressive strength and carbon mitigation potential of geopolymer cement composites synthesized from fly ash and steel slag in northern regional infrastructure.',
    domain: 'Sustainable Materials & Structural Engineering',
    department: 'Civil Engineering',
    batch: '26th Batch',
    status: 'In Progress',
    progress: 55,
    createdAt: '2026-07-01',
    targetDefenseDate: '2026-12-15',
    students: [
      {
        id: 'user-student-4',
        name: 'Ms. Afsana Mimi',
        studentId: '03225103101004',
        roleInTeam: 'Material Testing Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ],
    supervisor: {
      id: 'user-supervisor-2',
      name: 'Mahbub Hassan Khan',
      designation: 'Asst. Professor & Head',
      email: 'mahbub.khan@pundrauniversity.edu.bd'
    },
    milestones: [],
    tasks: []
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    projectId: 'proj-101',
    projectTitle: 'PUB SuperVise: AI-Driven Academic Thesis & Project Supervision Ecosystem',
    supervisorName: 'Prof. Dr. Md. Rafiqul Ahsan',
    studentNames: ['Md. Jamiul Islam Sunny', 'Sadia Tasnim'],
    dateTime: '2026-10-27T10:00:00Z',
    agenda: 'Bi-Weekly Sprint Review: Reviewing Milestone 4 Core Engine implementation, SuperVise Insight risk scoring, and preparation for defense mockups.',
    status: 'Scheduled',
    location: 'Faculty Office, Room 402, Academic Building 1',
    meetingLink: 'https://meet.google.com/pub-supr-xyz',
    decisions: 'Previous action item to integrate live student counters was approved.',
    actionItems: [
      { id: 'act-1', task: 'Finalize rubric evaluation UI in review queue', assignedTo: 'Md. Jamiul Islam Sunny', dueDate: '2026-10-26', completed: true },
      { id: 'act-2', task: 'Prepare comparative performance chart against Moodle LMS', assignedTo: 'Sadia Tasnim', dueDate: '2026-10-27', completed: false }
    ]
  },
  {
    id: 'meet-2',
    projectId: 'proj-101',
    projectTitle: 'PUB SuperVise: AI-Driven Academic Thesis & Project Supervision Ecosystem',
    supervisorName: 'Prof. Dr. Md. Rafiqul Ahsan',
    studentNames: ['Md. Jamiul Islam Sunny'],
    dateTime: '2026-10-06T11:30:00Z',
    agenda: 'Milestone 3 Architecture Review & RLS Security Sign-off.',
    status: 'Completed',
    location: 'Department Conference Room',
    decisions: 'Architecture verified. Proceeded with Milestone 4 UI/UX implementation.',
    actionItems: [
      { id: 'act-3', task: 'Implement multi-version submission preservation', assignedTo: 'Md. Jamiul Islam Sunny', dueDate: '2026-10-10', completed: true }
    ]
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-101',
    projectId: 'proj-101',
    projectTitle: 'PUB SuperVise',
    actorName: 'Md. Jamiul Islam Sunny',
    actorRole: 'student',
    actionType: 'REVISED_VERSION_SUBMITTED',
    description: 'Submitted revised version 1.0 for Milestone 4 (Core Implementation & Workspace Engine).',
    timestamp: '2026-10-19T22:10:00Z'
  },
  {
    id: 'act-102',
    projectId: 'proj-101',
    projectTitle: 'PUB SuperVise',
    actorName: 'Prof. Dr. Md. Rafiqul Ahsan',
    actorRole: 'supervisor',
    actionType: 'MEETING_SCHEDULED',
    description: 'Scheduled upcoming bi-weekly supervision meeting for October 27, 2026 at 10:00 AM.',
    timestamp: '2026-10-20T09:15:00Z'
  },
  {
    id: 'act-103',
    projectId: 'proj-101',
    projectTitle: 'PUB SuperVise',
    actorName: 'Prof. Dr. Md. Rafiqul Ahsan',
    actorRole: 'supervisor',
    actionType: 'MILESTONE_APPROVED',
    description: 'Approved Milestone 3 (System Architecture & Database Design) with rubric score 9.2/10.',
    timestamp: '2026-09-28T11:00:00Z'
  },
  {
    id: 'act-104',
    projectId: 'proj-101',
    projectTitle: 'PUB SuperVise',
    actorName: 'Academic Affairs Admin',
    actorRole: 'admin',
    actionType: 'PROJECT_CREATED',
    description: 'Registered project into Department of CSE 26th Batch Thesis Registry and assigned lead supervisor.',
    timestamp: '2026-07-15T10:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Supervision Meeting Confirmed',
    message: 'Prof. Dr. Md. Rafiqul Ahsan confirmed your meeting for October 27 at 10:00 AM in Room 402.',
    type: 'meeting',
    read: false,
    createdAt: '2026-10-20T09:15:00Z',
    actionLink: '/meetings'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Milestone 4 Under Review',
    message: 'Your Core Implementation & Workspace submission has been queued for supervisor rubric evaluation.',
    type: 'review',
    read: false,
    createdAt: '2026-10-19T22:12:00Z',
    actionLink: '/workspace/proj-101'
  },
  {
    id: 'notif-3',
    userId: 'user-student-1',
    title: 'Milestone 3 Approved',
    message: 'Milestone 3: System Architecture & Database Design was officially approved with high praise.',
    type: 'review',
    read: true,
    createdAt: '2026-09-28T11:05:00Z',
    actionLink: '/workspace/proj-101'
  },
  {
    id: 'notif-4',
    userId: 'user-supervisor-1',
    title: 'New Milestone Submission Awaiting Review',
    message: 'Md. Jamiul Islam Sunny submitted Milestone 4 artifacts for project PUB SuperVise.',
    type: 'review',
    read: false,
    createdAt: '2026-10-19T22:10:00Z',
    actionLink: '/supervisor/review-queue'
  }
];
