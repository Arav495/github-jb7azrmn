export interface SMSResult {
  success: boolean;
  message: string;
  messageId?: string;
}

export const smsService = {
  async sendBill(
    phoneNumber: string,
    billData: any,
    businessInfo: any
  ): Promise<SMSResult> {
    try {
      // Validate Indian phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (!this.isValidIndianPhone(cleanPhone)) {
        throw new Error('Invalid Indian mobile number');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        const smsContent = this.generateSMSContent(billData, businessInfo);
        console.log('📱 SMS sent successfully to:', phoneNumber);
        console.log('SMS Content:', smsContent);
        
        return {
          success: true,
          message: `Bill SMS sent to ${phoneNumber}`,
          messageId: `sms_${Date.now()}`
        };
      } else {
        throw new Error('SMS delivery failed');
      }
    } catch (error) {
      console.error('SMS service error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send SMS. Please check the phone number and try again.'
      };
    }
  },

  isValidIndianPhone(phone: string): boolean {
    // Indian mobile numbers: 10 digits starting with 6,7,8,9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(phone);
  },

  generateSMSContent(billData: any, businessInfo: any): string {
    return `🧾 Bill from ${businessInfo.name}
Bill #: ${billData.billNumber}
Amount: ₹${billData.total.toFixed(2)}
Items: ${billData.items.length}
Date: ${billData.date}

Thank you for your business!
- Team Birdy`;
  }
};