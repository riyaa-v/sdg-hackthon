import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { UploadCard } from '../components/UploadCard'
import { DecisionBanner } from '../components/DecisionBanner'
import { MetricsGrid } from '../components/MetricsGrid'
import { RULGauge } from '../components/RULGauge'
import { RiskGauge } from '../components/RiskGauge'
import { SustainabilityCharts } from '../components/SustainabilityCharts'

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
  total_batteries: number
  results: BatteryResult[]
}

export function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<BatteryResult | null>(null)
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
      const response = await axios.post<AnalysisResponse>('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const battery = response.data.results?.[0]

      if (!battery) {
        setError('No valid battery data detected.')
        setAnalysisData(null)
        return
      }

      setAnalysisData(battery)
    } catch (err) {
      setError('Unable to run analysis. Please ensure the backend is running and the file format is valid.')
      setAnalysisData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!analysisData || !resultsRef.current) return

    window.scrollTo({
      top: resultsRef.current.offsetTop,
      behavior: 'smooth',
    })
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

      {/* Results dashboard */}
      <div ref={resultsRef} className="mx-auto max-w-6xl px-6 pb-20">
        {analysisData && (
          <>
            <section className="mt-16">
              <DecisionBanner recommendation={analysisData.deployment.recommendation} />
              <div className="mb-4 text-xs font-medium tracking-[0.24em] text-white/55">
                BATTERY INTELLIGENCE REPORT
              </div>
              <MetricsGrid
                predictedRulYears={analysisData.prediction.predicted_rul}
                grade={analysisData.deployment.grade}
                riskLevel={analysisData.deployment.risk_level}
                recommendation={analysisData.deployment.recommendation}
                confidenceScore={analysisData.prediction.confidence_score}
              />
            </section>

            {/* Sustainability metrics cards */}
            <section className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                {
                  label: 'Usable energy',
                  value: analysisData.sustainability.usable_energy_kwh,
                  unit: 'kWh',
                },
                {
                  label: 'CO₂ saved',
                  value: analysisData.sustainability.co2_saved_kg,
                  unit: 'kg',
                },
                {
                  label: 'Lithium saved',
                  value: analysisData.sustainability.lithium_saved_kg,
                  unit: 'kg',
                },
                {
                  label: 'Tree equivalent',
                  value: analysisData.sustainability.tree_equivalent,
                  unit: '',
                },
              ].map((item) => {
                const isZero = !item.value
                const valueDisplay = Number.isFinite(item.value) ? item.value.toFixed(1) : '–'
                return (
                  <div
                    key={item.label}
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isZero
                        ? 'border-white/10 bg-white/5 text-white/60'
                        : 'border-white/15 bg-white/5 text-white'
                    }`}
                  >
                    <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                      {item.label}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <div className="text-2xl font-semibold sm:text-3xl">{valueDisplay}</div>
                      {item.unit && (
                        <div className="text-xs text-white/60">
                          {item.unit}
                        </div>
                      )}
                    </div>
                    {isZero && (
                      <div className="mt-1 text-[11px] text-white/50">
                        No measurable impact in current scenario.
                      </div>
                    )}
                  </div>
                )
              })}
            </section>

            {/* Charts */}
            <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <RULGauge predictedRulYears={analysisData.prediction.predicted_rul} />
              <RiskGauge riskLevel={analysisData.deployment.risk_level} />
            </section>

            <section className="mt-10">
              <SustainabilityCharts
                usableEnergyKwh={analysisData.sustainability.usable_energy_kwh}
                co2SavedKg={analysisData.sustainability.co2_saved_kg}
                lithiumSavedKg={analysisData.sustainability.lithium_saved_kg}
              />
            </section>
          </>
        )}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/35 bg-red-950/40 p-5 text-sm text-red-100">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300/90">ANALYSIS ERROR</div>
            <p className="mt-2 text-sm">{error}</p>
            {file && (
              <button
                type="button"
                onClick={handleRunAnalysis}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-red-400/70 px-4 py-1.5 text-xs font-medium text-red-100 hover:bg-red-500/15"
              >
                Retry Analysis
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

