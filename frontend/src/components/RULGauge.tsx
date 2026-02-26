import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, PolarAngleAxis } from 'recharts'

type RULGaugeProps = {
  predictedRulYears: number
}

export function RULGauge({ predictedRulYears }: RULGaugeProps) {
  const maxYears = 30
  const clamped = Math.max(0, Math.min(predictedRulYears, maxYears))
  const percent = (clamped / maxYears) * 100

  const data = [{ name: 'RUL', value: percent }]

  return (
    <div className="h-64 w-full rounded-2xl border border-white/12 bg-ink-2 p-4 sm:p-6">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">Remaining useful life</div>
      <div className="mt-2 text-sm text-white/70">Estimate out of {maxYears} years horizon.</div>
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
              fill="#63b87f"
            />
            <Tooltip
              formatter={(value: number) => [`${((value / 100) * maxYears).toFixed(1)} years`, 'RUL']}
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
      <div className="mt-2 text-center text-2xl font-semibold text-white">
        {Number.isFinite(predictedRulYears) ? predictedRulYears.toFixed(1) : '–'}{' '}
        <span className="text-sm font-normal text-white/70">years</span>
      </div>
    </div>
  )
}

