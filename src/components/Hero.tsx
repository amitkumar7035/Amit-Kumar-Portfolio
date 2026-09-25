import React from 'react';
import {
  ArrowRight,
  Send,
  Github,
  Linkedin,
  Instagram,
  Facebook
} from 'lucide-react';
import { SOCIAL_LINKS } from '../lib/constants';
import { ProfileImage } from './ProfileImage';

export const Hero: React.FC = () => {

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-blue-600/10 dark:bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[320px] h-[320px] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Hi, I'm <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Amit Kumar</span>.
            </h1>

            {/* Sub-headline */}
            <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span>Web Developer &amp; BTech Computer Science Student</span>
            </h2>

            {/* Supporting Text */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              I build modern, responsive and user-focused web experiences while continuously exploring full-stack development, AI and problem solving.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] transition-all duration-150"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 active:scale-[0.98] transition-all duration-150"
              >
                <Send className="w-4 h-4 text-cyan-500" />
                <span>Let's Connect</span>
              </a>
            </div>

            {/* Additional Links & Socials */}
            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Connect:
              </span>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Right Column: Fixed Profile Photo Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Soft radial glow behind frame */}
              <div className="absolute inset-0 -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl -z-10" />

              {/* Outer decorative glowing frame */}
              <div className="relative p-2.5 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-slate-800/40 to-blue-500/30 border border-cyan-500/25 dark:border-cyan-500/30 shadow-2xl backdrop-blur-sm">
                {/* Photo container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
                  <ProfileImage
                    alt="Amit Kumar - Web Developer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient bottom shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Clean photo caption badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300/90 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 pointer-events-none">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Amit Kumar
                    </span>
                    <span className="text-slate-400">Web Developer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
