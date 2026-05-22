export function KPICard({ label, value, sub, color = 'var(--blue)', progress, accent = true, badge, children }) {
  const pctNum = typeof progress === 'number' ? Math.min(progress * 100, 100) : null
  const barColor = pctNum >= 80 ? 'var(--green)' : pctNum >= 60 ? 'var(--orange)' : 'var(--red)'

  return (
    <div className={`card ${accent ? 'card-accent' : ''}`} style={accent ? { borderTopColor: color } : {}}>
      <div className="label">{label}</div>
      {value !== undefined ? (
        <div className="kpi-value" style={{ color }}>{value}</div>
      ) : (
        <div className="skeleton" style={{ height: 36, width: '70%', marginBottom: 4 }} />
      )}
      {sub && <div className="kpi-sub">{sub}</div>}
      {badge && <div style={{ marginTop: 6 }}>{badge}</div>}
      {pctNum !== null && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pctNum}%`, background: barColor }} />
        </div>
      )}
      {children}
    </div>
  )
}

export function KPISkeleton() {
  return (
    <div className="card card-accent">
      <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 32, width: '75%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 10, width: '60%' }} />
    </div>
  )
}
