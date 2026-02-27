/** Single point for capacity degradation (cycle → capacity or %) */
export type CapacityPoint = { cycle: number; capacity: number }

/** SOH trend: cycle → soh ratio 0–1 */
export type SOHPoint = { cycle: number; soh: number }

/** Time-series point (e.g. voltage or temperature in last cycle) */
export type TimeSeriesPoint = { Time?: number; time?: number; value: number }

/** Normalized for charts: cycle + capacityPct (0–100) */
export type CapacityPctPoint = { cycle: number; capacityPct: number }

/** Trends payload from API */
export type Trends = {
  capacity_trend?: Array<{ cycle: number; Capacity?: number }>
  soh_trend?: SOHPoint[]
  voltage_trend?: TimeSeriesPoint[]
  temperature_trend?: TimeSeriesPoint[]
}

export type AnalysisMeta = {
  degradation_rate?: string
  health_status?: string
}

export type Thresholds = {
  eol_capacity?: number
}
