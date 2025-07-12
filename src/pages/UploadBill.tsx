import React, { useState } from 'react';
import { useBills } from '../hooks/useBills';
import { Plus, Minus, CheckCircle, Calculator, User, Mail, DollarSign, Hash, FileText, Phone, Send, MessageSquare, AtSign } from 'lucide-react';
import sendBillToZapier from './sendBillToZapier';

interface BillItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const UploadBill = () => {
  const { addBill, sendBill, loading } = useBills();
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms' | 'both'>('both');
  const [billItems, setBillItems] = useState<BillItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ]);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Sharma Electronics',
    address: 'Shop No. 15, Connaught Place, New Delhi - 110001',
    phone: '+91 11 2334 5678',
    email: 'contact@sharmaelectronics.in',
    gst: 'GST07AABCS1234F1Z5'
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [billNumber, setBillNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [deliveryResults, setDeliveryResults] = useState<any>(null);

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0
    };
    setBillItems([...billItems, newItem]);
  };

  const removeItem = (id: string) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setBillItems(billItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      setError('Customer name is required');
      return false;
    }

    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
      if (!customerEmail.trim()) {
        setError('Customer email is required for email delivery');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    if (deliveryMethod === 'sms' || deliveryMethod === 'both') {
      if (!customerPhone.trim()) {
        setError('Customer phone number is required for SMS delivery');
        return false;
      }
      const cleanPhone = customerPhone.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setError('Please enter a valid Indian mobile number (10 digits starting with 6-9)');
        return false;
      }
    }

    if (billItems.some(item => !item.description.trim())) {
      setError('All items must have a description');
      return false;
    }

    if (calculateTotal() <= 0) {
      setError('Bill total must be greater than zero');
      return false;
    }

    return true;
  };

  const handleBirdyIt = async () => {
    setError('');
    
    if (!validateForm()) return;

    try {
      // Generate bill content
      const billContent = {
        billNumber,
        businessInfo,
        customerName,
        customerEmail,
        customerPhone,
        items: billItems,
        subtotal: calculateSubtotal(),
        gst: calculateGST(),
        total: calculateTotal(),
        date: new Date().toLocaleDateString('en-IN')
      };

      // Send bill via selected method(s)
      const results = await sendBillToZapier(
        billContent,
        businessInfo,
        deliveryMethod,
        customerEmail || undefined,
        customerPhone || undefined
      );

      // Add bill to history
      await addBill({
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || undefined,
        fileName: `${billNumber}.pdf`,
        fileType: 'pdf',
        status: 'sent',
        amount: calculateTotal(),
        customerName: customerName || undefined,
        transactionId: billNumber,
        deliveryMethod
      });

      setDeliveryResults(results);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setDeliveryResults(null);
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerName('');
        setBillItems([{ id: '1', description: '', quantity: 1, price: 0 }]);
        setBillNumber(`INV-${Date.now().toString().slice(-6)}`);
        setDeliveryMethod('both');
      }, 4000);
    } catch (err) {
      setError('Failed to send bill. Please try again.');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    return cleaned.slice(0, 10).replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Bill Sent Successfully! 🎉</h2>
          <p className="text-gray-600 mb-4">Invoice #{billNumber} has been delivered to {customerName}</p>
          
          {deliveryResults && (
            <div className="space-y-2 mb-4">
              {(deliveryMethod === 'email' || deliveryMethod === 'both') && (
                <div className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  deliveryResults.email.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{deliveryResults.email.message}</span>
                </div>
              )}
              {(deliveryMethod === 'sms' || deliveryMethod === 'both') && (
                <div className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  deliveryResults.sms.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{deliveryResults.sms.message}</span>
                </div>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-500">Customer will receive the digital bill via Birdy app automatically</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create & Send Bill</h1>
        <p className="text-gray-600 mt-2">Generate professional bills and send them instantly to customers via email or SMS</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business & Customer Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="billNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="billNumber"
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-describedby="billNumber-help"
                  />
                </div>
                <p id="billNumber-help" className="text-xs text-gray-500 mt-1">Unique identifier for this bill</p>
              </div>

              <div>
                <label htmlFor="billDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="billDate"
                  type="text"
                  value={new Date().toLocaleDateString('en-IN')}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  aria-label="Bill date (automatically set to today)"
                />
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Method *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('email')}
                  className={`p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    deliveryMethod === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-pressed={deliveryMethod === 'email'}
                >
                  <AtSign className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Email Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('sms')}
                  className={`p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    deliveryMethod === 'sms'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-pressed={deliveryMethod === 'sms'}
                >
                  <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">SMS Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('both')}
                  className={`p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    deliveryMethod === 'both'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-pressed={deliveryMethod === 'both'}
                >
                  <Send className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Both</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rajesh Kumar"
                    required
                    aria-describedby="customerName-help"
                  />
                </div>
                <p id="customerName-help" className="text-xs text-gray-500 mt-1">Full name of the customer</p>
              </div>

              {(deliveryMethod === 'email' || deliveryMethod === 'both') && (
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="rajesh.kumar@gmail.com"
                      required={deliveryMethod === 'email' || deliveryMethod === 'both'}
                      aria-describedby="customerEmail-help"
                    />
                  </div>
                  <p id="customerEmail-help" className="text-xs text-gray-500 mt-1">Valid email address for bill delivery</p>
                </div>
              )}

              {(deliveryMethod === 'sms' || deliveryMethod === 'both') && (
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="98765 43210"
                      required={deliveryMethod === 'sms' || deliveryMethod === 'both'}
                      aria-describedby="customerPhone-help"
                    />
                  </div>
                  <p id="customerPhone-help" className="text-xs text-gray-500 mt-1">10-digit Indian mobile number</p>
                </div>
              )}
            </div>
          </div>

          {/* Bill Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bill Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                aria-label="Add new item to bill"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {billItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <label htmlFor={`description-${item.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      id={`description-${item.id}`}
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Item description"
                      aria-describedby={`description-help-${item.id}`}
                    />
                    <p id={`description-help-${item.id}`} className="text-xs text-gray-500 mt-1 sr-only">
                      Description for item {index + 1}
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Qty
                    </label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label={`Quantity for item ${index + 1}`}
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id={`price-${item.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label={`Price for item ${index + 1} in rupees`}
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900" aria-label={`Total for item ${index + 1}`}>
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                    {billItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-colors p-1"
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Preview & Summary */}
        <div className="space-y-6">
          {/* Bill Preview */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Bill Preview
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900">{businessInfo.name}</h4>
                <p className="text-gray-600">{businessInfo.address}</p>
                <p className="text-gray-600">{businessInfo.phone}</p>
                <p className="text-gray-600">{businessInfo.email}</p>
                <p className="text-gray-600">GST: {businessInfo.gst}</p>
              </div>
              
              <div className="border-b pb-4">
                <p><span className="font-medium">Bill #:</span> {billNumber}</p>
                <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
                <p><span className="font-medium">To:</span> {customerName || 'Customer'}</p>
                {customerEmail && <p><span className="font-medium">Email:</span> {customerEmail}</p>}
                {customerPhone && <p><span className="font-medium">Phone:</span> +91 {customerPhone}</p>}
              </div>
              
              <div className="space-y-2">
                {billItems.map((item, index) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.description || `Item ${index + 1}`}</span>
                    <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Bill Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%):</span>
                <span>₹{calculateGST().toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBirdyIt}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
              aria-describedby="birdy-button-help"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin\" aria-label="Sending bill"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Birdy It! 🚀</span>
                </>
              )}
            </button>
            
            <p id="birdy-button-help" className="text-xs text-gray-500 mt-3 text-center">
              Bill will be instantly sent via {deliveryMethod === 'both' ? 'email and SMS' : deliveryMethod} to customer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBill;
