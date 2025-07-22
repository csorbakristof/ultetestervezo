import { useGarden, Plant } from '../context/GardenContext';

export default function PlantLibrary() {
  const { state, dispatch } = useGarden();

  const addNewPlant = () => {
    const newPlant: Plant = {
      name: 'New Plant',
      image: '🌱',
      plantingMonths: [4, 5],
      harvestMonths: [7, 8],
      waterNeed: 2,
      sunNeed: 2,
      incompatiblePlants: [],
      companionPlants: [],
      growthDuration: 12,
      spacingCm: 15,
      plantFamily: 'Unknown',
      season: 'summer',
      successionInterval: 4
    };
    dispatch({ type: 'ADD_PLANT', payload: newPlant });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Plant Library</h2>
        <button onClick={addNewPlant} style={{ padding: '0.5rem 1rem' }}>
          Add New Plant
        </button>
      </div>
      
      <div className="plant-library">
        {state.plants.map((plant) => (
          <div key={plant.name} className="plant-card">
            <h3>{plant.image} {plant.name}</h3>
            <p><strong>Plant Family:</strong> {plant.plantFamily}</p>
            <p><strong>Season:</strong> {plant.season}</p>
            <p><strong>Planting Months:</strong> {plant.plantingMonths.join(', ')}</p>
            <p><strong>Harvest Months:</strong> {plant.harvestMonths.join(', ')}</p>
            <p><strong>Growth Duration:</strong> {plant.growthDuration} weeks</p>
            <p><strong>Spacing:</strong> {plant.spacingCm} cm</p>
            <p><strong>Water Need:</strong> {plant.waterNeed}/3</p>
            <p><strong>Sun Need:</strong> {plant.sunNeed}/3</p>
            <p><strong>Succession Interval:</strong> {plant.successionInterval} weeks</p>
            
            {plant.companionPlants.length > 0 && (
              <p><strong>Companion Plants:</strong> {plant.companionPlants.join(', ')}</p>
            )}
            
            {plant.incompatiblePlants.length > 0 && (
              <p><strong>Incompatible Plants:</strong> {plant.incompatiblePlants.join(', ')}</p>
            )}
          </div>
        ))}
      </div>

      {state.plants.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>No plants in your library yet. Add some plants to get started!</p>
        </div>
      )}
    </div>
  );
}
