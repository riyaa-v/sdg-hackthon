import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartTheme, formatTooltipValue } from '../../theme'
import type { TimeSeriesPoint } from '../../types/analysis'

type VoltageCurveProps = {
  data: TimeSeriesPoint[]
  height?: number
}

function safePoint(p: TimeSeriesPoint): { time: number; voltage: number } {
  const t = Number(p?.Time ?? p?.time ?? 0)
  const v = Number(p?.value ?? 0)
  return { time: Number.isFinite(t) ? t : 0, voltage: Number.isFinite(v) ? v : 0 }
}

export function VoltageCurve({ data, height = 280 }: VoltageCurveProps) {
  const safeData = Array.isArray(data) ? data.map(safePoint) : []

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(245,158,11,0.1)]">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        Voltage curve (last cycle)
      </div>
      <div className="text-sm text-white/70 leading-relaxed">Voltage (V) vs time with smooth interpolation and enhanced visualization.</div>
      <div style={{ height }} className="mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <filter id="amberGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey="time"
              type="number"
              stroke={chartTheme.text.secondary}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chartTheme.border }}
              label={{ value: 'Time (s)', position: 'insideBottom', offset: -4, fill: chartTheme.text.secondary, fontSize: 11 }}
            />
            <YAxis
              dataKey="voltage"
              type="number"
              stroke={chartTheme.text.secondary}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chartTheme.border }}
              label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: chartTheme.text.secondary, fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltip.bg,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: 8,
                fontSize: 12,
                backdropFilter: 'blur(8px)',
              }}
              formatter={(value: unknown) => [formatTooltipValue(value, { decimals: 3, suffix: ' V' }), 'Voltage']}
              labelFormatter={(label) => `Time: ${formatTooltipValue(label, { decimals: 2, suffix: ' s' })}`}
            />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke={chartTheme.accent.amber}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: chartTheme.accent.amber, stroke: '#fff', strokeWidth: 2 }}
              filter="url(#amberGlow)"
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
