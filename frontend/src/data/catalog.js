// Static showcase catalog.
//
// The site currently runs without a backend, so products and categories come
// from this file instead of `/api/v1/products` and `/api/v1/categories`.
// Customers enquire on WhatsApp or visit the store; there is no online checkout.
//
// Photos are representative styles (Unsplash), not exact stock. Every photo is
// used exactly once across the site — add new ones here rather than reusing.
// When the backend is live again, see `src/api/products.js` and `src/App.jsx`.

const unsplash = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=75&auto=format&fit=crop`

export const CATEGORIES = [
  {
    slug: 'handbags',
    name: 'Handbags',
    blurb: 'Structured, tote and top-handle styles',
    image: unsplash('1584917865442-de89df76afd3', 700),
  },
  {
    slug: 'purses-clutches',
    name: 'Purses & Clutches',
    blurb: 'Party clutches, slings and wallets',
    image: unsplash('1566150905458-1bf1fc113f0d', 700),
  },
  {
    slug: 'attachi-trolley',
    name: 'Attachi & Trolley',
    blurb: 'Cabin and check-in sizes',
    image: unsplash('1565026057447-bc90a3dceb87', 700),
  },
  {
    slug: 'backpacks-travel',
    name: 'Backpacks & Travel',
    blurb: 'College, office and weekend bags',
    image: unsplash('1622560480605-d83c853bc5c3', 700),
  },
]

export const STYLES = [
  {
    slug: 'woven-chain-shoulder-bag',
    name: 'Woven Chain Shoulder Bag',
    category: 'handbags',
    tag: 'New design',
    occasion: 'Everyday',
    image: unsplash('1598532163257-ae3c6b2524b6'),
    description:
      'Soft woven body with a chunky chain strap. Roomy enough for a phone, wallet and daily essentials.',
  },
  {
    slug: 'teal-top-handle-satchel',
    name: 'Teal Top-Handle Satchel',
    category: 'handbags',
    tag: 'Office wear',
    occasion: 'Work',
    image: unsplash('1594223274512-ad4803739b7c'),
    description:
      'Structured satchel with a push-lock flap and detachable strap. Fits a small diary and tiffin.',
  },
  {
    slug: 'floral-print-handbag',
    name: 'Floral Print Handbag',
    category: 'handbags',
    tag: 'Festive',
    occasion: 'Party',
    image: unsplash('1591561954557-26941169b49e'),
    description: 'Printed handbag that pairs well with suits and sarees for weddings and functions.',
  },
  {
    slug: 'everyday-tote',
    name: 'Everyday Shoulder Tote',
    category: 'handbags',
    tag: 'Everyday',
    occasion: 'Everyday',
    image: unsplash('1524498250077-390f9e378fc0'),
    description: 'Wide open tote with long handles. Our go-to suggestion for shopping and college.',
  },
  {
    slug: 'studded-flap-bag',
    name: 'Studded Flap Bag',
    category: 'handbags',
    tag: 'Trending',
    occasion: 'Party',
    image: unsplash('1559563458-527698bf5295'),
    description: 'Compact flap bag with studded trim and a chain-link strap for evenings out.',
  },
  {
    slug: 'black-structured-tote',
    name: 'Black Structured Tote',
    category: 'handbags',
    tag: 'Office wear',
    occasion: 'Work',
    image: unsplash('1614179689702-355944cd0918'),
    description: 'Clean black tote that holds its shape. Fits files and a small laptop.',
  },
  {
    slug: 'croc-texture-mini-bag',
    name: 'Croc-Texture Mini Bag',
    category: 'purses-clutches',
    tag: 'Party wear',
    occasion: 'Party',
    image: unsplash('1575032617751-6ddec2089882'),
    description: 'Glossy maroon mini bag with a gold clasp. Small, but fits phone, cards and lipstick.',
  },
  {
    slug: 'pastel-sling-purse',
    name: 'Pastel Chain Sling',
    category: 'purses-clutches',
    tag: 'New design',
    occasion: 'Party',
    image: unsplash('1612902456551-333ac5afa26e'),
    description: 'Light pastel sling with a fine chain strap — easy to carry, easy to match.',
  },
  {
    slug: 'leather-bifold-wallet',
    name: 'Bifold Wallet',
    category: 'purses-clutches',
    tag: 'Gift idea',
    occasion: 'Everyday',
    image: unsplash('1627123424574-724758594e93'),
    description: 'Slim bifold wallet with card slots and a note section. A popular gifting pick.',
  },
  {
    slug: 'hard-shell-trolley',
    name: 'Hard-Shell Trolley',
    category: 'attachi-trolley',
    tag: 'Travel',
    occasion: 'Travel',
    image: unsplash('1581553680321-4fffae59fccd'),
    description: 'Four-wheel hard-shell trolley, available in cabin and check-in sizes. Ask for the set price.',
  },
  {
    slug: 'tan-crossbody-bag',
    name: 'Tan Crossbody Bag',
    category: 'handbags',
    tag: 'Everyday',
    occasion: 'Everyday',
    image: unsplash('1600857062241-98e5dba7f214'),
    description: 'Neat flap crossbody with an adjustable strap — hands-free for markets and travel.',
  },
  {
    slug: 'grey-buckle-satchel',
    name: 'Grey Buckle Satchel',
    category: 'handbags',
    tag: 'College',
    occasion: 'Work',
    image: unsplash('1605733513597-a8f8341084e6'),
    description: 'Classic twin-buckle satchel with a top handle and shoulder strap. Fits A4 notes.',
  },
  {
    slug: 'two-tone-laptop-bag',
    name: 'Two-Tone Office Bag',
    category: 'backpacks-travel',
    tag: 'Office wear',
    occasion: 'Work',
    image: unsplash('1608731267464-c0c889c2ff92'),
    description: 'Slim office bag with laptop space, zip closure and a detachable shoulder strap.',
  },
  {
    slug: 'leather-messenger-bag',
    name: 'Leather-Look Messenger',
    category: 'backpacks-travel',
    tag: 'Classic',
    occasion: 'Work',
    image: unsplash('1473188588951-666fce8e7c68'),
    description: 'Buckled messenger bag with a long strap — a smart pick for office and short trips.',
  },
  {
    slug: 'everyday-backpack',
    name: 'Everyday Backpack',
    category: 'backpacks-travel',
    tag: 'College',
    occasion: 'Everyday',
    image: unsplash('1553062407-98eeb64c6a62'),
    description: 'Lightweight backpack with a padded back and laptop sleeve for school and college.',
  },
  {
    slug: 'weekender-backpack',
    name: 'Weekender Backpack',
    category: 'backpacks-travel',
    tag: 'Travel',
    occasion: 'Travel',
    image: unsplash('1585916420730-d7f95e942d43'),
    description: 'Large-capacity backpack with multiple compartments for weekend trips.',
  },
]

// Extra photos used only in the gallery and banners, so no image repeats.
export const ATMOSPHERE = {
  promo: unsplash('1563904092230-7ec217b65fe2', 1600),
  gallery: [
    unsplash('1606522754091-a3bbf9ad4cb3', 400),
    unsplash('1564422170194-896b89110ef8', 400),
  ],
}

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function styleBySlug(slug) {
  return STYLES.find((s) => s.slug === slug)
}
