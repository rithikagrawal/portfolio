import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Project } from '../../models/portfolio.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);

  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  activeFilter = 'all';
  showAll = false;

  filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'fullstack', label: 'Full Stack' },
    { key: 'backend', label: 'Backend' },
    { key: 'ml', label: 'ML / AI' },
    { key: 'devops', label: 'DevOps' },
  ];

  ngOnInit(): void {
    this.allProjects = this.portfolioService.getProjects();
    this.applyFilter('all');
  }

  applyFilter(key: string): void {
  this.activeFilter = key;
  this.showAll = false;
  this.filteredProjects = key === 'all'
    ? [...this.allProjects]  // spread to force new array reference
    : [...this.allProjects.filter(p => p.category === key)];
}

  get displayedProjects(): Project[] {
    return this.showAll ? this.filteredProjects : this.filteredProjects.slice(0, 4);
  }

  getProjectGradient(category: string): string {
    const gradients: Record<string, string> = {
      fullstack: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
      backend: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.1))',
      ml: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))',
      devops: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))',
    };
    return gradients[category] || gradients['fullstack'];
  }
}
