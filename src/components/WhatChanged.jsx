export default function WhatChanged({ steps }) {
  return (
    <div style={{ paddingTop: 16 }}>
      <p style={{ fontSize: 12, color: 'var(--hb-text-tertiary)', lineHeight: 1.6, marginBottom: 20 }}>
        A step-by-step walkthrough of what's new or different in this design.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={step.step} style={{ display: 'flex', gap: 14, paddingBottom: 24, position: 'relative' }}>
            {/* Vertical connector line */}
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', left: 13, top: 28, bottom: 0,
                width: 1, background: 'var(--hb-border)',
              }} />
            )}
            {/* Step number */}
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: 'var(--hb-navy)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
              zIndex: 1,
            }}>
              {step.step}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingTop: 3 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--hb-text)', marginBottom: 6, lineHeight: 1.3 }}>
                {step.label}
              </div>
              <p style={{ fontSize: 13, color: 'var(--hb-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                {step.description}
              </p>
              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                background: '#E8F5E9', borderRadius: 8, padding: '8px 12px',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M2 6.5L4.5 9L10 3" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12, color: '#166534', lineHeight: 1.5 }}>{step.after}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
