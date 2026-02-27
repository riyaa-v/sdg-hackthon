import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo } from 'react'
import { chartTheme, formatTooltipValue } from '../../theme'
import type { TimeSeriesPoint } from '../../types/analysis'

const TEMP_RISK_THRESHOLD_C = 45

type TemperatureCurveProps = {
  data: TimeSeriesPoint[]
  thresholdC?: number
  height?: number
}

function safePoint(p: TimeSeriesPoint): { time: number; temp: number } {
  const t = Number(p?.Time ?? p?.time ?? 0)
  const v = Number(p?.value ?? 0)
  return { time: Number.isFinite(t) ? t : 0, temp: Number.isFinite(v) ? v : 0 }
}

export function TemperatureCurve({
  data,
  thresholdC = TEMP_RISK_THRESHOLD_C,
  height = 280,
}: TemperatureCurveProps) {
  const safeData = Array.isArray(data) ? data.map(safePoint) : []
  const maxTemp = useMemo(() => {
    if (safeData.length === 0) return 0
    return Math.max(...safeData.map((d) => d.temp), thresholdC)
  }, [safeData, thresholdC])
  const exceedsThreshold = safeData.some((d) => d.temp >= thresholdC)
  const lineColor = exceedsThreshold ? chartTheme.semantic.critical : chartTheme.accent.purple

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(139,92,246,0.1)]">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        Temperature vs time (last cycle)
      </div>
      <div className="text-sm text-white/70 leading-relaxed">
        Temperature (°C) with risk threshold at {thresholdC}°C. Line turns red when threshold is exceeded.
      </div>
      <div style={{ height }} className="mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <filter id="purpleGlow">
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
              dataKey="temp"
              type="number"
              domain={[0, maxTemp > 0 ? Math.ceil(maxTemp * 1.1) : 50]}
              stroke={chartTheme.text.secondary}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chartTheme.border }}
              tickFormatter={(v) => (Number.isFinite(v) ? `${v}°C` : '–')}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: chartTheme.text.secondary, fontSize: 11 }}
            />
            <ReferenceLine
              y={thresholdC}
              stroke={chartTheme.referenceLine.threshold}
              strokeDasharray="6 6"
              strokeWidth={1.5}
              label={{ value: `${thresholdC}°C risk`, fill: chartTheme.text.secondary, fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltip.bg,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: 8,
                fontSize: 12,
                backdropFilter: 'blur(8px)',
              }}
              formatter={(value: unknown) => [formatTooltipValue(value, { decimals: 1, suffix: ' °C' }), 'Temperature']}
              labelFormatter={(label) => `Time: ${formatTooltipValue(label, { decimals: 2, suffix: ' s' })}`}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke={lineColor}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
              filter="url(#purpleGlow)"
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
