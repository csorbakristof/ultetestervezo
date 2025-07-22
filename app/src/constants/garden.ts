export const GRID_CELL_SIZE = 30;
export const MIN_GRID_SIZE = 3;
export const MAX_GRID_SIZE = 50;
export const WEEKS_PER_YEAR = 52;
export const MIN_WEEK = 1;
export const MAX_WEEK = 52;

export const COLORS = {
  // Grid and layout
  gridBackground: '#f8f9fa',
  gridBorder: '#e2e8f0',
  
  // Beds
  bedBackground: '#e6f3ff',
  bedBorder: '#0066cc',
  
  // Slots
  slotBackground: '#f0f8e6',
  slotBorder: '#4d9900',
  
  // Plants
  plantedBackground: '#c6f6d5',
  
  // Drawing preview
  bedPreview: '#cce5ff',
  slotPreview: '#d4f4dd',
  
  // Drag and drop
  dropZone: '#e2f8ff',
  dropTarget: '#3182ce',
  
  // UI elements
  primary: '#3182ce',
  success: '#38a169',
  danger: '#e53e3e',
  warning: '#f6ad55',
  info: '#0066cc',
  
  // Text
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#888'
} as const;
