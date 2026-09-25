import React, { useState } from 'react';
import {
  Code2,
  Palette,
  FileCode2,
  Smartphone,
  Cpu,
  Coffee,
  GitBranch,
  Github,
  Terminal,
  Binary,
  Server,
  Layers,
  Sparkles,
  Globe,
  Filter,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory, SkillLevel } from '../types';

export const Skills: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Programming', 'Tools', 'Currently Learning'];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  // Icon mapping helper
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'FileCode2': return <FileCode2 className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'Github': return <Github className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'Binary': return <Binary className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  // Level badge styling - strictly using verified labels
  const getLevelBadge = (level: SkillLevel) => {
    switch (level) {
      case 'Comfortable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            Comfortable
          </span>
        );
      case 'Learning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            Learning
          </span>
        );
      case 'Currently Exploring':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Compass className="w-3 h-3" />
            Currently Exploring
          </span>
        );
    }
  };

  return (
    <section id="skills" className="py-20 relative bg-slate-900/20 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Technical Competencies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skills &amp; Learning Roadmap
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Practical skills verified by coursework and hands-on practice, with honest proficiency indicators.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-200">
                    {getIcon(skill.icon)}
                  </div>
                  {getLevelBadge(skill.level)}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                  {skill.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">
                  {skill.category}
                </span>

                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {skill.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Status</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
