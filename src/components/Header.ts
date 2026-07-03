// Dynamic Reusable Header Component
import { db } from '../data/db.ts';

export class Header {
  render() {
    const activePath = window.location.pathname;
    
    // Helper to check active state
    const isActive = (pageName: string) => {
      if (pageName === 'index' && (activePath === '/' || activePath.endsWith('index.html') || activePath === '')) {
        return 'nav-link-active';
      }
      if (activePath.includes(pageName)) {
        return 'nav-link-active';
      }
      return '';
    };

    const headerHTML = `
      <div class="container header-container">
        <a href="index.html" class="brand-title" style="display: flex; flex-direction: row; align-items: center; gap: var(--spacing-sm);" aria-label="${db.company.name} Home">
          <img src="${db.company.logo}" alt="${db.company.name} Logo" style="height: 48px; width: auto; object-fit: contain;" />
        </a>
        
        <nav aria-label="Main Navigation">
          <ul class="nav-links">
            <li><a href="index.html" class="nav-link ${isActive('index')}">Corporate Profile</a></li>
            <li><a href="products.html" class="nav-link ${isActive('products')}">Products</a></li>
            <li><a href="partners.html" class="nav-link ${isActive('partners')}">Partners</a></li>
            <li><a href="services.html" class="nav-link ${isActive('services')}">Services</a></li>
            <li><a href="rfq.html" class="nav-link ${isActive('rfq')}">RFQ</a></li>
            <li><a href="rfq.html#contact" class="btn btn-primary" style="padding: 6px 16px; font-size: 0.85rem;">Contact Us</a></li>
          </ul>
        </nav>
        
        <button class="mobile-nav-toggle" aria-label="Toggle Navigation Menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
      
      <!-- Mobile navigation drawer -->
      <ul class="nav-menu-mobile">
        <li><a href="index.html" class="${isActive('index')}">Corporate Profile</a></li>
        <li><a href="products.html" class="${isActive('products')}">Products</a></li>
        <li><a href="partners.html" class="${isActive('partners')}">Partners</a></li>
        <li><a href="services.html" class="${isActive('services')}">Services</a></li>
        <li><a href="rfq.html" class="${isActive('rfq')}">RFQ</a></li>
        <li><a href="rfq.html#contact">Contact Us</a></li>
      </ul>
    `;
    
    return headerHTML;
  }

  init() {
    const headerEl = document.querySelector('header');
    if (!headerEl) return;
    
    // Render content
    headerEl.innerHTML = this.render();
    
    // Toggle mobile menu
    const mobileToggle = headerEl.querySelector('.mobile-nav-toggle');
    const mobileMenu = headerEl.querySelector('.nav-menu-mobile');
    
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', String(!expanded));
        mobileMenu.classList.toggle('active');
        
        // Toggle hamburger lines to "X" shape
        const lines = mobileToggle.querySelectorAll('.hamburger-line');
        if (lines.length === 3) {
          if (!expanded) {
            (lines[0] as HTMLElement).style.transform = 'rotate(45deg) translate(5px, 5px)';
            (lines[1] as HTMLElement).style.opacity = '0';
            (lines[2] as HTMLElement).style.transform = 'rotate(-45deg) translate(6px, -6px)';
          } else {
            (lines[0] as HTMLElement).style.transform = 'none';
            (lines[1] as HTMLElement).style.opacity = '1';
            (lines[2] as HTMLElement).style.transform = 'none';
          }
        }
      });
      
      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('active');
          const lines = mobileToggle.querySelectorAll('.hamburger-line');
          if (lines.length === 3) {
            (lines[0] as HTMLElement).style.transform = 'none';
            (lines[1] as HTMLElement).style.opacity = '1';
            (lines[2] as HTMLElement).style.transform = 'none';
          }
        }
      });
    }

    // Scroll shrinkage behavior
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        headerEl.classList.add('header-shrink');
      } else {
        headerEl.classList.remove('header-shrink');
      }
    });
  }
}
