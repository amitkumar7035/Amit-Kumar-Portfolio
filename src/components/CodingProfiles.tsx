import React from 'react';
import {
  Github,
  Linkedin,
  Code2,
  BookOpen,
  Instagram,
  Facebook,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SOCIAL_PROFILES } from '../lib/constants';

export const CodingProfiles: React.FC = () => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <Github className="w-5 h-5 text-white" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-400" />;
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-500" />;
      case 'leetcode': return <Code2 className="w-5 h-5 text-amber-400" />;
      case 'geeksforgeeks': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <section id="profiles" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Online Presence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Coding &amp; Profiles
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
            Platforms where I practice problem solving, push code, and connect with fellow developers.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SOCIAL_PROFILES.map((prof) => (
            <a
              key={prof.name}
              href={prof.url}
              target="_blank"
              rel="noreferrer"
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform">
                    {getIcon(prof.platform)}
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                  {prof.name}
                </h3>

                <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {prof.handle}
                </p>

                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {prof.description}
                </p>
              </div>

              {prof.isPlaceholder && (
                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Placeholder link</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
