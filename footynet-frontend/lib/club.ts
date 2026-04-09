import { api } from './api';
import { ClubProfileDto, UpdateClubProfileDto, CreateJobAdDto, JobApplication, StatusType, PaginatedResult } from '@/types';

export const clubService = {
  async getProfile(): Promise<ClubProfileDto> {
    const response = await api.get<ClubProfileDto>('/Club/profile');
    return response.data;
  },

  async updateProfile(data: UpdateClubProfileDto) {
    await api.put('/Club/profile', data);
  },

  async createJobAd(data: CreateJobAdDto) {
    const response = await api.post('/Club/job-ads', data);
    return response.data;
  },

  async getMyAds() {
    const response = await api.get('/Club/job-ads');
    return response.data;
  },

  async updateJobAd(id: string, data: CreateJobAdDto) {
    const response = await api.put(`/Club/job-ads/${id}`, data);
    return response.data;
  },

  async closeJobAd(id: string) {
    await api.put(`/Club/job-ads/${id}/close`);
  },

  async reopenJobAd(id: string) {
    await api.put(`/Club/job-ads/${id}/reopen`);
  },

  async getApplications(jobAdId: string, status?: StatusType, page = 1, pageSize = 10): Promise<PaginatedResult<JobApplication>> {
    const response = await api.get<PaginatedResult<JobApplication>>(`/Club/applications/${jobAdId}`, {
      params: { status, page, pageSize },
    });
    return response.data;
  },

  async acceptApplication(applicationId: string) {
    await api.put(`/Club/applications/${applicationId}/accept`);
  },

  async rejectApplication(applicationId: string) {
    await api.put(`/Club/applications/${applicationId}/reject`);
  },

  async getApplicationCount(jobAdId: string): Promise<number> {
    const response = await api.get<number>(`/Club/applications/${jobAdId}/count`);
    return response.data;
  },

  async deactivateAccount() {
    await api.delete('/Club/account');
  },
};
