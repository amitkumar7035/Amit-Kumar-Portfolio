import React from 'react';
import {
  Smartphone,
  Building2,
  Code,
  Sparkles,
  Database,
  Check
} from 'lucide-react';
import { SERVICES } from '../lib/constants';

export const ServicesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-6 h-6" />;
      case 'Building2': return <Building2 className="w-6 h-6" />;
      case 'Code': return <Code className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Database': return <Database className="w-6 h-6" />;
      default: return <Code className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="py-20 relative bg-slate-900/20 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Capabilities &amp; Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What I Can Build
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Modern web solutions tailored for startups, small businesses, and digital creators.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((srv, idx) => (
            <div
              key={srv.id}
              className={`p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5">
                  {getIcon(srv.icon)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {srv.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                {srv.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
