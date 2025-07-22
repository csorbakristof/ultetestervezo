import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { Plant } from '../context/GardenContext';

export default function Storage() {
  const { state, dispatch } = useGarden();
  const [importText, setImportText] = useState('');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Show message for 3 seconds
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Export garden setup to JSON
  const exportGardenSetup = () => {
    try {
      const gardenData = {
        garden: state.garden,
        plants: state.plants,
        currentWeek: state.currentWeek
      };
      
      const dataStr = JSON.stringify(gardenData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${state.garden.name.replace(/\s+/g, '_')}_garden_setup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      showMessage('success', 'Garden setup exported successfully!');
    } catch (error) {
      showMessage('error', 'Failed to export garden setup');
      console.error('Export error:', error);
    }
  };

  // Import garden setup from JSON
  const importGardenSetup = () => {
    try {
      if (!importText.trim()) {
        showMessage('error', 'Please paste garden setup data');
        return;
      }

      const data = JSON.parse(importText);
      
      // Check if it's a plant-only JSON file
      if (data.plants && Array.isArray(data.plants) && !data.garden) {
        // Plant-only JSON import
        let importedCount = 0;
        data.plants.forEach((plant: Plant) => {
          if (plant.name && plant.image) {
            dispatch({ type: 'ADD_PLANT', payload: plant });
            importedCount++;
          }
        });
        setImportText('');
        showMessage('success', `Imported ${importedCount} plants from JSON!`);
        return;
      }
      
      // Complete garden setup validation
      if (!data.garden || !data.plants) {
        showMessage('error', 'Invalid garden setup format - must contain "garden" and "plants" properties');
        return;
      }

      // Update the garden state
      dispatch({ type: 'UPDATE_GARDEN', payload: data.garden });
      
      // Clear existing plants and add imported ones
      state.plants.forEach(plant => {
        dispatch({ type: 'DELETE_PLANT', payload: plant.name });
      });
      
      data.plants.forEach((plant: Plant) => {
        dispatch({ type: 'ADD_PLANT', payload: plant });
      });

      // Set current week if provided
      if (data.currentWeek) {
        dispatch({ type: 'SET_CURRENT_WEEK', payload: data.currentWeek });
      }

      setImportText('');
      showMessage('success', 'Garden setup imported successfully!');
    } catch (error) {
      showMessage('error', 'Failed to import garden setup - invalid JSON format');
      console.error('Import error:', error);
    }
  };

  // Export plants to CSV
  const exportPlantsCSV = () => {
    try {
      const headers = [
        'name', 'image', 'plantingMonths', 'harvestMonths', 'waterNeed', 
        'sunNeed', 'incompatiblePlants', 'companionPlants', 'growthDuration',
        'spacingCm', 'plantFamily', 'season', 'successionInterval'
      ];
      
      const csvContent = [
        headers.join(','),
        ...state.plants.map(plant => 
          headers.map(header => {
            const value = plant[header as keyof Plant];
            if (Array.isArray(value)) {
              return `"${value.join(';')}"`;
            }
            return `"${value}"`;
          }).join(',')
        )
      ].join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plants_database.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      showMessage('success', 'Plants database exported to CSV!');
    } catch (error) {
      showMessage('error', 'Failed to export plants to CSV');
      console.error('CSV export error:', error);
    }
  };

  // Import plants from CSV
  const importPlantsCSV = () => {
    try {
      if (!importText.trim()) {
        showMessage('error', 'Please paste CSV data');
        return;
      }

      const lines = importText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        showMessage('error', 'CSV must have header and at least one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const dataLines = lines.slice(1);

      let importedCount = 0;
      dataLines.forEach(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        if (values.length === headers.length) {
          const plant: Partial<Plant> = {};
          
          headers.forEach((header, index) => {
            const value = values[index];
            if (header === 'plantingMonths' || header === 'harvestMonths' || 
                header === 'incompatiblePlants' || header === 'companionPlants') {
              plant[header as keyof Plant] = value.split(';').map(v => 
                header.includes('Months') ? parseInt(v.trim()) : v.trim()
              ) as any;
            } else if (header === 'waterNeed' || header === 'sunNeed' || 
                      header === 'growthDuration' || header === 'spacingCm' || 
                      header === 'successionInterval') {
              plant[header as keyof Plant] = parseInt(value) as any;
            } else {
              plant[header as keyof Plant] = value as any;
            }
          });

          if (plant.name && plant.image) {
            dispatch({ type: 'ADD_PLANT', payload: plant as Plant });
            importedCount++;
          }
        }
      });

      setImportText('');
      showMessage('success', `Imported ${importedCount} plants from CSV!`);
    } catch (error) {
      showMessage('error', 'Failed to import plants from CSV');
      console.error('CSV import error:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Storage & Data Management</h2>

      {/* Message display */}
      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      {/* Export Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h3>Export Data</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Export Format: 
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
              style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
            >
              <option value="json">Complete Garden Setup (JSON)</option>
              <option value="csv">Plants Database (CSV)</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={exportGardenSetup}
            disabled={exportFormat !== 'json'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: exportFormat === 'json' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: exportFormat === 'json' ? 'pointer' : 'not-allowed'
            }}
          >
            Export Garden Setup (JSON)
          </button>
          
          <button
            onClick={exportPlantsCSV}
            disabled={exportFormat !== 'csv'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: exportFormat === 'csv' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: exportFormat === 'csv' ? 'pointer' : 'not-allowed'
            }}
          >
            Export Plants Database (CSV)
          </button>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Garden Setup (JSON):</strong> Complete garden layout, beds, slots, plantings, and plant library</p>
          <p><strong>Plants Database (CSV):</strong> Plant library only, useful for sharing plant collections</p>
        </div>
      </section>

      {/* Import Section */}
      <section>
        <h3>Import Data</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Import Format: 
            <select 
              value={importFormat} 
              onChange={(e) => setImportFormat(e.target.value as 'json' | 'csv')}
              style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
            >
              <option value="json">Garden Setup or Plants (JSON)</option>
              <option value="csv">Plants Database (CSV)</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Upload File: 
            <input
              type="file"
              accept={importFormat === 'json' ? '.json' : '.csv'}
              onChange={handleFileUpload}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Or paste data directly:
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={importFormat === 'json' 
                ? 'Paste JSON garden setup data here...' 
                : 'Paste CSV plant data here (with headers)...'}
              style={{
                width: '100%',
                height: '200px',
                marginTop: '0.5rem',
                padding: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={importGardenSetup}
            disabled={importFormat !== 'json'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: importFormat === 'json' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: importFormat === 'json' ? 'pointer' : 'not-allowed'
            }}
          >
            Import JSON Data
          </button>
          
          <button
            onClick={importPlantsCSV}
            disabled={importFormat !== 'csv'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: importFormat === 'csv' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: importFormat === 'csv' ? 'pointer' : 'not-allowed'
            }}
          >
            Import Plants Database (CSV)
          </button>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>JSON Import Options:</strong></p>
          <ul style={{ marginLeft: '1rem' }}>
            <li><strong>Complete Garden Setup:</strong> JSON with "garden" and "plants" properties - replaces entire garden</li>
            <li><strong>Plants Only:</strong> JSON with just "plants" array - adds plants to existing library</li>
          </ul>
          <p><strong>Note:</strong> Plant-only imports add to your existing library without affecting garden layout.</p>
        </div>
      </section>

      {/* Current Data Info */}
      <section style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Current Garden Data</h4>
        <ul style={{ margin: 0 }}>
          <li>Garden: {state.garden.name} ({state.garden.gridSize.width}×{state.garden.gridSize.height})</li>
          <li>Beds: {state.garden.beds.length}</li>
          <li>Slots: {state.garden.beds.reduce((total, bed) => total + bed.slots.length, 0)}</li>
          <li>Plants in Library: {state.plants.length}</li>
          <li>Current Week: {state.currentWeek}</li>
        </ul>
      </section>
    </div>
  );
}
