const { ARCHETYPE_CATALOG } = require("../generated/roomArchetypes");

function pct(n, d) {
  if (!d) return 0;
  return Math.round((100 * n) / d);
}

function mean(values) {
  if (!values.length) return 0;
  const s = values.reduce((a, v) => a + v, 0);
  return s / values.length;
}

function sortedCopy(arr) {
  return [...arr].sort((a, b) => a - b);
}

function percentile(values, p) {
  if (!values.length) return 0;
  const s = sortedCopy(values);
  const idx = Math.min(s.length - 1, Math.floor((p / 100) * s.length));
  return s[idx];
}

function rollupByBeds(entries) {
  const m = {};
  for (const e of entries) {
    const b = e.beds || "?";
    if (!m[b]) m[b] = { beds: b, archetypes: 0, avgAdr: 0 };
    m[b].archetypes += 1;
    m[b].avgAdr += e.adrHint || 0;
  }
  return Object.values(m).map((r) => ({
    beds: r.beds,
    archetypes: r.archetypes,
    avgAdr: Math.round(r.avgAdr / r.archetypes)
  }));
}

function rollupByCompset(entries) {
  const m = {};
  for (const e of entries) {
    const c = e.compset ?? 0;
    if (!m[c]) m[c] = { compset: c, count: 0, adr: 0 };
    m[c].count += 1;
    m[c].adr += e.adrHint || 0;
  }
  return Object.values(m)
    .map((r) => ({
      compset: r.compset,
      count: r.count,
      avgAdr: Math.round(r.adr / r.count)
    }))
    .sort((a, b) => a.compset - b.compset);
}

function summarizeArchetypes() {
  const list = ARCHETYPE_CATALOG;
  const highAdr = list.filter((a) => a.adrHint > 160).length;
  const blackoutProne = list.filter((a) => Number(a.blackout) > 0.55).length;
  const heavyMaint = list.filter((a) => Number(a.maint) > 0.45).length;
  return {
    catalogSize: list.length,
    highAdrPct: pct(highAdr, list.length),
    blackoutPct: pct(blackoutProne, list.length),
    maintenancePct: pct(heavyMaint, list.length),
    rollup: rollupByBeds(list),
    compsetRollup: rollupByCompset(list)
  };
}

function segmentArchetypes(thresholds = { adr: 150, blackout: 0.5, maint: 0.4 }) {
  const list = ARCHETYPE_CATALOG;
  const premium = list.filter((a) => a.adrHint >= thresholds.adr);
  const risk = list.filter((a) => Number(a.blackout) >= thresholds.blackout);
  const opsHeavy = list.filter((a) => Number(a.maint) >= thresholds.maint);
  return {
    premiumCount: premium.length,
    riskCount: risk.length,
    opsHeavyCount: opsHeavy.length,
    overlapPremiumRisk: list.filter(
      (a) => a.adrHint >= thresholds.adr && Number(a.blackout) >= thresholds.blackout
    ).length
  };
}

function adrDistribution() {
  const hints = ARCHETYPE_CATALOG.map((a) => a.adrHint);
  return {
    min: Math.min(...hints),
    max: Math.max(...hints),
    mean: +mean(hints).toFixed(2),
    p50: percentile(hints, 50),
    p90: percentile(hints, 90)
  };
}

function topCompsets(limit = 6) {
  const roll = rollupByCompset(ARCHETYPE_CATALOG);
  return roll.slice(0, Math.min(limit, roll.length));
}

function mockWeekRevenueForecast(nights = 7) {
  const s = summarizeArchetypes();
  const baseAdr = s.rollup.reduce((a, x) => a + x.avgAdr, 0);
  const avgAcross = Math.round(baseAdr / Math.max(1, s.rollup.length));
  const trend = [];
  for (let i = 0; i < nights; i++) {
    const lift = ((i % 3) + 98) / 100;
    trend.push({ day: i + 1, adrLift: +(avgAcross * lift).toFixed(2) });
  }
  return { archetypeFacts: s, nightlyAdrGuess: avgAcross, nightly: trend };
}

function pacingBridgeReport() {
  const seg = segmentArchetypes();
  const dist = adrDistribution();
  const tops = topCompsets(8);
  return {
    generatedAt: new Date().toISOString(),
    segments: seg,
    adr: dist,
    leadingCompsets: tops,
    narrative:
      "Synthetic pacing bridge blends archetype ADR distribution with compset concentration for classroom drills."
  };
}

function exportSnapshotPayload() {
  return {
    archetypes: summarizeArchetypes(),
    segments: segmentArchetypes(),
    distrib: adrDistribution(),
    forecast: mockWeekRevenueForecast(14)
  };
}

function compareWeekendLift(weekendMultiplier = 1.12) {
  const base = mockWeekRevenueForecast(7);
  const lifted = base.nightly.map((n) => ({
    day: n.day,
    adrLift: +(n.adrLift * weekendMultiplier).toFixed(2)
  }));
  return { baseline: base.nightly, weekend: lifted };
}

module.exports = {
  summarizeArchetypes,
  mockWeekRevenueForecast,
  segmentArchetypes,
  adrDistribution,
  topCompsets,
  pacingBridgeReport,
  exportSnapshotPayload,
  compareWeekendLift
};
