import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartTheme, formatTooltipValue } from '../../theme'
import type { CapacityPctPoint } from '../../types/analysis'

const CAPACITY_THRESHOLD_PCT = 80

type CapacityDegradationCurveProps = {
  data: CapacityPctPoint[]
  height?: number
}

function safeCapacityPct(p: { capacityPct?: unknown }): number {
  const n = Number(p?.capacityPct)
  return Number.isFinite(n) ? n : 0
}

export function CapacityDegradationCurve({ data, height = 280 }: CapacityDegradationCurveProps) {
  const safeData = Array.isArray(data)
    ? data.map((d) => ({ cycle: Number(d?.cycle) || 0, capacityPct: safeCapacityPct(d) }))
    : []

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(16,185,129,0.1)]">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        Capacity Degradation Curve
      </div>
      <div className="text-sm text-white/70 leading-relaxed">Capacity (%) vs cycle count with gradient visualization. Reference at 80% EOL threshold.</div>
      <div style={{ height }} className="mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={safeData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="capacityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartTheme.gradient.emerald.start} />
                <stop offset="100%" stopColor={chartTheme.gradient.emerald.end} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={true} horizontal={true} />
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
              dataKey="capacityPct"
              type="number"
              domain={[0, 100]}
              stroke={chartTheme.text.secondary}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chartTheme.border }}
              tickFormatter={(v) => (Number.isFinite(v) ? `${v}%` : '–')}
              label={{ value: 'Capacity (%)', angle: -90, position: 'insideLeft', fill: chartTheme.text.secondary, fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltip.bg,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: 8,
                fontSize: 12,
                backdropFilter: 'blur(8px)',
              }}
              labelStyle={{ color: chartTheme.tooltip.text }}
              formatter={(value: unknown) => [formatTooltipValue(value, { decimals: 1, suffix: '%' }), 'Capacity']}
              labelFormatter={(label) => `Cycle ${formatTooltipValue(label, { decimals: 0 })}`}
            />
            <ReferenceLine
              y={CAPACITY_THRESHOLD_PCT}
              stroke={chartTheme.referenceLine.threshold}
              strokeDasharray="6 6"
              strokeWidth={1.5}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={() => 'Capacity (%)'}
              iconType="line"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="capacityPct"
              fill="url(#capacityFill)"
              stroke="none"
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="capacityPct"
              stroke={chartTheme.accent.emerald}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: chartTheme.accent.emerald, stroke: '#fff', strokeWidth: 2 }}
              filter="url(#glow)"
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
