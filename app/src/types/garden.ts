export interface Planting {
  plant: string;
  startWeek: number;
  endWeek: number;
}

export interface Slot {
  id: string;
  number: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  plantings: Planting[];
}

export interface Bed {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  slots: Slot[];
}

export interface Garden {
  name: string;
  gridSize: { width: number; height: number };
  beds: Bed[];
}

export interface GardenState {
  garden: Garden;
  plants: Plant[];
  currentWeek: number;
}

export interface Plant {
  name: string;
  image: string;
  plantingMonths: number[];
  harvestMonths: number[];
  waterNeed: 1 | 2 | 3;
  sunNeed: 1 | 2 | 3;
  incompatiblePlants: string[];
  companionPlants: string[];
  growthDuration: number;
  spacingCm: number;
  plantFamily: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  successionInterval: number;
}
