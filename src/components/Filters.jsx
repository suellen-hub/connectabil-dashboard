import { useState } from 'react'
import { useFiltro } from '../context/FiltroContext'

const IS_LIST = [
  { key: 'Vanuza', label: 'Vanuza' },
  { key: 'Thalita', label: 'Thalita' },
  { key: 'Vitória Boss', label: 'Vitória Boss' },
  { key: 'Daiane', label: 'Daiane' },
  { key: 'Outros', label: 'Outros' },
  { key: null, label: 'Em branco' },
]

const PERIODOS = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Esta semana' },
  { key: 'mes', label: 'Mês atual' },
  { key: 'anterior', label: 'Mês anterior' },
  { key: 'custom', label: 'Entre datas' },
]

export function Filters() {
  const { periodo, dataInicio, dataFim, selectedIS, setPeriodoPreset, setDataInicio, setDataFim, toggleIS } = useFiltro()
  const [showDates, setShowDates] = useState(false)

  return (
    <div className="filters">
      <div style={{ display:'flex', gap:6 }}>
        {PERIODOS.map(p => (
          <button
            key={p.key}
            className={`filter-btn ${periodo === p.key ? 'active' : ''}`}
            onClick={() => {
              if (p.key === 'custom') setShowDates(true)
              else { setShowDates(false); setPeriodoPreset(p.key) }
            }}
          >{p.label}</button>
        ))}
      </div>
      {showDates && (
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)}
            style={{ padding:'4px 8px', border:'1px solid var(--border)', borderRadius:6, fontSize:12 }}/>
          <span style={{ color:'var(--text-muted)' }}>até</span>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
            style={{ padding:'4px 8px', border:'1px solid var(--border)', borderRadius:6, fontSize:12 }}/>
        </div>
      )}
      <div style={{ display:'flex', gap:12, marginLeft:8, paddingLeft:12, borderLeft:'1px solid var(--border)' }}>
        {IS_LIST.map(({ key, label }) => (
          <label key={label} className={`is-check ${selectedIS.includes(key) ? 'checked' : ''}`}>
            <input type="checkbox" checked={selectedIS.includes(key)}
              onChange={() => toggleIS(key)}/>
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}
