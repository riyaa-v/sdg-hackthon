import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useMemo } from 'react'
import { chartTheme, formatTooltipValue } from '../../theme'
import type { SOHPoint } from '../../types/analysis'

type DegradationRateIndicatorProps = {
  sohData: SOHPoint[]
  degradationRateLabel?: string
}

function safeSOHPct(p: SOHPoint): number {
  const s = Number(p?.soh)
  return Number.isFinite(s) ? Math.max(0, Math.min(1, s)) * 100 : 0
}

/** Slope in % per cycle (negative = degradation) */
function slopePercentPerCycle(data: SOHPoint[]): number | null {
  if (data.length < 2) return null
  const points = data.map((d) => ({ cycle: Number(d?.cycle) || 0, sohPct: safeSOHPct(d) }))
  const n = points.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  for (const p of points) {
    sumX += p.cycle
    sumY += p.sohPct
    sumXY += p.cycle * p.sohPct
    sumX2 += p.cycle * p.cycle
  }
  const denom = n * sumX2 - sumX * sumX
  if (Math.abs(denom) < 1e-10) return null
  return (n * sumXY - sumX * sumY) / denom
}

export function DegradationRateIndicator({
  sohData,
  degradationRateLabel,
}: DegradationRateIndicatorProps) {
  const slopeVal = useMemo(() => slopePercentPerCycle(sohData ?? []), [sohData])
  const sparklineData = useMemo(() => {
    const arr = Array.isArray(sohData) ? sohData : []
    return arr.map((d) => ({
      cycle: Number(d?.cycle) ?? 0,
      sohPct: safeSOHPct(d),
    }))
  }, [sohData])

  const isAccelerating = slopeVal != null && slopeVal < -0.001
  const isStable = slopeVal != null && slopeVal >= -0.001 && slopeVal <= 0.001

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(139,92,246,0.1)]">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        Degradation rate analysis
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white">
            {slopeVal != null && Number.isFinite(slopeVal)
              ? formatTooltipValue(slopeVal, { decimals: 4 })
              : '–'}
            <span className="ml-2 text-sm font-normal text-white/60">%/cycle</span>
          </span>
          <span 
            className={`text-lg font-medium ${
              isAccelerating ? 'text-red-400' : isStable ? 'text-amber-400' : 'text-emerald-400'
            }`} 
            title={isAccelerating ? 'Accelerating degradation' : isStable ? 'Stable degradation' : 'Decelerating degradation'}
          >
            {isAccelerating ? '↓' : isStable ? '→' : '↑'}
          </span>
        </div>
        <div className="h-12 w-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <defs>
                <linearGradient id="degradationFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartTheme.gradient.purple.start} />
                  <stop offset="100%" stopColor={chartTheme.gradient.purple.end} />
                </linearGradient>
                <filter id="purpleGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Tooltip
                formatter={(value: unknown) => [formatTooltipValue(value, { decimals: 2, suffix: '%' }), 'SOH']}
                contentStyle={{
                  backgroundColor: chartTheme.tooltip.bg,
                  border: `1px solid ${chartTheme.tooltip.border}`,
                  borderRadius: 6,
                  fontSize: 11,
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Line
                type="monotone"
                dataKey="sohPct"
                stroke={chartTheme.accent.purple}
                strokeWidth={2}
                dot={false}
                filter="url(#purpleGlow)"
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span className="text-xs text-white/50">Accelerating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span className="text-xs text-white/50">Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-xs text-white/50">Decelerating</span>
        </div>
      </div>
      {degradationRateLabel && (
        <p className="mt-3 text-xs text-white/50 leading-relaxed bg-white/5 px-3 py-2 rounded-lg">
          {degradationRateLabel}
        </p>
      )}
    </div>
  )
}
