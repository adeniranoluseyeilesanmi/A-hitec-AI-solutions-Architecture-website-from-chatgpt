import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { catalog, lock } from '../lib/catalog.js';
import { db } from '../lib/db.js';

// Only explicitly trusted deployment/branch origins are accepted.
// Vercel supplies VERCEL_URL and VERCEL_BRANCH_URL for preview deployments.
function trustedOrigins(env = process.env) {
  const origins = new Set();
  for (const value of [env.SITE_URL, env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
    if (!value) continue;
    try {
      const url = new URL(value.startsWith('https://') ? value : 'https://' + value);
      if (url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash) {
        origins.add(url.origin);
      }
    } catch { /* Ignore invalid optional origin configuration. */ }
  }
  return origins;
}

export async function POST(req) {
  try {
    lock();
    const origin = req.headers.get('origin');
    const requestOrigin = new URL(req.url).origin;
    // Require a same-origin browser request AND an explicitly trusted deployment.
    // Never accept arbitrary *.vercel.app domains or untrusted forwarded headers.
    if (!origin || origin !== requestOrigin || !trustedOrigins().has(origin)) {
      return Response.json({ error: 'Origin rejected' }, { status: 403 });
    }
    const { productId } = await req.json();
    const product = catalog()[productId];
    if (!product || !Number.isSafeInteger(product.amount) || product.amount < 100) {
      return Response.json({ error: 'Invalid product' }, { status: 400 });
    }
    const id = randomUUID();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await db().query(
      'INSERT INTO orders(reference,product_id,amount_pence,currency,mode,status) VALUES($1,$2,$3,$4,$5,$6)',
      [id, productId, product.amount, 'gbp', product.mode, 'pending']
    );
    const price_data = {
      currency: 'gbp',
      unit_amount: product.amount,
      product_data: { name: product.name }
    };
    if (product.mode === 'subscription') price_data.recurring = { interval: 'month' };
    const session = await stripe.checkout.sessions.create({
      mode: product.mode,
      line_items: [{ price_data, quantity: 1 }],
      client_reference_id: id,
      metadata: { order_reference: id },
      ...(product.mode === 'subscription'
        ? { subscription_data: { metadata: { order_reference: id } } }
        : {}),
      success_url: origin + '/payment-success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/payment-cancelled.html'
    }, { idempotencyKey: id });
    await db().query('UPDATE orders SET stripe_session_id=$1 WHERE reference=$2', [session.id, id]);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error(error.message);
    return Response.json({ error: 'Checkout unavailable' }, { status: 503 });
  }
}
