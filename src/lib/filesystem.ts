import { PORTFOLIO_DATA } from '@/data/portfolio';

export type FileType = 'file' | 'dir' | 'executable' | 'link';

export interface FSNode {
  name: string;
  type: FileType;
  path: string;
  size?: number;
  permissions?: string;
  updatedAt?: string;
  content?: string;
  target?: string; // For symlinks or action URLs
  children?: Record<string, FSNode>;
}

const formatExperienceMarkdown = (exp: typeof PORTFOLIO_DATA.experiences[0]) => `
# ${exp.role} @ ${exp.company}
--------------------------------------------------------------
Period   : ${exp.period}
Location : ${exp.location}
Status   : ${exp.current ? '[● ACTIVE PRODUCTION ROLE]' : '[PREVIOUS PRODUCTION ROLE]'}

## Overview
${exp.summary}

## Key Engineering Achievements
${exp.highlights.map((h) => `  • ${h}`).join('\n')}

## Tech Stack
  ${exp.techStack.join('  •  ')}

## Key Production Metrics
${exp.metrics.map((m) => `  ${m.label.padEnd(25)} : ${m.value}`).join('\n')}
`;

const formatProjectMarkdown = (proj: typeof PORTFOLIO_DATA.projects[0]) => `
# ${proj.title}
--------------------------------------------------------------
Category : ${proj.category}
Featured : ${proj.featured ? 'Yes (Primary Showcase)' : 'Yes'}
GitHub   : ${proj.github || 'Confidential Enterprise Repo'}
Demo     : ${proj.demo || 'Internal Microservice Demo'}

## Summary
${proj.summary}

## Architecture & Implementation Details
${proj.description.map((d) => `  • ${d}`).join('\n')}

## Core Technologies
  ${proj.techStack.join('  •  ')}

${proj.stats ? `## Verified Performance Stats\n${proj.stats.map((s) => `  ${s.label.padEnd(20)} : ${s.value}`).join('\n')}` : ''}
`;

export const buildVirtualFilesystem = (): FSNode => {
  const root: FSNode = {
    name: '~',
    type: 'dir',
    path: '/home/rithik',
    permissions: 'drwxr-xr-x',
    children: {
      '.profile': {
        name: '.profile',
        type: 'file',
        path: '/home/rithik/.profile',
        size: 890,
        permissions: '-rw-r--r--',
        updatedAt: 'Sep 26 01:00',
        content: `export USER="rithik"\nexport ROLE="${PORTFOLIO_DATA.personal.title}"\nexport SHELL="/bin/amber-bash"\nexport UPTIME="${PORTFOLIO_DATA.personal.uptime}"\nexport LOCATION="${PORTFOLIO_DATA.personal.location}"\nexport GITHUB="${PORTFOLIO_DATA.personal.github}"\nexport LINKEDIN="${PORTFOLIO_DATA.personal.linkedin}"\n`,
      },
      'about.md': {
        name: 'about.md',
        type: 'file',
        path: '/home/rithik/about.md',
        size: 2048,
        permissions: '-rw-r--r--',
        updatedAt: 'Sep 26 01:10',
        content: PORTFOLIO_DATA.personal.aboutMarkdown,
      },
      'resume.pdf': {
        name: 'resume.pdf',
        type: 'file',
        path: '/home/rithik/resume.pdf',
        size: 44361,
        permissions: '-rw-r--r--',
        updatedAt: 'Sep 25 18:14',
        content: '[BINARY DOCUMENT: master_resume.pdf. Use `open resume` to view or download.]',
      },
      'experience': {
        name: 'experience',
        type: 'dir',
        path: '/home/rithik/experience',
        permissions: 'drwxr-xr-x',
        children: {
          'power-financial.md': {
            name: 'power-financial.md',
            type: 'file',
            path: '/home/rithik/experience/power-financial.md',
            size: 3200,
            permissions: '-rw-r--r--',
            updatedAt: 'Sep 25 18:00',
            content: formatExperienceMarkdown(PORTFOLIO_DATA.experiences[0]),
          },
          'jio-platforms.md': {
            name: 'jio-platforms.md',
            type: 'file',
            path: '/home/rithik/experience/jio-platforms.md',
            size: 2800,
            permissions: '-rw-r--r--',
            updatedAt: 'Aug 15 2022',
            content: formatExperienceMarkdown(PORTFOLIO_DATA.experiences[1]),
          },
        },
      },
      'projects': {
        name: 'projects',
        type: 'dir',
        path: '/home/rithik/projects',
        permissions: 'drwxr-xr-x',
        children: Object.fromEntries(
          PORTFOLIO_DATA.projects.map((proj) => [
            proj.filename,
            {
              name: proj.filename,
              type: 'file',
              path: `/home/rithik/projects/${proj.filename}`,
              size: 1850,
              permissions: '-rw-r--r--',
              updatedAt: 'Sep 20 14:00',
              content: formatProjectMarkdown(proj),
            },
          ])
        ),
      },
      'skills': {
        name: 'skills',
        type: 'dir',
        path: '/home/rithik/skills',
        permissions: 'drwxr-xr-x',
        children: {
          'skills.json': {
            name: 'skills.json',
            type: 'file',
            path: '/home/rithik/skills/skills.json',
            size: 4120,
            permissions: '-rw-r--r--',
            updatedAt: 'Sep 24 10:00',
            content: JSON.stringify(PORTFOLIO_DATA.skills, null, 2),
          },
          'architecture.txt': {
            name: 'architecture.txt',
            type: 'file',
            path: '/home/rithik/skills/architecture.txt',
            size: 1400,
            permissions: '-rw-r--r--',
            updatedAt: 'Sep 24 10:00',
            content: PORTFOLIO_DATA.architecturePractices.map((p, i) => `[0${i + 1}] ${p}`).join('\n'),
          },
        },
      },
      'contact': {
        name: 'contact',
        type: 'dir',
        path: '/home/rithik/contact',
        permissions: 'drwxr-xr-x',
        children: {
          'email.txt': {
            name: 'email.txt',
            type: 'file',
            path: '/home/rithik/contact/email.txt',
            size: 45,
            permissions: '-rw-r--r--',
            content: `${PORTFOLIO_DATA.personal.email}\nPhone: ${PORTFOLIO_DATA.personal.phone}\nType 'mail' to compose message.\n`,
          },
          'github.url': {
            name: 'github.url',
            type: 'link',
            path: '/home/rithik/contact/github.url',
            target: PORTFOLIO_DATA.personal.github,
            content: `URL=${PORTFOLIO_DATA.personal.github}\nType 'open github' to launch.\n`,
          },
          'linkedin.url': {
            name: 'linkedin.url',
            type: 'link',
            path: '/home/rithik/contact/linkedin.url',
            target: PORTFOLIO_DATA.personal.linkedin,
            content: `URL=${PORTFOLIO_DATA.personal.linkedin}\nType 'open linkedin' to launch.\n`,
          },
          'twitter.url': {
            name: 'twitter.url',
            type: 'link',
            path: '/home/rithik/contact/twitter.url',
            target: PORTFOLIO_DATA.personal.twitter,
            content: `URL=${PORTFOLIO_DATA.personal.twitter}\nType 'open twitter' to launch.\n`,
          },
        },
      },
      '.easter-eggs': {
        name: '.easter-eggs',
        type: 'dir',
        path: '/home/rithik/.easter-eggs',
        permissions: 'drwx------',
        children: {
          'matrix.sh': {
            name: 'matrix.sh',
            type: 'executable',
            path: '/home/rithik/.easter-eggs/matrix.sh',
            permissions: '-rwxr-xr-x',
            content: '#!/bin/bash\n# Run `matrix` command to enter the digital rain.\n',
          },
          'cowsay.sh': {
            name: 'cowsay.sh',
            type: 'executable',
            path: '/home/rithik/.easter-eggs/cowsay.sh',
            permissions: '-rwxr-xr-x',
            content: '#!/bin/bash\n# Usage: cowsay <message>\n',
          },
          'sudo.sh': {
            name: 'sudo.sh',
            type: 'executable',
            path: '/home/rithik/.easter-eggs/sudo.sh',
            permissions: '-rwxr-xr-x',
            content: '#!/bin/bash\n# Try `sudo hire-me`\n',
          },
        },
      },
    },
  };

  return root;
};

export const virtualFS = buildVirtualFilesystem();

// Normalize path: resolves `..`, `.`, `~`, `/home/rithik`
export const normalizePath = (current: string, target?: string): string => {
  if (!target || target === '~' || target === '') return '/home/rithik';
  if (target === '/') return '/home/rithik';

  let parts: string[];
  if (target.startsWith('/')) {
    parts = target.split('/').filter(Boolean);
  } else {
    parts = [...current.split('/').filter(Boolean), ...target.split('/').filter(Boolean)];
  }

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (resolved.length > 2) {
        resolved.pop();
      }
    } else {
      resolved.push(part);
    }
  }

  const result = '/' + resolved.join('/');
  return result.startsWith('/home/rithik') ? result : '/home/rithik';
};

// Retrieve a node at a given absolute path
export const getNodeByPath = (path: string): FSNode | null => {
  const norm = normalizePath(path);
  if (norm === '/home/rithik') return virtualFS;

  const segments = norm.replace('/home/rithik/', '').split('/').filter(Boolean);
  let current: FSNode = virtualFS;

  for (const segment of segments) {
    if (!current.children || !current.children[segment]) {
      return null;
    }
    current = current.children[segment];
  }

  return current;
};

// Write or update file at a given absolute path
export const writeFileToFS = (path: string, content: string): boolean => {
  const norm = normalizePath(path);
  const segments = norm.replace('/home/rithik/', '').split('/').filter(Boolean);
  if (segments.length === 0) return false;

  const fileName = segments.pop()!;
  let current: FSNode = virtualFS;

  for (const segment of segments) {
    if (!current.children) current.children = {};
    if (!current.children[segment]) {
      current.children[segment] = {
        name: segment,
        type: 'dir',
        path: current.path + '/' + segment,
        permissions: 'drwxr-xr-x',
        updatedAt: new Date().toISOString().split('T')[0],
        children: {},
      };
    }
    current = current.children[segment];
  }

  if (!current.children) current.children = {};
  current.children[fileName] = {
    name: fileName,
    type: 'file',
    path: norm,
    permissions: '-rw-r--r--',
    size: content.length,
    updatedAt: new Date().toISOString().split('T')[0],
    content,
  };

  return true;
};

export const generateTree = (node: FSNode, prefix = ''): string[] => {
  if (node.type !== 'dir' || !node.children) {
    return [prefix + node.name];
  }

  const lines: string[] = [];
  const entries = Object.values(node.children);

  entries.forEach((child, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    lines.push(prefix + connector + child.name + (child.type === 'dir' ? '/' : ''));

    if (child.type === 'dir' && child.children) {
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      lines.push(...generateTree(child, childPrefix));
    }
  });

  return lines;
};
