import { PORTFOLIO_DATA } from '@/data/portfolio';

export interface AIResponse {
  topic: string;
  answer: string;
  relatedCommands: string[];
}

export function askRithikAI(query: string): AIResponse {
  const q = query.toLowerCase().trim();

  if (!q || q === 'help') {
    return {
      topic: 'AI Career Copilot Help',
      answer: `Hello! I am Rithik's in-terminal AI Career Copilot. You can ask me anything about his technical background, engineering decisions, scale metrics, or career history.

Try asking:
  • ask-rithik "How did you scale JioMeet to 15 million users?"
  • ask-rithik "What is your experience with FastAPI vs Flask?"
  • ask-rithik "How did you reduce P95 database latency by 35%?"
  • ask-rithik "Tell me about your work at Power Financial Wellness"
  • ask-rithik "Why should our engineering team hire you?"`,
      relatedCommands: ['recruiter', 'experience', 'projects', 'skills'],
    };
  }

  // 1. JioMeet / Scale / 15M
  if (q.includes('jiomeet') || q.includes('jio') || q.includes('15m') || q.includes('scale') || q.includes('concurrency')) {
    return {
      topic: 'JioMeet Real-Time Scaling (15M+ Users)',
      answer: `At Jio Platforms, Rithik was instrumental in architecting and scaling JioMeet's backend infrastructure to support over 15,000,000 active users:
1. Real-Time Signaling: Optimized WebRTC and WebSocket connection brokers with distributed Redis Pub/Sub, keeping signaling latency under 45ms.
2. Resilience Under Peak Load: Designed Kubernetes horizontal pod autoscaling (HPA) policies triggered by connection count rather than just CPU/Memory, preventing thundering herds during nationwide broadcasts.
3. Media Relay Health Monitoring: Implemented continuous automated health probing and fast-failover across distributed media servers to guarantee 99.99% meeting reliability.`,
      relatedCommands: ['arch jiomeet', 'experience', 'cat experience/jio-platforms.md'],
    };
  }

  // 2. Power Financial Wellness / Multi-region / 30+ countries
  if (q.includes('power') || q.includes('fintech') || q.includes('financial') || q.includes('countries') || q.includes('compliance')) {
    return {
      topic: 'Power Financial Wellness (30+ Countries)',
      answer: `At Power Financial Wellness, Rithik engineered global fintech microservices serving employees and enterprises across 30+ countries:
1. Multi-Region Architecture: Built asynchronous payment routing and ledger services using Python (FastAPI/Flask) and PostgreSQL with strict cross-border compliance.
2. High Consistency: Implemented two-phase commit patterns and idempotent financial transactions, eliminating double-spend and ledger discrepancies.
3. Automated CI/CD: Spearheaded automated testing and Dockerized deployment pipelines, cutting deployment cycle times by 50%.`,
      relatedCommands: ['arch power', 'experience', 'cat experience/power-financial.md'],
    };
  }

  // 3. Latency / Redis / Query Optimization
  if (q.includes('latency') || q.includes('p95') || q.includes('redis') || q.includes('postgres') || q.includes('optimize') || q.includes('query')) {
    return {
      topic: 'Database & Query Performance Optimization (-35% P95)',
      answer: `To achieve a -35% reduction in P95 database query latency:
1. Multi-Tiered Caching: Placed Redis in front of write-heavy and frequent read endpoints with cache-invalidation strategies (write-through + TTL jitter).
2. Query Plan Analysis: Audited slow queries via PostgreSQL EXPLAIN ANALYZE, re-indexing composite keys and eliminating N+1 ORM query bottlenecks.
3. Connection Pooling: Configured PgBouncer connection pooling to avoid PostgreSQL process spawning overhead under burst traffic.`,
      relatedCommands: ['skills', 'htop', 'projects'],
    };
  }

  // 4. Tech Stack / FastAPI / Python / Go / TypeScript
  if (q.includes('python') || q.includes('fastapi') || q.includes('flask') || q.includes('go') || q.includes('typescript') || q.includes('stack')) {
    return {
      topic: 'Core Engineering Tech Stack',
      answer: `Rithik is primarily a Backend & Distributed Systems Engineer with full-stack fluency:
• Languages: Python (Deep expertise in FastAPI, Flask, async I/O, Celery), TypeScript/JavaScript (Next.js, Node.js, React, Angular), Go (high-throughput microservices), SQL.
• Storage & Streaming: PostgreSQL, Redis, Apache Kafka, MongoDB, ClickHouse.
• Infrastructure: Docker, Kubernetes, AWS (EC2, S3, RDS, Lambda), GitHub Actions, Terraform.
• Philosophy: Code simplicity, strong domain typing, comprehensive unit/integration testing (pytest, Jest), and observability (Prometheus/Grafana).`,
      relatedCommands: ['skills', 'cd skills', 'recruiter'],
    };
  }

  // 5. Kafka / Event-Driven / Streaming
  if (q.includes('kafka') || q.includes('stream') || q.includes('event') || q.includes('queue') || q.includes('pubsub')) {
    return {
      topic: 'Event-Driven Architecture & Kafka Pipelines',
      answer: `Rithik has built large-scale event-driven streaming architectures:
• Apache Kafka Partitioning: Configured consumer groups with balanced partition keys to ensure strict ordering of transactional events while maximizing parallel consumption.
• Backpressure Management: Implemented rate-limiting, dead-letter queues (DLQ), and exponential retry logic to handle downstream service degradation without data loss.
• Real-time Analytics: Streamed telemetry from distributed edge workers into Kafka pipelines for real-time aggregation and anomaly detection.`,
      relatedCommands: ['cat projects/datastream-pipeline.md', 'arch', 'skills'],
    };
  }

  // 6. Why Hire / Strengths / Value
  if (q.includes('why') || q.includes('hire') || q.includes('strength') || q.includes('value') || q.includes('role')) {
    return {
      topic: 'Why Hire Rithik Agrawal?',
      answer: `Top 4 reasons Rithik stands out as a Senior Backend / Full Stack Engineer:
1. Battle-Tested at Massive Scale: He has designed and maintained systems handling 15M+ active users and international financial transactions across 30+ countries.
2. Obsessed with Quality & Latency: Proven track record of slashing P95 latency by 35% and enforcing 99.99% uptime with rigorous automated testing.
3. High Agency & Ownership: From architecting distributed backends to crafting polished 3D user experiences like this portfolio, he executes with exceptional speed and attention to detail.
4. Collaborative Leader: Experienced in mentoring junior engineers, writing clear architecture RFCs, and partnering seamlessly with product, design, and DevOps teams.`,
      relatedCommands: ['recruiter', 'open resume', 'cd contact'],
    };
  }

  // 7. Availability / Location / Contact
  if (q.includes('availab') || q.includes('hire') || q.includes('location') || q.includes('notice') || q.includes('salary') || q.includes('remote')) {
    return {
      topic: 'Availability & Logistics',
      answer: `• Location: Bengaluru, India (Open to high-caliber Remote positions worldwide, as well as relocation).
• Current Status: Actively evaluating Senior Backend, Distributed Systems, or Full Stack roles.
• Notice Period: Standard / negotiable based on role impact.
• Direct Contact: Email rithikagrawal14@gmail.com or use the terminal command 'cd contact' or 'mail'.`,
      relatedCommands: ['cd contact', 'open resume', 'mail'],
    };
  }

  // Fallback for general queries
  return {
    topic: 'Engineering Perspective',
    answer: `Regarding "${query}": Rithik approaches software engineering with a core focus on distributed system reliability, clean domain-driven architecture, and measurable business impact. With 4+ years of production experience spanning 15M+ users at Jio Platforms to international fintech scale at Power Financial Wellness, he is adept at dissecting complex challenges into robust, maintainable solutions.

Feel free to ask a more specific question, or inspect his verified projects and background with 'recruiter' or 'help'.`,
    relatedCommands: ['recruiter', 'projects', 'experience', 'skills'],
  };
}
