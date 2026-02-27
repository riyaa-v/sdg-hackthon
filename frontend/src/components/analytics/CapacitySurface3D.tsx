import { useMemo, useState, useEffect, type ComponentType } from 'react'
import type { Trends } from '../../types/analysis'

type CapacitySurface3DProps = {
  trends: Trends | null | undefined
  height?: number
}

/** Build grid for Plotly surface: X = cycle, Y = temperature, Z[i][j] = capacity % at (x[j], y[i]) */
function buildSurfaceData(trends: Trends | null | undefined): {
  x: number[]
  y: number[]
  z: number[][]
} | null {
  if (!trends?.soh_trend?.length) return null
  const soh = trends.soh_trend
  const tempTrend = trends.temperature_trend ?? []
  const cycles = soh.map((p) => Number(p?.cycle)).filter(Number.isFinite)
  const temps = tempTrend.map((p) => Number(p?.value ?? p?.Time)).filter(Number.isFinite)
  if (cycles.length === 0) return null
  const yAxis = temps.length > 0 ? temps : [0]
  const getCapacityPct = (j: number): number => {
    const s = Number(soh[j]?.soh)
    return Number.isFinite(s) ? Math.max(0, Math.min(1, s)) * 100 : 0
  }
  const z: number[][] = yAxis.map(() => cycles.map((_, j) => getCapacityPct(j)))
  return { x: cycles, y: yAxis, z }
}

export function CapacitySurface3D({ trends, height = 360 }: CapacitySurface3DProps) {
  const surfaceData = useMemo(() => buildSurfaceData(trends), [trends])

  if (!surfaceData || surfaceData.z.length === 0) {
    return (
      <div className="w-full rounded-lg border border-[rgba(148,163,184,0.12)] bg-[#0f172a] p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Capacity vs cycle vs temperature (3D)
        </div>
        <div className="mt-4 flex h-64 items-center justify-center text-sm text-slate-500">
          No trend data available for 3D surface.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg border border-[rgba(148,163,184,0.12)] bg-[#0f172a] p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
        Capacity vs cycle vs temperature
      </div>
      <div className="text-sm text-slate-300">
        Surface: capacity (%) by cycle and temperature. Viridis color scale. Fixed camera.
      </div>
      <CapacitySurfacePlot data={surfaceData} height={height} />
    </div>
  )
}

function CapacitySurfacePlot({
  data,
  height,
}: {
  data: { x: number[]; y: number[]; z: number[][] }
  height: number
}) {
  const [Plot, setPlot] = useState<ComponentType<any> | null>(null)

  useEffect(() => {
    import('react-plotly.js').then((mod) => setPlot(() => mod.default))
  }, [])

  if (!Plot) {
    return <div style={{ height }} className="flex items-center justify-center text-slate-500 text-sm">Loading chart…</div>
  }

  const layout = {
    paper_bgcolor: '#0f172a',
    plot_bgcolor: '#0f172a',
    font: { color: '#94a3b8', size: 11 },
    margin: { t: 40, r: 40, b: 50, l: 50 },
    height,
    scene: {
      xaxis: {
        title: 'Cycle',
        gridcolor: 'rgba(148,163,184,0.12)',
        titlefont: { color: '#94a3b8' },
      },
      yaxis: {
        title: 'Temperature (°C)',
        gridcolor: 'rgba(148,163,184,0.12)',
        titlefont: { color: '#94a3b8' },
      },
      zaxis: {
        title: 'Capacity (%)',
        gridcolor: 'rgba(148,163,184,0.12)',
        titlefont: { color: '#94a3b8' },
      },
      camera: {
        eye: { x: 1.6, y: 1.4, z: 1.2 },
        center: { x: 0, y: 0, z: 0 },
      },
    },
  }

  const plotData = [
    {
      type: 'surface',
      x: data.x,
      y: data.y,
      z: data.z,
      colorscale: 'Viridis',
      showscale: true,
      colorbar: { title: 'Capacity (%)', titleside: 'right', tickfont: { color: '#94a3b8' } },
      hovertemplate: 'Cycle: %{x}<br>Temp: %{y}°C<br>Capacity: %{z:.1f}%<extra></extra>',
    },
  ]

  return (
    <div className="mt-3 w-full">
      <Plot
        data={plotData}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        }}
        style={{ width: '100%' }}
        useResizeHandler
      />
    </div>
  )
}
