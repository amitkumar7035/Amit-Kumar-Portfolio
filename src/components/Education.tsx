import React from 'react';
import {
  GraduationCap,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="py-20 relative bg-slate-900/20 dark:bg-slate-950/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Academic Background
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
            Formal undergraduate studies in computer science and software development.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-cyan-500/30 dark:border-cyan-500/20 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
          {education.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-cyan-500 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-200">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Education Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/40 transition-all duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.status || 'In Progress'}</span>
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {item.degree}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{item.institution}</span>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Clear Placeholder Flag */}
                {item.institution.includes('[ADD') && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-mono flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>College placeholder can be customized directly in the Admin Dashboard.</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
