import { useState } from 'react';
import { useGarden } from '../../context/GardenContext';
import { GRID_CELL_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE, COLORS } from '../../constants/garden';
import { getBedForCell, getSlotForCell, normalizeDrawArea } from '../../utils/gardenHelpers';
import { getCellBorderStyle } from '../../utils/gridCalculations';
import { useDrawing } from './hooks/useDrawing';
import { usePlanting } from './hooks/usePlanting';
import WeekNavigation from './WeekNavigation';
import PlantPalette from './PlantPalette';
import GridCell from './GridCell';
import DrawingControls from './DrawingControls';
import GridConfiguration from './GridConfiguration';
import BedManagement from './BedManagement';

export default function GardenView() {
  const { state, dispatch } = useGarden();
  const [showGridConfig, setShowGridConfig] = useState(false);
  const [gridWidth, setGridWidth] = useState(state.garden.gridSize.width);
  const [gridHeight, setGridHeight] = useState(state.garden.gridSize.height);
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [editingBedName, setEditingBedName] = useState<string>('');
  const [editorMode, setEditorMode] = useState<boolean>(true);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const {
    drawingMode,
    setDrawingMode,
    selectedBedId,
    setSelectedBedId,
    isDrawing,
    drawPreview,
    startDrawing,
    updateDrawing,
    finishDrawing
  } = useDrawing({ editorMode });

  const { handlePlantDrop, handleCellClick, getPlantedItem } = usePlanting({
    beds: state.garden.beds,
    plants: state.plants,
    currentWeek: state.currentWeek,
    onAddPlanting: (bedId, slotId, planting) => {
      dispatch({ 
        type: 'ADD_PLANTING', 
        payload: { bedId, slotId, planting }
      });
    },
    onRemovePlanting: (bedId, slotId, startWeek) => {
      dispatch({ 
        type: 'REMOVE_PLANTING', 
        payload: { bedId, slotId, startWeek }
      });
    }
  });

  const handleWeekChange = (week: number) => {
    dispatch({ type: 'SET_CURRENT_WEEK', payload: week });
  };

  const handleGridSizeUpdate = () => {
    if (gridWidth >= MIN_GRID_SIZE && gridWidth <= MAX_GRID_SIZE && 
        gridHeight >= MIN_GRID_SIZE && gridHeight <= MAX_GRID_SIZE) {
      dispatch({ type: 'UPDATE_GRID_SIZE', payload: { width: gridWidth, height: gridHeight } });
      setShowGridConfig(false);
    }
  };

  const resetGridConfig = () => {
    setGridWidth(state.garden.gridSize.width);
    setGridHeight(state.garden.gridSize.height);
    setShowGridConfig(false);
  };

  const createBed = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const { minX, minY, width, height } = normalizeDrawArea(start, end);
    
    const newBed = {
      id: `bed-${Date.now()}`,
      name: `Bed ${state.garden.beds.length + 1}`,
      position: { x: minX, y: minY },
      size: { width, height },
      slots: []
    };
    
    dispatch({ type: 'ADD_BED', payload: newBed });
  };

  const createSlot = (bedId: string, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const { minX, minY, width, height } = normalizeDrawArea(start, end);
    
    const bed = state.garden.beds.find(b => b.id === bedId);
    if (!bed) return;
    
    const newSlot = {
      id: `slot-${Date.now()}`,
      number: `${bed.slots.length + 1}`,
      position: { x: minX, y: minY },
      size: { width, height },
      plantings: []
    };
    
    dispatch({ type: 'ADD_SLOT', payload: { bedId, slot: newSlot } });
  };

  const deleteBed = (bedId: string) => {
    const bed = state.garden.beds.find(b => b.id === bedId);
    if (bed && confirm(`Are you sure you want to delete "${bed.name}" and all its slots?`)) {
      dispatch({ type: 'DELETE_BED', payload: bedId });
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

  const handleRightClick = (_x: number, _y: number, bed?: { id: string; name: string; position: { x: number; y: number } }, slot?: { id: string; number: string }) => {
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
      startDrawing(x, y);
    }
  };

  const handleCellMouseEnter = (x: number, y: number) => {
    if (isDrawing) {
      updateDrawing(x, y);
    }
  };

  const handleCellMouseUp = (x: number, y: number) => {
    const result = finishDrawing(x, y);
    if (result) {
      if (result.mode === 'bed') {
        createBed(result.start, result.end);
      } else if (result.mode === 'slot' && result.selectedBedId) {
        createSlot(result.selectedBedId, result.start, result.end);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>Garden View</h2>
          <WeekNavigation
            currentWeek={state.currentWeek}
            onWeekChange={handleWeekChange}
          />
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
            <DrawingControls
              drawingMode={drawingMode}
              onDrawingModeChange={setDrawingMode}
              selectedBedId={selectedBedId}
              onSelectedBedChange={setSelectedBedId}
              beds={state.garden.beds}
              onShowGridConfig={() => setShowGridConfig(!showGridConfig)}
            />
          )}
        </div>
      </div>

      {editorMode && drawingMode !== 'none' && (
        <div style={{
          backgroundColor: '#fef5e7',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: `1px solid ${COLORS.warning}`
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            {drawingMode === 'bed' && 'Click and drag to draw a bed area on the grid.'}
            {drawingMode === 'slot' && selectedBedId && 'Click and drag to draw a slot within the selected bed.'}
            Click any tool again to cancel drawing mode.
          </p>
        </div>
      )}

      {editorMode && showGridConfig && (
        <GridConfiguration
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          currentGridSize={state.garden.gridSize}
          onGridWidthChange={setGridWidth}
          onGridHeightChange={setGridHeight}
          onApply={handleGridSizeUpdate}
          onCancel={resetGridConfig}
        />
      )}
      
      {/* Garden Grid */}
      <div 
        className="garden-grid" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${state.garden.gridSize.width}, ${GRID_CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${state.garden.gridSize.height}, ${GRID_CELL_SIZE}px)`,
          margin: '0 auto 2rem auto',
          gap: '0'
        }}
      >
        {Array.from({ length: state.garden.gridSize.width * state.garden.gridSize.height }).map((_, index) => {
          const x = index % state.garden.gridSize.width;
          const y = Math.floor(index / state.garden.gridSize.width);
          const bed = getBedForCell(x, y, state.garden.beds);
          const slotInfo = getSlotForCell(x, y, state.garden.beds);
          const slot = slotInfo?.slot;
          const borderStyle = getCellBorderStyle(x, y, state.garden.beds, state.garden.gridSize);
          
          return (
            <GridCell
              key={index}
              position={{ x, y }}
              onPlantDrop={handlePlantDrop}
              onCellClick={handleCellClick}
              onMouseDown={editorMode ? handleCellMouseDown : () => {}}
              onMouseEnter={editorMode ? handleCellMouseEnter : () => {}}
              onMouseUp={editorMode ? handleCellMouseUp : () => {}}
              onRightClick={editorMode ? handleRightClick : () => {}}
              plantedItem={getPlantedItem(x, y)}
              drawingMode={editorMode ? drawingMode : 'none'}
              drawPreview={editorMode ? drawPreview : undefined}
              bed={bed ? { id: bed.id, name: bed.name, position: bed.position } : undefined}
              slot={slot ? { id: slot.id, number: slot.number } : undefined}
              borderStyle={borderStyle}
              debugMode={debugMode}
            />
          );
        })}
      </div>

      {/* Plant Palette */}
      <PlantPalette plants={state.plants} />

      {/* Bed and Slot Management */}
      {editorMode && state.garden.beds.length > 0 && (
        <BedManagement
          beds={state.garden.beds}
          editingBedId={editingBedId}
          editingBedName={editingBedName}
          debugMode={debugMode}
          onStartEditingBed={startEditingBed}
          onSaveBedName={saveBedName}
          onCancelEditingBed={cancelEditingBed}
          onEditingBedNameChange={setEditingBedName}
          onDeleteBed={deleteBed}
          onDeleteSlot={deleteSlot}
        />
      )}
    </div>
  );
}
