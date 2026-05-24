// ──────────────────────────────────────────────
// LazyCat Trees — Product Data & Business Constants
// ──────────────────────────────────────────────

export const BRAND = {
  name: "LazyCat Trees",
  tagline: "Where Nature Becomes Art",
  location: "Cheyenne, Wyoming",
  email: "hello@lazycattrees.com",
  facebook: "https://www.facebook.com/lazycattrees",
  etsy: "https://www.etsy.com/shop/LazyCatTrees",
} as const;

// ── Pricing ──────────────────────────────────
export const PRICE_PER_PLATFORM = 1000; // USD
export const SHIPPING_FLAT_RATE = 150;   // USD
export const MIN_PLATFORMS = 2;
export const MAX_PLATFORMS = 8;

export function getPrice(platforms: number): number {
  return platforms * PRICE_PER_PLATFORM;
}

export function getOrderTotal(platforms: number): number {
  return getPrice(platforms) + SHIPPING_FLAT_RATE;
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents);
}

// ── Platform Name Tiers ──────────────────────
export const PLATFORM_NAMES: Record<number, string> = {
  2: "Cozy Companion",
  3: "Classic",
  4: "Explorer",
  5: "Adventure",
  6: "Grand",
  7: "Majestic",
  8: "Pinnacle",
};

// ── Carpet Colors ─────────────────────────────
export interface CarpetColor {
  name: string;
  hex: string;
}

export const CARPET_COLORS: CarpetColor[] = [
  { name: "Black",  hex: "#1a1a1a" },
  { name: "Blue",   hex: "#3b5fc0" },
  { name: "Navy",   hex: "#1a2557" },
  { name: "Pink",   hex: "#f4a7b9" },
  { name: "Purple", hex: "#7b3fa0" },
  { name: "Red",    hex: "#b82020" },
  { name: "Brown",  hex: "#7a4020" },
  { name: "Green",  hex: "#1e7a3a" },
  { name: "Gray",   hex: "#6b6b6b" },
  { name: "Orange", hex: "#d45f10" },
  { name: "White",  hex: "#f0ede8" },
  { name: "Beige",  hex: "#d4c4a0" },
  { name: "Gold",   hex: "#c9a45e" },
  { name: "Silver", hex: "#a8a8b0" },
];

// ── Wood Types ────────────────────────────────
export const WOOD_TYPES = [
  { name: "Apple",   description: "Light, fine-grained, warm reddish tones" },
  { name: "Pine",    description: "Rustic knots, golden hues, aromatic" },
  { name: "Maple",   description: "Smooth, pale, elegant grain patterns" },
  { name: "Madrone", description: "Rich reddish-brown, dramatic swirling grain" },
] as const;

// ── Platform Specs ────────────────────────────
export const PLATFORM_SPECS = {
  baseDiameter: '24"',
  topPerch2Level: '15"',
  topPerchPlus3: '28" with access hole',
  sisalWrapping: "Included",
  hangingSisal: "Optional add-on",
  materials: "Chemical-free plywood, reclaimed natural wood, sisal rope",
  leadTime: "~30 days",
  shippingRate: "$150 flat rate",
  shipsFrom: "Cheyenne, Wyoming",
  returnsPolicy: "No returns or exchanges — all trees are made to order",
} as const;

// ── Featured Products (for homepage) ─────────
export interface FeaturedProduct {
  id: string;
  platforms: number;
  name: string;
  badge: "Popular" | "Bestseller" | "Signature";
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "classic",
    platforms: 3,
    name: PLATFORM_NAMES[3],
    badge: "Popular",
    description:
      "Three tiers of handcrafted natural wood, wrapped in sisal and finished with your choice of carpet. The perfect entry into a LazyCat tree.",
    imageSrc: "https://placehold.co/600x700/1c1917/c9a45e?text=Classic",
    imageAlt: "Classic 3-level natural wood cat tree",
  },
  {
    id: "grand",
    platforms: 6,
    name: PLATFORM_NAMES[6],
    badge: "Bestseller",
    description:
      "Six magnificent platforms rise to create a vertical sanctuary your cat will never want to leave. A statement piece for any room.",
    imageSrc: "https://placehold.co/600x700/1c1917/c9a45e?text=Grand",
    imageAlt: "Grand 6-level natural wood cat tree",
  },
  {
    id: "pinnacle",
    platforms: 8,
    name: PLATFORM_NAMES[8],
    badge: "Signature",
    description:
      "Our most ambitious creation. Eight platforms of reclaimed natural wood, each one unique. A towering testament to feline luxury.",
    imageSrc: "https://placehold.co/600x700/1c1917/c9a45e?text=Pinnacle",
    imageAlt: "Pinnacle 8-level natural wood cat tree",
  },
];

// ── Shop Gallery Images ───────────────────────
export const GALLERY_IMAGES = [
  { src: "https://placehold.co/600x400/1c1917/c9a45e?text=Gallery+1", alt: "Natural wood cat tree detail" },
  { src: "https://placehold.co/600x400/1c1917/c9a45e?text=Gallery+2", alt: "Sisal rope wrapped branch" },
  { src: "https://placehold.co/600x400/1c1917/c9a45e?text=Gallery+3", alt: "Multi-platform cat tree" },
  { src: "https://placehold.co/600x400/1c1917/c9a45e?text=Gallery+4", alt: "Wood grain detail" },
  { src: "https://placehold.co/600x400/1c1917/c9a45e?text=Gallery+5", alt: "Cat perch platform" },
  { src: "https://placehold.co/600x400/1c1917/c9a45e?text=Gallery+6", alt: "Finished cat tree installation" },
];

