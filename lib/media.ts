// ──────────────────────────────────────────────
// LazyCat Trees — Site photography
// ──────────────────────────────────────────────

export interface SiteImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Hero right-side floating showcase */
export const HERO_SHOWCASE_IMAGES: (SiteImage & {
  className: string;
})[] = [
  {
    src: "/images/tree-7-level-green.png",
    alt: "Seven-level natural wood cat tree with green carpet",
    className: "top-[4%] right-[8%] w-[52%] z-30",
  },
  {
    src: "/images/cat-peek-orange.png",
    alt: "Orange tabby cat peeking through a platform hole",
    className: "top-[38%] right-[42%] w-[38%] z-40",
  },
  {
    src: "/images/tree-truck-cat.png",
    alt: "Ginger cat on a tall natural wood cat tree",
    className: "bottom-[6%] right-[4%] w-[44%] z-20",
  },
  {
    src: "/images/tree-purple.png",
    alt: "Purple-carpeted natural wood cat tree",
    className: "bottom-[18%] left-[0%] w-[36%] z-20",
  },
];

export const HERO_BACKGROUND: SiteImage = {
  src: "/images/hero-marketplace.png",
  alt: "LazyCat Trees display at an outdoor market with multiple handcrafted cat trees",
};

/** Homepage featured collection — maps to FEATURED_PRODUCTS ids */
export const FEATURED_PRODUCT_IMAGES: Record<string, SiteImage> = {
  classic: {
    src: "/images/tree-6-level-tan.png",
    alt: "Classic three-level natural wood cat tree with tan carpet",
  },
  grand: {
    src: "/images/tree-7-level-green.png",
    alt: "Grand six-level natural wood cat tree with green carpet",
  },
  pinnacle: {
    src: "/images/tree-red-orange.png",
    alt: "Pinnacle eight-level natural wood cat tree with red carpet",
  },
};

export const CRAFT_COLLAGE_IMAGES: SiteImage[] = [
  {
    src: "/images/product-grand.png",
    alt: "Terracotta carpeted natural wood cat tree",
  },
  {
    src: "/images/tree-beige-sisal.png",
    alt: "Beige carpeted natural wood cat tree",
  },
];

export const GALLERY_STRIP_IMAGES: SiteImage[] = [
  { src: "/images/tree-7-level-blue-kitten.png", alt: "Blue carpeted cat tree with kitten" },
  { src: "/images/tree-beige-sisal.png", alt: "Beige carpeted cat tree with sisal wrap" },
  { src: "/images/tree-blue-grey.png", alt: "Blue-grey carpeted natural wood cat tree" },
  { src: "/images/tree-terracotta.png", alt: "Terracotta carpeted cat tree in a pet store" },
  { src: "/images/tree-outdoor.png", alt: "Natural wood cat tree outdoors" },
  { src: "/images/tree-natural-wood.png", alt: "Natural wood multi-level cat tree" },
];

export const LIFESTYLE_IMAGES: SiteImage[] = [
  {
    src: "/images/cats-duo-tree.png",
    alt: "Two cats on a multi-level LazyCat tree",
    caption: "Built for climbing together",
  },
  {
    src: "/images/cat-grey-tabby.png",
    alt: "Grey tabby cat relaxing on a LazyCat perch",
    caption: "Handcrafted comfort",
  },
  {
    src: "/images/cat-orange-lounge.png",
    alt: "Orange cat lounging on a blue carpeted perch",
    caption: "Plush carpet, real wood",
  },
];

export const STORY_IMAGES = {
  hero: {
    src: "/images/showcase-collection.png",
    alt: "Collection of LazyCat Trees at a market showcase",
  },
  sidebar: {
    src: "/images/tree-4-level-store.png",
    alt: "LazyCat tree on display in a pet store",
  },
  grid: [
    { src: "/images/detail-wood-branch.png", alt: "Natural wood branch detail" },
    { src: "/images/detail-carpet.png", alt: "Thick shag carpet on a platform" },
    { src: "/images/detail-sisal.png", alt: "Sisal rope wrapping detail" },
    { src: "/images/tree-6-level-beige.png", alt: "Finished six-level cat tree" },
  ] as SiteImage[],
};

export const SHOP_GALLERY_IMAGES: SiteImage[] = [
  { src: "/images/tree-7-level-green.png", alt: "Seven-level green carpeted cat tree" },
  { src: "/images/tree-7-level-blue-kitten.png", alt: "Seven-level blue carpeted cat tree" },
  { src: "/images/tree-6-level-beige.png", alt: "Six-level beige carpeted cat tree" },
  { src: "/images/tree-red-orange.png", alt: "Tall red carpeted cat tree" },
  { src: "/images/tree-beige-sisal.png", alt: "Beige cat tree with sisal scratching wrap" },
  { src: "/images/tree-truck-cat.png", alt: "Cat perched on a tall natural wood tree" },
  { src: "/images/cats-store-display.png", alt: "LazyCat trees on display in store" },
  { src: "/images/cat-orange-store.png",   alt: "Orange cat on a natural wood cat tree in store" },
];

export const COMMISSION_HERO: SiteImage = {
  src: "/images/tree-red-orange.png",
  alt: "Bold red-carpeted custom cat tree",
};

export const COMMISSION_INSPIRATION: SiteImage[] = [
  { src: "/images/tree-purple.png", alt: "Purple carpeted custom cat tree" },
  { src: "/images/tree-outdoor.png", alt: "Outdoor natural wood cat tree" },
  { src: "/images/cat-peek-tabby.png", alt: "Cat peeking through a custom platform hole" },
];
