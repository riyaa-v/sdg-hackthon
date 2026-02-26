type DecisionBannerProps = {
  recommendation: string
}

export function DecisionBanner({ recommendation }: DecisionBannerProps) {
  const normalized = recommendation.toLowerCase()
  const isRecycle = normalized.includes('recycl')
  const isReuse = normalized.includes('reuse') || normalized.includes('second-life')

  if (!recommendation) return null

  if (isRecycle) {
    return (
      <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-900/20 px-5 py-4 text-sm text-red-100">
        <div className="text-xs font-semibold tracking-[0.18em] text-red-300/90">RECYCLE RECOMMENDED</div>
        <p className="mt-2 text-sm font-medium text-red-50">This asset does not meet reuse thresholds.</p>
        <p className="mt-1 text-xs text-red-100/80">{recommendation}</p>
      </div>
    )
  }

  if (isReuse) {
    return (
      <div className="mb-6 rounded-2xl border border-emerald-500/35 bg-emerald-900/15 px-5 py-4 text-sm text-emerald-50">
        <div className="text-xs font-semibold tracking-[0.18em] text-emerald-300/90">REUSE APPROVED</div>
        <p className="mt-2 text-sm font-medium text-emerald-50">
          This asset is suitable for second-life deployment based on current thresholds.
        </p>
        <p className="mt-1 text-xs text-emerald-100/80">{recommendation}</p>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-white/90">
      <div className="text-xs font-semibold tracking-[0.18em] text-white/60">RECOMMENDATION</div>
      <p className="mt-2 text-sm font-medium">{recommendation}</p>
    </div>
  )
}

