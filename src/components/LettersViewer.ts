// Certificate Authorization Letter Viewer – Fullscreen Image Preview
// Supports: Pan + Drag, Wheel Zoom, Native Fullscreen API, Download via Blob

export class LettersViewer {
  private overlay: HTMLElement | null = null;
  private canvasContainer: HTMLElement | null = null;
  private viewerImage: HTMLImageElement | null = null;
  private currentLetterPath: string = '';
  private currentPartnerName: string = '';

  // Transform States
  private scale: number = 1.0;
  private posX: number = 0;
  private posY: number = 0;

  // Drag states
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;

  constructor() {
    this.createViewerStructure();
  }

  private createViewerStructure() {
    // Full-screen backdrop overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay cert-viewer-overlay';
    this.overlay.id = 'certificate-viewer-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-label', 'Authorization Certificate Viewer');

    // Main container – expands to full viewport
    const container = document.createElement('div');
    container.className = 'cert-viewer-container';
    container.setAttribute('tabindex', '-1');

    // ─── Header bar ────────────────────────────────────────────
    const headerBar = document.createElement('div');
    headerBar.className = 'cert-viewer-header';

    const title = document.createElement('h3');
    title.id = 'cert-viewer-title';
    title.innerText = 'Authorization Certificate';

    const headerRight = document.createElement('div');
    headerRight.style.display = 'flex';
    headerRight.style.gap = '8px';
    headerRight.style.alignItems = 'center';

    const btnDownload = this.createHeaderButton('📥 Download', () => this.triggerDownload());
    btnDownload.id = 'cert-download-btn';

