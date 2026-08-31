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
    backgroundImage: 'https://cdn.abacus.ai/images/4b8a36d3-4c57-4c18-9f25-cc499b84829a.png',
    bottleImage: 'https://cdn.abacus.ai/images/a6db3584-1fb5-4365-884c-99c927e1d0d1.png',
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
    backgroundImage: 'https://cdn.abacus.ai/images/936d1efc-a386-4163-9a9b-4564312a289d.png',
    bottleImage: 'https://cdn.abacus.ai/images/cf179677-995f-4cb2-b8fc-950c96409fba.png',
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
    backgroundImage: 'https://cdn.abacus.ai/images/bc5a023c-054b-41d7-928a-1ef36797f499.png',
    bottleImage: 'https://cdn.abacus.ai/images/16922ca9-ba29-4c95-a87d-ce96be838eee.png',
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
    backgroundImage: 'https://cdn.abacus.ai/images/6490f560-a1ef-4873-aea3-381aad9c5747.png',
    bottleImage: 'https://cdn.abacus.ai/images/f993b92b-d230-4fec-979c-df2b6873919c.png',
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
    backgroundImage: 'https://cdn.abacus.ai/images/c48de82e-a1b5-46d0-81dc-da56fab9ad8a.png',
    bottleImage: 'https://cdn.abacus.ai/images/65972c9b-c36d-4f63-89a1-a650f34dd787.png',
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
    image: 'https://cdn.abacus.ai/images/a6db3584-1fb5-4365-884c-99c927e1d0d1.png',
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
    image: 'https://cdn.abacus.ai/images/cf179677-995f-4cb2-b8fc-950c96409fba.png',
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
    image: 'https://cdn.abacus.ai/images/16922ca9-ba29-4c95-a87d-ce96be838eee.png',
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
    image: 'https://cdn.abacus.ai/images/f993b92b-d230-4fec-979c-df2b6873919c.png',
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
    image: 'https://cdn.abacus.ai/images/65972c9b-c36d-4f63-89a1-a650f34dd787.png',
    available: false,
    ctaText: 'COMING SOON',
  },
]

export type FoodPairing = {
  name: string
  image: string
}

export const foodPairings: FoodPairing[] = [
  { name: 'Jollof Rice', image: 'https://images.unsplash.com/photo-1665332195309-9d75071138f0?fm=jpg&q=60&w=800&auto=format&fit=crop' },
  { name: 'Suya', image: 'https://www.theintrepideater.com/wp-content/uploads/2020/12/DSC_0806-2-scaled.webp' },
  { name: 'Grilled Chicken', image: 'https://cdn.foodshot.ai/landing/use-cases/chicken/card-3.webp' },
  { name: 'Barbecued Meats', image: 'https://shop.creekstonefarms.com/cdn/shop/products/BBQTrays_0470.jpg?v=1652802755' },
  { name: 'Pizza', image: 'https://images.pexels.com/photos/11044498/pexels-photo-11044498.jpeg?auto=compress&w=800' },
  { name: 'Pasta', image: 'https://www.foodandwine.com/thmb/FLM1rvQ_LyJ-F7ZzfG6DuN1S5i8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pasta-e-Ceci-FT-RECIPE0124-27dfb146e41a47c3b7f0bacc2ce46643.jpg' },
  { name: 'Burgers', image: 'https://cdn.babyseo.ai/images/foodshot.ai/burger-photography/burger-photography-hero-stacked.webp' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1759146204204-6f2a2d9e4e67?fm=jpg&q=60&w=800&auto=format&fit=crop' },
]

export type Occasion = {
  title: string
  image: string
}

export const occasions: Occasion[] = [
  { title: 'Dinner &\nDate Nights', image: 'https://images.pexels.com/photos/36789746/pexels-photo-36789746.jpeg?cs=srgb&fm=jpg&w=800' },
  { title: 'Celebrations', image: 'https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&w=800' },
  { title: 'Weekends with\nFriends', image: 'https://images.pexels.com/photos/36005727/pexels-photo-36005727/free-photo-of-family-gathering-at-outdoor-cafe-setting.jpeg?auto=compress&w=800' },
  { title: 'Weddings &\nParties', image: 'https://i.pinimg.com/736x/27/cc/e1/27cce1a8850b9335a72c461cc109435a.jpg' },
  { title: 'Gifting', image: 'https://thefrenchmarket.ie/wp-content/uploads/2023/10/Champagne-Gift-Box-New-beige-1-scaled.jpg' },
  { title: 'Business &\nSpecial Occasions', image: 'https://images.presentationgo.com/2025/06/business-team-dinner-celebration.jpg' },
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
