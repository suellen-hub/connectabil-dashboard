import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer, ReferenceLine } from 'recharts'
import { brl, brlK } from '../lib/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'white', border:'1px solid #E8E8EE', borderRadius:8, padding:'10px 14px', fontSize:12, boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ fontWeight:700, marginBottom:6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, color: p.color, marginBottom:2 }}>
          <span>{p.name}</span>
          <span style={{ fontWeight:600 }}>{brl(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function GraficoReceita({ data }) {
  if (!data?.length) return (
    <div className="card card-accent" style={{ gridColumn:'1/-1' }}>
      <div className="section-title">Receita Diária</div>
      <div className="skeleton" style={{ height: 220 }} />
    </div>
  )

  return (
    <div className="card card-accent" style={{ gridColumn:'1/-1' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div className="section-title">Receita Diária — {new Date().toLocaleString('pt-BR',{month:'long',year:'numeric'})}</div>
        <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--text-muted)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:10, height:10, borderRadius:2, background:'var(--green)', display:'inline-block' }}/>
            Transacional
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:10, height:10, borderRadius:2, background:'var(--purple)', display:'inline-block' }}/>
            SaaS
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:10, height:1, background:'#9CA3AF', display:'inline-block' }}/>
            Meta/dia
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top:0, right:10, left:10, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
          <XAxis dataKey="dia" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false}/>
          <YAxis tickFormatter={v => brlK(v)} tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} width={55}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Bar dataKey="trans" name="Transacional" stackId="a" fill="var(--green)" radius={[0,0,0,0]}/>
          <Bar dataKey="saas" name="SaaS" stackId="a" fill="var(--purple)" radius={[3,3,0,0]}/>
          <Line dataKey="meta" name="Meta/dia" type="monotone" stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
