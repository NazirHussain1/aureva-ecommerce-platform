/**
 * Category Icons Configuration
 * Maps category types to React Icons
 * Use these icon identifiers in the database
 */

const CATEGORY_ICONS = {
  // Skincare
  SKINCARE: 'GiLotionDrops',
  CLEANSER: 'GiSoap',
  MOISTURIZER: 'GiWaterDrop',
  SERUM: 'GiChemicalDrop',
  SUNSCREEN: 'FaSun',
  TONER: 'GiBottledBolt',
  EXFOLIATOR: 'GiSparkles',
  MASK: 'FaMask',
  EYE_CREAM: 'FaEye',
  
  // Makeup
  MAKEUP: 'FaPaintBrush',
  FOUNDATION: 'GiPowder',
  CONCEALER: 'FaCircle',
  POWDER: 'GiPowderBag',
  BLUSH: 'FaHeart',
  BRONZER: 'FaSun',
  HIGHLIGHTER: 'FaStar',
  EYESHADOW: 'FaEye',
  EYELINER: 'GiEyelashes',
  MASCARA: 'GiEyelashes',
  EYEBROW: 'GiBrow',
  LIPSTICK: 'GiLipstick',
  LIP_GLOSS: 'GiLips',
  LIP_LINER: 'GiLips',
  SETTING_SPRAY: 'FaSprayCan',
  PRIMER: 'GiBottledBolt',
  
  // Haircare
  HAIRCARE: 'GiComb',
  SHAMPOO: 'FaShower',
  CONDITIONER: 'GiWaterDrop',
  HAIR_MASK: 'GiHairStrands',
  HAIR_OIL: 'GiOilDrum',
  HAIR_SERUM: 'GiChemicalDrop',
  STYLING: 'GiCurlyHair',
  HAIR_SPRAY: 'FaSprayCan',
  HAIR_GEL: 'GiGel',
  HAIR_COLOR: 'FaPalette',
  
  // Fragrance
  FRAGRANCE: 'GiPerfumeBottle',
  PERFUME: 'GiPerfumeBottle',
  COLOGNE: 'GiBottledBolt',
  BODY_MIST: 'FaSprayCan',
  
  // Body Care
  BODYCARE: 'FaSpa',
  BODY_WASH: 'FaShower',
  BODY_LOTION: 'GiLotionDrops',
  BODY_SCRUB: 'GiSparkles',
  BODY_OIL: 'GiOilDrum',
  HAND_CREAM: 'FaHandHoldingHeart',
  FOOT_CREAM: 'FaShoePrints',
  DEODORANT: 'GiSpray',
  
  // Tools & Accessories
  TOOLS: 'FaTools',
  BRUSHES: 'FaPaintBrush',
  SPONGES: 'GiSponge',
  APPLICATORS: 'FaHandPointer',
  MIRRORS: 'FaMirror',
  BAGS: 'FaShoppingBag',
  
  // Nails
  NAILS: 'GiNails',
  NAIL_POLISH: 'GiNailPolish',
  NAIL_CARE: 'GiNails',
  NAIL_TOOLS: 'FaTools',
  
  // Bath
  BATH: 'FaBath',
  BATH_BOMB: 'GiBubbles',
  BATH_SALT: 'GiSaltShaker',
  BUBBLE_BATH: 'GiBubbles',
  
  // Men's Grooming
  MENS_GROOMING: 'FaMale',
  SHAVING: 'GiRazor',
  BEARD_CARE: 'FaUserTie',
  AFTERSHAVE: 'GiBottledBolt',
  
  // Wellness
  WELLNESS: 'FaHeart',
  SUPPLEMENTS: 'FaPills',
  AROMATHERAPY: 'GiFlowerPot',
  
  // Default
  DEFAULT: 'FaBox'
};

/**
 * Get icon for category
 * @param {string} categoryName - Category name
 * @returns {string} - Icon identifier
 */
const getCategoryIcon = (categoryName) => {
  if (!categoryName) return CATEGORY_ICONS.DEFAULT;
  
  const normalized = categoryName
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z_]/g, '');
  
  return CATEGORY_ICONS[normalized] || CATEGORY_ICONS.DEFAULT;
};

/**
 * Icon library mapping for frontend
 * Import these in your React components
 */
const ICON_LIBRARY_MAP = {
  // From react-icons/gi (Game Icons)
  GiLotionDrops: 'gi',
  GiSoap: 'gi',
  GiWaterDrop: 'gi',
  GiChemicalDrop: 'gi',
  GiBottledBolt: 'gi',
  GiSparkles: 'gi',
  GiPowder: 'gi',
  GiPowderBag: 'gi',
  GiEyelashes: 'gi',
  GiBrow: 'gi',
  GiLipstick: 'gi',
  GiLips: 'gi',
  GiComb: 'gi',
  GiHairStrands: 'gi',
  GiOilDrum: 'gi',
  GiCurlyHair: 'gi',
  GiGel: 'gi',
  GiPerfumeBottle: 'gi',
  GiSpray: 'gi',
  GiSponge: 'gi',
  GiNails: 'gi',
  GiNailPolish: 'gi',
  GiBubbles: 'gi',
  GiSaltShaker: 'gi',
  GiRazor: 'gi',
  GiFlowerPot: 'gi',
  
  // From react-icons/fa (Font Awesome)
  FaSun: 'fa',
  FaMask: 'fa',
  FaEye: 'fa',
  FaPaintBrush: 'fa',
  FaCircle: 'fa',
  FaHeart: 'fa',
  FaStar: 'fa',
  FaSprayCan: 'fa',
  FaShower: 'fa',
  FaPalette: 'fa',
  FaSpa: 'fa',
  FaHandHoldingHeart: 'fa',
  FaShoePrints: 'fa',
  FaTools: 'fa',
  FaHandPointer: 'fa',
  FaMirror: 'fa',
  FaShoppingBag: 'fa',
  FaBath: 'fa',
  FaMale: 'fa',
  FaUserTie: 'fa',
  FaPills: 'fa',
  FaBox: 'fa'
};

module.exports = {
  CATEGORY_ICONS,
  getCategoryIcon,
  ICON_LIBRARY_MAP
};
