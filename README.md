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

## Buyer account (prototype)

- `account.html` and `js/account.js` show sign-up, log-in, a quote history and an example order tracker.
- Sign-in is simulated and details stay in the browser (localStorage). No password is collected.
- Before launch, replace this with a secure sign-in service (for example, Supabase Auth) and store orders in a database.

## Campaign page

- `campaign.html` is the page for social media posts. Its styles are in `css/campaign.css`, and its scripts are in `js/campaign.js`.
- Share it with campaign tags, for example `https://greenlinksourcing.netlify.app/campaign.html?utm_source=instagram&utm_campaign=lagos-qa`. The form records the source, medium and campaign, so you can see which post brought each lead.
- Enable form notifications for the `campaign-quote` form in Netlify, separate from the `quote` form.
- Replace `234XXXXXXXXXX` in `campaign.html` and `js/campaign.js` as well.

## Not in this MVP (planned)

- Live customer accounts with passwords and email verification
- Real order tracking, linked to your order records
- Product gallery
- Sample upload for shoes and bags
- Shared header and footer templates
