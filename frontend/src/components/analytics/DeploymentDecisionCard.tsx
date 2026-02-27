
type DecisionType = 'reuse' | 'repurpose' | 'recycle'

type DeploymentDecisionCardProps = {
  recommendation: string
  grade: string
  confidenceScore: number
}

function resolveDecision(recommendation: string, grade: string): DecisionType {
  const r = recommendation.toLowerCase()
  if (r.includes('recycl')) return 'recycle'
  if (r.includes('backup') || r.includes('ups') || grade === 'B') return 'repurpose'
  return 'reuse'
}

const decisionConfig: Record<
  DecisionType,
  { label: string; borderClass: string; bgClass: string; textClass: string; glowClass: string }
> = {
  reuse: {
    label: 'Reuse',
    borderClass: 'border-emerald-500/50',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    glowClass: 'shadow-[0_20px_60px_rgba(16,185,129,0.2)]',
  },
  repurpose: {
    label: 'Repurpose',
    borderClass: 'border-amber-500/50',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    glowClass: 'shadow-[0_20px_60px_rgba(245,158,11,0.2)]',
  },
  recycle: {
    label: 'Recycle',
    borderClass: 'border-red-500/50',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    glowClass: 'shadow-[0_20px_60px_rgba(239,68,68,0.2)]',
  },
}

export function DeploymentDecisionCard({
  recommendation,
  grade,
  confidenceScore,
}: DeploymentDecisionCardProps) {
  const decision = resolveDecision(recommendation, grade)
  const config = decisionConfig[decision]
  const confidencePct =
    Number.isFinite(confidenceScore) && confidenceScore >= 0 && confidenceScore <= 1
      ? Math.round(confidenceScore * 100)
      : null

  return (
    <div
      className={`rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${config.borderClass} ${config.bgClass} ${config.glowClass}`}
    >
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
        Deployment decision
      </div>
      <div className={`mt-3 text-2xl font-bold ${config.textClass}`}>
        {config.label}
      </div>
      {confidencePct != null && (
        <div className="mt-3 text-sm text-white/70">
          Confidence: <span className="font-medium text-white">{confidencePct}%</span>
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed text-white/70">
        {recommendation || 'No recommendation available.'}
      </p>
    </div>
  )
}
