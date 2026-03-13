import React, { useState } from 'react';

const storage = {
  set: (key, value) => localStorage.setItem(key, value),
  get: (key) => ({ value: localStorage.getItem(key) }),
  list: (prefix) => ({ keys: Object.keys(localStorage).filter(k => k.startsWith(prefix)) }),
};

const KPI_SECTIONS = [
  {
    id: "energy",
    label: "Energy",
    icon: "⚡",
    color: "var(--hc-teal)",
    kpis: [
      { id: "it_power", name: "Total installed IT power demand", unit: "kW" },
      { id: "total_energy", name: "Total energy consumption", unit: "kWh" },
      { id: "it_energy", name: "IT equipment energy consumption", unit: "kWh" },
      { id: "cooling_energy", name: "Cooling system energy", unit: "kWh" },
      { id: "lighting", name: "Lighting energy", unit: "kWh" },
      { id: "ups", name: "UPS losses", unit: "kWh" },
      { id: "generator", name: "Backup generator energy use", unit: "kWh" },
      { id: "renewable_total", name: "Total renewable energy consumed", unit: "kWh" },
      { id: "renewable_ppa", name: "Renewable energy via PPA", unit: "kWh" },
      { id: "renewable_onsite", name: "On-site renewable energy", unit: "kWh" },
    ],
  },
  {
    id: "efficiency",
    label: "Efficiency",
    icon: "📊",
    color: "var(--hc-mint)",
    kpis: [
      { id: "pue", name: "PUE — Power Usage Effectiveness", unit: "ratio", key: true },
      { id: "wue", name: "WUE — Water Usage Effectiveness", unit: "L/kWh" },
      { id: "erf", name: "ERF — Energy Reuse Factor", unit: "ratio", key: true },
      { id: "ref", name: "REF — Renewable Energy Factor", unit: "ratio" },
      { id: "temp_setpoint", name: "Supply air temperature set point", unit: "°C" },
      { id: "cooling_degree_days", name: "Cooling degree days", unit: "CDD" },
      { id: "full_load_hours", name: "Full load hours", unit: "hrs/yr" },
    ],
  },
  {
    id: "water",
    label: "Water & Heat",
    icon: "💧",
    color: "var(--hc-amber)",
    kpis: [
      { id: "water_input", name: "Total water input", unit: "m³" },
      { id: "waste_heat_reused", name: "Waste heat reused / exported", unit: "kWh", key: true },
      { id: "waste_heat_temp", name: "Average waste heat temperature", unit: "°C" },
      { id: "heat_destination", name: "Heat export destination", unit: "name/type" },
    ],
  },
  {
    id: "facility",
    label: "Facility",
    icon: "🏢",
    color: "var(--hc-text-2)",
    kpis: [
      { id: "floor_area", name: "Data centre floor area", unit: "m²" },
      { id: "it_capacity", name: "Total installed IT capacity", unit: "kW" },
      { id: "data_volume", name: "Total data stored and processed", unit: "TB" },
    ],
  },
];

const ALL_KPIS = KPI_SECTIONS.flatMap((s) => s.kpis.map((k) => ({ ...k, section: s.id })));
const TOTAL_KPIS = ALL_KPIS.length;

