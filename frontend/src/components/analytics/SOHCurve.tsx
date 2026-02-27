import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo } from 'react'
import { chartTheme, formatTooltipValue } from '../../theme'
import type { SOHPoint } from '../../types/analysis'

type SOHCurveProps = {
  data: SOHPoint[]
  height?: number
}

function safeSOH(p: SOHPoint): { cycle: number; soh: number; sohPct: number } {
  const c = Number(p?.cycle ?? 0)
  const s = Number(p?.soh ?? 0)
  const soh = Number.isFinite(s) ? Math.max(0, Math.min(1, s)) : 0
  return { cycle: Number.isFinite(c) ? c : 0, soh, sohPct: soh * 100 }
}

/** Simple linear regression slope (sohPct per cycle) for trend indicator */
function slope(data: { cycle: number; sohPct: number }[]): number | null {
  if (data.length < 2) return null
  const n = data.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  for (const d of data) {
    sumX += d.cycle
    sumY += d.sohPct
    sumXY += d.cycle * d.sohPct
    sumX2 += d.cycle * d.cycle
  }
  const denom = n * sumX2 - sumX * sumX
  if (Math.abs(denom) < 1e-10) return null
  return (n * sumXY - sumX * sumY) / denom
}

export function SOHCurve({ data, height = 280 }: SOHCurveProps) {
  const safeData = Array.isArray(data) ? data.map(safeSOH) : []
  const slopeVal = useMemo(() => slope(safeData), [safeData])

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(59,130,246,0.1)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">State of health (SOH)</span>
        {slopeVal != null && Number.isFinite(slopeVal) && (
          <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full">
            Trend: {slopeVal >= 0 ? '↑' : '↓'} {formatTooltipValue(slopeVal, { decimals: 4 })} %/cycle
          </span>
        )}
      </div>
      <div className="text-sm text-white/70 leading-relaxed">SOH (%) with gradient fill and trend analysis. Negative slope indicates degradation.</div>
      <div style={{ height }} className="mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={safeData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sohFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartTheme.gradient.blue.start} />
                <stop offset="100%" stopColor={chartTheme.gradient.blue.end} />
              </linearGradient>
              <filter id="blueGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey="cycle"
              type="number"
              stroke={chartTheme.text.secondary}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chartTheme.border }}
              label={{ value: 'Cycle number', position: 'insideBottom', offset: -4, fill: chartTheme.text.secondary, fontSize: 11 }}
            />
            <YAxis
              dataKey="sohPct"
              type="number"
              domain={[0, 100]}
              stroke={chartTheme.text.secondary}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chartTheme.border }}
              tickFormatter={(v) => (Number.isFinite(v) ? `${v}%` : '–')}
              label={{ value: 'SOH (%)', angle: -90, position: 'insideLeft', fill: chartTheme.text.secondary, fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltip.bg,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: 8,
                fontSize: 12,
                backdropFilter: 'blur(8px)',
              }}
              formatter={(value: unknown) => [formatTooltipValue(value, { decimals: 2, suffix: '%' }), 'SOH']}
              labelFormatter={(label) => `Cycle ${formatTooltipValue(label, { decimals: 0 })}`}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} formatter={() => 'SOH (%)'} iconType="line" iconSize={8} />
            <Area
              type="monotone"
              dataKey="sohPct"
              fill="url(#sohFill)"
              stroke="none"
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="sohPct"
              stroke={chartTheme.accent.steelBlue}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: chartTheme.accent.steelBlue, stroke: '#fff', strokeWidth: 2 }}
              filter="url(#blueGlow)"
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
