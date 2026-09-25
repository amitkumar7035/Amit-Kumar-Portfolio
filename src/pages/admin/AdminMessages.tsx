import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  User,
  Clock,
  Trash2,
  CheckCircle2,
  Reply,
  Search,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminMessages: React.FC = () => {
  const { messages, updateMessageStatus, deleteMessage } = usePortfolio();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete message from "${name}"?`)) {
      await deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied') => {
    await updateMessageStatus(id, newStatus.toUpperCase() as 'NEW' | 'READ' | 'REPLIED');
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  };

  const filtered = messages.filter((m) => {
    const s = m.status?.toLowerCase() || 'new';
    const matchesStatus = statusFilter === 'all' || s === statusFilter;
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <span>Contact Form Inquiries</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and organize recruiter, collaboration, and visitor messages sent through the portfolio.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Total Submissions: <span className="font-bold text-white">{messages.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sender, email, subject, or message content..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New / Unread' },
            { id: 'read', label: 'Read' },
            { id: 'replied', label: 'Replied' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inbox View: List + Reader Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className="lg:col-span-6 space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {filtered.map((msg) => {
            const isSelected = selectedMessage?.id === msg.id;
            const currentStatus = msg.status?.toLowerCase() || 'new';

            return (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (currentStatus === 'new') {
                    handleStatusChange(msg.id, 'read');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-white truncate text-sm">{msg.name}</span>
                    {currentStatus === 'new' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                        New
                      </span>
                    )}
                    {currentStatus === 'replied' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        Replied
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {msg.date || 'Recent'}
                  </span>
                </div>

                <div className="font-semibold text-slate-300 truncate mb-1">{msg.subject}</div>
                <div className="text-slate-500 line-clamp-2 leading-relaxed">{msg.message}</div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500">
              No messages found.
            </div>
          )}
        </div>

        {/* Selected Message Detail Column */}
        <div className="lg:col-span-6">
          {selectedMessage ? (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 sticky top-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="font-semibold text-cyan-400">{selectedMessage.name}</span>
                    <span>•</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="hover:underline text-slate-300 flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{selectedMessage.email}</span>
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Controls */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Status:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedMessage.status === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Mark as Read
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedMessage.status === 'replied'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Mark as Replied
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[140px]">
                {selectedMessage.message}
              </div>

              {/* Reply Action */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors shadow-md shadow-cyan-500/20"
                >
                  <Reply className="w-4 h-4" />
                  <span>Send Direct Email Reply</span>
                </a>

                <span className="text-[11px] font-mono text-slate-500">
                  {selectedMessage.date || 'Received recently'}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500 space-y-2">
              <Mail className="w-8 h-8 text-slate-700" />
              <p>Select an inquiry from the left to inspect full content and update status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
