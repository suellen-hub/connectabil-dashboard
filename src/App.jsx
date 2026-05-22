import { useState } from 'react'
import './styles.css'
import { FiltroProvider } from './context/FiltroContext'
import { useDashboard } from './hooks/useDashboard'
import { Header } from './components/Header'
import { Filters } from './components/Filters'
import { KPICard, KPISkeleton } from './components/KPICard'
import { GraficoReceita } from './components/GraficoReceita'
import { MetaISCard } from './components/MetaISCard'
import { ProjecaoDiaria } from './components/ProjecaoDiaria'
import { RoletaPipeline } from './components/RoletaPipeline'
import { Historico } from './components/Historico'
import { brl, brlK, pct } from './lib/formatters'

const TABS = ['Dashboard', 'Vanuza', 'Thalita', 'Roleta', 'SaaS', 'Histórico']

function Dashboard() {
  const [tab, setTab] = useState('Dashboard')
  const d = useDashboard()

  const pctColor = (p) => p >= 0.8 ? 'var(--green)' : p >= 0.6 ? 'var(--orange)' : 'var(--red)'
  const deltaClass = (v) => v >= 0 ? 'up' : 'down'

  const vanuzaReal = d.byIS?.['Vanuza']?.total || 0
  const thalitaReal = d.byIS?.['Thalita']?.total || 0
  const metaVanuza = d.metaGeral * 0.745
  const metaThalita = d.metaGeral * 0.255

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header diasPassados={d.diasPassados} diasUteis={d.diasUteis} />

      {/* TABS */}
      <div className="tabs">
        {TABS.map(t => (
          <div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</div>
        ))}
      </div>

      <Filters />

      <div style={{ padding:'20px 32px', maxWidth:1400, margin:'0 auto' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'Dashboard' && (
          <>
            {/* Linha 1 - KPIs principais */}
            <div style={{ marginBottom:16 }}>
              <div className="section-title">Visão do Mês — {new Date().toLocaleString('pt-BR',{month:'long',year:'numeric'})}</div>
            </div>
            <div className="grid-4" style={{ marginBottom:16 }}>
              {d.loading ? <><KPISkeleton/><KPISkeleton/><KPISkeleton/><KPISkeleton/></> : <>
                <KPICard label="Vendas Realizadas (Geral)"
                  value={brl(d.acumulado)} color="var(--blue)"
                  sub={`Meta ${brl(d.metaGeral)} · ${(d.pctAtingido*100).toFixed(1)}%`}
                  progress={d.pctAtingido}/>
                <KPICard label="Vendas Transacional"
                  value={brl(d.totalTrans)} color="var(--blue)"
                  sub={`Meta ${brl(d.meta?.meta_transacional||242000)} · ${d.meta ? ((d.totalTrans/d.meta.meta_transacional)*100).toFixed(1) : 0}%`}
                  progress={d.meta ? d.totalTrans/d.meta.meta_transacional : 0}/>
                <KPICard label="Vendas SaaS (ARR)"
                  value={brl(d.totalArr)} color="var(--green)"
                  sub={`Meta ${brl(d.meta?.meta_saas||25000)} | MRR ${brl(d.totalMrr)}`}
                  progress={d.meta ? d.totalArr/d.meta.meta_saas : 0}
                  badge={d.totalArr >= (d.meta?.meta_saas||25000) ? <span className="badge badge-green">✓ Meta SaaS atingida</span> : null}/>
                <KPICard label="Tendência"
                  value={brl(d.tendencia)}
                  color={d.tendencia >= d.metaGeral ? 'var(--green)' : 'var(--orange)'}
                  sub={`Gap projetado: ${d.tendencia >= d.metaGeral ? '+' : ''}${brl(d.tendencia - d.metaGeral)}`}/>
              </>}
            </div>

            {/* Linha 2 - KPIs secundários */}
            <div className="grid-4" style={{ marginBottom:24 }}>
              {d.loading ? <><KPISkeleton/><KPISkeleton/><KPISkeleton/><KPISkeleton/></> : <>
                <KPICard label="Honorários Faturados"
                  value={brl(d.acumulado)} color="var(--text)"
                  sub={`${(d.pctAtingido*100).toFixed(0)}% do potencial · ${brl(d.acumulado/2)} em abertura`}
                  accent={false}/>
                <KPICard label="— Vanuza"
                  value={brl(vanuzaReal)} color="var(--blue)"
                  sub={`${d.byIS?.['Vanuza']?.vagas||0} vagas · ticket ${brl(d.byIS?.['Vanuza']?.ticket||0)}`}/>
                <KPICard label="— Thalita"
                  value={brl(thalitaReal)} color="var(--green)"
                  sub={`${d.byIS?.['Thalita']?.vagas||0} vagas · ticket ${brl(d.byIS?.['Thalita']?.ticket||0)}`}/>
                <KPICard label="% Atingido"
                  value={`${(d.pctAtingido*100).toFixed(1)}%`}
                  color={pctColor(d.pctAtingido)}
                  sub={`${d.diasPassados} dias passados · ${d.diasRestantes} restantes`}/>
              </>}
            </div>

            {/* Metas por IS */}
            <div className="section-title">Metas por Inside Sales</div>
            <div style={{ display:'flex', gap:12, marginBottom:4, padding:'8px 12px', background:'#EFF6FF', borderRadius:8, marginBottom:16 }}>
              <span style={{ fontSize:12, color:'var(--blue)' }}>
                📅 Status do mês: <strong>{d.diasPassados} dias úteis decorridos</strong> · {d.diasRestantes} restantes
              </span>
            </div>
            <div className="grid-2" style={{ marginBottom:24 }}>
              {d.loading
                ? <><KPISkeleton/><KPISkeleton/></>
                : <>
                  <MetaISCard isName="Vanuza — Abertura" cor="var(--blue)"
                    realizado={vanuzaReal} meta={metaVanuza}
                    diasPassados={d.diasPassados} diasRestantes={d.diasRestantes}
                    diasUteis={d.diasUteis} snapList={d.snapList}/>
                  <MetaISCard isName="Thalita" cor="var(--green)"
                    realizado={thalitaReal} meta={metaThalita}
                    diasPassados={d.diasPassados} diasRestantes={d.diasRestantes}
                    diasUteis={d.diasUteis} snapList={d.snapList}/>
                </>
              }
            </div>

            {/* Gráfico */}
            <div className="grid-4" style={{ marginBottom:24 }}>
              <GraficoReceita data={d.chartData}/>
            </div>

            {/* Projeção Diária */}
            <div className="grid-4" style={{ marginBottom:24 }}>
              {!d.loading && <ProjecaoDiaria
                metaGeral={d.metaGeral} acumulado={d.acumulado}
                diasRestantes={d.diasRestantes} byIS={d.byIS}/>}
            </div>

            {/* Operacional */}
            <div className="section-title">Operacional · Status Atual</div>
            <div className="grid-4" style={{ marginBottom:24 }}>
              {d.loading ? <><KPISkeleton/><KPISkeleton/><KPISkeleton/><KPISkeleton/></> : <>
                <KPICard label="Vagas no Período"
                  value={d.trans.length} color="var(--text)"
                  sub={`${d.novos.length} novas · ${d.rec.length} recorrentes`}/>
                <KPICard label="Roleta Em Negociação"
                  value={d.roletaEmNeg}
                  color={d.roletaEmNeg > 5 ? 'var(--orange)' : 'var(--green)'}
                  sub={`${d.roletaPerdidos} perdidos · ${d.roletaVendidos} vendidos`}/>
                <KPICard label="Ticket Médio / Vaga"
                  value={brl(d.ticketGeral)} color="var(--text)"
                  sub={`Novos ${brl(d.ticketNovos)} · Rec ${brl(d.ticketRec)}`}/>
                <KPICard label="% Conversão Roleta"
                  value={`${(d.txConversao*100).toFixed(0)}%`}
                  color={d.txConversao >= 0.3 ? 'var(--green)' : 'var(--orange)'}
                  sub={`${d.roleta.length} leads no total`}/>
              </>}
            </div>
          </>
        )}

        {/* ── VANUZA ── */}
        {tab === 'Vanuza' && !d.loading && (
          <div style={{ marginTop:8 }}>
            <MetaISCard isName="Vanuza — Detalhes" cor="var(--blue)"
              realizado={vanuzaReal} meta={metaVanuza}
              diasPassados={d.diasPassados} diasRestantes={d.diasRestantes}
              diasUteis={d.diasUteis} snapList={d.snapList}/>
            <div className="card" style={{ marginTop:16 }}>
              <div className="section-title">Vagas de Vanuza</div>
              <table>
                <thead><tr><th>Data</th><th>Empresa</th><th>Honorários</th><th>Tipo</th><th>Origem</th></tr></thead>
                <tbody>
                  {d.trans.filter(r=>r.inside_sales==='Vanuza').sort((a,b)=>b.data.localeCompare(a.data)).map((r,i)=>(
                    <tr key={i}>
                      <td>{r.data?.slice(5).split('-').reverse().join('/')}</td>
                      <td style={{fontWeight:500}}>{r.empresa}</td>
                      <td style={{color:'var(--blue)',fontWeight:600}}>{brl(r.honorarios)}</td>
                      <td><span className={`badge ${r.tipo==='Novo'?'badge-green':'badge-blue'}`}>{r.tipo}</span></td>
                      <td style={{color:'var(--text-muted)'}}>{r.origem||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── THALITA ── */}
        {tab === 'Thalita' && !d.loading && (
          <div style={{ marginTop:8 }}>
            <MetaISCard isName="Thalita — Detalhes" cor="var(--green)"
              realizado={thalitaReal} meta={metaThalita}
              diasPassados={d.diasPassados} diasRestantes={d.diasRestantes}
              diasUteis={d.diasUteis} snapList={d.snapList}/>
            <div className="card" style={{ marginTop:16 }}>
              <div className="section-title">Vagas de Thalita</div>
              <table>
                <thead><tr><th>Data</th><th>Empresa</th><th>Honorários</th><th>Tipo</th><th>Origem</th></tr></thead>
                <tbody>
                  {d.trans.filter(r=>r.inside_sales==='Thalita').sort((a,b)=>b.data.localeCompare(a.data)).map((r,i)=>(
                    <tr key={i}>
                      <td>{r.data?.slice(5).split('-').reverse().join('/')}</td>
                      <td style={{fontWeight:500}}>{r.empresa}</td>
                      <td style={{color:'var(--green)',fontWeight:600}}>{brl(r.honorarios)}</td>
                      <td><span className={`badge ${r.tipo==='Novo'?'badge-green':'badge-blue'}`}>{r.tipo}</span></td>
                      <td style={{color:'var(--text-muted)'}}>{r.origem||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ROLETA ── */}
        {tab === 'Roleta' && (
          <div className="card card-accent" style={{ marginTop:8 }}>
            {d.loading ? <div className="skeleton" style={{height:300}}/> : <RoletaPipeline roleta={d.roleta}/>}
          </div>
        )}

        {/* ── SAAS ── */}
        {tab === 'SaaS' && !d.loading && (
          <div style={{ marginTop:8 }}>
            <div className="grid-3" style={{ marginBottom:16 }}>
              <KPICard label="MRR Total" value={brl(d.totalMrr)} color="var(--purple)" sub="Mensalidade recorrente"/>
              <KPICard label="ARR Total" value={brl(d.totalArr)} color="var(--purple)" sub="Receita anual reconhecida"/>
              <KPICard label="ARR Saudável" value={brl(d.totalMrr*12)} color="var(--green)"
                sub={d.totalArr >= d.totalMrr*12 ? '✓ ARR saudável' : '⚠ ARR abaixo do esperado'}
                badge={<span className={`badge ${d.totalArr >= d.totalMrr*12 ? 'badge-green' : 'badge-orange'}`}>
                  {d.totalArr >= d.totalMrr*12 ? 'Saudável ✓' : 'Abaixo ⚠'}
                </span>}/>
            </div>
            <div className="card">
              <div className="section-title">Contratos SaaS</div>
              <table>
                <thead><tr><th>Data</th><th>Empresa</th><th>MRR</th><th>ARR</th><th>Tipo</th><th>IS</th></tr></thead>
                <tbody>
                  {d.saas.sort((a,b)=>b.data.localeCompare(a.data)).map((r,i)=>(
                    <tr key={i}>
                      <td>{r.data?.slice(5).split('-').reverse().join('/')}</td>
                      <td style={{fontWeight:500}}>{r.empresa}</td>
                      <td style={{color:'var(--purple)'}}>{brl(r.mrr)}</td>
                      <td style={{color:'var(--purple)',fontWeight:600}}>{brl(r.arr)}</td>
                      <td><span className={`badge ${r.tipo==='Novo'?'badge-green':'badge-purple'}`} style={r.tipo!=='Novo'?{background:'var(--purple-light)',color:'var(--purple)'}:{}}>{r.tipo}</span></td>
                      <td style={{color:'var(--text-muted)'}}>{r.inside_sales||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── HISTÓRICO ── */}
        {tab === 'Histórico' && <Historico/>}

      </div>
    </div>
  )
}

export default function App() {
  return (
    <FiltroProvider>
      <Dashboard/>
    </FiltroProvider>
  )
}