export default function EEDAudit() {
  const [screen, setScreen] = useState("landing");
  const [step, setStep] = useState(0);
  const [facility, setFacility] = useState({
    operator: "", site: "", country: "", capacity: "",
    hasGermany: "", submitted2024: "", hasOwner: "", hasBMS: "", hasHeatReuse: "",
  });
  const [kpiData, setKpiData] = useState({});
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", role: "" });
  const [signal, setSignal] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const STEPS = [
    { label: "Facility Details", icon: "🏢" },
    ...KPI_SECTIONS.map((s) => ({ label: s.label + " KPIs", icon: s.icon })),
  ];

  const setKpiStatus = (kpiId, status) => {
    setKpiData((prev) => ({
      ...prev,
      [kpiId]: { ...prev[kpiId], status: prev[kpiId]?.status === status ? null : status },
    }));
  };
  const setKpiNote = (kpiId, note) => {
    setKpiData((prev) => ({ ...prev, [kpiId]: { ...prev[kpiId], note } }));
  };

  const haveCount = ALL_KPIS.filter((k) => kpiData[k.id]?.status === "have").length;
  const estCount = ALL_KPIS.filter((k) => kpiData[k.id]?.status === "est").length;
  const missCount = ALL_KPIS.filter((k) => kpiData[k.id]?.status === "miss").length;
  const scoredCount = haveCount + estCount + missCount;
  const readinessScore = scoredCount > 0 ? Math.round(((haveCount + estCount * 0.5) / TOTAL_KPIS) * 100) : 0;
  const haveP = Math.round((haveCount / TOTAL_KPIS) * 100);
  const estP = Math.round((estCount / TOTAL_KPIS) * 100);
  const missP = Math.round((missCount / TOTAL_KPIS) * 100);
  const missingKPIs = ALL_KPIS.filter((k) => kpiData[k.id]?.status === "miss");
  const scoreColor = readinessScore >= 70 ? "#059669" : readinessScore >= 40 ? "#D97706" : "#DC2626";

  const loadAdmin = () => {
    setLoadingAdmin(true);
    try {
      const { keys } = storage.list("eed-submission:");
      const all = keys.map(key => {
        try {
          const { value } = storage.get(key);
          return value ? JSON.parse(value) : null;
        } catch { return null; }
      }).filter(Boolean);
      all.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
      setSubmissions(all);
    } catch {
      setSubmissions([]);
    }
    setLoadingAdmin(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const submission = {
      id: Date.now().toString(),
      submittedAt: Date.now(),
      facility,
      contactInfo,
      kpiData,
      signal,
      scores: { readinessScore, haveCount, estCount, missCount, scoredCount },
    };
    try {
      storage.set(`eed-submission:${submission.id}`, JSON.stringify(submission));
    } catch {}
    setIsSubmitting(false);
    setScreen("success");
  };

  const resetAll = () => {
    setScreen("landing");
    setStep(0);
    setFacility({ operator:"",site:"",country:"",capacity:"",hasGermany:"",submitted2024:"",hasOwner:"",hasBMS:"",hasHeatReuse:"" });
    setKpiData({});
    setContactInfo({ name:"",email:"",role:"" });
    setSignal("");
  };

  return (
    <div className="hc-eed-platform">

      {/* LANDING */}
      {screen === "landing" && (
        <div className="hc-eed-landing">
          <div className="hc-eed-landing-eyebrow">FREE — NO COMMITMENT</div>
          <h1 className="hc-eed-landing-title">
            Know exactly where you<br />stand on <span>EED compliance</span>
          </h1>
          <p className="hc-eed-landing-subtitle">
            The EU Energy Efficiency Directive requires 2,000+ data centres to report 24 energy KPIs annually.
            This 15-minute audit tells you which data you have, what's missing, and what your regulatory exposure is.
          </p>

          <div className="hc-eed-landing-stats">
            <div className="hc-eed-stat-card" style={{ borderLeftColor: "#DC2626" }}>
              <div className="hc-eed-stat-num" style={{ color: "#DC2626" }}>70%</div>
              <div className="hc-eed-stat-label">Non-compliance rate</div>
              <div className="hc-eed-stat-sub">First EED reporting round, 2024</div>
            </div>
            <div className="hc-eed-stat-card" style={{ borderLeftColor: "#D97706" }}>
              <div className="hc-eed-stat-num" style={{ color: "#D97706" }}>85%</div>
              <div className="hc-eed-stat-label">Hit technical issues</div>
              <div className="hc-eed-stat-sub">Trying to submit their data</div>
            </div>
            <div className="hc-eed-stat-card" style={{ borderLeftColor: "var(--hc-teal)" }}>
              <div className="hc-eed-stat-num" style={{ color: "var(--hc-teal-light)" }}>15 May</div>
              <div className="hc-eed-stat-label">Next EU deadline</div>
              <div className="hc-eed-stat-sub">Germany: 31 March 2026</div>
            </div>
          </div>

          <div className="hc-eed-landing-what">
            <h3>WHAT YOU GET IN 15 MINUTES</h3>
            <div className="hc-eed-what-grid">
              <div className="hc-eed-what-item"><div className="hc-eed-what-dot"/><div className="hc-eed-what-text">Data inventory across all 24 EED KPIs — scored red, amber, or green</div></div>
              <div className="hc-eed-what-item"><div className="hc-eed-what-dot"/><div className="hc-eed-what-text">PUE, WUE, ERF and REF readiness check using EU Delegated Regulation criteria</div></div>
              <div className="hc-eed-what-item"><div className="hc-eed-what-dot"/><div className="hc-eed-what-text">Regulatory gap analysis — which rules apply to your facility and when</div></div>
              <div className="hc-eed-what-item"><div className="hc-eed-what-dot"/><div className="hc-eed-what-text">A written readiness report delivered within 2–3 weeks. Free, no commitment.</div></div>
            </div>
          </div>

          <div>
            <button className="hc-eed-btn-start" onClick={() => { setScreen("form"); setStep(0); }}>
              Start the audit →
            </button>
            <button className="hc-eed-btn-start-secondary" onClick={() => { setScreen("admin"); loadAdmin(); }}>
              View submissions
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      {screen === "form" && (
        <div className="hc-eed-form-layout">
          {/* Sidebar */}
          <div className="hc-eed-sidebar">
            <div className="hc-eed-sidebar-label">AUDIT STEPS</div>
            {STEPS.map((s, i) => {
              const sectionKpis = i === 0 ? [] : KPI_SECTIONS[i - 1].kpis;
              const sectionDone = i === 0
                ? !!(facility.operator && facility.country)
                : sectionKpis.every((k) => kpiData[k.id]?.status);
              return (
                <div
                  key={i}
                  className={`hc-eed-sidebar-step ${step === i ? "active" : ""} ${sectionDone && step !== i ? "done" : ""}`}
                  onClick={() => setStep(i)}
                >
                  <span className="hc-eed-step-icon">{s.icon}</span>
                  <span className="hc-eed-step-name">{s.label}</span>
                  {sectionDone && step !== i && <span className="hc-eed-step-check">✓</span>}
                </div>
              );
            })}
            <div style={{ marginTop: 8 }}>
              <div
                className={`hc-eed-sidebar-step ${step === STEPS.length ? "active" : ""}`}
                onClick={() => setStep(STEPS.length)}
              >
                <span className="hc-eed-step-icon">📋</span>
                <span className="hc-eed-step-name">Results & Submit</span>
              </div>
            </div>

            <div className="hc-eed-score-widget">
              <div className="hc-eed-score-title">LIVE READINESS SCORE</div>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 42, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: scoreColor }}>{readinessScore}%</span>
                <div style={{ fontSize: 10, color: "var(--hc-text-3)", marginTop: 2 }}>{scoredCount}/{TOTAL_KPIS} KPIs scored</div>
              </div>
              <div className="hc-eed-score-bars">
                <div className="hc-eed-sbar-row">
                  <span className="hc-eed-sbar-label" style={{ color: "#059669" }}>✓ Have</span>
                  <div className="hc-eed-sbar-bg"><div className="hc-eed-sbar-fill" style={{ width: haveP + "%", background: "#059669" }}/></div>
                  <span className="hc-eed-sbar-pct" style={{ color: "#059669" }}>{haveP}%</span>
                </div>
                <div className="hc-eed-sbar-row">
                  <span className="hc-eed-sbar-label" style={{ color: "#D97706" }}>△ Est.</span>
                  <div className="hc-eed-sbar-bg"><div className="hc-eed-sbar-fill" style={{ width: estP + "%", background: "#D97706" }}/></div>
                  <span className="hc-eed-sbar-pct" style={{ color: "#D97706" }}>{estP}%</span>
                </div>
                <div className="hc-eed-sbar-row">
                  <span className="hc-eed-sbar-label" style={{ color: "#DC2626" }}>✗ Miss</span>
                  <div className="hc-eed-sbar-bg"><div className="hc-eed-sbar-fill" style={{ width: missP + "%", background: "#DC2626" }}/></div>
                  <span className="hc-eed-sbar-pct" style={{ color: "#DC2626" }}>{missP}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div style={{ overflowY: "auto" }}>
            {/* STEP 0 — Facility */}
            {step === 0 && (
              <div className="hc-eed-form-main">
                <div className="hc-eed-form-header">
                  <div className="hc-eed-form-eyebrow">STEP 1 OF {STEPS.length + 1}</div>
                  <h2 className="hc-eed-form-title">Facility Details</h2>
                  <p className="hc-eed-form-subtitle">Basic information about your data centre. Used to determine which regulations apply to you.</p>
                </div>
                <div className="hc-eed-field-grid">
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Organisation name</label>
                    <input className="hc-eed-field-input" placeholder="Your company name" value={facility.operator} onChange={e => setFacility(p => ({...p, operator: e.target.value}))} />
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Facility / site name</label>
                    <input className="hc-eed-field-input" placeholder="e.g. Oslo DC1, Frankfurt Campus" value={facility.site} onChange={e => setFacility(p => ({...p, site: e.target.value}))} />
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Country / countries of operation</label>
                    <input className="hc-eed-field-input" placeholder="e.g. Norway, Germany, France" value={facility.country} onChange={e => setFacility(p => ({...p, country: e.target.value}))} />
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Total installed IT capacity (kW)</label>
                    <input className="hc-eed-field-input" type="number" placeholder="e.g. 2400" value={facility.capacity} onChange={e => setFacility(p => ({...p, capacity: e.target.value}))} />
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Do you operate in Germany?</label>
                    <select className="hc-eed-field-select" value={facility.hasGermany} onChange={e => setFacility(p => ({...p, hasGermany: e.target.value}))}>
                      <option value="">Select...</option>
                      <option value="yes-500">Yes — over 500kW (EnEfG + EED apply)</option>
                      <option value="yes-300">Yes — 300–500kW (EnEfG only)</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Did you submit 2024 EED data (May 2025)?</label>
                    <select className="hc-eed-field-select" value={facility.submitted2024} onChange={e => setFacility(p => ({...p, submitted2024: e.target.value}))}>
                      <option value="">Select...</option>
                      <option value="yes-time">Yes — submitted on time</option>
                      <option value="yes-late">Yes — submitted late</option>
                      <option value="no">No — did not submit</option>
                      <option value="unsure">Unsure</option>
                    </select>
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">Do you have an internal EED owner?</label>
                    <select className="hc-eed-field-select" value={facility.hasOwner} onChange={e => setFacility(p => ({...p, hasOwner: e.target.value}))}>
                      <option value="">Select...</option>
                      <option value="yes-dedicated">Yes — dedicated person</option>
                      <option value="yes-shared">Yes — shared responsibility</option>
                      <option value="no">No — nobody owns it</option>
                      <option value="unknown">Unknown internally</option>
                    </select>
                  </div>
                  <div className="hc-eed-field-group">
                    <label className="hc-eed-field-label">BMS / DCIM system</label>
                    <select className="hc-eed-field-select" value={facility.hasBMS} onChange={e => setFacility(p => ({...p, hasBMS: e.target.value}))}>
                      <option value="">Select...</option>
                      <option value="schneider">Schneider Electric EcoStruxure</option>
                      <option value="vertiv">Vertiv Trellis</option>
                      <option value="other-dcim">Other DCIM system</option>
                      <option value="bms-only">Basic BMS only</option>
                      <option value="manual">Manual metering only</option>
                    </select>
                  </div>
                  <div className="hc-eed-field-group full">
                    <label className="hc-eed-field-label">Waste heat reuse infrastructure</label>
                    <select className="hc-eed-field-select" value={facility.hasHeatReuse} onChange={e => setFacility(p => ({...p, hasHeatReuse: e.target.value}))}>
                      <option value="">Select...</option>
                      <option value="active">Active heat export in place</option>
                      <option value="partial">Partial recovery</option>
                      <option value="none">No heat reuse — all heat wasted</option>
                      <option value="planning">Planning stage</option>
                    </select>
                  </div>
                </div>
                <div className="hc-eed-form-nav">
                  <button className="hc-eed-btn-next" onClick={() => setStep(1)}>Next: Energy KPIs →</button>
                </div>
              </div>
            )}

            {/* STEPS 1–4 — KPI Sections */}
            {step >= 1 && step <= KPI_SECTIONS.length && (() => {
              const sec = KPI_SECTIONS[step - 1];
              return (
                <div className="hc-eed-form-main">
                  <div className="hc-eed-form-header">
                    <div className="hc-eed-form-eyebrow">STEP {step + 1} OF {STEPS.length + 1}</div>
                    <h2 className="hc-eed-form-title">{sec.icon} {sec.label} KPIs</h2>
                    <p className="hc-eed-form-subtitle">
                      For each metric: mark <strong>✓ Have</strong> if you have metered data, <strong>△ Est.</strong> if you estimate it, or <strong>✗ Miss</strong> if you don't collect it.
                    </p>
                  </div>
                  <div className="hc-eed-kpi-section-card">
                    <div className="hc-eed-kpi-section-head" style={{ borderLeft: `3px solid ${sec.color}` }}>
                      <span className="hc-eed-kpi-section-icon">{sec.icon}</span>
                      <span className="hc-eed-kpi-section-label">{sec.label.toUpperCase()}</span>
                      <span className="hc-eed-kpi-section-count">{sec.kpis.length} KPIs</span>
                    </div>
                    {sec.kpis.map((kpi) => (
                      <div className="hc-eed-kpi-row" key={kpi.id}>
                        <div>
                          <span className={`hc-eed-kpi-name-text${kpi.key ? " key-kpi" : ""}`}>{kpi.name}</span>
                          <span className="hc-eed-kpi-unit-tag">{kpi.unit}</span>
                        </div>
                        <div className="hc-eed-status-btns">
                          <button className={`hc-eed-s-btn${kpiData[kpi.id]?.status === "have" ? " have" : ""}`} onClick={() => setKpiStatus(kpi.id, "have")}>✓ Have</button>
                          <button className={`hc-eed-s-btn${kpiData[kpi.id]?.status === "est" ? " est" : ""}`} onClick={() => setKpiStatus(kpi.id, "est")}>△ Est.</button>
                          <button className={`hc-eed-s-btn${kpiData[kpi.id]?.status === "miss" ? " miss" : ""}`} onClick={() => setKpiStatus(kpi.id, "miss")}>✗ Miss</button>
                        </div>
                        <input className="hc-eed-kpi-note" placeholder="Value or note..." value={kpiData[kpi.id]?.note || ""} onChange={(e) => setKpiNote(kpi.id, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div className="hc-eed-form-nav">
                    <button className="hc-eed-btn-back" onClick={() => setStep(step - 1)}>← Back</button>
                    <button className="hc-eed-btn-next" onClick={() => setStep(step + 1)}>
                      {step < KPI_SECTIONS.length ? `Next: ${KPI_SECTIONS[step].label} →` : "View Results →"}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* STEP 5 — Results */}
            {step === STEPS.length && (
              <div className="hc-eed-results-wrap">
                <div className="hc-eed-form-header">
                  <div className="hc-eed-form-eyebrow">YOUR RESULTS</div>
                  <h2 className="hc-eed-form-title">EED Readiness Report</h2>
                  <p className="hc-eed-form-subtitle">Based on your responses across all 24 KPIs. Submit below to receive a full written analysis.</p>
                </div>

                <div className="hc-eed-results-score-hero">
                  <div>
                    <div className="hc-eed-big-score-num" style={{ color: scoreColor }}>{readinessScore}%</div>
                    <div className="hc-eed-big-score-label">READINESS SCORE</div>
                  </div>
                  <div className="hc-eed-score-detail">
                    <div className="hc-eed-score-detail-row">
                      <span className="hc-eed-score-d-label" style={{ color: "#059669" }}>✓ Have it</span>
                      <div className="hc-eed-score-d-bar-bg"><div className="hc-eed-score-d-fill" style={{ width: haveP + "%", background: "#059669" }}/></div>
                      <span className="hc-eed-score-d-count" style={{ color: "#059669" }}>{haveCount} KPIs</span>
                    </div>
                    <div className="hc-eed-score-detail-row">
                      <span className="hc-eed-score-d-label" style={{ color: "#D97706" }}>△ Estimated</span>
                      <div className="hc-eed-score-d-bar-bg"><div className="hc-eed-score-d-fill" style={{ width: estP + "%", background: "#D97706" }}/></div>
                      <span className="hc-eed-score-d-count" style={{ color: "#D97706" }}>{estCount} KPIs</span>
                    </div>
                    <div className="hc-eed-score-detail-row">
                      <span className="hc-eed-score-d-label" style={{ color: "#DC2626" }}>✗ Missing</span>
                      <div className="hc-eed-score-d-bar-bg"><div className="hc-eed-score-d-fill" style={{ width: missP + "%", background: "#DC2626" }}/></div>
                      <span className="hc-eed-score-d-count" style={{ color: "#DC2626" }}>{missCount} KPIs</span>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 13, color: "var(--hc-text-2)", fontStyle: "italic" }}>
                      {readinessScore >= 70 ? "Good data coverage — focus on calculation accuracy and submission workflow."
                       : readinessScore >= 40 ? "Mixed readiness — gaps in key metrics could cause submission failures."
                       : "Significant gaps detected — high risk of non-compliance without intervention."}
                    </div>
                  </div>
                </div>

                <div className="hc-eed-findings-grid">
                  <div className="hc-eed-finding-card" style={{ borderLeftColor: "#059669" }}>
                    <div className="hc-eed-finding-label">STRONGEST AREA</div>
                    <div className="hc-eed-finding-value" style={{ color: "#059669" }}>
                      {KPI_SECTIONS.map(s => ({ label: s.label, score: s.kpis.filter(k => kpiData[k.id]?.status === "have").length / s.kpis.length })).sort((a,b) => b.score - a.score)[0]?.label || "—"}
                    </div>
                    <div className="hc-eed-finding-sub">Highest proportion of metered data</div>
                  </div>
                  <div className="hc-eed-finding-card" style={{ borderLeftColor: "#DC2626" }}>
                    <div className="hc-eed-finding-label">BIGGEST GAP</div>
                    <div className="hc-eed-finding-value" style={{ color: "#DC2626" }}>
                      {(() => { const s = KPI_SECTIONS.map(sec => ({ label: sec.label, missing: sec.kpis.filter(k => kpiData[k.id]?.status === "miss").length })).sort((a,b) => b.missing - a.missing); return s[0]?.missing > 0 ? s[0].label : "None"; })()}
                    </div>
                    <div className="hc-eed-finding-sub">Most untracked KPIs</div>
                  </div>
                  <div className="hc-eed-finding-card" style={{ borderLeftColor: facility.hasGermany?.startsWith("yes") ? "#DC2626" : "var(--hc-teal)" }}>
                    <div className="hc-eed-finding-label">GERMAN ENFG EXPOSURE</div>
                    <div className="hc-eed-finding-value" style={{ color: facility.hasGermany?.startsWith("yes") ? "#DC2626" : "var(--hc-text-2)" }}>
                      {facility.hasGermany === "yes-500" ? "High" : facility.hasGermany === "yes-300" ? "Medium" : facility.hasGermany === "no" ? "None" : "Unknown"}
                    </div>
                    <div className="hc-eed-finding-sub">{facility.hasGermany === "yes-500" ? "Up to €100K fine per facility" : facility.hasGermany === "yes-300" ? "EnEfG reporting applies" : "EED reporting only"}</div>
                  </div>
                  <div className="hc-eed-finding-card" style={{ borderLeftColor: "#D97706" }}>
                    <div className="hc-eed-finding-label">HEAT REUSE STATUS</div>
                    <div className="hc-eed-finding-value" style={{ color: "#D97706" }}>
                      {facility.hasHeatReuse === "active" ? "Active" : facility.hasHeatReuse === "partial" ? "Partial" : facility.hasHeatReuse === "none" ? "None" : facility.hasHeatReuse === "planning" ? "Planning" : "Unknown"}
                    </div>
                    <div className="hc-eed-finding-sub">German ERF 10% requirement: July 2026</div>
                  </div>
                </div>

                {missingKPIs.length > 0 && (
                  <div className="hc-eed-missing-list">
                    <h3>⚠ Missing KPIs — Action Required Before May 15</h3>
                    {missingKPIs.map(k => (
                      <span key={k.id} className="hc-eed-missing-tag">{k.name}</span>
                    ))}
                  </div>
                )}

                <div className="hc-eed-submit-section">
                  <h3>Get your full written report</h3>
                  <p>Submit your responses and the Circular Data Centers team will deliver a detailed 6–8 page readiness report within 2–3 weeks. Free, no commitment.</p>
                  <div className="hc-eed-contact-grid">
                    <div className="hc-eed-field-group">
                      <label className="hc-eed-field-label">Your name</label>
                      <input className="hc-eed-field-input" placeholder="First and last name" value={contactInfo.name} onChange={e => setContactInfo(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div className="hc-eed-field-group">
                      <label className="hc-eed-field-label">Email address</label>
                      <input className="hc-eed-field-input" type="email" placeholder="your@email.com" value={contactInfo.email} onChange={e => setContactInfo(p => ({...p, email: e.target.value}))} />
                    </div>
                    <div className="hc-eed-field-group">
                      <label className="hc-eed-field-label">Your role</label>
                      <input className="hc-eed-field-input" placeholder="e.g. Sustainability Manager" value={contactInfo.role} onChange={e => setContactInfo(p => ({...p, role: e.target.value}))} />
                    </div>
                    <div className="hc-eed-field-group">
                      <label className="hc-eed-field-label">One thing you want answered</label>
                      <input className="hc-eed-field-input" placeholder="Your biggest compliance question..." value={signal} onChange={e => setSignal(e.target.value)} />
                    </div>
                  </div>
                  <button
                    className="hc-eed-btn-submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !contactInfo.name || !contactInfo.email}
                  >
                    {isSubmitting ? "Submitting..." : "Submit and request written report →"}
                  </button>
                </div>

                <div className="hc-eed-form-nav">
                  <button className="hc-eed-btn-back" onClick={() => setStep(step - 1)}>← Back to KPIs</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {screen === "success" && (
        <div className="hc-eed-success-screen">
          <div className="hc-eed-success-icon">✅</div>
          <h2 className="hc-eed-success-title">Audit submitted</h2>
          <p className="hc-eed-success-sub">
            Thank you. We've received your EED readiness data for <strong>{facility.site || facility.operator}</strong>.
            Your written report will be delivered to <strong>{contactInfo.email}</strong> within 2–3 weeks.
          </p>
          <div className="hc-eed-success-timeline">
            <div className="hc-eed-timeline-item">
              <div className="hc-eed-timeline-num">1</div>
              <div className="hc-eed-timeline-text"><strong>This week</strong> — Our team reviews your KPI responses and regulatory profile</div>
            </div>
            <div className="hc-eed-timeline-item">
              <div className="hc-eed-timeline-num">2</div>
              <div className="hc-eed-timeline-text"><strong>Week 2</strong> — We calculate your PUE, WUE, ERF and REF against EU thresholds and quantify fine exposure</div>
            </div>
            <div className="hc-eed-timeline-item">
              <div className="hc-eed-timeline-num">3</div>
              <div className="hc-eed-timeline-text"><strong>Week 2–3</strong> — We deliver a 6–8 page written report with a priority action list for your facility</div>
            </div>
            <div className="hc-eed-timeline-item">
              <div className="hc-eed-timeline-num">4</div>
              <div className="hc-eed-timeline-text"><strong>Optional</strong> — A 30-minute debrief call to walk through findings together</div>
            </div>
          </div>
          <button className="hc-eed-btn-start" style={{ marginTop: 28 }} onClick={resetAll}>
            Start a new audit
          </button>
        </div>
      )}

      {/* ADMIN */}
      {screen === "admin" && (
        <div className="hc-eed-admin-wrap">
          <h2 className="hc-eed-admin-title">Audit Submissions</h2>
          <p className="hc-eed-admin-sub">{loadingAdmin ? "Loading..." : `${submissions.length} submission${submissions.length !== 1 ? "s" : ""} received`}</p>
          {!loadingAdmin && submissions.length === 0 && (
            <div style={{ background: "var(--hc-surface)", border: "1px solid var(--hc-border)", borderRadius: 10, padding: 32, textAlign: "center", color: "var(--hc-text-2)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No submissions yet</div>
              <div style={{ fontSize: 14, marginTop: 6, color: "var(--hc-text-3)" }}>Share the audit link to start collecting responses</div>
            </div>
          )}
          {submissions.map((sub) => {
            const { readinessScore: rs, haveCount: hc, estCount: ec, missCount: mc, scoredCount: sc } = sub.scores || {};
            return (
              <div key={sub.id} className="hc-eed-submission-card">
                <div>
                  <div className="hc-eed-sub-name">{sub.facility?.operator || "Unnamed"}{sub.facility?.site ? ` — ${sub.facility.site}` : ""}</div>
                  <div className="hc-eed-sub-meta">
                    {sub.contactInfo?.name} · {sub.contactInfo?.email} · {sub.contactInfo?.role}
                    {sub.submittedAt ? ` · ${new Date(sub.submittedAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}` : ""}
                  </div>
                  <div className="hc-eed-sub-kpi-row">
                    {sub.facility?.country && <span className="hc-eed-sub-badge" style={{ background: "rgba(2,160,185,0.10)", color: "var(--hc-text-2)" }}>📍 {sub.facility.country}</span>}
                    {hc > 0 && <span className="hc-eed-sub-badge" style={{ background: "rgba(5,150,105,0.15)", color: "#059669" }}>✓ {hc} have</span>}
                    {ec > 0 && <span className="hc-eed-sub-badge" style={{ background: "rgba(217,119,6,0.15)", color: "#D97706" }}>△ {ec} estimated</span>}
                    {mc > 0 && <span className="hc-eed-sub-badge" style={{ background: "rgba(220,38,38,0.12)", color: "#DC2626" }}>✗ {mc} missing</span>}
                    {sub.facility?.hasGermany?.startsWith("yes") && <span className="hc-eed-sub-badge" style={{ background: "rgba(220,38,38,0.12)", color: "#DC2626" }}>🇩🇪 EnEfG applies</span>}
                    {sub.facility?.hasHeatReuse === "none" && <span className="hc-eed-sub-badge" style={{ background: "rgba(217,119,6,0.15)", color: "#D97706" }}>No heat reuse</span>}
                  </div>
                  {sub.signal && <div className="hc-eed-sub-signal">💬 "{sub.signal}"</div>}
                </div>
                <div className="hc-eed-sub-score">
                  <div className="hc-eed-sub-score-num" style={{ color: rs >= 70 ? "#059669" : rs >= 40 ? "#D97706" : "#DC2626" }}>{rs}%</div>
                  <div className="hc-eed-sub-score-label">readiness</div>
                  <div style={{ fontSize: 11, color: "var(--hc-text-3)", marginTop: 4 }}>{sc}/{TOTAL_KPIS} scored</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
