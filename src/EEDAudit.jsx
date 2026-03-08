import React, { useState } from 'react';

const storage = {
  set: (key, value) => localStorage.setItem(key, value),
  get: (key) => ({ value: localStorage.getItem(key) }),
  list: (prefix) => ({ keys: Object.keys(localStorage).filter(k => k.startsWith(prefix)) }),
};

const COLORS = {
  navy: "#0D2137",
  teal: "#028090",
  mint: "#02C39A",
  amber: "#D97706",
  red: "#DC2626",
  green: "#059669",
  gray: "#64748B",
  lgray: "#F1F5F9",
};

const KPI_SECTIONS = [
  {
    id: "energy",
    label: "Energy",
    icon: "⚡",
    color: "#028090",
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
    color: "#02C39A",
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
    color: "#D97706",
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
    color: "#64748B",
    kpis: [
      { id: "floor_area", name: "Data centre floor area", unit: "m²" },
      { id: "it_capacity", name: "Total installed IT capacity", unit: "kW" },
      { id: "data_volume", name: "Total data stored and processed", unit: "TB" },
    ],
  },
];

const ALL_KPIS = KPI_SECTIONS.flatMap((s) => s.kpis.map((k) => ({ ...k, section: s.id })));
const TOTAL_KPIS = ALL_KPIS.length;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');

  .eed-platform * { box-sizing: border-box; }

  .eed-platform {
    font-family: 'DM Sans', sans-serif;
    background: #F1F5F9;
    min-height: 100vh;
    color: #0D2137;
  }

  /* NAV */
  .eed-nav {
    background: #0D2137;
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #028090;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .eed-nav-brand { display: flex; align-items: center; gap: 10px; }
  .eed-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: #02C39A; }
  .eed-nav-name { color: white; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
  .eed-nav-sub { color: #64748B; font-size: 13px; margin-left: 4px; }
  .eed-nav-tag { background: rgba(2,195,154,0.15); color: #02C39A; border: 1px solid rgba(2,195,154,0.3); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }

  /* LANDING */
  .eed-landing { max-width: 900px; margin: 0 auto; padding: 64px 24px; }
  .eed-landing-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #028090; margin-bottom: 16px; }
  .eed-landing-title { font-size: 48px; font-weight: 700; color: #0D2137; line-height: 1.1; margin-bottom: 20px; }
  .eed-landing-title span { color: #028090; }
  .eed-landing-subtitle { font-size: 18px; color: #64748B; line-height: 1.6; max-width: 600px; margin-bottom: 40px; }

  .eed-landing-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
  .eed-stat-card { background: white; border-radius: 10px; padding: 24px; border-left: 4px solid; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .eed-stat-num { font-size: 40px; font-weight: 700; line-height: 1; margin-bottom: 6px; font-family: 'DM Mono', monospace; }
  .eed-stat-label { font-size: 13px; font-weight: 600; color: #0D2137; margin-bottom: 4px; }
  .eed-stat-sub { font-size: 12px; color: #94A3B8; }

  .eed-landing-what { background: #0D2137; border-radius: 12px; padding: 32px; margin-bottom: 40px; }
  .eed-landing-what h3 { color: #02C39A; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 20px; }
  .eed-what-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .eed-what-item { display: flex; gap: 12px; }
  .eed-what-dot { width: 6px; height: 6px; border-radius: 50%; background: #02C39A; margin-top: 7px; flex-shrink: 0; }
  .eed-what-text { color: #CBD5E1; font-size: 14px; line-height: 1.5; }

  .eed-btn-start { background: #028090; color: white; border: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; display: inline-flex; align-items: center; gap: 10px; }
  .eed-btn-start:hover { background: #01606B; }
  .eed-btn-start-secondary { background: transparent; color: #028090; border: 2px solid #028090; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; margin-left: 12px; }
  .eed-btn-start-secondary:hover { background: #028090; color: white; }

  /* FORM LAYOUT */
  .eed-form-layout { display: grid; grid-template-columns: 260px 1fr; min-height: calc(100vh - 56px); }

  /* Sidebar */
  .eed-sidebar { background: #0D2137; padding: 24px 0; position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto; }
  .eed-sidebar-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #64748B; padding: 16px 20px 8px; }
  .eed-sidebar-step { display: flex; align-items: center; gap: 10px; padding: 10px 20px; cursor: pointer; transition: background 0.15s; color: #94A3B8; font-size: 13px; font-weight: 500; border-left: 3px solid transparent; }
  .eed-sidebar-step:hover { background: rgba(255,255,255,0.05); color: white; }
  .eed-sidebar-step.active { background: rgba(2,144,128,0.15); color: #02C39A; border-left-color: #02C39A; }
  .eed-sidebar-step.done { color: #64748B; }
  .eed-sidebar-step.done .eed-step-icon { color: #02C39A; }
  .eed-step-icon { font-size: 14px; width: 20px; text-align: center; }
  .eed-step-name { flex: 1; }
  .eed-step-check { font-size: 12px; color: #02C39A; }

  .eed-score-widget { margin: 16px; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; }
  .eed-score-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #64748B; margin-bottom: 12px; }
  .eed-score-bars { display: flex; flex-direction: column; gap: 6px; }
  .eed-sbar-row { display: flex; align-items: center; gap: 8px; }
  .eed-sbar-label { font-size: 11px; color: #94A3B8; width: 52px; }
  .eed-sbar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .eed-sbar-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
  .eed-sbar-pct { font-size: 11px; font-family: 'DM Mono', monospace; width: 30px; text-align: right; color: #94A3B8; }

  /* Main form area */
  .eed-form-main { padding: 32px; max-width: 760px; }
  .eed-form-header { margin-bottom: 28px; }
  .eed-form-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #028090; margin-bottom: 8px; }
  .eed-form-title { font-size: 26px; font-weight: 700; color: #0D2137; }
  .eed-form-subtitle { font-size: 14px; color: #64748B; margin-top: 6px; line-height: 1.5; }

  /* Fields */
  .eed-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .eed-field-group { display: flex; flex-direction: column; gap: 6px; }
  .eed-field-group.full { grid-column: 1 / -1; }
  .eed-field-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748B; text-transform: uppercase; }
  .eed-field-input, .eed-field-select { border: 1.5px solid #E2E8F0; border-radius: 6px; padding: 10px 12px; font-size: 14px; color: #0D2137; background: white; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.15s; width: 100%; }
  .eed-field-input:focus, .eed-field-select:focus { border-color: #028090; }
  .eed-field-input::placeholder { color: #CBD5E1; }

  /* KPI table */
  .eed-kpi-section-card { background: white; border-radius: 10px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .eed-kpi-section-head { padding: 14px 20px; display: flex; align-items: center; gap: 10px; }
  .eed-kpi-section-icon { font-size: 16px; }
  .eed-kpi-section-label { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: white; flex: 1; }
  .eed-kpi-section-count { font-size: 11px; background: rgba(255,255,255,0.2); color: white; padding: 2px 8px; border-radius: 10px; }

  .eed-kpi-row { display: grid; grid-template-columns: 1fr 180px 140px; align-items: center; padding: 12px 20px; border-bottom: 1px solid #F1F5F9; gap: 12px; }
  .eed-kpi-row:last-child { border-bottom: none; }
  .eed-kpi-row:hover { background: #FAFBFC; }
  .eed-kpi-name-text { font-size: 13px; font-weight: 500; color: #0D2137; }
  .eed-kpi-name-text.key-kpi { font-weight: 700; }
  .eed-kpi-unit-tag { font-size: 11px; color: #94A3B8; font-family: 'DM Mono', monospace; margin-left: 6px; }

  .eed-status-btns { display: flex; gap: 4px; }
  .eed-s-btn { border: 1.5px solid #E2E8F0; background: white; border-radius: 5px; padding: 4px 8px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.12s; color: #94A3B8; white-space: nowrap; }
  .eed-s-btn:hover { border-color: #028090; color: #028090; }
  .eed-s-btn.have { background: #059669; border-color: #059669; color: white; }
  .eed-s-btn.est  { background: #D97706; border-color: #D97706; color: white; }
  .eed-s-btn.miss { background: #DC2626; border-color: #DC2626; color: white; }

  .eed-kpi-note { border: 1.5px solid #E2E8F0; border-radius: 5px; padding: 5px 8px; font-size: 12px; font-family: 'DM Sans', sans-serif; width: 100%; color: #0D2137; background: white; outline: none; }
  .eed-kpi-note:focus { border-color: #028090; }
  .eed-kpi-note::placeholder { color: #CBD5E1; }

  /* Results */
  .eed-results-wrap { padding: 32px; max-width: 760px; }
  .eed-results-score-hero { background: #0D2137; border-radius: 14px; padding: 36px; margin-bottom: 24px; display: flex; align-items: center; gap: 40px; }
  .eed-big-score-num { font-size: 80px; font-weight: 700; font-family: 'DM Mono', monospace; line-height: 1; }
  .eed-big-score-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #64748B; margin-top: 6px; }
  .eed-score-detail { flex: 1; }
  .eed-score-detail-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .eed-score-d-label { font-size: 13px; color: #94A3B8; width: 80px; }
  .eed-score-d-bar-bg { flex: 1; height: 10px; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden; }
  .eed-score-d-fill { height: 100%; border-radius: 5px; }
  .eed-score-d-count { font-size: 13px; font-family: 'DM Mono', monospace; width: 50px; text-align: right; color: #94A3B8; }

  .eed-findings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .eed-finding-card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid; }
  .eed-finding-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #94A3B8; margin-bottom: 8px; }
  .eed-finding-value { font-size: 22px; font-weight: 700; margin-bottom: 4px; font-family: 'DM Mono', monospace; }
  .eed-finding-sub { font-size: 12px; color: #94A3B8; }

  .eed-missing-list { background: white; border-radius: 10px; padding: 20px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .eed-missing-list h3 { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #DC2626; margin-bottom: 14px; }
  .eed-missing-tag { display: inline-block; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; padding: 4px 10px; border-radius: 4px; font-size: 12px; margin: 3px; font-weight: 500; }

  .eed-submit-section { background: #0D2137; border-radius: 12px; padding: 28px; }
  .eed-submit-section h3 { color: white; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .eed-submit-section p { color: #94A3B8; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
  .eed-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .eed-btn-submit { background: #02C39A; color: #0D2137; border: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; width: 100%; }
  .eed-btn-submit:hover { background: #01A884; }
  .eed-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Admin */
  .eed-admin-wrap { padding: 32px; max-width: 1000px; margin: 0 auto; }
  .eed-admin-title { font-size: 28px; font-weight: 700; color: #0D2137; }
  .eed-admin-sub { font-size: 14px; color: #64748B; margin-top: 4px; margin-bottom: 28px; }
  .eed-submission-card { background: white; border-radius: 10px; padding: 20px 24px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start; }
  .eed-sub-name { font-size: 17px; font-weight: 700; color: #0D2137; }
  .eed-sub-meta { font-size: 12px; color: #94A3B8; margin-top: 2px; }
  .eed-sub-kpi-row { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
  .eed-sub-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 4px; }
  .eed-sub-score { text-align: right; }
  .eed-sub-score-num { font-size: 32px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .eed-sub-score-label { font-size: 11px; color: #94A3B8; }
  .eed-sub-signal { font-size: 12px; margin-top: 8px; background: #F1F5F9; border-radius: 6px; padding: 10px 14px; color: #64748B; line-height: 1.5; }

  /* Nav buttons */
  .eed-form-nav { display: flex; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E2E8F0; }
  .eed-btn-next { background: #028090; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .eed-btn-next:hover { background: #01606B; }
  .eed-btn-back { background: transparent; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .eed-btn-back:hover { border-color: #64748B; color: #0D2137; }

  .eed-success-screen { text-align: center; padding: 80px 32px; max-width: 600px; margin: 0 auto; }
  .eed-success-icon { font-size: 64px; margin-bottom: 24px; }
  .eed-success-title { font-size: 32px; font-weight: 700; color: #0D2137; margin-bottom: 12px; }
  .eed-success-sub { font-size: 16px; color: #64748B; line-height: 1.6; margin-bottom: 32px; }
  .eed-success-timeline { background: white; border-radius: 12px; padding: 24px; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .eed-timeline-item { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
  .eed-timeline-item:last-child { border-bottom: none; }
  .eed-timeline-num { width: 28px; height: 28px; border-radius: 50%; background: #028090; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .eed-timeline-text { font-size: 13px; color: #64748B; line-height: 1.5; }
  .eed-timeline-text strong { color: #0D2137; }
`;

export default function EEDAudit({ onBack }) {
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
    <>
      <style>{styles}</style>
      <div className="eed-platform">
        {/* NAV */}
        <nav className="eed-nav">
          <div className="eed-nav-brand">
            <span
              onClick={onBack}
              style={{ fontSize: 12, color: '#64748B', cursor: 'pointer', marginRight: 8 }}
            >
              ← Platform
            </span>
            <div className="eed-nav-dot" />
            <span className="eed-nav-name">Circular Data Centers</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {screen === "form" && (
              <span style={{ fontSize: 13, color: "#64748B" }}>
                {scoredCount} / {TOTAL_KPIS} KPIs scored
              </span>
            )}
            <span className="eed-nav-tag">EED Readiness Audit</span>
            <span
              style={{ fontSize: 12, color: "#64748B", cursor: "pointer", marginLeft: 8 }}
              onClick={() => { setScreen("admin"); loadAdmin(); }}
            >
              Admin ↗
            </span>
          </div>
        </nav>

        {/* LANDING */}
        {screen === "landing" && (
          <div className="eed-landing">
            <div className="eed-landing-eyebrow">FREE — NO COMMITMENT</div>
            <h1 className="eed-landing-title">
              Know exactly where you<br />stand on <span>EED compliance</span>
            </h1>
            <p className="eed-landing-subtitle">
              The EU Energy Efficiency Directive requires 2,000+ data centres to report 24 energy KPIs annually.
              This 15-minute audit tells you which data you have, what's missing, and what your regulatory exposure is.
            </p>

            <div className="eed-landing-stats">
              <div className="eed-stat-card" style={{ borderColor: "#DC2626" }}>
                <div className="eed-stat-num" style={{ color: "#DC2626" }}>70%</div>
                <div className="eed-stat-label">Non-compliance rate</div>
                <div className="eed-stat-sub">First EED reporting round, 2024</div>
              </div>
              <div className="eed-stat-card" style={{ borderColor: "#D97706" }}>
                <div className="eed-stat-num" style={{ color: "#D97706" }}>85%</div>
                <div className="eed-stat-label">Hit technical issues</div>
                <div className="eed-stat-sub">Trying to submit their data</div>
              </div>
              <div className="eed-stat-card" style={{ borderColor: "#028090" }}>
                <div className="eed-stat-num" style={{ color: "#028090" }}>15 May</div>
                <div className="eed-stat-label">Next EU deadline</div>
                <div className="eed-stat-sub">Germany: 31 March 2026</div>
              </div>
            </div>

            <div className="eed-landing-what">
              <h3>WHAT YOU GET IN 15 MINUTES</h3>
              <div className="eed-what-grid">
                <div className="eed-what-item"><div className="eed-what-dot"/><div className="eed-what-text">Data inventory across all 24 EED KPIs — scored red, amber, or green</div></div>
                <div className="eed-what-item"><div className="eed-what-dot"/><div className="eed-what-text">PUE, WUE, ERF and REF readiness check using EU Delegated Regulation criteria</div></div>
                <div className="eed-what-item"><div className="eed-what-dot"/><div className="eed-what-text">Regulatory gap analysis — which rules apply to your facility and when</div></div>
                <div className="eed-what-item"><div className="eed-what-dot"/><div className="eed-what-text">A written readiness report delivered within 2–3 weeks. Free, no commitment.</div></div>
              </div>
            </div>

            <div>
              <button className="eed-btn-start" onClick={() => { setScreen("form"); setStep(0); }}>
                Start the audit →
              </button>
              <button className="eed-btn-start-secondary" onClick={() => { setScreen("admin"); loadAdmin(); }}>
                View submissions
              </button>
            </div>
          </div>
        )}

        {/* FORM */}
        {screen === "form" && (
          <div className="eed-form-layout">
            {/* Sidebar */}
            <div className="eed-sidebar">
              <div className="eed-sidebar-label">AUDIT STEPS</div>
              {STEPS.map((s, i) => {
                const sectionKpis = i === 0 ? [] : KPI_SECTIONS[i - 1].kpis;
                const sectionDone = i === 0
                  ? !!(facility.operator && facility.country)
                  : sectionKpis.every((k) => kpiData[k.id]?.status);
                return (
                  <div
                    key={i}
                    className={`eed-sidebar-step ${step === i ? "active" : ""} ${sectionDone && step !== i ? "done" : ""}`}
                    onClick={() => setStep(i)}
                  >
                    <span className="eed-step-icon">{s.icon}</span>
                    <span className="eed-step-name">{s.label}</span>
                    {sectionDone && step !== i && <span className="eed-step-check">✓</span>}
                  </div>
                );
              })}
              <div style={{ marginTop: 8 }}>
                <div
                  className={`eed-sidebar-step ${step === STEPS.length ? "active" : ""}`}
                  onClick={() => setStep(STEPS.length)}
                >
                  <span className="eed-step-icon">📋</span>
                  <span className="eed-step-name">Results & Submit</span>
                </div>
              </div>

              <div className="eed-score-widget">
                <div className="eed-score-title">LIVE READINESS SCORE</div>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 42, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: scoreColor }}>{readinessScore}%</span>
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{scoredCount}/{TOTAL_KPIS} KPIs scored</div>
                </div>
                <div className="eed-score-bars">
                  <div className="eed-sbar-row">
                    <span className="eed-sbar-label" style={{ color: "#059669" }}>✓ Have</span>
                    <div className="eed-sbar-bg"><div className="eed-sbar-fill" style={{ width: haveP + "%", background: "#059669" }}/></div>
                    <span className="eed-sbar-pct" style={{ color: "#059669" }}>{haveP}%</span>
                  </div>
                  <div className="eed-sbar-row">
                    <span className="eed-sbar-label" style={{ color: "#D97706" }}>△ Est.</span>
                    <div className="eed-sbar-bg"><div className="eed-sbar-fill" style={{ width: estP + "%", background: "#D97706" }}/></div>
                    <span className="eed-sbar-pct" style={{ color: "#D97706" }}>{estP}%</span>
                  </div>
                  <div className="eed-sbar-row">
                    <span className="eed-sbar-label" style={{ color: "#DC2626" }}>✗ Miss</span>
                    <div className="eed-sbar-bg"><div className="eed-sbar-fill" style={{ width: missP + "%", background: "#DC2626" }}/></div>
                    <span className="eed-sbar-pct" style={{ color: "#DC2626" }}>{missP}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div style={{ overflowY: "auto" }}>
              {/* STEP 0 — Facility */}
              {step === 0 && (
                <div className="eed-form-main">
                  <div className="eed-form-header">
                    <div className="eed-form-eyebrow">STEP 1 OF {STEPS.length + 1}</div>
                    <h2 className="eed-form-title">Facility Details</h2>
                    <p className="eed-form-subtitle">Basic information about your data centre. Used to determine which regulations apply to you.</p>
                  </div>
                  <div className="eed-field-grid">
                    <div className="eed-field-group">
                      <label className="eed-field-label">Organisation name</label>
                      <input className="eed-field-input" placeholder="Your company name" value={facility.operator} onChange={e => setFacility(p => ({...p, operator: e.target.value}))} />
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">Facility / site name</label>
                      <input className="eed-field-input" placeholder="e.g. Oslo DC1, Frankfurt Campus" value={facility.site} onChange={e => setFacility(p => ({...p, site: e.target.value}))} />
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">Country / countries of operation</label>
                      <input className="eed-field-input" placeholder="e.g. Norway, Germany, France" value={facility.country} onChange={e => setFacility(p => ({...p, country: e.target.value}))} />
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">Total installed IT capacity (kW)</label>
                      <input className="eed-field-input" type="number" placeholder="e.g. 2400" value={facility.capacity} onChange={e => setFacility(p => ({...p, capacity: e.target.value}))} />
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">Do you operate in Germany?</label>
                      <select className="eed-field-select" value={facility.hasGermany} onChange={e => setFacility(p => ({...p, hasGermany: e.target.value}))}>
                        <option value="">Select...</option>
                        <option value="yes-500">Yes — over 500kW (EnEfG + EED apply)</option>
                        <option value="yes-300">Yes — 300–500kW (EnEfG only)</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">Did you submit 2024 EED data (May 2025)?</label>
                      <select className="eed-field-select" value={facility.submitted2024} onChange={e => setFacility(p => ({...p, submitted2024: e.target.value}))}>
                        <option value="">Select...</option>
                        <option value="yes-time">Yes — submitted on time</option>
                        <option value="yes-late">Yes — submitted late</option>
                        <option value="no">No — did not submit</option>
                        <option value="unsure">Unsure</option>
                      </select>
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">Do you have an internal EED owner?</label>
                      <select className="eed-field-select" value={facility.hasOwner} onChange={e => setFacility(p => ({...p, hasOwner: e.target.value}))}>
                        <option value="">Select...</option>
                        <option value="yes-dedicated">Yes — dedicated person</option>
                        <option value="yes-shared">Yes — shared responsibility</option>
                        <option value="no">No — nobody owns it</option>
                        <option value="unknown">Unknown internally</option>
                      </select>
                    </div>
                    <div className="eed-field-group">
                      <label className="eed-field-label">BMS / DCIM system</label>
                      <select className="eed-field-select" value={facility.hasBMS} onChange={e => setFacility(p => ({...p, hasBMS: e.target.value}))}>
                        <option value="">Select...</option>
                        <option value="schneider">Schneider Electric EcoStruxure</option>
                        <option value="vertiv">Vertiv Trellis</option>
                        <option value="other-dcim">Other DCIM system</option>
                        <option value="bms-only">Basic BMS only</option>
                        <option value="manual">Manual metering only</option>
                      </select>
                    </div>
                    <div className="eed-field-group full">
                      <label className="eed-field-label">Waste heat reuse infrastructure</label>
                      <select className="eed-field-select" value={facility.hasHeatReuse} onChange={e => setFacility(p => ({...p, hasHeatReuse: e.target.value}))}>
                        <option value="">Select...</option>
                        <option value="active">Active heat export in place</option>
                        <option value="partial">Partial recovery</option>
                        <option value="none">No heat reuse — all heat wasted</option>
                        <option value="planning">Planning stage</option>
                      </select>
                    </div>
                  </div>
                  <div className="eed-form-nav">
                    <button className="eed-btn-next" onClick={() => setStep(1)}>Next: Energy KPIs →</button>
                  </div>
                </div>
              )}

              {/* STEPS 1–4 — KPI Sections */}
              {step >= 1 && step <= KPI_SECTIONS.length && (() => {
                const sec = KPI_SECTIONS[step - 1];
                return (
                  <div className="eed-form-main">
                    <div className="eed-form-header">
                      <div className="eed-form-eyebrow">STEP {step + 1} OF {STEPS.length + 1}</div>
                      <h2 className="eed-form-title">{sec.icon} {sec.label} KPIs</h2>
                      <p className="eed-form-subtitle">
                        For each metric: mark <strong>✓ Have</strong> if you have metered data, <strong>△ Est.</strong> if you estimate it, or <strong>✗ Miss</strong> if you don't collect it.
                      </p>
                    </div>
                    <div className="eed-kpi-section-card">
                      <div className="eed-kpi-section-head" style={{ background: sec.color }}>
                        <span className="eed-kpi-section-icon">{sec.icon}</span>
                        <span className="eed-kpi-section-label">{sec.label.toUpperCase()}</span>
                        <span className="eed-kpi-section-count">{sec.kpis.length} KPIs</span>
                      </div>
                      {sec.kpis.map((kpi) => (
                        <div className="eed-kpi-row" key={kpi.id}>
                          <div>
                            <span className={`eed-kpi-name-text${kpi.key ? " key-kpi" : ""}`}>{kpi.name}</span>
                            <span className="eed-kpi-unit-tag">{kpi.unit}</span>
                          </div>
                          <div className="eed-status-btns">
                            <button className={`eed-s-btn${kpiData[kpi.id]?.status === "have" ? " have" : ""}`} onClick={() => setKpiStatus(kpi.id, "have")}>✓ Have</button>
                            <button className={`eed-s-btn${kpiData[kpi.id]?.status === "est" ? " est" : ""}`} onClick={() => setKpiStatus(kpi.id, "est")}>△ Est.</button>
                            <button className={`eed-s-btn${kpiData[kpi.id]?.status === "miss" ? " miss" : ""}`} onClick={() => setKpiStatus(kpi.id, "miss")}>✗ Miss</button>
                          </div>
                          <input className="eed-kpi-note" placeholder="Value or note..." value={kpiData[kpi.id]?.note || ""} onChange={(e) => setKpiNote(kpi.id, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div className="eed-form-nav">
                      <button className="eed-btn-back" onClick={() => setStep(step - 1)}>← Back</button>
                      <button className="eed-btn-next" onClick={() => setStep(step + 1)}>
                        {step < KPI_SECTIONS.length ? `Next: ${KPI_SECTIONS[step].label} →` : "View Results →"}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* STEP 5 — Results */}
              {step === STEPS.length && (
                <div className="eed-results-wrap">
                  <div className="eed-form-header">
                    <div className="eed-form-eyebrow">YOUR RESULTS</div>
                    <h2 className="eed-form-title">EED Readiness Report</h2>
                    <p className="eed-form-subtitle">Based on your responses across all 24 KPIs. Submit below to receive a full written analysis.</p>
                  </div>

                  <div className="eed-results-score-hero">
                    <div>
                      <div className="eed-big-score-num" style={{ color: scoreColor }}>{readinessScore}%</div>
                      <div className="eed-big-score-label">READINESS SCORE</div>
                    </div>
                    <div className="eed-score-detail">
                      <div className="eed-score-detail-row">
                        <span className="eed-score-d-label" style={{ color: "#059669" }}>✓ Have it</span>
                        <div className="eed-score-d-bar-bg"><div className="eed-score-d-fill" style={{ width: haveP + "%", background: "#059669" }}/></div>
                        <span className="eed-score-d-count" style={{ color: "#059669" }}>{haveCount} KPIs</span>
                      </div>
                      <div className="eed-score-detail-row">
                        <span className="eed-score-d-label" style={{ color: "#D97706" }}>△ Estimated</span>
                        <div className="eed-score-d-bar-bg"><div className="eed-score-d-fill" style={{ width: estP + "%", background: "#D97706" }}/></div>
                        <span className="eed-score-d-count" style={{ color: "#D97706" }}>{estCount} KPIs</span>
                      </div>
                      <div className="eed-score-detail-row">
                        <span className="eed-score-d-label" style={{ color: "#DC2626" }}>✗ Missing</span>
                        <div className="eed-score-d-bar-bg"><div className="eed-score-d-fill" style={{ width: missP + "%", background: "#DC2626" }}/></div>
                        <span className="eed-score-d-count" style={{ color: "#DC2626" }}>{missCount} KPIs</span>
                      </div>
                      <div style={{ marginTop: 14, fontSize: 13, color: "#94A3B8", fontStyle: "italic" }}>
                        {readinessScore >= 70 ? "Good data coverage — focus on calculation accuracy and submission workflow."
                         : readinessScore >= 40 ? "Mixed readiness — gaps in key metrics could cause submission failures."
                         : "Significant gaps detected — high risk of non-compliance without intervention."}
                      </div>
                    </div>
                  </div>

                  <div className="eed-findings-grid">
                    <div className="eed-finding-card" style={{ borderColor: "#059669" }}>
                      <div className="eed-finding-label">STRONGEST AREA</div>
                      <div className="eed-finding-value" style={{ color: "#059669" }}>
                        {KPI_SECTIONS.map(s => ({ label: s.label, score: s.kpis.filter(k => kpiData[k.id]?.status === "have").length / s.kpis.length })).sort((a,b) => b.score - a.score)[0]?.label || "—"}
                      </div>
                      <div className="eed-finding-sub">Highest proportion of metered data</div>
                    </div>
                    <div className="eed-finding-card" style={{ borderColor: "#DC2626" }}>
                      <div className="eed-finding-label">BIGGEST GAP</div>
                      <div className="eed-finding-value" style={{ color: "#DC2626" }}>
                        {(() => { const s = KPI_SECTIONS.map(sec => ({ label: sec.label, missing: sec.kpis.filter(k => kpiData[k.id]?.status === "miss").length })).sort((a,b) => b.missing - a.missing); return s[0]?.missing > 0 ? s[0].label : "None"; })()}
                      </div>
                      <div className="eed-finding-sub">Most untracked KPIs</div>
                    </div>
                    <div className="eed-finding-card" style={{ borderColor: facility.hasGermany?.startsWith("yes") ? "#DC2626" : "#028090" }}>
                      <div className="eed-finding-label">GERMAN ENFG EXPOSURE</div>
                      <div className="eed-finding-value" style={{ color: facility.hasGermany?.startsWith("yes") ? "#DC2626" : "#64748B" }}>
                        {facility.hasGermany === "yes-500" ? "High" : facility.hasGermany === "yes-300" ? "Medium" : facility.hasGermany === "no" ? "None" : "Unknown"}
                      </div>
                      <div className="eed-finding-sub">{facility.hasGermany === "yes-500" ? "Up to €100K fine per facility" : facility.hasGermany === "yes-300" ? "EnEfG reporting applies" : "EED reporting only"}</div>
                    </div>
                    <div className="eed-finding-card" style={{ borderColor: "#D97706" }}>
                      <div className="eed-finding-label">HEAT REUSE STATUS</div>
                      <div className="eed-finding-value" style={{ color: "#D97706" }}>
                        {facility.hasHeatReuse === "active" ? "Active" : facility.hasHeatReuse === "partial" ? "Partial" : facility.hasHeatReuse === "none" ? "None" : facility.hasHeatReuse === "planning" ? "Planning" : "Unknown"}
                      </div>
                      <div className="eed-finding-sub">German ERF 10% requirement: July 2026</div>
                    </div>
                  </div>

                  {missingKPIs.length > 0 && (
                    <div className="eed-missing-list">
                      <h3>⚠ Missing KPIs — Action Required Before May 15</h3>
                      {missingKPIs.map(k => (
                        <span key={k.id} className="eed-missing-tag">{k.name}</span>
                      ))}
                    </div>
                  )}

                  <div className="eed-submit-section">
                    <h3>Get your full written report</h3>
                    <p>Submit your responses and the Circular Data Centers team will deliver a detailed 6–8 page readiness report within 2–3 weeks. Free, no commitment.</p>
                    <div className="eed-contact-grid">
                      <div className="eed-field-group">
                        <label className="eed-field-label" style={{ color: "#64748B" }}>Your name</label>
                        <input className="eed-field-input" placeholder="First and last name" value={contactInfo.name} onChange={e => setContactInfo(p => ({...p, name: e.target.value}))} />
                      </div>
                      <div className="eed-field-group">
                        <label className="eed-field-label" style={{ color: "#64748B" }}>Email address</label>
                        <input className="eed-field-input" type="email" placeholder="your@email.com" value={contactInfo.email} onChange={e => setContactInfo(p => ({...p, email: e.target.value}))} />
                      </div>
                      <div className="eed-field-group">
                        <label className="eed-field-label" style={{ color: "#64748B" }}>Your role</label>
                        <input className="eed-field-input" placeholder="e.g. Sustainability Manager" value={contactInfo.role} onChange={e => setContactInfo(p => ({...p, role: e.target.value}))} />
                      </div>
                      <div className="eed-field-group">
                        <label className="eed-field-label" style={{ color: "#64748B" }}>One thing you want answered</label>
                        <input className="eed-field-input" placeholder="Your biggest compliance question..." value={signal} onChange={e => setSignal(e.target.value)} />
                      </div>
                    </div>
                    <button
                      className="eed-btn-submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !contactInfo.name || !contactInfo.email}
                    >
                      {isSubmitting ? "Submitting..." : "Submit and request written report →"}
                    </button>
                  </div>

                  <div className="eed-form-nav">
                    <button className="eed-btn-back" onClick={() => setStep(step - 1)}>← Back to KPIs</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {screen === "success" && (
          <div className="eed-success-screen">
            <div className="eed-success-icon">✅</div>
            <h2 className="eed-success-title">Audit submitted</h2>
            <p className="eed-success-sub">
              Thank you. We've received your EED readiness data for <strong>{facility.site || facility.operator}</strong>.
              Your written report will be delivered to <strong>{contactInfo.email}</strong> within 2–3 weeks.
            </p>
            <div className="eed-success-timeline">
              <div className="eed-timeline-item">
                <div className="eed-timeline-num">1</div>
                <div className="eed-timeline-text"><strong>This week</strong> — Our team reviews your KPI responses and regulatory profile</div>
              </div>
              <div className="eed-timeline-item">
                <div className="eed-timeline-num">2</div>
                <div className="eed-timeline-text"><strong>Week 2</strong> — We calculate your PUE, WUE, ERF and REF against EU thresholds and quantify fine exposure</div>
              </div>
              <div className="eed-timeline-item">
                <div className="eed-timeline-num">3</div>
                <div className="eed-timeline-text"><strong>Week 2–3</strong> — We deliver a 6–8 page written report with a priority action list for your facility</div>
              </div>
              <div className="eed-timeline-item">
                <div className="eed-timeline-num">4</div>
                <div className="eed-timeline-text"><strong>Optional</strong> — A 30-minute debrief call to walk through findings together</div>
              </div>
            </div>
            <button className="eed-btn-start" style={{ marginTop: 28 }} onClick={resetAll}>
              Start a new audit
            </button>
          </div>
        )}

        {/* ADMIN */}
        {screen === "admin" && (
          <div className="eed-admin-wrap">
            <h2 className="eed-admin-title">Audit Submissions</h2>
            <p className="eed-admin-sub">{loadingAdmin ? "Loading..." : `${submissions.length} submission${submissions.length !== 1 ? "s" : ""} received`}</p>
            {!loadingAdmin && submissions.length === 0 && (
              <div style={{ background: "white", borderRadius: 10, padding: 32, textAlign: "center", color: "#94A3B8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>No submissions yet</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>Share the audit link to start collecting responses</div>
              </div>
            )}
            {submissions.map((sub) => {
              const { readinessScore: rs, haveCount: hc, estCount: ec, missCount: mc, scoredCount: sc } = sub.scores || {};
              return (
                <div key={sub.id} className="eed-submission-card">
                  <div>
                    <div className="eed-sub-name">{sub.facility?.operator || "Unnamed"}{sub.facility?.site ? ` — ${sub.facility.site}` : ""}</div>
                    <div className="eed-sub-meta">
                      {sub.contactInfo?.name} · {sub.contactInfo?.email} · {sub.contactInfo?.role}
                      {sub.submittedAt ? ` · ${new Date(sub.submittedAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}` : ""}
                    </div>
                    <div className="eed-sub-kpi-row">
                      {sub.facility?.country && <span className="eed-sub-badge" style={{ background: "#F1F5F9", color: "#64748B" }}>📍 {sub.facility.country}</span>}
                      {hc > 0 && <span className="eed-sub-badge" style={{ background: "#ECFDF5", color: "#059669" }}>✓ {hc} have</span>}
                      {ec > 0 && <span className="eed-sub-badge" style={{ background: "#FFFBEB", color: "#D97706" }}>△ {ec} estimated</span>}
                      {mc > 0 && <span className="eed-sub-badge" style={{ background: "#FEF2F2", color: "#DC2626" }}>✗ {mc} missing</span>}
                      {sub.facility?.hasGermany?.startsWith("yes") && <span className="eed-sub-badge" style={{ background: "#FEF2F2", color: "#DC2626" }}>🇩🇪 EnEfG applies</span>}
                      {sub.facility?.hasHeatReuse === "none" && <span className="eed-sub-badge" style={{ background: "#FFFBEB", color: "#D97706" }}>No heat reuse</span>}
                    </div>
                    {sub.signal && <div className="eed-sub-signal">💬 "{sub.signal}"</div>}
                  </div>
                  <div className="eed-sub-score">
                    <div className="eed-sub-score-num" style={{ color: rs >= 70 ? "#059669" : rs >= 40 ? "#D97706" : "#DC2626" }}>{rs}%</div>
                    <div className="eed-sub-score-label">readiness</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{sc}/{TOTAL_KPIS} scored</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
