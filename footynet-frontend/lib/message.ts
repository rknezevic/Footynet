import { api } from './api';
import { Message, CreateMessageDto, InboxItem } from '@/types';

export const messageService = {
  async sendMessage(data: CreateMessageDto): Promise<Message> {
    const response = await api.post<Message>('/Message', data);
    return response.data;
  },

  async getConversation(otherUserId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/Message/conversation/${otherUserId}`);
    return response.data;
  },

  async markConversationRead(otherUserId: string): Promise<void> {
    await api.post(`/Message/conversation/${otherUserId}/read`);
  },

  async getInbox(): Promise<InboxItem[]> {
    const response = await api.get<InboxItem[]>('/Message/inbox');
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<number>('/Message/unread-count');
    return response.data;
  },
};
