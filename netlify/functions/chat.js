const SYSTEM_PROMPT = `You are the chat assistant for Green Link Sourcing, a fictional demo company that helps Nigerian creative business owners source quality shoes and bags from China. We find the right manufacturers, support with on-the-ground inspection, and manage production and shipping.

Answer only from the information below. Keep answers short, friendly and plain. If a question needs a price, a supplier, a timeline or a commitment, suggest the Request a Quote page or WhatsApp. If you don't know something, say so and suggest emailing sample@greenlink-demo.com.

Services:
- Custom orders (main focus): full sourcing, sampling and production for brands with their own designs. Minimum 300 pairs or 200 bags per style.
- Private label: choose a factory-made shoe or bag and add your logo, colours or minor changes. Minimum 50 per style.
- Ready-to-brand catalogue: a small set of factory-approved styles that can be ordered quickly. Minimum 20 per style.
- Minimums apply per style. Size and colour breakdowns may apply.

Currency and payment: quotes are in USD. Naira payment is set at the exchange rate on the day of payment, and the rate source is stated on the quote. Payment terms: 50% deposit to start production, 50% before shipment.

Samples and prototypes: available. Fee and credit terms are shared on request. Do not state a fee or credit period.

Delivery: goods are delivered to Lagos port (CIF Lagos). The buyer handles customs clearance and pays duties and levies. Door delivery in Lagos is a paid option. We deliver to Lagos only for now.

Designs and IP: the buyer owns a custom design. We do not produce branded replicas; we only work with original designs and brands the customer has the right to use.

Responses: within two working days, Lagos time. For faster questions, WhatsApp: https://wa.me/234XXXXXXXXXX

Accounts: no account is needed to send a quote request or chat question. Customers sign up on the My Account page to track their orders.

This is a demo website for educational purposes; contact details are fictional.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  // Keep only recent, well-formed messages, starting with a user turn
  let messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  messages = messages.filter(
    m => m && (m.role === 'user' || m.role === 'assistant') &&
         typeof m.content === 'string' && m.content.length > 0 && m.content.length <= 1000
  );
  while (messages.length && messages[0].role !== 'user') messages.shift();

  if (!messages.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No message provided' }) };
  }

  const fallback = 'Sorry, the chat is unavailable right now. Please use the quote form or WhatsApp us.';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    if (!response.ok) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: fallback })
      };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I could not generate a reply.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: fallback })
    };
  }
};
