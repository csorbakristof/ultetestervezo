export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DrawPreview {
  start: Position;
  end: Position;
}

export type DrawingMode = 'none' | 'bed' | 'slot';

export interface GridCellBorders {
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
}
