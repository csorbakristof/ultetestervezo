import { Planting, Plant } from '../types';

export const hasPlantingOverlap = (
  existingPlantings: Planting[],
  startWeek: number,
  endWeek: number
): boolean => {
  return existingPlantings.some(planting => 
    (startWeek >= planting.startWeek && startWeek <= planting.endWeek) ||
    (endWeek >= planting.startWeek && endWeek <= planting.endWeek) ||
    (startWeek <= planting.startWeek && endWeek >= planting.endWeek)
  );
};

export const calculatePlantingPeriod = (startWeek: number, plant: Plant) => {
  const endWeek = startWeek + plant.growthDuration;
  return { startWeek, endWeek };
};

export const isPlantingActiveInWeek = (planting: Planting, week: number): boolean => {
  return week >= planting.startWeek && week <= planting.endWeek;
};

export const getActivePlantingForWeek = (plantings: Planting[], week: number): Planting | undefined => {
  return plantings.find(planting => isPlantingActiveInWeek(planting, week));
};

export const validateWeek = (week: number): boolean => {
  return week >= 1 && week <= 52;
};

export const formatWeekRange = (startWeek: number, endWeek: number): string => {
  return `Week ${startWeek}-${endWeek}`;
};
