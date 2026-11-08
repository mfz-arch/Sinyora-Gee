import {
  ServiceCategory,
  SpaService,
  SpaProduct,
  UserAccount,
  ProductCategoryId,
  ProductTag,
} from '@/types';

export const STUDIO_INFO = {
  brandName: 'SINYORA GEE',
  subtitle: 'Luxury Facial, Cosmetics & Spa',
  slogan: 'Your Beauty, Our Priority',
  location: 'Royal Hostel',
  phone: '0616806679',
  secondaryAdminPhone: '0612509403',
  whatsappInternational: '255616806679',
  hours: 'Mon – Sun: 9:00 AM – 8:30 PM',
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'facial',
    title: 'Facial Services',
    tagline: 'Clear Skin • Healthy Skin • Happy You ♥',
    badge: 'Machine & Clinical Glow',
    description:
      'Advanced facial treatments powered by premium skincare machines, deep pore hydro-infusion, and gentle botanicals.',
  },
  {
    id: 'massage',
    title: 'Massage & Body Services',
    tagline: 'Relax • Rejuvenate • Restore ♥',
    badge: 'Deep Relaxation',
    description:
      'Melt away lecture and exam stress with soothing therapeutic body massages and warm essential oils.',
  },
  {
    id: 'bridal',
    title: 'Bridal & Event Packages',
    tagline: 'Look Beautiful on Your Special Day ♥',
    badge: 'VIP & Bridal',
    description:
      'Comprehensive luxury bridal and graduation packages combining skin prep, body spa, and HD makeup artistry.',
  },
  {
    id: 'makeup',
    title: 'Makeup Services',
    tagline: 'Enhance Your Natural Beauty ♥',
    badge: 'Flawless Artistry',
    description:
      'From effortless everyday campus glow to full red-carpet and bridal glamour tailored to your skin tone.',
  },
  {
    id: 'additional',
    title: 'Additional Services',
    tagline: 'Brows • Lashes • Healthy Hair ♥',
    badge: 'Finishing Touches',
    description:
      'Precision eyebrow sculpting, wispy eyelash extensions, and nourishing scalp & hair treatments.',
  },
];

