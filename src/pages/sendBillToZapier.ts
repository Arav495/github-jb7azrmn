// src/pages/sendBillToZapier.ts

const sendBillToZapier = async (
  billContent: any,
  businessInfo: any,
  deliveryMethod: string,
  email?: string,
  phone?: string
) => {
  const payload = {
    billNumber: billContent.billNumber,
    businessInfo,
    customer: {
      name: billContent.customerName,
      email,
      phone
    },
    items: billContent.items,
    subtotal: billContent.subtotal,
    gst: billContent.gst,
    total: billContent.total,
    deliveryMethod,
    date: billContent.date
  };

  const response = await fetch("https://hooks.zapier.com/hooks/catch/23760436/u2ohknd/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("Zapier webhook failed");

  return {
    email: {
      success: deliveryMethod !== 'sms',
      message: deliveryMethod !== 'sms' ? 'Email delivery initiated via Zapier' : ''
    },
    sms: {
      success: deliveryMethod !== 'email',
      message: deliveryMethod !== 'email' ? 'SMS delivery initiated via Zapier' : ''
    }
  };
};

export default sendBillToZapier;
