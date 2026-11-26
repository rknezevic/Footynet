import { api } from './api';

export interface NotificationSettings {
  // Email about messages left unread for a few minutes
  messageEmails: boolean;
}

export const notificationService = {
  async get(): Promise<NotificationSettings> {
    const response = await api.get<NotificationSettings>('/Profile/notifications');
    return response.data;
  },

  async update(settings: NotificationSettings): Promise<void> {
    await api.put('/Profile/notifications', settings);
  },
};