export const INITIAL_SERVICES: SpaService[] = [
  // 1. FACIAL SERVICES (Exact Flyer Order)
  {
    id: 'srv-simple-facial',
    categoryId: 'facial',
    name: 'Simple Facial',
    price: 10000,
    duration: '35 mins',
    popular: true,
    badge: 'Student Favorite',
    description:
      'Deep pore cleansing, gentle exfoliation, steam therapy, relaxing facial massage, and a soothing botanical mask.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-hydro-facial',
    categoryId: 'facial',
    name: 'Hydro Facial',
    price: 25000,
    duration: '45 mins',
    popular: true,
    badge: 'Machine Treatment',
    description:
      'High-tech hydro-dermabrasion machine facial that vacuums clogged pores while infusing hyaluronic acid and antioxidant serums.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-enzymatic-facial',
    categoryId: 'facial',
    name: 'Enzymatic Facial',
    price: 35000,
    duration: '55 mins',
    badge: 'Brightening Peel',
    description:
      'Active natural fruit-enzyme resurfacing treatment that gently dissolves dark spots, hyperpigmentation, and uneven texture.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-korean-glass-skin',
    categoryId: 'facial',
    name: 'Korean Glass Skin',
    price: 35000,
    duration: '60 mins',
    popular: true,
    badge: 'Signature Luxury',
    description:
      'Our flagship multi-step luxury machine treatment delivering ultra-dewy, poreless, mirror-like luminous hydration.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-anti-aging-facial',
    categoryId: 'facial',
    name: 'Anti Aging Facial',
    price: 25000,
    duration: '50 mins',
    badge: 'Firming & Lift',
    description:
      'Collagen-stimulating machine therapy with peptide serums to firm skin texture, boost elasticity, and restore youthful radiance.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-acne-facial',
    categoryId: 'facial',
    name: 'Acne Facial',
    price: 25000,
    duration: '50 mins',
    popular: true,
    badge: 'Clear Skin',
    description:
      'Targeted antibacterial extraction, salicylic pore detox, and high-frequency LED calming therapy to clear stubborn breakouts.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-face-scrub',
    categoryId: 'facial',
    name: 'Face Scrub',
    price: 5000,
    duration: '20 mins',
    badge: 'Quick Glow',
    description:
      'Gentle exfoliating polish, warm steam towel, and hydrating mist to buff away dead skin cells and brighten dull skin.',
    image: '/flyer/facial-section.jpg',
  },
  {
    id: 'srv-facial-consultation',
    categoryId: 'facial',
    name: 'Skin Consultation',
    price: 0,
    duration: '15 mins',
    badge: 'FREE For Students',
    popular: true,
    description:
      'One-on-one professional skin assessment to analyze your skin type, acne/dryness concerns, and build your custom glow routine.',
    image: '/flyer/facial-section.jpg',
  },

  // 2. MASSAGE & BODY SERVICES
  {
    id: 'srv-massage-therapy',
    categoryId: 'massage',
    name: 'Massage Therapy',
    price: 20000,
    duration: '40 mins',
    badge: 'Stress Relief',
    description:
      'Focused neck, shoulder, and back massage therapy designed to release study posture stiffness and muscle fatigue.',
    image: '/flyer/massage-section.jpg',
  },
  {
    id: 'srv-full-body-massage',
    categoryId: 'massage',
    name: 'Full Body Massage',
    price: 25000,
    duration: '60 mins',
    popular: true,
    badge: 'Most Booked Spa',
    description:
      'Complete head-to-toe relaxation massage using warm nourishing oils to improve circulation and calm the nervous system.',
    image: '/flyer/massage-section.jpg',
  },
  {
    id: 'srv-aromatherapy-package',
    categoryId: 'massage',
    name: 'Aromatherapy Package',
    price: 35000,
    duration: '75 mins',
    badge: 'Luxury Ritual',
    description:
      'Full body massage infused with pure botanical essential oils, hot towel compress, and tranquil aromatherapy mist.',
    image: '/flyer/massage-section.jpg',
  },

  // 3. BRIDAL & EVENT PACKAGES
  {
    id: 'srv-bridal-package',
    categoryId: 'bridal',
    name: 'Bridal Package',
    price: 150000,
    duration: 'Half Day',
    badge: 'Essential Bride',
    description:
      'Includes pre-event Hydro Facial glow prep, Eyebrow Shaping, Eyelash Extensions, and full HD Bridal Makeup.',
    image: '/flyer/bridal-section.jpg',
  },
  {
    id: 'srv-luxury-bridal-package',
    categoryId: 'bridal',
    name: 'Luxury Bridal Package',
    price: 200000,
    duration: 'Full Prep',
    popular: true,
    badge: 'Royal Glow',
    description:
      'Includes Korean Glass Skin Facial, Full Body Massage, Brow & Lash styling, and signature Luxury Bridal Makeup.',
    image: '/flyer/bridal-section.jpg',
  },
  {
    id: 'srv-vip-bridal-package',
    categoryId: 'bridal',
    name: 'VIP Bridal Package',
    price: 250000,
    duration: 'VIP All-Inclusive',
    badge: 'Crown Jewel',
    description:
      'Complete multi-session skin & body transformation: Korean Glass Skin, Aromatherapy Spa Package, Lashes, Brows & VIP Bridal Glam.',
    image: '/flyer/bridal-section.jpg',
  },
  {
    id: 'srv-bridesmaids-package',
    categoryId: 'bridal',
    name: 'Bridesmaids Package',
    price: 250000,
    duration: 'Group Squad',
    badge: 'Bridal Squad',
    description:
      'Coordinated group glam package for bridesmaids featuring express glow skin prep, lashes, and long-wear Soft/Full Glam makeup.',
    image: '/flyer/bridal-section.jpg',
  },

  // 4. MAKEUP SERVICES
  {
    id: 'srv-simple-makeup',
    categoryId: 'makeup',
    name: 'Simple Makeup',
    price: 5000,
    duration: '25 mins',
    badge: 'Everyday Chic',
    description:
      'Clean, breathable skin enhancement with sculpted brows, concealer touch-up, blush, and glossy lips.',
    image: '/flyer/makeup-section.jpg',
  },
  {
    id: 'srv-soft-glam',
    categoryId: 'makeup',
    name: 'Soft Glam',
    price: 15000,
    duration: '45 mins',
    popular: true,
    badge: 'Birthday & Dates',
    description:
      'Seamless airbrushed-style base, warm neutral eyeshadow blend, wispy lashes, and radiant highlight.',
    image: '/flyer/makeup-section.jpg',
  },
  {
    id: 'srv-full-glam',
    categoryId: 'makeup',
    name: 'Full Glam',
    price: 25000,
    duration: '60 mins',
    popular: true,
    badge: 'Graduation & Events',
    description:
      'High-definition full coverage beat with dramatic eye artistry, luxury volume lashes, contour, and 16-hour lock setting.',
    image: '/flyer/makeup-section.jpg',
  },
  {
    id: 'srv-bridal-makeup',
    categoryId: 'makeup',
    name: 'Bridal Makeup',
    price: 65000,
    duration: '90 mins',
    badge: 'HD Waterproof',
    description:
      'Bespoke luxury bridal makeup using premium waterproof formulas, skin-prep priming, luxury mink lashes, and touch-up kit.',
    image: '/flyer/makeup-section.jpg',
  },

  // 5. ADDITIONAL SERVICES
  {
    id: 'srv-eyebrow-shaping',
    categoryId: 'additional',
    name: 'Eyebrow Shaping',
    price: 5000,
    duration: '15 mins',
    badge: 'Brows',
    description:
      'Precision brow mapping, gentle waxing/razoring, trimming, and concealer highlight for clean, lifted arches.',
    image: '/flyer/additional-section.jpg',
  },
  {
    id: 'srv-eyelash-extensions',
    categoryId: 'additional',
    name: 'Eyelash Extensions',
    price: 15000,
    duration: '45 mins',
    popular: true,
    badge: 'Lashes',
    description:
      'Feather-light classic, hybrid, or volume lash extensions customized to flatter your eye shape.',
    image: '/flyer/additional-section.jpg',
  },
  {
    id: 'srv-hair-treatment',
    categoryId: 'additional',
    name: 'Hair Treatment Products',
    price: 10000,
    duration: '35 mins',
    badge: 'Healthy Hair',
    description:
      'Nourishing botanical oil & mask scalp treatment to repair breakage, boost shine, and promote healthy hair growth.',
    image: '/flyer/additional-section.jpg',
  },
];

