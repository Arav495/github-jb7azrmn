const ZAPIER_WEBHOOK_URL = "https://eoa8ejep3vj74y1.m.pipedream.net";

const sendBillToZapier = async (
  billContent: any,
  businessInfo: any,
  deliveryMethod: 'email' | 'sms' | 'both',
  customerEmail?: string,
  customerPhone?: string
) => {
  const payload = {
    brand: businessInfo.name,
    store_location: businessInfo.address,
    order_id: billContent.billNumber,
    amount: Math.round(billContent.total * 100), // integer for Supabase
    date: billContent.date,
    delivery_date: billContent.date,
    payment_method: "UPI",
    items: billContent.items
      .map((item: any) => `${item.description} x ${item.quantity} @ ₹${item.price}`)
      .join(", ")
  };

  const response = await fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to send bill to Zapier: ${response.status}`);
  }

  return {
    email: {
      success: deliveryMethod === "email" || deliveryMethod === "both",
      message: deliveryMethod === "email" || deliveryMethod === "both"
        ? `Sent to ${customerEmail}`
        : "Not sent via email"
    },
    sms: {
      success: deliveryMethod === "sms" || deliveryMethod === "both",
      message: deliveryMethod === "sms" || deliveryMethod === "both"
        ? `Sent to ${customerPhone}`
        : "Not sent via SMS"
    }
  };
};

export default sendBillToZapier;
