import React from 'react';
import {
  Code2,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Heart,
  ArrowUp
} from 'lucide-react';
import { SOCIAL_LINKS } from '../lib/constants';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-slate-100 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Amit Kumar
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Web Developer | BTech Computer Science Student
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Icons & Back to top */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-cyan-400 flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram profile"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-pink-500 flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook profile"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-all ml-1 sm:ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
          <p>© 2026 Amit Kumar. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with React, TypeScript, Tailwind &amp; Firestore</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
