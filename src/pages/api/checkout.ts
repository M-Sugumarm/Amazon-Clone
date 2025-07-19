import { NextApiRequest, NextApiResponse } from "next";
import { StoreProduct } from "../../../type";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { items, email, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items provided' });
    }

    // Check for valid Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ 
        error: 'Stripe API key not configured',
        details: 'Please check your environment variables'
      });
    }

    // Format line items for Stripe
    const lineItems = items.map((item: StoreProduct) => ({
      quantity: item.quantity,
      price_data: {
        currency: "inr",
        unit_amount: Math.round(item.price * 10 * 100), // Ensure it's an integer
        product_data: {
          name: item.title,
          description: item.description?.substring(0, 255) || '', // Limit description length
          images: [item.image],
        },
      },
    }));

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "OM", "CA", "GB"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: {
        email,
        orderId,
        items_count: items.length.toString(),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'inr',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    res.status(200).json({
      id: session.id,
      url: session.url, // Add direct URL option
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Detailed error handling
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific Stripe errors
      if (error.message.includes('authentication')) {
        errorMessage = 'Payment provider authentication failed. Check API keys.';
      } else if (error.message.includes('card')) {
        errorMessage = 'There was an issue with the payment card.';
        statusCode = 400;
      }
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}