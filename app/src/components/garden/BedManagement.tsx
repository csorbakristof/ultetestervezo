import { Bed } from '../../types/garden';
import { COLORS } from '../../constants/garden';

interface BedManagementProps {
  beds: Bed[];
  editingBedId: string | null;
  editingBedName: string;
  debugMode: boolean;
  onStartEditingBed: (bedId: string, currentName: string) => void;
  onSaveBedName: (bedId: string) => void;
  onCancelEditingBed: () => void;
  onEditingBedNameChange: (name: string) => void;
  onDeleteBed: (bedId: string) => void;
  onDeleteSlot: (bedId: string, slotId: string) => void;
}

export default function BedManagement({
  beds,
  editingBedId,
  editingBedName,
  debugMode,
  onStartEditingBed,
  onSaveBedName,
  onCancelEditingBed,
  onEditingBedNameChange,
  onDeleteBed,
  onDeleteSlot
}: BedManagementProps) {
  return (
    <div style={{
      backgroundColor: '#f7fafc',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: `1px solid ${COLORS.gridBorder}`
    }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>
        Bed and Slot Management{debugMode && ' (Debug Mode)'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {beds.map(bed => (
          <div key={bed.id} style={{
            backgroundColor: 'white',
            padding: '0.75rem',
            borderRadius: '4px',
            border: `1px solid ${COLORS.gridBorder}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              {editingBedId === bed.id ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                  <input
                    type="text"
                    value={editingBedName}
                    onChange={(e) => onEditingBedNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveBedName(bed.id);
                      if (e.key === 'Escape') onCancelEditingBed();
                    }}
                    style={{
                      flex: 1,
                      padding: '0.25rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      border: `2px solid ${COLORS.bedBorder}`,
                      borderRadius: '4px'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => onSaveBedName(bed.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: COLORS.success,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={onCancelEditingBed}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: COLORS.danger,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <h4 
                    style={{ 
                      margin: 0, 
                      color: COLORS.bedBorder, 
                      cursor: 'pointer',
                      flex: 1,
                      fontSize: '0.9rem'
                    }}
                    onClick={() => onStartEditingBed(bed.id, bed.name)}
                    title="Click to edit bed name"
                  >
                    {bed.name}
                  </h4>
                  <button
                    onClick={() => onDeleteBed(bed.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: COLORS.danger,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.7rem'
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            
            {debugMode && (
              <div style={{ fontSize: '0.7rem', color: COLORS.textSecondary, marginBottom: '0.5rem' }}>
                Position: ({bed.position.x}, {bed.position.y}) | Size: {bed.size.width}×{bed.size.height}
              </div>
            )}
            
            {bed.slots.length > 0 ? (
              <div>
                <strong style={{ fontSize: '0.8rem' }}>Slots:</strong>
                <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {bed.slots.map(slot => (
                    <div key={slot.id} style={{
                      backgroundColor: COLORS.slotBackground,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${COLORS.slotBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {slot.number}
                      </span>
                      {debugMode && (
                        <div style={{ fontSize: '0.6rem', color: COLORS.textSecondary, lineHeight: '1' }}>
                          ({slot.position.x},{slot.position.y}) {slot.size.width}×{slot.size.height}
                        </div>
                      )}
                      <button
                        onClick={() => onDeleteSlot(bed.id, slot.id)}
                        style={{
                          padding: '0.125rem 0.25rem',
                          backgroundColor: COLORS.danger,
                          color: 'white',
                          border: 'none',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          fontSize: '0.6rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.7rem', color: COLORS.textMuted, fontStyle: 'italic' }}>
                No slots yet.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
