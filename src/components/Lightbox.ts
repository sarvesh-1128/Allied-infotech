// Dynamic Manufacturing Gallery Lightbox Component
import { GalleryItem } from '../data/db.ts';
import { downloadAsBlob, deriveFilename } from '../utils/download.ts';

export class Lightbox {
  private overlay: HTMLElement | null = null;
  private currentItems: GalleryItem[] = [];
  private currentIndex: number = 0;
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  constructor() {
    this.createLightboxStructure();
  }

  private createLightboxStructure() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'lightbox-overlay';
    this.overlay.style.backgroundColor = 'rgba(3, 7, 18, 0.95)';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('role', 'dialog');

    const container = document.createElement('div');
    container.className = 'modal-container';
    container.style.maxWidth = '1000px';
    container.style.background = 'transparent';
    container.style.boxShadow = 'none';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.setAttribute('tabindex', '-1');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.color = '#F3F4F6';
    closeBtn.style.fontSize = '2.5rem';
    closeBtn.setAttribute('aria-label', 'Close Gallery');
    closeBtn.addEventListener('click', () => this.close());

    const content = document.createElement('div');
    content.id = 'lightbox-content';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.alignItems = 'center';

    container.appendChild(closeBtn);
    container.appendChild(content);
    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Setup keys
    document.addEventListener('keydown', (e) => {
      if (!this.overlay?.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    // Touch Swipe Support
    container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  private handleSwipe() {
    const threshold = 50; // swipe minimum distance in pixels
    if (this.touchStartX - this.touchEndX > threshold) {
      // Swiped Left -> Next Image
      this.next();
    } else if (this.touchEndX - this.touchStartX > threshold) {
      // Swiped Right -> Previous Image
      this.prev();
    }
  }

  public open(items: GalleryItem[], index: number) {
    this.currentItems = items;
    this.currentIndex = index;
    this.renderContent();

    if (this.overlay) {
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      const container = this.overlay.querySelector('.modal-container');
      (container as HTMLElement)?.focus();
    }
    
    this.preloadAdjacent();
  }

  public close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
    }
  }

  private prev() {
    if (this.currentItems.length <= 1) return;
    let idx = this.currentIndex - 1;
    if (idx < 0) idx = this.currentItems.length - 1;
    this.currentIndex = idx;
    this.renderContent();
    this.preloadAdjacent();
  }

  private next() {
    if (this.currentItems.length <= 1) return;
    let idx = this.currentIndex + 1;
    if (idx >= this.currentItems.length) idx = 0;
    this.currentIndex = idx;
    this.renderContent();
    this.preloadAdjacent();
  }

  private preloadAdjacent() {
    if (this.currentItems.length <= 1) return;
    
    // Preload next image
    const nextIdx = (this.currentIndex + 1) % this.currentItems.length;
    const nextImg = new Image();
    nextImg.src = this.currentItems[nextIdx].src;

    // Preload prev image
    const prevIdx = (this.currentIndex - 1 + this.currentItems.length) % this.currentItems.length;
    const prevImg = new Image();
    prevImg.src = this.currentItems[prevIdx].src;
  }

  private renderContent() {
    const contentEl = document.getElementById('lightbox-content');
    if (!contentEl || !this.currentItems[this.currentIndex]) return;

    const item = this.currentItems[this.currentIndex];

    contentEl.innerHTML = `
      <div style="position: relative; width: 100%; display: flex; justify-content: center; align-items: center; min-height: 50vh;">
        <img src="${item.src}" alt="${item.alt}" style="max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: var(--radius-md); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);" />
        
        ${this.currentItems.length > 1 ? `
          <button id="lightbox-prev" class="btn" style="position: absolute; left: 0px; padding: 12px 18px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 4px; font-size: 1.5rem; backdrop-filter: blur(4px);" aria-label="Previous Photo">&lt;</button>
          <button id="lightbox-next" class="btn" style="position: absolute; right: 0px; padding: 12px 18px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 4px; font-size: 1.5rem; backdrop-filter: blur(4px);" aria-label="Next Photo">&gt;</button>
        ` : ''}
      </div>
      
      <div style="width: 100%; text-align: center; color: white; padding: var(--spacing-md) 0 var(--spacing-sm); max-width: 600px;">
        <p style="font-size: 1rem; font-weight: 500; margin-bottom: 4px;">${item.caption}</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); flex-wrap: wrap;">
          <span class="badge" style="background-color: var(--color-primary); color: white; font-size: 0.65rem;">${item.category.toUpperCase()} (${this.currentIndex + 1} / ${this.currentItems.length})</span>
          <button id="lightbox-download-btn" class="btn" style="padding: 4px 14px; font-size: 0.75rem; background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.25); border-radius: var(--radius-sm); cursor: pointer; backdrop-filter: blur(4px);" aria-label="Download image">📥 Download</button>
        </div>
      </div>
    `;

    // Hook events
    if (this.currentItems.length > 1) {
      contentEl.querySelector('#lightbox-prev')?.addEventListener('click', () => this.prev());
      contentEl.querySelector('#lightbox-next')?.addEventListener('click', () => this.next());
    }

    // Download button
    contentEl.querySelector('#lightbox-download-btn')?.addEventListener('click', () => {
      const filename = deriveFilename(item.src, item.caption.replace(/\s+/g, '_') || 'gallery_image');
      downloadAsBlob(item.src, filename);
    });
  }
}