    const btnFullscreen = this.createHeaderButton('⛶ Fullscreen', () => this.toggleFullscreen(container));
    btnFullscreen.id = 'cert-fullscreen-btn';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'cert-viewer-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close certificate viewer');
    closeBtn.addEventListener('click', () => this.close());

    headerRight.appendChild(btnDownload);
    headerRight.appendChild(btnFullscreen);
    headerRight.appendChild(closeBtn);

    headerBar.appendChild(title);
    headerBar.appendChild(headerRight);
    container.appendChild(headerBar);

    // ─── Toolbar ───────────────────────────────────────────────
    const toolbar = document.createElement('div');
    toolbar.className = 'cert-viewer-toolbar';

    const btnZoomIn  = this.createToolButton('🔍 Zoom In',   () => this.zoom(0.25));
    const btnZoomOut = this.createToolButton('🔎 Zoom Out',  () => this.zoom(-0.25));
    const btnReset   = this.createToolButton('🔄 Reset View', () => this.resetTransform());
    const zoomLabel  = document.createElement('span');
    zoomLabel.id = 'cert-zoom-label';
    zoomLabel.className = 'cert-zoom-label';
    zoomLabel.innerText = '100%';

    toolbar.appendChild(btnZoomIn);
    toolbar.appendChild(btnZoomOut);
    toolbar.appendChild(btnReset);
    toolbar.appendChild(zoomLabel);
    container.appendChild(toolbar);

    // ─── Canvas / Image area ───────────────────────────────────
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.className = 'cert-viewer-canvas';
    this.canvasContainer.style.cursor = 'grab';

    this.viewerImage = document.createElement('img');
    this.viewerImage.className = 'cert-viewer-img';
    this.viewerImage.alt = 'Authorization Certificate';
    this.viewerImage.draggable = false;

    this.canvasContainer.appendChild(this.viewerImage);
    container.appendChild(this.canvasContainer);

    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    this.setupInteractionListeners();

    // Fullscreen change handler – update button label
    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement;
      btnFullscreen.innerText = isFs ? '⊡ Exit Fullscreen' : '⛶ Fullscreen';
    });
  }

  // ─── Button Factories ──────────────────────────────────────────
  private createToolButton(label: string, cb: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.className = 'cert-tool-btn';
    btn.addEventListener('click', cb);
    return btn;
  }

  private createHeaderButton(label: string, cb: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.className = 'btn btn-outline cert-header-action';
    btn.style.padding = '4px 12px';
    btn.style.fontSize = '0.78rem';
    btn.addEventListener('click', cb);
    return btn;
  }

  // ─── Interaction Listeners ─────────────────────────────────────
  private setupInteractionListeners() {
    if (!this.overlay || !this.canvasContainer) return;

    // Overlay backdrop click → close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Escape → close (also exits fullscreen)
    document.addEventListener('keydown', (e) => {
      if (!this.overlay?.classList.contains('active')) return;
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          this.close();
        }
      }
      if (e.key === '+' || e.key === '=') this.zoom(0.15);
      if (e.key === '-') this.zoom(-0.15);
      if (e.key === '0') this.resetTransform();
    });

    // ── Drag (mouse) ─────────────────────────────────────────
    const onStart = (clientX: number, clientY: number) => {
      this.isDragging = true;
      this.startX = clientX - this.posX;
      this.startY = clientY - this.posY;
      if (this.canvasContainer) this.canvasContainer.style.cursor = 'grabbing';
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!this.isDragging) return;
      this.posX = clientX - this.startX;
      this.posY = clientY - this.startY;
      this.updateImageStyle();
    };

    const onEnd = () => {
      this.isDragging = false;
      if (this.canvasContainer) this.canvasContainer.style.cursor = 'grab';
    };

    this.canvasContainer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => { onMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { onEnd(); });

    // ── Drag (touch) ──────────────────────────────────────────
    this.canvasContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    this.canvasContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    this.canvasContainer.addEventListener('touchend', () => { onEnd(); });

    // ── Wheel zoom ────────────────────────────────────────────
    this.canvasContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 0.12 : -0.12;
      this.zoom(factor);
    }, { passive: false });
  }

  // ─── Public API ────────────────────────────────────────────────
  public open(letterPath: string, partnerName: string) {
    this.currentLetterPath = letterPath;
    this.currentPartnerName = partnerName;

    if (this.overlay && this.viewerImage) {
      const titleEl = document.getElementById('cert-viewer-title');
      if (titleEl) titleEl.innerText = `${partnerName} — Authorization Certificate`;

      this.viewerImage.src = letterPath;
      this.resetTransform();

      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const container = this.overlay.querySelector('.cert-viewer-container') as HTMLElement;
      container?.focus();
    }
  }

  public close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Exit native fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // ─── Fullscreen ────────────────────────────────────────────────
  private toggleFullscreen(el: HTMLElement) {
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        console.warn('Fullscreen not available:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // ─── Transform helpers ─────────────────────────────────────────
  private zoom(factor: number) {
    this.scale = Math.max(0.25, Math.min(5.0, this.scale + factor));
    this.updateImageStyle();
    this.updateZoomLabel();
  }

  private resetTransform() {
    this.scale = 1.0;
    this.posX = 0;
    this.posY = 0;
    this.updateImageStyle();
    this.updateZoomLabel();
  }

  private updateImageStyle() {
    if (this.viewerImage) {
      // Always include the -50%/-50% centering offset (image is absolutely positioned at top:50% left:50%)
      this.viewerImage.style.transform =
        `translate(calc(-50% + ${this.posX}px), calc(-50% + ${this.posY}px)) scale(${this.scale})`;
    }
  }

  private updateZoomLabel() {
    const label = document.getElementById('cert-zoom-label');
    if (label) label.innerText = `${Math.round(this.scale * 100)}%`;
  }

  // ─── Download via Blob (works for both same-origin and cached assets) ──
  public triggerDownload() {
    if (!this.currentLetterPath) return;

    const filename = `${this.currentPartnerName.replace(/\s+/g, '_')}_Authorization_Certificate.webp`;

    fetch(this.currentLetterPath)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      })
      .catch(() => {
        // Fallback: direct anchor download
        const link = document.createElement('a');
        link.href = this.currentLetterPath;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}
