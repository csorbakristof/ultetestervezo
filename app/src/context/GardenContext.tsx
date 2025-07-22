import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Plant, Planting, Slot, Bed, Garden, GardenState } from '../types';

// Re-export types for backward compatibility
export type { Plant, Planting, Slot, Bed, Garden, GardenState };

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
  | { type: 'ADD_PLANTING'; payload: { bedId: string; slotId: string; planting: Planting } }
  | { type: 'REMOVE_PLANTING'; payload: { bedId: string; slotId: string; startWeek: number } }
  | { type: 'CLEAR_ALL_PLANTINGS' };

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
    case 'REMOVE_PLANTING':
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
                      ? { 
                          ...slot, 
                          plantings: slot.plantings.filter(planting => 
                            planting.startWeek !== action.payload.startWeek
                          ) 
                        }
                      : slot
                  )
                }
              : bed
          )
        }
      };
    case 'CLEAR_ALL_PLANTINGS':
      return {
        ...state,
        garden: {
          ...state.garden,
          beds: state.garden.beds.map(bed => ({
            ...bed,
            slots: bed.slots.map(slot => ({
              ...slot,
              plantings: []
            }))
          }))
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
