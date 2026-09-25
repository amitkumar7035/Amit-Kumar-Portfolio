import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Maximize2,
  Sparkles,
  Layers,
  Code2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory } from '../types';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories: ProjectCategory[] = ['All', 'Frontend', 'Full Stack', 'JavaScript', 'Java', 'Other'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => {
        if (p.category.toLowerCase() === selectedCategory.toLowerCase()) return true;
        // Also check if tech stack includes category (e.g. JavaScript or Java)
        if (p.technologies.some(t => t.toLowerCase() === selectedCategory.toLowerCase())) return true;
        return false;
      });

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Selected Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Live web experiments, practice applications, and portfolio projects demonstrating clean implementation.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Code2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No projects found under this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Project Media Thumbnail */}
                <div
                  className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
                  onClick={() => setActiveProject(project)}
                >
                  <img
                    src={project.image || '/images/project-portfolio.svg'}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-950/80 text-cyan-300 border border-slate-700/60 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Quick Expand Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(project);
                    }}
                    aria-label="View project details"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border border-white/20"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setActiveProject(project)}
                      className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors cursor-pointer leading-snug"
                    >
                      {project.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-400">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Case Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="View source code on GitHub"
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open live demo"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
                        >
                          <span>Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
