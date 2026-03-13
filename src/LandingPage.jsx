import React from 'react';

export default function LandingPage({ onDemo, onAudit }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── NAV ── */}
      <div className="hc-header bg-white border-b border-gray-200" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="hc-landing-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="hc-logo">
              <div className="hc-logo-icon">⬡</div>
              <span className="hc-logo-wordmark">HeatCert</span>
            </div>
            <span className="hc-nav-studio-tag">by Respire</span>
          </div>
          <nav className="hc-landing-nav-links">
            <a href="#how-it-works" className="hc-nav-link">How it works</a>
            <a href="#platform" className="hc-nav-link">Platform</a>
            <a href="#about" className="hc-nav-link">About</a>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="hc-btn-ghost" onClick={onAudit} style={{ padding: '9px 20px', fontSize: 13 }}>
              EED Audit
            </button>
            <button className="hc-btn-primary" onClick={onDemo} style={{ padding: '10px 22px', fontSize: 13 }}>
              Request Access →
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hc-hero">
        <div className="hc-hero-badge">EU ENERGY EFFICIENCY DIRECTIVE · REGULATION 2024/1364</div>
        <h1 className="hc-hero-title">
          Data centre EED compliance,<br /><em>automated end-to-end</em>.
        </h1>
        <p className="hc-hero-sub">
          HeatCert automates the full EU EED reporting workflow for data centre operators — from structured data ingestion and automated validation to submission-ready output. No spreadsheets, no last-minute scrambling.
        </p>
        <div className="hc-hero-actions">
          <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 16, padding: '16px 36px' }}>
            Request Access →
          </button>
          <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 16, padding: '15px 30px' }}>
            Free EED Readiness Audit
          </button>
        </div>
        <div className="hc-hero-stat-row">
          <div>
            <div className="hc-hero-stat-num">24</div>
            <div className="hc-hero-stat-label">KPIs mandated by EU EED Annex IV</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">15 May</div>
            <div className="hc-hero-stat-label">EU annual reporting deadline</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">31 Mar</div>
            <div className="hc-hero-stat-label">Germany EnEfG deadline</div>
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE STRIP ── */}
      <div className="hc-compliance-strip">
        <span className="hc-compliance-strip-label">BUILT TO THE REQUIREMENTS OF</span>
        <div className="hc-compliance-badges">
          <span className="hc-compliance-badge">EU Regulation 2024/1364</span>
          <span className="hc-compliance-sep">·</span>
          <span className="hc-compliance-badge">EED Annex IV (24 KPIs)</span>
          <span className="hc-compliance-sep">·</span>
          <span className="hc-compliance-badge">EnEfG 2023 (Germany)</span>
          <span className="hc-compliance-sep">·</span>
          <span className="hc-compliance-badge">EU DC Code of Conduct</span>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── HOW IT WORKS ── */}
      <div className="hc-landing-section" id="how-it-works">
        <div className="hc-section-eyebrow">HOW IT WORKS</div>
        <h2 className="hc-section-title">From raw meter data to <em>compliant submission</em></h2>
        <p className="hc-section-sub">
          EU Regulation 2024/1364 requires data centres to report 24 energy KPIs annually. HeatCert handles the full workflow — so your team isn't compiling it manually two days before the deadline.
        </p>
        <div className="hc-process-steps">
          <div className="hc-process-step">
            <div className="hc-process-num">01</div>
            <div className="hc-process-content">
              <div className="hc-process-title">Connect your data sources</div>
              <div className="hc-process-body">Upload energy data from BMS, DCIM, or manual exports. HeatCert ingests, normalises, and maps your inputs to all 24 EED KPI fields — total energy, IT load, cooling, UPS, renewables, water, and waste heat.</div>
            </div>
          </div>
          <div className="hc-process-step">
            <div className="hc-process-num">02</div>
            <div className="hc-process-content">
              <div className="hc-process-title">Automated validation against regulation</div>
              <div className="hc-process-body">847 validation rules check for consistency, plausibility, and completeness. PUE, WUE, ERF and REF are calculated and benchmarked against EU delegated regulation thresholds — surfacing gaps before they cause a submission failure.</div>
            </div>
          </div>
          <div className="hc-process-step">
            <div className="hc-process-num">03</div>
            <div className="hc-process-content">
              <div className="hc-process-title">Generate submission-ready output</div>
              <div className="hc-process-body">Export the report structure required for EU member state portals and the German Energieeffizienzregister. Includes a compliance status summary, gap analysis, and a full audit trail for your records.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── BEYOND COMPLIANCE ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">BEYOND COMPLIANCE</div>
        <h2 className="hc-section-title">Compliance data as a foundation for <em>efficiency</em></h2>
        <p className="hc-section-sub">
          The data you collect for EED reporting tells you more than whether you'll pass. HeatCert surfaces where your facility can improve — and quantifies the gap against regulation thresholds.
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
      <div className="hc-landing-section" id="platform">
        <div className="hc-section-eyebrow">THE PLATFORM</div>
        <h2 className="hc-section-title">Two tools. One workflow.</h2>
        <div className="hc-3col-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 800 }}>
          <div className="hc-feature-card" style={{ cursor: 'pointer' }} onClick={onDemo}>
            <div className="hc-feature-card-tag">COMPLIANCE DASHBOARD</div>
            <div className="hc-feature-card-title">Live compliance monitoring</div>
            <div className="hc-feature-card-body" style={{ marginBottom: 20 }}>
              Upload your energy data and see PUE, WUE, ERF and REF calculated in real time. Validates against EU thresholds, flags data gaps, and tracks historical trends across your facility portfolio.
            </div>
            <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 13, padding: '10px 20px' }}>
              Request Access →
            </button>
          </div>
          <div className="hc-feature-card" style={{ cursor: 'pointer' }} onClick={onAudit}>
            <div className="hc-feature-card-tag">EED READINESS AUDIT</div>
            <div className="hc-feature-card-title">Know your gaps before the deadline</div>
            <div className="hc-feature-card-body" style={{ marginBottom: 20 }}>
              A structured self-assessment across all 24 EED KPIs. Scores your data readiness red / amber / green and identifies which metrics you're missing before they cause a submission failure.
            </div>
            <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 13, padding: '9px 20px' }}>
              Start Free Audit →
            </button>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="hc-landing-cta">
        <div className="hc-landing-cta-eyebrow">GET STARTED</div>
        <div className="hc-landing-cta-title">
          Preparing for the <em>next deadline</em>?
        </div>
        <p className="hc-landing-cta-sub">
          Start with the free EED Readiness Audit to understand your data gaps — or request access to the full compliance platform.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 16, padding: '16px 36px' }}>
            Request Access →
          </button>
          <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 16, padding: '15px 30px' }}>
            Start Free Audit
          </button>
        </div>
      </div>

      {/* ── RESPIRE STUDIO ── */}
      <div className="hc-studio-section" id="about">
        <div className="hc-studio-inner">
          <div className="hc-studio-left">
            <div className="hc-studio-eyebrow">VENTURE STUDIO</div>
            <div className="hc-studio-heading">Built by Respire</div>
            <p className="hc-studio-body">
              HeatCert is a product of <a href="https://www.respire.icu/" target="_blank" rel="noopener noreferrer" className="hc-studio-link">Respire</a> — a venture studio focused on accelerating the climate transition. Respire builds purpose-driven software ventures that help operators, developers, and asset managers meet the demands of a decarbonising economy.
            </p>
            <a href="https://www.respire.icu/" target="_blank" rel="noopener noreferrer" className="hc-studio-cta">
              Visit Respire →
            </a>
          </div>
          <div className="hc-studio-right">
            <div className="hc-studio-fact">
              <div className="hc-studio-fact-label">FOCUS</div>
              <div className="hc-studio-fact-value">Accelerating the climate transition</div>
            </div>
            <div className="hc-studio-fact">
              <div className="hc-studio-fact-label">APPROACH</div>
              <div className="hc-studio-fact-value">Purpose-built ventures for specific regulatory problems</div>
            </div>
            <div className="hc-studio-fact">
              <div className="hc-studio-fact-label">HEATCERT STATUS</div>
              <div className="hc-studio-fact-value">Currently onboarding pilot partners across Europe</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="hc-landing-footer">
        <div className="hc-landing-footer-left">
          <div className="hc-logo" style={{ animation: 'none', filter: 'none', opacity: 0.7 }}>
            <div className="hc-logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>⬡</div>
            <span className="hc-logo-wordmark" style={{ fontSize: 12, letterSpacing: 1.5 }}>HeatCert</span>
          </div>
          <div className="hc-landing-footer-studio">
            A <a href="https://www.respire.icu/" target="_blank" rel="noopener noreferrer" className="hc-respire-link">Respire</a> Venture Studio company
          </div>
        </div>
        <div className="hc-landing-footer-copy">
          Built on EU Regulation 2024/1364 · EED Data Centre Annex IV
        </div>
      </div>

    </div>
  );
}
