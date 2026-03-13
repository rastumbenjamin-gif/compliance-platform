import React, { useState } from 'react';

export default function RequestAccessForm({ onBack }) {
  const [fields, setFields] = useState({ name: '', email: '', company: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleChange = e => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('https://formsubmit.co/ajax/benjamin@respire.icu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          company: fields.company,
          _subject: `HeatCert access request — ${fields.company}`,
        }),
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) {
        setStatus('success');
        setTimeout(onBack, 2800);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* back */}
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--hc-text-2)', marginBottom: 32,
            fontFamily: "'Space Grotesk', sans-serif", padding: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back
        </button>

        {/* card */}
        <div style={{
          background: 'var(--hc-surface)', border: '1px solid var(--hc-border)',
          borderRadius: 16, padding: '40px 36px', boxShadow: 'var(--hc-card-shadow)',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '2.5px',
            color: 'var(--hc-teal-light)', marginBottom: 10,
          }}>REQUEST ACCESS</div>

          <h2 style={{
            fontSize: 24, fontWeight: 700, color: 'var(--hc-text)',
            margin: '0 0 8px', lineHeight: 1.2,
          }}>Get early access</h2>

          <p style={{ fontSize: 14, color: 'var(--hc-text-2)', margin: '0 0 32px', lineHeight: 1.6 }}>
            We're onboarding pilot partners across Europe. We'll be in touch shortly.
          </p>

          {status === 'success' ? (
            <div style={{
              textAlign: 'center', padding: '32px 0',
              color: 'var(--hc-mint)', fontSize: 15, fontWeight: 600,
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              Request received. We'll be in touch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'name', label: 'Full name', type: 'text', placeholder: 'Jane Smith' },
                { name: 'email', label: 'Work email', type: 'email', placeholder: 'jane@company.com' },
                { name: 'company', label: 'Company', type: 'text', placeholder: 'Data Centre Operator GmbH' },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '1.5px',
                    color: 'var(--hc-text-2)', textTransform: 'uppercase',
                  }}>{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={fields[f.name]}
                    onChange={handleChange}
                    required
                    style={{
                      background: 'var(--hc-bg)', border: '1px solid var(--hc-border)',
                      borderRadius: 8, padding: '12px 14px',
                      fontSize: 14, color: 'var(--hc-text)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--hc-teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--hc-border)'}
                  />
                </div>
              ))}

              {status === 'error' && (
                <div style={{ fontSize: 13, color: '#f87171', padding: '8px 12px', background: 'rgba(248,113,113,0.08)', borderRadius: 6 }}>
                  Something went wrong — please try again or email benjamin@respire.icu
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="hc-btn-primary"
                style={{ marginTop: 8, fontSize: 15, padding: '14px', opacity: status === 'submitting' ? 0.6 : 1 }}
              >
                {status === 'submitting' ? 'Sending…' : 'Request Access →'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--hc-text-3)' }}>
          A <a href="https://www.respire.icu/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--hc-text-2)', textDecoration: 'none' }}>Respire</a> venture
        </div>
      </div>
    </div>
  );
}
