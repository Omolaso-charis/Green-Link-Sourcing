// Buyer account prototype.
// Sign-in is simulated: no password is collected or stored. Details are kept in this browser only.
// A live site needs a secure sign-in service (for example, Supabase Auth) and a database for orders.

const KEY_BUYER = 'gl_buyer';
const KEY_QUOTES = 'gl_quotes';

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (for example, private browsing). The page still works without it.
  }
}

function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

function getBuyer() {
  return readJSON(KEY_BUYER, null);
}

function updateNavLinks(signedIn) {
  document.querySelectorAll('.nav-account').forEach(link => {
    link.textContent = signedIn ? 'My account' : 'Sign in';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const buyer = getBuyer();
  updateNavLinks(Boolean(buyer));

  // Quote page: prefill details for signed-in buyers
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm && buyer) {
    const values = { name: buyer.name, business: buyer.business, email: buyer.email, whatsapp: buyer.whatsapp };
    Object.entries(values).forEach(([name, value]) => {
      const field = quoteForm.elements.namedItem(name);
      if (field && !field.value && value) field.value = value;
    });
  }

  // Save each quote request so it appears in the buyer's account
  document.addEventListener('quote-submitted', (event) => {
    const quotes = readJSON(KEY_QUOTES, []);
    quotes.unshift({ ...event.detail, date: new Date().toLocaleDateString('en-GB') });
    writeJSON(KEY_QUOTES, quotes.slice(0, 50));
  });

  if (document.getElementById('signup-form')) {
    initAccountPage(buyer);
  }
});

function initAccountPage(buyer) {
  const authView = document.getElementById('auth-view');
  const dashView = document.getElementById('dashboard-view');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const tabSignup = document.getElementById('tab-signup');
  const tabLogin = document.getElementById('tab-login');
  const signupMessage = document.getElementById('signup-message');
  const loginMessage = document.getElementById('login-message');
  const quoteList = document.getElementById('quote-list');
  const quoteEmpty = document.getElementById('quote-empty');

  function showAuth() {
    authView.hidden = false;
    dashView.hidden = true;
  }

  function renderQuotes(email) {
    quoteList.textContent = '';
    const mine = readJSON(KEY_QUOTES, []).filter(
      q => (q.email || '').toLowerCase() === email.toLowerCase()
    );
    quoteEmpty.hidden = mine.length > 0;

    mine.forEach(q => {
      const li = document.createElement('li');
      const ref = document.createElement('strong');
      const details = document.createElement('span');
      const status = document.createElement('span');
      ref.textContent = q.reference;
      details.textContent = `${q.product || 'Product'} · ${q.service || 'Service not chosen'} · ${q.date}`;
      status.textContent = 'Received. We reply within two working days, Lagos time.';
      li.append(ref, details, document.createElement('br'), status);
      quoteList.appendChild(li);
    });
  }

  function showDashboard(b) {
    authView.hidden = true;
    dashView.hidden = false;
    document.getElementById('dash-name').textContent = `Hello, ${b.name}`;
    document.getElementById('dash-business').textContent = b.business || '';
    renderQuotes(b.email);
    updateNavLinks(true);
  }

  function selectTab(which) {
    const signup = which === 'signup';
    tabSignup.setAttribute('aria-selected', String(signup));
    tabLogin.setAttribute('aria-selected', String(!signup));
    signupForm.hidden = !signup;
    loginForm.hidden = signup;
    signupMessage.textContent = '';
    loginMessage.textContent = '';
  }

  tabSignup.addEventListener('click', () => selectTab('signup'));
  tabLogin.addEventListener('click', () => selectTab('login'));

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!signupForm.checkValidity()) {
      signupForm.reportValidity();
      return;
    }
    const field = (name) => signupForm.elements.namedItem(name).value.trim();
    const newBuyer = {
      name: field('name'),
      business: field('business'),
      email: field('email'),
      whatsapp: field('whatsapp'),
      joined: new Date().toISOString()
    };
    writeJSON(KEY_BUYER, newBuyer);
    signupForm.reset();
    showDashboard(newBuyer);
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = loginForm.elements.namedItem('email').value.trim().toLowerCase();
    const saved = getBuyer();
    if (saved && (saved.email || '').toLowerCase() === email) {
      showDashboard(saved);
    } else {
      loginMessage.textContent = 'No account found for this email. Please sign up first.';
    }
  });

  document.getElementById('signout').addEventListener('click', () => {
    removeKey(KEY_BUYER);
    updateNavLinks(false);
    selectTab('signup');
    showAuth();
  });

  if (buyer) {
    showDashboard(buyer);
  } else {
    showAuth();
  }
}
