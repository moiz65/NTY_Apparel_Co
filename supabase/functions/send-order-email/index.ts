import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EmailType = 'order_confirmation' | 'order_shipped' | 'arriving_today' | 'order_delivered';

interface OrderEmailRequest {
  type: EmailType;
  order: {
    order_number: string;
    customer_name: string;
    customer_email: string;
    amount: number;
    items?: Array<{ name: string; qty: number; price: number }>;
    tracking_number?: string;
    estimated_delivery?: string;
  };
}

function getEmailContent(type: EmailType, order: OrderEmailRequest['order']) {
  const brandColor = '#000000';
  const year = new Date().getFullYear();

  const baseStyle = `
    body { margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: ${brandColor}; padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; letter-spacing: 0.3em; margin: 0; font-weight: 400; }
    .header p { color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 8px 0 0; }
    .body { padding: 40px 32px; }
    .body h2 { font-size: 22px; color: #000; margin: 0 0 8px; }
    .body .subtitle { font-size: 14px; color: #666; margin: 0 0 32px; line-height: 1.6; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .detail-label { color: #888; }
    .detail-value { color: #000; font-weight: 600; }
    .total-row { padding: 16px 0; font-size: 16px; font-weight: 700; }
    .cta { display: inline-block; background: ${brandColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; margin: 24px 0; }
    .footer { background: #fafafa; padding: 24px 32px; text-align: center; border-top: 1px solid #eee; }
    .footer p { font-size: 11px; color: #999; margin: 4px 0; }
    .status-badge { display: inline-block; padding: 6px 16px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; border-radius: 0; }
  `;

  const header = `
    <div class="header">
      <h1>NTY</h1>
      <p>${getSubtitle(type)}</p>
    </div>
  `;

  const footer = `
    <div class="footer">
      <p>NTY Apparel — Built Different</p>
      <p>&copy; ${year} NTY. All rights reserved.</p>
    </div>
  `;

  const orderDetails = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; font-size: 14px; color: #888;">Order Number</td>
        <td style="padding: 12px 0; font-size: 14px; color: #000; font-weight: 600; text-align: right;">#${order.order_number}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; font-size: 14px; color: #888;">Total</td>
        <td style="padding: 12px 0; font-size: 14px; color: #000; font-weight: 600; text-align: right;">$${order.amount.toFixed(2)}</td>
      </tr>
      ${order.tracking_number ? `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; font-size: 14px; color: #888;">Tracking</td>
        <td style="padding: 12px 0; font-size: 14px; color: #000; font-weight: 600; text-align: right;">${order.tracking_number}</td>
      </tr>` : ''}
      ${order.estimated_delivery ? `
      <tr>
        <td style="padding: 12px 0; font-size: 14px; color: #888;">Est. Delivery</td>
        <td style="padding: 12px 0; font-size: 14px; color: #000; font-weight: 600; text-align: right;">${order.estimated_delivery}</td>
      </tr>` : ''}
    </table>
  `;

  const bodies: Record<EmailType, string> = {
    order_confirmation: `
      <div class="body">
        <h2>Order Confirmed ✓</h2>
        <p class="subtitle">Thanks for your order, ${order.customer_name}. We're getting everything ready for you.</p>
        ${orderDetails}
        <p style="font-size: 14px; color: #666; line-height: 1.6;">We'll send you another email once your order ships.</p>
      </div>
    `,
    order_shipped: `
      <div class="body">
        <h2>Your Order Has Shipped 📦</h2>
        <p class="subtitle">${order.customer_name}, your order is on its way.</p>
        ${orderDetails}
        <p style="font-size: 14px; color: #666; line-height: 1.6;">Track your package with the tracking number above. We'll let you know when it's arriving.</p>
      </div>
    `,
    arriving_today: `
      <div class="body">
        <h2>Arriving Today 🚚</h2>
        <p class="subtitle">${order.customer_name}, your NTY order is out for delivery and arriving today.</p>
        ${orderDetails}
        <p style="font-size: 14px; color: #666; line-height: 1.6;">Keep an eye out — your gear is almost there.</p>
      </div>
    `,
    order_delivered: `
      <div class="body">
        <h2>Delivered ✅</h2>
        <p class="subtitle">${order.customer_name}, your NTY order has been delivered. Time to rep it.</p>
        ${orderDetails}
        <p style="font-size: 14px; color: #666; line-height: 1.6;">We hope you love your new gear. If you have any questions, don't hesitate to reach out.</p>
      </div>
    `,
  };

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyle}</style></head>
    <body>
      <div class="container">
        ${header}
        ${bodies[type]}
        ${footer}
      </div>
    </body>
    </html>
  `;
}

function getSubtitle(type: EmailType): string {
  switch (type) {
    case 'order_confirmation': return 'Order Confirmation';
    case 'order_shipped': return 'Shipment Update';
    case 'arriving_today': return 'Delivery Update';
    case 'order_delivered': return 'Delivery Confirmation';
  }
}

function getSubject(type: EmailType, orderNumber: string): string {
  switch (type) {
    case 'order_confirmation': return `NTY — Order #${orderNumber} Confirmed`;
    case 'order_shipped': return `NTY — Order #${orderNumber} Has Shipped`;
    case 'arriving_today': return `NTY — Order #${orderNumber} Arriving Today`;
    case 'order_delivered': return `NTY — Order #${orderNumber} Delivered`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, order } = await req.json() as OrderEmailRequest;

    if (!type || !order?.customer_email || !order?.order_number) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, order.customer_email, order.order_number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = getEmailContent(type, order);
    const subject = getSubject(type, order.order_number);

    // For now, return the generated email content
    // When email domain is configured, this will send via the email queue
    return new Response(
      JSON.stringify({
        success: true,
        subject,
        to: order.customer_email,
        html,
        message: `Email template generated for ${type}. Configure email domain to enable sending.`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
