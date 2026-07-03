// Dynamic Reusable Product Detail Modal Component
import { Product } from '../data/db.ts';
import { downloadAsBlob, deriveFilename } from '../utils/download.ts';

export class ProductModal {
  private overlay: HTMLElement | null = null;
  private currentProduct: Product | null = null;
  private currentImageIndex: number = 0;

  constructor() {
    this.createModalStructure();
  }

  private createModalStructure() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'product-modal-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('role', 'dialog');
    
    const container = document.createElement('div');
    container.className = 'modal-container';
    container.style.maxWidth = '900px';
    container.style.padding = 'var(--spacing-xl)';
    container.setAttribute('tabindex', '-1');
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close Modal');
    closeBtn.addEventListener('click', () => this.close());
    
    const content = document.createElement('div');
    content.id = 'product-modal-content';
    
    container.appendChild(closeBtn);
    container.appendChild(content);
    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
        this.close();
      }
    });
  }

  public open(product: Product) {
    this.currentProduct = product;
    this.currentImageIndex = 0;
    this.renderContent();
    
    if (this.overlay) {
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      // Set focus to modal container for accessibility
      const container = this.overlay.querySelector('.modal-container');
      (container as HTMLElement)?.focus();
    }
  }

  public close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
    }
  }

  private renderContent() {
    const contentEl = document.getElementById('product-modal-content');
    if (!contentEl || !this.currentProduct) return;

    const p = this.currentProduct;
    
    // Build specs rows
    let specsHTML = '';
    for (const [key, value] of Object.entries(p.specifications)) {
      specsHTML += `
        <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
          <span style="font-weight: 600; color: var(--color-secondary); font-size: 0.9rem;">${key}</span>
          <span style="color: var(--color-text-muted); font-size: 0.9rem; text-align: right; max-width: 60%;">${value}</span>
        </div>
      `;
    }

    // Build image viewer
    const hasMultipleImages = p.images.length > 1;
    const imagesHTML = `
      <div style="position: relative; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: var(--spacing-lg); background-color: var(--color-bg-alt);">
        <img id="modal-product-img" src="${p.images[this.currentImageIndex]}" alt="${p.name}" style="width: 100%; height: 350px; object-fit: contain; padding: var(--spacing-md);" />
        ${hasMultipleImages ? `
          <button id="modal-img-prev" class="btn" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); padding: 6px 12px; background: rgba(11,19,41,0.6); color: white; border-radius: 50%; font-size: 1.1rem;" aria-label="Previous image">&lt;</button>
          <button id="modal-img-next" class="btn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); padding: 6px 12px; background: rgba(11,19,41,0.6); color: white; border-radius: 50%; font-size: 1.1rem;" aria-label="Next image">&gt;</button>
          <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: var(--spacing-xs);">
            ${p.images.map((_, idx) => `
              <span class="img-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" style="display: block; width: 8px; height: 8px; border-radius: 50%; background: ${idx === 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)'}; cursor: pointer;"></span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    contentEl.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: var(--spacing-xl);">
        <div>
          ${imagesHTML}
          
          <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm);">Technical Specifications</h4>
          <div style="display: flex; flex-direction: column;">
            ${specsHTML}
          </div>
          
          <div style="margin-top: var(--spacing-lg); text-align: center;">
            <button id="product-brochure-download" class="btn btn-outline" style="width: 100%; font-size: 0.85rem; padding: 8px;" aria-label="Download product image">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; vertical-align: middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download Product Image
            </button>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="margin-bottom: var(--spacing-sm);">
              <span class="badge badge-primary">${p.division === 'moulding' ? 'Moulding Solutions' : 'Manufacturing Systems'}</span>
            </div>
            <h3 style="font-size: 1.75rem; font-weight: 800; color: var(--color-secondary); line-height: 1.2; margin-bottom: var(--spacing-md);">${p.name}</h3>
            
            <p style="color: var(--color-text-main); font-size: 0.95rem; margin-bottom: var(--spacing-lg); line-height: 1.6;">${p.overview}</p>
            
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-xs);">Key Advantages</h4>
            <ul style="list-style-type: none; margin-bottom: var(--spacing-lg); padding-left: 0;">
              ${p.advantages.map(adv => `
                <li style="position: relative; padding-left: 20px; font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 6px;">
                  <span style="position: absolute; left: 0; color: var(--color-primary); font-weight: bold;">✓</span>${adv}
                </li>
              `).join('')}
            </ul>

            <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-xs);">Primary Applications</h4>
            <ul style="list-style-type: none; margin-bottom: var(--spacing-lg); padding-left: 0;">
              ${p.applications.map(app => `
                <li style="position: relative; padding-left: 20px; font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 6px;">
                  <span style="position: absolute; left: 0; color: var(--color-primary); font-weight: bold;">•</span>${app}
                </li>
              `).join('')}
            </ul>
            
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-xs);">Industries Served</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--spacing-lg);">
              ${p.industries.map(ind => `<span class="badge badge-outline" style="font-size: 0.75rem; font-weight: 500;">${ind}</span>`).join('')}
            </div>
          </div>
          
          <div>
            <a href="rfq.html?category=${encodeURIComponent(p.name)}" class="btn btn-primary" style="width: 100%; text-align: center;">
              Enquire About This Product
            </a>
          </div>
        </div>
      </div>
    `;

    // Responsive styles override inside modal
    const gridEl = contentEl.querySelector('div');
    if (gridEl && window.innerWidth < 768) {
      gridEl.style.gridTemplateColumns = '1fr';
    }

    // Set up slideshow event handlers if multiple images exist
    if (hasMultipleImages) {
      const prevBtn = contentEl.querySelector('#modal-img-prev');
      const nextBtn = contentEl.querySelector('#modal-img-next');
      const imgEl = contentEl.querySelector('#modal-product-img') as HTMLImageElement;
      const dots = contentEl.querySelectorAll('.img-dot');

      const updateImage = (index: number) => {
        this.currentImageIndex = index;
        if (imgEl && p.images[index]) {
          imgEl.src = p.images[index];
        }
        dots.forEach((dot, idx) => {
          (dot as HTMLElement).style.background = idx === index ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)';
        });
      };

      prevBtn?.addEventListener('click', () => {
        let newIdx = this.currentImageIndex - 1;
        if (newIdx < 0) newIdx = p.images.length - 1;
        updateImage(newIdx);
      });

      nextBtn?.addEventListener('click', () => {
        let newIdx = this.currentImageIndex + 1;
        if (newIdx >= p.images.length) newIdx = 0;
        updateImage(newIdx);
      });

      dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          const idx = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0', 10);
          updateImage(idx);
        });
      });
    }

    // Wire download button – downloads the current visible product image
    const downloadBtn = contentEl.querySelector('#product-brochure-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const imgSrc = p.images[this.currentImageIndex] || p.images[0];
        const filename = deriveFilename(imgSrc, p.name.replace(/\s+/g, '_'));
        downloadAsBlob(imgSrc, filename);
      });
    }
  }
}
