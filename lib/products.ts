// ──────────────────────────────────────────────
// LazyCat Trees — Product Data & Business Constants
// ──────────────────────────────────────────────

export const BRAND = {
  name: "LazyCat Trees",
  tagline: "Where Nature Becomes Art",
  location: "Cheyenne, Wyoming",
  email: "hello@lazycattrees.com",
  facebook: "https://www.facebook.com/lazycattrees",
  etsy: "https://lazycattreesllc.etsy.com/",
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

// ── Platform Design Themes ───────────────────
export type PlatformPattern =
  | "solid"
  | "stars-stripes"
  | "hieroglyphs"
  | "mushrooms"
  | "zebra"
  | "celestial";

export interface PlatformDesign {
  id: string;
  name: string;
  shortName: string;
  pattern: PlatformPattern;
  baseHex: string;
  accentHex: string;
  secondaryHex: string;
  description: string;
}

export const PLATFORM_DESIGNS: PlatformDesign[] = [
  {
    id: "solid",
    name: "Solid Carpet",
    shortName: "Solid",
    pattern: "solid",
    baseHex: "#d4c4a0",
    accentHex: "#c9a45e",
    secondaryHex: "#f0e8d8",
    description: "A single carpet color across the tree.",
  },
  {
    id: "stars-stripes",
    name: "Stars & Stripes",
    shortName: "USA",
    pattern: "stars-stripes",
    baseHex: "#0f1f3d",
    accentHex: "#b22234",
    secondaryHex: "#f0ece4",
    description: "Patriotic red, cream, and navy patterning.",
  },
  {
    id: "hieroglyphs",
    name: "Egyptian Glyphs",
    shortName: "Glyphs",
    pattern: "hieroglyphs",
    baseHex: "#c9a45e",
    accentHex: "#1a140f",
    secondaryHex: "#f1d98f",
    description: "Gold-toned platforms with carved-symbol inspired marks.",
  },
  {
    id: "mushrooms",
    name: "Mushroom Grove",
    shortName: "Mushroom",
    pattern: "mushrooms",
    baseHex: "#b22234",
    accentHex: "#f0ece4",
    secondaryHex: "#7a1f28",
    description: "Red cap platforms with oversized white spots.",
  },
  {
    id: "zebra",
    name: "Zebra Stripes",
    shortName: "Zebra",
    pattern: "zebra",
    baseHex: "#f0ece4",
    accentHex: "#101010",
    secondaryHex: "#d8ccb4",
    description: "Black-and-cream striped platforms inspired by recent custom builds.",
  },
  {
    id: "celestial",
    name: "Celestial Night",
    shortName: "Stars",
    pattern: "celestial",
    baseHex: "#111d36",
    accentHex: "#c9a45e",
    secondaryHex: "#f0ece4",
    description: "Deep navy platforms with star-map details.",
  },
];

export function getPlatformDesign(id: string): PlatformDesign {
  return PLATFORM_DESIGNS.find((design) => design.id === id) ?? PLATFORM_DESIGNS[0];
}

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
    imageSrc: "/images/tree-6-level-tan.png",
    imageAlt: "Classic natural wood cat tree with tan carpet",
  },
  {
    id: "grand",
    platforms: 6,
    name: PLATFORM_NAMES[6],
    badge: "Bestseller",
    description:
      "Six magnificent platforms rise to create a vertical sanctuary your cat will never want to leave. A statement piece for any room.",
    imageSrc: "/images/tree-7-level-green.png",
    imageAlt: "Grand six-level natural wood cat tree",
  },
  {
    id: "pinnacle",
    platforms: 8,
    name: PLATFORM_NAMES[8],
    badge: "Signature",
    description:
      "Our most ambitious creation. Eight platforms of reclaimed natural wood, each one unique. A towering testament to feline luxury.",
    imageSrc: "/images/tree-7-level-stars.png",
    imageAlt: "Pinnacle seven-level natural wood cat tree",
  },
];

// ── Featured Items (homepage cards) ──────────
export interface FeaturedItem {
  slug: string;
  name: string;
  platforms: number;
  platformRange: string;
  image: string;
  badge: string;
  description: string;
  fromPrice: number;
}

