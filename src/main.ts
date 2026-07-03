// Main Dynamic Page Controller & Reusable Components Initializer
import { Header } from './components/Header.ts';
import { Footer } from './components/Footer.ts';
import { ProductModal } from './components/ProductModal.ts';
import { Lightbox } from './components/Lightbox.ts';
import { LettersViewer } from './components/LettersViewer.ts';
import { RfqWizard } from './components/RfqWizard.ts';
import { ChartDashboard } from './components/ChartDashboard.ts';
import { submissionHandler, ContactData } from './utils/submission.ts';
import { db } from './data/db.ts';

// Instantiate layouts
const header = new Header();
const footer = new Footer();

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header and Footer dynamically
  header.init();
  footer.init();

  // Route routing logic based on page URL
  const path = window.location.pathname;

  if (path === '/' || path.endsWith('index.html') || path === '') {
    initHomePage();
  } else if (path.includes('products.html')) {
    initProductsPage();
  } else if (path.includes('partners.html')) {
    initPartnersPage();
  } else if (path.includes('services.html')) {
    initServicesPage();
  } else if (path.includes('rfq.html')) {
    initRfqPage();
  }
  
  // Initialize dynamic scroll reveals
  initScrollReveals();

  // Initialize premium motion / micro-interaction UX system
  initPremiumUXEffects();
});

// ----------------------------------------------------
// Home / Corporate Profile Page Engine
// ----------------------------------------------------
function initHomePage() {
  // Render leadership section
  const leadershipContainer = document.getElementById('leadership-grid');
  if (leadershipContainer) {
    leadershipContainer.innerHTML = db.leadership.map(member => `
      <div class="card" style="padding: var(--spacing-xl); text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-md); font-weight: 700; font-size: 1.5rem;">
          ${member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-secondary); margin-bottom: 4px;">${member.name}</h3>
        <p style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase; margin-bottom: var(--spacing-md);">${member.role}</p>
        <div style="font-size: 0.88rem; color: var(--color-text-muted); display: grid; gap: 6px; margin-bottom: var(--spacing-md);">
          <div><strong>Experience:</strong> ${member.experience}</div>
          <div><strong>Credentials:</strong> ${member.qualification}</div>
        </div>
        <p style="font-size: 0.9rem; color: var(--color-text-main); line-height: 1.5;">${member.description}</p>
      </div>
    `).join('');
  }

  // Render industries served grid
  const industriesGrid = document.getElementById('industries-grid');
  if (industriesGrid) {
    industriesGrid.innerHTML = db.company.industries.map(ind => `
      <div style="padding: var(--spacing-lg); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-main); box-shadow: var(--shadow-sm); transition: transform var(--transition-fast);">
        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-xs);">${ind.name}</h4>
        <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5;">${ind.description}</p>
      </div>
    `).join('');
  }

  // Render manufacturing gallery dynamic masonry grid
  const galleryGrid = document.getElementById('gallery-masonry-grid');
  const galleryFilters = document.getElementById('gallery-filters');
  const lightbox = new Lightbox();

  if (galleryGrid && galleryFilters) {
    let activeFilter = 'all';
    
    const renderGallery = () => {
      const filtered = activeFilter === 'all' 
        ? db.gallery 
        : db.gallery.filter(item => item.category === activeFilter);
      
      if (filtered.length === 0) {
        galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xl); color: var(--color-text-muted);">No images found in this category.</div>`;
        return;
      }

      galleryGrid.innerHTML = filtered.map((item, idx) => `
        <div class="gallery-item-wrapper" data-index="${idx}" style="break-inside: avoid; margin-bottom: var(--spacing-md); position: relative; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; border: 1px solid var(--color-border); background-color: var(--color-bg-alt); transition: all var(--transition-fast);">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" style="width: 100%; display: block; transition: transform var(--transition-medium);" />
          <div class="gallery-caption-overlay" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: var(--spacing-md); background: linear-gradient(transparent, rgba(11,19,41,0.85)); color: white; opacity: 0; transition: opacity var(--transition-medium); pointer-events: none;">
            <p style="font-size: 0.85rem; font-weight: 500; margin-bottom: 2px;">${item.caption}</p>
            <span style="font-size: 0.65rem; text-transform: uppercase; padding: 2px 6px; background: var(--color-primary); border-radius: 2px;">${item.category}</span>
          </div>
        </div>
      `).join('');

      // Add click events to gallery items to trigger lightbox
      const wrappers = galleryGrid.querySelectorAll('.gallery-item-wrapper');
      wrappers.forEach(wrap => {
        wrap.addEventListener('click', () => {
          const index = parseInt(wrap.getAttribute('data-index') || '0', 10);
          lightbox.open(filtered, index);
        });

        // Hover animations
        wrap.addEventListener('mouseenter', () => {
          const img = wrap.querySelector('img');
          const overlay = wrap.querySelector('.gallery-caption-overlay') as HTMLElement;
          if (img) img.style.transform = 'scale(1.05)';
          if (overlay) overlay.style.opacity = '1';
        });
        wrap.addEventListener('mouseleave', () => {
          const img = wrap.querySelector('img');
          const overlay = wrap.querySelector('.gallery-caption-overlay') as HTMLElement;
          if (img) img.style.transform = 'scale(1)';
          if (overlay) overlay.style.opacity = '0';
        });
      });
    };

    // Render filter buttons
    const categories = ['all', 'facilities', 'production', 'visits', 'machines'];
    galleryFilters.innerHTML = categories.map(cat => `
      <button class="btn ${cat === 'all' ? 'btn-primary' : 'btn-outline'}" data-filter="${cat}" style="padding: 6px 16px; font-size: 0.85rem;">
        ${cat.toUpperCase()}
      </button>
    `).join('');

    // Handle filter clicks
    galleryFilters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        galleryFilters.querySelectorAll('button').forEach(b => {
          b.className = 'btn btn-outline';
        });
        const target = e.target as HTMLButtonElement;
        target.className = 'btn btn-primary';
        activeFilter = target.getAttribute('data-filter') || 'all';
        renderGallery();
      });
    });

    renderGallery();
  }

  // Statistics counters animation
  initStatsCounters();

  // Initialize ECharts consolidated bookings performance dashboard
  const performanceDashboard = new ChartDashboard();
  performanceDashboard.init();
}

