import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { brl, brlK } from '../lib/formatters'

export function MetaISCard({ isName, cor, realizado, meta, diasPassados, diasRestantes, diasUteis, snapList }) {
  const metaDiaria = meta / diasUteis
  const onTrack = metaDiaria * diasPassados
  const delta = realizado - onTrack
  const faltam = meta - realizado
  const ritmoDiario = diasRestantes > 0 ? faltam / diasRestantes : 0
  const pctSobreMeta = metaDiaria > 0 ? ((ritmoDiario / metaDiaria) - 1) * 100 : 0
  const pct = meta > 0 ? realizado / meta : 0

  // Build chart data from snapList filtered by IS
  // (simplified: uses total team data for chart shape, scaled)
  const chartData = Array.from({ length: diasUteis }, (_, i) => {
    const d = i + 1
    const metaAcum = metaDiaria * d
    const snap = snapList.find(s => s.dias_uteis_passados === d)
    // Scale team realizado to IS proportion
    const ratio = snapList.length > 0 && snapList[snapList.length-1]?.total_acumulado_mes > 0
      ? realizado / snapList[snapList.length-1].total_acumulado_mes : 0.5
    const realizadoAcum = snap ? snap.total_acumulado_mes * ratio : null
    const necessario = d > diasPassados ? realizado + ritmoDiario * (d - diasPassados) : null
    return { dia: `D${d}`, meta: metaAcum, realizado: realizadoAcum, necessario: necessario }
  })

  return (
    <div className="card">
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{isName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Meta {brlK(metaDiaria)}/dia útil · {brl(meta)} no mês
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
        <div>
          <div className="label">Realizado</div>
          <div style={{ fontSize:22, fontWeight:800, color:'var(--blue)' }}>{brl(realizado)}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{(pct*100).toFixed(1)}% da meta</div>
        </div>
        <div>
          <div className="label">Delta vs Ritmo</div>
          <div style={{ fontSize:22, fontWeight:800, color: delta >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {delta >= 0 ? '+' : ''}{brl(delta)}
          </div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>vs meta {diasPassados}d {brl(onTrack)}</div>
        </div>
        <div>
          <div className="label">Faltam</div>
          <div style={{ fontSize:20, fontWeight:700, color:'var(--orange)' }}>{brl(faltam)}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>em {diasRestantes} dias úteis</div>
        </div>
        <div>
          <div className="label">Ritmo Necessário</div>
          <div style={{ fontSize:20, fontWeight:700, color:'var(--orange)' }}>{brl(ritmoDiario)}/dia</div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>
            {pctSobreMeta > 0 ? `+${pctSobreMeta.toFixed(0)}%` : `${pctSobreMeta.toFixed(0)}%`} sobre meta diária
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData} margin={{ top:0, right:0, left:0, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
          <XAxis dataKey="dia" tick={{ fontSize:9, fill:'#9CA3AF' }} axisLine={false} tickLine={false} interval={3}/>
          <YAxis hide />
          <Tooltip formatter={(v) => brl(v)} labelStyle={{ fontSize:11 }} contentStyle={{ fontSize:11, borderRadius:6 }}/>
          <Line dataKey="meta" stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Meta linear"/>
          <Line dataKey="realizado" stroke={cor || 'var(--blue)'} strokeWidth={2} dot={{ r:2, fill: cor || 'var(--blue)' }} connectNulls={false} name="Realizado"/>
          <Line dataKey="necessario" stroke="var(--orange)" strokeWidth={1.5} strokeDasharray="3 2" dot={false} connectNulls name="Necessário"/>
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display:'flex', gap:12, marginTop:8, fontSize:10, color:'var(--text-muted)' }}>
        <span style={{ display:'flex', alignItems:'center', gap:3 }}>
          <span style={{ width:12, height:1, background:'#D1D5DB', display:'inline-block' }}/> Meta linear
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:3 }}>
          <span style={{ width:12, height:2, background: cor || 'var(--blue)', display:'inline-block', borderRadius:1 }}/> Realizado
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:3 }}>
          <span style={{ width:12, height:1, background:'var(--orange)', display:'inline-block' }}/> Necessário
        </span>
      </div>
    </div>
  )
}
