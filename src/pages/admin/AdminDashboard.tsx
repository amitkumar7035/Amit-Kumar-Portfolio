import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  Award,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Star,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminDashboard: React.FC = () => {
  const {
    projects,
    skills,
    education,
    certificates,
    messages
  } = usePortfolio();

  const featuredProjects = projects.filter((p) => p.featured);
  const unreadMessages = messages.filter((m) => m.status === 'NEW');

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      detail: `${featuredProjects.length} featured`,
      icon: FolderGit2,
      path: '/admin/projects',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Skills & Tech',
      value: skills.length,
      detail: 'Core competencies',
      icon: Cpu,
      path: '/admin/skills',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Certificates',
      value: certificates.length,
      detail: 'Credentials verified',
      icon: Award,
      path: '/admin/certificates',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'Education Records',
      value: education.length,
      detail: 'Timeline entries',
      icon: GraduationCap,
      path: '/admin/education',
      color: 'from-cyan-600 to-teal-600',
    },
    {
      title: 'Contact Messages',
      value: messages.length,
      detail: `${unreadMessages.length} unread / new`,
      icon: MessageSquare,
      path: '/admin/messages',
      color: 'from-purple-600 to-pink-600',
      badge: unreadMessages.length > 0 ? `${unreadMessages.length} New` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Admin Session Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Welcome back, Amit Kumar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Manage all portfolio projects, technical skills, credentials, and respond to incoming recruiter and collaboration inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.path}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 group flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                {stat.badge ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {stat.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">{stat.title}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{stat.detail}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Messages & Security Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Inquiries */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Recent Contact Inquiries</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submissions from the public portfolio contact form.
              </p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all ({messages.length})
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-500">
              No contact submissions received yet. When visitors fill out the contact form, their messages will appear here.
            </div>
          ) : (
            <div className="space-y-2.5">
              {messages.slice(0, 4).map((msg) => (
                <Link
                  key={msg.id}
                  to="/admin/messages"
                  className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors block text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-white truncate">{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {msg.date || 'Recent'}
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium truncate">{msg.subject}</div>
                  <div className="text-slate-500 text-[11px] truncate mt-0.5">{msg.message}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Security & Authentication Overview */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security Architecture</span>
          </h2>
          <p className="text-xs text-slate-400">
            Hardened server-side authentication protects all administrative operations.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-200">HTTP-Only Cookies</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Sessions are stored in cryptographically sealed, HTTP-only cookies protected from client-side script access.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Scrypt Password Hashing</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Passwords use cryptographic salting and Scrypt key derivation with timing-safe verification.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Brute-Force Rate Limiting</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Login attempts are limited to 5 failures per 15 minutes with automated IP lockout.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
