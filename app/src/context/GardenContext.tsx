import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types based on our specification
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

type GardenAction = 
  | { type: 'UPDATE_GARDEN'; payload: Garden }
  | { type: 'ADD_PLANT'; payload: Plant }
  | { type: 'UPDATE_PLANT'; payload: { originalName: string; updatedPlant: Plant } }
  | { type: 'DELETE_PLANT'; payload: string }
  | { type: 'SET_CURRENT_WEEK'; payload: number }
  | { type: 'UPDATE_GRID_SIZE'; payload: { width: number; height: number } }
  | { type: 'ADD_BED'; payload: Bed }
  | { type: 'UPDATE_BED'; payload: { bedId: string; updatedBed: Bed } }
  | { type: 'DELETE_BED'; payload: string }
  | { type: 'ADD_SLOT'; payload: { bedId: string; slot: Slot } }
  | { type: 'UPDATE_SLOT'; payload: { bedId: string; slotId: string; updatedSlot: Slot } }
  | { type: 'DELETE_SLOT'; payload: { bedId: string; slotId: string } }
  | { type: 'ADD_PLANTING'; payload: { bedId: string; slotId: string; planting: Planting } };

const initialState: GardenState = {
  garden: {
    name: 'My Garden',
    gridSize: { width: 10, height: 8 },
    beds: []
  },
  plants: [
    {
      name: 'carrot',
      image: '🥕',
      plantingMonths: [3, 4, 5],
      harvestMonths: [6, 7, 8],
      waterNeed: 2,
      sunNeed: 3,
      incompatiblePlants: ['fennel'],
      companionPlants: ['lettuce'],
      growthDuration: 10,
      spacingCm: 5,
      plantFamily: 'Apiaceae',
      season: 'spring',
      successionInterval: 2
    },
    {
      name: 'lettuce',
      image: '🥬',
      plantingMonths: [3, 4, 8, 9],
      harvestMonths: [5, 6, 10, 11],
      waterNeed: 2,
      sunNeed: 2,
      incompatiblePlants: [],
      companionPlants: ['carrot', 'radish'],
      growthDuration: 8,
      spacingCm: 10,
      plantFamily: 'Asteraceae',
      season: 'spring',
      successionInterval: 3
    }
  ],
  currentWeek: 1
};

function gardenReducer(state: GardenState, action: GardenAction): GardenState {
  switch (action.type) {
    case 'UPDATE_GARDEN':
      return { ...state, garden: action.payload };
    case 'ADD_PLANT':
      return { ...state, plants: [...state.plants, action.payload] };
    case 'UPDATE_PLANT':
      return {
        ...state,
        plants: state.plants.map(p => p.name === action.payload.originalName ? action.payload.updatedPlant : p)
      };
    case 'DELETE_PLANT':
      return {
        ...state,
        plants: state.plants.filter(p => p.name !== action.payload)
      };
    case 'SET_CURRENT_WEEK':
      return { ...state, currentWeek: action.payload };
    case 'UPDATE_GRID_SIZE':
      return {
        ...state,
        garden: {
          ...state.garden,
          gridSize: action.payload
        }
      };
    case 'ADD_BED':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: [...state.garden.beds, action.payload]
        }
      };
    case 'UPDATE_BED':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.map(bed => 
            bed.id === action.payload.bedId ? action.payload.updatedBed : bed
          )
        }
      };
    case 'DELETE_BED':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.filter(bed => bed.id !== action.payload)
        }
      };
    case 'ADD_SLOT':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.map(bed =>
            bed.id === action.payload.bedId
              ? { ...bed, slots: [...bed.slots, action.payload.slot] }
              : bed
          )
        }
      };
    case 'UPDATE_SLOT':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.map(bed =>
            bed.id === action.payload.bedId
              ? {
                  ...bed,
                  slots: bed.slots.map(slot =>
                    slot.id === action.payload.slotId ? action.payload.updatedSlot : slot
                  )
                }
              : bed
          )
        }
      };
    case 'DELETE_SLOT':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.map(bed =>
            bed.id === action.payload.bedId
              ? { ...bed, slots: bed.slots.filter(slot => slot.id !== action.payload.slotId) }
              : bed
          )
        }
      };
    case 'ADD_PLANTING':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.map(bed =>
            bed.id === action.payload.bedId
              ? {
                  ...bed,
                  slots: bed.slots.map(slot =>
                    slot.id === action.payload.slotId
                      ? { ...slot, plantings: [...slot.plantings, action.payload.planting] }
                      : slot
                  )
                }
              : bed
          )
        }
      };
    default:
      return state;
  }
}

const GardenContext = createContext<{
  state: GardenState;
  dispatch: React.Dispatch<GardenAction>;
} | null>(null);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gardenReducer, initialState);

  return (
    <GardenContext.Provider value={{ state, dispatch }}>
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
}
