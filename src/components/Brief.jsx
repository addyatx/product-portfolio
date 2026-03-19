import { useState } from 'react'

const sections = [
  { key: 'problem', label: 'Problem', color: '#E8956A' },
  { key: 'signal', label: 'User Signal', color: '#22C55E' },
  { key: 'solution', label: 'Solution Rationale', color: '#185FA5' },
  { key: 'openQuestions', label: 'Open Questions', color: '#9F97DD' },
]

export default function Brief({ brief }) {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ paddingTop: 16 }}>
      <p style={{ fontSize: 12, color: 'var(--hb-text-tertiary)', lineHeight: 1.6, marginBottom: 16 }}>
        Background and rationale for this design. Expand any section.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {sections.map(sec => {
          const isOpen = open === sec.key
          const content = brief[sec.key]
          return (
            <div key={sec.key} style={{ borderBottom: '1px solid var(--hb-border-light)' }}>
              <button
                onClick={() => setOpen(isOpen ? null : sec.key)}
                style={{
                  all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  gap: 10, width: '100%', padding: '13px 0', fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: sec.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--hb-text)', flex: 1 }}>{sec.label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'var(--hb-text-tertiary)', flexShrink: 0 }}>
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isOpen && (
                <div style={{ paddingBottom: 16 }}>
                  {Array.isArray(content) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {content.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: sec.color, background: `${sec.color}15`, borderRadius: 4, padding: '2px 5px', flexShrink: 0, marginTop: 1, fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                          <p style={{ fontSize: 13, color: 'var(--hb-text-secondary)', lineHeight: 1.6 }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--hb-text-secondary)', lineHeight: 1.65 }}>{content}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
