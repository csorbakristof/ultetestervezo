import { useState, useEffect, useCallback } from 'react';
import { Position, DrawingMode } from '../../../types/ui';

interface UseDrawingProps {
  editorMode: boolean;
}

export function useDrawing({ editorMode }: UseDrawingProps) {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<Position | null>(null);
  const [drawEnd, setDrawEnd] = useState<Position | null>(null);

  // Reset drawing mode when editor mode is disabled
  useEffect(() => {
    if (!editorMode) {
      setDrawingMode('none');
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
    }
  }, [editorMode]);

  const startDrawing = useCallback((x: number, y: number) => {
    if (drawingMode !== 'none') {
      setIsDrawing(true);
      setDrawStart({ x, y });
      setDrawEnd({ x, y });
    }
  }, [drawingMode]);

  const updateDrawing = useCallback((x: number, y: number) => {
    if (isDrawing && drawStart) {
      setDrawEnd({ x, y });
    }
  }, [isDrawing, drawStart]);

  const finishDrawing = useCallback((x: number, y: number) => {
    if (isDrawing && drawStart && drawingMode !== 'none') {
      const result = {
        mode: drawingMode,
        start: drawStart,
        end: { x, y },
        selectedBedId
      };
      
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
      setDrawingMode('none');
      
      return result;
    }
    return null;
  }, [isDrawing, drawStart, drawingMode, selectedBedId]);

  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
    setDrawingMode('none');
  }, []);

  const drawPreview = isDrawing && drawStart && drawEnd ? { start: drawStart, end: drawEnd } : undefined;

  return {
    drawingMode,
    setDrawingMode,
    selectedBedId,
    setSelectedBedId,
    isDrawing,
    drawPreview,
    startDrawing,
    updateDrawing,
    finishDrawing,
    cancelDrawing
  };
}
