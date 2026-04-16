"use server"

export async function trackOrder(orderDetails) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Purchase', // ফেসবুক এই নামেই চেনে
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
              // ইউজারের আইপি এবং ব্রাউজার আইডি পাঠানো ভালো
              client_ip_address: orderDetails.ip,
              client_user_agent: orderDetails.userAgent,
            },
            custom_data: {
              value: orderDetails.totalAmount, // কত টাকার অর্ডার
              currency: 'BDT',
            },
          },
        ],
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error("FB Tracking Error:", error);
  }
}