export const FEATURED_ITEMS: FeaturedItem[] = [
  {
    slug: "classic",
    name: "Classic Cat Tree",
    platforms: 3,
    platformRange: "2–3 Platforms",
    image: "/images/product-classic.png",
    badge: "Entry Level",
    description:
      "A beautifully proportioned 2 or 3-level tree — the perfect introduction to LazyCat craftsmanship.",
    fromPrice: 2000,
  },
  {
    slug: "grand",
    name: "Grand Cat Tree",
    platforms: 5,
    platformRange: "4–6 Platforms",
    image: "/images/product-grand.png",
    badge: "Most Popular",
    description:
      "Five levels of climbing, lounging, and scratching. The sweet spot between presence and elegance.",
    fromPrice: 4000,
  },
  {
    slug: "pinnacle",
    name: "Pinnacle Cat Tree",
    platforms: 7,
    platformRange: "7–8 Platforms",
    image: "/images/product-pinnacle.png",
    badge: "Signature",
    description:
      "A towering statement piece. For the cat that deserves nothing less than extraordinary.",
    fromPrice: 7000,
  },
];

// ── Shop Gallery Images ───────────────────────
export const GALLERY_IMAGES = [
  { src: "/images/tree-7-level-blue-kitten.png", alt: "Blue carpeted cat tree with kitten" },
  { src: "/images/tree-beige-sisal.png", alt: "Beige carpeted cat tree with sisal wrap" },
  { src: "/images/tree-blue-grey.png", alt: "Blue-grey carpeted natural wood cat tree" },
  { src: "/images/tree-terracotta.png", alt: "Terracotta carpeted cat tree in a pet store" },
  { src: "/images/tree-outdoor.png", alt: "Natural wood cat tree outdoors" },
  { src: "/images/tree-natural-wood.png", alt: "Natural wood multi-level cat tree" },
];

// ── Shop Thumbnails ───────────────────────────
export const SHOP_IMAGES = [
  { src: "/images/tree-7-level-green.png", alt: "Seven-level green carpeted cat tree" },
  { src: "/images/tree-7-level-blue-kitten.png", alt: "Seven-level blue carpeted cat tree" },
  { src: "/images/tree-6-level-tan.png", alt: "Six-level tan carpeted cat tree" },
  { src: "/images/tree-red-orange.png", alt: "Tall red carpeted cat tree" },
  { src: "/images/tree-beige-sisal.png", alt: "Beige cat tree with sisal scratching wrap" },
  { src: "/images/tree-truck-cat.png", alt: "Cat perched on a tall natural wood tree" },
  { src: "/images/cats-store-display.png", alt: "LazyCat trees on display in store" },
];

// ── Commission Themes ─────────────────────────
export const COMMISSION_THEMES = [
  {
    name: "Mushroom",
    emoji: "🍄",
    description: "Organic shapes, earthy tones, whimsical caps",
    built: true,
  },
  {
    name: "Egyptian Hieroglyphs",
    emoji: "𓂀",
    description: "Carved symbols, gold leaf accents, ancient mystique",
    built: false,
  },
  {
    name: "Stars & Stripes",
    emoji: "★",
    description: "Patriotic red, white, and blue platform accents",
    built: false,
  },
  {
    name: "Zebra Stripes",
    emoji: "▧",
    description: "High-contrast black and cream striping",
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
      "Yes — this is one of our favorite offerings. We've already built a mushroom-themed tree and have designs in mind for Egyptian Hieroglyphs, Stars & Stripes, Zebra Stripes, and Space/Celestial themes. Visit the Custom Order page to describe your vision.",
  },
];

// ── Nav Links ─────────────────────────────────
export const NAV_LINKS = [
  { href: "/shop",       label: "Shop" },
  { href: "/commission", label: "Custom Order" },
  { href: "/story",      label: "Our Story" },
  { href: "/contact",    label: "Contact" },
] as const;

// ── Marquee Content ───────────────────────────
export const MARQUEE_ITEMS = [
  "Handcrafted in America",
  "Natural Wyoming Wood",
  "One-of-a-Kind Designs",
  "Ships Nationwide",
  "American Made",
  "Supporting Cats Everywhere",
  "30-Day Build Time",
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
      "Select your number of platforms (2–8), carpet color, platform theme, and any custom touches.",
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
