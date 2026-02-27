import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, PolarAngleAxis } from 'recharts'
import { chartTheme, formatTooltipValue } from '../../theme'

type RiskGaugeProps = {
  riskLevel: string
  height?: number
}

function percentAndColor(riskLevel: string): { percent: number; color: string; label: string } {
  const normalized = riskLevel.toLowerCase()
  if (normalized === 'low') return { percent: 25, color: chartTheme.semantic.healthy, label: 'Low' }
  if (normalized === 'medium') return { percent: 55, color: chartTheme.semantic.moderate, label: 'Medium' }
  if (normalized === 'high') return { percent: 90, color: chartTheme.semantic.critical, label: 'High' }
  return { percent: 0, color: chartTheme.text.muted, label: 'Unknown' }
}

export function RiskGauge({ riskLevel, height = 220 }: RiskGaugeProps) {
  const { percent, color, label } = percentAndColor(riskLevel)
  const data = [{ name: 'Risk', value: percent }]

  return (
    <div className="w-full rounded-lg border border-[rgba(148,163,184,0.12)] bg-[#0f172a] p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
        Risk level
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
              cornerRadius={6}
              background={{ fill: chartTheme.surface }}
              fill={color}
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
            />
            <Tooltip
              formatter={(value: unknown) => [
                typeof value === 'number' && Number.isFinite(value) ? `${formatTooltipValue(value, { decimals: 0 })}%` : '–',
                'Risk',
              ]}
              contentStyle={{
                backgroundColor: chartTheme.tooltip.bg,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: 6,
                fontSize: 12,
              }}
              labelStyle={{ display: 'none' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-semibold text-slate-100">{label}</span>
        </div>
      </div>
    </div>
  )
}