function initStatsCounters() {
  const statsSection = document.querySelector('.stats-container');
  if (!statsSection) return;

  const stats = [
    { id: 'count-year', target: 2021 },
    { id: 'count-exp', target: 30 }
  ];

  const animate = () => {
    stats.forEach(stat => {
      const el = document.getElementById(stat.id);
      if (!el) return;
      
      let count = 0;
      const speed = stat.target / 100;
      const timer = setInterval(() => {
        count += speed;
        if (count >= stat.target) {
          clearInterval(timer);
          el.innerText = stat.id === 'count-year' ? String(stat.target) : `${stat.target}+`;
        } else {
          el.innerText = stat.id === 'count-year'
            ? String(Math.round(count))
            : `${Math.round(count)}+`;
        }
      }, 15);
    });
  };

  // Intersection Observer to trigger counter on scroll
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animate();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

// ----------------------------------------------------
// Products Catalog Page Engine
// ----------------------------------------------------
function initProductsPage() {
  const gridContainer = document.getElementById('products-catalog-grid');
  const searchInput = document.getElementById('product-search') as HTMLInputElement;
  const tabFilters = document.getElementById('product-tabs');
  const modal = new ProductModal();

  if (!gridContainer) return;

  let activeDivision = 'all';
  let searchQuery = '';

  const renderProducts = () => {
    // Filter logic
    const filtered = db.products.filter(p => {
      const matchesDivision = activeDivision === 'all' || p.division === activeDivision;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery) ||
                            p.overview.toLowerCase().includes(searchQuery) ||
                            p.applications.some(a => a.toLowerCase().includes(searchQuery)) ||
                            p.industries.some(i => i.toLowerCase().includes(searchQuery));
      return matchesDivision && matchesSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xxl) 0;">
          <h4 style="font-size: 1.25rem; font-weight: 700; color: var(--color-secondary);">No products matching filters found.</h4>
          <p style="color: var(--color-text-muted); margin-top: var(--spacing-sm);">Try adjusting your query or resetting filters.</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(p => `
      <div class="card product-card-el" data-id="${p.id}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding: 0;">
        <div style="background-color: var(--color-bg-alt); padding: var(--spacing-md); height: 200px; display: flex; align-items: center; justify-content: center; position: relative;">
          <img src="${p.images[0]}" alt="${p.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
          <span class="badge badge-primary" style="position: absolute; top: var(--spacing-sm); right: var(--spacing-sm); font-size: 0.65rem;">
            ${p.division.toUpperCase()}
          </span>
        </div>
        <div style="padding: var(--spacing-lg); flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm); line-height: 1.3;">${p.name}</h3>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: var(--spacing-md); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
              ${p.overview}
            </p>
          </div>
          <div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: var(--spacing-md);">
              ${p.industries.slice(0, 2).map(ind => `<span class="badge badge-outline" style="font-size: 0.65rem; padding: 2px 6px;">${ind}</span>`).join('')}
              ${p.industries.length > 2 ? `<span class="badge badge-outline" style="font-size: 0.65rem; padding: 2px 6px;">+${p.industries.length - 2} More</span>` : ''}
            </div>
            <button class="btn btn-outline" style="width: 100%; padding: 8px 12px; font-size: 0.85rem;">View Configuration Specifications</button>
          </div>
        </div>
      </div>
    `).join('');

    // Bind card clicks
    const cards = gridContainer.querySelectorAll('.product-card-el');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const product = db.products.find(item => item.id === id);
        if (product) modal.open(product);
      });
    });
  };

  // Search input binder
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
    renderProducts();
  });

  // Tab filter binders
  if (tabFilters) {
    tabFilters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabFilters.querySelectorAll('button').forEach(b => {
          b.className = 'btn btn-outline';
        });
        const target = e.target as HTMLButtonElement;
        target.className = 'btn btn-primary';
        activeDivision = target.getAttribute('data-tab') || 'all';
        renderProducts();
      });
    });
  }

  renderProducts();
}

