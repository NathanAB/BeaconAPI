const Router = require('express-promise-router');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const moment = require('moment');

const { APP_URL } = require('../../../constants');
const db = require('../../../db');

const router = new Router();

router.post('/checkout', async (req, res) => {
  const { priceId } = req.body;
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  const { email } = req.session.passport.user.profile;

  try {
    // Docs: https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/membership?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/membership`,
      allow_promotion_codes: true,
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
});

router.post('/webhook', async (req, res) => {
  const event = req.body;
  const { data, type } = event;
  const { customer_email, customer } = data.object;
  const periodEnd = data?.object?.lines?.data[0]?.period?.end;

  console.log(`Stripe even received event type: ${type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.

      console.log(`Updating membership for ${customer_email} with customer ID ${customer}`);
      await db.setCustomerId({ email: customer_email, customerId: customer });
      break;
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.

      console.log(`Updating membership for ${customer_email} with end date ${periodEnd} and customer ID ${customer}`);
      await db.setCustomerId({ email: customer_email, customerId: customer });
      await db.setMembershipEnd({ email: customer_email, newEndDate: periodEnd * 1000 });
      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
      // Unhandled event type
  }

  res.json({ received: true });
});

router.post('/portal', async (req, res) => {
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  const { email } = req.session.passport.user.profile;

  const { customerId } = await db.getUser(email);

  // Authenticate your user.
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/membership`,
  });

  res.json({ url: session.url });
});

module.exports = router;
