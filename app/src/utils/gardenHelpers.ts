import { Bed, Slot } from '../types';

export const getBedForCell = (x: number, y: number, beds: Bed[]): Bed | undefined => {
  return beds.find(bed => 
    x >= bed.position.x && 
    x < bed.position.x + bed.size.width &&
    y >= bed.position.y && 
    y < bed.position.y + bed.size.height
  );
};

export const getSlotForCell = (x: number, y: number, beds: Bed[]): { slot: Slot; bed: Bed } | null => {
  for (const bed of beds) {
    for (const slot of bed.slots) {
      if (x >= slot.position.x && 
          x < slot.position.x + slot.size.width &&
          y >= slot.position.y && 
          y < slot.position.y + slot.size.height) {
        return { slot, bed };
      }
    }
  }
  return null;
};

export const createCellKey = (x: number, y: number): string => `${x}-${y}`;

export const parseCellKey = (key: string): { x: number; y: number } => {
  const [x, y] = key.split('-').map(Number);
  return { x, y };
};

export const isPositionInBounds = (x: number, y: number, gridSize: { width: number; height: number }): boolean => {
  return x >= 0 && x < gridSize.width && y >= 0 && y < gridSize.height;
};

export const normalizeDrawArea = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  return {
    minX: Math.min(start.x, end.x),
    minY: Math.min(start.y, end.y),
    maxX: Math.max(start.x, end.x),
    maxY: Math.max(start.y, end.y),
    width: Math.abs(end.x - start.x) + 1,
    height: Math.abs(end.y - start.y) + 1
  };
};
