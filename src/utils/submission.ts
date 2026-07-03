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

  // Handle RFQ Submit (abstracted API caller)
  async submitRfq(data: RfqData): Promise<{ success: boolean; message: string }> {
    console.log("Submitting RFQ configuration data to backend CRM/ERP/SMTP API...", data);
    
    // Simulate API network roundtrip latency (1200ms)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simple failure validation simulation for debugging
    if (data.email.includes("fail")) {
      return {
        success: false,
        message: "Server Connection Timeout. Please check your network and try again."
      };
    }

    // Success response
    return {
      success: true,
      message: `Thank you, ${data.name}. Your RFQ for ${data.category} has been logged. Reference ticket ID: #RFQ-${Math.floor(100000 + Math.random() * 900000)}.`
    };
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
