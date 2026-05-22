import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { brl } from '../lib/formatters'

export function RoletaPipeline({ roleta }) {
  const emNeg = roleta.filter(r => r.status === 'Em negociação')
  const vendidos = roleta.filter(r => r.status === 'Vendidos')
  const perdidos = roleta.filter(r => r.status === 'Perdidos')
  const tx = (vendidos.length + perdidos.length) > 0
    ? (vendidos.length / (vendidos.length + perdidos.length) * 100).toFixed(0) : 0

  const origens = {}
  roleta.forEach(r => {
    const o = r.origem || 'Outros'
    origens[o] = (origens[o] || 0) + 1
  })
  const origemData = Object.entries(origens)
    .sort((a,b) => b[1]-a[1])
    .map(([name, value]) => ({ name, value }))

  const cols = [
    { list: perdidos, label: 'Perdidos', bg:'#FEF2F2', border:'#EF4444', txtColor:'#EF4444' },
    { list: emNeg,    label: 'Em Negociação', bg:'#FFFBEB', border:'#F59E0B', txtColor:'#D97706' },
    { list: vendidos, label: 'Vendidos', bg:'#ECFDF5', border:'#07C86F', txtColor:'#065F46' },
  ]

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div className="section-title">Pipeline — Roleta</div>
        <span className="badge badge-green">Taxa conversão: {tx}%</span>
      </div>
      <div className="kanban" style={{ marginBottom:20 }}>
        {cols.map(({ list, label, bg, border, txtColor }) => (
          <div key={label} className="kanban-col" style={{ background:bg, border:`1px solid ${border}` }}>
            <div className="kanban-col-header" style={{ color:txtColor }}>
              <span>{label}</span>
              <span style={{ background:border, color:'white', borderRadius:10, padding:'1px 7px', fontSize:11 }}>{list.length}</span>
            </div>
            {list.map((r, i) => (
              <div key={i} className="kanban-item">
                <div style={{ fontWeight:500 }}>{r.empresa || '—'}</div>
                <div className="origem">{r.responsavel} · {r.origem}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="label" style={{ marginBottom:10 }}>Origem dos Leads</div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={origemData} layout="vertical" margin={{ top:0, right:20, left:0, bottom:0 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" tick={{ fontSize:11, fill:'#6B7280' }} width={120} axisLine={false} tickLine={false}/>
          <Tooltip formatter={(v) => [`${v} leads`, 'Qtd']} contentStyle={{ fontSize:11, borderRadius:6 }}/>
          <Bar dataKey="value" fill="var(--green)" radius={[0,4,4,0]} label={{ position:'right', fontSize:11, fill:'#6B7280' }}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
