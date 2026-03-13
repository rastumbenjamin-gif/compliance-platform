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
            <a href="#missions" className="hc-nav-link">Platform</a>
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
          Data centre EED compliance,<br /><em>end-to-end</em>.
        </h1>
        <p className="hc-hero-sub">
          Structured data collection, automated validation, and submission-ready reporting — covering all 24 EU EED KPIs.
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
            <div className="hc-hero-stat-label">KPIs mandated by EED Annex IV</div>
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

      {/* ── THREE MISSIONS ── */}
      <div className="hc-landing-section" id="missions">
        <div className="hc-section-eyebrow">THE PLATFORM</div>
        <h2 className="hc-section-title">Three missions. <em>One workflow.</em></h2>
        <div className="hc-3col-grid">

          <div className="hc-mission-card">
            <div className="hc-mission-num">01</div>
            <div className="hc-mission-label">SETUP</div>
            <div className="hc-mission-title">Data collection</div>
            <ul className="hc-service-items">
              <li>BMS, DCIM, or manual upload</li>
              <li>Maps to all 24 EED KPI fields</li>
              <li>Flags missing data immediately</li>
              <li>Total energy, IT load, cooling, UPS, water, renewables, waste heat</li>
            </ul>
          </div>

          <div className="hc-mission-card">
            <div className="hc-mission-num">02</div>
            <div className="hc-mission-label">OPERATION</div>
            <div className="hc-mission-title">Validation &amp; reporting</div>
            <ul className="hc-service-items">
              <li>847 automated validation rules</li>
              <li>PUE, WUE, ERF, REF calculated in real time</li>
              <li>Benchmarked against EU thresholds</li>
              <li>Submission-ready output for EU portals + Energieeffizienzregister</li>
            </ul>
          </div>

          <div className="hc-mission-card">
            <div className="hc-mission-num">03</div>
            <div className="hc-mission-label">OPTIMIZATION</div>
            <div className="hc-mission-title">Efficiency improvement</div>
            <ul className="hc-service-items">
              <li>Identifies gaps against regulation thresholds</li>
              <li>Cooling, UPS, and GPU workload attribution</li>
              <li>Waste heat export and water performance</li>
              <li>Renewable energy and carbon attribution</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── TWO TOOLS ── */}
      <div className="hc-landing-section" id="platform">
        <div className="hc-section-eyebrow">TOOLS</div>
        <h2 className="hc-section-title">Two ways in.</h2>
        <div className="hc-3col-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 800 }}>
          <div className="hc-feature-card" style={{ cursor: 'pointer' }} onClick={onDemo}>
            <div className="hc-feature-card-tag">COMPLIANCE DASHBOARD</div>
            <div className="hc-feature-card-title">Live compliance monitoring</div>
            <div className="hc-feature-card-body" style={{ marginBottom: 20 }}>
              Real-time KPI calculation, EU threshold validation, gap flagging, and historical trends across your facility portfolio.
            </div>
            <button className="hc-btn-primary" onClick={onDemo} style={{ fontSize: 13, padding: '10px 20px' }}>
              Request Access →
            </button>
          </div>
          <div className="hc-feature-card" style={{ cursor: 'pointer' }} onClick={onAudit}>
            <div className="hc-feature-card-tag">EED READINESS AUDIT</div>
            <div className="hc-feature-card-title">Know your gaps before the deadline</div>
            <div className="hc-feature-card-body" style={{ marginBottom: 20 }}>
              15-minute self-assessment across all 24 EED KPIs. Red / amber / green readiness score. Free, no commitment.
            </div>
            <button className="hc-btn-ghost" onClick={onAudit} style={{ fontSize: 13, padding: '9px 20px' }}>
              Start Free Audit →
            </button>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="hc-landing-cta">
        <div className="hc-landing-cta-title">
          Ready for the <em>next deadline</em>?
        </div>
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
              HeatCert is a product of <a href="https://www.respire.icu/" target="_blank" rel="noopener noreferrer" className="hc-studio-link">Respire</a> — a venture studio focused on accelerating the climate transition. Respire builds purpose-driven software and hardware ventures that help operators, developers, and asset managers meet the demands of a decarbonising economy.
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
              <div className="hc-studio-fact-value">Purpose-built software and hardware ventures</div>
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
