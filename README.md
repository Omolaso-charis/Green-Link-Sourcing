# Green Link Sourcing (MVP)

Static site (HTML, CSS, JavaScript) with a Netlify Function for the chatbot and Netlify Forms for quote requests.

## Before you publish: replace these placeholders

| Placeholder | Where | Replace with |
|---|---|---|
| `234XXXXXXXXXX` | All pages, `js/main.js`, `netlify/functions/chat.js` | Your WhatsApp number in international format, no spaces or `+` (for example `2348012345678`) |
| `sample@greenlink-demo.com` | All pages, `netlify/functions/chat.js` | Your real enquiry email, or keep the demo address |
| Office address | Footer on all pages | Your real office address, or keep the sample |

Search the project for `234XXXXXXXXXX` to find every WhatsApp link.

## Deploy

1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new site** → **Import an existing project**, and select the repository. Leave build settings empty.
3. In **Site configuration → Environment variables**, add `ANTHROPIC_API_KEY`, then trigger a new deploy.
4. In **Forms**, add an email notification for the `quote` form.
5. Optional: set up an auto-reply for form submissions that confirms the two-working-day response time.

## Not in this MVP (planned)

- Customer accounts and order tracking (registration with consent at sign-up)
- Product gallery
- Sample upload for shoes and bags
- Shared header and footer templates
