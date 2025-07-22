import { useGarden, Plant } from '../context/GardenContext';
import { useState } from 'react';

interface EditablePlantCardProps {
  plant: Plant;
  onUpdate: (update: { originalName: string; updatedPlant: Plant }) => void;
  onDelete: (plantName: string) => void;
}

function EditablePlantCard({ plant, onUpdate, onDelete }: EditablePlantCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState<Plant>(plant);
  const [originalName, setOriginalName] = useState(plant.name);

  const handleSave = () => {
    onUpdate({ originalName, updatedPlant: editedPlant });
    setIsEditing(false);
    setOriginalName(editedPlant.name); // Update the original name for future edits
  };

  const handleCancel = () => {
    setEditedPlant(plant);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedPlant(plant); // Reset to current plant data when starting to edit
    setOriginalName(plant.name); // Track the original name
    setIsEditing(true);
  };

  const handleArrayInput = (value: string, field: 'plantingMonths' | 'harvestMonths' | 'companionPlants' | 'incompatiblePlants') => {
    if (field === 'plantingMonths' || field === 'harvestMonths') {
      const numbers = value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      setEditedPlant(prev => ({ ...prev, [field]: numbers }));
    } else {
      const strings = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      setEditedPlant(prev => ({ ...prev, [field]: strings }));
    }
  };

  if (isEditing) {
    return (
      <div className="plant-card" style={{ 
        backgroundColor: '#f0f8ff',
        maxHeight: '70vh',
        width: '600px',
        maxWidth: '90vw',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '0.5rem',
          borderBottom: '1px solid #ddd',
          flexShrink: 0
        }}>
          <h4 style={{ margin: 0, color: '#333' }}>Editing: {editedPlant.name}</h4>
        </div>

        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          paddingBottom: '0.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Plant Name:
                <input
                  type="text"
                  value={editedPlant.name}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                />
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Emoji Icon:
                <input
                  type="text"
                  value={editedPlant.image}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, image: e.target.value }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                  maxLength={2}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Plant Family:
                <input
                  type="text"
                  value={editedPlant.plantFamily}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, plantFamily: e.target.value }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                />
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Season:
                <select
                  value={editedPlant.season}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, season: e.target.value as 'spring' | 'summer' | 'fall' | 'winter' }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                >
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </select>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Planting Months:
                <input
                  type="text"
                  value={editedPlant.plantingMonths.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, 'plantingMonths')}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                  placeholder="e.g. 3, 4, 5"
                />
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Harvest Months:
                <input
                  type="text"
                  value={editedPlant.harvestMonths.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, 'harvestMonths')}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                  placeholder="e.g. 7, 8, 9"
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Growth Duration (weeks):
                <input
                  type="number"
                  value={editedPlant.growthDuration}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, growthDuration: parseInt(e.target.value) || 0 }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                  min="1"
                  max="52"
                />
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Spacing (cm):
                <input
                  type="number"
                  value={editedPlant.spacingCm}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, spacingCm: parseInt(e.target.value) || 0 }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                  min="1"
                  max="200"
                />
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Succession Interval (weeks):
                <input
                  type="number"
                  value={editedPlant.successionInterval}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, successionInterval: parseInt(e.target.value) || 0 }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                  min="1"
                  max="26"
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Water Need:
                <select
                  value={editedPlant.waterNeed}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, waterNeed: parseInt(e.target.value) as 1 | 2 | 3 }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                </select>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Sun Need:
                <select
                  value={editedPlant.sunNeed}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, sunNeed: parseInt(e.target.value) as 1 | 2 | 3 }))}
                  style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                </select>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Companion Plants (comma separated):
              <input
                type="text"
                value={editedPlant.companionPlants.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, 'companionPlants')}
                style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                placeholder="e.g. lettuce, radish"
              />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Incompatible Plants (comma separated):
              <input
                type="text"
                value={editedPlant.incompatiblePlants.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, 'incompatiblePlants')}
                style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
                placeholder="e.g. fennel, tomato"
              />
            </label>
          </div>
        </div>

        <div style={{ 
          flexShrink: 0,
          backgroundColor: '#f0f8ff',
          padding: '1rem',
          borderTop: '1px solid #ddd'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-card">
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

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          onClick={handleEdit}
          style={{ 
            flex: 1, 
            padding: '0.5rem', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(plant.name)}
          style={{ 
            flex: 1, 
            padding: '0.5rem', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

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

  const handleUpdatePlant = (update: { originalName: string; updatedPlant: Plant }) => {
    dispatch({ type: 'UPDATE_PLANT', payload: update });
  };

  const handleDeletePlant = (plantName: string) => {
    if (confirm(`Are you sure you want to delete "${plantName}"?`)) {
      dispatch({ type: 'DELETE_PLANT', payload: plantName });
    }
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
          <EditablePlantCard
            key={plant.name}
            plant={plant}
            onUpdate={handleUpdatePlant}
            onDelete={handleDeletePlant}
          />
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
