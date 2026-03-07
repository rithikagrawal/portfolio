export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github?: string;
  demo?: string;
  image: string;
  featured: boolean;
  category: 'fullstack' | 'backend' | 'ml' | 'devops';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  icon: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tech: string[];
  current: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
