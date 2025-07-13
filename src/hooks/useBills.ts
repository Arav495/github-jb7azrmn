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
      sms: { success: false, message: '' },
    };

    try {
      // 🔁 Send to Birdy via Pipedream
      const payload = {
        brand: businessInfo.brand || 'Zara',
        store_location: businessInfo.store_location || 'Sharma Electronics, Connaught Place, New Delhi',
        order_id: billData.billNumber || 'UNKNOWN',
        amount: billData.total || 0,
        date: billData.date || new Date().toISOString().slice(0, 10),
        delivery_date: billData.date || new Date().toISOString().slice(0, 10),
        payment_method: billData.paymentMethod || 'N/A',
        items: billData.items.map((item: any) =>
          typeof item === 'object'
            ? `${item.name} (Size: ${item.size}, Color: ${item.color}, Qty: ${item.qty}, Price: ₹${item.price})`
            : item
        ),
      };

      console.log('📤 Sending bill to Birdy:', payload);
      const res = await fetch('https://eoa8ejep3vj74y1.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Failed to send to Birdy:', errorText);
        throw new Error('Failed to send bill to Birdy');
      }

      // 📨 Email or SMS delivery
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
    loading,
  };
};
