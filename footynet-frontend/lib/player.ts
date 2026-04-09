import { api } from './api';
import { PlayerProfileDto, UpdatePlayerProfileDto, CreateApplicationDto, JobAdDto, PaginatedResult } from '@/types';

export const playerService = {
  async getProfile(): Promise<PlayerProfileDto> {
    const response = await api.get<PlayerProfileDto>('/Player/profile');
    return response.data;
  },

  async updateProfile(data: UpdatePlayerProfileDto): Promise<PlayerProfileDto> {
    const response = await api.put<PlayerProfileDto>('/Player/profile', data);
    return response.data;
  },

  async applyToJob(data: CreateApplicationDto) {
    const response = await api.post('/Player/apply', data);
    return response.data;
  },

  async getMyApplications(page = 1, pageSize = 10): Promise<PaginatedResult<JobAdDto>> {
    const response = await api.get<PaginatedResult<JobAdDto>>('/Player/applications', {
      params: { page, pageSize }
    });
    return response.data;
  },

  async cancelApplication(applicationId: string) {
    await api.delete(`/Player/applications/${applicationId}`);
  },

  async deactivateAccount() {
    await api.delete('/Player/account');
  },
};
