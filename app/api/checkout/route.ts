import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SHIPPING_FLAT_RATE, PLATFORM_NAMES } from "@/lib/products";

interface CheckoutBody {
  platforms: number;
  color: string;
  design?: string;
  price: number;
}

// Stripe is only instantiated inside the handler (server-side, at request time)
export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Payment service not configured." }, { status: 503 });
  }
  const stripe = new Stripe(stripeKey);

  try {
    const body: CheckoutBody = await req.json();
    const { platforms, color, design, price } = body;
    const designSummary = typeof design === "string" && design.trim()
      ? design.trim()
      : `${color} Carpet`;

    // Validate inputs
    if (
      typeof platforms !== "number" ||
      platforms < 2 ||
      platforms > 8 ||
      typeof color !== "string" ||
      !color.trim() ||
      typeof price !== "number" ||
      price !== platforms * 1000
    ) {
      return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
    }

    const tierName = PLATFORM_NAMES[platforms] ?? "Custom";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Natural Wood Cat Tree — ${tierName} (${platforms} Platforms, ${color} Carpet)`,
              description: `Handcrafted in Cheyenne, Wyoming. Sustainably sourced natural wood, sisal rope, ${designSummary}. ~30 day build time.`,
            },
            unit_amount: price * 100, // cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Flat Rate Shipping",
              description: "Ships from Cheyenne, Wyoming. Full tracking provided.",
            },
            unit_amount: SHIPPING_FLAT_RATE * 100, // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?platforms=${platforms}&color=${encodeURIComponent(color)}&design=${encodeURIComponent(designSummary)}`,
      cancel_url: `${siteUrl}/shop`,
      metadata: {
        platforms: String(platforms),
        color,
        design: designSummary,
        tier: tierName,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[checkout] Stripe error:", err);
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
