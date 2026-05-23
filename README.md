# LazyCat Trees — Premium E-Commerce Website

A luxury e-commerce website for **LazyCat Trees, LLC** — handcrafted natural wood cat trees from Cheyenne, Wyoming.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Stripe**, and **Resend**.

---

## Tech Stack

| Layer       | Technology                                                      |
|-------------|------------------------------------------------------------------|
| Framework   | Next.js 16 (App Router)                                         |
| Language    | TypeScript                                                       |
| Styling     | Tailwind CSS v4                                                  |
| Payments    | Stripe Checkout                                                  |
| Email       | Resend                                                           |
| Fonts       | Playfair Display · Cormorant Garamond · Jost (via next/font)    |
| Deploy      | Vercel                                                           |

---

## Pages

| Route          | Description                                                |
|----------------|------------------------------------------------------------|
| `/`            | Homepage — hero, featured collection, craft, gallery        |
| `/shop`        | Product configurator — platforms, color, Stripe checkout   |
| `/commission`  | Custom order form with theme examples                       |
| `/story`       | Brand story — origin, materials, mission                   |
| `/contact`     | Contact form + FAQ accordion                               |
| `/success`     | Post-checkout confirmation page                            |

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/lazy-cat-trees.git
cd lazy-cat-trees
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

| Variable                             | Where to get it                                                      |
|--------------------------------------|----------------------------------------------------------------------|
| `STRIPE_SECRET_KEY`                  | [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page as above                                                   |
| `STRIPE_WEBHOOK_SECRET`              | Stripe Dashboard → Webhooks                                          |
| `RESEND_API_KEY`                     | [Resend Dashboard](https://resend.com/api-keys)                      |
| `CONTACT_EMAIL`                      | Email address to receive form submissions                            |
| `NEXT_PUBLIC_SITE_URL`               | `http://localhost:3000` for dev, your domain for prod                |

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding Product Photos

Replace placeholder images by adding real photos to `public/images/` and updating the `imageSrc` values in `lib/products.ts` and the `src` props in each page.

**Recommended image sizes:**
- Hero background: 1920×1080 JPG
- Product configurator shots: 800×900 JPG
- Gallery strip: 600×600 JPG
- Story photos: 600×500 JPG

---

## Deployment (Vercel)

```bash
npx vercel
```

Set the same environment variables in **Vercel → Settings → Environment Variables** (update `NEXT_PUBLIC_SITE_URL` to your live domain).

### Stripe Webhook

After deploying, add a webhook in [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks):
- Endpoint: `https://yourdomain.com/api/stripe-webhook`
- Events: `checkout.session.completed`

Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.

### Resend Domain

Verify your sending domain in [Resend → Domains](https://resend.com/domains), then update the `from:` address in `app/api/contact/route.ts`.

---

## Business Configuration

All pricing, product data, and content lives in **`lib/products.ts`**:

- `PRICE_PER_PLATFORM` — $1,000 per platform
- `SHIPPING_FLAT_RATE` — $150 flat rate
- `CARPET_COLORS` — 14 carpet color options
- `PLATFORM_NAMES` — Tier names per platform count
- `FAQ_ITEMS`, `MARQUEE_ITEMS`, `STATS` — Homepage and contact page content

---

## Project Structure

```
lazy-cat-trees/
├── app/
│   ├── globals.css                # Tailwind v4 theme + custom CSS
│   ├── layout.tsx                 # Root layout, fonts, Nav, Footer
│   ├── page.tsx                   # Homepage
│   ├── shop/page.tsx              # Configurator
│   ├── commission/page.tsx        # Custom order form
│   ├── story/page.tsx             # About / brand story
│   ├── contact/page.tsx           # Contact + FAQ
│   ├── success/page.tsx           # Post-checkout confirmation
│   └── api/
│       ├── checkout/route.ts      # Stripe Checkout session
│       └── contact/route.ts       # Resend email handler
├── components/
│   ├── Nav.tsx                    # Sticky nav with mobile hamburger
│   ├── Footer.tsx                 # Footer
│   ├── ProductConfigurator.tsx    # Interactive shop (client)
│   ├── ContactForm.tsx            # Contact + commission form (client)
│   ├── FAQAccordion.tsx           # Expandable FAQ (client)
│   └── GoldLine.tsx               # Decorative gold rule + EyebrowLabel
├── lib/
│   └── products.ts                # All data, types, business constants
├── public/
│   └── images/                    # Product photos go here
├── .env.local.example
├── next.config.ts
└── package.json
```

---

## License

Proprietary — © LazyCat Trees, LLC. All rights reserved.
# lazycat-trees
