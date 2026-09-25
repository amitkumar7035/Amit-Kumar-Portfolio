import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Layers
} from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent High-Visibility Cross (Close) Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project modal"
          title="Close (Esc)"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-40 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white shadow-2xl border-2 border-white/70 hover:border-white transition-all duration-200 cursor-pointer active:scale-90 group focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Project Large Screenshot / Graphic */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <img
            src={project.image || '/images/project-portfolio.svg'}
            alt={project.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Badge overlays */}
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {project.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                {project.title}
              </h2>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-500 font-semibold mb-1.5">
              Project Overview
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Problem & Solution Grid */}
          {(project.problem || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.problem && (
                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>The Problem</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>The Solution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Features List */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-500 font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Key Features</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-500 font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Tech Stack &amp; Tools</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Learnings */}
          {project.challenges && (
            <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
              <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-500 font-bold mb-1.5">
                Challenges &amp; What I Learned
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {/* Placeholder Notice */}
          <div className="pt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
            Note: Placeholders are clearly identified. Projects can be dynamically edited or added anytime via the Admin Portal.
          </div>
        </div>

        {/* Modal Bottom Footer with Close Action */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">Esc</kbd> or click outside to dismiss
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-md hover:shadow-rose-600/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close Box</span>
          </button>
        </div>
      </div>
    </div>
  );
};
