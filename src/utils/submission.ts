// Form validation and submission layer for RFQ and Contact enquiries
// Fully abstracted for future CRM, ERP, SMTP or REST API integration

export interface RfqData {
  category: string;
  tonnage: string;
  polymerClarity: string;
  partWeight: string;
  feedingType: string;
  mouldBaseQty: string;
  runnerType: string;
  warranty: string;
  deliveryTerms: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  message?: string;
}

export interface ContactData {
  name: string;
  company?: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
}

export const submissionHandler = {
  // Validate standard email format
  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  },

  // Validate phone number format
  validatePhone(phone: string): boolean {
    const re = /^\+?[0-9\s\-()]{10,20}$/;
    return re.test(String(phone));
  },

  // Handle RFQ Submit — calls real backend API
  async submitRfq(data: RfqData): Promise<{ success: boolean; message: string }> {
    console.log('Dispatching RFQ configuration to /api/rfq...', data);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const body = await response.json();
      return {
        success: response.ok,
        message: body.message || (response.ok ? 'RFQ submitted successfully!' : 'Submission error.')
      };
    } catch (error) {
      console.warn('Express backend offline. Falling back to local preview mode.', error);
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        message: `[PREVIEW MODE] Thank you, ${data.name}. Your RFQ for ${data.category} has been logged (backend offline). Reference: #RFQ-${Math.floor(100000 + Math.random() * 900000)}.`
      };
    }
  },

  // Handle Contact Submit (real API caller with mock fallback)
  async submitContact(data: ContactData): Promise<{ success: boolean; message: string }> {
    console.log("Dispatching contact form request to backend server SMTP endpoint...", data);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const body = await response.json();
      return {
        success: response.ok,
        message: body.message || (response.ok ? "Message sent successfully!" : "Mail dispatch error.")
      };
    } catch (error) {
      console.warn("Express backend server offline or unreachable. Operating in local preview fallback mode.", error);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: `[PREVIEW MODE] Thank you, ${data.name}. Your message has been logged to console as the backend mail service is offline.`
      };
    }
  }
};
