import type { BattleArrowPreset, BattlePhase, BattlePreset } from '../data/battlePresets'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3
    ? normalized
        .split('')
        .map((char) => char + char)
        .join('')
    : normalized

  const value = Number.parseInt(full, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`
}

function mixHex(base: string, target: string, amount: number) {
  const sourceRgb = hexToRgb(base)
  const targetRgb = hexToRgb(target)
  return rgbToHex(
    sourceRgb.r + (targetRgb.r - sourceRgb.r) * amount,
    sourceRgb.g + (targetRgb.g - sourceRgb.g) * amount,
    sourceRgb.b + (targetRgb.b - sourceRgb.b) * amount,
  )
}

export function getSequentialShade(baseColor: string, index: number, total: number) {
  if (total <= 1) return baseColor
  const ratio = index / (total - 1)
  const lightenAmount = 0.5 - ratio * 0.2
  const darkenAmount = ratio * 0.28
  const lightened = mixHex(baseColor, '#ffffff', clamp(lightenAmount, 0, 0.6))
  return mixHex(lightened, '#000000', clamp(darkenAmount, 0, 0.35))
}

export function getBattlePhaseSequence(battle: BattlePreset) {
  return battle.phases ?? []
}

export function getPhaseColorForArrow(battle: BattlePreset, arrow: BattleArrowPreset) {
  const force = battle.forces.find((entry) => entry.id === arrow.forceId)
  if (!force) return '#ffd166'
  if (!arrow.phaseId || !battle.phases?.length) return force.color

  const relatedPhases = battle.phases.filter((phase) =>
    battle.arrows.some((entry) => entry.forceId === arrow.forceId && entry.phaseId === phase.id),
  )

  const index = relatedPhases.findIndex((phase) => phase.id === arrow.phaseId)
  if (index === -1) return force.color

  return getSequentialShade(force.color, index, relatedPhases.length)
}

export function getPhaseColorForPanel(
  battle: BattlePreset,
  phase: BattlePhase,
  phaseIndex: number,
) {
  const arrow = battle.arrows.find((entry) => entry.phaseId === phase.id)
  if (!arrow) return phase.color
  const force = battle.forces.find((entry) => entry.id === arrow.forceId)
  if (!force) return phase.color

  const relatedPhases = battle.phases?.filter((entry) =>
    battle.arrows.some((candidate) => candidate.forceId === arrow.forceId && candidate.phaseId === entry.id),
  ) ?? [phase]

  const index = relatedPhases.findIndex((entry) => entry.id === phase.id)
  if (index === -1) return getSequentialShade(force.color, phaseIndex, battle.phases?.length ?? 1)

  return getSequentialShade(force.color, index, relatedPhases.length)
}
