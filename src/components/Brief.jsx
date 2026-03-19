import { useState } from 'react'

const sections = [
  { key: 'problem', label: 'Problem', icon: '⚠', color: '#E8956A' },
  { key: 'signal', label: 'User Signal', icon: '◎', color: '#22C55E' },
  { key: 'solution', label: 'Solution Rationale', icon: '◈', color: '#185FA5' },
  { key: 'openQuestions', label: 'Open Questions', icon: '?', color: '#9F97DD' },
]

export default function Brief({ brief }) {
  const [open, setOpen] = useState('problem')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {sections.map(sec => {
        const isOpen = open === sec.key
        const content = brief[sec.key]
        return (
          <div
            key={sec.key}
            style={{
              borderBottom: '1px solid var(--hb-border-light)',
            }}
          >
            {/* Section header */}
            <button
              onClick={() => setOpen(isOpen ? null : sec.key)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '14px 0',
                transition: 'opacity 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: `${sec.color}18`,
                border: `1px solid ${sec.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: sec.color,
                flexShrink: 0,
                fontFamily: 'var(--font-mono)',
              }}>
                {sec.icon}
              </span>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--hb-text)',
                flex: 1,
              }}>
                {sec.label}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: 'var(--hb-text-tertiary)',
                  flexShrink: 0,
                }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Section content */}
            {isOpen && (
              <div style={{ paddingBottom: 16 }}>
                {Array.isArray(content) ? (
                  <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                    {content.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          background: `${sec.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 700,
                          color: sec.color,
                          flexShrink: 0,
                          marginTop: 1,
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {i + 1}
                        </span>
                        <p style={{
                          fontSize: 13,
                          color: 'var(--hb-text-secondary)',
                          lineHeight: 1.65,
                        }}>
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    fontSize: 13,
                    color: 'var(--hb-text-secondary)',
                    lineHeight: 1.65,
                  }}>
                    {content}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
