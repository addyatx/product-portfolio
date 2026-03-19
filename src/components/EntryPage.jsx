import { useParams, useNavigate } from 'react-router-dom'
import { useState, Suspense, lazy } from 'react'
import { entries } from '../data/entries.js'
import Brief from './Brief.jsx'

// Lazy-load prototypes so they don't bloat the home page bundle
const prototypes = {
  'tag-trigger-logic': lazy(() => import('../prototypes/TagLogicPrototype.jsx')),
  'pipeline-tag-actions': lazy(() => import('../prototypes/PipelineTagsPrototype.jsx')),
}

export default function EntryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = entries.find(e => e.id === id)
  const [showHints, setShowHints] = useState(false)
  const [activeTab, setActiveTab] = useState('brief') // 'brief' | 'try'

  if (!entry) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Entry not found.</p>
        <button onClick={() => navigate('/')}>Back to home</button>
      </div>
    )
  }

  const Proto = prototypes[id]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--hb-warm-white)',
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <header style={{
        height: 52,
        background: 'var(--hb-navy)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 20,
        gap: 12,
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'rgba(255,255,255,0.45)',
            padding: '4px 8px',
            borderRadius: 6,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M9 6H3M5.5 3L3 6l2.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Portfolio
        </button>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />

        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#FFFFFF',
          }}>
            {entry.title}
          </span>
          <span style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.35)',
            marginLeft: 8,
          }}>
            {entry.subtitle}
          </span>
        </div>

        {/* Area badge */}
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {entry.area}
        </span>

        {/* Hint toggle */}
        <button
          onClick={() => setShowHints(h => !h)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 6,
            border: `1px solid ${showHints ? 'rgba(245,242,51,0.4)' : 'rgba(255,255,255,0.15)'}`,
            background: showHints ? 'rgba(245,242,51,0.1)' : 'transparent',
            color: showHints ? 'var(--hb-yellow)' : 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="6" cy="4.5" r="0.75" fill="currentColor"/>
            <path d="M6 6.5v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {showHints ? 'Hide hints' : 'Show hints'}
        </button>
      </header>

      {/* Main split */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        overflow: 'hidden',
      }}>
        {/* Left: prototype */}
        <div style={{
          overflow: 'auto',
          background: '#F0EFEb',
          position: 'relative',
          borderRight: '1px solid var(--hb-border)',
        }}>
          {/* Prototype disclaimer */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            pointerEvents: 'none',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(26,25,23,0.75)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
              whiteSpace: 'nowrap',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <path d="M5 3v2.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="5" cy="7" r="0.5" fill="rgba(255,255,255,0.4)"/>
              </svg>
              Prototype — some UI elements are decorative only
            </div>
          </div>

          {/* Hotspot hint bubbles overlay */}
          {showHints && (
            <HotspotsOverlay hotspots={entry.hotspots} protoId={entry.id} />
          )}

          <Suspense fallback={
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--hb-text-tertiary)',
              fontSize: 13,
            }}>
              Loading prototype...
            </div>
          }>
            {Proto && <Proto />}
          </Suspense>
        </div>

        {/* Right: brief panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--hb-card-bg)',
        }}>
          {/* Panel header */}
          <div style={{
            padding: '20px 24px 0',
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--hb-text)',
              marginBottom: 4,
              letterSpacing: '-0.01em',
            }}>
              {entry.title}
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--hb-yellow)',
              fontWeight: 500,
              marginBottom: 16,
              background: '#1A1917',
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 4,
            }}>
              {entry.subtitle}
            </div>

            {/* Tab switcher */}
            <div style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid var(--hb-border)',
              marginTop: 4,
            }}>
              {[
                { key: 'brief', label: 'Brief' },
                { key: 'try', label: `Try these (${entry.tryThese.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 16px 9px',
                    fontSize: 12,
                    fontWeight: activeTab === tab.key ? 600 : 400,
                    color: activeTab === tab.key ? 'var(--hb-text)' : 'var(--hb-text-tertiary)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--hb-text)' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'color 0.15s',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 24px 24px',
          }}>
            {activeTab === 'brief' ? (
              <Brief brief={entry.brief} />
            ) : (
              <TryThese items={entry.tryThese} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TryThese({ items }) {
  const [checked, setChecked] = useState(new Set())

  function toggle(i) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <p style={{
        fontSize: 12,
        color: 'var(--hb-text-tertiary)',
        lineHeight: 1.6,
        marginBottom: 20,
      }}>
        These are the key interactions wired up in this prototype. Check them off as you explore.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${checked.has(i) ? '#22C55E30' : 'var(--hb-border)'}`,
              background: checked.has(i) ? '#22C55E08' : 'transparent',
              transition: 'all 0.15s',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => {
              if (!checked.has(i)) e.currentTarget.style.background = 'var(--hb-off-white)'
            }}
            onMouseLeave={e => {
              if (!checked.has(i)) e.currentTarget.style.background = 'transparent'
            }}
          >
            {/* Checkbox */}
            <div style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              border: checked.has(i) ? 'none' : '1.5px solid var(--hb-border)',
              background: checked.has(i) ? '#22C55E' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              transition: 'all 0.15s',
            }}>
              {checked.has(i) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{
              fontSize: 13,
              color: checked.has(i) ? 'var(--hb-text-tertiary)' : 'var(--hb-text-secondary)',
              lineHeight: 1.55,
              textDecoration: checked.has(i) ? 'line-through' : 'none',
              transition: 'all 0.15s',
            }}>
              {item}
            </span>
          </button>
        ))}
      </div>
      {checked.size === items.length && items.length > 0 && (
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          borderRadius: 10,
          background: '#22C55E12',
          border: '1px solid #22C55E30',
          fontSize: 13,
          color: '#22C55E',
          fontWeight: 500,
          textAlign: 'center',
        }}>
          All interactions explored ✓
        </div>
      )}
    </div>
  )
}

