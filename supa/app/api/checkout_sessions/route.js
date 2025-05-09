import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // Use the latest API version
});

export async function POST(request) {
  // Add the `request` parameter
  const { amount, currency } = await request.json(); // Parse the request body
  console.log("In checkout", { amount, currency });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Custom Product",
            },
            unit_amount: amount * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/chat?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/chat?canceled=true`,
    });

    console.log("Checkout session created:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
