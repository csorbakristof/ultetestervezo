import { useGarden } from '../context/GardenContext';

export default function TimelineView() {
  const { state } = useGarden();
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div>
      <h2>Timeline View</h2>
      <div className="timeline-container">
        <div className="timeline-grid" style={{
          gridTemplateColumns: `repeat(${weeks.length}, 80px)`,
          gridTemplateRows: 'auto repeat(10, 30px)' // Header + placeholder slots
        }}>
          {/* Week headers */}
          {weeks.map(week => (
            <div key={`week-${week}`} className="timeline-header">
              W{week}
            </div>
          ))}
          
          {/* Placeholder timeline rows for each slot */}
          {Array.from({ length: 10 }).map((_, slotIndex) => (
            weeks.map(week => (
              <div 
                key={`slot-${slotIndex}-week-${week}`} 
                className="timeline-cell"
              >
                {/* Placeholder for plant data */}
              </div>
            ))
          ))}
        </div>
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>Timeline shows planting schedule for the entire year</p>
        <p>Each row represents a slot, each column represents a week</p>
      </div>
    </div>
  );
}
