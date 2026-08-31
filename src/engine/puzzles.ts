import { Puzzle } from '../types';

export interface ProceduralCategoryConfig {
  category: string;
  adjectives: string[];
  nouns: string[];
  verbsIng?: string[];
  connectors?: string[];
  complements?: string[];
  templates?: string[];
}

/**
 * Expansive curated bank of 100+ TV-style Wheel of Fortune puzzles across 16 categories.
 */
export const CURATED_MAIN_PUZZLES: Puzzle[] = [
  // PHRASE
  { id: 'p_ph1', category: 'PHRASE', solution: 'SPIN AND WIN BIG' },
  { id: 'p_ph2', category: 'PHRASE', solution: 'ROLLING WITH THE PUNCHES' },
  { id: 'p_ph3', category: 'PHRASE', solution: 'LIGHTNING IN A BOTTLE' },
  { id: 'p_ph4', category: 'PHRASE', solution: 'MUSIC TO MY EARS' },
  { id: 'p_ph5', category: 'PHRASE', solution: 'A SIGHT FOR SORE EYES' },
  { id: 'p_ph6', category: 'PHRASE', solution: 'FORTUNE FAVORS THE BOLD' },
  { id: 'p_ph7', category: 'PHRASE', solution: 'A BREATH OF FRESH AIR' },
  { id: 'p_ph8', category: 'PHRASE', solution: 'RIGHT DOWN TO THE WIRE' },
  { id: 'p_ph9', category: 'PHRASE', solution: 'CLEAR AS A WHISTLE' },
  { id: 'p_ph10', category: 'PHRASE', solution: 'EVERY CLOUD HAS A SILVER LINING' },
  { id: 'p_ph11', category: 'PHRASE', solution: 'A PIECE OF CAKE' },
  { id: 'p_ph12', category: 'PHRASE', solution: 'OVER THE MOON' },
  { id: 'p_ph13', category: 'PHRASE', solution: 'HIT THE JACKPOT' },
  { id: 'p_ph14', category: 'PHRASE', solution: 'BULLSEYE ON FIRST TRY' },

  // AROUND THE HOUSE
  { id: 'p_ah1', category: 'AROUND THE HOUSE', solution: 'COMFORTABLE VELVET SOFA' },
  { id: 'p_ah2', category: 'AROUND THE HOUSE', solution: 'STAINLESS STEEL REFRIGERATOR' },
  { id: 'p_ah3', category: 'AROUND THE HOUSE', solution: 'HANDMADE WOVEN BLANKET' },
  { id: 'p_ah4', category: 'AROUND THE HOUSE', solution: 'PORCELAIN COFFEE MUG' },
  { id: 'p_ah5', category: 'AROUND THE HOUSE', solution: 'KING SIZE MEMORY FOAM MATTRESS' },
  { id: 'p_ah6', category: 'AROUND THE HOUSE', solution: 'DECORATIVE THROW PILLOWS' },
  { id: 'p_ah7', category: 'AROUND THE HOUSE', solution: 'ORGANIZED BOOKSHELF IN STUDY' },
  { id: 'p_ah8', category: 'AROUND THE HOUSE', solution: 'AUTOMATIC ROBOT VACUUM' },
  { id: 'p_ah9', category: 'AROUND THE HOUSE', solution: 'SPARKLING CRYSTAL CHANDELIER' },

  // BEFORE & AFTER
  { id: 'p_ba1', category: 'BEFORE & AFTER', solution: 'LUCKY CHARM BRACELET' },
  { id: 'p_ba2', category: 'BEFORE & AFTER', solution: 'ROCKING CHAIR OF COMMAND' },
  { id: 'p_ba3', category: 'BEFORE & AFTER', solution: 'ICE CREAM TRUCK DRIVER' },
  { id: 'p_ba4', category: 'BEFORE & AFTER', solution: 'COFFEE TABLE MANNERS' },
  { id: 'p_ba5', category: 'BEFORE & AFTER', solution: 'SECRET AGENT OF CHANGE' },
  { id: 'p_ba6', category: 'BEFORE & AFTER', solution: 'SUNSHINE STATE OF THE ART' },
  { id: 'p_ba7', category: 'BEFORE & AFTER', solution: 'BABY SHOWER CURTAIN' },
  { id: 'p_ba8', category: 'BEFORE & AFTER', solution: 'BOWLING PIN NUMBER' },
  { id: 'p_ba9', category: 'BEFORE & AFTER', solution: 'CARPET BAG OF TRICKS' },

  // WHAT ARE YOU DOING?
  { id: 'p_wy1', category: 'WHAT ARE YOU DOING?', solution: 'WATCHING PRIME TIME TELEVISION' },
  { id: 'p_wy2', category: 'WHAT ARE YOU DOING?', solution: 'BAKING FRESH CHOCOLATE COOKIES' },
  { id: 'p_wy3', category: 'WHAT ARE YOU DOING?', solution: 'EXPLORING A TROPICAL ISLAND' },
  { id: 'p_wy4', category: 'WHAT ARE YOU DOING?', solution: 'PLANNING A DREAM VACATION' },
  { id: 'p_wy5', category: 'WHAT ARE YOU DOING?', solution: 'CELEBRATING A BIG VICTORY' },
  { id: 'p_wy6', category: 'WHAT ARE YOU DOING?', solution: 'LEARNING A BRAND NEW DANCE' },
  { id: 'p_wy7', category: 'WHAT ARE YOU DOING?', solution: 'CAMPING UNDER THE STARS' },
  { id: 'p_wy8', category: 'WHAT ARE YOU DOING?', solution: 'SOLVING A MYSTERY NOVEL' },
  { id: 'p_wy9', category: 'WHAT ARE YOU DOING?', solution: 'DRIVING DOWN SCENIC HIGHWAY' },

  // FOOD & DRINK
  { id: 'p_fd1', category: 'FOOD & DRINK', solution: 'FRESH HOMEMADE APPLE PIE' },
  { id: 'p_fd2', category: 'FOOD & DRINK', solution: 'CRISPY GOLDEN BELGIAN WAFFLES' },
  { id: 'p_fd3', category: 'FOOD & DRINK', solution: 'CHILLED ICED LEMON TEA' },
  { id: 'p_fd4', category: 'FOOD & DRINK', solution: 'CREAMY MACARONI AND CHEESE' },
  { id: 'p_fd5', category: 'FOOD & DRINK', solution: 'SIZZLING STEAK FAJITAS' },
  { id: 'p_fd6', category: 'FOOD & DRINK', solution: 'WARM CINNAMON ROLLS WITH ICING' },
  { id: 'p_fd7', category: 'FOOD & DRINK', solution: 'CRISPY FISH TACOS WITH LIME' },
  { id: 'p_fd8', category: 'FOOD & DRINK', solution: 'MOZZARELLA CHEESE PIZZA' },
  { id: 'p_fd9', category: 'FOOD & DRINK', solution: 'FRESH STRAWBERRY SHORTCAKE' },

  // LANDMARK
  { id: 'p_lm1', category: 'LANDMARK', solution: 'STATUE OF LIBERTY' },
  { id: 'p_lm2', category: 'LANDMARK', solution: 'GOLDEN GATE BRIDGE' },
  { id: 'p_lm3', category: 'LANDMARK', solution: 'GRAND CANYON NATIONAL PARK' },
  { id: 'p_lm4', category: 'LANDMARK', solution: 'GREAT WALL OF CHINA' },
  { id: 'p_lm5', category: 'LANDMARK', solution: 'EIFFEL TOWER IN PARIS' },
  { id: 'p_lm6', category: 'LANDMARK', solution: 'HISTORIC ROMAN COLOSSEUM' },
  { id: 'p_lm7', category: 'LANDMARK', solution: 'SYDNEY OPERA HOUSE' },
  { id: 'p_lm8', category: 'LANDMARK', solution: 'MOUNT RUSHMORE MONUMENT' },

  // SHOW BIZ
  { id: 'p_sb1', category: 'SHOW BIZ', solution: 'HOLLYWOOD BLOCKBUSTER MOVIE' },
  { id: 'p_sb2', category: 'SHOW BIZ', solution: 'STANDING OVATION AT BROADWAY' },
  { id: 'p_sb3', category: 'SHOW BIZ', solution: 'ACADEMY AWARD CEREMONY' },
  { id: 'p_sb4', category: 'SHOW BIZ', solution: 'SOLD OUT ARENA CONCERT' },
  { id: 'p_sb5', category: 'SHOW BIZ', solution: 'RED CARPET INTERVIEWS' },
  { id: 'p_sb6', category: 'SHOW BIZ', solution: 'CRITICALLY ACCLAIMED DRAMA' },

  // OCCUPATION
  { id: 'p_oc1', category: 'OCCUPATION', solution: 'ASTRONAUT AND EXPLORER' },
  { id: 'p_oc2', category: 'OCCUPATION', solution: 'WILDLIFE PHOTOGRAPHER' },
  { id: 'p_oc3', category: 'OCCUPATION', solution: 'EXECUTIVE PASTRY CHEF' },
  { id: 'p_oc4', category: 'OCCUPATION', solution: 'AEROSPACE ENGINEER' },
  { id: 'p_oc5', category: 'OCCUPATION', solution: 'INVESTIGATIVE JOURNALIST' },
  { id: 'p_oc6', category: 'OCCUPATION', solution: 'DEEP SEA MARINE BIOLOGIST' },
  { id: 'p_oc7', category: 'OCCUPATION', solution: 'ORCHESTRA CONDUCTOR' },

  // RHYME TIME
  { id: 'p_rt1', category: 'RHYME TIME', solution: 'EASY PEASY LEMON SQUEEZY' },
  { id: 'p_rt2', category: 'RHYME TIME', solution: 'SUPER DUPER PARTY TROOPER' },
  { id: 'p_rt3', category: 'RHYME TIME', solution: 'BIG SHOT TIE THE KNOT' },
  { id: 'p_rt4', category: 'RHYME TIME', solution: 'NEAT AND SWEET TREAT' },
  { id: 'p_rt5', category: 'RHYME TIME', solution: 'WALKIE TALKIE' },
  { id: 'p_rt6', category: 'RHYME TIME', solution: 'THRILL ON THE HILL' },

  // LIVING THING
  { id: 'p_lt1', category: 'LIVING THING', solution: 'GOLDEN RETRIEVER PUPPY' },
  { id: 'p_lt2', category: 'LIVING THING', solution: 'MAJESTIC BALD EAGLE' },
  { id: 'p_lt3', category: 'LIVING THING', solution: 'COLORFUL MONARCH BUTTERFLY' },
  { id: 'p_lt4', category: 'LIVING THING', solution: 'PLAYFUL BOTTLENOSE DOLPHIN' },
  { id: 'p_lt5', category: 'LIVING THING', solution: 'GIANT PACIFIC OCTOPUS' },
  { id: 'p_lt6', category: 'LIVING THING', solution: 'TROPICAL TOUCAN BIRD' },

  // ON THE MAP
  { id: 'p_om1', category: 'ON THE MAP', solution: 'HONOLULU HAWAII' },
  { id: 'p_om2', category: 'ON THE MAP', solution: 'SAN FRANCISCO CALIFORNIA' },
  { id: 'p_om3', category: 'ON THE MAP', solution: 'LONDON ENGLAND' },
  { id: 'p_om4', category: 'ON THE MAP', solution: 'TOKYO JAPAN' },
  { id: 'p_om5', category: 'ON THE MAP', solution: 'RIO DE JANEIRO BRAZIL' },
  { id: 'p_om6', category: 'ON THE MAP', solution: 'CAPE TOWN SOUTH AFRICA' },

  // FUN & GAMES
  { id: 'p_fg1', category: 'FUN & GAMES', solution: 'ROLLER COASTER RIDE' },
  { id: 'p_fg2', category: 'FUN & GAMES', solution: 'CHAMPIONSHIP MINI GOLF' },
  { id: 'p_fg3', category: 'FUN & GAMES', solution: 'VINTAGE PINBALL MACHINE' },
  { id: 'p_fg4', category: 'FUN & GAMES', solution: 'AMUSEMENT PARK CARNIVAL' },
  { id: 'p_fg5', category: 'FUN & GAMES', solution: 'CLASSIC JIGSAW PUZZLE' },
  { id: 'p_fg6', category: 'FUN & GAMES', solution: 'LASER TAG TOURNAMENT' },

  // THING
  { id: 'p_th1', category: 'THING', solution: 'SHINING GOLD MEDAL' },
  { id: 'p_th2', category: 'THING', solution: 'AUTHENTIC LEATHER JACKET' },
  { id: 'p_th3', category: 'THING', solution: 'ANTIQUE POCKET WATCH' },
  { id: 'p_th4', category: 'THING', solution: 'HIGH DEFINITION PROJECTOR' },

  // EVENT
  { id: 'p_ev1', category: 'EVENT', solution: 'GALA PREMIERE NIGHT' },
  { id: 'p_ev2', category: 'EVENT', solution: 'ANNUAL SUMMER FESTIVAL' },
  { id: 'p_ev3', category: 'EVENT', solution: 'CHAMPIONSHIP BASKETBALL GAME' },
  { id: 'p_ev4', category: 'EVENT', solution: 'FOURTH OF JULY FIREWORKS' },
];

