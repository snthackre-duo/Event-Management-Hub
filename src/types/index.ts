export type UserRole = 'faculty' | 'admin' | 'creative' | 'logistics' | 'leadership';

export type SchoolKey = 'SBL' | 'SOS' | 'SET-CS' | 'SET-Core' | 'SLSE' | 'SEDA' | 'NUV';

export interface SchoolConfig {
  key: SchoolKey;
  name: string;
  fullName: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  dotClass: string;
  hex: string;
}

export type LogisticsSubTeam = 
  | 'venue_housekeeping' 
  | 'catering' 
  | 'transport' 
  | 'guest_hospitality' 
  | 'security'
  | 'it_infra'
  | 'audio_visual';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: SchoolKey;
  subTeam?: LogisticsSubTeam;
  department: string;
  avatar: string;
}

export type EventType = 
  | 'academic' 
  | 'admissions' 
  | 'cultural' 
  | 'conferences' 
  | 'guest_lecture' 
  | 'convocation';

export type EventStatus = 
  | 'created' 
  | 'in_preparation' 
  | 'ready' 
  | 'completed' 
  | 'postponed' 
  | 'cancelled';

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
}

export interface GuestPhoto {
  id: string;
  url: string;
  filename: string;
  resolution: string;
  isApproved: boolean;
  uploadedBy: string;
  uploadedAt: string;
  sizeBytes: number;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  designation: string;
  organisation: string;
  shortBio: string;
  socialHandle?: string;
  consentObtained: boolean;
  consentBy: string;
  consentDate: string;
  photos: GuestPhoto[];
  ownerApprovedPhotoAndBio: boolean;
}

export type CreativeTypeKey = 
  | 'invitation'
  | 'poster'
  | 'social_post'
  | 'reel_video'
  | 'standee'
  | 'backdrop'
  | 'banner'
  | 'certificate'
  | 'id_badge'
  | 'stage_presentation'
  | 'brochure'
  | 'press_note'
  | 'email_banner'
  | 'signage';

export interface CreativeTypeSpec {
  key: CreativeTypeKey;
  label: string;
  defaultSpecs: string;
  category: 'Digital' | 'Print' | 'Stage' | 'Video';
  icon: string;
}

export type CreativeStatus = 
  | 'awaiting_acceptance' // for late requests awaiting creative lead decision
  | 'not_started' 
  | 'in_design' 
  | 'in_review' 
  | 'changes_requested' 
  | 'approved' 
  | 'delivered';

export interface FileVersion {
  id: string;
  version: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploaderId: string;
  uploaderName: string;
  uploadedAt: string;
  isFinal: boolean;
  previewUrl?: string;
}

export interface CreativeItem {
  id: string;
  eventId: string;
  typeKey: CreativeTypeKey;
  label: string;
  specs: string;
  quantity: number;
  neededByDate: string;
  status: CreativeStatus;
  assignedDesignerId?: string;
  assignedDesignerName?: string;
  revisionCount: number; // max 2 without admin approval
  revisionNotes: { round: number; note: string; requestedBy: string; requestedAt: string }[];
  versions: FileVersion[];
  
  // Late request handling (CR-9)
  isLateRequest?: boolean;
  lateDecisionReason?: string;
  lateSuggestedDate?: string;
  lateDecidedBy?: string;
  lateDecidedAt?: string;

  // Print vendor logging (CR-7)
  printVendor?: string;
  printQuantity?: number;
  printTargetDelivery?: string;
  printVendorContact?: string;
  printCostEstimate?: string;

  // Sign-off
  approvedByOwner?: boolean;
  approvedAt?: string;
  turnaroundHours?: number;
}

export interface LogisticsTask {
  id: string;
  eventId: string;
  subTeam: LogisticsSubTeam;
  title: string;
  description?: string;
  assignedToName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface EventClashNotice {
  clashingEventId: string;
  clashingEventTitle: string;
  type: 'venue' | 'team_bandwidth' | 'academic_overlay';
  message: string;
  resolved: boolean;
  resolutionNote?: string;
}

export interface ActivityLogEntry {
  id: string;
  eventId: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  category: 'event' | 'creative' | 'guest' | 'logistics' | 'clash';
}

export interface EventItem {
  id: string;
  title: string;
  type: EventType;
  school: SchoolKey;
  objective: string;
  department: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  startTime: string; // HH:mm
  endTime: string;
  venueId: string;
  venueName: string;
  audienceSize: number;
  expectedAudienceDesc: string;
  status: EventStatus;
  createdAt: string;
  isLate: boolean; // Created < 7 days before event date
  isTemplate?: boolean;
  isInternalOnly?: boolean;
  guestDetailsSkipped?: boolean;
  clashes: EventClashNotice[];
  creatives: CreativeItem[];
  guests: Guest[];
  logisticsTasks: LogisticsTask[];
  activityLog: ActivityLogEntry[];
}

export type OverlayPriority = 'High' | 'Medium' | 'Low';

export interface OverlayTypeConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  badgeClass: string;
  dotClass: string;
  isSystem?: boolean;
}

export interface AcademicOverlayEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  priority: OverlayPriority;
  description: string;
}

export interface UploadRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  eventId: string;
  eventTitle: string;
  category: 'guest_photo' | 'creative_draft' | 'creative_final' | 'print_spec';
  fileName: string;
  fileType: string;
  fileSize: string;
  fileSizeRaw: number;
  uploadedAt: string;
  url: string;
  isFinal: boolean;
  version: number;
  creativeId?: string;
  guestId?: string;
}

export interface DownloadLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  eventId: string;
  eventTitle: string;
  fileName: string;
  format: string;
  downloadedAt: string;
}

export interface MediaShareLink {
  id: string;
  token: string;
  eventId: string;
  eventTitle: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  accessibleFilesCount: number;
  downloadsCount: number;
  recipientLabel: string;
  isRevoked: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'clash' | 'late_request' | 'approval_needed' | 'risk_5day' | 'creative_update' | 'task_overdue';
  eventId?: string;
  read: boolean;
  actionUrl?: string;
}

export interface SystemSettings {
  leadTimeDays: number;
  maxRevisionRounds: number;
  emailNotificationsEnabled: boolean;
  marketingContactEmail: string;
  departmentName: string;
  riskWindowDays: number;
  autoClashDetection: boolean;
}
