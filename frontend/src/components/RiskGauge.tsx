import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, PolarAngleAxis } from 'recharts'

type RiskGaugeProps = {
  riskLevel: string
}

export function RiskGauge({ riskLevel }: RiskGaugeProps) {
  const normalized = riskLevel.toLowerCase()

  let percent = 0
  let color = '#63b87f'
  let label = 'Unknown'

  if (normalized === 'low') {
    percent = 20
    color = '#22c55e'
    label = 'Low'
  } else if (normalized === 'medium') {
    percent = 60
    color = '#f97316'
    label = 'Medium'
  } else if (normalized === 'high') {
    percent = 90
    color = '#ef4444'
    label = 'High'
  }

  const data = [{ name: 'Risk', value: percent }]

  return (
    <div className="h-64 w-full rounded-2xl border border-white/12 bg-ink-2 p-4 sm:p-6">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">Risk level indicator</div>
      <div className="mt-2 text-sm text-white/70">Relative operational risk for this asset.</div>
      <div className="mt-4 h-40 sm:h-44">
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
              background={{ fill: '#1f2933' }}
              fill={color}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(0)}%`, 'Risk level']}
              contentStyle={{
                backgroundColor: '#020617',
                borderRadius: 8,
                border: '1px solid rgba(148,163,184,0.5)',
                fontSize: 12,
              }}
              labelStyle={{ display: 'none' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-lg font-semibold text-white">
        {label}
        {label !== 'Unknown' && (
          <span className="ml-2 text-sm font-normal text-white/70">{percent.toFixed(0)}% indicator</span>
        )}
      </div>
    </div>
  )
}

