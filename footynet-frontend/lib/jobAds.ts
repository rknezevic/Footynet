import { api } from './api';
import { JobAdDto } from '@/types';

export const jobAdService = {
  async getAll(params: {
    page?: number;
    pageSize?: number;
    position?: string;
    leagueId?: string;
    countyId?: string;
    searchTerm?: string;
    sortDescending?: boolean;
  }): Promise<JobAdDto[]> {
    const response = await api.get<JobAdDto[]>('/JobAds', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/JobAds/${id}`);
    return response.data;
  },
};