// ----------------------------------------------------
// Technical Partners Page Engine
// ----------------------------------------------------
function initPartnersPage() {
  const gridContainer = document.getElementById('partners-grid-container');
  const searchInput = document.getElementById('partner-search') as HTMLInputElement;
  const viewer = new LettersViewer();

  if (!gridContainer) return;

  let searchQuery = '';

  const renderPartners = () => {
    const filtered = db.partners.filter(p => {
      return p.name.toLowerCase().includes(searchQuery) ||
             p.overview.toLowerCase().includes(searchQuery) ||
             p.technologies.some(t => t.toLowerCase().includes(searchQuery)) ||
             p.categories.some(c => c.toLowerCase().includes(searchQuery));
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xxl) 0;">
          <h4 style="font-size: 1.25rem; font-weight: 700; color: var(--color-secondary);">No partner matches found.</h4>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(p => {
      const hasCertificate = !!p.certificatePath;
      
      return `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
              <span class="badge badge-primary">${p.country}</span>
              ${p.logo ? `<img src="${p.logo}" alt="${p.name} logo" style="height: 24px; max-width: 100px; object-fit: contain;" />` : `<span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">Strategic Partner</span>`}
            </div>
            
            <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm);">${p.name}</h3>
            <p style="font-size: 0.9rem; color: var(--color-text-main); line-height: 1.6; margin-bottom: var(--spacing-lg);">${p.overview}</p>
            
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-secondary); margin-bottom: 6px;">Represented Technologies:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: var(--spacing-lg);">
              ${p.technologies.map(tech => `<span class="badge badge-outline" style="font-size: 0.72rem; padding: 2px 6px;">${tech}</span>`).join('')}
            </div>

            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-secondary); margin-bottom: 6px;">Engineering Capabilities:</h4>
            <ul style="list-style-type: none; padding-left: 0; margin-bottom: var(--spacing-lg);">
              ${p.engineeringCapabilities.map(cap => `
                <li style="position: relative; padding-left: 18px; font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 4px;">
                  <span style="position: absolute; left: 0; color: var(--color-primary); font-weight: bold;">•</span>${cap}
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div style="border-top: 1px solid var(--color-border); padding-top: var(--spacing-md); display: flex; gap: var(--spacing-sm);">
            ${hasCertificate ? `
              <button class="btn btn-primary view-cert-btn" data-cert="${p.certificatePath}" data-name="${p.name}" style="flex-grow: 1; padding: 8px 12px; font-size: 0.85rem;">
                View Authorization Certificate
              </button>
            ` : `
              <button class="btn btn-outline" style="flex-grow: 1; padding: 8px 12px; font-size: 0.85rem; cursor: not-allowed;" disabled>
                Certificate Renewal in Progress
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Bind certificate viewer buttons
    gridContainer.querySelectorAll('.view-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cert = btn.getAttribute('data-cert') || '';
        const name = btn.getAttribute('data-name') || '';
        viewer.open(cert, name);
      });
    });
  };

  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
    renderPartners();
  });

  renderPartners();
}

