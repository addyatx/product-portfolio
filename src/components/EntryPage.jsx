import { useParams, useNavigate } from 'react-router-dom'
import { useState, Suspense, lazy } from 'react'
import { entries } from '../data/entries.js'
import Brief from './Brief.jsx'
import WhatChanged from './WhatChanged.jsx'

const prototypes = {
  'tag-trigger-logic': lazy(() => import('../prototypes/TagLogicPrototype.jsx')),
  'pipeline-tag-actions': lazy(() => import('../prototypes/PipelineTagsPrototype.jsx')),
}

export default function EntryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = entries.find(e => e.id === id)
  const [activeTab, setActiveTab] = useState('what-changed')
  const [dismissed, setDismissed] = useState(false)

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
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{entry.title}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{entry.subtitle}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{entry.area}</span>
      </header>

      {/* Split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>

        {/* Left: prototype */}
        <div style={{ overflow: 'hidden', background: '#ECEAE5', position: 'relative', borderRight: '1px solid var(--hb-border)', display: 'flex', flexDirection: 'column' }}>

          {/* Start here banner */}
          {!dismissed && (
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              zIndex: 50, display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--hb-navy)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              maxWidth: 460, width: 'calc(100% - 48px)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'var(--hb-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="var(--hb-navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, flex: 1 }}>
                <strong style={{ color: '#fff', fontWeight: 600 }}>Start here: </strong>
                {entry.startHere}
              </span>
              <button
                onClick={() => setDismissed(true)}
                style={{
                  all: 'unset', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
                  fontSize: 16, lineHeight: 1, padding: 4, flexShrink: 0,
                  transition: 'color 0.15s', fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >✕</button>
            </div>
          )}

          {/* Prototype label */}
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 40, pointerEvents: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(26,25,23,0.65)',
              backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <path d="M5 3v2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="5" cy="7" r="0.5" fill="rgba(255,255,255,0.35)"/>
              </svg>
              Prototype — some UI elements are decorative only
            </div>
          </div>

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

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff', borderLeft: '1px solid var(--hb-border)' }}>
          {/* Panel header */}
          <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--hb-text)', marginBottom: 4, letterSpacing: '-0.01em' }}>
              {entry.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--hb-text-tertiary)', fontWeight: 400, marginBottom: 16 }}>
              {entry.subtitle}
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--hb-border)', marginTop: 4 }}>
              {[
                { key: 'what-changed', label: 'What changed' },
                { key: 'try', label: 'Try these' },
                { key: 'brief', label: 'Brief' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    all: 'unset', cursor: 'pointer', padding: '8px 12px 9px',
                    fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400,
                    color: activeTab === tab.key ? 'var(--hb-text)' : 'var(--hb-text-tertiary)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--hb-text)' : '2px solid transparent',
                    marginBottom: -1, transition: 'color 0.15s', fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {activeTab === 'what-changed' && <WhatChanged steps={entry.whatChanged} />}
            {activeTab === 'try' && <TryThese items={entry.tryThese} />}
            {activeTab === 'brief' && <Brief brief={entry.brief} />}
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
    <div style={{ paddingTop: 16 }}>
      <p style={{ fontSize: 12, color: 'var(--hb-text-tertiary)', lineHeight: 1.6, marginBottom: 16 }}>
        These are the interactions wired up in this prototype. Check them off as you explore.
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
