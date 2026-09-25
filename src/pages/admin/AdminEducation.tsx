import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Education } from '../../types';

export const AdminEducation: React.FC = () => {
  const { education, addEducation, updateEducation, deleteEducation } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    period: '2024 - 2028',
    description: '',
    highlights: '',
  });

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setFormData({
      degree: '',
      institution: '',
      period: '2024 - 2028',
      description: '',
      highlights: 'Data Structures & Algorithms, Web Engineering',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period || edu.duration || '',
      description: edu.description || '',
      highlights: Array.isArray(edu.highlights) ? edu.highlights.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, degree: string) => {
    if (window.confirm(`Delete education record "${degree}"?`)) {
      await deleteEducation(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) return;

    const highlightsArr = formData.highlights
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      degree: formData.degree.trim(),
      institution: formData.institution.trim(),
      period: formData.period.trim(),
      duration: formData.period.trim(),
      field: 'Computer Science & Engineering',
      status: 'In Progress',
      description: formData.description.trim(),
      highlights: highlightsArr,
    };

    if (editingEdu) {
      await updateEducation(editingEdu.id, payload);
    } else {
      await addEducation(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <span>Education &amp; Academics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your formal academic degree timelines, coursework highlights, and college credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-3">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-white">{edu.degree}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {edu.period || edu.duration}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-300">{edu.institution}</div>
              {edu.description && (
                <p className="text-xs text-slate-400 leading-relaxed">{edu.description}</p>
              )}

              {edu.highlights && edu.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {edu.highlights.map((h: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
              <button
                type="button"
                onClick={() => handleOpenEdit(edu)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-cyan-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(edu.id, edu.degree)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {education.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          No education entries found. Click "Add Education Record" to add your degree.
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>{editingEdu ? 'Edit Education' : 'Add Education Record'}</span>
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
                  Degree / Program *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. BTech in Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Institution / University *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. University / College of Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Timeline / Period
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. 2024 - 2028"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Course Highlights (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Data Structures, Algorithms, Web Engineering"
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
                  <span>{editingEdu ? 'Save Changes' : 'Create Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
