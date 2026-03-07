import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChild('typewriterEl') typewriterEl!: ElementRef<HTMLSpanElement>;

  private portfolioService = inject(PortfolioService);
  socialLinks = this.portfolioService.getSocialLinks();

  roles = ['Full Stack Developer', 'Python Engineer', 'Cloud Architect', 'ML Enthusiast', 'Open Source Contributor'];
  currentRoleIndex = 0;
  displayText = '';
  isDeleting = false;
  typeSpeed = 100;

  stats = [
    { value: 8, label: 'Years Experience', suffix: '+' },
    { value: 50, label: 'Projects Shipped', suffix: '+' },
    { value: 12, label: 'Open Source Repos', suffix: '' },
    { value: 99, label: 'Uptime SLA', suffix: '%' },
  ];

  ngOnInit(): void {
    setTimeout(() => this.typeWriter(), 500);
  }

  ngAfterViewInit(): void {}

  scrollTo(anchor: string): void {
    const el = document.getElementById(anchor);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  private typeWriter(): void {
    const current = this.roles[this.currentRoleIndex];
    if (this.isDeleting) {
      this.displayText = current.substring(0, this.displayText.length - 1);
    } else {
      this.displayText = current.substring(0, this.displayText.length + 1);
    }

    let speed = this.isDeleting ? 50 : this.typeSpeed;

    if (!this.isDeleting && this.displayText === current) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.displayText === '') {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      speed = 300;
    }

    setTimeout(() => this.typeWriter(), speed);
  }
}
