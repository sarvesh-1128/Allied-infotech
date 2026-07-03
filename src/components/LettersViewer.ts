// Certificate Modal Authorization Letters Viewer Component
// Incorporates Mouse-Wheel Zooming, Pan-by-Drag, Fullscreen toggles, and Mobile support

export class LettersViewer {
  private overlay: HTMLElement | null = null;
  private canvasContainer: HTMLElement | null = null;
  private viewerImage: HTMLImageElement | null = null;
  private currentLetterPath: string = "";
  
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
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'certificate-viewer-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('role', 'dialog');

    const container = document.createElement('div');
    container.className = 'modal-container';
    container.style.maxWidth = '750px';
    container.style.width = '95%';
    container.style.padding = '0';
    container.style.backgroundColor = 'var(--color-bg-alt)';
    container.setAttribute('tabindex', '-1');

    // Header bar
    const headerBar = document.createElement('div');
    headerBar.style.display = 'flex';
    headerBar.style.justifyContent = 'space-between';
    headerBar.style.alignItems = 'center';
    headerBar.style.padding = 'var(--spacing-md) var(--spacing-lg)';
    headerBar.style.borderBottom = '1px solid var(--color-border)';
    headerBar.style.backgroundColor = 'var(--color-bg-main)';

    const title = document.createElement('h3');
    title.innerText = "Authorization Certificate";
    title.style.fontSize = '1.1rem';
    title.style.fontWeight = '700';
    title.style.color = 'var(--color-secondary)';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'static';
    closeBtn.style.padding = '0';
    closeBtn.addEventListener('click', () => this.close());

    headerBar.appendChild(title);
    headerBar.appendChild(closeBtn);
    container.appendChild(headerBar);

    // Toolbar controls
    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'center';
    toolbar.style.gap = 'var(--spacing-sm)';
    toolbar.style.padding = 'var(--spacing-sm)';
    toolbar.style.backgroundColor = '#F1F5F9';
    toolbar.style.borderBottom = '1px solid var(--color-border)';

    const btnZoomIn = this.createToolButton("🔍➕ Zoom In", () => this.zoom(0.2));
    const btnZoomOut = this.createToolButton("🔍➖ Zoom Out", () => this.zoom(-0.2));
    const btnReset = this.createToolButton("🔄 Reset", () => this.resetTransform());
    const btnDownload = this.createToolButton("📥 Download File", () => this.triggerDownload());

    toolbar.appendChild(btnZoomIn);
    toolbar.appendChild(btnZoomOut);
    toolbar.appendChild(btnReset);
    toolbar.appendChild(btnDownload);
    container.appendChild(toolbar);

    // Interactive canvas
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.style.width = '100%';
    this.canvasContainer.style.height = '480px';
    this.canvasContainer.style.overflow = 'hidden';
    this.canvasContainer.style.position = 'relative';
    this.canvasContainer.style.cursor = 'grab';
    this.canvasContainer.style.backgroundColor = '#1E293B';

    this.viewerImage = document.createElement('img');
    this.viewerImage.style.position = 'absolute';
    this.viewerImage.style.transformOrigin = 'center center';
    this.viewerImage.style.maxWidth = 'none';
    this.viewerImage.style.height = '90%';
    this.viewerImage.style.top = '5%';
    this.viewerImage.style.left = '5%';
    this.viewerImage.style.right = '5%';
    this.viewerImage.style.bottom = '5%';
    this.viewerImage.style.objectFit = 'contain';
    this.viewerImage.style.userSelect = 'none';
    this.viewerImage.style.pointerEvents = 'none'; // prevents standard dragging browser defaults

    this.canvasContainer.appendChild(this.viewerImage);
    container.appendChild(this.canvasContainer);

    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    // Hook listeners
    this.setupInteractionListeners();
  }

  private createToolButton(label: string, callback: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.className = 'btn';
    btn.style.padding = '4px 12px';
    btn.style.fontSize = '0.78rem';
    btn.style.border = '1px solid #CBD5E1';
    btn.style.backgroundColor = '#FFFFFF';
    btn.style.color = 'var(--color-text-main)';
    btn.addEventListener('click', callback);
    return btn;
  }

  private setupInteractionListeners() {
    if (!this.overlay || !this.canvasContainer) return;

    // Overlay click close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Keys close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
        this.close();
      }
    });

    // Drag events
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

    // Mouse Listeners
    this.canvasContainer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      onEnd();
    });

    // Touch Listeners (Mobile Panning)
    this.canvasContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvasContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvasContainer.addEventListener('touchend', () => {
      onEnd();
    });

    // Wheel zooming
    this.canvasContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
      this.zoom(zoomFactor);
    }, { passive: false });
  }

  public open(letterPath: string, partnerName: string) {
    this.currentLetterPath = letterPath;
    
    if (this.overlay && this.viewerImage) {
      // Update Title
      const titleEl = this.overlay.querySelector('h3');
      if (titleEl) titleEl.innerText = `${partnerName} - Authorization Letter`;

      this.viewerImage.src = letterPath;
      this.resetTransform();
      
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      
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

  private zoom(factor: number) {
    this.scale = Math.max(0.5, Math.min(4.0, this.scale + factor));
    this.updateImageStyle();
  }

  private resetTransform() {
    this.scale = 1.0;
    this.posX = 0;
    this.posY = 0;
    this.updateImageStyle();
  }

  private triggerDownload() {
    if (!this.currentLetterPath) return;
    const link = document.createElement('a');
    link.href = this.currentLetterPath;
    link.download = this.currentLetterPath.split('/').pop() || 'certificate.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private updateImageStyle() {
    if (this.viewerImage) {
      this.viewerImage.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
    }
  }
}
