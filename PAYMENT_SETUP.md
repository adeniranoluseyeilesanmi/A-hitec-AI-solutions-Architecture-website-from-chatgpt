# A-hitec Stripe integration — TEST ONLY

Branch: feature/stripe-test-payments; live site is unchanged until merged and deployed.

## Hosting
The existing site is static HTML; the repository has GitHub Pages markers. Static hosting cannot execute Stripe webhooks. Deploy the whole branch to Vercel Node serverless functions and attach PostgreSQL (e.g. Neon), preserving IONOS DNS until the owner authorises a domain switch. Same-origin /api endpoints are required.

## Setup
1. Import this GitHub branch into Vercel; create a PostgreSQL database and run db/schema.sql in its SQL console.
2. In Vercel Project Settings → Environment Variables, set STRIPE_SECRET_KEY to a Stripe **test** secret, DATABASE_URL to your private database connection string, SITE_URL to the exact HTTPS deployment origin, set LIVE_PAYMENTS_ENABLED=false and configure price variables. Never commit real keys. Redeploy.
3. In the Stripe test-mode Dashboard → Developers → Webhooks, register https://YOUR_DEPLOYMENT/api/webhook for checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.async_payment_failed, checkout.session.expired, invoice.paid, invoice.payment_failed, customer.subscription.updated, customer.subscription.deleted. Add STRIPE_WEBHOOK_SECRET securely in Vercel settings.
4. Test a one-off payment and a subscription with Stripe test cards; verify orders table transitions. Test failed/expired payments, duplicate webhook replay, delayed settlement and incorrect signature. Confirm success redirects cannot update orders.

## Important launch blockers
Amounts £295 and £49/month are **unapproved demonstration offers**. Confirm commercial scope, subscriptions terms, VAT and cancellation/refund rules. The backend records fulfilment jobs in fulfilment_outbox after verified payment, but **does not yet send customer email or provision audit bookings or subscription access**. Implement an authenticated worker to process jobs and secure customer-access entitlements before collecting real payments. Also establish periodic subscription reconciliation, rate limits and alerts. Real Stripe keys are explicitly rejected by the present code; live activation requires separate engineering work and explicit owner authorisation.

## Official documentation
https://docs.stripe.com/payments/checkout/quickstarts
https://docs.stripe.com/webhooks
https://docs.stripe.com/billing/subscriptions/webhooks
https://vercel.com/docs/functions
