import { api } from './api';
import {
  AdminDashboardDto,
  PendingClubDto,
  AdminUserDto,
  AdminJobAdDto,
  PaginatedResult,
} from '@/types';

export const adminService = {
  async getDashboard(): Promise<AdminDashboardDto> {
    const response = await api.get<AdminDashboardDto>('/Admin/dashboard');
    return response.data;
  },

  async getPendingClubs(page = 1, pageSize = 10): Promise<PaginatedResult<PendingClubDto>> {
    const response = await api.get<PaginatedResult<PendingClubDto>>('/Admin/clubs/pending', {
      params: { page, pageSize },
    });
    return response.data;
  },

  async approveClub(id: string): Promise<void> {
    await api.put(`/Admin/clubs/${id}/approve`);
  },

  async rejectClub(id: string): Promise<void> {
    await api.put(`/Admin/clubs/${id}/reject`);
  },

  async getUsers(search?: string, role?: number, page = 1, pageSize = 10): Promise<PaginatedResult<AdminUserDto>> {
    const response = await api.get<PaginatedResult<AdminUserDto>>('/Admin/users', {
      params: { search, role, page, pageSize },
    });
    return response.data;
  },

  async deactivateUser(id: string): Promise<void> {
    await api.put(`/Admin/users/${id}/deactivate`);
  },

  async reactivateUser(id: string): Promise<void> {
    await api.put(`/Admin/users/${id}/reactivate`);
  },

  async getJobAds(search?: string, page = 1, pageSize = 10): Promise<PaginatedResult<AdminJobAdDto>> {
    const response = await api.get<PaginatedResult<AdminJobAdDto>>('/Admin/job-ads', {
      params: { search, page, pageSize },
    });
    return response.data;
  },

  async deleteJobAd(id: string): Promise<void> {
    await api.delete(`/Admin/job-ads/${id}`);
  },
};