/**
 * Expansive curated bank of Bonus Round puzzles.
 */
export const CURATED_BONUS_PUZZLES: Puzzle[] = [
  { id: 'b_1', category: 'THING', solution: 'GOLDEN TROPHY' },
  { id: 'b_2', category: 'PHRASE', solution: 'QUICK THINKING' },
  { id: 'b_3', category: 'LIVING THING', solution: 'SWIFT FALCON' },
  { id: 'b_4', category: 'FOOD & DRINK', solution: 'FROZEN SMOOTHIE' },
  { id: 'b_5', category: 'WHAT ARE YOU DOING?', solution: 'JUMPING FOR JOY' },
  { id: 'b_6', category: 'PLACE', solution: 'COZY CABIN' },
  { id: 'b_7', category: 'EVENT', solution: 'VICTORY PARADE' },
  { id: 'b_8', category: 'THING', solution: 'BRIGHT SUNSHINE' },
  { id: 'b_9', category: 'PHRASE', solution: 'BRAIN TEASER' },
  { id: 'b_10', category: 'AROUND THE HOUSE', solution: 'WALK IN CLOSET' },
  { id: 'b_11', category: 'FOOD & DRINK', solution: 'WARM APPLE CIDER' },
  { id: 'b_12', category: 'OCCUPATION', solution: 'PILOT IN COMMAND' },
  { id: 'b_13', category: 'FUN & GAMES', solution: 'CHESS MATCH' },
  { id: 'b_14', category: 'LIVING THING', solution: 'HUMMINGBIRD' },
  { id: 'b_15', category: 'PLACE', solution: 'TROPICAL HAVEN' },
  { id: 'b_16', category: 'WHAT ARE YOU DOING?', solution: 'CATCHING WAVES' },
  { id: 'b_17', category: 'PHRASE', solution: 'SMOOTH SAILING' },
  { id: 'b_18', category: 'THING', solution: 'SILVER MEDALLION' },
];

