import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type SustainabilityChartsProps = {
  usableEnergyKwh: number
  co2SavedKg: number
  lithiumSavedKg: number
}

export function SustainabilityCharts({
  usableEnergyKwh,
  co2SavedKg,
  lithiumSavedKg,
}: SustainabilityChartsProps) {
  const data = [
    { name: 'CO₂ Saved (kg)', value: co2SavedKg },
    { name: 'Lithium Saved (kg)', value: lithiumSavedKg },
    { name: 'Usable Energy (kWh)', value: usableEnergyKwh },
  ]

  return (
    <div className="h-72 w-full rounded-2xl border border-white/12 bg-ink-2 p-4 sm:p-6">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">Sustainability profile</div>
      <div className="mt-2 text-sm text-white/70">
        Modeled sustainability outcomes for this asset. Values of zero indicate no measurable impact in the current
        scenario.
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#1f2b27" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#1f2b27' }}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#1f2b27' }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderRadius: 8,
                border: '1px solid rgba(148,163,184,0.5)',
                fontSize: 12,
              }}
              labelStyle={{ color: '#e2e8f0', marginBottom: 4 }}
            />
            <Bar dataKey="value" fill="#63b87f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