// Hotspot hint overlay — renders numbered callout bubbles at predefined positions
const HOTSPOT_POSITIONS = {
  'tag-trigger-logic': [
    { top: '155px', left: '30px' },
    { top: '240px', left: '30px' },
    { top: '300px', left: '30px' },
    { top: '420px', left: '30px' },
  ],
  'pipeline-tag-actions': [
    { top: '260px', right: '90px' },
    { top: '260px', right: '40px' },
    { top: '215px', left: '20px' },
    { top: '340px', right: '40px' },
    { top: '340px', right: '80px' },
  ],
}

function HotspotsOverlay({ hotspots, protoId }) {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const positions = HOTSPOT_POSITIONS[protoId] || []

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 40,
      pointerEvents: 'none',
    }}>
      {hotspots.map((hs, i) => {
        const pos = positions[i] || { top: `${60 + i * 60}px`, left: '20px' }
        const isActive = activeHotspot === hs.id
        return (
          <div
            key={hs.id}
            style={{
              position: 'absolute',
              ...pos,
              pointerEvents: 'all',
            }}
          >
            {/* Pulsing ring */}
            <div style={{
              position: 'relative',
              width: 28,
              height: 28,
            }}>
              <div style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                background: 'rgba(245,242,51,0.15)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <button
                onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isActive ? 'var(--hb-yellow)' : 'var(--hb-navy)',
                  border: `2px solid ${isActive ? 'var(--hb-yellow)' : 'rgba(245,242,51,0.6)'}`,
                  color: isActive ? 'var(--hb-navy)' : 'var(--hb-yellow)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {hs.label}
              </button>
            </div>

            {/* Tooltip */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 36,
                left: 0,
                background: 'var(--hb-navy)',
                border: '1px solid rgba(245,242,51,0.25)',
                borderRadius: 10,
                padding: '10px 14px',
                minWidth: 220,
                maxWidth: 280,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                zIndex: 100,
              }}>
                <p style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.55,
                  marginBottom: 6,
                }}>
                  {hs.description}
                </p>
                <p style={{
                  fontSize: 11,
                  color: 'var(--hb-yellow)',
                  opacity: 0.7,
                }}>
                  → {hs.hint}
                </p>
              </div>
            )}
          </div>
        )
      })}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
