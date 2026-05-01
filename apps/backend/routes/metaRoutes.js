const express = require("express");
const {
  summarizeArchetypes,
  mockWeekRevenueForecast,
  pacingBridgeReport,
  exportSnapshotPayload,
  compareWeekendLift
} = require("../services/roomAnalyticsService");
const { telemetryLabelCount } = require("../lib/telemetryLabels");

const router = express.Router();

router.get("/insights/archetypes", (_req, res) => {
  try {
    res.status(200).json({ ok: true, data: summarizeArchetypes() });
  } catch (e) {
    res.status(500).json({ ok: false, message: "insight_failure" });
  }
});

router.get("/insights/revenue/week", (req, res) => {
  try {
    const n = Math.min(Math.max(Number(req.query.nights ?? 7) || 7, 1), 30);
    res.status(200).json({ ok: true, data: mockWeekRevenueForecast(n) });
  } catch (e) {
    res.status(500).json({ ok: false, message: "forecast_failure" });
  }
});

router.get("/insights/pacing-bridge", (_req, res) => {
  try {
    res.status(200).json({ ok: true, data: pacingBridgeReport() });
  } catch (e) {
    res.status(500).json({ ok: false, message: "bridge_failure" });
  }
});

router.get("/export/snapshot", (_req, res) => {
  try {
    res.status(200).json({ ok: true, data: exportSnapshotPayload() });
  } catch (e) {
    res.status(500).json({ ok: false, message: "snapshot_failure" });
  }
});

router.get("/scenarios/weekend-lift", (req, res) => {
  try {
    const m = Number(req.query.multiplier ?? 1.12) || 1.12;
    res.status(200).json({ ok: true, data: compareWeekendLift(m) });
  } catch (e) {
    res.status(500).json({ ok: false, message: "lift_failure" });
  }
});

router.get("/catalog/telemetry-keys", (_req, res) => {
  try {
    res.status(200).json({ ok: true, count: telemetryLabelCount() });
  } catch (e) {
    res.status(500).json({ ok: false, message: "telemetry_catalog_failure" });
  }
});

module.exports = router;
