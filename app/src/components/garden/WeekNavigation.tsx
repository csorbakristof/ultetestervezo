import React from 'react';
import { WEEKS_PER_YEAR, MIN_WEEK, MAX_WEEK, COLORS } from '../../constants/garden';

interface WeekNavigationProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

const WeekNavigation = React.memo(function WeekNavigation({ currentWeek, onWeekChange }: WeekNavigationProps) {
  const goToPreviousWeek = () => {
    if (currentWeek > MIN_WEEK) {
      onWeekChange(currentWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeek < MAX_WEEK) {
      onWeekChange(currentWeek + 1);
    }
  };

  const handleDirectWeekInput = (week: number) => {
    if (week >= MIN_WEEK && week <= MAX_WEEK) {
      onWeekChange(week);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontWeight: 'bold' }}>Week:</span>
      <button
        onClick={goToPreviousWeek}
        disabled={currentWeek <= MIN_WEEK}
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: currentWeek <= MIN_WEEK ? '#f7fafc' : COLORS.primary,
          color: currentWeek <= MIN_WEEK ? '#a0a0a0' : 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: currentWeek <= MIN_WEEK ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem'
        }}
      >
        ◀
      </button>
      <input
        type="number"
        value={currentWeek}
        onChange={(e) => handleDirectWeekInput(parseInt(e.target.value) || 1)}
        min={MIN_WEEK}
        max={MAX_WEEK}
        style={{
          width: '60px',
          padding: '0.25rem',
          textAlign: 'center',
          border: `1px solid ${COLORS.gridBorder}`,
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}
      />
      <button
        onClick={goToNextWeek}
        disabled={currentWeek >= MAX_WEEK}
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: currentWeek >= MAX_WEEK ? '#f7fafc' : COLORS.primary,
          color: currentWeek >= MAX_WEEK ? '#a0a0a0' : 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: currentWeek >= MAX_WEEK ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem'
        }}
      >
        ▶
      </button>
      <span style={{ fontSize: '0.875rem', color: COLORS.textSecondary }}>
        / {WEEKS_PER_YEAR}
      </span>
    </div>
  );
});

export default WeekNavigation;
