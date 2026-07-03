// Dynamic Reusable Footer Component
import { db } from '../data/db.ts';

export class Footer {
  render() {
    const footerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col" style="grid-column: span 1.5;">
            <div class="footer-logo" style="background: white; padding: 6px 12px; border-radius: var(--radius-md); display: inline-block; margin-bottom: var(--spacing-sm);">
              <img src="${db.company.logo}" alt="${db.company.name} Logo" style="height: 32px; width: auto; object-fit: contain;" />
            </div>
            <p class="footer-description" style="color: #94A3B8; max-width: 320px; font-size: 0.88rem; margin-top: var(--spacing-sm);">
              ${db.company.overview}
            </p>
          </div>
          
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="products.html">Product Portfolio</a></li>
              <li><a href="partners.html">Technical Partners</a></li>
              <li><a href="services.html">IT & Consultancies</a></li>
              <li><a href="rfq.html">Request a Quote</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Solutions Area</h4>
            <ul class="footer-links">
              <li><a href="products.html">Quick Mold Change</a></li>
              <li><a href="products.html">Screw & Barrels</a></li>
              <li><a href="products.html">Mould Cleaning Units</a></li>
              <li><a href="products.html">Injection Moulds</a></li>
              <li><a href="services.html">SAP/ERP Migrations</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Contact Details</h4>
            <ul class="footer-contact-list">
              <li>
                <strong>Registered Address:</strong><br>
                ${db.company.address.registered}
              </li>
              <li style="margin-top: var(--spacing-sm);">
                <strong>Email:</strong><br>
                <a href="mailto:${db.company.emails[0]}" style="color: var(--color-primary-light);">${db.company.emails[0]}</a>
              </li>
              <li style="margin-top: var(--spacing-xs);">
                <strong>Phone:</strong><br>
                ${db.company.phones.join(' | ')}
              </li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} Allied-Iconic Pvt. Ltd. (Allied Infotech Division). All rights reserved.</p>
          <div class="footer-bottom-links">
            <a href="#" style="margin-right: var(--spacing-md);">Use Plastics Responsibly</a>
            <a href="#">Promote Recycling</a>
          </div>
        </div>
      </div>
    `;
    
    return footerHTML;
  }

  init() {
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;
    
    footerEl.innerHTML = this.render();
  }
}
