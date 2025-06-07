export interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
}

export const emailService = {
  async sendBill(
    customerEmail: string,
    billData: any,
    businessInfo: any
  ): Promise<EmailResult> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate 95% success rate
      if (Math.random() > 0.05) {
        console.log('📧 Email sent successfully to:', customerEmail);
        console.log('Bill Details:', {
          billNumber: billData.billNumber,
          total: `₹${billData.total.toFixed(2)}`,
          items: billData.items.length,
          business: businessInfo.name
        });
        
        return {
          success: true,
          message: `Bill successfully sent to ${customerEmail}`,
          messageId: `email_${Date.now()}`
        };
      } else {
        throw new Error('Email delivery failed');
      }
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Failed to send email. Please check the email address and try again.'
      };
    }
  }
};