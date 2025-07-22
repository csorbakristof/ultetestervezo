interface NavigationProps {
  currentView: 'garden' | 'timeline' | 'plants';
  onViewChange: (view: 'garden' | 'timeline' | 'plants') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <h1 style={{ margin: 0, color: 'white' }}>Garden Planner</h1>
      <button
        className={`nav-button ${currentView === 'garden' ? 'active' : ''}`}
        onClick={() => onViewChange('garden')}
      >
        Garden View
      </button>
      <button
        className={`nav-button ${currentView === 'timeline' ? 'active' : ''}`}
        onClick={() => onViewChange('timeline')}
      >
        Timeline View
      </button>
      <button
        className={`nav-button ${currentView === 'plants' ? 'active' : ''}`}
        onClick={() => onViewChange('plants')}
      >
        Plant Library
      </button>
    </nav>
  );
}
