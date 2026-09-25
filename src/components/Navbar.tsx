import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  MessageSquare,
  Shield,
  ShieldCheck,
  Code2,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SOCIAL_LINKS } from '../lib/constants';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenGeminiStudio: (tab?: 'chat' | 'image' | 'music' | 'video') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenGeminiStudio }) => {
  const { theme, toggleTheme, isAdmin, currentUser } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 dark:bg-slate-950/85 bg-white/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 shadow-lg shadow-black/5 dark:shadow-cyan-950/20 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 text-slate-900 dark:text-white font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Amit Kumar
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-widest uppercase -mt-0.5">
              Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 transition-all duration-150"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls & Socials */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* GitHub Icon */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Amit Kumar GitHub profile"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* LinkedIn Icon */}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Amit Kumar LinkedIn profile"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Admin Dashboard Portal Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title={isAdmin ? `Admin Portal (Logged in as ${currentUser?.email || 'Admin'})` : 'Admin Dashboard Portal'}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              isAdmin
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 shadow-sm shadow-cyan-500/20'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-4 h-4 text-cyan-400" /> : <Shield className="w-4 h-4" />}
          </button>

          {/* Gemini AI Studio Trigger */}
          <button
            type="button"
            onClick={() => onOpenGeminiStudio('chat')}
            title="Open Gemini AI Assistant & Creative Studio"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Gemini AI</span>
          </button>

          {/* Hire Me / Contact CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-90 active:scale-95 shadow-md shadow-cyan-500/20 transition-all duration-150"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Let's Talk</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-cyan-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
            {/* Gemini Studio Mobile Action */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGeminiStudio('chat');
              }}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 my-1 text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Gemini AI Studio</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                Chat &amp; Creative
              </span>
            </button>
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
