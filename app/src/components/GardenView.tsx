import { useGarden, Plant } from '../context/GardenContext';
import { useDrag, useDrop } from 'react-dnd';
import { useState, useEffect } from 'react';

interface DraggablePlantProps {
  plant: Plant;
}

function DraggablePlant({ plant }: DraggablePlantProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'plant',
    item: { plant },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        padding: '8px',
        margin: '4px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        display: 'inline-block',
        userSelect: 'none'
      }}
    >
      <span style={{ fontSize: '20px' }}>{plant.image}</span>
      <span style={{ marginLeft: '8px', fontSize: '14px' }}>{plant.name}</span>
    </div>
  );
}

interface DroppableGridCellProps {
  x: number;
  y: number;
  onPlantDrop: (plant: Plant, x: number, y: number) => void;
  onCellClick: (x: number, y: number) => void;
  onMouseDown: (x: number, y: number) => void;
  onMouseEnter: (x: number, y: number) => void;
  onMouseUp: (x: number, y: number) => void;
  onRightClick: (x: number, y: number, bed?: { id: string; name: string; position: { x: number; y: number } }, slot?: { id: string; number: string }) => void;
  plantedItem?: { plant: Plant };
  drawingMode: 'none' | 'bed' | 'slot';
  drawPreview?: { start: { x: number; y: number }; end: { x: number; y: number } };
  bed?: { id: string; name: string; position: { x: number; y: number } };
  slot?: { id: string; number: string };
  getCellBorderStyle: (x: number, y: number) => { borderTop: string; borderRight: string; borderBottom: string; borderLeft: string };
  debugMode: boolean;
}

function DroppableGridCell({ 
  x, 
  y, 
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
  getCellBorderStyle,
  debugMode
}: DroppableGridCellProps) {
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

  let backgroundColor = '#f8f9fa';
  if (bed) backgroundColor = '#e6f3ff';
  if (slot) backgroundColor = '#f0f8e6';
  if (plantedItem) backgroundColor = '#c6f6d5';
  if (isInDrawPreview) backgroundColor = drawingMode === 'bed' ? '#cce5ff' : '#d4f4dd';
  if (isOver && canDrop) backgroundColor = '#e2f8ff';

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(x, y, bed, slot);
  };

  // Get the border style for this cell
  const borderStyle = getCellBorderStyle(x, y);

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
        borderTop: isOver && canDrop ? '2px solid #3182ce' : borderStyle.borderTop,
        borderRight: isOver && canDrop ? '2px solid #3182ce' : borderStyle.borderRight,
        borderBottom: isOver && canDrop ? '2px solid #3182ce' : borderStyle.borderBottom,
        borderLeft: isOver && canDrop ? '2px solid #3182ce' : borderStyle.borderLeft,
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
        <div style={{ position: 'absolute', top: '1px', left: '2px', fontSize: '8px', color: '#0066cc', fontWeight: 'bold' }}>
          {/* Only show bed name in the top-left corner of the bed */}
          {x === bed.position.x && y === bed.position.y ? bed.name : ''}
        </div>
      )}
      {slot && (
        <div style={{ position: 'absolute', bottom: '1px', right: '2px', fontSize: '8px', color: '#4d9900', fontWeight: 'bold' }}>
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
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1'
        }}>
          {bed && <div style={{ color: '#0066cc' }}>{bed.name}</div>}
          {slot && <div style={{ color: '#4d9900' }}>S:{slot.number}</div>}
          {!bed && !slot && <div style={{ color: '#888' }}>-</div>}
        </div>
      )}
      {plantedItem && (
        <span title={`${plantedItem.plant.name} - Click to remove`}>
          {plantedItem.plant.image}
        </span>
      )}
    </div>
  );
}

