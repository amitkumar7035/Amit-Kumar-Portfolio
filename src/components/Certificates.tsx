import React from 'react';
import {
  Award,
  ExternalLink,
  Calendar,
  Building2,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const CertificatesSection: React.FC = () => {
  const { certificates } = usePortfolio();

  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2">
            Verifications &amp; Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Certifications
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
            Accredited course achievements, workshops, and technical credentials.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
        </div>

        {/* Empty State vs List */}
        {certificates.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
              <Award className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Certificates will be added soon.
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Course completions, technical workshops, and coding assessment credentials will be uploaded here as they are earned.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified credentials only • Zero fabricated awards</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    {cert.issueDate && (
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {cert.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {cert.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cert.issuer}</span>
                  </div>

                  {cert.description && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-500 hover:text-cyan-400"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
