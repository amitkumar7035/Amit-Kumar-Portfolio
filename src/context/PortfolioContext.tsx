import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db, googleProvider, ADMIN_EMAIL, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Project,
  Skill,
  Education,
  Certificate,
  ContactMessage
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_EDUCATION,
  INITIAL_CERTIFICATES
} from '../lib/constants';

interface PortfolioContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: User | null;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithPasscode: (code: string) => boolean;
  profilePhoto: string;
  setProfilePhoto: (url: string) => void;
  projects: Project[];
  skills: Skill[];
  education: Education[];
  certificates: Certificate[];
  messages: ContactMessage[];
  loadingData: boolean;
  submitContactMessage: (data: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addEducation: (edu: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: string, edu: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  addCertificate: (cert: Omit<Certificate, 'id'>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  updateMessageStatus: (id: string, status: 'NEW' | 'READ' | 'REPLIED') => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme management
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('amit_portfolio_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('amit_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Profile Photo: checks uploaded image name first, then custom or default
  const [profilePhoto, setProfilePhotoState] = useState<string>(() => {
    return localStorage.getItem('amit_profile_photo') || '/IMG_20231108_191858_290.webp';
  });

  const setProfilePhoto = (url: string) => {
    setProfilePhotoState(url);
    localStorage.setItem('amit_profile_photo', url);
  };

  // Auth management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPasscodeAdmin, setIsPasscodeAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('amit_passcode_admin') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    isPasscodeAdmin ||
    (currentUser && currentUser.email === ADMIN_EMAIL)
  );

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsPasscodeAdmin(false);
      sessionStorage.removeItem('amit_passcode_admin');
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  const loginWithPasscode = (code: string): boolean => {
    if (code === 'admin123' || code === 'amit2026') {
      setIsPasscodeAdmin(true);
      sessionStorage.setItem('amit_passcode_admin', 'true');
      return true;
    }
    return false;
  };

  // State collections
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [education, setEducation] = useState<Education[]>(INITIAL_EDUCATION);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Firestore real-time sync
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 1. Projects listener
      const projQuery = query(collection(db, 'projects'));
      const unsubProjects = onSnapshot(
        projQuery,
        (snap) => {
          if (!snap.empty) {
            const list: Project[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Project);
            });
            list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            setProjects(list);
          } else {
            setProjects(INITIAL_PROJECTS);
          }
          setLoadingData(false);
        },
        (error) => {
          console.warn('Projects snapshot fallback to initial:', error.message);
          setProjects(INITIAL_PROJECTS);
          setLoadingData(false);
        }
      );
      unsubs.push(unsubProjects);

      // 2. Skills listener
      const skillQuery = query(collection(db, 'skills'));
      const unsubSkills = onSnapshot(
        skillQuery,
        (snap) => {
          if (!snap.empty) {
            const list: Skill[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Skill);
            });
            list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            setSkills(list);
          } else {
            setSkills(INITIAL_SKILLS);
          }
        },
        (error) => {
          console.warn('Skills snapshot fallback to initial:', error.message);
          setSkills(INITIAL_SKILLS);
        }
      );
      unsubs.push(unsubSkills);

      // 3. Education listener
      const eduQuery = query(collection(db, 'education'));
      const unsubEdu = onSnapshot(
        eduQuery,
        (snap) => {
          if (!snap.empty) {
            const list: Education[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Education);
            });
            list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            setEducation(list);
          } else {
            setEducation(INITIAL_EDUCATION);
          }
        },
        (error) => {
          console.warn('Education snapshot fallback:', error.message);
          setEducation(INITIAL_EDUCATION);
        }
      );
      unsubs.push(unsubEdu);

      // 4. Certificates listener
      const certQuery = query(collection(db, 'certificates'));
      const unsubCert = onSnapshot(
        certQuery,
        (snap) => {
          if (!snap.empty) {
            const list: Certificate[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Certificate);
            });
            setCertificates(list);
          } else {
            setCertificates(INITIAL_CERTIFICATES);
          }
        },
        (error) => {
          console.warn('Certificates snapshot fallback:', error.message);
          setCertificates(INITIAL_CERTIFICATES);
        }
      );
      unsubs.push(unsubCert);
    } catch (err) {
      console.error('Firestore listener init error:', err);
      setLoadingData(false);
    }

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, []);

  // Messages listener (only when admin is signed in)
  useEffect(() => {
    if (!isAdmin) {
      setMessages([]);
      return;
    }

    try {
      const msgQuery = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        msgQuery,
        (snap) => {
          const list: ContactMessage[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ContactMessage);
          });
          setMessages(list);
        },
        (error) => {
          console.warn('Messages listener error:', error.message);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Messages query error:', err);
    }
  }, [isAdmin]);

  // Contact Form Submission: Real Full-Stack with Firestore persistence
  const submitContactMessage = async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    // Generate valid ID
    const msgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const path = `contact_messages/${msgId}`;
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        status: 'NEW',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'contact_messages', msgId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Project CRUD
  const addProject = async (project: Omit<Project, 'id'>) => {
    const projId = 'proj-' + Date.now();
    const path = `projects/${projId}`;
    try {
      await setDoc(doc(db, 'projects', projId), {
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    const path = `projects/${id}`;
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...project,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteProject = async (id: string) => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Skill CRUD
  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    const skillId = 'skill-' + Date.now();
    const path = `skills/${skillId}`;
    try {
      await setDoc(doc(db, 'skills', skillId), skill);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateSkill = async (id: string, skill: Partial<Skill>) => {
    const path = `skills/${id}`;
    try {
      await updateDoc(doc(db, 'skills', id), skill);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteSkill = async (id: string) => {
    const path = `skills/${id}`;
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Education CRUD
  const addEducation = async (edu: Omit<Education, 'id'>) => {
    const eduId = 'edu-' + Date.now();
    const path = `education/${eduId}`;
    try {
      await setDoc(doc(db, 'education', eduId), edu);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateEducation = async (id: string, edu: Partial<Education>) => {
    const path = `education/${id}`;
    try {
      await updateDoc(doc(db, 'education', id), edu);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteEducation = async (id: string) => {
    const path = `education/${id}`;
    try {
      await deleteDoc(doc(db, 'education', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Certificate CRUD
  const addCertificate = async (cert: Omit<Certificate, 'id'>) => {
    const certId = 'cert-' + Date.now();
    const path = `certificates/${certId}`;
    try {
      await setDoc(doc(db, 'certificates', certId), {
        ...cert,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteCertificate = async (id: string) => {
    const path = `certificates/${id}`;
    try {
      await deleteDoc(doc(db, 'certificates', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Message Management
  const updateMessageStatus = async (id: string, status: 'NEW' | 'READ' | 'REPLIED') => {
    const path = `contact_messages/${id}`;
    try {
      await updateDoc(doc(db, 'contact_messages', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteMessage = async (id: string) => {
    const path = `contact_messages/${id}`;
    try {
      await deleteDoc(doc(db, 'contact_messages', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Seed default data to Firestore
  const seedDatabase = async () => {
    try {
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
      for (const s of INITIAL_SKILLS) {
        await setDoc(doc(db, 'skills', s.id), s);
      }
      for (const e of INITIAL_EDUCATION) {
        await setDoc(doc(db, 'education', e.id), e);
      }
    } catch (err) {
      console.error('Failed seeding database:', err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        isAdmin,
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
        loadingData,
        submitContactMessage,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        updateSkill,
        deleteSkill,
        addEducation,
        updateEducation,
        deleteEducation,
        addCertificate,
        deleteCertificate,
        updateMessageStatus,
        deleteMessage,
        seedDatabase
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
