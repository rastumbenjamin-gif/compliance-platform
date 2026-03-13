import React from 'react';

export default function LandingPage({ onDemo, onAudit }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── NAV ── */}
      <div className="hc-header bg-white border-b border-gray-200" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="hc-landing-nav">
          <div className="hc-logo">
            <div className="hc-logo-icon">⬡</div>
            <span className="hc-logo-wordmark">HeatCert</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="hc-btn-ghost" onClick={onAudit} style={{ padding: '9px 20px', fontSize: 13 }}>
              EED Audit
            </button>
            <button className="hc-btn-primary" onClick={onDemo} style={{ padding: '10px 22px', fontSize: 13 }}>
              Access Demo →
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hc-hero">
        <div className="hc-hero-badge">EU ENERGY EFFICIENCY DIRECTIVE</div>
        <h1 className="hc-hero-title">
          Your energy data,<br /><em>submission-ready</em>.
        </h1>
        <p className="hc-hero-sub">
          HeatCert helps data centre operators collect, validate and report EU EED energy KPIs — and identify where efficiency improvements are possible.
        </p>
        <div className="hc-hero-actions">
          <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 16, padding: '16px 36px' }}>
            Access Demo →
          </button>
          <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 16, padding: '15px 30px' }}>
            Start EED Audit
          </button>
        </div>
        <div className="hc-hero-stat-row">
          <div>
            <div className="hc-hero-stat-num">24</div>
            <div className="hc-hero-stat-label">KPIs required by EU EED</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">15 May</div>
            <div className="hc-hero-stat-label">Annual reporting deadline</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">31 Mar</div>
            <div className="hc-hero-stat-label">Germany (EnEfG) deadline</div>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── WHAT WE DO ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">WHAT WE DO</div>
        <h2 className="hc-section-title">From raw meter data to <em>compliant submission</em></h2>
        <p className="hc-section-sub">
          EU Regulation 2024/1364 requires data centres to report 24 energy KPIs annually. We handle the full workflow — so your team isn't doing it manually in a spreadsheet two days before the deadline.
        </p>
        <div className="hc-3col-grid">
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">DATA HANDLING</div>
            <div className="hc-feature-card-title">Structured data collection</div>
            <div className="hc-feature-card-body">
              Upload energy data from BMS, DCIM, or manual exports. We map it to the 24 EED KPI fields — total energy, IT load, cooling, UPS, renewables, water, waste heat — and flag anything missing before it becomes a problem.
            </div>
          </div>
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">VALIDATION</div>
            <div className="hc-feature-card-title">Automated quality checks</div>
            <div className="hc-feature-card-body">
              847 validation rules check your data for consistency, plausibility, and completeness before submission. PUE, WUE, ERF and REF are calculated automatically and benchmarked against EU delegated regulation thresholds.
            </div>
          </div>
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">REPORTING</div>
            <div className="hc-feature-card-title">Submission-ready output</div>
            <div className="hc-feature-card-body">
              Generates the report structure required for EU member state portals and the German Energieeffizienzregister. Includes a compliance status summary, gap analysis, and audit trail for your records.
            </div>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── OPTIMIZATION ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">BEYOND COMPLIANCE</div>
        <h2 className="hc-section-title">Compliance data as a starting point for <em>efficiency</em></h2>
        <p className="hc-section-sub">
          The data you collect for EED reporting tells you more than just whether you'll pass. HeatCert surfaces where your facility can improve — and by how much.
        </p>
        <div className="hc-3col-grid">
          <div className="hc-service-card">
            <div className="hc-service-card-label">ENERGY</div>
            <div className="hc-service-card-title">PUE &amp; load efficiency</div>
            <ul className="hc-service-items">
              <li>Power Usage Effectiveness tracking</li>
              <li>IT vs. overhead energy split</li>
              <li>GPU workload energy attribution</li>
              <li>Cooling and UPS loss analysis</li>
            </ul>
          </div>
          <div className="hc-service-card">
            <div className="hc-service-card-label">WATER &amp; HEAT</div>
            <div className="hc-service-card-title">WUE &amp; ERF compliance</div>
            <ul className="hc-service-items">
              <li>Water Usage Effectiveness monitoring</li>
              <li>Energy Reuse Factor calculation</li>
              <li>Waste heat export documentation</li>
              <li>German ERF 10% threshold (July 2026)</li>
            </ul>
          </div>
          <div className="hc-service-card">
            <div className="hc-service-card-label">RENEWABLES</div>
            <div className="hc-service-card-title">REF &amp; carbon attribution</div>
            <ul className="hc-service-items">
              <li>Renewable Energy Factor reporting</li>
              <li>PPA and on-site generation split</li>
              <li>Customer carbon attribution</li>
              <li>Scope 2 alignment support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── TWO TOOLS ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">THE PLATFORM</div>
        <h2 className="hc-section-title">Two tools. One workflow.</h2>
        <div className="hc-3col-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 800 }}>
          <div className="hc-feature-card" style={{ cursor: 'pointer' }} onClick={onDemo}>
            <div className="hc-feature-card-tag">COMPLIANCE DASHBOARD</div>
            <div className="hc-feature-card-title">Live compliance monitoring</div>
            <div className="hc-feature-card-body" style={{ marginBottom: 20 }}>
              Upload your energy data and see your PUE, WUE, ERF and REF calculated in real time. Validates against EU thresholds, flags gaps, and shows historical trends across your facility portfolio.
            </div>
            <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 13, padding: '10px 20px' }}>
              Access Demo →
            </button>
          </div>
          <div className="hc-feature-card" style={{ cursor: 'pointer' }} onClick={onAudit}>
            <div className="hc-feature-card-tag">EED READINESS AUDIT</div>
            <div className="hc-feature-card-title">Know your gaps before the deadline</div>
            <div className="hc-feature-card-body" style={{ marginBottom: 20 }}>
              A 15-minute self-assessment across all 24 EED KPIs. Scores your data readiness red / amber / green and identifies which metrics you're missing before they cause a submission failure.
            </div>
            <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 13, padding: '9px 20px' }}>
              Start Audit →
            </button>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="hc-landing-cta">
        <div className="hc-landing-cta-title">
          Ready for the <em>next deadline</em>?
        </div>
        <p className="hc-landing-cta-sub">
          Start with the EED Readiness Audit — free, no commitment, 15 minutes — or go straight into the platform demo.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 16, padding: '16px 36px' }}>
            Access Demo →
          </button>
          <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 16, padding: '15px 30px' }}>
            Start EED Audit
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="hc-landing-footer">
        <div className="hc-logo" style={{ animation: 'none', filter: 'none', opacity: 0.6 }}>
          <div className="hc-logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>⬡</div>
          <span className="hc-logo-wordmark" style={{ fontSize: 12, letterSpacing: 1.5 }}>HeatCert</span>
        </div>
        <div className="hc-landing-footer-copy">
          Built on EU Regulation 2024/1364 · EED Data Centre Annex IV
        </div>
      </div>

    </div>
  );
}
