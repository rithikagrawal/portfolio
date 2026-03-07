import { Component, OnInit, OnDestroy, HostListener, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor-dot" [style.left.px]="x" [style.top.px]="y" [style.transform]="'translate(-50%, -50%)'"></div>
    <div class="cursor-ring" [class.cursor-hover]="isHovering"
         [style.left.px]="ringX" [style.top.px]="ringY"
         [style.transform]="'translate(-50%, -50%)'"></div>
  `
})
export class CursorComponent implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);

  x = 0; y = 0;
  ringX = 0; ringY = 0;
  isHovering = false;
  private animFrame = 0;
  private targetX = 0; private targetY = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.x = e.clientX;
    this.y = e.clientY;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    this.isHovering = !!(el?.closest('a, button, [role="button"], input, textarea, select, .hoverable'));
  }

  ngOnInit(): void {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      this.ringX = lerp(this.ringX, this.x, 0.12);
      this.ringY = lerp(this.ringY, this.y, 0.12);
      this.animFrame = requestAnimationFrame(animate);
    };
    this.animFrame = requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrame);
  }
}
