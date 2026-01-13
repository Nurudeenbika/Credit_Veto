// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "user" | "admin";
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  refreshToken: string;
}

// Credit Profile Types
export interface CreditProfile {
  id: string;
  userId: string;
  creditScore: number;
  reportDate: string;
  provider: string;
  accounts: CreditAccount[];
  inquiries: CreditInquiry[];
  publicRecords: PublicRecord[];
  personalInfo: PersonalInfo;
}

export interface CreditAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  accountType:
    | "credit_card"
    | "mortgage"
    | "auto_loan"
    | "student_loan"
    | "personal_loan";
  status: "open" | "closed" | "charge_off" | "collection";
  balance: number;
  creditLimit?: number;
  paymentHistory: string;
  openDate: string;
  lastActivity: string;
}

export interface CreditInquiry {
  id: string;
  creditorName: string;
  inquiryDate: string;
  inquiryType: "hard" | "soft";
}

export interface PublicRecord {
  id: string;
  recordType: "bankruptcy" | "tax_lien" | "judgment";
  amount: number;
  filingDate: string;
  status: "active" | "satisfied" | "dismissed";
}

export interface PersonalInfo {
  fullName: string;
  addresses: Address[];
  phoneNumbers: string[];
  socialSecurityNumber: string; // Masked
  dateOfBirth: string;
  employers: Employer[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  type: "current" | "previous";
}

export interface Employer {
  name: string;
  position: string;
  dateEmployed: string;
}

// Dispute Types
export interface Dispute {
  id: string;
  userId: string;
  itemType: "account" | "inquiry" | "public_record" | "personal_info";
  itemId: string;
  reason: string;
  description: string;
  status: "pending" | "submitted" | "under_review" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  supportingDocuments?: string[];
}

export interface CreateDisputeRequest {
  itemType: "account" | "inquiry" | "public_record" | "personal_info";
  itemId: string;
  reason: string;
  description: string;
  supportingDocuments?: string[];
}

export interface UpdateDisputeRequest {
  status: "submitted" | "under_review" | "resolved" | "rejected";
  adminNotes?: string;
}

// AI Letter Generation Types
export interface GenerateLetterRequest {
  disputeId: string;
  reason: string;
  itemDetails: string;
  customInstructions?: string;
}

export interface GenerateLetterResponse {
  letter: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface DisputeFormData {
  itemType: "account" | "inquiry" | "public_record" | "personal_info";
  itemId: string;
  reason: string;
  description: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers?: number;
  totalDisputes?: number;
  pendingDisputes?: number;
  resolvedDisputes?: number;
  creditScore?: number;
  activeDisputes?: number;
  completedDisputes?: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: "DISPUTE_STATUS_UPDATE" | "CREDIT_SCORE_UPDATE" | "NOTIFICATION";
  payload:
    | DisputeStatusUpdatePayload
    | CreditScoreUpdatePayload
    | NotificationPayload;
  timestamp: string;
}

export interface DisputeStatusUpdatePayload {
  disputeId: string;
  status: DisputeStatus;
  updatedAt: string;
}

export interface CreditScoreUpdatePayload {
  userId: string;
  creditScore: number;
  updatedAt: string;
}

export interface NotificationPayload {
  message: string;
  level?: "info" | "warning" | "error";
}

// Component Props Types
export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export interface InputProps {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface BadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "default";
  children: React.ReactNode;
  size?: "sm" | "md";
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: ("user" | "admin")[];
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Utility Types
export type UserRole = "user" | "admin";
export type DisputeStatus =
  | "pending"
  | "submitted"
  | "under_review"
  | "resolved"
  | "rejected";
export type AccountStatus = "open" | "closed" | "charge_off" | "collection";
export type InquiryType = "hard" | "soft";
