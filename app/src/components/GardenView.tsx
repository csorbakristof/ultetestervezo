import { useGarden } from '../context/GardenContext';

export default function GardenView() {
  const { state } = useGarden();

  return (
    <div>
      <h2>Garden View - Week {state.currentWeek}</h2>
      <div className="garden-grid" style={{ 
        gridTemplateColumns: `repeat(${state.garden.gridSize.width}, 30px)`,
        gridTemplateRows: `repeat(${state.garden.gridSize.height}, 30px)`
      }}>
        {Array.from({ length: state.garden.gridSize.width * state.garden.gridSize.height }).map((_, index) => {
          const x = index % state.garden.gridSize.width;
          const y = Math.floor(index / state.garden.gridSize.width);
          
          return (
            <div
              key={index}
              className="grid-cell"
              style={{ gridColumn: x + 1, gridRow: y + 1 }}
            >
              {/* Placeholder for bed/slot content */}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>Click and drag to create beds and slots</p>
        <p>Current plants available: {state.plants.map(p => p.image + ' ' + p.name).join(', ')}</p>
      </div>
    </div>
  );
}
