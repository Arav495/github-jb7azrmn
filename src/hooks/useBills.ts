import { useState, useEffect } from 'react';
import { Bill } from '../types';
import { emailService } from '../services/emailService';
import { smsService } from '../services/smsService';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      }
    ];
    setBills(mockBills);
  }, []);

  const addBill = async (billData: Omit<Bill, 'id' | 'uploadDate'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newBill: Bill = {
        ...billData,
        id: Date.now().toString(),
        uploadDate: new Date(),
      };
      setBills(prev => [newBill, ...prev]);
      return newBill;
    } finally {
      setLoading(false);
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
      // 🟣 1. Send to Birdy via Pipedream
      const formattedBill = {
        brand: businessInfo.brand || 'Unknown',
        store_location: businessInfo.address || 'N/A',
        order_id: billData.billNumber,
        amount: billData.totalAmount,
        date: billData.date,
        delivery_date: billData.deliveryDate || billData.date,
        payment_method: billData.paymentMethod || 'Unknown',
        items: JSON.stringify(billData.items)  // 🔥 must be a string
      };

      const webhook = 'https://eoa8ejep3vj74y1.m.pipedream.net'; // Pipedream webhook
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedBill)
      });

      if (!res.ok) {
        console.error('❌ Failed to send to Birdy API. Status:', res.status);
        throw new Error(`Birdy API rejected the data`);
      }

      // 🟡 2. Send via Email or SMS
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
