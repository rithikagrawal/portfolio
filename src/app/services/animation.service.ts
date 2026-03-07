import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private observers: IntersectionObserver[] = [];

  constructor(private ngZone: NgZone) {}

  initScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.ngZone.run(() => {
              entry.target.classList.add('revealed');
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
      observer.observe(el);
    });

    this.observers.push(observer);
  }

  typeWriter(element: HTMLElement, text: string, speed = 80): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = '';
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  animateCounter(element: HTMLElement, target: number, duration = 2000): void {
    const start = performance.now();
    const update = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutCubic(progress);
      element.textContent = Math.floor(eased * target).toString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  destroy(): void {
    this.observers.forEach(o => o.disconnect());
    this.observers = [];
  }
}
