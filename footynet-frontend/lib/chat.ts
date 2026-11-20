import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// NEXT_PUBLIC_API_URL points at ".../api"; the hub lives next to it at ".../hubs/chat"
const HUB_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/, '') + '/hubs/chat';

// Event names must match the constants in the backend's ChatHub
export const CHAT_EVENTS = {
  receiveMessage: 'ReceiveMessage',
  messagesRead: 'MessagesRead',
} as const;

// Pause before the next connection attempt: quick at first, then every 30 s for as long as it takes
// (e.g. a free-tier backend waking up, or a laptop coming back online)
export const retryDelay = (attempt: number) => [0, 2_000, 5_000, 10_000].at(attempt) ?? 30_000;

export function createChatConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      // Read on every (re)connect so a fresh token after login is picked up
      accessTokenFactory: () => localStorage.getItem('token') ?? '',
    })
    // Never gives up after a dropped connection (the default stops after four tries, about 40 s)
    .withAutomaticReconnect({ nextRetryDelayInMilliseconds: ctx => retryDelay(ctx.previousRetryCount) })
    .configureLogging(LogLevel.Warning)
    .build();
}
