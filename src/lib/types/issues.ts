export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type IssueStatus =
  | 'REPORTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'REOPENED'
  | 'OVERDUE'
  | 'ESCALATED';

export type PublicVisibility = 'PUBLIC' | 'PRIVATE' | 'SENSITIVE' | 'HIDDEN';

export type UserRole = 'STUDENT' | 'ADMIN' | 'STAFF' | 'DEPT_MANAGER';

export type IssueCategory =
  | 'MAINTENANCE'
  | 'CLEANING'
  | 'IT_SUPPORT'
  | 'SECURITY'
  | 'LANDSCAPING'
  | 'OTHER';

export interface IssueTimelineEvent {
  id: string;
  status: IssueStatus;
  date: string;
  description: string;
}

export interface Issue {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  publicTitle?: string;
  publicDescription?: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  gpsCoordinates?: { lat: number; lng: number };
  images: string[];
  publicImages?: string[];
  reporterId?: string;
  isPublic: boolean;
  isCampusImprovement: boolean;
  departmentAssigned?: string | null;
  assignee?: string | null;
  dateReported: string;
  lastUpdated: string;
  dueDate?: string;
  resolvedAt?: string | null;
  closedAt?: string | null;
  publicVisibility?: PublicVisibility;
  deletedAt?: string | null;
  timeline: IssueTimelineEvent[];
  adminComments?: { id: string; author: string; text: string; date: string }[];
}

export interface CampusImprovement {
  id: string;
  issueId: string;
  originalDescription: string;
  beforeImage: string;
  resolutionDescription: string;
  afterImage: string;
  department: string;
  dateResolved: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  managerId?: string | null;
  staffMembers: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
}
