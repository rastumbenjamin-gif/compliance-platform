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
        <div className="hc-hero-badge">EU ENERGY EFFICIENCY COMPLIANCE</div>
        <h1 className="hc-hero-title">
          Data centres are on their way<br />to becoming <em>critical assets</em>.
        </h1>
        <p className="hc-hero-sub">
          Sustainability is an umbrella term — it encompasses both compliance with a growing set of stringent requirements and the ability to withstand changes in a volatile world. Both resilience and compliance are essential.
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
            <div className="hc-hero-stat-num">$108B</div>
            <div className="hc-hero-stat-label">EU DC Market by 2031</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">13.07%</div>
            <div className="hc-hero-stat-label">Annual market growth (CAGR)</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">70%</div>
            <div className="hc-hero-stat-label">Non-compliance rate, EED 2024</div>
          </div>
          <div>
            <div className="hc-hero-stat-num">2,000+</div>
            <div className="hc-hero-stat-label">Data centres required to report</div>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── MARKET ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">MARKET OVERVIEW</div>
        <h2 className="hc-section-title">
          The European data centre market is growing at <em>13.07% CAGR</em>
        </h2>
        <p className="hc-section-sub">
          From $23.93 billion in 2025 to $108.92 billion by 2031. As the market scales, so does the compliance burden — EED, EnEfG, Clean Industrial Act, and Green Procurement are reshaping the operating landscape.
        </p>
        <div className="hc-stats-grid">
          <div className="hc-stat-block">
            <div className="hc-stat-block-num">$23.93B</div>
            <div className="hc-stat-block-year">2025 · BASE YEAR</div>
            <div className="hc-stat-block-desc">Current EU data centre market size. First EED reporting deadline already passed — 70% of facilities non-compliant.</div>
          </div>
          <div className="hc-stat-block">
            <div className="hc-stat-block-num">$58.93B</div>
            <div className="hc-stat-block-year">2026 · GROWTH PHASE</div>
            <div className="hc-stat-block-desc">Market nearly doubles. German EnEfG fines begin, ERF 10% requirement takes effect July 2026.</div>
          </div>
          <div className="hc-stat-block">
            <div className="hc-stat-block-num">$108.92B</div>
            <div className="hc-stat-block-year">2031 · PROJECTION</div>
            <div className="hc-stat-block-desc">Compliance becomes a licence to operate. Major players: Equinix, Google, Microsoft, AWS, Digital Realty.</div>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── MISSIONS ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">PLATFORM SCOPE</div>
        <h2 className="hc-section-title">Three layers. One mission.</h2>
        <p className="hc-section-sub">
          Data centres operate at the intersection of setup decisions, operational demands, and optimisation constraints. Regulatory compliance runs through all three layers.
        </p>
        <div className="hc-3col-grid">
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">SETUP</div>
            <div className="hc-feature-card-title">Site selection & design</div>
            <div className="hc-feature-card-body">
              Site selection, design, defining mode of operation, planning, permitting, and construction. Retrofitting and conversion of existing data centres also fall here. The most favourable setup is composed of numerous decisions that determine operational capacity.
            </div>
          </div>
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">OPERATION</div>
            <div className="hc-feature-card-title">Resilience under pressure</div>
            <div className="hc-feature-card-body">
              Data centre operation is reliant on an increasingly rare stable physical environment, as well as ongoing grid capacity, which is equally under pressure. Relentless commercial needs complete a picture where these assets are subject to a growing stack of operational demands.
            </div>
          </div>
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">OPTIMIZATION</div>
            <div className="hc-feature-card-title">Regulatory compliance</div>
            <div className="hc-feature-card-body">
              Data centres face increasing demands and are required to operate within stricter sustainability and regulatory parameters. What are the levers that make optimisation possible? HeatCert surfaces the data, the benchmarks, and the action plan.
            </div>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── SERVICES ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">WHAT WE DO</div>
        <h2 className="hc-section-title">Full service sustainability reporting</h2>
        <p className="hc-section-sub">
          Three regulatory frameworks. One integrated platform. From data collection and validation through to benchmarking and improvement planning.
        </p>
        <div className="hc-3col-grid">
          <div className="hc-service-card">
            <div className="hc-service-card-label">EU REGULATION 2024/1364</div>
            <div className="hc-service-card-title">Energy Efficiency Directive</div>
            <ul className="hc-service-items">
              <li>Data collection across 24 KPIs</li>
              <li>Data validation &amp; quality checks</li>
              <li>Benchmarking against EU thresholds</li>
              <li>Improvement planning &amp; gap analysis</li>
              <li>Annual submission workflow</li>
            </ul>
          </div>
          <div className="hc-service-card">
            <div className="hc-service-card-label">EU CLEAN INDUSTRIAL ACT</div>
            <div className="hc-service-card-title">Clean Industrial Act</div>
            <ul className="hc-service-items">
              <li>Data centre circularity mapping</li>
              <li>Verification of NetZero operations</li>
              <li>Waste heat reuse documentation</li>
              <li>ERF calculation &amp; compliance</li>
            </ul>
          </div>
          <div className="hc-service-card">
            <div className="hc-service-card-label">EU PROCUREMENT DIRECTIVE</div>
            <div className="hc-service-card-title">Green Procurement Directive</div>
            <ul className="hc-service-items">
              <li>"Made in EU" threshold tracking</li>
              <li>Sourced product compliance (24%)</li>
              <li>Supply chain documentation</li>
              <li>Procurement audit trail</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hc-section-divider" />

      {/* ── ENERGY EFFICIENCY PRINCIPLE ── */}
      <div className="hc-landing-section">
        <div className="hc-section-eyebrow">ENERGY EFFICIENCY PRINCIPLE</div>
        <h2 className="hc-section-title">The three pillars of data centre <em>efficiency</em></h2>
        <div className="hc-3col-grid">
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">WATER</div>
            <div className="hc-feature-card-title">Water efficiency</div>
            <div className="hc-feature-card-body">
              Track WUE (Water Usage Effectiveness) against EU delegated regulation thresholds. Monitor cooling water consumption and identify reduction opportunities.
            </div>
          </div>
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">ENERGY</div>
            <div className="hc-feature-card-title">Energy demand optimisation</div>
            <div className="hc-feature-card-body">
              PUE monitoring, GPU-level energy measurement via Zeus integration, renewable energy factor tracking, and real-time optimisation recommendations.
            </div>
          </div>
          <div className="hc-feature-card">
            <div className="hc-feature-card-tag">REPORTING</div>
            <div className="hc-feature-card-title">Auditing &amp; reporting demands</div>
            <div className="hc-feature-card-body">
              End-to-end EED submission workflow, German EnEfG compliance (deadlines: 31 March 2026), and automated data validation before submission.
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="hc-landing-cta">
        <div className="hc-landing-cta-title">
          Explore the <em>platform</em>
        </div>
        <p className="hc-landing-cta-sub">
          Run through the live compliance dashboard, or start your EED readiness audit — free, no commitment, 15 minutes.
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
