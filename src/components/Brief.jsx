import { useState } from 'react'

const sections = [
  { key: 'problem',  label: 'Problem',            color: '#E8956A' },
  { key: 'signal',   label: 'User Signal',         color: '#22C55E' },
  { key: 'solution', label: 'Solution Rationale',  color: '#185FA5' },
]

export default function Brief({ brief }) {
  const [open, setOpen] = useState('problem')

  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {sections.map(sec => {
          const isOpen = open === sec.key
          const bullets = brief[sec.key] || []
          return (
            <div key={sec.key} style={{ borderBottom: '1px solid var(--hb-border-light)' }}>
              <button
                onClick={() => setOpen(isOpen ? null : sec.key)}
                style={{
                  all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  gap: 10, width: '100%', padding: '13px 0', fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: sec.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--hb-text)', flex: 1 }}>{sec.label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'var(--hb-text-tertiary)', flexShrink: 0 }}>
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isOpen && (
                <ul style={{ listStyle: 'none', paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {bullets.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: sec.color, flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 13, color: 'var(--hb-text-secondary)', lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
