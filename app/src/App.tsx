import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import GardenView from './components/GardenView'
import TimelineView from './components/TimelineView'
import PlantLibrary from './components/PlantLibrary'
import Navigation from './components/Navigation'
import { GardenProvider } from './context/GardenContext'

type View = 'garden' | 'timeline' | 'plants';

function App() {
  const [currentView, setCurrentView] = useState<View>('garden')

  return (
    <DndProvider backend={HTML5Backend}>
      <GardenProvider>
        <div className="app">
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
          <main className="main-content">
            {currentView === 'garden' && <GardenView />}
            {currentView === 'timeline' && <TimelineView />}
            {currentView === 'plants' && <PlantLibrary />}
          </main>
        </div>
      </GardenProvider>
    </DndProvider>
  )
}

export default App
