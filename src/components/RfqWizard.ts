// Dynamic Multi-Step RFQ Checklist Wizard Component
import { submissionHandler, RfqData } from '../utils/submission.ts';

export class RfqWizard {
  private wizardDom: HTMLElement | null = null;
  private currentStep: number = 1;
  private totalSteps: number = 4;
  
  // Wizard State values
  private rfqState: Partial<RfqData> = {
    category: "",
    tonnage: "100 Tons - 250 Tons",
    polymerClarity: "Standard",
    partWeight: "",
    feedingType: "Manual Feeding",
    mouldBaseQty: "1",
    runnerType: "Hot Runner (HRS)",
    warranty: "1 Year Standard",
    deliveryTerms: "FOR Destination"
  };

  public init() {
    this.wizardDom = document.getElementById('rfq-wizard-container');
    if (!this.wizardDom) return;

    // Parse URL for prefilled Category parameter
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      this.rfqState.category = categoryParam;
    }

    this.renderStep();
  }

  private renderStep() {
    if (!this.wizardDom) return;

    // Progress Bar HTML
    const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    const progressHTML = `
      <div style="margin-bottom: var(--spacing-xl);">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: var(--spacing-sm);">
          <span>Step ${this.currentStep} of ${this.totalSteps}</span>
          <span>${Math.round(progressPercent)}% Completed</span>
        </div>
        <div style="width: 100%; height: 6px; background-color: var(--color-border); border-radius: var(--radius-sm); overflow: hidden;">
          <div style="width: ${progressPercent}%; height: 100%; background-color: var(--color-primary); transition: width var(--transition-medium);"></div>
        </div>
      </div>
    `;

    let stepContentHTML = "";

    switch (this.currentStep) {
      case 1:
        stepContentHTML = this.getStep1HTML();
        break;
      case 2:
        stepContentHTML = this.getStep2HTML();
        break;
      case 3:
        stepContentHTML = this.getStep3HTML();
        break;
      case 4:
        stepContentHTML = this.getStep4HTML();
        break;
    }

    // Wrap together
    this.wizardDom.innerHTML = `
      ${progressHTML}
      <div class="card" style="box-shadow: var(--shadow-md);">
        ${stepContentHTML}
        
        <!-- Controls Buttons -->
        <div style="display: flex; justify-content: space-between; margin-top: var(--spacing-xl); border-top: 1px solid var(--color-border); padding-top: var(--spacing-md);">
          ${this.currentStep > 1 ? `
            <button id="rfq-prev-btn" class="btn btn-outline" style="padding: 8px 20px;">&larr; Back</button>
          ` : `<span></span>`}
          
          ${this.currentStep < this.totalSteps ? `
            <button id="rfq-next-btn" class="btn btn-primary" style="padding: 8px 24px;">Next Step &rarr;</button>
          ` : `
            <button id="rfq-submit-btn" class="btn btn-primary" style="padding: 8px 32px;">Submit RFQ Configuration</button>
          `}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private getStep1HTML(): string {
    const categories = [
      "Horizontal Injection Moulding Machine",
      "Vertical Injection Moulding Machine",
      "Hydraulic QMC Clamping System",
      "Magnetic QMC Clamping System",
      "Nitrided / Bi-metallic Screw Barrel",
      "Mould Cleaning Descaling Machine HF-2ZL",
      "Industrial Mould Tooling"
    ];

    return `
      <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm);">Select Machinery / Mould Division</h3>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: var(--spacing-lg);">Select the core product division you are requesting configuration specifications for.</p>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-sm);">
        ${categories.map(cat => `
          <label style="display: flex; align-items: center; padding: var(--spacing-md); border: 1px solid ${this.rfqState.category === cat ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius: var(--radius-md); background-color: ${this.rfqState.category === cat ? 'var(--color-primary-light)' : 'var(--color-bg-main)'}; cursor: pointer; transition: all var(--transition-fast);">
            <input type="radio" name="rfq-cat" value="${cat}" ${this.rfqState.category === cat ? 'checked' : ''} style="margin-right: var(--spacing-md); width: 18px; height: 18px; accent-color: var(--color-primary);" />
            <div>
              <strong style="color: var(--color-secondary); font-size: 0.95rem;">${cat}</strong>
            </div>
          </label>
        `).join('')}
      </div>
      <div id="step-error" style="color: var(--color-error); font-size: 0.85rem; margin-top: 10px; display: none;">Please select a category to proceed.</div>
    `;
  }

  private getStep2HTML(): string {
    return `
      <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm);">Configure Technical Parameters</h3>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: var(--spacing-lg);">Provide structural constraints to calculate custom operational tooling parameters.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label">Estimated Machine Tonnage Requirements</label>
          <select id="rfq-tonnage" class="form-control">
            <option value="15 Tons - 80 Tons" ${this.rfqState.tonnage === "15 Tons - 80 Tons" ? 'selected' : ''}>Small Scale (15T - 80T)</option>
            <option value="100 Tons - 250 Tons" ${this.rfqState.tonnage === "100 Tons - 250 Tons" ? 'selected' : ''}>Standard Precision (100T - 250T)</option>
            <option value="300 Tons - 600 Tons" ${this.rfqState.tonnage === "300 Tons - 600 Tons" ? 'selected' : ''}>Heavy Duty (300T - 600T)</option>
            <option value="800 Tons - 2200 Tons" ${this.rfqState.tonnage === "800 Tons - 2200 Tons" ? 'selected' : ''}>Mega Capacity (800T - 2200T)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Polymer Classification & Clarity</label>
          <select id="rfq-polymer" class="form-control">
            <option value="Standard" ${this.rfqState.polymerClarity === "Standard" ? 'selected' : ''}>Standard Commodity (PP, PE, PS)</option>
            <option value="Transparent" ${this.rfqState.polymerClarity === "Transparent" ? 'selected' : ''}>High Clarity / Optical (PC, PMMA, PET)</option>
            <option value="Corrosive" ${this.rfqState.polymerClarity === "Corrosive" ? 'selected' : ''}>Corrosive / Abrasive (PVC, Glass-filled Nylon)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Part Weight & Estimated Shot Size (g)</label>
          <input type="text" id="rfq-weight" class="form-control" placeholder="E.g., 120g per shot" value="${this.rfqState.partWeight || ''}" />
        </div>

        <div class="form-group">
          <label class="form-label">Production Cycle Feeding Style</label>
          <select id="rfq-feeding" class="form-control">
            <option value="Manual Feeding" ${this.rfqState.feedingType === "Manual Feeding" ? 'selected' : ''}>Manual Loading / Off-take</option>
            <option value="Auto Hopper" ${this.rfqState.feedingType === "Auto Hopper" ? 'selected' : ''}>Automated Hopper Loader</option>
            <option value="Robotic Take-Out" ${this.rfqState.feedingType === "Robotic Take-Out" ? 'selected' : ''}>Robotic Arm Take-Out cell</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Runner Manifold Preferences</label>
          <select id="rfq-runner" class="form-control">
            <option value="Hot Runner (HRS)" ${this.rfqState.runnerType === "Hot Runner (HRS)" ? 'selected' : ''}>Integrated Hot Runner system (HRS)</option>
            <option value="Cold Runner" ${this.rfqState.runnerType === "Cold Runner" ? 'selected' : ''}>Standard Cold Runner plate</option>
            <option value="HRS + HRTC" ${this.rfqState.runnerType === "HRS + HRTC" ? 'selected' : ''}>Hot Runner with Smart Temperature Control (HRTC)</option>
          </select>
        </div>
      </div>
    `;
  }

  private getStep3HTML(): string {
    return `
      <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm);">Commercial & Logistics Settings</h3>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: var(--spacing-lg);">Align commercial service parameters for delivery and quality guarantees.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
        <div class="form-group">
          <label class="form-label">Warranty Option</label>
          <select id="rfq-warranty" class="form-control">
            <option value="1 Year Standard" ${this.rfqState.warranty === "1 Year Standard" ? 'selected' : ''}>1 Year Standard Parts & Service</option>
            <option value="2 Year Extended" ${this.rfqState.warranty === "2 Year Extended" ? 'selected' : ''}>2 Years Extended Service warranty</option>
            <option value="Cycle Count Guarantee" ${this.rfqState.warranty === "Cycle Count Guarantee" ? 'selected' : ''}>Guaranteed Shots/Cycles count basis</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Delivery Terms</label>
          <select id="rfq-delivery" class="form-control">
            <option value="FOR Destination" ${this.rfqState.deliveryTerms === "FOR Destination" ? 'selected' : ''}>Free on Road (FOR Chennai / Destination)</option>
            <option value="Ex-Works" ${this.rfqState.deliveryTerms === "Ex-Works" ? 'selected' : ''}>Ex-Works (Principal Factory Outlet)</option>
          </select>
        </div>
      </div>
      
      <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background-color: var(--color-primary-light); border-radius: var(--radius-md);">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary); margin-bottom: var(--spacing-xs);">Current Configuration Review:</h4>
        <div style="font-size: 0.85rem; color: var(--color-text-main);">
          • <strong>Product Category:</strong> ${this.rfqState.category}<br>
          • <strong>Tonnage / Feeding:</strong> ${this.rfqState.tonnage} | ${this.rfqState.feedingType}<br>
          • <strong>Manifolds / Runner:</strong> ${this.rfqState.runnerType}<br>
          • <strong>Logistics:</strong> ${this.rfqState.deliveryTerms} (${this.rfqState.warranty} Warranty)
        </div>
      </div>
    `;
  }

  private getStep4HTML(): string {
    return `
      <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--color-secondary); margin-bottom: var(--spacing-sm);">Contact & Submit Enquiry</h3>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: var(--spacing-lg);">Please enter your enterprise contact details to validate the request configuration.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
        <div class="form-group">
          <label class="form-label" for="rfq-name">Full Name *</label>
          <input type="text" id="rfq-name" class="form-control" required value="${this.rfqState.name || ''}" />
          <div class="invalid-feedback">Name is required.</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="rfq-email">Business Email *</label>
          <input type="email" id="rfq-email" class="form-control" required value="${this.rfqState.email || ''}" />
          <div class="invalid-feedback">Valid business email is required.</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="rfq-company">Company Name *</label>
          <input type="text" id="rfq-company" class="form-control" required value="${this.rfqState.company || ''}" />
          <div class="invalid-feedback">Company name is required.</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="rfq-phone">Contact Phone *</label>
          <input type="tel" id="rfq-phone" class="form-control" required value="${this.rfqState.phone || ''}" />
          <div class="invalid-feedback">Valid phone number is required.</div>
        </div>

        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label" for="rfq-message">Additional Project Requirements</label>
          <textarea id="rfq-message" class="form-control" rows="3" placeholder="Enter special requests, cavity configurations, or material notes...">${this.rfqState.message || ''}</textarea>
        </div>
      </div>
      <div id="submit-status-log" style="font-size:0.9rem; margin-top:10px; display:none; padding:10px; border-radius:4px;"></div>
    `;
  }

  private bindEvents() {
    if (!this.wizardDom) return;

    // Radio category clicks
    const radios = this.wizardDom.querySelectorAll('input[name="rfq-cat"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = (e.target as HTMLInputElement).value;
        this.rfqState.category = val;
        // visual update border
        this.wizardDom?.querySelectorAll('label').forEach(lbl => {
          lbl.style.borderColor = 'var(--color-border)';
          lbl.style.backgroundColor = 'var(--color-bg-main)';
        });
        const targetLbl = (e.target as HTMLElement).parentElement;
        if (targetLbl) {
          targetLbl.style.borderColor = 'var(--color-primary)';
          targetLbl.style.backgroundColor = 'var(--color-primary-light)';
        }
      });
    });

    // Step 2 parameters change
    this.wizardDom.querySelector('#rfq-tonnage')?.addEventListener('change', (e) => {
      this.rfqState.tonnage = (e.target as HTMLSelectElement).value;
    });
    this.wizardDom.querySelector('#rfq-polymer')?.addEventListener('change', (e) => {
      this.rfqState.polymerClarity = (e.target as HTMLSelectElement).value;
    });
    this.wizardDom.querySelector('#rfq-weight')?.addEventListener('input', (e) => {
      this.rfqState.partWeight = (e.target as HTMLInputElement).value;
    });
    this.wizardDom.querySelector('#rfq-feeding')?.addEventListener('change', (e) => {
      this.rfqState.feedingType = (e.target as HTMLSelectElement).value;
    });
    this.wizardDom.querySelector('#rfq-runner')?.addEventListener('change', (e) => {
      this.rfqState.runnerType = (e.target as HTMLSelectElement).value;
    });

    // Step 3 logistics change
    this.wizardDom.querySelector('#rfq-warranty')?.addEventListener('change', (e) => {
      this.rfqState.warranty = (e.target as HTMLSelectElement).value;
    });
    this.wizardDom.querySelector('#rfq-delivery')?.addEventListener('change', (e) => {
      this.rfqState.deliveryTerms = (e.target as HTMLSelectElement).value;
    });

    // Buttons routing
    this.wizardDom.querySelector('#rfq-prev-btn')?.addEventListener('click', () => {
      this.currentStep = Math.max(1, this.currentStep - 1);
      this.renderStep();
    });

    this.wizardDom.querySelector('#rfq-next-btn')?.addEventListener('click', () => {
      if (this.currentStep === 1 && !this.rfqState.category) {
        const errorEl = document.getElementById('step-error');
        if (errorEl) errorEl.style.display = 'block';
        return;
      }
      this.currentStep = Math.min(this.totalSteps, this.currentStep + 1);
      this.renderStep();
    });

    this.wizardDom.querySelector('#rfq-submit-btn')?.addEventListener('click', () => {
      this.handleSubmit();
    });
  }

  private async handleSubmit() {
    if (!this.wizardDom) return;
    
    // Save Step 4 contact inputs
    const nameEl = this.wizardDom.querySelector('#rfq-name') as HTMLInputElement;
    const emailEl = this.wizardDom.querySelector('#rfq-email') as HTMLInputElement;
    const companyEl = this.wizardDom.querySelector('#rfq-company') as HTMLInputElement;
    const phoneEl = this.wizardDom.querySelector('#rfq-phone') as HTMLInputElement;
    const messageEl = this.wizardDom.querySelector('#rfq-message') as HTMLTextAreaElement;

    this.rfqState.name = nameEl?.value || "";
    this.rfqState.email = emailEl?.value || "";
    this.rfqState.company = companyEl?.value || "";
    this.rfqState.phone = phoneEl?.value || "";
    this.rfqState.message = messageEl?.value || "";

    // Validation checks
    let hasError = false;
    
    if (!this.rfqState.name) {
      nameEl.classList.add('is-invalid');
      hasError = true;
    } else {
      nameEl.classList.remove('is-invalid');
    }

    if (!this.rfqState.email || !submissionHandler.validateEmail(this.rfqState.email)) {
      emailEl.classList.add('is-invalid');
      hasError = true;
    } else {
      emailEl.classList.remove('is-invalid');
    }

    if (!this.rfqState.company) {
      companyEl.classList.add('is-invalid');
      hasError = true;
    } else {
      companyEl.classList.remove('is-invalid');
    }

    if (!this.rfqState.phone || !submissionHandler.validatePhone(this.rfqState.phone)) {
      phoneEl.classList.add('is-invalid');
      hasError = true;
    } else {
      phoneEl.classList.remove('is-invalid');
    }

    if (hasError) return;

    // Show loading state
    const submitBtn = document.getElementById('rfq-submit-btn') as HTMLButtonElement;
    const statusLog = document.getElementById('submit-status-log');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Processing configuration...";
    }
    
    if (statusLog) {
      statusLog.style.display = 'block';
      statusLog.style.backgroundColor = '#EFF6FF';
      statusLog.style.color = '#1D4ED8';
      statusLog.innerText = "Dispatching RFQ checklist details to sales CRM...";
    }

    try {
      const response = await submissionHandler.submitRfq(this.rfqState as RfqData);
      
      if (response.success) {
        if (statusLog) {
          statusLog.style.backgroundColor = '#ECFDF5';
          statusLog.style.color = '#047857';
          statusLog.innerHTML = `
            <strong>Success!</strong> ${response.message}<br>
            <button id="copy-summary-btn" class="btn btn-outline" style="padding:4px 8px; margin-top:8px; font-size:0.75rem; background:white;">Copy Config Summary to Clipboard</button>
          `;
          
          // Clipboard copy logic
          statusLog.querySelector('#copy-summary-btn')?.addEventListener('click', () => {
            const summaryText = `
RFQ Configuration Summary:
-------------------------
Category: ${this.rfqState.category}
Tonnage: ${this.rfqState.tonnage}
Polymer: ${this.rfqState.polymerClarity}
Part Weight: ${this.rfqState.partWeight}
Feeding Type: ${this.rfqState.feedingType}
Manifolds: ${this.rfqState.runnerType}
Warranty: ${this.rfqState.warranty}
Delivery: ${this.rfqState.deliveryTerms}
Company: ${this.rfqState.company}
Contact Name: ${this.rfqState.name}
            `.trim();
            navigator.clipboard.writeText(summaryText);
            alert("Configuration summary copied successfully!");
          });
        }
        if (submitBtn) {
          submitBtn.innerText = "Configuration Submitted";
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      if (statusLog) {
        statusLog.style.backgroundColor = '#FEF2F2';
        statusLog.style.color = '#B91C1C';
        statusLog.innerText = `Error: ${err.message || 'Submission failed.'}`;
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Retry Submission";
      }
    }
  }
}
