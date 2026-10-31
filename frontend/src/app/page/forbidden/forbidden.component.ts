import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent implements AfterViewInit, OnDestroy {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private timeoutId?: ReturnType<typeof setTimeout>;
  private key: HTMLElement | null = null;
  private keyhole: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.key = this.host.querySelector<HTMLElement>('.key');
    this.keyhole = this.host.querySelector<HTMLElement>('.keyhole');
    if (!this.key || !this.keyhole) {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const animationDuration = parseFloat(rootStyles.getPropertyValue('--animation-duration')) * 1000 || 0;
    const keyTimer = (animationDuration * 9) / 8;

    this.timeoutId = setTimeout(() => {
      const key = this.key!;
      const keyhole = this.keyhole!;
      // After the intro animation the cursor seemingly grabs the key.
      this.setCursor('grab');
      key.style.animationPlayState = 'running';
      keyhole.style.animationPlayState = 'running';
      // The key follows the cursor, so it must not swallow the mouseover of the keyhole.
      key.style.pointerEvents = 'none';
      window.addEventListener('mousemove', this.updateKeyPosition);
      keyhole.addEventListener('mouseover', this.grantAccess);
    }, keyTimer);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.removeListeners();
  }

  private readonly updateKeyPosition = (event: MouseEvent): void => {
    if (!this.key) return;
    const box = this.key.getBoundingClientRect();
    this.key.style.left = `${event.clientX - box.width / 1.5}px`;
    this.key.style.top = `${event.clientY - box.height / 2}px`;
  };

  private readonly grantAccess = (): void => {
    this.setCursor('default');
    const heading = this.host.querySelector<HTMLElement>('h1');
    const paragraph = this.host.querySelector<HTMLElement>('p');
    if (heading) heading.textContent = '🎉 yay 🎉';
    if (paragraph) paragraph.textContent = 'access granted';
    if (this.keyhole) this.keyhole.style.display = 'none';
    if (this.key) this.key.style.display = 'none';
    this.removeListeners();
  };

  private setCursor(cursor: string): void {
    const container = this.key?.parentElement?.parentElement;
    if (container) container.style.cursor = cursor;
  }

  private removeListeners(): void {
    window.removeEventListener('mousemove', this.updateKeyPosition);
    this.keyhole?.removeEventListener('mouseover', this.grantAccess);
  }
}
