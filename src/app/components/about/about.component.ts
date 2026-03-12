import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  // Curated for a 5-YOE Senior Full-Stack Engineer
  techStack = [
    // Core & Frameworks
    'Python', 'TypeScript', 'Angular', 'Flask', 'FastAPI',
    // Advanced Frontend & State
    'RxJS', 'NgRx', 'WebSockets',
    // Event-Driven & Async
    'Apache Kafka', 'Celery', 'RabbitMQ',
    // Databases & Search
    'PostgreSQL', 'Redis', 'Elasticsearch', 'MongoDB',
    // Cloud, Infra & DevOps
    'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'
  ];
}
