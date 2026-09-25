import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate } from '../../types';

export const AdminCertificates: React.FC = () => {
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialUrl: '',
    image: '',
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      credentialUrl: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || cert.name || '',
      issuer: cert.issuer,
      date: cert.date || cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
      image: cert.image || cert.previewUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title?: string) => {
    if (window.confirm(`Delete certificate "${title || 'this certificate'}"?`)) {
      await deleteCertificate(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) return;

    const payload = {
      name: formData.title.trim(),
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      issueDate: formData.date.trim(),
      date: formData.date.trim(),
      credentialUrl: formData.credentialUrl.trim(),
      image: formData.image.trim(),
      previewUrl: formData.image.trim(),
    };

    if (editingCert) {
      await updateCertificate(editingCert.id, payload);
    } else {
      await addCertificate(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            <span>Certificates &amp; Credentials</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showcase verified course certificates, hackathon honors, and industry credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    title="View Credential"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <h3 className="font-bold text-sm text-white tracking-tight">{cert.title || cert.name}</h3>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{cert.issuer}</span>
                <span>{cert.date || cert.issueDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-4 mt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => handleOpenEdit(cert)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-cyan-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cert.id, cert.title || cert.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          No certificates configured yet. Click "Add Certificate" to add one.
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>{editingCert ? 'Edit Certificate' : 'Add New Certificate'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Meta Frontend Developer Professional Certificate"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g. Coursera / Meta"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Year / Issue Date
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCert ? 'Save Certificate' : 'Create Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
