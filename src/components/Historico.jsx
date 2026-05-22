import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { brl, pct, monthName } from '../lib/formatters'

const MESES_DADOS = [
  { mes:1, meta:250000, trans:131902.18, saas:25128,   total:157030.18 },
  { mes:2, meta:250000, trans:138433.20, saas:56761.20, total:195194.40 },
  { mes:3, meta:230000, trans:180029.40, saas:25128,   total:205157.40 },
  { mes:4, meta:255000, trans:186524.11, saas:20700,   total:207224.11 },
  { mes:5, meta:267000, trans:124120.19, saas:29556,   total:153676.19 },
]

export function Historico() {
  return (
    <div className="card card-accent" style={{ marginTop:16 }}>
      <div className="section-title" style={{ marginBottom:16 }}>Histórico Mensal 2026</div>
      <table>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Meta Geral</th>
            <th>Transacional</th>
            <th>SaaS (ARR)</th>
            <th>Total</th>
            <th>% Meta</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          {MESES_DADOS.map(({ mes, meta, trans, saas, total }) => {
            const p = total / meta
            const delta = total - meta
            const isMes = mes === new Date().getMonth() + 1
            return (
              <tr key={mes} style={isMes ? { background:'#F0FDF4' } : {}}>
                <td style={{ fontWeight: isMes ? 700 : 500 }}>
                  {monthName(mes)}/2026 {isMes && <span className="badge badge-green" style={{ marginLeft:6 }}>atual</span>}
                </td>
                <td style={{ color:'#111' }}>{brl(meta)}</td>
                <td style={{ color:'var(--blue)', fontWeight:500 }}>{brl(trans)}</td>
                <td style={{ color:'var(--green)', fontWeight:500 }}>{brl(saas)}</td>
                <td style={{ fontWeight:700 }}>{brl(total)}</td>
                <td>
                  <span className={`badge ${p >= 0.8 ? 'badge-green' : p >= 0.6 ? 'badge-orange' : 'badge-red'}`}>
                    {(p * 100).toFixed(1)}%
                  </span>
                </td>
                <td style={{ color: delta >= 0 ? 'var(--green)' : 'var(--red)', fontWeight:600 }}>
                  {delta >= 0 ? '+' : ''}{brl(delta)}
                </td>
              </tr>
            )
          })}
          {Array.from({length:7},(_,i)=>i+6).map(m => (
            <tr key={m} style={{ opacity:0.4 }}>
              <td style={{ fontWeight:500 }}>{monthName(m)}/2026</td>
              <td>{brl(250000)}</td>
              <td style={{ color:'var(--text-muted)' }}>—</td>
              <td style={{ color:'var(--text-muted)' }}>—</td>
              <td style={{ color:'var(--text-muted)' }}>—</td>
              <td style={{ color:'var(--text-muted)' }}>—</td>
              <td style={{ color:'var(--text-muted)' }}>—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
