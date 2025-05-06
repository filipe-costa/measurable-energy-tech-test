export type CarbonIntensity = {
  id: number;
  from: string;
  to: string;
  actual: number;
  forecast: number;
  index: IntensityIndex;
};

export enum IntensityIndex {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  VERY_HIGH = "very high",
}
