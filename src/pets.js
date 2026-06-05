export const PETS = [
  {
    id: 'cat',
    name: 'Mochi',
    description: 'Sleepy orange tabby',
    color: '#e8782a',
    bg: '#fff3e0',
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
    description: 'Golden happy pup',
    color: '#e8b84b',
    bg: '#fffde7',
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
    description: 'Ancient dragon egg',
    color: '#1abc9c',
    bg: '#e0f8f3',
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
    description: 'Lavender big ears',
    color: '#9b82c2',
    bg: '#f3effe',
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
    bg: '#fff0e8',
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
    description: 'Pink frilly axolotl',
    color: '#e0607a',
    bg: '#fce4ec',
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
