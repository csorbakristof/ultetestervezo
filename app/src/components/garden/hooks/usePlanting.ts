import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plant, Bed } from '../../../types/garden';
import { getSlotForCell, createCellKey } from '../../../utils/gardenHelpers';
import { hasPlantingOverlap, calculatePlantingPeriod, getActivePlantingForWeek } from '../../../utils/plantingValidation';

interface UsePlantingProps {
  beds: Bed[];
  plants: Plant[];
  currentWeek: number;
  onAddPlanting: (bedId: string, slotId: string, planting: { plant: string; startWeek: number; endWeek: number }) => void;
  onRemovePlanting: (bedId: string, slotId: string, startWeek: number) => void;
}

export function usePlanting({ beds, plants, currentWeek, onAddPlanting, onRemovePlanting }: UsePlantingProps) {
  const [plantedCells, setPlantedCells] = useState<Map<string, Plant>>(new Map());

  // Update visual representation based on current week and stored plantings
  useEffect(() => {
    const updateVisualPlantings = () => {
      const newPlantedCells = new Map<string, Plant>();
      
      // Go through all slots and check for plantings in the current week
      for (const bed of beds) {
        for (const slot of bed.slots) {
          const currentPlanting = getActivePlantingForWeek(slot.plantings, currentWeek);
          
          if (currentPlanting) {
            // Find the plant object
            const plant = plants.find(p => p.name === currentPlanting.plant);
            if (plant) {
              // Fill all cells in the slot
              for (let sx = slot.position.x; sx < slot.position.x + slot.size.width; sx++) {
                for (let sy = slot.position.y; sy < slot.position.y + slot.size.height; sy++) {
                  const cellKey = createCellKey(sx, sy);
                  newPlantedCells.set(cellKey, plant);
                }
              }
            }
          }
        }
      }
      
      setPlantedCells(newPlantedCells);
    };
    
    updateVisualPlantings();
  }, [currentWeek, beds, plants]);

  const handlePlantDrop = useCallback((plant: Plant, x: number, y: number) => {
    const slotInfo = getSlotForCell(x, y, beds);
    
    if (slotInfo) {
      // If dropped on a slot, add a temporal planting
      const { slot, bed } = slotInfo;
      
      // Calculate end week based on plant's growth duration
      const { startWeek, endWeek } = calculatePlantingPeriod(currentWeek, plant);
      
      // Check for overlapping plantings in this slot
      if (hasPlantingOverlap(slot.plantings, startWeek, endWeek)) {
        alert(`Cannot plant ${plant.name} in slot ${slot.number}: overlapping timeframe with existing planting.`);
        return;
      }
      
      // Add the planting to the slot
      const newPlanting = {
        plant: plant.name,
        startWeek,
        endWeek
      };
      
      onAddPlanting(bed.id, slot.id, newPlanting);
    } else {
      // If dropped on a cell without a slot, just plant in that cell (temporary visual only)
      const cellKey = createCellKey(x, y);
      setPlantedCells(prev => new Map(prev.set(cellKey, plant)));
    }
  }, [beds, currentWeek, onAddPlanting]);

  const handleCellClick = useCallback((x: number, y: number) => {
    const slotInfo = getSlotForCell(x, y, beds);
    
    if (slotInfo) {
      // If clicked on a slot, remove the current planting
      const { slot, bed } = slotInfo;
      
      // Find planting that includes the current week
      const currentPlanting = getActivePlantingForWeek(slot.plantings, currentWeek);
      
      if (currentPlanting) {
        if (confirm(`Remove ${currentPlanting.plant} from slot ${slot.number}? This will remove the entire planting period (week ${currentPlanting.startWeek} - ${currentPlanting.endWeek}).`)) {
          onRemovePlanting(bed.id, slot.id, currentPlanting.startWeek);
        }
      }
    } else {
      // If clicked on a cell without a slot, just clear that cell (temporary visual only)
      const cellKey = createCellKey(x, y);
      setPlantedCells(prev => {
        const newMap = new Map(prev);
        newMap.delete(cellKey);
        return newMap;
      });
    }
  }, [beds, currentWeek, onRemovePlanting]);

  const getPlantedItem = useCallback((x: number, y: number): { plant: Plant } | undefined => {
    const cellKey = createCellKey(x, y);
    const plant = plantedCells.get(cellKey);
    return plant ? { plant } : undefined;
  }, [plantedCells]);

  return {
    plantedCells,
    handlePlantDrop,
    handleCellClick,
    getPlantedItem
  };
}
