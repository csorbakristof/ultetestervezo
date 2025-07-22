import { useGarden, Plant } from '../context/GardenContext';
import { useDrag, useDrop } from 'react-dnd';
import { useState } from 'react';

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
  plantedItem?: { plant: Plant };
}

function DroppableGridCell({ x, y, onPlantDrop, onCellClick, plantedItem }: DroppableGridCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'plant',
    drop: (item: { plant: Plant }) => {
      onPlantDrop(item.plant, x, y);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const backgroundColor = plantedItem 
    ? '#c6f6d5' 
    : isOver && canDrop 
    ? '#bee3f8' 
    : canDrop 
    ? '#f7fafc' 
    : 'white';

  return (
    <div
      ref={drop}
      className="grid-cell"
      onClick={() => plantedItem && onCellClick(x, y)}
      style={{ 
        gridColumn: x + 1, 
        gridRow: y + 1,
        backgroundColor,
        border: isOver && canDrop ? '2px solid #3182ce' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        cursor: plantedItem ? 'pointer' : 'default'
      }}
    >
      {plantedItem && (
        <span title={`${plantedItem.plant.name} - Click to remove`}>
          {plantedItem.plant.image}
        </span>
      )}
    </div>
  );
}

export default function GardenView() {
  const { state } = useGarden();
  const [plantedCells, setPlantedCells] = useState<Map<string, Plant>>(new Map());

  const handlePlantDrop = (plant: Plant, x: number, y: number) => {
    const cellKey = `${x}-${y}`;
    setPlantedCells(prev => new Map(prev.set(cellKey, plant)));
  };

  const handleCellClick = (x: number, y: number) => {
    const cellKey = `${x}-${y}`;
    setPlantedCells(prev => {
      const newMap = new Map(prev);
      newMap.delete(cellKey);
      return newMap;
    });
  };

  return (
    <div>
      <h2>Garden View - Week {state.currentWeek}</h2>
      
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
          
          return (
            <DroppableGridCell
              key={index}
              x={x}
              y={y}
              onPlantDrop={handlePlantDrop}
              onCellClick={handleCellClick}
              plantedItem={plantedItem ? { plant: plantedItem } : undefined}
            />
          );
        })}
      </div>

      {/* Plant Palette */}
      <div style={{ textAlign: 'center' }}>
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
    </div>
  );
}
