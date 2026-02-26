type MetricsGridProps = {
  predictedRulYears: number
  grade: string
  riskLevel: string
  recommendation: string
  confidenceScore: number
}

export function MetricsGrid({
  predictedRulYears,
  grade,
  riskLevel,
  recommendation,
  confidenceScore,
}: MetricsGridProps) {
  const formattedRul = Number.isFinite(predictedRulYears) ? predictedRulYears.toFixed(1) : '–'

  const normalizedRisk = riskLevel.toLowerCase()
  let riskClasses =
    'border-white/15 bg-white/5 text-white'
  if (normalizedRisk === 'low') {
    riskClasses = 'border-emerald-400/40 bg-emerald-900/20 text-emerald-50'
  } else if (normalizedRisk === 'medium') {
    riskClasses = 'border-amber-400/40 bg-amber-900/20 text-amber-50'
  } else if (normalizedRisk === 'high') {
    riskClasses = 'border-red-400/45 bg-red-900/25 text-red-50'
  }

  const confidenceText =
    confidenceScore === 0 || !Number.isFinite(confidenceScore)
      ? 'Confidence data unavailable'
      : `Confidence: ${(confidenceScore * 100).toFixed(0)}%`

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
          Remaining useful life
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <div className="text-2xl font-semibold text-white sm:text-3xl">{formattedRul}</div>
          <div className="text-xs text-white/60">years</div>
        </div>
        <div className="mt-2 text-xs text-white/55">{confidenceText}</div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">Grade</div>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            {grade || '–'}
          </span>
        </div>
      </div>

      <div className={`rounded-2xl border p-4 sm:p-5 ${riskClasses}`}>
        <div className="text-xs font-medium uppercase tracking-[0.16em]">Risk level</div>
        <div className="mt-3 text-lg font-semibold sm:text-xl">{riskLevel || '–'}</div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">Recommendation</div>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {recommendation || '–'}
          </span>
        </div>
      </div>
    </div>
  )
}


