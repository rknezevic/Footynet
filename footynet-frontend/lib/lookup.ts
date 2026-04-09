import { api } from './api';

export interface County {
  id: string;
  name: string;
}

export interface League {
  id: string;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export const lookupService = {
  async getCounties(): Promise<County[]> {
    const response = await api.get<County[]>('/Lookup/counties');
    return response.data;
  },

  async getLeagues(): Promise<League[]> {
    const response = await api.get<League[]>('Lookup/leagues');
    return response.data;
  },

  async getPositions(): Promise<Position[]> {
    const response = await api.get<Position[]>('Lookup/positions');
    return response.data;
  },
};
