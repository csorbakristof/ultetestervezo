import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { Plant, Slot, Planting } from '../context/GardenContext';

export default function TimelineView() {
  const { state, dispatch } = useGarden();
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  // Get all slots from all beds
  const allSlots: Array<{ bed: string; slot: Slot }> = [];
  state.garden.beds.forEach(bed => {
    bed.slots.forEach(slot => {
      allSlots.push({ bed: bed.name, slot });
    });
  });

  // Get plant at specific week for a slot
  const getPlantAtWeek = (slot: Slot, week: number): Plant | null => {
    const planting = slot.plantings.find(p => week >= p.startWeek && week <= p.endWeek);
    if (!planting) return null;
    return state.plants.find(p => p.name === planting.plant) || null;
  };

  // Handle cell click to add/remove planting
  const handleCellClick = (bedId: string, slotId: string, week: number) => {
    if (!selectedPlant) return;

    const bed = state.garden.beds.find(b => b.name === bedId);
    const slot = bed?.slots.find(s => s.id === slotId);
    if (!bed || !slot) return;

    const plant = state.plants.find(p => p.name === selectedPlant);
    if (!plant) return;

    // Check if there's already a planting at this week
    const existingPlanting = slot.plantings.find(p => week >= p.startWeek && week <= p.endWeek);
    if (existingPlanting) {
      // Remove existing planting
      dispatch({
        type: 'REMOVE_PLANTING',
        payload: { bedId: bed.id, slotId, startWeek: existingPlanting.startWeek }
      });
      return;
    }

    // Calculate end week based on growth duration
    const endWeek = Math.min(52, week + plant.growthDuration - 1);

    // Check for overlaps with existing plantings
    const hasOverlap = slot.plantings.some(p => 
      (week >= p.startWeek && week <= p.endWeek) ||
      (endWeek >= p.startWeek && endWeek <= p.endWeek) ||
      (week <= p.startWeek && endWeek >= p.endWeek)
    );

    if (hasOverlap) {
      alert('Cannot plant here - overlaps with existing planting period');
      return;
    }

    // Add new planting
    const newPlanting: Planting = {
      plant: selectedPlant,
      startWeek: week,
      endWeek
    };

    dispatch({
      type: 'ADD_PLANTING',
      payload: { bedId: bed.id, slotId, planting: newPlanting }
    });
  };

  // Get date for week number (approximate)
  const getWeekDate = (week: number): string => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const weekStart = new Date(startOfYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    return `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Timeline View</h2>
      
      {/* Plant Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="plant-select">Select Plant for Planting: </label>
        <select
          id="plant-select"
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
          style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
        >
          <option value="">-- Select a plant --</option>
          {state.plants.map(plant => (
            <option key={plant.name} value={plant.name}>
              {plant.image} {plant.name}
            </option>
          ))}
        </select>
      </div>

      {allSlots.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          <p>No slots available. Create beds and slots in Garden View to see the timeline.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '80vh' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `80px repeat(${allSlots.length}, 120px)`,
            gridTemplateRows: `auto repeat(${weeks.length}, 40px)`,
            gap: '1px',
            backgroundColor: '#ccc',
            border: '1px solid #ccc'
          }}>
            {/* Empty corner cell */}
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '0.5rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Week
            </div>

            {/* Slot headers */}
            {allSlots.map(({ bed, slot }) => (
              <div key={`slot-header-${slot.id}`} style={{
                backgroundColor: '#f5f5f5',
                padding: '0.5rem',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div>{bed}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Slot {slot.number}</div>
              </div>
            ))}

            {/* Timeline rows for each week */}
            {weeks.map(week => (
              <React.Fragment key={`week-${week}`}>
                {/* Week header */}
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <div>W{week}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>{getWeekDate(week)}</div>
                </div>

                {/* Timeline cells for this week */}
                {allSlots.map(({ bed, slot }) => {
                  const plant = getPlantAtWeek(slot, week);
                  const isPlanted = !!plant;
                  const isStartWeek = slot.plantings.some(p => p.startWeek === week);
                  const isEndWeek = slot.plantings.some(p => p.endWeek === week);

                  return (
                    <div
                      key={`cell-${week}-${slot.id}`}
                      onClick={() => handleCellClick(bed, slot.id, week)}
                      style={{
                        backgroundColor: isPlanted ? '#e8f5e8' : '#fff',
                        border: isStartWeek || isEndWeek ? '2px solid #4CAF50' : '1px solid #ddd',
                        borderTop: isStartWeek ? '3px solid #2E7D32' : undefined,
                        borderBottom: isEndWeek ? '3px solid #2E7D32' : undefined,
                        cursor: selectedPlant ? 'pointer' : 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.1rem',
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        minHeight: '38px',
                        position: 'relative'
                      }}
                      title={isPlanted 
                        ? `${plant.image} ${plant.name} (Week ${slot.plantings.find(p => week >= p.startWeek && week <= p.endWeek)?.startWeek}-${slot.plantings.find(p => week >= p.startWeek && week <= p.endWeek)?.endWeek})`
                        : selectedPlant 
                          ? `Click to plant ${selectedPlant}`
                          : 'Select a plant to add planting'
                      }
                    >
                      {isPlanted && (
                        <>
                          <div style={{ fontSize: '1rem' }}>{plant.image}</div>
                          <div style={{ fontSize: '0.6rem', lineHeight: '1' }}>
                            {plant.name.slice(0, 8)}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ul style={{ marginLeft: '1rem' }}>
          <li>Select a plant from the dropdown above</li>
          <li>Click on a timeline cell to plant at that week</li>
          <li>Click on an existing planting to remove it</li>
          <li>Each row represents a week of the year</li>
          <li>Each column represents a slot in your garden</li>
          <li>Green cells show planted periods</li>
          <li>Thick borders mark start/end of planting periods</li>
          <li>Hover over cells for detailed information</li>
        </ul>
      </div>
    </div>
  );
}