/**
 * Vocabulary & Grammar Pools for Procedural Generation of Infinite Wheel Puzzles
 */
const PROCEDURAL_POOLS = {
  WHAT_ARE_YOU_DOING: {
    verbs: [
      'BAKING', 'EXPLORING', 'PLANNING', 'CELEBRATING', 'DRIVING', 'LEARNING',
      'PAINTING', 'SAILING', 'DISCOVERING', 'RECORDING', 'BUILDING', 'WATCHING',
      'ENJOYING', 'PHOTOGRAPHING', 'DESIGNING', 'SOLVING', 'VISITING', 'TOURING'
    ],
    adjectives: [
      'FRESH', 'HOMEMADE', 'SCENIC', 'TROPICAL', 'VINTAGE', 'COLORFUL',
      'EPIC', 'MEMORABLE', 'PRIME TIME', 'HISTORIC', 'DELICIOUS', 'SUNNY'
    ],
    nouns: [
      'CHOCOLATE COOKIES', 'ISLAND WONDERS', 'SUMMER VACATION', 'GOLDEN SUNSET',
      'COASTAL HIGHWAY', 'MYSTERY NOVEL', 'DOCUMENTARY FILM', 'STARRY NIGHTS',
      'FAMILY RECIPES', 'ARENA CONCERTS', 'SEASIDE RETREAT', 'BOTANICAL GARDENS'
    ]
  },
  FOOD_AND_DRINK: {
    adjectives: [
      'CRISPY', 'FRESH', 'CREAMY', 'HOMEMADE', 'CHILLED', 'SIZZLING',
      'WARM', 'SAVORY', 'SWEET', 'ARTISAN', 'GOLDEN', 'SPICY', 'GOURMET'
    ],
    items: [
      'APPLE PIE', 'BELGIAN WAFFLES', 'ICED LEMONADE', 'MAC AND CHEESE',
      'STEAK FAJITAS', 'CINNAMON ROLLS', 'FISH TACOS', 'CHEESE PIZZA',
      'STRAWBERRY CAKE', 'GARLIC BREAD', 'TOMATO SOUP', 'GRILLED CHEESE',
      'BLUEBERRY MUFFINS', 'CHEDDAR BURGER', 'MANGO SMOOTHIE'
    ],
    extras: [
      'WITH SYRUP', 'WITH FRESH BERRIES', 'AND ICED TEA', 'WITH MELTED CHEESE',
      'WITH AVOCADO', 'WITH EXTRA SAUCE', 'A LA MODE', 'WITH CRISPY FRIES'
    ]
  },
  AROUND_THE_HOUSE: {
    adjectives: [
      'COMFORTABLE', 'STAINLESS STEEL', 'HANDMADE', 'DECORATIVE', 'ORGANIZED',
      'SPARKLING', 'ANTIQUE', 'VINTAGE', 'LUXURIOUS', 'RECLINING', 'PLUSH'
    ],
    items: [
      'VELVET SOFA', 'COFFEE MAKER', 'WOVEN BLANKET', 'THROW PILLOWS',
      'BOOKSHELF', 'CRYSTAL LAMP', 'DINING TABLE', 'ARMCHAIR',
      'CERAMIC VASE', 'KITCHEN ISLAND', 'FIREPLACE MANTEL', 'PORCH SWING'
    ]
  },
  BEFORE_AND_AFTER: [
    { first: 'LUCKY CHARM', second: 'BRACELET' },
    { first: 'ROCKING CHAIR', second: 'OF COMMAND' },
    { first: 'ICE CREAM TRUCK', second: 'DRIVER' },
    { first: 'COFFEE TABLE', second: 'MANNERS' },
    { first: 'SECRET AGENT', second: 'OF CHANGE' },
    { first: 'SUNSHINE STATE', second: 'OF THE ART' },
    { first: 'BABY SHOWER', second: 'CURTAIN' },
    { first: 'BOWLING PIN', second: 'NUMBER' },
    { first: 'CARPET BAG', second: 'OF TRICKS' },
    { first: 'POWER STRIP', second: 'MALL' },
    { first: 'SILVER SPOON', second: 'FEEDING' },
    { first: 'MAGIC CARPET', second: 'CLEANER' },
    { first: 'GOLDEN GLOBE', second: 'THEATRE' },
    { first: 'TRAFFIC JAM', second: 'SESSION' },
    { first: 'HOT WATER', second: 'BOTTLE ROCKET' },
    { first: 'GUITAR PICK', second: 'POCKET' },
    { first: 'BOARD GAME', second: 'SHOW' },
  ],
  PHRASES: [
    'SPIN AND WIN BIG',
    'ROLLING WITH THE PUNCHES',
    'LIGHTNING IN A BOTTLE',
    'MUSIC TO MY EARS',
    'FORTUNE FAVORS THE BOLD',
    'A BREATH OF FRESH AIR',
    'CLEAR AS A BELL',
    'EVERY CLOUD HAS A SILVER LINING',
    'A PIECE OF CAKE',
    'OVER THE MOON',
    'HIT THE JACKPOT',
    'A DIAMOND IN THE ROUGH',
    'BULLSEYE ON THE FIRST TRY',
    'KEEP YOUR EYES ON THE PRIZE',
    'THE BEST IS YET TO COME',
    'SMOOTH AS SILK',
    'RISING TO THE OCCASION',
    'SEIZE THE MOMENT',
    'THINKING OUTSIDE THE BOX',
    'ALL IN A DAYS WORK',
    'RIGHT ON THE MONEY',
    'SWEET TASTE OF VICTORY'
  ],
  LIVING_THINGS: {
    adjectives: ['MAJESTIC', 'PLAYFUL', 'COLORFUL', 'GIANT', 'SWIFT', 'CURIOUS', 'WILD', 'GOLDEN'],
    animals: ['BALD EAGLE', 'RETRIEVER PUPPY', 'MONARCH BUTTERFLY', 'DOLPHIN', 'PACIFIC OCTOPUS', 'TOUCAN BIRD', 'MOUNTAIN LION', 'BLUE JAY', 'SEA TURTLE']
  },
  FUN_AND_GAMES: {
    adjectives: ['CHAMPIONSHIP', 'VINTAGE', 'CLASSIC', 'EXCITING', 'MIDNIGHT', 'ACTION PACKED'],
    games: ['ROLLER COASTER RIDE', 'MINI GOLF COURSE', 'PINBALL MACHINE', 'CARNIVAL ARCADE', 'JIGSAW PUZZLE', 'BOARD GAME NIGHT', 'TREASURE HUNT']
  }
};

