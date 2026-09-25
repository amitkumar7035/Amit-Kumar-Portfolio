export type SkillCategory = 'Frontend' | 'Programming' | 'Tools' | 'Currently Learning' | 'backend' | 'frontend' | 'languages' | 'tools' | string;
export type SkillLevel = 'Comfortable' | 'Learning' | 'Currently Exploring' | number | string;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
  icon?: string;
  order?: number;
}

export type ProjectCategory = 'All' | 'Frontend' | 'Full Stack' | 'JavaScript' | 'Java' | 'Other' | string;

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  longDescription?: string;
  problem?: string;
  solution?: string;
  challenges?: string;
  image: string;
  technologies: string[];
  features?: string[];
  category: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  duration?: string;
  period?: string;
  status?: string;
  description?: string;
  highlights?: string[];
  order?: number;
}

export interface Certificate {
  id: string;
  name?: string;
  title?: string;
  issuer: string;
  issueDate?: string;
  date?: string;
  credentialUrl?: string;
  previewUrl?: string;
  image?: string;
  description?: string;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'new' | 'read' | 'replied';
  createdAt?: string;
  date?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface SocialProfile {
  name: string;
  platform: 'github' | 'linkedin' | 'instagram' | 'facebook' | 'leetcode' | 'geeksforgeeks';
  handle: string;
  url: string;
  description: string;
  isPlaceholder?: boolean;
}
