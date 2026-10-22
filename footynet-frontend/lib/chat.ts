import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// NEXT_PUBLIC_API_URL points at ".../api"; the hub lives next to it at ".../hubs/chat"
const HUB_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/, '') + '/hubs/chat';

// Event names must match the constants in the backend's ChatHub
export const CHAT_EVENTS = {
  receiveMessage: 'ReceiveMessage',
  messagesRead: 'MessagesRead',
} as const;

export function createChatConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      // Read on every (re)connect so a fresh token after login is picked up
      accessTokenFactory: () => localStorage.getItem('token') ?? '',
    })
    // Retries after 0s, 2s, 10s, 30s if the connection drops (e.g. backend restart, Wi-Fi switch)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}
