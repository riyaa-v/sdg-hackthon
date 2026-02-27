import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, PolarAngleAxis } from 'recharts'
import { chartTheme, formatTooltipValue } from '../../theme'

const MAX_YEARS = 30
const GREEN_END = 66.67   // 20/30
const YELLOW_END = 33.33  // 10/30

type RULGaugeProps = {
  predictedRulYears: number
  height?: number
}

function gaugeColor(percent: number): string {
  if (percent >= GREEN_END) return chartTheme.semantic.healthy
  if (percent >= YELLOW_END) return chartTheme.semantic.moderate
  return chartTheme.semantic.critical
}

export function RULGauge({ predictedRulYears, height = 220 }: RULGaugeProps) {
  const safeYears = Number.isFinite(predictedRulYears) ? Math.max(0, predictedRulYears) : 0
  const clamped = Math.min(safeYears, MAX_YEARS)
  const percent = (clamped / MAX_YEARS) * 100
  const color = gaugeColor(percent)
  const data = [{ name: 'RUL', value: percent }]

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(16,185,129,0.1)]">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        Remaining useful life
      </div>
      <div style={{ height }} className="relative w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            startAngle={225}
            endAngle={-45}
            data={data}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              fill={color}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Tooltip
              formatter={(value: unknown) => [
                typeof value === 'number' && Number.isFinite(value)
                  ? `${formatTooltipValue((value / 100) * MAX_YEARS, { decimals: 1 })} years`
                  : '–',
                'RUL',
              ]}
              contentStyle={{
                backgroundColor: chartTheme.tooltip.bg,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: 8,
                fontSize: 12,
                backdropFilter: 'blur(8px)',
              }}
              labelStyle={{ display: 'none' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-white">
            {Number.isFinite(predictedRulYears) ? formatTooltipValue(predictedRulYears, { decimals: 1 }) : '–'}
          </span>
          <span className="text-xs text-white/60 mt-1">years</span>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-6 text-[10px] text-white/50">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          Healthy: &gt;20 y
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          Moderate: 10–20 y
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          Critical: &lt;10 y
        </span>
      </div>
    </div>
  )
}
