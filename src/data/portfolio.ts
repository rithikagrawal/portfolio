export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: 'Full Stack' | 'Backend' | 'DevOps' | 'AI / NLP';
  summary: string;
  description: string[];
  techStack: string[];
  stats?: { label: string; value: string }[];
  github?: string;
  demo?: string;
  featured: boolean;
  filename: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  summary: string;
  highlights: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  filename: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: number; experience: string }[];
}

export interface PortfolioData {
  personal: {
    name: string;
    handle: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    uptime: string;
    shortBio: string;
    aboutMarkdown: string;
  };
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  architecturePractices: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    period: string;
    location: string;
  };
}

export const PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: 'Rithik Agrawal',
    handle: 'rithik',
    title: 'Senior Software Engineer',
    email: 'rithikagrawal40@gmail.com',
    phone: '+91-9644389795',
    location: 'Pune, India',
    github: 'https://github.com/rithik-agrawal',
    linkedin: 'https://linkedin.com/in/rithik-agrawal',
    twitter: 'https://twitter.com/rithik_agrawal_',
    website: 'https://rithik.us.cc',
    uptime: '5+ years in production',
    shortBio: 'Senior Software Engineer with 5 years of experience architecting resilient backend microservices, full-stack web platforms, and automated CI/CD pipelines in fintech and telecom domains.',
    aboutMarkdown: `
# Rithik Agrawal — Senior Software Engineer
--------------------------------------------------------------
Location : Pune, India
Status   : [● AVAILABLE FOR IMPACTFUL ROLES]
Focus    : Distributed Backend Systems, Scalable Cloud Architecture & High-Performance Full-Stack Applications

## Overview
Results-driven Senior Software Engineer with 5 years of specialized
experience designing, scaling, and maintaining distributed microservices
and enterprise web architectures.

Proven engineering track record:
  • Slashed P95 database query latency by 35% across high-load transaction systems
  • Cut build-to-deployment cycles by 50% via automated containerized blue-green pipelines
  • Engineered services powering 15M+ active users on JioMeet video collaboration
  • Delivered mission-critical financial backend systems across 30+ countries
`,
  },

  experiences: [
    {
      id: 'power-financial',
      company: 'Power Financial Wellness Inc',
      role: 'Senior Software Developer',
      period: '2022-08 — Present',
      location: 'Pune, India',
      current: true,
      filename: 'power-financial.md',
      summary: 'Architected and deployed distributed backend microservices powering financial wellness platforms for international banking clients across 30+ countries.',
      highlights: [
        'Architected distributed backend microservices in Python (Flask/FastAPI), orchestrating asynchronous event workflows with 99.99% service availability for 50,000+ monthly active users.',
        'Engineered 25+ mission-critical RESTful APIs with JWT authentication, granular RBAC, Redis token-bucket rate limiting, and Pydantic validation schemas, mitigating unauthorized access attempts by 100%.',
        'Spearheaded PostgreSQL schema architecture with B-Tree composite indexing, partial indexes, and partitioning, slashing P95 query latency by 35% across high-volume transaction tables.',
        'Authored High-Level Design (HLD) & Low-Level Design (LLD) architectural specifications for multi-tenant SaaS modules adopted across 3 cross-functional engineering pods.',
        'Constructed modular, reactive frontends in Angular 15+, TypeScript, and RxJS, elevating component reuse across platforms by 40% and reducing defects by 30%.',
        'Automated CI/CD deployment pipelines using Docker and Jenkins with blue-green releases, reducing build-to-deployment time by 50% with zero downtime.',
        'Instituted Test-Driven Development (TDD) protocols using PyTest, elevating backend test coverage from 55% to 85%+.',
      ],
      techStack: ['Python', 'Flask', 'FastAPI', 'PostgreSQL', 'Angular', 'TypeScript', 'Redis', 'Docker', 'Jenkins', 'PyTest', 'AWS S3', 'REST APIs'],
      metrics: [
        { label: 'Query Latency (P95)', value: '-35%' },
        { label: 'Service Availability', value: '99.99%' },
        { label: 'Deployment Time', value: '-50%' },
        { label: 'Code Coverage', value: '85%+' },
        { label: 'Global Reach', value: '30+ Countries' },
      ],
    },
    {
      id: 'jio-platforms',
      company: 'Jio Platforms Limited',
      role: 'Software Engineer (Team Lead)',
      period: '2021-08 — 2022-08',
      location: 'Mumbai, India',
      current: false,
      filename: 'jio-platforms.md',
      summary: 'Led a 20+ engineer pod engineering real-time backend microservices and client interfaces for JioMeet, India’s premier video collaboration platform.',
      highlights: [
        'Engineered resilient backend services and interactive frontend interfaces for JioMeet, serving 15M+ active users and managing real-time meeting session states.',
        'Designed and deployed centralized OAuth 2.0 identity federation and SSO workflows, safeguarding cross-service session validation for millions of concurrent connections.',
        'Automated database schema evolution and transactional data migrations using Alembic across PostgreSQL clusters, preventing schema drift with zero downtime.',
        'Standardized reusable micro-frontend widgets and REST service wrappers, cutting code duplication by 30% and accelerating sprint feature delivery across a 20-engineer squad.',
        'Enhanced system reliability and reduced production incident volume by 25% by enforcing PyTest regression suites and daily peer code reviews.',
        'Honored with the prestigious Spotlight Award for outstanding technical contributions to the JioMeet ecosystem.',
      ],
      techStack: ['Python', 'Flask', 'Angular', 'TypeScript', 'PostgreSQL', 'OAuth 2.0', 'Microservices', 'Alembic', 'Docker', 'PyTest'],
      metrics: [
        { label: 'Active Users', value: '15M+' },
        { label: 'Engineers Led', value: '20+' },
        { label: 'Code Duplication', value: '-30%' },
        { label: 'Production Incidents', value: '-25%' },
        { label: 'Award', value: 'Spotlight Award' },
      ],
    },
  ],

  projects: [
    {
      id: 'neural-commerce',
      slug: 'neural-commerce',
      title: 'Neural Commerce Platform',
      category: 'Full Stack',
      filename: 'neural-commerce.md',
      summary: 'AI-driven high-throughput commerce platform with real-time vector recommendation engine, dynamic pricing, and microservices architecture.',
      description: [
        'Architected an end-to-end e-commerce platform processing 100k+ daily transactions with real-time personalization algorithms.',
        'Engineered high-performance REST and gRPC microservices in Python (FastAPI) backed by PostgreSQL and Redis caches.',
        'Integrated machine learning models for real-time inventory forecasting and dynamic pricing optimization.',
        'Containerized multi-service topology using Docker and orchestrated automated deployments with Kubernetes and CI/CD pipelines.',
      ],
      techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'React', 'TensorFlow', 'Docker', 'Kubernetes'],
      stats: [
        { label: 'Daily TX', value: '100k+' },
        { label: 'Latency', value: '<45ms' },
        { label: 'Uptime', value: '99.98%' },
      ],
      github: 'https://github.com/rithik-agrawal',
      demo: 'https://github.com/rithik-agrawal',
      featured: true,
    },
    {
      id: 'datastream-pipeline',
      slug: 'datastream-pipeline',
      title: 'DataStream Pipeline',
      category: 'Backend',
      filename: 'datastream-pipeline.md',
      summary: 'Distributed real-time streaming pipeline processing high-velocity event telemetry at petabyte scale with automated anomaly detection.',
      description: [
        'Built high-throughput data processing pipeline handling millions of events per second with Apache Kafka and custom stream consumer workers.',
        'Implemented windowed analytical aggregation using Apache Spark streaming into ClickHouse analytical columnar storage.',
        'Deployed Grafana real-time observability telemetry with automated alert thresholds for infrastructure anomalies.',
      ],
      techStack: ['Python', 'Apache Kafka', 'Apache Spark', 'ClickHouse', 'Grafana', 'Docker'],
      stats: [
        { label: 'Throughput', value: '1.2M evt/s' },
        { label: 'Scale', value: 'Petabyte' },
        { label: 'Storage', value: 'ClickHouse' },
      ],
      github: 'https://github.com/rithik-agrawal',
      featured: true,
    },
    {
      id: 'cloudorch',
      slug: 'cloudorch',
      title: 'CloudOrch DevOps Suite',
      category: 'DevOps',
      filename: 'cloudorch.md',
      summary: 'Kubernetes-native CI/CD orchestration and GitOps automation platform with automated canary deployment validation.',
      description: [
        'Developed GitOps deployment controller coordinating multi-cluster Kubernetes rollouts with automated health checks and instant rollback.',
        'Implemented Prometheus-based metric gates to automatically evaluate canary releases prior to full production promotion.',
        'Reduced deployment manual verification time from 45 minutes to under 2 minutes.',
      ],
      techStack: ['Go', 'Kubernetes', 'Helm', 'ArgoCD', 'Prometheus', 'Terraform', 'TypeScript'],
      stats: [
        { label: 'Canary Verification', value: '2 min' },
        { label: 'Infra Automation', value: '100% IaC' },
      ],
      github: 'https://github.com/rithik-agrawal',
      featured: true,
    },
    {
      id: 'sentiment-ai',
      slug: 'sentiment-ai',
      title: 'SentimentAI Analytics Engine',
      category: 'AI / NLP',
      filename: 'sentiment-ai.md',
      summary: 'Transformer-based NLP analytics pipeline extracting real-time brand sentiment, topic extraction, and predictive trend anomalies.',
      description: [
        'Tuned transformer models for multi-lingual social media and news feed ingestion pipelines.',
        'Built scalable FastAPI microservices with Elasticsearch full-text indexation for sub-second semantic search queries.',
        'Constructed interactive analytical dashboards visualizing cross-platform sentiment trends.',
      ],
      techStack: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Elasticsearch', 'React'],
      stats: [
        { label: 'Inference', value: '18ms' },
        { label: 'Accuracy', value: '94.2%' },
      ],
      github: 'https://github.com/rithik-agrawal',
      featured: false,
    },
    {
      id: 'authvault',
      slug: 'authvault',
      title: 'AuthVault Zero-Trust Identity',
      category: 'Backend',
      filename: 'authvault.md',
      summary: 'Zero-trust enterprise authentication system supporting FIDO2, WebAuthn passkeys, and behavioral anomaly heuristics.',
      description: [
        'Engineered enterprise auth server supporting passwordless FIDO2 WebAuthn credentials and short-lived scoped JWT access tokens.',
        'Implemented Redis token-bucket rate limiter and IP reputation heuristics protecting against credential stuffing attacks.',
        'Architected comprehensive tamper-evident audit logging for SOC2 / ISO-27001 compliance verification.',
      ],
      techStack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'WebAuthn', 'Docker'],
      stats: [
        { label: 'Auth Protocols', value: 'FIDO2 / JWT' },
        { label: 'Protection', value: 'Zero-Trust' },
      ],
      github: 'https://github.com/rithik-agrawal',
      featured: false,
    },
    {
      id: 'financeflow',
      slug: 'financeflow',
      title: 'FinanceFlow Smart Engine',
      category: 'Full Stack',
      filename: 'financeflow.md',
      summary: 'Full-stack financial ledger and predictive budgeting platform with bank API synchronization and ML expense categorization.',
      description: [
        'Developed reactive financial dashboard featuring automated transaction sync, recurring subscription detection, and budget burn-down forecasts.',
        'Built scikit-learn classification pipeline achieving 96% accuracy on multi-currency expense auto-categorization.',
        'Integrated bank connector webhooks with guaranteed idempotent processing guarantees.',
      ],
      techStack: ['Angular', 'Python', 'FastAPI', 'PostgreSQL', 'scikit-learn', 'Docker'],
      stats: [
        { label: 'Categorization', value: '96% Acc' },
        { label: 'Sync Latency', value: '<2s' },
      ],
      github: 'https://github.com/rithik-agrawal',
      featured: false,
    },
  ],

  skills: [
    {
      category: 'Languages',
      skills: [
        { name: 'Python', level: 98, experience: '5.0 yrs' },
        { name: 'TypeScript', level: 92, experience: '3.5 yrs' },
        { name: 'JavaScript', level: 92, experience: '4.0 yrs' },
        { name: 'SQL', level: 95, experience: '5.0 yrs' },
        { name: 'Go', level: 75, experience: '2.0 yrs' },
        { name: 'HTML5 / CSS3', level: 90, experience: '4.0 yrs' },
      ],
    },
    {
      category: 'Frameworks & Frontend',
      skills: [
        { name: 'Flask', level: 96, experience: '4.5 yrs' },
        { name: 'FastAPI', level: 92, experience: '3.0 yrs' },
        { name: 'Angular (15-18)', level: 94, experience: '4.0 yrs' },
        { name: 'React / Next.js', level: 90, experience: '3.0 yrs' },
        { name: 'RxJS', level: 90, experience: '3.0 yrs' },
        { name: 'Tailwind CSS', level: 92, experience: '3.0 yrs' },
      ],
    },
    {
      category: 'Databases & Caching',
      skills: [
        { name: 'PostgreSQL', level: 96, experience: '5.0 yrs' },
        { name: 'Redis', level: 90, experience: '3.0 yrs' },
        { name: 'ClickHouse', level: 78, experience: '1.5 yrs' },
        { name: 'MongoDB', level: 82, experience: '2.5 yrs' },
        { name: 'Elasticsearch', level: 80, experience: '2.0 yrs' },
      ],
    },
    {
      category: 'Cloud, DevOps & Infra',
      skills: [
        { name: 'Docker', level: 94, experience: '4.0 yrs' },
        { name: 'Kubernetes', level: 85, experience: '2.5 yrs' },
        { name: 'AWS (EC2, S3, RDS)', level: 88, experience: '3.5 yrs' },
        { name: 'Jenkins CI/CD', level: 90, experience: '3.0 yrs' },
        { name: 'GitHub Actions', level: 90, experience: '3.0 yrs' },
        { name: 'Linux / Bash Scripting', level: 95, experience: '5.0 yrs' },
        { name: 'Nginx', level: 88, experience: '3.5 yrs' },
      ],
    },
    {
      category: 'Testing & Tools',
      skills: [
        { name: 'PyTest (TDD / BDD)', level: 95, experience: '4.0 yrs' },
        { name: 'Git / GitOps', level: 96, experience: '5.0 yrs' },
        { name: 'Alembic Migrations', level: 92, experience: '3.5 yrs' },
        { name: 'Swagger / OpenAPI', level: 94, experience: '4.0 yrs' },
        { name: 'Apache Kafka', level: 82, experience: '2.0 yrs' },
      ],
    },
  ],

  architecturePractices: [
    'Microservices Architecture & Distributed System Design',
    'High-Level (HLD) & Low-Level (LLD) Design Specs',
    'High-Volume RESTful API Engineering & Rate Limiting',
    'PostgreSQL Query Optimization, Partitioning & Composite Indexing',
    'Role-Based Access Control (RBAC), JWT & OAuth 2.0 Security',
    'Zero-Downtime Blue-Green Releases & Automated CI/CD Pipelines',
    'Test-Driven Development (TDD) with 85%+ Coverage Requirements',
    'Asynchronous Event Ingestion & Webhook Reliability',
  ],

  education: {
    institution: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Computer Science & Engineering',
    period: '2017 — 2021',
    location: 'Bhopal, India',
  },
};