// ----------------------------------------------------
// IT & Consultancies Services Page Engine
// ----------------------------------------------------
function initServicesPage() {
  const imgIt = document.getElementById('hub-img-it') as HTMLImageElement;
  const imgMfg = document.getElementById('hub-img-mfg') as HTMLImageElement;
  const imgMld = document.getElementById('hub-img-mld') as HTMLImageElement;

  if (imgIt) {
    const itItem = db.gallery.find(g => g.id === 'g4');
    if (itItem) imgIt.src = itItem.src;
  }
  if (imgMfg) {
    const mfgItem = db.products.find(p => p.id === 'hydraulic-qmc');
    if (mfgItem) imgMfg.src = mfgItem.images[0];
  }
  if (imgMld) {
    const mldItem = db.products.find(p => p.id === 'automotive-moulds');
    if (mldItem) imgMld.src = mldItem.images[0];
  }

  // Bind click for the Hub cards
  const hubCardIt = document.getElementById('hub-card-it');
  const hubCardMfg = document.getElementById('hub-card-mfg');
  const hubCardMld = document.getElementById('hub-card-mld');

  if (hubCardIt) {
    hubCardIt.addEventListener('click', () => {
      const el = document.getElementById('sec-it-ites');
      if (el) {
        const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - 130;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      window.history.pushState(null, '', '#sec-it-ites');
    });
  }
  if (hubCardMfg) {
    hubCardMfg.addEventListener('click', () => {
      const el = document.getElementById('sec-manufacturing');
      if (el) {
        const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - 130;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      window.history.pushState(null, '', '#sec-manufacturing');
    });
  }
  if (hubCardMld) {
    hubCardMld.addEventListener('click', () => {
      const el = document.getElementById('sec-moulding');
      if (el) {
        const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - 130;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      window.history.pushState(null, '', '#sec-moulding');
    });
  }

  // Render Section 1: IT / ITES services
  const itGrid = document.getElementById('it-services-grid');
  if (itGrid) {
    itGrid.innerHTML = db.services.map(s => `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
        <div>
          <div style="width: 50px; height: 50px; border-radius: var(--radius-md); background-color: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-md); font-weight: 700; font-size: 1.25rem;">
            ${s.icon === 'database' ? '🗄️' : s.icon === 'server' ? '💻' : s.icon === 'link' ? '🔗' : s.icon === 'tool' ? '🛠️' : s.icon === 'award' ? '🏆' : '🌐'}
          </div>
          <div style="margin-bottom: var(--spacing-xs);">
            <span class="badge badge-primary" style="font-size: 0.65rem;">${s.category}</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm); line-height: 1.3;">${s.title}</h3>
          <p style="font-size: 0.88rem; color: var(--color-text-main); line-height: 1.6; margin-bottom: var(--spacing-md);">${s.description}</p>
          
          <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--color-secondary); margin-bottom: 6px;">Key Service Activities:</h4>
          <ul style="list-style-type: none; padding-left: 0; margin-bottom: var(--spacing-md);">
            ${s.details.map(det => `
              <li style="position: relative; padding-left: 14px; font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 4px;">
                <span style="position: absolute; left: 0; color: var(--color-primary); font-weight: bold;">•</span>${det}
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div style="border-top: 1px solid var(--color-border); padding-top: var(--spacing-md); margin-top: var(--spacing-sm);">
          <a href="rfq.html?category=${encodeURIComponent(s.title)}" class="btn btn-outline" style="width: 100%; text-align: center; font-size: 0.85rem; padding: 8px 12px;">Enquire About Service</a>
        </div>
      </div>
    `).join('');
  }

  // Render Section 2: Manufacturing & Section 3: Moulding
  const mfgGrid = document.getElementById('mfg-services-grid');
  const mldGrid = document.getElementById('mld-services-grid');
  
  const modal = new ProductModal();

  const renderProductGrid = (targetGrid: HTMLElement | null, divisionName: string) => {
    if (!targetGrid) return;
    const items = db.products.filter(p => p.division === divisionName);
    
    targetGrid.innerHTML = items.map(p => `
      <div class="card product-card-el" data-id="${p.id}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding: 0; height: 100%;">
        <div style="background-color: var(--color-bg-alt); padding: var(--spacing-md); height: 180px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid var(--color-border);">
          <img src="${p.images[0]}" alt="${p.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
        </div>
        <div style="padding: var(--spacing-lg); flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm); line-height: 1.3;">${p.name}</h3>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: var(--spacing-md); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
              ${p.overview}
            </p>
            
            <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-secondary); margin-bottom: 4px;">Applications:</h4>
            <ul style="list-style-type: none; padding-left: 0; margin-bottom: var(--spacing-md);">
              ${p.applications.slice(0, 3).map(app => `
                <li style="position: relative; padding-left: 14px; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 2px;">
                  <span style="position: absolute; left: 0; color: var(--color-primary); font-weight: bold;">•</span>${app}
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: var(--spacing-md);">
              ${p.industries.map(ind => `<span class="badge badge-outline" style="font-size: 0.65rem; padding: 2px 6px;">${ind}</span>`).join('')}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xs);">
              <button class="btn btn-outline btn-view-spec" data-id="${p.id}" style="padding: 8px 6px; font-size: 0.78rem; border-color: var(--color-primary); color: var(--color-primary);">Specifications</button>
              <a href="rfq.html?category=${encodeURIComponent(p.name)}" class="btn btn-primary" style="padding: 8px 6px; font-size: 0.78rem; text-align: center;">Send Enquiry</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Bind card body click to open specs modal
    targetGrid.querySelectorAll('.product-card-el').forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('a') || target.classList.contains('btn-primary')) {
          return;
        }
        const id = card.getAttribute('data-id');
        const product = db.products.find(item => item.id === id);
        if (product) modal.open(product);
      });
    });
  };

  renderProductGrid(mfgGrid, 'manufacturing');
  renderProductGrid(mldGrid, 'moulding');

  // Sticky Scroll Spy logic
  initStickyNavScrollSpy();
}

function initStickyNavScrollSpy() {
  const sections = [
    document.getElementById('sec-it-ites'),
    document.getElementById('sec-manufacturing'),
    document.getElementById('sec-moulding')
  ];

  const navLinks = {
    'sec-it-ites': document.getElementById('nav-link-it'),
    'sec-manufacturing': document.getElementById('nav-link-mfg'),
    'sec-moulding': document.getElementById('nav-link-mld')
  };

  // Add click scrolling to sticky links
  Object.keys(navLinks).forEach(id => {
    const link = navLinks[id as keyof typeof navLinks];
    const section = document.getElementById(id);
    if (link && section) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const headerOffset = 130;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        Object.values(navLinks).forEach(l => l?.classList.remove('active'));
        link.classList.add('active');

        window.history.pushState(null, '', `#${id}`);
      });
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '-140px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id && navLinks[id as keyof typeof navLinks]) {
          Object.values(navLinks).forEach(l => l?.classList.remove('active'));
          navLinks[id as keyof typeof navLinks]?.classList.add('active');
          window.history.pushState(null, '', `#${id}`);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    if (sec) observer.observe(sec);
  });
}

// ----------------------------------------------------
// RFQ & Contact Form Page Engine
// ----------------------------------------------------
function initRfqPage() {
  // Initialize multi-step RFQ wizard
  const wizard = new RfqWizard();
  wizard.init();

  // Initialize Contact form validation & submission
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  const statusLog = document.getElementById('contact-status-log');
  const submitBtn = document.getElementById('contact-submit-btn') as HTMLButtonElement;

  if (contactForm) {
    const nameEl = document.getElementById('contact-name') as HTMLInputElement;
    const companyEl = document.getElementById('contact-company') as HTMLInputElement;
    const emailEl = document.getElementById('contact-email') as HTMLInputElement;
    const subjectEl = document.getElementById('contact-subject') as HTMLInputElement;
    const phoneEl = document.getElementById('contact-phone') as HTMLInputElement;
    const messageEl = document.getElementById('contact-message') as HTMLTextAreaElement;
    const hpEl = document.getElementById('contact-hp-field') as HTMLInputElement;

    // Prefill subject from URL query parameter if available
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && subjectEl) {
      subjectEl.value = `Enquiry about: ${categoryParam}`;
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic Honeypot spam protection
      if (hpEl && hpEl.value) {
        console.warn("Honeypot filled! Spam submission blocked.");
        // Simulate a successful response to the spam bot to prevent retries
        if (statusLog) {
          statusLog.style.display = 'block';
          statusLog.style.backgroundColor = '#ECFDF5';
          statusLog.style.borderColor = '#10B981';
          statusLog.style.color = '#047857';
          statusLog.innerText = "Thank you! Your message has been sent successfully.";
        }
        contactForm.reset();
        return;
      }

      const data: ContactData = {
        name: nameEl?.value || "",
        company: companyEl?.value || "",
        email: emailEl?.value || "",
        subject: subjectEl?.value || "",
        phone: phoneEl?.value || "",
        message: messageEl?.value || ""
      };

      // Form validation check
      let hasError = false;

      if (!data.name) {
        nameEl.classList.add('is-invalid');
        hasError = true;
      } else {
        nameEl.classList.remove('is-invalid');
      }

      if (!data.email || !submissionHandler.validateEmail(data.email)) {
        emailEl.classList.add('is-invalid');
        hasError = true;
      } else {
        emailEl.classList.remove('is-invalid');
      }

      if (!data.subject) {
        subjectEl.classList.add('is-invalid');
        hasError = true;
      } else {
        subjectEl.classList.remove('is-invalid');
      }

      if (!data.phone || !submissionHandler.validatePhone(data.phone)) {
        phoneEl.classList.add('is-invalid');
        hasError = true;
      } else {
        phoneEl.classList.remove('is-invalid');
      }

      if (hasError) return;

      // Submit
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending Message...";
      }

      if (statusLog) {
        statusLog.style.display = 'block';
        statusLog.style.backgroundColor = '#EFF6FF';
        statusLog.style.borderColor = '#3B82F6';
        statusLog.style.color = '#1D4ED8';
        statusLog.innerText = "Dispatching email to servers...";
      }

      try {
        const response = await submissionHandler.submitContact(data);
        if (response.success) {
          if (statusLog) {
            statusLog.style.backgroundColor = '#ECFDF5';
            statusLog.style.borderColor = '#10B981';
            statusLog.style.color = '#047857';
            statusLog.innerText = response.message;
          }
          if (submitBtn) {
            submitBtn.innerText = "Message Dispatched";
          }
          // Display premium toast notification
          showToast("Enquiry Dispatched Successfully!", "success");
          contactForm.reset();
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        const errMsg = err.message || 'Submission failed.';
        if (statusLog) {
          statusLog.style.backgroundColor = '#FEF2F2';
          statusLog.style.borderColor = '#EF4444';
          statusLog.style.color = '#B91C1C';
          statusLog.innerText = `Error: ${errMsg}`;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Send Message";
        }
        // Display premium toast warning
        showToast(`Failed: ${errMsg}`, "error");
      }
    });
  }
}