/**
 * Validates whether a solution fits the standard 4-row matrix [12, 14, 14, 12] slots
 * and has individual words <= 14 characters.
 */
export function isValidMatrixSolution(solution: string): boolean {
  const clean = solution.trim().toUpperCase();
  if (clean.length < 3 || clean.length > 50) return false;

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.some((w) => w.length > 14)) return false;

  // Check 4-row fit
  const caps = [12, 14, 14, 12];
  let curRow = 0;
  let curLen = 0;

  for (const word of words) {
    if (curRow >= caps.length) return false;
    const maxCap = caps[curRow];
    const spaceNeeded = curLen === 0 ? word.length : curLen + 1 + word.length;

    if (spaceNeeded <= maxCap) {
      curLen = spaceNeeded;
    } else {
      curRow++;
      if (curRow >= caps.length) return false;
      if (word.length > caps[curRow]) return false;
      curLen = word.length;
    }
  }

  return true;
}

/**
 * Generates a completely novel procedural puzzle on-the-fly.
 */
export function generateProceduralPuzzle(): Puzzle {
  const types = ['WHAT_ARE_YOU_DOING', 'FOOD_AND_DRINK', 'AROUND_THE_HOUSE', 'BEFORE_AND_AFTER', 'PHRASE', 'LIVING_THING', 'FUN_AND_GAMES'];
  const chosenType = types[Math.floor(Math.random() * types.length)];

  let category = 'PHRASE';
  let solution = 'SPIN AND WIN BIG';

  switch (chosenType) {
    case 'WHAT_ARE_YOU_DOING': {
      category = 'WHAT ARE YOU DOING?';
      const p = PROCEDURAL_POOLS.WHAT_ARE_YOU_DOING;
      const v = p.verbs[Math.floor(Math.random() * p.verbs.length)];
      const a = Math.random() > 0.4 ? p.adjectives[Math.floor(Math.random() * p.adjectives.length)] + ' ' : '';
      const n = p.nouns[Math.floor(Math.random() * p.nouns.length)];
      solution = `${v} ${a}${n}`.trim();
      break;
    }
    case 'FOOD_AND_DRINK': {
      category = 'FOOD & DRINK';
      const p = PROCEDURAL_POOLS.FOOD_AND_DRINK;
      const a = p.adjectives[Math.floor(Math.random() * p.adjectives.length)];
      const item = p.items[Math.floor(Math.random() * p.items.length)];
      const withExtra = Math.random() > 0.65 ? ' ' + p.extras[Math.floor(Math.random() * p.extras.length)] : '';
      solution = `${a} ${item}${withExtra}`.trim();
      break;
    }
    case 'AROUND_THE_HOUSE': {
      category = 'AROUND THE HOUSE';
      const p = PROCEDURAL_POOLS.AROUND_THE_HOUSE;
      const a = p.adjectives[Math.floor(Math.random() * p.adjectives.length)];
      const item = p.items[Math.floor(Math.random() * p.items.length)];
      solution = `${a} ${item}`.trim();
      break;
    }
    case 'BEFORE_AND_AFTER': {
      category = 'BEFORE & AFTER';
      const item = PROCEDURAL_POOLS.BEFORE_AND_AFTER[Math.floor(Math.random() * PROCEDURAL_POOLS.BEFORE_AND_AFTER.length)];
      solution = `${item.first} ${item.second}`.trim();
      break;
    }
    case 'PHRASE': {
      category = 'PHRASE';
      solution = PROCEDURAL_POOLS.PHRASES[Math.floor(Math.random() * PROCEDURAL_POOLS.PHRASES.length)];
      break;
    }
    case 'LIVING_THING': {
      category = 'LIVING THING';
      const p = PROCEDURAL_POOLS.LIVING_THINGS;
      const a = p.adjectives[Math.floor(Math.random() * p.adjectives.length)];
      const anim = p.animals[Math.floor(Math.random() * p.animals.length)];
      solution = `${a} ${anim}`.trim();
      break;
    }
    case 'FUN_AND_GAMES': {
      category = 'FUN & GAMES';
      const p = PROCEDURAL_POOLS.FUN_AND_GAMES;
      const a = p.adjectives[Math.floor(Math.random() * p.adjectives.length)];
      const g = p.games[Math.floor(Math.random() * p.games.length)];
      solution = `${a} ${g}`.trim();
      break;
    }
  }

  // Ensure matrix validity
  if (!isValidMatrixSolution(solution)) {
    // Fallback to safe random curated phrase
    const fallback = CURATED_MAIN_PUZZLES[Math.floor(Math.random() * CURATED_MAIN_PUZZLES.length)];
    category = fallback.category;
    solution = fallback.solution;
  }

  return {
    id: 'proc_' + Math.random().toString(36).substring(2, 9),
    category,
    solution: solution.toUpperCase(),
  };
}