// ── Shop Thumbnails ───────────────────────────
export const SHOP_IMAGES = [
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Main+View", alt: "Natural wood cat tree main view" },
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Side+View", alt: "Side view" },
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Detail", alt: "Branch detail" },
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Platform", alt: "Platform close-up" },
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Sisal", alt: "Sisal wrapping" },
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Full+Tree", alt: "Full tree assembled" },
  { src: "https://placehold.co/800x900/1c1917/c9a45e?text=Carpet", alt: "Carpet color detail" },
];

// ── Commission Themes ─────────────────────────
export const COMMISSION_THEMES = [
  {
    name: "Mushroom",
    emoji: "🍄",
    description: "Already built — organic shapes, earthy tones, whimsical caps",
    built: true,
  },
  {
    name: "Egyptian Hieroglyphs",
    emoji: "𓂀",
    description: "Suggested — carved symbols, gold leaf accents, ancient mystique",
    built: false,
  },
  {
    name: "Forest / Botanical",
    emoji: "🌿",
    description: "Lush greenery palette, fern motifs, moss-inspired textures",
    built: false,
  },
  {
    name: "Space / Celestial",
    emoji: "✦",
    description: "Dark cosmos, star maps, lunar perches, cosmic grandeur",
    built: false,
  },
];

// ── FAQ ───────────────────────────────────────
export const FAQ_ITEMS = [
  {
    question: "How long does it take to build and ship?",
    answer:
      "Each tree is made to order and takes approximately 30 days to complete. After your order is placed, we'll reach out within 48 hours to confirm your selections and begin crafting.",
  },
  {
    question: "Do you ship nationwide?",
    answer:
      "Yes! We ship throughout the United States from our workshop in Cheyenne, Wyoming. Shipping is a flat $150 rate regardless of destination.",
  },
  {
    question: "Can I return or exchange my tree?",
    answer:
      "We do not accept returns or exchanges. Every tree is custom-built to your specifications — your choice of carpet color, platform count, and any custom requests. Because each piece is one-of-a-kind, all sales are final.",
  },
  {
    question: "What types of wood do you use?",
    answer:
      "We use apple, pine, maple, and madrone — all sustainably sourced through permits to collect downed trees, networking with local landowners, and special customer requests to repurpose trees from their own property.",
  },
  {
    question: "Can I choose my carpet color?",
    answer:
      "Absolutely! We offer 14 carpet colors: Black, Blue, Navy, Pink, Purple, Red, Brown, Green, Gray, Orange, White, Beige, Gold, and Silver. Select your color in the product configurator.",
  },
  {
    question: "Do you create custom-themed trees?",
    answer:
      "Yes — this is one of our favorite offerings. We've already built a mushroom-themed tree and have designs in mind for Egyptian Hieroglyphs, Forest/Botanical, and Space/Celestial themes. Visit our Commission page to describe your vision.",
  },
];

// ── Nav Links ─────────────────────────────────
export const NAV_LINKS = [
  { href: "/shop",       label: "Shop" },
  { href: "/commission", label: "Commission" },
  { href: "/story",      label: "Our Story" },
  { href: "/contact",    label: "Contact" },
] as const;

// ── Marquee Content ───────────────────────────
export const MARQUEE_ITEMS = [
  "Naturally Sourced Wood",
  "Handcrafted to Order",
  "One-of-a-Kind Designs",
  "Ships Nationwide",
  "Award-Winning Artistry",
  "Chemical-Free Materials",
  "30-Day Build Time",
  "Supporting Cats Everywhere",
];

// ── Stats ─────────────────────────────────────
export const STATS = [
  { value: "10+",         label: "Years of craft" },
  { value: "100%",        label: "Natural materials" },
  { value: "$1,000",      label: "Per platform" },
  { value: "30 Days",     label: "Lead time" },
] as const;

// ── Craft Features ────────────────────────────
export const CRAFT_FEATURES = [
  {
    title: "Natural Materials",
    description: "Chemical-free plywood, reclaimed wood, and natural sisal rope — nothing synthetic.",
  },
  {
    title: "Hand Built",
    description: "Every platform notched, leveled, and finished by hand in our Cheyenne workshop.",
  },
  {
    title: "Fully Customizable",
    description: "Choose your platforms, carpet color, wood type, and even a custom theme.",
  },
  {
    title: "Award-Winning",
    description: "Born from a first-prize competition win — artistry validated from the very beginning.",
  },
];

// ── How It Works Steps ────────────────────────
export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Choose",
    description:
      "Select your number of platforms (2–8), carpet color from 14 options, and any custom touches.",
  },
  {
    number: "02",
    title: "Craft",
    description:
      "We handcraft your tree from sustainably sourced wood, precisely notched and wrapped in natural sisal.",
  },
  {
    number: "03",
    title: "Inspect",
    description:
      "Every tree is cleaned, power-washed, and inspected before it ever leaves our workshop.",
  },
  {
    number: "04",
    title: "Ship",
    description:
      "Your tree ships from Cheyenne, Wyoming with care. Flat $150 nationwide. Estimated 30-day lead time.",
  },
];
