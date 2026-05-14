export const PETS = [
  {
    id: 'cat',
    name: 'Mochi',
    description: 'A sleepy orange tabby who loves focus time',
    color: '#e8782a',
    bg: '#fff3e0',
    stageThresholds: [0, 111, 222, 333, 444, 556, 667, 778, 889, 1000],
    stageNames: [
      'Kitten',
      'Drowsy Kit',
      'Snoozy',
      'Napper',
      'Tabby',
      'Lounger',
      'Dreamer',
      'House Cat',
      'Elder Cat',
      'Grand Tabby',
    ],
  },
  {
    id: 'dog',
    name: 'Sunny',
    description: 'An enthusiastic golden pup cheering you on',
    color: '#e8b84b',
    bg: '#fffde7',
    stageThresholds: [0, 111, 222, 333, 444, 556, 667, 778, 889, 1000],
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
    description: 'An ancient dragon awakening from its egg',
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
    description: 'A soft lavender bunny with oversized ears',
    color: '#9b82c2',
    bg: '#f3effe',
    stageThresholds: [0, 334, 667],
    stageNames: ['Kit', 'Bunny', 'Grand Hare'],
  },
  {
    id: 'fox',
    name: 'Kira',
    description: 'A clever orange fox with a fluffy white tail',
    color: '#e8622a',
    bg: '#fff0e8',
    stageThresholds: [0, 334, 667],
    stageNames: ['Kit', 'Fox', 'Spirit Fox'],
  },
  {
    id: 'axolotl',
    name: 'Axie',
    description: 'A pink axolotl with magnificent frilly gills',
    color: '#e0607a',
    bg: '#fce4ec',
    stageThresholds: [0, 334, 667],
    stageNames: ['Larva', 'Axolotl', 'Ancient Axie'],
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
