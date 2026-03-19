import { useNavigate } from 'react-router-dom'
import { entries } from '../data/entries.js'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hb-warm-white)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <header style={{
        height: 56, background: 'var(--hb-navy)',
        display: 'flex', alignItems: 'center', paddingInline: 40, gap: 12, flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--hb-yellow)', textTransform: 'uppercase' }}>
          HONEYBOOK
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)', marginInline: 8 }} />
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Product Portfolio</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Internal</div>
          <div style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(245,242,51,0.15)', border: '1px solid rgba(245,242,51,0.3)', fontSize: 11, fontWeight: 600, color: 'var(--hb-yellow)' }}>v0.1</div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '80px 40px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--hb-navy)', color: 'var(--hb-yellow)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, marginBottom: 24 }}>
            Adam Sutton · Product Specialist
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 700, color: 'var(--hb-text)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Interactive prototypes<br />for HoneyBook<br />product decisions.
          </h1>
          <p style={{ fontSize: 15, color: 'var(--hb-text-secondary)', lineHeight: 1.7, maxWidth: 440 }}>
            Each entry pairs a working prototype with a structured brief covering the problem, user signal, solution rationale, and open questions.
          </p>
        </div>
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'flex-end', animationDelay: '0.1s' }}>
          <div style={{ background: 'var(--hb-navy)', borderRadius: 20, padding: '32px 36px', width: 300 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>This portfolio</div>
            {[
              { label: 'Entries', value: `${entries.length}` },
              { label: 'Areas covered', value: [...new Set(entries.map(e => e.area))].join(', ') },
              { label: 'Audience', value: 'PMs + Engineers' },
              { label: 'Status', value: 'In Review' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBlock: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--hb-border)', marginInline: 40 }} />

      {/* Cards */}
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 40px 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--hb-text-tertiary)', textTransform: 'uppercase', marginBottom: 24 }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
        <div className="card-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onClick={() => navigate(`/entry/${entry.id}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EntryCard({ entry, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fade-up"
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid var(--hb-border)', borderRadius: 16, padding: 28, transition: 'box-shadow 0.18s, border-color 0.18s, transform 0.18s', textAlign: 'left' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,31,43,0.1)'; e.currentTarget.style.borderColor = 'var(--hb-navy)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--hb-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--hb-text-tertiary)', textTransform: 'uppercase', background: 'var(--hb-warm-white)', padding: '3px 10px', borderRadius: 20, border: '1px solid var(--hb-border)' }}>
          {entry.area}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: entry.statusColor, background: `${entry.statusColor}15`, border: `1px solid ${entry.statusColor}30`, borderRadius: 20, padding: '3px 10px' }}>
          {entry.status}
        </span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--hb-text)', lineHeight: 1.2, marginBottom: 4, letterSpacing: '-0.01em' }}>{entry.title}</div>
      <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: 'var(--hb-yellow)', background: 'var(--hb-navy)', padding: '2px 8px', borderRadius: 4, marginBottom: 16 }}>{entry.subtitle}</div>
      <p style={{ fontSize: 13, color: 'var(--hb-text-secondary)', lineHeight: 1.65, marginBottom: 24, flex: 1 }}>{entry.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {entry.tags.map(tag => (
          <span key={tag} style={{ fontSize: 11, fontWeight: 500, color: 'var(--hb-text-secondary)', background: 'var(--hb-warm-white)', border: '1px solid var(--hb-border)', borderRadius: 20, padding: '3px 10px' }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--hb-border)' }}>
        <span style={{ fontSize: 12, color: 'var(--hb-text-tertiary)' }}>{entry.date}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--hb-navy)', display: 'flex', alignItems: 'center', gap: 4 }}>
          View prototype
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
    </button>
  )
}
