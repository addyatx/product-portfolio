import { useParams, useNavigate } from 'react-router-dom'
import { useState, Suspense, lazy } from 'react'
import { entries } from '../data/entries.js'
import Brief from './Brief.jsx'

const prototypes = {
  'tag-trigger-logic': lazy(() => import('../prototypes/TagLogicPrototype.jsx')),
  'pipeline-tag-actions': lazy(() => import('../prototypes/PipelineTagsPrototype.jsx')),
}

export default function EntryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = entries.find(e => e.id === id)
  const [showHints, setShowHints] = useState(false)
  const [activeTab, setActiveTab] = useState('try')

  if (!entry) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <button onClick={() => navigate('/')}>Back to home</button>
      </div>
    )
  }

  const Proto = prototypes[id]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--hb-warm-white)', overflow: 'hidden' }}>
      {/* Top bar */}
      <header style={{
        height: 52, background: 'var(--hb-navy)',
        display: 'flex', alignItems: 'center', paddingInline: 20, gap: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '4px 10px', borderRadius: 6,
            transition: 'color 0.15s, background 0.15s', fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M9 6H3M5.5 3L3 6l2.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Portfolio
        </button>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{entry.title}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{entry.subtitle}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{entry.area}</span>
        <button
          onClick={() => setShowHints(h => !h)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 6,
            border: `1px solid ${showHints ? 'var(--hb-yellow)' : 'rgba(255,255,255,0.2)'}`,
            background: showHints ? 'var(--hb-yellow)' : 'transparent',
            color: showHints ? 'var(--hb-navy)' : 'rgba(255,255,255,0.6)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)',
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

      {/* Split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>

        {/* Left: prototype */}
        <div style={{ overflow: 'hidden', background: '#ECEAE5', position: 'relative', borderRight: '1px solid var(--hb-border)', display: 'flex', flexDirection: 'column' }}>
          {/* Prototype label */}
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(26,25,23,0.7)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <path d="M5 3v2.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="5" cy="7" r="0.5" fill="rgba(255,255,255,0.4)"/>
              </svg>
              Prototype — some UI elements are decorative only
            </div>
          </div>

          {showHints && <HotspotsOverlay hotspots={entry.hotspots} protoId={entry.id} />}

          <div style={{ flex: 1, overflow: 'auto' }}>
            <Suspense fallback={
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hb-text-tertiary)', fontSize: 13 }}>
                Loading prototype...
              </div>
            }>
              {Proto && <Proto />}
            </Suspense>
          </div>
        </div>

        {/* Right: brief panel */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff', borderLeft: '1px solid var(--hb-border)' }}>
          {/* Panel header */}
          <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--hb-text)', marginBottom: 4, letterSpacing: '-0.01em' }}>{entry.title}</div>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: 'var(--hb-yellow)', background: 'var(--hb-navy)', padding: '2px 8px', borderRadius: 4, marginBottom: 16 }}>{entry.subtitle}</div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--hb-border)', marginTop: 4 }}>
              {[
                { key: 'try', label: 'Try these' },
                { key: 'brief', label: 'Brief' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    all: 'unset', cursor: 'pointer', padding: '8px 16px 9px',
                    fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400,
                    color: activeTab === tab.key ? 'var(--hb-text)' : 'var(--hb-text-tertiary)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--hb-text)' : '2px solid transparent',
                    marginBottom: -1, transition: 'color 0.15s', fontFamily: 'var(--font-body)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {activeTab === 'brief' ? <Brief brief={entry.brief} /> : <TryThese items={entry.tryThese} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function TryThese({ items }) {
  const [checked, setChecked] = useState(new Set())
  const toggle = (i) => setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })

  return (
    <div style={{ paddingTop: 20 }}>
      <p style={{ fontSize: 12, color: 'var(--hb-text-tertiary)', lineHeight: 1.6, marginBottom: 16 }}>
        Tap each interaction as you explore — these are the flows wired up in this prototype.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              all: 'unset', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '11px 14px', borderRadius: 10,
              border: `1px solid ${checked.has(i) ? '#22C55E40' : 'var(--hb-border)'}`,
              background: checked.has(i) ? '#22C55E08' : 'transparent',
              transition: 'all 0.15s', textAlign: 'left', fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { if (!checked.has(i)) e.currentTarget.style.background = 'var(--hb-warm-white)'; }}
            onMouseLeave={e => { if (!checked.has(i)) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
              border: checked.has(i) ? 'none' : '1.5px solid var(--hb-border)',
              background: checked.has(i) ? '#22C55E' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
            }}>
              {checked.has(i) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: checked.has(i) ? 'var(--hb-text-tertiary)' : 'var(--hb-text-secondary)', lineHeight: 1.55, textDecoration: checked.has(i) ? 'line-through' : 'none', transition: 'all 0.15s' }}>
              {item}
            </span>
          </button>
        ))}
      </div>
      {checked.size === items.length && items.length > 0 && (
        <div style={{ marginTop: 16, padding: '11px 16px', borderRadius: 10, background: '#22C55E12', border: '1px solid #22C55E30', fontSize: 13, color: '#22C55E', fontWeight: 600, textAlign: 'center' }}>
          All interactions explored ✓
        </div>
      )}
    </div>
  )
}

// Hotspot positions per prototype
const HOTSPOT_POSITIONS = {
  'tag-trigger-logic': [
    { top: '120px', left: '16px' },
    { top: '180px', left: '16px' },
    { top: '250px', left: '16px' },
    { top: '360px', left: '16px' },
  ],
  'pipeline-tag-actions': [
    { top: '370px', left: '555px' },
    { top: '420px', left: '555px' },
    { top: '210px', left: '16px' },
    { top: '370px', right: '16px' },
    { top: '420px', right: '16px' },
  ],
}

function HotspotsOverlay({ hotspots, protoId }) {
  const [active, setActive] = useState(null)
  const positions = HOTSPOT_POSITIONS[protoId] || []

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }}>
      <style>{`
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:0.5; } 50% { transform:scale(1.5); opacity:0.15; } }
      `}</style>
      {hotspots.map((hs, i) => {
        const pos = positions[i] || { top: `${80 + i * 56}px`, left: '16px' }
        const isActive = active === hs.id
        return (
          <div key={hs.id} style={{ position: 'absolute', ...pos, pointerEvents: 'all' }}>
            <div style={{ position: 'relative', width: 28, height: 28 }}>
              <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', background: 'rgba(245,242,51,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />
              <button
                onClick={() => setActive(isActive ? null : hs.id)}
                style={{
                  position: 'relative', zIndex: 1, width: 28, height: 28, borderRadius: '50%',
                  background: isActive ? 'var(--hb-yellow)' : 'var(--hb-navy)',
                  border: `2px solid ${isActive ? 'var(--hb-yellow)' : 'rgba(245,242,51,0.7)'}`,
                  color: isActive ? 'var(--hb-navy)' : 'var(--hb-yellow)',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', fontFamily: 'var(--font-mono)',
                }}
              >
                {hs.label}
              </button>
            </div>
            {isActive && (
              <div style={{
                position: 'absolute', top: 36, left: 0, background: 'var(--hb-navy)',
                border: '1px solid rgba(245,242,51,0.2)', borderRadius: 10,
                padding: '10px 14px', minWidth: 220, maxWidth: 260,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 100,
              }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, marginBottom: 6 }}>{hs.description}</p>
                <p style={{ fontSize: 11, color: 'var(--hb-yellow)', opacity: 0.75 }}>→ {hs.hint}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