// ----------------------------------------------------
// ----------------------------------------------------
// Scroll Reveal Engine using Intersection Observer
// ----------------------------------------------------
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).style.opacity = '1';
        (entry.target as HTMLElement).style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    (el as HTMLElement).style.opacity = '0';
    (el as HTMLElement).style.transform = 'translateY(25px)';
    (el as HTMLElement).style.transition = 'opacity var(--transition-slow), transform var(--transition-slow)';
    observer.observe(el);
  });
}

// ----------------------------------------------------
// Reusable Custom Toast Alert Notification System
// ----------------------------------------------------
export function showToast(message: string, type: 'success' | 'error' = 'success') {
  let container = document.getElementById('toast-container-box');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container-box';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-alert ${type}`;
  toast.innerHTML = `
    <span style="font-size: 0.9rem; font-weight: 600;">${message}</span>
    <button class="toast-alert-close" aria-label="Close Notification">&times;</button>
    <div class="toast-progress-bar"></div>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-alert-close');
  closeBtn?.addEventListener('click', () => {
    toast.style.animation = 'toast-slide-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => toast.remove(), 400);
  });

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toast-slide-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 400);
    }
  }, 4000);
}

// Bind to window for global script triggers
(window as any).showToast = showToast;

// ----------------------------------------------------
// Premium Micro-Interactions & Cursor Effects
// ----------------------------------------------------
function initPremiumUXEffects() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  
  if (isFinePointer) {
    initCursorSpotlightAndTilts();
    initMagneticButtons();
  }

  initButtonRipples();
  initScrollProgressAndBackToTop();
}

function initCursorSpotlightAndTilts() {
  // Select cards across the site selectively
  const cards = document.querySelectorAll('.tilt-card, .card, .product-card-el, .partner-card, .leadership-card');
  
  cards.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = card.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt calculation (max 3 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 3; 
      const rotateY = ((x - centerX) / centerX) * 3; 

      (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      (card as HTMLElement).style.boxShadow = 'var(--shadow-hover)';
    });

    card.addEventListener('mouseleave', () => {
      (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      (card as HTMLElement).style.boxShadow = '';
    });
  });
}

function initMagneticButtons() {
  const magnets = document.querySelectorAll('.btn-magnetic');
  
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = btn.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      // Pull button slightly towards mouse (max 8px)
      (btn as HTMLElement).style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      (btn as HTMLElement).style.transform = 'translate(0px, 0px)';
    });
  });
}

function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn, button[type="submit"]');
  
  buttons.forEach(btn => {
    const htmlBtn = btn as HTMLElement;
    if (window.getComputedStyle(htmlBtn).position === 'static') {
      htmlBtn.style.position = 'relative';
    }

    btn.addEventListener('click', (e: Event) => {
      const clickEvent = e as MouseEvent;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      
      const x = clickEvent.clientX - rect.left;
      const y = clickEvent.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      const existing = btn.querySelector('.btn-ripple');
      if (existing) existing.remove();

      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
}

function initScrollProgressAndBackToTop() {
  const progressIndicator = document.createElement('div');
  progressIndicator.id = 'scroll-progress-indicator';
  document.body.appendChild(progressIndicator);

  const backToTop = document.createElement('div');
  backToTop.id = 'back-to-top-container';
  backToTop.innerHTML = `
    <svg>
      <circle class="bg" cx="24" cy="24" r="22.5"></circle>
      <circle class="progress" cx="24" cy="24" r="22.5"></circle>
    </svg>
    <span class="back-to-top-arrow">▲</span>
  `;
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (docHeight <= 0) return;

    const scrollPercent = (scrollTop / docHeight) * 100;

    progressIndicator.style.width = `${scrollPercent}%`;

    if (scrollTop > 200) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    const perimeter = 141.37;
    const progressOffset = perimeter - (scrollPercent / 100) * perimeter;
    const progressCircle = backToTop.querySelector('circle.progress') as SVGGeometryElement;
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = `${progressOffset}`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
