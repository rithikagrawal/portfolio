import { Injectable } from '@angular/core';
import { Project, Skill, Experience, SocialLink } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  getProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'Neural Commerce Platform',
        description: 'AI-powered e-commerce platform with real-time recommendations',
        longDescription: 'A full-stack platform leveraging machine learning for personalized product recommendations, dynamic pricing, and inventory forecasting. Built with microservices architecture handling 100k+ daily transactions.',
        tech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'React', 'TensorFlow', 'Docker', 'K8s'],
        github: 'https://github.com',
        demo: 'https://demo.example.com',
        image: 'neural-commerce',
        featured: true,
        category: 'fullstack'
      },
      {
        id: 2,
        title: 'DataStream Pipeline',
        description: 'Real-time data ingestion and processing at petabyte scale',
        longDescription: 'High-throughput data pipeline processing millions of events per second using Apache Kafka and custom stream processors. Includes anomaly detection and real-time dashboards.',
        tech: ['Python', 'Apache Kafka', 'Apache Spark', 'ClickHouse', 'Grafana', 'dbt'],
        github: 'https://github.com',
        image: 'datastream',
        featured: true,
        category: 'backend'
      },
      {
        id: 3,
        title: 'CloudOrch DevOps Suite',
        description: 'Kubernetes-native CI/CD orchestration and monitoring platform',
        longDescription: 'Enterprise DevOps platform providing GitOps workflows, automated canary deployments, and unified observability across multi-cloud environments.',
        tech: ['Go', 'Kubernetes', 'Helm', 'ArgoCD', 'Prometheus', 'Terraform', 'TypeScript'],
        github: 'https://github.com',
        demo: 'https://demo.example.com',
        image: 'cloudorch',
        featured: true,
        category: 'devops'
      },
      {
        id: 4,
        title: 'SentimentAI Analytics',
        description: 'NLP platform for real-time social media sentiment analysis',
        longDescription: 'Fine-tuned transformer models for multilingual sentiment analysis, topic modeling, and trend prediction. Processes Twitter, Reddit, and news feeds simultaneously.',
        tech: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Elasticsearch', 'React'],
        github: 'https://github.com',
        image: 'sentiment-ai',
        featured: false,
        category: 'ml'
      },
      {
        id: 5,
        title: 'AuthVault',
        description: 'Zero-trust authentication system with biometric support',
        longDescription: 'Enterprise-grade authentication platform supporting FIDO2, WebAuthn, and ML-based behavioral biometrics. SOC2 compliant with full audit logging.',
        tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'WebAuthn', 'JWT'],
        github: 'https://github.com',
        image: 'authvault',
        featured: false,
        category: 'backend'
      },
      {
        id: 6,
        title: 'FinanceFlow',
        description: 'Personal finance dashboard with ML-powered expense categorization',
        longDescription: 'Smart finance tracker with bank API integrations, ML expense categorization, budget forecasting, and investment portfolio analytics.',
        tech: ['Angular', 'Python', 'FastAPI', 'PostgreSQL', 'Plaid API', 'scikit-learn'],
        github: 'https://github.com',
        demo: 'https://demo.example.com',
        image: 'financeflow',
        featured: false,
        category: 'fullstack'
      }
    ];
  }

  getSkills(): Skill[] {
    return [
      // Frontend
      { name: 'Angular', level: 90, category: 'frontend', icon: 'fab fa-angular' },
      { name: 'React', level: 85, category: 'frontend', icon: 'fab fa-react' },
      { name: 'TypeScript', level: 92, category: 'frontend', icon: 'fas fa-code' },
      { name: 'CSS/SCSS', level: 88, category: 'frontend', icon: 'fab fa-css3-alt' },
      // Backend
      { name: 'Python', level: 95, category: 'backend', icon: 'fab fa-python' },
      { name: 'FastAPI', level: 90, category: 'backend', icon: 'fas fa-bolt' },
      { name: 'Node.js', level: 82, category: 'backend', icon: 'fab fa-node-js' },
      { name: 'Go', level: 70, category: 'backend', icon: 'fas fa-code' },
      // Database
      { name: 'PostgreSQL', level: 92, category: 'database', icon: 'fas fa-database' },
      { name: 'Redis', level: 85, category: 'database', icon: 'fas fa-database' },
      { name: 'MongoDB', level: 80, category: 'database', icon: 'fas fa-leaf' },
      { name: 'Elasticsearch', level: 78, category: 'database', icon: 'fas fa-search' },
      // DevOps
      { name: 'Docker', level: 90, category: 'devops', icon: 'fab fa-docker' },
      { name: 'Kubernetes', level: 82, category: 'devops', icon: 'fas fa-dharmachakra' },
      { name: 'AWS', level: 85, category: 'devops', icon: 'fab fa-aws' },
      { name: 'CI/CD', level: 88, category: 'devops', icon: 'fas fa-infinity' },
      // Tools
      { name: 'Git', level: 95, category: 'tools', icon: 'fab fa-git-alt' },
      { name: 'TensorFlow', level: 75, category: 'tools', icon: 'fas fa-brain' },
      { name: 'GraphQL', level: 80, category: 'tools', icon: 'fas fa-project-diagram' },
      { name: 'Linux', level: 90, category: 'tools', icon: 'fab fa-linux' },
    ];
  }

  getExperiences(): Experience[] {
    return [
      {
        company: 'NeuralTech Systems',
        role: 'Senior Full Stack Engineer',
        period: '2022 — Present',
        current: true,
        description: [
          'Architected and led development of a microservices platform serving 2M+ daily active users',
          'Reduced API response times by 65% through Redis caching and query optimization',
          'Mentored team of 6 engineers, establishing code review processes and engineering standards',
          'Introduced ML-powered features increasing user engagement metrics by 40%'
        ],
        tech: ['Python', 'FastAPI', 'Angular', 'PostgreSQL', 'K8s', 'AWS']
      },
      {
        company: 'DataFlow Labs',
        role: 'Backend Engineer',
        period: '2020 — 2022',
        current: false,
        description: [
          'Built real-time data processing pipelines handling 50M+ events/day using Apache Kafka',
          'Designed and implemented distributed caching layer reducing database load by 80%',
          'Contributed to open-source data tooling used by 500+ companies globally',
          'Collaborated with data science team to deploy ML models into production'
        ],
        tech: ['Python', 'Kafka', 'Spark', 'PostgreSQL', 'Docker']
      },
      {
        company: 'CloudBridge Inc',
        role: 'Software Engineer',
        period: '2018 — 2020',
        current: false,
        description: [
          'Developed RESTful APIs and microservices for SaaS CRM platform',
          'Migrated monolithic application to microservices reducing deployment time by 70%',
          'Implemented automated testing suite achieving 90% code coverage',
          'Participated in on-call rotation ensuring 99.9% uptime SLA'
        ],
        tech: ['Python', 'Node.js', 'React', 'MongoDB', 'AWS']
      },
      {
        company: 'TechStart Studio',
        role: 'Junior Developer',
        period: '2016 — 2018',
        current: false,
        description: [
          'Full-stack development for startup clients across fintech and healthcare verticals',
          'Built responsive web applications reaching 100k+ users',
          'Integrated third-party APIs including payment gateways and mapping services',
          'Gained experience in agile methodologies and rapid iteration'
        ],
        tech: ['JavaScript', 'Python', 'Django', 'MySQL', 'React']
      }
    ];
  }

  getSocialLinks(): SocialLink[] {
    return [
      { name: 'GitHub', url: 'https://github.com/rithikagrawal', icon: 'fab fa-github' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/rithik-agrawal', icon: 'fab fa-linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/rithik', icon: 'fab fa-twitter' },
      // { name: 'Dev.to', url: 'https://dev.to/alexchen', icon: 'fab fa-dev' },
    ];
  }
}
