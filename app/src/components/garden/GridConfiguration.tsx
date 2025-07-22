import { MIN_GRID_SIZE, MAX_GRID_SIZE, COLORS } from '../../constants/garden';

interface GridConfigurationProps {
  gridWidth: number;
  gridHeight: number;
  currentGridSize: { width: number; height: number };
  onGridWidthChange: (width: number) => void;
  onGridHeightChange: (height: number) => void;
  onApply: () => void;
  onCancel: () => void;
}

export default function GridConfiguration({
  gridWidth,
  gridHeight,
  currentGridSize,
  onGridWidthChange,
  onGridHeightChange,
  onApply,
  onCancel
}: GridConfigurationProps) {
  return (
    <div style={{
      backgroundColor: '#f7fafc',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: `1px solid ${COLORS.gridBorder}`
    }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Grid Configuration</h3>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Width (columns):
            <input
              type="number"
              value={gridWidth}
              onChange={(e) => onGridWidthChange(parseInt(e.target.value) || MIN_GRID_SIZE)}
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              style={{ 
                width: '80px', 
                padding: '0.25rem', 
                marginTop: '0.25rem',
                marginLeft: '0.5rem',
                border: `1px solid ${COLORS.gridBorder}`,
                borderRadius: '4px'
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
              onChange={(e) => onGridHeightChange(parseInt(e.target.value) || MIN_GRID_SIZE)}
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              style={{ 
                width: '80px', 
                padding: '0.25rem', 
                marginTop: '0.25rem',
                marginLeft: '0.5rem',
                border: `1px solid ${COLORS.gridBorder}`,
                borderRadius: '4px'
              }}
            />
          </label>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={onApply}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: COLORS.success,
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
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: COLORS.danger,
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
      <p style={{ margin: 0, fontSize: '0.875rem', color: COLORS.textSecondary }}>
        Current grid: {currentGridSize.width} × {currentGridSize.height} cells. 
        Range: {MIN_GRID_SIZE}-{MAX_GRID_SIZE} cells per dimension. Plants outside new bounds will be removed.
      </p>
    </div>
  );
}
