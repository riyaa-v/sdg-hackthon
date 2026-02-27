import { formatTooltipValue } from '../../theme'

type SustainabilityImpactCardsProps = {
  co2SavedKg: number
  usableEnergyKwh: number
  treeEquivalent: number
  lithiumSavedKg: number
  /** Extended lifecycle years from RUL / reuse */
  extendedLifecycleYears?: number
  /** Optional material recovery value (e.g. USD) */
  materialRecoveryValue?: number
}

const cardClass =
  'rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] backdrop-blur-xl p-6 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(16,185,129,0.1)] hover:border-white/20'

export function SustainabilityImpactCards({
  co2SavedKg,
  usableEnergyKwh,
  treeEquivalent,
  lithiumSavedKg,
  extendedLifecycleYears,
  materialRecoveryValue,
}: SustainabilityImpactCardsProps) {
  const safe = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className={cardClass}>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
          CO₂ avoided
        </div>
        <div className="mt-3 text-3xl font-bold text-white">
          {formatTooltipValue(safe(co2SavedKg), { decimals: 1 })}
          <span className="ml-2 text-sm font-normal text-white/60">kg</span>
        </div>
        <div className="mt-2 text-xs text-white/50 leading-relaxed">Estimated emissions avoided by reuse</div>
      </div>

      <div className={cardClass}>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
          Extended lifecycle
        </div>
        <div className="mt-3 text-3xl font-bold text-white">
          {extendedLifecycleYears != null && Number.isFinite(extendedLifecycleYears)
            ? formatTooltipValue(extendedLifecycleYears, { decimals: 1 })
            : '–'}
          <span className="ml-2 text-sm font-normal text-white/60">years</span>
        </div>
        <div className="mt-2 text-xs text-white/50 leading-relaxed">Estimated second-life duration</div>
      </div>

      <div className={cardClass}>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
          Usable energy
        </div>
        <div className="mt-3 text-3xl font-bold text-white">
          {formatTooltipValue(safe(usableEnergyKwh), { decimals: 1 })}
          <span className="ml-2 text-sm font-normal text-white/60">kWh</span>
        </div>
        <div className="mt-2 text-xs text-white/50 leading-relaxed">Modeled usable energy (reuse)</div>
      </div>

      <div className={cardClass}>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
          Material recovery
        </div>
        <div className="mt-3 text-3xl font-bold text-white">
          {materialRecoveryValue != null && Number.isFinite(materialRecoveryValue)
            ? formatTooltipValue(materialRecoveryValue, { decimals: 0, prefix: '$' })
            : `${formatTooltipValue(safe(lithiumSavedKg), { decimals: 1 })} kg Li`}
        </div>
        <div className="mt-2 text-xs text-white/50 leading-relaxed">
          {materialRecoveryValue != null
            ? 'Estimated recovery value'
            : `Lithium saved. Tree equivalent: ${safe(treeEquivalent)} trees`}
        </div>
      </div>
    </div>
  )
}
