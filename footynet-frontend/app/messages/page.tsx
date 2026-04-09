'use client';

import { useEffect, useState } from 'react';
import { messageService } from '@/lib/message';
import { Message } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';

interface InboxMessage extends Message { otherUserName?: string; }

export default function MessagesPage() {
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => { loadInbox(); }, []);
  useEffect(() => { if (selectedUserId) loadConversation(selectedUserId); }, [selectedUserId]);

  const loadInbox = async () => setInbox(await messageService.getInbox());
  const loadConversation = async (userId: string) => setConversation(await messageService.getConversation(userId));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !newMessage.trim()) return;
    await messageService.sendMessage({ receiverId: selectedUserId, content: newMessage });
    setNewMessage('');
    loadConversation(selectedUserId);
    loadInbox();
  };

  const uniqueUsers = Array.from(
    new Map(inbox.map(m => {
      const myId = localStorage.getItem('userId');
      return [m.senderId === myId ? m.receiverId : m.senderId, m];
    })).values()
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">Messages</h1>
        <p className="text-sm text-neutral-500 mb-8">Conversations</p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 bg-white border border-neutral-200 rounded-lg p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">Inbox</h3>
            <div className="space-y-2">
              {uniqueUsers.length === 0 ? <p className="text-sm text-neutral-400">No messages yet</p> : uniqueUsers.map((msg) => {
                const myId = localStorage.getItem('userId');
                const otherUserId = msg.senderId === myId ? msg.receiverId : msg.senderId;
                const displayName = (msg as InboxMessage).otherUserName || otherUserId.substring(0, 8);
                return (
                  <button key={otherUserId} onClick={() => { setSelectedUserId(otherUserId); setSelectedUserName(displayName); }}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${selectedUserId === otherUserId ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                    <p className="text-sm font-medium text-neutral-900 mb-0.5">{displayName}</p>
                    <p className="text-xs text-neutral-400 truncate">{msg.content}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col-span-8 bg-white border border-neutral-200 rounded-lg flex flex-col" style={{ height: '600px' }}>
            {selectedUserId ? (
              <>
                <div className="border-b border-neutral-200 px-5 py-3">
                  <p className="text-sm font-medium text-neutral-700">Conversation with {selectedUserName}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {conversation.map((msg) => {
                    const isMe = msg.senderId === localStorage.getItem('userId');
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-2.5 rounded-lg ${isMe ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-neutral-400' : 'text-neutral-500'}`}>{new Date(msg.sentAt).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={handleSend} className="border-t border-neutral-200 p-4 flex gap-3">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" required />
                  <button type="submit" className="bg-neutral-900 text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors">Send</button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-neutral-400">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
