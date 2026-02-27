/**
 * Enhanced cinematic analytics theme — deep navy with vibrant emerald, electric blue, and warm amber accents.
 * Optimized for beautiful visualizations with modern gradients and glow effects.
 */
export const chartTheme = {
  background: '#0f172a',
  surface: '#1e293b',
  border: 'rgba(148, 163, 184, 0.12)',
  grid: 'rgba(148, 163, 184, 0.08)',
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
  accent: {
    emerald: '#10b981', // Brighter emerald
    emeraldMuted: 'rgba(16, 185, 129, 0.6)',
    steelBlue: '#3b82f6', // Electric blue
    steelBlueMuted: 'rgba(59, 130, 246, 0.5)',
    amber: '#f59e0b', // Warm amber
    amberMuted: 'rgba(245, 158, 11, 0.5)',
    purple: '#8b5cf6', // Purple for variety
    purpleMuted: 'rgba(139, 92, 246, 0.5)',
  },
  semantic: {
    healthy: '#10b981',
    moderate: '#f59e0b',
    critical: '#ef4444',
    reuse: 'rgba(16, 185, 129, 0.25)',
    repurpose: 'rgba(245, 158, 11, 0.2)',
    recycle: 'rgba(239, 68, 68, 0.2)',
  },
  tooltip: {
    bg: 'rgba(15, 23, 42, 0.95)',
    border: 'rgba(148, 163, 184, 0.25)',
    text: '#e2e8f0',
  },
  referenceLine: {
    threshold: 'rgba(239, 68, 68, 0.7)',
    target: 'rgba(148, 163, 184, 0.4)',
  },
  gradient: {
    emerald: {
      start: 'rgba(16, 185, 129, 0.3)',
      end: 'rgba(16, 185, 129, 0.02)',
    },
    blue: {
      start: 'rgba(59, 130, 246, 0.3)',
      end: 'rgba(59, 130, 246, 0.02)',
    },
    amber: {
      start: 'rgba(245, 158, 11, 0.3)',
      end: 'rgba(245, 158, 11, 0.02)',
    },
    purple: {
      start: 'rgba(139, 92, 246, 0.3)',
      end: 'rgba(139, 92, 246, 0.02)',
    },
  },
} as const

export const CHART_HEIGHT = 280
export const GAUGE_HEIGHT = 220
export const SPARKLINE_HEIGHT = 32

/** Safe tooltip formatter: never throw on undefined/NaN */
export function formatTooltipValue(
  value: unknown,
  options: { decimals?: number; suffix?: string; prefix?: string } = {}
): string {
  const { decimals = 2, suffix = '', prefix = '' } = options
  if (value === null || value === undefined) return '–'
  const n = Number(value)
  if (!Number.isFinite(n)) return '–'
  return `${prefix}${n.toFixed(decimals)}${suffix}`
}
