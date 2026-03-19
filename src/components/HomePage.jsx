import { useNavigate } from 'react-router-dom'
import { entries } from '../data/entries.js'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--hb-navy)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top nav */}
      <header style={{
        height: 56,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 32,
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'var(--hb-yellow)',
          textTransform: 'uppercase',
        }}>
          HONEYBOOK
        </div>
        <div style={{
          width: 1,
          height: 16,
          background: 'rgba(255,255,255,0.15)',
          marginInline: 8,
        }} />
        <div style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 400,
        }}>
          Product Portfolio
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Internal
          </div>
          <div style={{
            padding: '3px 10px',
            borderRadius: 20,
            background: 'rgba(245,242,51,0.12)',
            border: '1px solid rgba(245,242,51,0.2)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--hb-yellow)',
            letterSpacing: '0.04em',
          }}>
            v0.1
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        padding: '72px 32px 60px',
        maxWidth: 860,
      }}>
        <div
          className="fade-up"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--hb-yellow)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Adam Sutton · Product Specialist
        </div>
        <h1
          className="fade-up"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            animationDelay: '0.05s',
          }}
        >
          Interactive prototypes<br />for HoneyBook product decisions.
        </h1>
        <p
          className="fade-up"
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            maxWidth: 560,
            animationDelay: '0.1s',
          }}
        >
          Each entry pairs a working prototype with a structured brief covering the problem, user signal, solution rationale, and open questions. Built by Product Specialist → for PMs and engineers.
        </p>
      </div>

      {/* Divider */}
      <div style={{
        marginInline: 32,
        height: 1,
        background: 'rgba(255,255,255,0.07)',
        marginBottom: 40,
      }} />

      {/* Cards grid */}
      <div
        className="card-stagger"
        style={{
          padding: '0 32px 64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
          maxWidth: 1200,
        }}
      >
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onClick={() => navigate(`/entry/${entry.id}`)} />
        ))}
      </div>
    </div>
  )
}

function EntryCard({ entry, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fade-up"
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 28,
        transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.borderColor = 'rgba(245,242,51,0.25)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Area + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}>
          {entry.area}
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: entry.statusColor,
          background: `${entry.statusColor}18`,
          border: `1px solid ${entry.statusColor}35`,
          borderRadius: 20,
          padding: '3px 10px',
          letterSpacing: '0.04em',
        }}>
          {entry.status}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 20,
        fontWeight: 700,
        color: '#FFFFFF',
        lineHeight: 1.2,
        marginBottom: 4,
        letterSpacing: '-0.01em',
      }}>
        {entry.title}
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--hb-yellow)',
        fontWeight: 500,
        marginBottom: 14,
        opacity: 0.8,
      }}>
        {entry.subtitle}
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.6,
        marginBottom: 24,
        flex: 1,
      }}>
        {entry.description}
      </p>

      {/* Tag chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {entry.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '3px 10px',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{entry.date}</span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--hb-yellow)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          View prototype
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </button>
  )
}
