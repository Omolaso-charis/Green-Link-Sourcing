const WHATSAPP_URL = 'https://wa.me/234XXXXXXXXXX';

const FAQ_ITEMS = [
  {
    q: 'What do you source?',
    a: 'Quality shoes and bags, made to your own design or chosen from our factory-approved styles.'
  },
  {
    q: 'Who do you work with?',
    a: 'Nigerian creative business owners who want to produce their own brand.'
  },
  {
    q: 'What is the minimum order?',
    a: 'Custom orders: 300 pairs or 200 bags per style. Private label: 50 per style. Ready-to-brand catalogue: 20 per style. Size and colour breakdowns may apply.'
  },
  {
    q: 'Do you offer samples?',
    a: 'Yes. Details on fees and credit terms are available on request.'
  },
  {
    q: 'What currency are quotes in?',
    a: 'USD. Naira payment is set at the exchange rate on the day of payment, and we state the rate source on your quote.'
  },
  {
    q: 'How is delivery handled?',
    a: 'Goods are delivered to Lagos port (CIF Lagos). You handle customs clearance and pay duties and levies. Door delivery in Lagos is a paid option. We deliver to Lagos only for now.'
  },
  {
    q: 'What are the payment terms?',
    a: '50% deposit to start production, and 50% before shipment.'
  },
  {
    q: 'What are the lead times?',
    a: 'Lead times depend on the service you choose and are confirmed in your quote.'
  },
  {
    q: 'Who owns a custom design?',
    a: 'You do.'
  },
  {
    q: 'Do you produce branded replicas?',
    a: 'No. We only work with original designs and brands you have the right to use.'
  },
  {
    q: 'How quickly do you respond?',
    a: 'Within two working days, Lagos time. Message us on WhatsApp for faster questions.'
  },
  {
    q: 'Do I need an account?',
    a: 'No. Send a quote request or chat question without registering.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Header shadow once the page scrolls
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the current page in the navigation
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === current && !link.classList.contains('btn')) {
      link.classList.add('active');
    }
  });

  // Render the FAQ accordion wherever it appears
  document.querySelectorAll('[data-faq]').forEach(container => {
    FAQ_ITEMS.forEach(item => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const answer = document.createElement('p');
      summary.textContent = item.q;
      answer.textContent = item.a;
      details.append(summary, answer);
      container.appendChild(details);
    });
  });

  // Quote form: submit to Netlify Forms in the background and show a reference number
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    const status = quoteForm.querySelector('.form-status');
    const confirmation = document.getElementById('quote-confirmation');
    const refEl = document.getElementById('reference-number');

    quoteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = 'Sending...';
      status.classList.remove('error');

      const reference = 'GL-' + Date.now().toString(36).toUpperCase();
      const data = new FormData(quoteForm);
      data.set('reference', reference);

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        if (!response.ok) throw new Error('Submission failed');

        quoteForm.hidden = true;
        refEl.textContent = reference;
        confirmation.hidden = false;
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.dispatchEvent(new CustomEvent('quote-submitted', { detail: { reference, email: data.get('email'), product: data.get('product'), service: data.get('service') } }));
      } catch (err) {
        status.textContent = 'Sorry, we could not send your request. Please try again or WhatsApp us.';
        status.classList.add('error');
      }
    });
  }

  buildChatWidget();
});

const CHAT_FAQ_URL = '/data/chat-faq.json';
const CHAT_DEFAULT_FALLBACK = 'I can only answer questions about our services, minimum orders, payment, delivery and accounts. For prices, timelines or anything else, please request a quote or WhatsApp us.';

// Returns the answer for the first FAQ entry whose keyword appears as a whole word, or null.
function answerFromFaq(question, faq) {
  const text = String(question).toLowerCase();
  const entries = faq && Array.isArray(faq.entries) ? faq.entries : [];
  for (const entry of entries) {
    const keywords = Array.isArray(entry.keywords) ? entry.keywords : [];
    const matched = keywords.some(word => {
      const escaped = String(word).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('\\b' + escaped + '\\b').test(text);
    });
    if (matched) return entry.answer;
  }
  return null;
}

function buildChatWidget() {
  const toggle = document.createElement('button');
  toggle.className = 'chat-toggle';
  toggle.textContent = 'Chat with us';
  toggle.setAttribute('aria-controls', 'chat-panel');
  toggle.setAttribute('aria-expanded', 'false');

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.id = 'chat-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Green Link Sourcing chat');
  panel.innerHTML = `
    <div class="chat-header">
      <span>Green Link Assistant</span>
      <button class="chat-close" aria-label="Close chat">×</button>
    </div>
    <div class="chat-messages" aria-live="polite"></div>
    <form class="chat-form">
      <input type="text" placeholder="Ask about sourcing..." maxlength="500" required aria-label="Your question">
      <button type="submit">Send</button>
    </form>
    <a class="chat-whatsapp" href="${WHATSAPP_URL}" target="_blank" rel="noopener">Prefer a person? Chat on WhatsApp</a>`;

  document.body.append(toggle, panel);

  const messagesEl = panel.querySelector('.chat-messages');
  const form = panel.querySelector('.chat-form');
  const input = form.querySelector('input');

  // The FAQ file is loaded once. If it fails to load, the fallback reply is used.
  let faq = null;
  fetch(CHAT_FAQ_URL)
    .then(response => (response.ok ? response.json() : null))
    .then(data => { faq = data; })
    .catch(() => { faq = null; });

  function addMessage(text, who, linkUrl, linkLabel) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    if (linkUrl) {
      const link = document.createElement('a');
      link.href = linkUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = ' ' + (linkLabel || 'Open link');
      div.appendChild(link);
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  addMessage('Hi! I can answer questions about shoes and bags sourcing, minimum orders, payment, and delivery to Lagos. For a quote, use the Request a Quote page.', 'bot');

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  panel.querySelector('.chat-close').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    const answer = answerFromFaq(text, faq);
    if (answer) {
      addMessage(answer, 'bot');
    } else {
      const fallback = (faq && faq.fallback) || CHAT_DEFAULT_FALLBACK;
      addMessage(fallback, 'bot', WHATSAPP_URL, 'WhatsApp us');
    }
    input.focus();
  });
}
