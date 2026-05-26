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

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: RoleType;
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

export interface AuthResponseDto {
  token: string;
  role: RoleType;
  userId: string;
  isApproved?: boolean;
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
}

export interface UpdatePlayerProfileDto {
  firstName: string;
  lastName: string;
  age: number;
  description: string;
  prefeeredFootType: PreferredFootType;
  city: string;
  county: string;
}

export interface ClubProfileDto {
  id: string;
  name: string;
  description: string;
  city: string;
  county: string;
  leagueName: string;
  leagueId: string;
}

export interface UpdateClubProfileDto {
  name: string;
  description: string;
  city: string;
  county: string;
  leagueId: string;
}

export interface JobAdDto {
  id: string;
  title: string;
  description: string;
  clubName: string;
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
