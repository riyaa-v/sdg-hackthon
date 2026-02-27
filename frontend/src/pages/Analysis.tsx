import { useEffect, useRef, useState, Component, type ReactNode } from 'react'
import axios from 'axios'
import { UploadCard } from '../components/UploadCard'
import {
  CapacityDegradationCurve,
  VoltageCurve,
  TemperatureCurve,
  SOHCurve,
  RULGauge,
  RiskGauge,
  DeploymentDecisionCard,
  SustainabilityImpactCards,
  DegradationRateIndicator,
} from '../components/analytics'
import type { Trends } from '../types/analysis'

export type BatteryResult = {
  prediction: {
    predicted_rul: number
    confidence_score: number
  }
  deployment: {
    grade: string
    risk_level: string
    recommendation: string
  }
  sustainability: {
    usable_energy_kwh: number
    co2_saved_kg: number
    lithium_saved_kg: number
    tree_equivalent: number
  }
}

export type AnalysisResponse = {
  prediction: {
    predicted_rul: number
    confidence_score: number
  }
  deployment: {
    grade: string
    risk_level: string
    recommendation: string
  }
  sustainability: {
    usable_energy_kwh: number
    co2_saved_kg: number
    lithium_saved_kg: number
    tree_equivalent: number
  }
}

function toSafeNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function normalizeBatteryResult(raw: unknown): BatteryResult | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  let obj = r
  if (r.data != null && typeof r.data === 'object') obj = r.data as Record<string, unknown>
  const pred = obj.prediction as Record<string, unknown> | undefined
  const depl = obj.deployment as Record<string, unknown> | undefined
  const sust = obj.sustainability as Record<string, unknown> | undefined
  if (!pred || !depl || !sust) return null
  const grade = String(depl.grade ?? '')
  const riskLevel =
    depl.risk_level != null && String(depl.risk_level).trim() !== ''
      ? String(depl.risk_level)
      : grade === 'A'
        ? 'Low'
        : grade === 'B'
          ? 'Medium'
          : grade === 'C'
            ? 'High'
            : ''
  return {
    prediction: {
      predicted_rul: toSafeNumber(pred.predicted_rul),
      confidence_score: toSafeNumber(pred.confidence_score),
    },
    deployment: {
      grade,
      risk_level: riskLevel,
      recommendation: String(depl.recommendation ?? depl.recommended_use ?? ''),
    },
    sustainability: {
      usable_energy_kwh: toSafeNumber(sust.usable_energy_kwh),
      co2_saved_kg: toSafeNumber(sust.co2_saved_kg),
      lithium_saved_kg: toSafeNumber(sust.lithium_saved_kg),
      tree_equivalent: toSafeNumber(sust.tree_equivalent),
    },
  }
}

type ErrorBoundaryProps = { children: ReactNode; fallback?: ReactNode }

class ResultsErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Analysis results render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="mt-16 rounded-2xl border border-amber-500/40 bg-amber-900/20 p-6 text-amber-50">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/90">Display error</div>
          <p className="mt-2 text-sm">Results could not be displayed. The analysis may have completed; check the browser console for details.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<BatteryResult | null>(null)
  const [fullResponse, setFullResponse] = useState<Record<string, unknown> | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  const handleFileSelect = (nextFile: File | null) => {
    if (!nextFile) {
      setFile(null)
      return
    }

    if (!nextFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.')
      setFile(null)
      return
    }

    setError(null)
    setFile(nextFile)
  }

  const handleRunAnalysis = async () => {
    if (!file) {
      setError('Please upload a CSV file before running analysis.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setError(null)

    try {
      const API_BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const response = await axios.post<AnalysisResponse>(
  `${API_BASE}/predict`,
  formData
)


      const battery = normalizeBatteryResult(raw)

      if (!battery) {
        setError('No valid battery data detected.')
        setAnalysisData(null)
        setFullResponse(null)
        return
      }

      setAnalysisData(battery)
      const payload =
        raw != null &&
        typeof raw === 'object' &&
        'data' in raw &&
        raw.data != null &&
        typeof raw.data === 'object'
          ? (raw as { data: Record<string, unknown> }).data
          : (raw as Record<string, unknown>)
      setFullResponse(payload)
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data && typeof err.response.data === 'object' && 'error' in err.response.data
          ? String((err.response.data as { error: unknown }).error)
          : 'Unable to run analysis. Please ensure the backend is running and the file format is valid.'
      setError(message)
      setAnalysisData(null)
      setFullResponse(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!analysisData || !resultsRef.current) return
    const el = resultsRef.current
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [analysisData])

  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Full-screen hero with background video */}
      <section className="relative min-h-screen overflow-hidden">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover -z-20"
          src="/videos/video3.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.75),rgba(0,0,0,0.9))] -z-10" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 pt-28 pb-16">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] p-10 text-left shadow-[0_30px_120px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
              Analyze Battery Telemetry
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Upload a CSV file to generate remaining useful life, fire risk, and reuse recommendations from the S2S
              analysis engine.
            </p>

            <div className="mt-7">
              <UploadCard
                file={file}
                loading={loading}
                error={error}
                onFileSelect={handleFileSelect}
                onRunAnalysis={handleRunAnalysis}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results dashboard — cinematic analytics */}
      <div ref={resultsRef} className="relative min-h-screen">
        {/* Background video and gradient overlay */}
        <div className="absolute inset-0">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover -z-20"
            src="/videos/video3.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.85),rgba(0,0,0,0.95))] -z-10" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(99,184,127,0.03),transparent_60%)] -z-10" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 min-h-[400px]">
          {analysisData && (
          <ResultsErrorBoundary>
            <>
            <section className="pt-16 pb-8">
              <h2 className="s2s-fade-up text-sm font-medium uppercase tracking-[0.28em] text-white/60" style={{ animationDelay: '100ms' }}>
                Battery intelligence report
              </h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="s2s-fade-up" style={{ animationDelay: '200ms' }}>
                  <DeploymentDecisionCard
                    recommendation={analysisData.deployment.recommendation}
                    grade={analysisData.deployment.grade}
                    confidenceScore={analysisData.prediction.confidence_score}
                  />
                </div>
                <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 s2s-fade-up" style={{ animationDelay: '300ms' }}>
                  <RULGauge predictedRulYears={analysisData.prediction.predicted_rul} />
                  <RiskGauge riskLevel={analysisData.deployment.risk_level} />
                </div>
              </div>
            </section>

            <section className="py-12 border-t border-white/10 s2s-fade-up" style={{ animationDelay: '400ms' }}>
              <SustainabilityImpactCards
                co2SavedKg={analysisData.sustainability.co2_saved_kg}
                usableEnergyKwh={analysisData.sustainability.usable_energy_kwh}
                treeEquivalent={analysisData.sustainability.tree_equivalent}
                lithiumSavedKg={analysisData.sustainability.lithium_saved_kg}
                extendedLifecycleYears={analysisData.prediction.predicted_rul}
              />
            </section>

            {/* Charts: always show when we have results; use trends from API or empty */}
            {(() => {
              const trends = (fullResponse?.trends ?? {}) as Trends
              const sohTrend = trends?.soh_trend ?? []
              const voltageTrend = trends?.voltage_trend ?? []
              const tempTrend = trends?.temperature_trend ?? []
              const capacityPctData = sohTrend.map((p) => ({
                cycle: Number(p?.cycle) ?? 0,
                capacityPct: (Number(p?.soh) ?? 0) * 100,
              }))
              return (
                <>
                  <section className="py-12 border-t border-white/10 s2s-fade-up" style={{ animationDelay: '500ms' }}>
                    <DegradationRateIndicator
                      sohData={sohTrend}
                      degradationRateLabel={(fullResponse?.analysis as { degradation_rate?: string })?.degradation_rate}
                    />
                  </section>

                  <section className="py-12 border-t border-white/10 grid gap-8 lg:grid-cols-2 s2s-fade-up" style={{ animationDelay: '600ms' }}>
                    <CapacityDegradationCurve data={capacityPctData} />
                    <SOHCurve data={sohTrend} />
                  </section>

                  <section className="py-12 border-t border-white/10 grid gap-8 lg:grid-cols-2 s2s-fade-up" style={{ animationDelay: '700ms' }}>
                    <VoltageCurve data={voltageTrend} />
                    <TemperatureCurve data={tempTrend} />
                  </section>
                </>
              )
            })()}
            </>
          </ResultsErrorBoundary>
        )}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/35 bg-red-950/40 backdrop-blur-xl p-5 text-sm text-red-100 shadow-[0_20px_60px_rgba(196,80,80,0.15)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300/90">ANALYSIS ERROR</div>
            <p className="mt-2 text-sm">{error}</p>
            {file && (
              <button
                type="button"
                onClick={handleRunAnalysis}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-red-400/70 px-4 py-1.5 text-xs font-medium text-red-100 hover:bg-red-500/15 transition-colors"
              >
                Retry Analysis
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </main>
  )
}