export default function GardenView() {
  const { state, dispatch } = useGarden();
  const [plantedCells, setPlantedCells] = useState<Map<string, Plant>>(new Map());
  const [showGridConfig, setShowGridConfig] = useState(false);
  const [gridWidth, setGridWidth] = useState(state.garden.gridSize.width);
  const [gridHeight, setGridHeight] = useState(state.garden.gridSize.height);
  const [drawingMode, setDrawingMode] = useState<'none' | 'bed' | 'slot'>('none');
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [editingBedName, setEditingBedName] = useState<string>('');
  const [editorMode, setEditorMode] = useState<boolean>(true);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  // Reset drawing mode when editor mode is disabled
  useEffect(() => {
    if (!editorMode) {
      setDrawingMode('none');
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
      setShowGridConfig(false);
    }
  }, [editorMode]);

  // Update visual representation based on current week and stored plantings
  useEffect(() => {
    const updateVisualPlantings = () => {
      const newPlantedCells = new Map<string, Plant>();
      
      // Go through all slots and check for plantings in the current week
      for (const bed of state.garden.beds) {
        for (const slot of bed.slots) {
          const currentPlanting = slot.plantings.find(planting => 
            state.currentWeek >= planting.startWeek && state.currentWeek <= planting.endWeek
          );
          
          if (currentPlanting) {
            // Find the plant object
            const plant = state.plants.find(p => p.name === currentPlanting.plant);
            if (plant) {
              // Fill all cells in the slot
              for (let sx = slot.position.x; sx < slot.position.x + slot.size.width; sx++) {
                for (let sy = slot.position.y; sy < slot.position.y + slot.size.height; sy++) {
                  const cellKey = `${sx}-${sy}`;
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
  }, [state.currentWeek, state.garden.beds, state.plants]);

  const handlePlantDrop = (plant: Plant, x: number, y: number) => {
    const slotInfo = getSlotForCell(x, y);
    
    if (slotInfo) {
      // If dropped on a slot, add a temporal planting
      const slot = slotInfo.slot;
      const bed = slotInfo.bed;
      
      // Calculate end week based on plant's growth duration
      const startWeek = state.currentWeek;
      const endWeek = startWeek + plant.growthDuration;
      
      // Check for overlapping plantings in this slot
      const hasOverlap = slot.plantings.some(planting => 
        (startWeek >= planting.startWeek && startWeek <= planting.endWeek) ||
        (endWeek >= planting.startWeek && endWeek <= planting.endWeek) ||
        (startWeek <= planting.startWeek && endWeek >= planting.endWeek)
      );
      
      if (hasOverlap) {
        alert(`Cannot plant ${plant.name} in slot ${slot.number}: overlapping timeframe with existing planting.`);
        return;
      }
      
      // Add the planting to the slot
      const newPlanting = {
        plant: plant.name,
        startWeek,
        endWeek
      };
      
      dispatch({ 
        type: 'ADD_PLANTING', 
        payload: { 
          bedId: bed.id, 
          slotId: slot.id, 
          planting: newPlanting 
        } 
      });
    } else {
      // If dropped on a cell without a slot, just plant in that cell (temporary visual only)
      const cellKey = `${x}-${y}`;
      setPlantedCells(prev => new Map(prev.set(cellKey, plant)));
    }
  };

  const handleCellClick = (x: number, y: number) => {
    const slotInfo = getSlotForCell(x, y);
    
    if (slotInfo) {
      // If clicked on a slot, remove the current planting
      const slot = slotInfo.slot;
      const bed = slotInfo.bed;
      
      // Find planting that includes the current week
      const currentPlanting = slot.plantings.find(planting => 
        state.currentWeek >= planting.startWeek && state.currentWeek <= planting.endWeek
      );
      
      if (currentPlanting) {
        if (confirm(`Remove ${currentPlanting.plant} from slot ${slot.number}? This will remove the entire planting period (week ${currentPlanting.startWeek} - ${currentPlanting.endWeek}).`)) {
          dispatch({ 
            type: 'REMOVE_PLANTING', 
            payload: { 
              bedId: bed.id, 
              slotId: slot.id, 
              startWeek: currentPlanting.startWeek 
            } 
          });
        }
      }
    } else {
      // If clicked on a cell without a slot, just clear that cell (temporary visual only)
      const cellKey = `${x}-${y}`;
      setPlantedCells(prev => {
        const newMap = new Map(prev);
        newMap.delete(cellKey);
        return newMap;
      });
    }
  };

  const handleGridSizeUpdate = () => {
    if (gridWidth >= 3 && gridWidth <= 50 && gridHeight >= 3 && gridHeight <= 50) {
      dispatch({ type: 'UPDATE_GRID_SIZE', payload: { width: gridWidth, height: gridHeight } });
      setShowGridConfig(false);
      // Clear planted cells that are outside the new grid bounds
      setPlantedCells(prev => {
        const newMap = new Map();
        prev.forEach((plant, key) => {
          const [x, y] = key.split('-').map(Number);
          if (x < gridWidth && y < gridHeight) {
            newMap.set(key, plant);
          }
        });
        return newMap;
      });
    }
  };

  const resetGridConfig = () => {
    setGridWidth(state.garden.gridSize.width);
    setGridHeight(state.garden.gridSize.height);
    setShowGridConfig(false);
  };

  const createBed = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);
    
    const newBed = {
      id: `bed-${Date.now()}`,
      name: `Bed ${state.garden.beds.length + 1}`,
      position: { x: minX, y: minY },
      size: { width: maxX - minX + 1, height: maxY - minY + 1 },
      slots: []
    };
    
    dispatch({ type: 'ADD_BED', payload: newBed });
  };

  const createSlot = (bedId: string, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);
    
    const bed = state.garden.beds.find(b => b.id === bedId);
    if (!bed) return;
    
    const newSlot = {
      id: `slot-${Date.now()}`,
      number: `${bed.slots.length + 1}`,
      position: { x: minX, y: minY }, // Store absolute grid coordinates
      size: { width: maxX - minX + 1, height: maxY - minY + 1 },
      plantings: []
    };
    
    dispatch({ type: 'ADD_SLOT', payload: { bedId, slot: newSlot } });
  };

  const deleteBed = (bedId: string) => {
    const bed = state.garden.beds.find(b => b.id === bedId);
    if (bed && confirm(`Are you sure you want to delete "${bed.name}" and all its slots?`)) {
      dispatch({ type: 'DELETE_BED', payload: bedId });
      // If the deleted bed was selected, clear the selection
      if (selectedBedId === bedId) {
        setSelectedBedId(null);
      }
    }
  };

  const deleteSlot = (bedId: string, slotId: string) => {
    const bed = state.garden.beds.find(b => b.id === bedId);
    const slot = bed?.slots.find(s => s.id === slotId);
    if (bed && slot && confirm(`Are you sure you want to delete slot "${slot.number}" from "${bed.name}"?`)) {
      dispatch({ type: 'DELETE_SLOT', payload: { bedId, slotId } });
    }
  };

  const startEditingBed = (bedId: string, currentName: string) => {
    setEditingBedId(bedId);
    setEditingBedName(currentName);
  };

  const saveBedName = (bedId: string) => {
    if (editingBedName.trim()) {
      const bed = state.garden.beds.find(b => b.id === bedId);
      if (bed) {
        const updatedBed = { ...bed, name: editingBedName.trim() };
        dispatch({ type: 'UPDATE_BED', payload: { bedId, updatedBed } });
      }
    }
    setEditingBedId(null);
    setEditingBedName('');
  };

  const cancelEditingBed = () => {
    setEditingBedId(null);
    setEditingBedName('');
  };

  const goToPreviousWeek = () => {
    if (state.currentWeek > 1) {
      dispatch({ type: 'SET_CURRENT_WEEK', payload: state.currentWeek - 1 });
    }
  };

  const goToNextWeek = () => {
    if (state.currentWeek < 52) {
      dispatch({ type: 'SET_CURRENT_WEEK', payload: state.currentWeek + 1 });
    }
  };

  const goToWeek = (week: number) => {
    if (week >= 1 && week <= 52) {
      dispatch({ type: 'SET_CURRENT_WEEK', payload: week });
    }
  };

  const handleRightClick = (x: number, y: number, bed?: { id: string; name: string; position: { x: number; y: number } }, slot?: { id: string; number: string }) => {
    if (drawingMode !== 'none') return;
    
    if (slot && bed) {
      if (confirm(`Delete slot "${slot.number}" from "${bed.name}"?`)) {
        deleteSlot(bed.id, slot.id);
      }
    } else if (bed) {
      if (confirm(`Delete bed "${bed.name}" and all its slots?`)) {
        deleteBed(bed.id);
      }
    }
  };

  const handleCellMouseDown = (x: number, y: number) => {
    if (drawingMode !== 'none') {
      setIsDrawing(true);
      setDrawStart({ x, y });
      setDrawEnd({ x, y });
    }
  };

  const handleCellMouseEnter = (x: number, y: number) => {
    if (isDrawing && drawStart) {
      setDrawEnd({ x, y });
    }
  };

  const handleCellMouseUp = (x: number, y: number) => {
    if (isDrawing && drawStart && drawingMode !== 'none') {
      if (drawingMode === 'bed') {
        createBed(drawStart, { x, y });
      } else if (drawingMode === 'slot' && selectedBedId) {
        createSlot(selectedBedId, drawStart, { x, y });
      }
      
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
      setDrawingMode('none');
    }
  };

  // Helper function to find which bed a cell belongs to
  const getBedForCell = (x: number, y: number) => {
    return state.garden.beds.find(bed => 
      x >= bed.position.x && 
      x < bed.position.x + bed.size.width &&
      y >= bed.position.y && 
      y < bed.position.y + bed.size.height
    );
  };

  // Helper function to find which slot a cell belongs to
  const getSlotForCell = (x: number, y: number) => {
    for (const bed of state.garden.beds) {
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

  // Helper function to determine border styles for a cell
  const getCellBorderStyle = (x: number, y: number) => {
    const bed = getBedForCell(x, y);
    const slotInfo = getSlotForCell(x, y);
    
    let borderTop = '1px solid #e2e8f0';
    let borderRight = '1px solid #e2e8f0';
    let borderBottom = '1px solid #e2e8f0';
    let borderLeft = '1px solid #e2e8f0';

    // Check for boundaries by comparing with adjacent cells
    if (bed || slotInfo) {
      // Check if adjacent cells are outside the current bed/slot
      const topCell = y > 0 ? getBedForCell(x, y - 1) : null;
      const rightCell = x < state.garden.gridSize.width - 1 ? getBedForCell(x + 1, y) : null;
      const bottomCell = y < state.garden.gridSize.height - 1 ? getBedForCell(x, y + 1) : null;
      const leftCell = x > 0 ? getBedForCell(x - 1, y) : null;

      const topSlotInfo = y > 0 ? getSlotForCell(x, y - 1) : null;
      const rightSlotInfo = x < state.garden.gridSize.width - 1 ? getSlotForCell(x + 1, y) : null;
      const bottomSlotInfo = y < state.garden.gridSize.height - 1 ? getSlotForCell(x, y + 1) : null;
      const leftSlotInfo = x > 0 ? getSlotForCell(x - 1, y) : null;

      if (slotInfo) {
        // For slots, check if adjacent cells belong to the same slot
        const currentSlot = slotInfo.slot;
        if (y === 0 || !topSlotInfo || topSlotInfo.slot.id !== currentSlot.id) {
          borderTop = '2px solid #4d9900';
        }
        if (x === state.garden.gridSize.width - 1 || !rightSlotInfo || rightSlotInfo.slot.id !== currentSlot.id) {
          borderRight = '2px solid #4d9900';
        }
        if (y === state.garden.gridSize.height - 1 || !bottomSlotInfo || bottomSlotInfo.slot.id !== currentSlot.id) {
          borderBottom = '2px solid #4d9900';
        }
        if (x === 0 || !leftSlotInfo || leftSlotInfo.slot.id !== currentSlot.id) {
          borderLeft = '2px solid #4d9900';
        }
      }
      
      if (bed) {
        // For beds, check if adjacent cells belong to the same bed
        // Only apply bed borders if slot borders haven't been applied (slot borders take priority)
        if ((y === 0 || !topCell || topCell.id !== bed.id) && borderTop === '1px solid #e2e8f0') {
          borderTop = '2px solid #0066cc';
        }
        if ((x === state.garden.gridSize.width - 1 || !rightCell || rightCell.id !== bed.id) && borderRight === '1px solid #e2e8f0') {
          borderRight = '2px solid #0066cc';
        }
        if ((y === state.garden.gridSize.height - 1 || !bottomCell || bottomCell.id !== bed.id) && borderBottom === '1px solid #e2e8f0') {
          borderBottom = '2px solid #0066cc';
        }
        if ((x === 0 || !leftCell || leftCell.id !== bed.id) && borderLeft === '1px solid #e2e8f0') {
          borderLeft = '2px solid #0066cc';
        }
      }
    }

    return { borderTop, borderRight, borderBottom, borderLeft };
  };

  // Create draw preview object
  const drawPreview = isDrawing && drawStart && drawEnd ? { start: drawStart, end: drawEnd } : undefined;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>Garden View</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>Week:</span>
            <button
              onClick={goToPreviousWeek}
              disabled={state.currentWeek <= 1}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: state.currentWeek <= 1 ? '#f7fafc' : '#3182ce',
                color: state.currentWeek <= 1 ? '#a0a0a0' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: state.currentWeek <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ◀
            </button>
            <input
              type="number"
              value={state.currentWeek}
              onChange={(e) => goToWeek(parseInt(e.target.value) || 1)}
              min="1"
              max="52"
              style={{
                width: '60px',
                padding: '0.25rem',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
            />
            <button
              onClick={goToNextWeek}
              disabled={state.currentWeek >= 52}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: state.currentWeek >= 52 ? '#f7fafc' : '#3182ce',
                color: state.currentWeek >= 52 ? '#a0a0a0' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: state.currentWeek >= 52 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ▶
            </button>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>/ 52</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
            <input
              type="checkbox"
              checked={editorMode}
              onChange={(e) => setEditorMode(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 'bold' }}>Editor</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
            <input
              type="checkbox"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 'bold' }}>Debug</span>
          </label>
          {editorMode && (
            <>
              <button
                onClick={() => setDrawingMode('bed')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: drawingMode === 'bed' ? '#38a169' : '#e2e8f0',
                  color: drawingMode === 'bed' ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Draw Bed
              </button>
              <select
                value={selectedBedId || ''}
                onChange={(e) => setSelectedBedId(e.target.value || null)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <option value="">Select Bed for Slot</option>
                {state.garden.beds.map(bed => (
                  <option key={bed.id} value={bed.id}>{bed.name}</option>
                ))}
              </select>
              <button
                onClick={() => setDrawingMode('slot')}
                disabled={!selectedBedId}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: drawingMode === 'slot' ? '#38a169' : selectedBedId ? '#e2e8f0' : '#f7fafc',
                  color: drawingMode === 'slot' ? 'white' : selectedBedId ? '#333' : '#a0a0a0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedBedId ? 'pointer' : 'not-allowed'
                }}
              >
                Draw Slot
              </button>
              <button
                onClick={() => setShowGridConfig(!showGridConfig)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3182ce',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Configure Grid
              </button>
            </>
          )}
        </div>
      </div>

      {editorMode && drawingMode !== 'none' && (
        <div style={{
          backgroundColor: '#fef5e7',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f6ad55'
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            {drawingMode === 'bed' && 'Click and drag to draw a bed area on the grid.'}
            {drawingMode === 'slot' && selectedBedId && 'Click and drag to draw a slot within the selected bed.'}
            Click any tool again to cancel drawing mode.
          </p>
        </div>
      )}

      {editorMode && showGridConfig && (
        <div style={{
          backgroundColor: '#f7fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Grid Configuration</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Width (columns):
                <input
                  type="number"
                  value={gridWidth}
                  onChange={(e) => setGridWidth(parseInt(e.target.value) || 3)}
                  min="3"
                  max="50"
                  style={{ 
                    width: '80px', 
                    padding: '0.25rem', 
                    marginTop: '0.25rem',
                    marginLeft: '0.5rem'
                  }}
                />
              </label>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Height (rows):
                <input
                  type="number"
                  value={gridHeight}
                  onChange={(e) => setGridHeight(parseInt(e.target.value) || 3)}
                  min="3"
                  max="50"
                  style={{ 
                    width: '80px', 
                    padding: '0.25rem', 
                    marginTop: '0.25rem',
                    marginLeft: '0.5rem'
                  }}
                />
              </label>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleGridSizeUpdate}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#38a169',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '0.5rem'
                }}
              >
                Apply
              </button>
              <button
                onClick={resetGridConfig}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
            Current grid: {state.garden.gridSize.width} × {state.garden.gridSize.height} cells. 
            Range: 3-50 cells per dimension. Plants outside new bounds will be removed.
          </p>
        </div>
      )}
      
      {/* Garden Grid */}
      <div className="garden-grid" style={{ 
        gridTemplateColumns: `repeat(${state.garden.gridSize.width}, 30px)`,
        gridTemplateRows: `repeat(${state.garden.gridSize.height}, 30px)`,
        margin: '0 auto 2rem auto'
      }}>
        {Array.from({ length: state.garden.gridSize.width * state.garden.gridSize.height }).map((_, index) => {
          const x = index % state.garden.gridSize.width;
          const y = Math.floor(index / state.garden.gridSize.width);
          const cellKey = `${x}-${y}`;
          const plantedItem = plantedCells.get(cellKey);
          const bed = getBedForCell(x, y);
          const slotInfo = getSlotForCell(x, y);
          const slot = slotInfo?.slot;
          
          return (
            <DroppableGridCell
              key={index}
              x={x}
              y={y}
              onPlantDrop={handlePlantDrop}
              onCellClick={handleCellClick}
              onMouseDown={editorMode ? handleCellMouseDown : () => {}}
              onMouseEnter={editorMode ? handleCellMouseEnter : () => {}}
              onMouseUp={editorMode ? handleCellMouseUp : () => {}}
              onRightClick={editorMode ? handleRightClick : () => {}}
              plantedItem={plantedItem ? { plant: plantedItem } : undefined}
              drawingMode={editorMode ? drawingMode : 'none'}
              drawPreview={editorMode ? drawPreview : undefined}
              bed={bed ? { id: bed.id, name: bed.name, position: bed.position } : undefined}
              slot={slot ? { id: slot.id, number: slot.number } : undefined}
              getCellBorderStyle={getCellBorderStyle}
              debugMode={debugMode}
            />
          );
        })}
      </div>

      {/* Plant Palette */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3>Available Plants - Drag to Garden</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '1rem'
        }}>
          {state.plants.map((plant) => (
            <DraggablePlant key={plant.name} plant={plant} />
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          Drag plants from above onto the grid. Click a planted cell to remove it.
        </p>
      </div>

      {/* Bed and Slot Management */}
      {editorMode && state.garden.beds.length > 0 && (
        <div style={{
          backgroundColor: '#f7fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Bed and Slot Management{debugMode && ' (Debug Mode)'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {state.garden.beds.map(bed => (
              <div key={bed.id} style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  {editingBedId === bed.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                      <input
                        type="text"
                        value={editingBedName}
                        onChange={(e) => setEditingBedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveBedName(bed.id);
                          if (e.key === 'Escape') cancelEditingBed();
                        }}
                        style={{
                          flex: 1,
                          padding: '0.25rem',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          border: '2px solid #0066cc',
                          borderRadius: '4px'
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveBedName(bed.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#38a169',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEditingBed}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 
                        style={{ 
                          margin: 0, 
                          color: '#0066cc', 
                          cursor: 'pointer',
                          flex: 1,
                          fontSize: '0.9rem'
                        }}
                        onClick={() => startEditingBed(bed.id, bed.name)}
                        title="Click to edit bed name"
                      >
                        {bed.name}
                      </h4>
                      {debugMode && (
                        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
                          Position: ({bed.position.x}, {bed.position.y}) | Size: {bed.size.width}×{bed.size.height}
                        </div>
                      )}
                      <button
                        onClick={() => deleteBed(bed.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.7rem'
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                
                {bed.slots.length > 0 ? (
                  <div>
                    <strong style={{ fontSize: '0.8rem' }}>Slots:</strong>
                    <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {bed.slots.map(slot => (
                        <div key={slot.id} style={{
                          backgroundColor: '#f0f8e6',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #4d9900',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                            {slot.number}
                          </span>
                          {debugMode && (
                            <div style={{ fontSize: '0.6rem', color: '#666', lineHeight: '1' }}>
                              ({slot.position.x},{slot.position.y}) {slot.size.width}×{slot.size.height}
                            </div>
                          )}
                          <button
                            onClick={() => deleteSlot(bed.id, slot.id)}
                            style={{
                              padding: '0.125rem 0.25rem',
                              backgroundColor: '#e53e3e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              fontSize: '0.6rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#888', fontStyle: 'italic' }}>
                    No slots yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
