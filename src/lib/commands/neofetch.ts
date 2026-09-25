import { PORTFOLIO_DATA } from '@/data/portfolio';

export const getNeofetchOutput = (): string => {
  return `
    ██████╗  ██╗████████╗██╗  ██╗██╗██╗  ██╗    OS        : PortfolioOS v2.0 (x86_64)
    ██╔══██╗ ██║╚══██╔══╝██║  ██║██║██║ ██╔╝    Host      : ${PORTFOLIO_DATA.personal.name}
    ██████╔╝ ██║   ██║   ███████║██║█████╔╝     Role      : ${PORTFOLIO_DATA.personal.title}
    ██╔══██╗ ██║   ██║   ██╔══██║██║██╔═██╗     Location  : ${PORTFOLIO_DATA.personal.location}
    ██║  ██║ ██║   ██║   ██║  ██║██║██║  ██╗    Uptime    : ${PORTFOLIO_DATA.personal.uptime}
    ╚═╝  ╚═╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝    Scale     : 15M+ Users (JioMeet) | 30+ Countries
                                                Shell     : amber-bash 5.2.21
                                                Kernel    : Linux 6.8.0-portfolio-arch
                                                Terminal  : 3D-CRT-v2.0 (Three.js/WebGL)
                                                Languages : Python, TypeScript, Go, SQL
                                                Backends  : Flask, FastAPI, REST, Microservices
                                                Frontends : Angular 15-18, React, Next.js
                                                Databases : PostgreSQL, Redis, ClickHouse
                                                DevOps    : Docker, K8s, AWS, Jenkins, CI/CD

    [████████][████████][████████][████████][████████][████████]
`;
};
