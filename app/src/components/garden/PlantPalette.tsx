import React from 'react';
import { useDrag } from 'react-dnd';
import { Plant } from '../../types/garden';
import { COLORS } from '../../constants/garden';

interface DraggablePlantProps {
  plant: Plant;
}

const DraggablePlant = React.memo(function DraggablePlant({ plant }: DraggablePlantProps) {
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
        border: `1px solid ${COLORS.gridBorder}`,
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
});

interface PlantPaletteProps {
  plants: Plant[];
}

const PlantPalette = React.memo(function PlantPalette({ plants }: PlantPaletteProps) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h3>Available Plants - Drag to Garden</h3>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '1rem'
      }}>
        {plants.map((plant) => (
          <DraggablePlant key={plant.name} plant={plant} />
        ))}
      </div>
      <p style={{ marginTop: '1rem', fontSize: '14px', color: COLORS.textSecondary }}>
        Drag plants from above onto the grid. Click a planted cell to remove it.
      </p>
    </div>
  );
});

export default PlantPalette;
