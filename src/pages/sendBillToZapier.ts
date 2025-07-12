// src/utils/sendBillToZapier.ts

export const sendBillToZapier = async (
  billContent: any,
  businessInfo: any,
  deliveryMethod: string,
  email?: string,
  phone?: string
) => {
  try {
    // Added logging for debugging
    console.log("Preparing to send bill to Zapier...");
    console.log("Bill content:", billContent);
    console.log("Business info:", businessInfo);
    console.log("Delivery method:", deliveryMethod);
    if (email) console.log("Email:", email);
    if (phone) console.log("Phone:", phone);

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

    console.log("Payload to Zapier:", payload);

    // Try/catch around fetch for better error reporting
    const response = await fetch("https://hooks.zapier.com/hooks/catch/23760436/u2ohknd/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // Log response status for debugging
    console.log("Zapier response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Zapier webhook failed. Response:", errorText);
      throw new Error("Zapier webhook failed: " + errorText);
    }

    // Optional: log response data
    const responseData = await response.json().catch(() => ({}));
    console.log("Zapier response data:", responseData);

    // Improved delivery reporting
    return {
      email: {
        success: deliveryMethod === 'email',
        message: deliveryMethod === 'email' ? 'Email delivery initiated via Zapier' : ''
      },
      sms: {
        success: deliveryMethod === 'sms',
        message: deliveryMethod === 'sms' ? 'SMS delivery initiated via Zapier' : ''
      }
    };
  } catch (error) {
    // Now logs error to console and returns a clear message
    console.error("Zapier Error:", error);
    return {
      error: true,
      message: "Failed to send bill to Zapier: " + (error?.message || error)
    };
  }
};
