import { GridCellBorders } from '../types';
import { getBedForCell, getSlotForCell } from './gardenHelpers';
import { Bed } from '../types';
import { COLORS } from '../constants/garden';

export const getCellBorderStyle = (
  x: number, 
  y: number, 
  beds: Bed[], 
  gridSize: { width: number; height: number }
): GridCellBorders => {
  const bed = getBedForCell(x, y, beds);
  const slotInfo = getSlotForCell(x, y, beds);
  
  let borderTop = `1px solid ${COLORS.gridBorder}`;
  let borderRight = `1px solid ${COLORS.gridBorder}`;
  let borderBottom = `1px solid ${COLORS.gridBorder}`;
  let borderLeft = `1px solid ${COLORS.gridBorder}`;

  // Check for boundaries by comparing with adjacent cells
  if (bed || slotInfo) {
    // Check if adjacent cells are outside the current bed/slot
    const topCell = y > 0 ? getBedForCell(x, y - 1, beds) : null;
    const rightCell = x < gridSize.width - 1 ? getBedForCell(x + 1, y, beds) : null;
    const bottomCell = y < gridSize.height - 1 ? getBedForCell(x, y + 1, beds) : null;
    const leftCell = x > 0 ? getBedForCell(x - 1, y, beds) : null;

    const topSlotInfo = y > 0 ? getSlotForCell(x, y - 1, beds) : null;
    const rightSlotInfo = x < gridSize.width - 1 ? getSlotForCell(x + 1, y, beds) : null;
    const bottomSlotInfo = y < gridSize.height - 1 ? getSlotForCell(x, y + 1, beds) : null;
    const leftSlotInfo = x > 0 ? getSlotForCell(x - 1, y, beds) : null;

    if (slotInfo) {
      // For slots, check if adjacent cells belong to the same slot
      const currentSlot = slotInfo.slot;
      if (y === 0 || !topSlotInfo || topSlotInfo.slot.id !== currentSlot.id) {
        borderTop = `2px solid ${COLORS.slotBorder}`;
      }
      if (x === gridSize.width - 1 || !rightSlotInfo || rightSlotInfo.slot.id !== currentSlot.id) {
        borderRight = `2px solid ${COLORS.slotBorder}`;
      }
      if (y === gridSize.height - 1 || !bottomSlotInfo || bottomSlotInfo.slot.id !== currentSlot.id) {
        borderBottom = `2px solid ${COLORS.slotBorder}`;
      }
      if (x === 0 || !leftSlotInfo || leftSlotInfo.slot.id !== currentSlot.id) {
        borderLeft = `2px solid ${COLORS.slotBorder}`;
      }
    }
    
    if (bed) {
      // For beds, check if adjacent cells belong to the same bed
      // Only apply bed borders if slot borders haven't been applied (slot borders take priority)
      if ((y === 0 || !topCell || topCell.id !== bed.id) && borderTop === `1px solid ${COLORS.gridBorder}`) {
        borderTop = `2px solid ${COLORS.bedBorder}`;
      }
      if ((x === gridSize.width - 1 || !rightCell || rightCell.id !== bed.id) && borderRight === `1px solid ${COLORS.gridBorder}`) {
        borderRight = `2px solid ${COLORS.bedBorder}`;
      }
      if ((y === gridSize.height - 1 || !bottomCell || bottomCell.id !== bed.id) && borderBottom === `1px solid ${COLORS.gridBorder}`) {
        borderBottom = `2px solid ${COLORS.bedBorder}`;
      }
      if ((x === 0 || !leftCell || leftCell.id !== bed.id) && borderLeft === `1px solid ${COLORS.gridBorder}`) {
        borderLeft = `2px solid ${COLORS.bedBorder}`;
      }
    }
  }

  return { borderTop, borderRight, borderBottom, borderLeft };
};
