import React, { useState } from 'react';
import {
  GraduationCap,
  Layout,
  BookOpen,
  Code2,
  FileDown,
  CheckCircle2,
  Brain,
  Layers
} from 'lucide-react';
import { ProfileImage } from './ProfileImage';

export const About: React.FC = () => {

  // Strictly verified cards only - no invented client counts or fake years of experience
  const verifiedCards = [
    {
      label: 'Academics',
      title: 'BTech Student',
      subtitle: 'Computer Science',
      icon: GraduationCap,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      label: 'Core Focus',
      title: 'Frontend',
      subtitle: 'Web Development',
      icon: Layout,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    },
    {
      label: 'In Progress',
      title: 'Learning DSA',
      subtitle: 'Data Structures & Algo',
      icon: BookOpen,
      color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      label: 'Expansion',
      title: 'Backend + AI',
      subtitle: 'Full-Stack Road',
      icon: Brain,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Get To Know Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Compact Portrait Presentation (Clean, Original Colors Without Filters/Overlays) */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[280px]">
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl">
                {/* Photo container - zero overlays, filters, or blend modes */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <ProfileImage
                    alt="Amit Kumar portrait presentation"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Clean photo caption placed BELOW the image */}
                <div className="mt-3 px-1 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Amit Kumar</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">BTech CS • Developer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Verified Credentials */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              <p>
                I am a passionate <span className="font-semibold text-slate-900 dark:text-white">BTech Computer Science student</span> and an aspiring software and web developer with a strong drive for learning and engineering clean solutions.
              </p>
              <p>
                I enjoy building modern websites, exploring core programming paradigms in <span className="text-cyan-500 font-medium">C++</span> and <span className="text-blue-500 font-medium">Java</span>, and mastering the fundamentals of frontend development with HTML, CSS, JavaScript, and responsive design.
              </p>
              <p>
                Currently, I am dedicated to deep diving into <span className="text-indigo-400 font-medium">Data Structures &amp; Algorithms</span> to strengthen my problem-solving ability, alongside learning <span className="text-cyan-400 font-medium">Backend Development</span>, full-stack architectures, and AI-powered applications. I believe in a continuous learning mindset and turning code into responsive, user-friendly experiences.
              </p>
            </div>

            {/* Verified Fact Cards Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {verifiedCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.title}
                    className={`p-4 rounded-xl bg-gradient-to-br ${card.color} border bg-slate-900/40 backdrop-blur-sm flex flex-col justify-between`}
                  >
                    <IconComponent className="w-5 h-5 mb-2.5" />
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {card.label}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {card.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {card.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prominent Resume Download Button */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
              <a
                href="/resume/Amit-Kumar-Resume.pdf"
                download="Amit-Kumar-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-150"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Resume (PDF)</span>
              </a>

              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                Verified developer credentials • Updated 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
