// User types
export type UserRole = 'admin' | 'it' | 'riset' | 'writer' | 'content' | 'desain';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, would never store plain text password
  role: UserRole;
  displayName: string;
  division: string;
}

// Report types
export type ReportType = 'weekly' | 'monthly';
export type NewsCategory = 'straight' | 'breaking' | 'opini' | 'other';
export type WeekNumber = '1' | '2' | '3' | '4';

export interface Report {
  id: string;
  title: string;
  content: string;
  type: ReportType;
  weekNumber?: WeekNumber;
  category?: NewsCategory;
  createdBy: string; // User ID
  authorName: string; // User display name
  division: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

// Auth context types
export interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  getUserDivision: () => string;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  backupData: () => void;
  restoreData: (data: string) => void;
}

// Reports context types
export interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
  getUserReports: (userId: string) => Report[];
  getDivisionReports: (division: string) => Report[];
  getAllReportsForAdmin: () => Report[];
  downloadReportAsPDF: (report: Report) => void;
  downloadAllReportsAsPDF: () => void;
}