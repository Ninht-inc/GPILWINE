export type HeroSlide = {
  id: string
  productName: string
  eyebrow: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
  backgroundImage: string
  bottleImage: string
  accentColor: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'natural-sweet-red',
    productName: 'GPIL Natural Sweet Red',
    eyebrow: 'Discover the',
    title: 'Taste of\nGPIL Wines',
    description: 'South African Wine Heritage.\nModern African Lifestyle. Premium Enjoyment.',
    primaryCta: 'SHOP OUR WINES',
    secondaryCta: 'EXPLORE THE RANGE',
    backgroundImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/hero-natural-sweet-red-bg',
    bottleImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-natural-sweet-red',
    accentColor: '#641B2A',
  },
  {
    id: 'pinotage-2025',
    productName: 'GPIL Pinotage 2025',
    eyebrow: 'Premium Collection',
    title: 'Experience Premium\nPinotage',
    description: 'Bold flavors from award-winning\nSouth African vineyards.',
    primaryCta: 'SHOP OUR WINES',
    secondaryCta: 'EXPLORE THE RANGE',
    backgroundImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/hero-pinotage-2025-bg',
    bottleImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-pinotage-2025',
    accentColor: '#3B101A',
  },
  {
    id: 'sweet-white',
    productName: 'GPIL Sweet White',
    eyebrow: 'Coming Soon',
    title: 'Discover Sweet White\nExcellence',
    description: 'Crisp, refreshing wines crafted\nfor every celebration.',
    primaryCta: 'SHOP OUR WINES',
    secondaryCta: 'EXPLORE THE RANGE',
    backgroundImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/hero-sweet-white-bg',
    bottleImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-sweet-white',
    accentColor: '#68775B',
  },
  {
    id: 'executive-rose',
    productName: 'GPIL Executive Rosé',
    eyebrow: 'Rosé Collection',
    title: 'Elevate Your\nMoments',
    description: 'Premium rosé for life\'s\nspecial occasions.',
    primaryCta: 'SHOP OUR WINES',
    secondaryCta: 'EXPLORE THE RANGE',
    backgroundImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/hero-executive-rose-bg',
    bottleImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-executive-rose',
    accentColor: '#C9828E',
  },
  {
    id: 'chamdor-non-alcoholic',
    productName: 'GM Chamdor Non-Alcoholic',
    eyebrow: 'For Everyone',
    title: 'Celebrate Without\nCompromise',
    description: 'Premium non-alcoholic wine\nfor everyone.',
    primaryCta: 'SHOP OUR WINES',
    secondaryCta: 'EXPLORE THE RANGE',
    backgroundImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/hero-chamdor-non-alcoholic-bg',
    bottleImage: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-chamdor-non-alcoholic',
    accentColor: '#C6A15B',
  },
]

export type WineProduct = {
  id: string
  name: string
  subtitle: string
  descriptors: string[]
  abv: string
  volume: string
  image: string
  available: boolean
  ctaText: string
}

export const wineProducts: WineProduct[] = [
  {
    id: 'natural-sweet-red',
    name: 'GPIL Natural Sweet Red',
    subtitle: 'South African Sweet Red Wine',
    descriptors: ['Sweet', 'Smooth', 'Fruity'],
    abv: '12%',
    volume: '750 ml',
    image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-natural-sweet-red',
    available: true,
    ctaText: 'VIEW WINE',
  },
  {
    id: 'pinotage-2025',
    name: 'GPIL Pinotage 2025',
    subtitle: 'South African Red Wine',
    descriptors: ['Smooth', 'Fruity', 'Well-Balanced'],
    abv: '13.5%',
    volume: '750 ml',
    image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-pinotage-2025',
    available: true,
    ctaText: 'VIEW WINE',
  },
  {
    id: 'sweet-white',
    name: 'GPIL Sweet White',
    subtitle: 'South African Sweet White Wine',
    descriptors: [],
    abv: '',
    volume: '',
    image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-sweet-white',
    available: false,
    ctaText: 'COMING SOON',
  },
  {
    id: 'executive-rose',
    name: 'GPIL Executive Rosé',
    subtitle: 'South African Rosé Wine',
    descriptors: [],
    abv: '',
    volume: '',
    image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-executive-rose',
    available: false,
    ctaText: 'COMING SOON',
  },
  {
    id: 'chamdor-non-alcoholic',
    name: 'GM Chamdor Non-Alcoholic Wine',
    subtitle: 'Non-Alcoholic Sparkling Wine',
    descriptors: [],
    abv: '',
    volume: '',
    image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/bottle-chamdor-non-alcoholic',
    available: false,
    ctaText: 'COMING SOON',
  },
]

export type FoodPairing = {
  name: string
  image: string
}

export const foodPairings: FoodPairing[] = [
  { name: 'Jollof Rice', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/jollof-rice' },
  { name: 'Suya', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/suya' },
  { name: 'Grilled Chicken', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/grilled-chicken' },
  { name: 'Barbecued Meats', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/barbecued-meats' },
  { name: 'Pizza', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/pizza' },
  { name: 'Pasta', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/pasta' },
  { name: 'Burgers', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/burgers' },
  { name: 'Desserts', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/pairings/desserts' },
]

export type Occasion = {
  title: string
  image: string
}

export const occasions: Occasion[] = [
  { title: 'Dinner &\nDate Nights', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/occasions/dinner-date-nights' },
  { title: 'Celebrations', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/occasions/celebrations' },
  { title: 'Weekends with\nFriends', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/occasions/weekends-friends' },
  { title: 'Weddings &\nParties', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/occasions/weddings-parties' },
  { title: 'Gifting', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/occasions/gifting' },
  { title: 'Business &\nSpecial Occasions', image: 'https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/occasions/business-occasions' },
]

export const brandValues = [
  {
    icon: 'heritage',
    title: 'South African Heritage',
    description: 'Crafted in the renowned Western Cape, our wines reflect a legacy of quality, character and winemaking excellence.',
  },
  {
    icon: 'enjoyment',
    title: 'Made for Enjoyment',
    description: 'Smooth, versatile and food-friendly wines that are easy to enjoy and perfect for every lifestyle.',
  },
  {
    icon: 'celebrate',
    title: 'Celebrate Every Moment',
    description: "From casual get-togethers to life's biggest celebrations, GPIL wines make every moment special.",
  },
]

export const experienceValues = [
  {
    icon: 'heritage',
    title: 'South African Heritage',
    description: "Expertly crafted in the Western Cape, one of the world's most celebrated wine regions.",
  },
  {
    icon: 'enjoyment',
    title: 'Made for Enjoyment',
    description: 'Smooth, fruity and approachable wines that fit beautifully into your lifestyle and every occasion.',
  },
  {
    icon: 'celebrate',
    title: 'Celebrate Every Moment',
    description: "From relaxed dinners to grand celebrations, there's a GPIL wine for every moment.",
  },
  {
    icon: 'quality',
    title: 'Quality You Can Trust',
    description: 'Produced by award-winning winemakers with passion, care and uncompromising standards.',
  },
]
