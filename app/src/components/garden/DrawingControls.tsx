import { Bed } from '../../types/garden';
import { COLORS } from '../../constants/garden';

interface DrawingControlsProps {
  drawingMode: 'none' | 'bed' | 'slot';
  onDrawingModeChange: (mode: 'none' | 'bed' | 'slot') => void;
  selectedBedId: string | null;
  onSelectedBedChange: (bedId: string | null) => void;
  beds: Bed[];
  onShowGridConfig: () => void;
}

export default function DrawingControls({
  drawingMode,
  onDrawingModeChange,
  selectedBedId,
  onSelectedBedChange,
  beds,
  onShowGridConfig
}: DrawingControlsProps) {
  const handleDrawingModeClick = (mode: 'bed' | 'slot') => {
    if (drawingMode === mode) {
      onDrawingModeChange('none');
    } else {
      onDrawingModeChange(mode);
      if (mode === 'slot' && !selectedBedId && beds.length > 0) {
        onSelectedBedChange(beds[0].id);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={() => handleDrawingModeClick('bed')}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: drawingMode === 'bed' ? COLORS.primary : COLORS.gridBackground,
          color: drawingMode === 'bed' ? 'white' : COLORS.textPrimary,
          border: `1px solid ${COLORS.gridBorder}`,
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}
      >
        🏗️ Draw Bed
      </button>

      <button
        onClick={() => handleDrawingModeClick('slot')}
        disabled={beds.length === 0}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: drawingMode === 'slot' ? COLORS.primary : COLORS.gridBackground,
          color: drawingMode === 'slot' ? 'white' : beds.length === 0 ? COLORS.textSecondary : COLORS.textPrimary,
          border: `1px solid ${COLORS.gridBorder}`,
          borderRadius: '4px',
          cursor: beds.length === 0 ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          opacity: beds.length === 0 ? 0.5 : 1
        }}
      >
        📦 Draw Slot
      </button>

      {drawingMode === 'slot' && beds.length > 0 && (
        <select
          value={selectedBedId || ''}
          onChange={(e) => onSelectedBedChange(e.target.value)}
          style={{
            padding: '0.5rem',
            border: `1px solid ${COLORS.gridBorder}`,
            borderRadius: '4px',
            backgroundColor: COLORS.gridBackground,
            color: COLORS.textPrimary,
            fontSize: '0.875rem'
          }}
        >
          {beds.map(bed => (
            <option key={bed.id} value={bed.id}>
              {bed.name}
            </option>
          ))}
        </select>
      )}

      <div style={{ width: '1px', height: '2rem', backgroundColor: COLORS.gridBorder, margin: '0 0.5rem' }} />

      <button
        onClick={onShowGridConfig}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: COLORS.gridBackground,
          color: COLORS.textPrimary,
          border: `1px solid ${COLORS.gridBorder}`,
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}
      >
        ⚙️ Grid
      </button>
    </div>
  );
}
