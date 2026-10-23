'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { messageService } from '@/lib/message';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { InboxItem, Message } from '@/types';
import PageShell from '@/components/PageShell';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';

interface Conversation {
  userId: string;
  name: string;
}

export default function MessagesPage() {
  // useSearchParams needs a Suspense boundary in the App Router
  return (
    <Suspense>
      <MessagesView />
    </Suspense>
  );
}

function MessagesView() {
  const t = useTranslations('messages');
  const format = useFormatter();
  // Re-render every 30s so "2 minutes ago" labels stay current. Relative times are computed against
  // new Date() at render time: next-intl's default 'now' is the server render time ("in 19 seconds")
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const searchParams = useSearchParams();
  const { userId: myId } = useAuth();
  const { connected, onMessage, refreshUnread } = useChat();

  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  // The open conversation, readable inside the SignalR callback without re-subscribing
  const selectedRef = useRef<Conversation | null>(null);
  selectedRef.current = selected;

  const loadInbox = useCallback(() => messageService.getInbox().then(setInbox), []);

  // Open the conversation passed in the URL (e.g. from "Message club" on an accepted application)
  useEffect(() => {
    loadInbox();
    const user = searchParams.get('user');
    if (user) setSelected({ userId: user, name: searchParams.get('name') ?? '' });
  }, [loadInbox, searchParams]);

  useEffect(() => {
    if (!selected) return;
    setError('');
    messageService.getConversation(selected.userId).then(setConversation);
    messageService.markConversationRead(selected.userId).then(() => {
      refreshUnread();
      setInbox(prev => prev.map(i => i.otherUserId === selected.userId ? { ...i, unreadCount: 0 } : i));
    }).catch(() => {});
  }, [selected, refreshUnread]);

  // Real-time: the server pushes every new message for this user over SignalR
  useEffect(() => onMessage((msg) => {
    const otherId = msg.senderId === myId ? msg.receiverId : msg.senderId;
    const isOpen = selectedRef.current?.userId === otherId;

    if (isOpen) {
      // Ignore duplicates: our own sent message is already added from the POST response
      setConversation(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      if (msg.senderId !== myId) messageService.markConversationRead(otherId).then(refreshUnread).catch(() => {});
    }

    setInbox(prev => {
      const existing = prev.find(i => i.otherUserId === otherId);
      const updated: InboxItem = {
        ...msg,
        otherUserId: otherId,
        otherUserName: existing?.otherUserName ?? msg.senderName ?? selectedRef.current?.name ?? '',
        unreadCount: isOpen || msg.senderId === myId ? 0 : (existing?.unreadCount ?? 0) + 1,
      };
      return [updated, ...prev.filter(i => i.otherUserId !== otherId)];
    });
  }), [onMessage, myId, refreshUnread]);

  useEffect(() => {
    // Scroll only the message list (scrollIntoView would also scroll the whole page). An instant jump
    // is used on purpose: smooth scrolling doesn't finish while the tab is in the background.
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [conversation]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!selected || !content) return;
    setSending(true);
    setError('');
    try {
      const sent = await messageService.sendMessage({ receiverId: selected.userId, content });
      setNewMessage('');
      setConversation(prev => prev.some(m => m.id === sent.id) ? prev : [...prev, sent]);
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setSending(false);
    }
  };

  const selectedName = selected
    ? inbox.find(i => i.otherUserId === selected.userId)?.otherUserName || selected.name
    : '';

  return (
    <PageShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
          <p className="mt-1 text-ink-500">{t('subtitle')}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${connected ? 'bg-pitch-50 text-pitch-700' : 'bg-ink-100 text-ink-500'}`}>
          <span className={`h-2 w-2 rounded-full ${connected ? 'animate-pulse bg-pitch-500' : 'bg-ink-400'}`} />
          {connected ? t('live') : t('connecting')}
        </span>
      </div>

      {/* Fixed-height chat window: the single grid row and both columns use min-h-0 so long
          conversations scroll inside the message list instead of stretching the layout and
          pushing the input out of view (grid/flex children default to min-height: auto).
          On mobile the navbar has a second row of links, hence the larger offset. */}
      <div className="grid h-[calc(100dvh-18rem)] min-h-[28rem] md:h-[calc(100dvh-15rem)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-card md:grid-cols-[20rem_1fr]">
        {/* Conversation list (hidden on mobile while a conversation is open) */}
        <aside className={`min-h-0 flex-col border-r border-ink-100 ${selected ? 'hidden md:flex' : 'flex'}`}>
          <h2 className="eyebrow border-b border-ink-100 px-5 py-4">{t('inbox')}</h2>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {inbox.length === 0 ? (
              <EmptyState icon={MessageCircle} title={t('empty')} description={t('emptyHint')} />
            ) : inbox.map(item => {
              const active = selected?.userId === item.otherUserId;
              return (
                <button
                  key={item.otherUserId}
                  onClick={() => setSelected({ userId: item.otherUserId, name: item.otherUserName })}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${active ? 'bg-pitch-50' : 'hover:bg-ink-50'}`}
                >
                  <Avatar name={item.otherUserName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`truncate text-sm ${item.unreadCount ? 'font-bold text-ink-900' : 'font-semibold text-ink-800'}`}>{item.otherUserName}</p>
                      <span className="shrink-0 text-[11px] text-ink-400">{format.relativeTime(new Date(item.sentAt), new Date())}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`flex-1 truncate text-xs ${item.unreadCount ? 'font-medium text-ink-700' : 'text-ink-500'}`}>
                        {item.senderId === myId && <span className="text-ink-400">{t('you')}: </span>}{item.content}
                      </p>
                      {!!item.unreadCount && (
                        <span className="min-w-[1.25rem] rounded-full bg-pitch-600 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">{item.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Open conversation */}
        <section className={`min-h-0 flex-col ${selected ? 'flex' : 'hidden md:flex'}`}>
          {selected ? (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-ink-100 px-5 py-3">
                <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 md:hidden" aria-label={t('back')}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar name={selectedName || '?'} />
                <p className="font-semibold text-ink-900">{selectedName}</p>
              </header>

              <div ref={listRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain bg-ink-50/60 px-4 py-5 sm:px-6">
                {conversation.length === 0 && <p className="py-10 text-center text-sm text-ink-400">{t('startConversation')}</p>}
                {conversation.map(msg => {
                  const isMe = msg.senderId === myId;
                  return (
                    <div key={msg.id} className={`flex animate-fade-in-up ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-md ${
                        isMe ? 'rounded-br-md bg-pitch-600 text-white' : 'rounded-bl-md border border-ink-200/70 bg-white text-ink-900'
                      }`}>
                        <p className="whitespace-pre-line break-words text-sm">{msg.content}</p>
                        <p className={`mt-1 text-right text-[10px] ${isMe ? 'text-pitch-100' : 'text-ink-400'}`}>
                          {format.dateTime(new Date(msg.sentAt), { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && <div className="shrink-0 px-4 pt-3"><ErrorMessage message={error} /></div>}
              <form onSubmit={handleSend} className="flex shrink-0 gap-2 border-t border-ink-100 p-3 sm:p-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('placeholder')}
                  maxLength={2000}
                  className="field flex-1"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pitch-600 text-white shadow-sm transition hover:bg-pitch-700 disabled:opacity-40"
                  aria-label={t('send')}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState icon={MessageCircle} title={t('selectConversation')} />
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
