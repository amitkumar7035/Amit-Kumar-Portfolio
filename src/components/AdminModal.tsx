import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  Mail,
  Award,
  Database,
  ExternalLink,
  Github,
  Key,
  FolderGit2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProfileImage } from './ProfileImage';
import { Project, Skill, Certificate, Education } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    isAdmin,
    currentUser,
    loginWithGoogle,
    logout,
    loginWithPasscode,
    profilePhoto,
    setProfilePhoto,
    projects,
    skills,
    education,
    certificates,
    messages,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    updateEducation,
    addCertificate,
    deleteCertificate,
    updateMessageStatus,
    deleteMessage,
    seedDatabase
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'education' | 'messages' | 'database' | 'profile'>('projects');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoSaveNotice, setPhotoSaveNotice] = useState('');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Project form modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    problem: '',
    solution: '',
    challenges: '',
    image: '/images/project-portfolio.svg',
    category: 'Frontend',
    technologies: 'HTML5, CSS3, JavaScript',
    features: 'Responsive Layout, Clean Navigation',
    githubUrl: 'https://github.com/placeholder',
    liveUrl: '#',
    featured: true
  });

  // Skill form state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend' as any,
    level: 'Comfortable' as any,
    description: '',
    icon: 'Code2'
  });

  // Certificate form state
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      setAuthError('');
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginWithPasscode(passcode)) {
      setPasscode('');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode.');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title.trim(),
      slug: projectForm.slug.trim() || projectForm.title.toLowerCase().replace(/\s+/g, '-'),
      description: projectForm.description.trim(),
      longDescription: projectForm.longDescription.trim(),
      problem: projectForm.problem.trim(),
      solution: projectForm.solution.trim(),
      challenges: projectForm.challenges.trim(),
      image: projectForm.image.trim(),
      category: projectForm.category,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
      features: projectForm.features.split(',').map(f => f.trim()).filter(Boolean),
      githubUrl: projectForm.githubUrl.trim(),
      liveUrl: projectForm.liveUrl.trim(),
      featured: projectForm.featured
    };

    if (editingProject) {
      await updateProject(editingProject.id, payload);
      setEditingProject(null);
    } else {
      await addProject(payload);
      setIsAddingProject(false);
    }
  };

  const openEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription || '',
      problem: p.problem || '',
      solution: p.solution || '',
      challenges: p.challenges || '',
      image: p.image || '',
      category: p.category,
      technologies: p.technologies.join(', '),
      features: p.features.join(', '),
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      featured: p.featured
    });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSkill({
      name: skillForm.name.trim(),
      category: skillForm.category,
      level: skillForm.level,
      description: skillForm.description.trim(),
      icon: skillForm.icon
    });
    setIsAddingSkill(false);
    setSkillForm({
      name: '',
      category: 'Frontend',
      level: 'Comfortable',
      description: '',
      icon: 'Code2'
    });
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCertificate({
      name: certForm.name.trim(),
      issuer: certForm.issuer.trim(),
      issueDate: certForm.issueDate.trim(),
      credentialUrl: certForm.credentialUrl.trim(),
      description: certForm.description.trim()
    });
    setIsAddingCert(false);
    setCertForm({
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      description: ''
    });
  };

  const handleSeed = async () => {
    try {
      await seedDatabase();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isAdmin ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Admin Management Portal</span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Verified
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {isAdmin
                  ? `Authenticated: ${currentUser?.email || 'Authorized Administrator'}`
                  : 'Secure access required for modifying live portfolio data'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={logout}
                title="Sign out of Admin"
                className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close admin modal"
              className="w-9 h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700/80 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Auth Barrier if not logged in */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <Key className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Authentication
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sign in with Google using an authorized administrator account or enter development passcode.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                {authError}
              </div>
            )}

            <div className="space-y-3">
              {/* Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-cyan-500 flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isSigningIn ? 'Signing In...' : 'Sign In with Google'}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-white dark:bg-slate-900 px-2">
                  Or use developer passcode
                </div>
              </div>

              {/* Passcode Input */}
              <form onSubmit={handlePasscodeLogin} className="flex gap-2">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. amit2026)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95"
                >
                  Unlock
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-6 gap-2 overflow-x-auto">
              {[
                { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
                { id: 'skills', label: `Skills (${skills.length})`, icon: Layers },
                { id: 'education', label: `Education & Certs`, icon: BookOpen },
                { id: 'messages', label: `Inquiries (${messages.length})`, icon: Mail },
                { id: 'profile', label: 'Profile Photo', icon: ImageIcon },
                { id: 'database', label: `Database & Seed`, icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-cyan-500 text-cyan-500 font-semibold'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Manage Projects
                      </h4>
                      <p className="text-xs text-slate-500">
                        Add, modify or delete projects shown in the portfolio.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          title: '',
                          slug: '',
                          description: '',
                          longDescription: '',
                          problem: '',
                          solution: '',
                          challenges: '',
                          image: '/images/project-portfolio.svg',
                          category: 'Frontend',
                          technologies: 'HTML5, CSS3, JavaScript',
                          features: 'Responsive Layout',
                          githubUrl: 'https://github.com/placeholder',
                          liveUrl: '#',
                          featured: true
                        });
                        setIsAddingProject(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {/* Project Form Modal / Drawer */}
                  {(isAddingProject || editingProject) && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                          {editingProject ? 'Edit Project' : 'New Project'}
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProject(null);
                          }}
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Title</label>
                            <input
                              type="text"
                              required
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
                            <select
                              value={projectForm.category}
                              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="Frontend">Frontend</option>
                              <option value="Full Stack">Full Stack</option>
                              <option value="JavaScript">JavaScript</option>
                              <option value="Java">Java</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Short Description</label>
                          <textarea
                            rows={2}
                            required
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Image URL / Path</label>
                            <input
                              type="text"
                              value={projectForm.image}
                              onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Technologies (comma separated)</label>
                            <input
                              type="text"
                              value={projectForm.technologies}
                              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">GitHub URL</label>
                            <input
                              type="text"
                              value={projectForm.githubUrl}
                              onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Live Demo URL</label>
                            <input
                              type="text"
                              value={projectForm.liveUrl}
                              onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="proj-featured"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            className="rounded text-cyan-500"
                          />
                          <label htmlFor="proj-featured" className="text-xs text-slate-300">
                            Mark as Featured Project
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            Save Project to Firestore
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of existing projects */}
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.image || '/images/project-portfolio.svg'}
                            alt={proj.title}
                            className="w-12 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {proj.title}
                              </h5>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-cyan-400">
                                {proj.category}
                              </span>
                              {proj.featured && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {proj.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditProject(proj)}
                            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProject(proj.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Manage Skills
                      </h4>
                      <p className="text-xs text-slate-500">
                        Maintain verified skills and learning roadmap items.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(!isAddingSkill)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  {isAddingSkill && (
                    <form onSubmit={handleSaveSkill} className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Skill Name (e.g. Next.js)"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                        <select
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Programming">Programming</option>
                          <option value="Tools">Tools</option>
                          <option value="Currently Learning">Currently Learning</option>
                        </select>
                        <select
                          value={skillForm.level}
                          onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value as any })}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          <option value="Comfortable">Comfortable</option>
                          <option value="Learning">Learning</option>
                          <option value="Currently Exploring">Currently Exploring</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Short Description"
                        value={skillForm.description}
                        onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                        >
                          Save Skill
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skills.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{s.name}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                              {s.level}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{s.category}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteSkill(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EDUCATION & CERTIFICATES */}
              {activeTab === 'education' && (
                <div className="space-y-8">
                  {/* Education info */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      Education Records
                    </h4>
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-mono text-slate-400">College / Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-slate-400">Duration</label>
                            <input
                              type="text"
                              value={edu.duration}
                              onChange={(e) => updateEducation(edu.id, { duration: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-400">Degree &amp; Field</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certificates */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Certificates
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingCert(!isAddingCert)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certificate</span>
                      </button>
                    </div>

                    {isAddingCert && (
                      <form onSubmit={handleSaveCert} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 mb-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Certificate Name"
                            value={certForm.name}
                            onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Issuing Org (e.g. Coursera, HackerRank)"
                            value={certForm.issuer}
                            onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Issue Date"
                            value={certForm.issueDate}
                            onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Credential Verification URL"
                            value={certForm.credentialUrl}
                            onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            Save Certificate
                          </button>
                        </div>
                      </form>
                    )}

                    {certificates.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No certificates added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {certificates.map((c) => (
                          <div key={c.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">{c.name}</p>
                              <p className="text-[11px] text-cyan-400">{c.issuer}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteCertificate(c.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Inbound Contact Messages
                      </h4>
                      <p className="text-xs text-slate-500">
                        Live submissions received through the portfolio contact form.
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {messages.filter(m => m.status === 'NEW').length} New
                    </span>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                      <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No contact submissions received yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl border transition-all ${
                            msg.status === 'NEW'
                              ? 'bg-cyan-500/5 border-cyan-500/40'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{msg.name}</span>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-xs text-cyan-400 hover:underline font-mono"
                              >
                                {msg.email}
                              </a>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                msg.status === 'NEW'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : msg.status === 'READ'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {msg.status}
                              </span>

                              {msg.createdAt && (
                                <span className="text-[10px] font-mono text-slate-500">
                                  {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-slate-300 mb-1">
                            Subject: {msg.subject}
                          </div>

                          <p className="text-xs text-slate-400 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                            {msg.message}
                          </p>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                            <div className="flex gap-2">
                              {msg.status !== 'READ' && (
                                <button
                                  type="button"
                                  onClick={() => updateMessageStatus(msg.id, 'READ')}
                                  className="text-[11px] text-slate-400 hover:text-white"
                                >
                                  Mark as Read
                                </button>
                              )}
                              {msg.status !== 'REPLIED' && (
                                <button
                                  type="button"
                                  onClick={() => updateMessageStatus(msg.id, 'REPLIED')}
                                  className="text-[11px] text-emerald-400 hover:underline"
                                >
                                  Mark as Replied
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteMessage(msg.id)}
                              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PROFILE PHOTO */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Profile Image Configuration
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure your hero portrait image path, upload directly, or review Vercel deployment paths.
                    </p>
                  </div>

                  {photoSaveNotice && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{photoSaveNotice}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Live Preview */}
                    <div className="md:col-span-5 flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-mono text-slate-400 mb-3">Live Presentation Preview</div>
                      <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-950">
                        <ProfileImage
                          alt="Amit Kumar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-center text-slate-500 dark:text-slate-400 break-all px-2">
                        Active: <span className="text-cyan-400">{profilePhoto}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Upload Directly from Device */}
                      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Upload className="w-4 h-4 text-cyan-400" />
                          <span>Option 1: Upload from Computer (Instant Base64)</span>
                        </label>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Embeds your photo directly into persistent browser storage so it works everywhere without waiting for builds.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setProfilePhoto(reader.result);
                                  setPhotoSaveNotice('Profile photo uploaded and applied successfully!');
                                  setTimeout(() => setPhotoSaveNotice(''), 4000);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
                        />
                      </div>

                      {/* Set Relative or Custom Path */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                        <label className="text-xs font-bold text-slate-900 dark:text-white block">
                          Option 2: Relative Asset Path for Vercel
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={photoUrlInput}
                            onChange={(e) => setPhotoUrlInput(e.target.value)}
                            placeholder="/profile.jpg"
                            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (photoUrlInput.trim()) {
                                setProfilePhoto(photoUrlInput.trim());
                                setPhotoSaveNotice(`Photo path set to "${photoUrlInput.trim()}"!`);
                                setTimeout(() => setPhotoSaveNotice(''), 4000);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Quick Presets:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: '/profile.jpg (Standard)', val: '/profile.jpg' },
                              { label: '/IMG_20231108_191858_290.webp', val: '/IMG_20231108_191858_290.webp' },
                              { label: '/images/profile.jpg', val: '/images/profile.jpg' },
                              { label: 'Vector Placeholder SVG', val: '/images/profile-placeholder.svg' },
                            ].map((preset) => (
                              <button
                                key={preset.val}
                                type="button"
                                onClick={() => {
                                  setPhotoUrlInput(preset.val);
                                  setProfilePhoto(preset.val);
                                  setPhotoSaveNotice(`Switched photo source to: ${preset.val}`);
                                  setTimeout(() => setPhotoSaveNotice(''), 4000);
                                }}
                                className="px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-400 border border-slate-300 dark:border-slate-700 transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vercel Folder Structure Guide */}
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                    <h5 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-mono">
                      <span>Vercel Directory &amp; Case Sensitivity Guide</span>
                    </h5>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>
                        <strong>Place file in <code className="text-cyan-400 font-mono">public/</code>:</strong> Files in Vite's <code className="text-cyan-400 font-mono">public/</code> directory are copied to the root of the build during deployment.
                      </li>
                      <li>
                        <strong>Exact Case Sensitivity:</strong> Vercel runs on Linux servers. A file named <code className="text-cyan-400 font-mono">profile.jpg</code> must match exactly. If named <code className="text-cyan-400 font-mono">Profile.JPG</code>, Linux treats it as a different file.
                      </li>
                      <li>
                        <strong>Relative Paths:</strong> Always reference assets with <code className="text-cyan-400 font-mono">/profile.jpg</code> or <code className="text-cyan-400 font-mono">./profile.jpg</code> rather than full local system paths.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 5: DATABASE & SEED */}
              {activeTab === 'database' && (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Firestore Database Management
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sync and populate initial starter projects and skills to your live Firebase collection.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">Seed Default Portfolio Records</h5>
                        <p className="text-xs text-slate-400">
                          Populates Projects, Skills, and Education into Firestore.
                        </p>
                      </div>
                    </div>

                    {seedSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Database seeded successfully! Your Firestore is populated.</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSeed}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
                    >
                      Run 1-Click Database Seed
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-400 leading-relaxed font-mono">
                    Backend Connection: Google Cloud Firestore (Enterprise Edition)
                    <br />
                    Rules: Hardened 8-Pillar ABAC Security Active
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
