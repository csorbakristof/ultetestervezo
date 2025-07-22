import React from 'react';
import { useDrop } from 'react-dnd';
import { Plant } from '../../types/garden';
import { Position, DrawingMode, DrawPreview, GridCellBorders } from '../../types/ui';
import { COLORS } from '../../constants/garden';

interface DroppableGridCellProps {
  position: Position;
  onPlantDrop: (plant: Plant, x: number, y: number) => void;
  onCellClick: (x: number, y: number) => void;
  onMouseDown: (x: number, y: number) => void;
  onMouseEnter: (x: number, y: number) => void;
  onMouseUp: (x: number, y: number) => void;
  onRightClick: (x: number, y: number, bed?: { id: string; name: string; position: Position }, slot?: { id: string; number: string }) => void;
  plantedItem?: { plant: Plant };
  drawingMode: DrawingMode;
  drawPreview?: DrawPreview;
  bed?: { id: string; name: string; position: Position };
  slot?: { id: string; number: string };
  borderStyle: GridCellBorders;
  debugMode: boolean;
}

const DroppableGridCell = React.memo(function DroppableGridCell({ 
  position,
  onPlantDrop, 
  onCellClick, 
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onRightClick,
  plantedItem,
  drawingMode,
  drawPreview,
  bed,
  slot,
  borderStyle,
  debugMode
}: DroppableGridCellProps) {
  const { x, y } = position;
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'plant',
    drop: (item: { plant: Plant }) => {
      if (drawingMode === 'none') {
        onPlantDrop(item.plant, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && drawingMode === 'none',
    }),
  });

  // Determine if this cell is in the drawing preview
  const isInDrawPreview = drawPreview && 
    x >= Math.min(drawPreview.start.x, drawPreview.end.x) &&
    x <= Math.max(drawPreview.start.x, drawPreview.end.x) &&
    y >= Math.min(drawPreview.start.y, drawPreview.end.y) &&
    y <= Math.max(drawPreview.start.y, drawPreview.end.y);

  let backgroundColor: string = COLORS.gridBackground;
  if (bed) backgroundColor = COLORS.bedBackground;
  if (slot) backgroundColor = COLORS.slotBackground;
  if (plantedItem) backgroundColor = COLORS.plantedBackground;
  if (isInDrawPreview) backgroundColor = drawingMode === 'bed' ? COLORS.bedPreview : COLORS.slotPreview;
  if (isOver && canDrop) backgroundColor = COLORS.dropZone;

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(x, y, bed, slot);
  };

  return (
    <div
      ref={drop}
      className="grid-cell"
      onMouseDown={() => onMouseDown(x, y)}
      onMouseEnter={() => onMouseEnter(x, y)}
      onMouseUp={() => onMouseUp(x, y)}
      onContextMenu={handleRightClick}
      onClick={() => plantedItem && drawingMode === 'none' && onCellClick(x, y)}
      style={{ 
        gridColumn: x + 1, 
        gridRow: y + 1,
        backgroundColor,
        borderTop: isOver && canDrop ? `2px solid ${COLORS.dropTarget}` : borderStyle.borderTop,
        borderRight: isOver && canDrop ? `2px solid ${COLORS.dropTarget}` : borderStyle.borderRight,
        borderBottom: isOver && canDrop ? `2px solid ${COLORS.dropTarget}` : borderStyle.borderBottom,
        borderLeft: isOver && canDrop ? `2px solid ${COLORS.dropTarget}` : borderStyle.borderLeft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        cursor: drawingMode !== 'none' ? 'crosshair' : plantedItem ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      {bed && (
        <div style={{ position: 'absolute', top: '1px', left: '2px', fontSize: '8px', color: COLORS.bedBorder, fontWeight: 'bold' }}>
          {/* Only show bed name in the top-left corner of the bed */}
          {x === bed.position.x && y === bed.position.y ? bed.name : ''}
        </div>
      )}
      {slot && (
        <div style={{ position: 'absolute', bottom: '1px', right: '2px', fontSize: '8px', color: COLORS.slotBorder, fontWeight: 'bold' }}>
          {slot.number}
        </div>
      )}
      {debugMode && (
        <div style={{ 
          position: 'absolute', 
          top: '0', 
          left: '0', 
          right: '0', 
          bottom: '0', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          fontSize: '6px',
          color: COLORS.textPrimary,
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1'
        }}>
          {bed && <div style={{ color: COLORS.bedBorder }}>{bed.name}</div>}
          {slot && <div style={{ color: COLORS.slotBorder }}>S:{slot.number}</div>}
          {!bed && !slot && <div style={{ color: COLORS.textMuted }}>-</div>}
        </div>
      )}
      {plantedItem && (
        <span title={`${plantedItem.plant.name} - Click to remove`}>
          {plantedItem.plant.image}
        </span>
      )}
    </div>
  );
});

export default DroppableGridCell;