export const PRODUCT_CATEGORIES: {
  id: ProductCategoryId;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'facial-products',
    title: 'Facial Products',
    subtitle: 'Masks, Serums, Cleansers & Toners',
  },
  {
    id: 'body-care',
    title: 'Body Care Products',
    subtitle: 'Botanical Oils, Scrubs & Glow Lotions',
  },
  {
    id: 'hair-care',
    title: 'Hair Care Products',
    subtitle: 'Shampoos, Growth Oils & Deep Masks',
  },
  {
    id: 'natural-organic',
    title: 'Natural & Organic Products',
    subtitle: '100% Pure Cold-Pressed Oils & Clays',
  },
  {
    id: 'all-skin-types',
    title: 'Skincare for All Skin Types',
    subtitle: 'Daily Essentials & Cosmetics',
  },
];

export const PRODUCT_TAGS: ProductTag[] = [
  'Oils',
  'Masks',
  'Shampoos',
  'Serums',
  'Cleansers',
  'Scrubs',
  'Lotions',
  'Cosmetics',
];

// Kept blank by default as requested so management can upload products via Admin Portal
export const INITIAL_PRODUCTS: SpaProduct[] = [];

// Pre-configured Admin credentials requested by the user:
// 1) 0616806679 -> GHARIBA ABDURAHMAN (Password: Allah)
// 2) 0612509403 -> AIM'FIZ AHMED (Password: Allah)
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

export const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
  '07:30 PM',
];

