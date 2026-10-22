'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { useAuth } from '@/contexts/AuthContext';
import { createChatConnection, CHAT_EVENTS } from '@/lib/chat';
import { messageService } from '@/lib/message';
import { Message, RoleType } from '@/types';

type MessageListener = (message: Message) => void;

interface ChatContextType {
  connected: boolean;
  unreadCount: number;
  refreshUnread: () => void;
  // Subscribe to messages pushed by the server; returns an unsubscribe function
  onMessage: (listener: MessageListener) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Keeps one SignalR connection per logged-in player/club for the whole app (navbar badge + messages page)
export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, role, userId } = useAuth();
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const listeners = useRef(new Set<MessageListener>());
  const connectionRef = useRef<HubConnection | null>(null);

  const refreshUnread = useCallback(() => {
    messageService.getUnreadCount().then(setUnreadCount).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated || role === RoleType.Admin) return;

    const connection = createChatConnection();
    connectionRef.current = connection;

    connection.on(CHAT_EVENTS.receiveMessage, (message: Message) => {
      if (message.receiverId === userId) setUnreadCount(c => c + 1);
      listeners.current.forEach(l => l(message));
    });
    connection.on(CHAT_EVENTS.messagesRead, () => refreshUnread());
    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(() => { setConnected(true); refreshUnread(); });
    connection.onclose(() => setConnected(false));

    connection.start()
      .then(() => { setConnected(true); refreshUnread(); })
      .catch(err => console.warn('Chat connection failed', err));

    return () => {
      connectionRef.current = null;
      setConnected(false);
      if (connection.state !== HubConnectionState.Disconnected) connection.stop();
    };
  }, [isAuthenticated, role, userId, refreshUnread]);

  const onMessage = useCallback((listener: MessageListener) => {
    listeners.current.add(listener);
    return () => { listeners.current.delete(listener); };
  }, []);

  return (
    <ChatContext.Provider value={{ connected, unreadCount, refreshUnread, onMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
