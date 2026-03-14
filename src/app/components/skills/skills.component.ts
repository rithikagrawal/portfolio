import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Skill } from '../../models/portfolio.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);

  allSkills: Skill[] = [];
  categories = ['frontend', 'backend', 'database', 'devops', 'tools'];
  activeCategory = 'all';
  animatedBars = false;
  filterKey = 0;

  get filteredSkills(): Skill[] {
    if (this.activeCategory === 'all') return this.allSkills;
    return this.allSkills.filter(s => s.category === this.activeCategory);
  }

  ngOnInit(): void {
    this.allSkills = this.portfolioService.getSkills();
    // Trigger bar animations on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) this.animatedBars = true;
      });
    }, { threshold: 0.2 });
    setTimeout(() => {
      const el = document.querySelector('.skills-grid');
      if (el) observer.observe(el);
    }, 100);
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.animatedBars = false;
    this.filterKey++;

    setTimeout(() => {
      this.animatedBars = true;
      // Re-trigger reveal for newly rendered cards
      document.querySelectorAll('.skills-grid .reveal').forEach(el => {
        el.classList.add('visible'); // or whatever class your reveal uses
      });
    }, 50);
  }

  getBarColor(category: string): string {
    const colors: Record<string, string> = {
      frontend: 'linear-gradient(90deg, #00d4ff, #0ea5e9)',
      backend: 'linear-gradient(90deg, #7c3aed, #a855f7)',
      database: 'linear-gradient(90deg, #f59e0b, #f97316)',
      devops: 'linear-gradient(90deg, #22c55e, #10b981)',
      tools: 'linear-gradient(90deg, #ec4899, #f43f5e)',
    };
    return colors[category] || 'var(--gradient-accent)';
  }

  getCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      all: 'All', frontend: 'Frontend', backend: 'Backend',
      database: 'Database', devops: 'DevOps', tools: 'Tools & AI'
    };
    return labels[cat] || cat;
  }
}
