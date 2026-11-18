import { SpaService, SpaProduct, UserAccount } from './types';

export const INITIAL_SERVICES: SpaService[] = [
  // 1. FACIAL SERVICES (8 Services)
  {
    id: 'fac-simple',
    categoryId: 'facial',
    name: 'Simple Facial',
    price: 10000,
    duration: '35 min',
    description:
      'Refreshing cleanse, gentle steam, blackhead extraction, and hydrating mask for everyday campus glow.',
  },
  {
    id: 'fac-hydro',
    categoryId: 'facial',
    name: 'Hydro Facial',
    price: 25000,
    duration: '50 min',
    description:
      'Deep hydro-dermabrasion machine treatment that vacuums clogged pores while infusing hyaluronic moisture.',
    popular: true,
  },
  {
    id: 'fac-enzymatic',
    categoryId: 'facial',
    name: 'Enzymatic Facial',
    price: 35000,
    duration: '60 min',
    description:
      'Active fruit-enzyme resurfacing treatment that dissolves dead skin cells and brightens uneven tone.',
  },
  {
    id: 'fac-korean-glass',
    categoryId: 'facial',
    name: 'Korean Glass Skin',
    price: 35000,
    duration: '65 min',
    description:
      'Multi-step K-Beauty ampoule infusion, LED therapy, and dewy collagen lock for mirror-like luminous skin.',
    popular: true,
  },
  {
    id: 'fac-anti-aging',
    categoryId: 'facial',
    name: 'Anti Aging Facial',
    price: 25000,
    duration: '55 min',
    description:
      'Firming micro-current and peptide lifting facial to smooth fine lines and restore skin elasticity.',
  },
  {
    id: 'fac-acne',
    categoryId: 'facial',
    name: 'Acne Facial',
    price: 25000,
    duration: '55 min',
    description:
      'High-frequency antibacterial therapy, salicylic pore detox, and calming centella mask for breakout-prone skin.',
    popular: true,
  },
  {
    id: 'fac-scrub',
    categoryId: 'facial',
    name: 'Face Scrub',
    price: 5000,
    duration: '20 min',
    description:
      'Quick botanical micro-polish to buff away dullness and leave skin baby-soft.',
  },
  {
    id: 'fac-consultation',
    categoryId: 'facial',
    name: 'Skin Consultation',
    price: 0,
    duration: '15 min',
    description:
      'FREE personalized 1-on-1 skin analysis with Sinyora Gee to map your skin type, concerns, and routine.',
    popular: true,
  },

  // 2. MASSAGE & BODY SERVICES (3 Services)
  {
    id: 'mas-therapy',
    categoryId: 'massage',
    name: 'Massage Therapy',
    price: 20000,
    duration: '45 min',
    description:
      'Targeted neck, shoulder, and back relief using warm botanical oils to melt exam and study tension.',
  },
  {
    id: 'mas-full-body',
    categoryId: 'massage',
    name: 'Full Body Massage',
    price: 25000,
    duration: '60 min',
    description:
      'Head-to-toe Swedish & deep-relaxation massage to improve circulation and total body calm.',
    popular: true,
  },
  {
    id: 'mas-aromatherapy',
    categoryId: 'massage',
    name: 'Aromatherapy Package',
    price: 35000,
    duration: '75 min',
    description:
      'Luxury essential-oil ceremony with warm towels, full-body massage, and stress-relief scalp therapy.',
    popular: true,
  },

  // 3. BRIDAL & EVENT PACKAGES (4 Services)
  {
    id: 'bri-standard',
    categoryId: 'bridal',
    name: 'Bridal Package',
    price: 150000,
    duration: '3 hrs',
    description:
      'Complete pre-wedding glow facial, full bridal makeup, lash installation, and skin prep.',
  },
  {
    id: 'bri-luxury',
    categoryId: 'bridal',
    name: 'Luxury Bridal Package',
    price: 200000,
    duration: '4 hrs',
    description:
      'Korean Glass Skin facial, full-body aromatherapy massage, HD bridal glam, and touch-up kit.',
    popular: true,
  },
  {
    id: 'bri-vip',
    categoryId: 'bridal',
    name: 'VIP Bridal Package',
    price: 250000,
    duration: '5 hrs',
    description:
      'Our crown-jewel royal treatment: multi-day skin prep, aromatherapy spa, VIP bridal makeup, lashes & brow sculpting.',
    popular: true,
  },
  {
    id: 'bri-bridesmaids',
    categoryId: 'bridal',
    name: 'Bridesmaids Package',
    price: 250000,
    duration: 'Group Session',
    description:
      'Coordinated radiant glam and mini-glow prep package tailored for the bridal entourage.',
  },

  // 4. MAKEUP SERVICES (4 Services)
  {
    id: 'mkp-simple',
    categoryId: 'makeup',
    name: 'Simple Makeup',
    price: 5000,
    duration: '25 min',
    description:
      'Natural everyday skin tint, brow definition, and lip gloss for classes or casual outings.',
  },
  {
    id: 'mkp-soft-glam',
    categoryId: 'makeup',
    name: 'Soft Glam',
    price: 15000,
    duration: '45 min',
    description:
      'Flawless blended base, soft eyeshadow, sculpted cheeks, and wispy lashes for birthdays or dinner dates.',
    popular: true,
  },
  {
    id: 'mkp-full-glam',
    categoryId: 'makeup',
    name: 'Full Glam',
    price: 25000,
    duration: '60 min',
    description:
      'High-definition graduation, photoshoot, or red-carpet glam with full contour, dramatic eyes, and setting lock.',
    popular: true,
  },
  {
    id: 'mkp-bridal',
    categoryId: 'makeup',
    name: 'Bridal Makeup',
    price: 65000,
    duration: '90 min',
    description:
      'Waterproof, tear-proof luxury bridal artistry with skin prep, premium 3D lashes, and long-wear radiance.',
  },

  // 5. ADDITIONAL SERVICES (3 Services)
  {
    id: 'add-eyebrow',
    categoryId: 'additional',
    name: 'Eyebrow Shaping',
    price: 5000,
    duration: '15 min',
    description:
      'Precision razor/tweezing arch sculpting and brow tinting to frame your face.',
  },
  {
    id: 'add-eyelash',
    categoryId: 'additional',
    name: 'Eyelash Extensions',
    price: 15000,
    duration: '60 min',
    description:
      'Lightweight classic, hybrid, or volume lash extensions for effortless daily glamour.',
    popular: true,
  },
  {
    id: 'add-hair-treatment',
    categoryId: 'additional',
    name: 'Hair Treatment Products',
    price: 10000,
    duration: '40 min',
    description:
      'Nourishing scalp & deep-conditioning hair treatment session using botanical oils and masks.',
  },
];

export const INITIAL_PRODUCTS: SpaProduct[] = [];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'admin-sinyora-1',
    name: 'GHARIBA ABDURAHMAN',
    phone: '0616806679',
    password: 'Allah',
    role: 'admin',
    title: 'Founder & Lead Aesthetician',
    hostel: 'Royal Hostel',
    createdAt: '2026-10-31T10:00:00.000Z',
  },
  {
    id: 'admin-partner-2',
    name: "AIM'FIZ AHMED",
    phone: '0612509403',
    password: 'Allah',
    role: 'admin',
    title: 'Co-Founder & Management Director',
    hostel: 'Royal Hostel Management',
    createdAt: '2026-10-31T10:00:00.000Z',
  },
];

