export enum RoleType {
  Player = 0,
  Club = 1,
  Admin = 2
}

export enum StatusType {
  Pending = 0,
  Accepted = 1,
  Rejected = 2
}

export enum PreferredFootType {
  Right = 0,
  Left = 1
}

// Same numbers as the backend's PositionType (the first four kept their original values)
export enum PositionType {
  Goalkeeper = 0,
  CenterBack = 1,
  CentralMidfielder = 2,
  Striker = 3,
  RightBack = 4,
  LeftBack = 5,
  DefensiveMidfielder = 6,
  AttackingMidfielder = 7,
  RightWinger = 8,
  LeftWinger = 9
}

// Positions grouped by line, in team-sheet order (group keys are translated in playerExtras.groups)
export const POSITION_GROUPS: { key: string; positions: PositionType[] }[] = [
  { key: 'goalkeeper', positions: [PositionType.Goalkeeper] },
  { key: 'defence', positions: [PositionType.RightBack, PositionType.CenterBack, PositionType.LeftBack] },
  { key: 'midfield', positions: [PositionType.DefensiveMidfielder, PositionType.CentralMidfielder, PositionType.AttackingMidfielder] },
  { key: 'attack', positions: [PositionType.RightWinger, PositionType.LeftWinger, PositionType.Striker] },
];

export const MAX_POSITIONS = 4;

export enum AvailabilityStatus {
  LookingForClub = 0,
  OpenToOffers = 1,
  NotAvailable = 2
}

export interface CareerEntry {
  clubName: string;
  fromYear?: number | null;
  toYear?: number | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
  acceptTerms: boolean;
  firstName?: string;
  lastName?: string;
  age?: number;
  description?: string;
  city?: string;
  county?: string;
  prefeeredFootType?: PreferredFootType;
  name?: string;
  leagueId?: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  token: string;
  role: RoleType;
  userId: string;
  isApproved?: boolean;
  // Set after registration; the user must confirm their email before getting a token
  requiresEmailConfirmation?: boolean;
}

export interface PlayerProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  county: string;
  description: string;
  prefeeredFootType: PreferredFootType;
  // First one is the main position
  positions: PositionType[];
  availability: AvailabilityStatus;
  career: CareerEntry[];
  photoUrl?: string | null;
}

export interface UpdatePlayerProfileDto {
  firstName: string;
  lastName: string;
  age: number;
  description: string;
  prefeeredFootType: PreferredFootType;
  city: string;
  county: string;
  positions: PositionType[];
  availability: AvailabilityStatus;
  career: CareerEntry[];
}

export interface ClubProfileDto {
  id: string;
  name: string;
  description: string;
  city: string;
  county: string;
  leagueName: string;
  leagueId: string;
  phone?: string | null;
  photoUrl?: string | null;
}

export interface UpdateClubProfileDto {
  name: string;
  description: string;
  city: string;
  county: string;
  leagueId: string;
  phone?: string | null;
}

export interface JobAdDto {
  id: string;
  title: string;
  description: string;
  clubId: string;
  clubName: string;
  clubPhotoUrl?: string | null;
  leagueName: string;
  requiredPosition: string;
  requiredPositionName: string;
  applicationStatus: StatusType;
  createdAt: string;
}

export interface CreateJobAdDto {
  title: string;
  description: string;
  requiredPosition: number;
}

export interface CreateApplicationDto {
  jobAdId: string;
  coverLetter?: string;
}

export interface JobApplication {
  id: string;
  jobAdId: string;
  playerId: string;
  player: PlayerProfileDto;
  coverLetter?: string;
  status: StatusType;
  appliedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  senderName?: string;
}

// Latest message of each conversation, as returned by GET /Message/inbox
export interface InboxItem extends Message {
  otherUserId: string;
  otherUserName: string;
  otherUserPhotoUrl?: string | null;
  unreadCount: number;
}

export interface CreateMessageDto {
  receiverId: string;
  content: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminDashboardDto {
  playerCount: number;
  clubCount: number;
  jobAdCount: number;
  pendingClubCount: number;
}

export interface PendingClubDto {
  id: string;
  name: string;
  email: string;
  city: string;
  leagueName: string;
}

export interface AdminUserDto {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface AdminJobAdDto {
  id: string;
  title: string;
  clubName: string;
  createdAt: string;
  adStatus: string;
}
