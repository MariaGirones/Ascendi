export const PETS = [
  {
    id: 'cat',
    name: 'Mochi',
    description: 'Sleepy orange tabby',
    color: '#e8782a',
    bg: '#fff5f0',
    textColor: '#c04010',
    innerBg: '#ffd8c4',
    stageThresholds: [0, 111, 222, 333, 444, 555, 666, 777, 888, 999],
    stageNames: [
      'Drowsy Kit',
      'Snoozy',
      'Napper',
      'Tabby',
      'Lounger',
      'Dreamer',
      'House Cat',
      'Elder Cat',
      'Grand Tabby',
      'Mythic Tabby',
    ],
  },
  {
    id: 'dog',
    name: 'Max',
    description: 'Golden happy pupper',
    color: '#e8b84b',
    bg: '#fff8f0',
    textColor: '#8a6010',
    innerBg: '#ffe4b8',
    stageThresholds: [0, 111, 222, 333, 444, 555, 666, 777, 888, 999],
    stageNames: [
      'Puppy',
      'Playful Pup',
      'Bounding Pup',
      'Young Dog',
      'Retriever',
      'Loyal Dog',
      'Good Dog',
      'Golden',
      'Elder Hound',
      'Good Boy',
    ],
  },
  {
    id: 'dragon',
    name: 'Drakon',
    description: 'Ancient egg awakens',
    color: '#1abc9c',
    bg: '#f0fff8',
    textColor: '#0a6040',
    innerBg: '#b0f0d0',
    stageThresholds: [0, 111, 222, 333, 444, 556, 667, 778, 889, 1000],
    stageNames: [
      'Egg',
      'Cracked Egg',
      'Whelp',
      'Hatchling',
      'Sparkling',
      'Drake',
      'Firedrake',
      'Wyvern',
      'Elder Drake',
      'Dragon',
    ],
  },
  {
    id: 'bunny',
    name: 'Pochi',
    description: 'Soft lavender bunny',
    color: '#9b82c2',
    bg: '#f5f0ff',
    textColor: '#5a3090',
    innerBg: '#d8c8ff',
    stageThresholds: [0, 111, 222, 333, 444, 555, 666, 777, 888, 999],
    stageNames: [
      'Kit',
      'Cottontail',
      'Bunny',
      'Hopper',
      'Thumper',
      'Meadow Hare',
      'Moon Hare',
      'Elder Hare',
      'Grand Hare',
      'Lunar Hare',
    ],
  },
  {
    id: 'fox',
    name: 'Kira',
    description: 'Clever orange fox',
    color: '#e8622a',
    bg: '#fff5f0',
    textColor: '#a04010',
    innerBg: '#ffd8b4',
    stageThresholds: [0, 111, 222, 333, 444, 555, 666, 777, 888, 999],
    stageNames: [
      'Kit',
      'Cub',
      'Fox',
      'Swift Fox',
      'Forest Fox',
      'Cunning Fox',
      'Shadow Fox',
      'Elder Fox',
      'Spirit Fox',
      'Celestial Fox',
    ],
  },
  {
    id: 'axolotl',
    name: 'Axie',
    description: 'Pink wiggly axolotl',
    color: '#e0607a',
    bg: '#fff0f5',
    textColor: '#a03060',
    innerBg: '#ffc8dc',
    stageThresholds: [0, 111, 222, 333, 444, 555, 666, 777, 888, 999],
    stageNames: [
      'Larva',
      'Gill Nub',
      'Axolotl',
      'Water Sprite',
      'Gill Bloom',
      'Deep Swimmer',
      'Mystic Axie',
      'Elder Axie',
      'Ancient Axie',
      'Primordial Axie',
    ],
  },
];

export const MAX_XP = 1000;

export function getPetById(id) {
  return PETS.find(p => p.id === id) ?? PETS[0];
}

/** 0-based stage index for the given pet and XP amount. */
export function getStageIndex(xp, petId) {
  const thresholds = getPetById(petId).stageThresholds;
  let stage = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) stage = i;
    else break;
  }
  return stage;
}
