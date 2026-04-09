import { api } from './api';
import { Message, CreateMessageDto } from '@/types';

export const messageService = {
  async sendMessage(data: CreateMessageDto): Promise<Message> {
    const response = await api.post<Message>('/Message', data);
    return response.data;
  },

  async getConversation(otherUserId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/Message/conversation/${otherUserId}`);
    return response.data;
  },

  async getInbox(): Promise<Message[]> {
    const response = await api.get<Message[]>('/Message/inbox');
    return response.data;
  },
};
