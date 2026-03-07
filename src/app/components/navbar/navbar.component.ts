import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioService);

  isScrolled = false;
  isMenuOpen = false;
  activeSection = 'hero';
  socialLinks = this.portfolioService.getSocialLinks();

  navItems = [
    { label: '01. About', anchor: 'about' },
    { label: '02. Skills', anchor: 'skills' },
    { label: '03. Experience', anchor: 'experience' },
    { label: '04. Projects', anchor: 'projects' },
    { label: '05. Contact', anchor: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
    this.updateActiveSection();
  }

  ngOnInit(): void {
    this.updateActiveSection();
  }

  ngOnDestroy(): void {}

  scrollTo(anchor: string): void {
    const el = document.getElementById(anchor);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  private updateActiveSection(): void {
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
    for (const id of [...sections].reverse()) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 200) {
        this.activeSection = id;
        break;
      }
    }
  }
}
