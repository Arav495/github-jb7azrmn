import { useState, useEffect } from 'react';
import { Bill } from '../types';
import { emailService } from '../services/emailService';
import { smsService } from '../services/smsService';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial mock data with Indian context
    const mockBills: Bill[] = [
      {
        id: '1',
        customerEmail: 'rajesh.kumar@gmail.com',
        customerPhone: '+91 98765 43210',
        fileName: 'invoice_001.pdf',
        fileType: 'pdf',
        uploadDate: new Date('2024-01-15'),
        status: 'sent',
        amount: 2499.99,
        customerName: 'Rajesh Kumar',
        transactionId: 'TXN_001',
        deliveryMethod: 'both'
      },
      {
        id: '2',
        customerEmail: 'priya.sharma@yahoo.com',
        customerPhone: '+91 87654 32109',
        fileName: 'receipt_002.jpg',
        fileType: 'image',
        uploadDate: new Date('2024-01-14'),
        status: 'sent',
        amount: 1250.00,
        customerName: 'Priya Sharma',
        transactionId: 'TXN_002',
        deliveryMethod: 'email'
      }
    ];
    setBills(mockBills);
  }, []);

  const addBill = async (billData: Omit<Bill, 'id' | 'uploadDate'>) => {
    setLoading(true);
    
    try {
      // Simulate bill generation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newBill: Bill = {
        ...billData,
        id: Date.now().toString(),
        uploadDate: new Date(),
      };
      
      setBills(prev => [newBill, ...prev]);
      setLoading(false);
      
      return newBill;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const sendBill = async (
    billData: any,
    businessInfo: any,
    deliveryMethod: 'email' | 'sms' | 'both',
    customerEmail?: string,
    customerPhone?: string
  ) => {
    const results = {
      email: { success: false, message: '' },
      sms: { success: false, message: '' }
    };

    try {
      if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        if (customerEmail) {
          results.email = await emailService.sendBill(customerEmail, billData, businessInfo);
        }
      }

      if (deliveryMethod === 'sms' || deliveryMethod === 'both') {
        if (customerPhone) {
          results.sms = await smsService.sendBill(customerPhone, billData, businessInfo);
        }
      }

      return results;
    } catch (error) {
      console.error('Send bill error:', error);
      throw error;
    }
  };

  return {
    bills,
    addBill,
    sendBill,
    loading
  };
};