/**
 * Returns a truly random main puzzle combining curated pool and dynamic procedural engine.
 */
export function getRandomMainPuzzle(excludeIds: string[] = []): Puzzle {
  const excludeSet = new Set(excludeIds);
  
  // 50% chance to generate a fresh procedural phrase, 50% to draw randomly from expansive curated bank
  if (Math.random() > 0.45) {
    for (let i = 0; i < 5; i++) {
      const generated = generateProceduralPuzzle();
      if (!excludeSet.has(generated.solution)) {
        return generated;
      }
    }
  }

  const availableCurated = CURATED_MAIN_PUZZLES.filter((p) => !excludeSet.has(p.id) && !excludeSet.has(p.solution));
  if (availableCurated.length > 0) {
    const pick = availableCurated[Math.floor(Math.random() * availableCurated.length)];
    return {
      ...pick,
      id: 'main_' + Math.random().toString(36).substring(2, 9),
    };
  }

  // If all used, generate a procedural puzzle
  return generateProceduralPuzzle();
}

/**
 * Returns a truly random bonus puzzle.
 */
export function getRandomBonusPuzzle(excludeIds: string[] = []): Puzzle {
  const excludeSet = new Set(excludeIds);
  const available = CURATED_BONUS_PUZZLES.filter((p) => !excludeSet.has(p.id) && !excludeSet.has(p.solution));
  
  if (available.length > 0) {
    const pick = available[Math.floor(Math.random() * available.length)];
    return {
      ...pick,
      id: 'bonus_' + Math.random().toString(36).substring(2, 9),
    };
  }

  const randomPick = CURATED_BONUS_PUZZLES[Math.floor(Math.random() * CURATED_BONUS_PUZZLES.length)];
  return {
    ...randomPick,
    id: 'bonus_' + Math.random().toString(36).substring(2, 9),
  };
}

// Backward compatibility exports
export const MAIN_PUZZLES: Puzzle[] = CURATED_MAIN_PUZZLES;
export const BONUS_PUZZLES: Puzzle[] = CURATED_BONUS_PUZZLES;
