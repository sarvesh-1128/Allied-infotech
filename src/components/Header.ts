// Dynamic Reusable Header Component with premium dropdowns & keyboard accessibility
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
            <li><a href="index.html" class="nav-link ${isActive('index')}">Home</a></li>
            
            <li class="nav-item-dropdown">
              <a href="products.html" class="nav-link ${isActive('products')}" aria-haspopup="true" aria-expanded="false">
                Products <span class="nav-caret">▼</span>
              </a>
              <ul class="dropdown-menu" aria-label="Products Submenu">
                <li><a href="products.html?division=manufacturing">Manufacturing Solutions</a></li>
                <li><a href="products.html?division=moulding">Moulding Solutions</a></li>
              </ul>
            </li>

            <li class="nav-item-dropdown">
              <a href="services.html" class="nav-link ${isActive('services')}" aria-haspopup="true" aria-expanded="false">
                Services <span class="nav-caret">▼</span>
              </a>
              <ul class="dropdown-menu" aria-label="Services Submenu">
                <li><a href="services.html#sec-it-ites">IT / ITES</a></li>
                <li><a href="services.html#sec-manufacturing">Manufacturing</a></li>
                <li><a href="services.html#sec-moulding">Moulding</a></li>
              </ul>
            </li>

            <li><a href="partners.html" class="nav-link ${isActive('partners')}">Partners</a></li>
            <li><a href="team.html" class="nav-link ${isActive('team')}">Our Team</a></li>
            <li><a href="rfq.html" class="nav-link ${isActive('rfq')}">RFQ</a></li>
            <li><a href="rfq.html#contact" class="btn btn-primary btn-magnetic" style="padding: 6px 16px; font-size: 0.85rem;">Contact Us</a></li>
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
        <li><a href="index.html" class="${isActive('index')}">Home</a></li>
        
        <li class="mobile-dropdown-parent">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding: var(--spacing-sm) 0;">
            <a href="products.html" class="${isActive('products')}" style="border: 0; padding: 0; flex-grow: 1;">Products</a>
            <button class="mobile-dropdown-toggle" aria-label="Expand Products Submenu" style="background: none; border: 0; font-size: 0.9rem; cursor: pointer; color: var(--color-primary); padding: 4px 10px;">▼</button>
          </div>
          <ul class="mobile-dropdown-sublinks" style="list-style: none; padding-left: var(--spacing-lg); display: none;">
            <li><a href="products.html?division=manufacturing" style="font-size: 0.95rem; padding: 6px 0; border: 0;">Manufacturing Solutions</a></li>
            <li><a href="products.html?division=moulding" style="font-size: 0.95rem; padding: 6px 0; border: 0; border-bottom: 1px solid var(--color-border);">Moulding Solutions</a></li>
          </ul>
        </li>

        <li class="mobile-dropdown-parent">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding: var(--spacing-sm) 0;">
            <a href="services.html" class="${isActive('services')}" style="border: 0; padding: 0; flex-grow: 1;">Services</a>
            <button class="mobile-dropdown-toggle" aria-label="Expand Services Submenu" style="background: none; border: 0; font-size: 0.9rem; cursor: pointer; color: var(--color-primary); padding: 4px 10px;">▼</button>
          </div>
          <ul class="mobile-dropdown-sublinks" style="list-style: none; padding-left: var(--spacing-lg); display: none;">
            <li><a href="services.html#sec-it-ites" style="font-size: 0.95rem; padding: 6px 0; border: 0;">IT / ITES</a></li>
            <li><a href="services.html#sec-manufacturing" style="font-size: 0.95rem; padding: 6px 0; border: 0;">Manufacturing</a></li>
            <li><a href="services.html#sec-moulding" style="font-size: 0.95rem; padding: 6px 0; border: 0; border-bottom: 1px solid var(--color-border);">Moulding</a></li>
          </ul>
        </li>

        <li><a href="partners.html" class="${isActive('partners')}">Partners</a></li>
        <li><a href="team.html" class="${isActive('team')}">Our Team</a></li>
        <li><a href="rfq.html" class="${isActive('rfq')}">RFQ</a></li>
        <li><a href="rfq.html#contact" style="border-bottom: 0;">Contact Us</a></li>
      </ul>
    `;
    
    return headerHTML;
  }

  init() {
    const headerEl = document.querySelector('header');
    if (!headerEl) return;
    
    // Render content
    headerEl.innerHTML = this.render();
    
    // Desktop Dropdown delay handlers
    const dropdowns = headerEl.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link') as HTMLElement;
      const menu = dropdown.querySelector('.dropdown-menu') as HTMLElement;
      let timer: number | null = null;

      const openDropdown = () => {
        if (timer) clearTimeout(timer);
        dropdowns.forEach(d => {
          if (d !== dropdown) {
            d.querySelector('.dropdown-menu')?.classList.remove('active');
            d.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
          }
        });
        menu.classList.add('active');
        link.setAttribute('aria-expanded', 'true');
      };

      const closeDropdown = () => {
        timer = window.setTimeout(() => {
          menu.classList.remove('active');
          link.setAttribute('aria-expanded', 'false');
        }, 220); // 220ms hover delay on mouseleave
      };

      dropdown.addEventListener('mouseenter', openDropdown);
      dropdown.addEventListener('mouseleave', closeDropdown);

      // Keyboard accessibility focus
      link.addEventListener('focus', openDropdown);
      dropdown.addEventListener('focusout', (e: Event) => {
        const fe = e as FocusEvent;
        if (!dropdown.contains(fe.relatedTarget as Node)) {
          closeDropdown();
        }
      });
    });

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

    // Toggle mobile dropdown sublinks
    const mobileToggles = headerEl.querySelectorAll('.mobile-dropdown-toggle');
    mobileToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const parent = toggle.closest('.mobile-dropdown-parent');
        const sublinks = parent?.querySelector('.mobile-dropdown-sublinks') as HTMLElement;
        if (sublinks) {
          const isHidden = window.getComputedStyle(sublinks).display === 'none';
          sublinks.style.display = isHidden ? 'block' : 'none';
          (toggle as HTMLElement).innerText = isHidden ? '▲' : '▼';
        }
      });
    });

    // Scroll shrinkage behavior
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        headerEl.classList.add('header-shrink');
      } else {
        headerEl.classList.remove('header-shrink');
      }
    }, { passive: true });
  }
}
