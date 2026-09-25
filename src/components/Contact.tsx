import React, { useState } from 'react';
import {
  Send,
  User,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Loader2,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SOCIAL_LINKS } from '../lib/constants';

interface ContactProps {
  onOpenMaps?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenMaps }) => {
  const { submitContactMessage } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setStatus('error');
      setErrorMessage('Please provide a subject for your message.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus('error');
      setErrorMessage('Message must be at least 10 characters long.');
      return;
    }

    try {
      setStatus('submitting');
      setErrorMessage('');

      await submitContactMessage(formData);

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again or reach out through my social channels.');
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-slate-900/20 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let's Build Something Together.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
            Have a project in mind, feedback, or a recruiter query? Send a message and I'll respond promptly.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Connect Directly
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether you are exploring web collaboration, developer roles, or project ideas, feel free to reach out via message or social media.
              </p>

              <div className="mt-8 space-y-3">
                {/* Social media quick connections */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Code</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-400 truncate">
                        GitHub
                      </div>
                    </div>
                  </a>

                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Network</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-400 truncate">
                        LinkedIn
                      </div>
                    </div>
                  </a>

                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-pink-500/40 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Updates</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-pink-400 truncate">
                        Instagram
                      </div>
                    </div>
                  </a>

                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Social</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-400 truncate">
                        Facebook
                      </div>
                    </div>
                  </a>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Availability</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Open to internships, projects &amp; freelance
                    </div>
                  </div>
                </div>

                {/* Base Location & Google Maps Grounding Card */}
                <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Location &amp; Maps</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        India • Remote &amp; On-Site
                      </div>
                    </div>
                  </div>
                  {onOpenMaps && (
                    <button
                      type="button"
                      onClick={onOpenMaps}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                      title="Explore tech hubs with Google Maps Grounding"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Explore Maps</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-cyan-400">Full-Stack Database Connected:</span> Messages sent via this form are safely stored in Firestore for instant review.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl relative">
              {/* Success Banner */}
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Message sent successfully!</h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">
                      Thank you for reaching out, Amit Kumar will get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Submission Error</h4>
                    <p className="text-xs text-red-300/90 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Your Name *
                    </label>
                    <div className="relative">
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Your Email *
                    </label>
                    <div className="relative">
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Job Opportunity / Hello"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white text-sm outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, or questions..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white text-sm outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none transition-all duration-150 inline-flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
