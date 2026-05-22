import { brl, getProximosDiasUteis } from '../lib/formatters'

export function ProjecaoDiaria({ metaGeral, acumulado, diasRestantes, byIS }) {
  const faltaTotal = metaGeral - acumulado
  const ritmoDiario = diasRestantes > 0 ? faltaTotal / diasRestantes : 0

  const vanuza = byIS?.['Vanuza']
  const thalita = byIS?.['Thalita']
  const totalIS = (vanuza?.total || 0) + (thalita?.total || 0)
  const propV = totalIS > 0 ? (vanuza?.total || 0) / totalIS : 0.7
  const propT = totalIS > 0 ? (thalita?.total || 0) / totalIS : 0.3

  const diasProx = getProximosDiasUteis(6)
  let acumRun = acumulado

  return (
    <div className="card card-accent" style={{ gridColumn:'1/-1' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div className="section-title">Projeção Diária — Próximos {diasProx.length} Dias Úteis</div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>Volume necessário para fechar a meta</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Data</th>
            <th>Vanuza</th>
            <th>Thalita</th>
            <th>Total / dia</th>
            <th>Acumulado mês</th>
          </tr>
        </thead>
        <tbody>
          {diasProx.map(({ dia, data, dateStr }) => {
            acumRun += ritmoDiario
            const v = ritmoDiario * propV
            const t = ritmoDiario * propT
            return (
              <tr key={dateStr}>
                <td style={{ fontWeight:500 }}>{dia}</td>
                <td style={{ color:'var(--text-sub)' }}>{data}</td>
                <td>{brl(v)}</td>
                <td>{brl(t)}</td>
                <td style={{ fontWeight:600, color:'var(--text)' }}>{brl(ritmoDiario)}</td>
                <td style={{ color:'var(--blue)', fontWeight:600 }}>{brl(acumRun)}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="total-row">
            <td colSpan={2} style={{ fontWeight:700 }}>Total a entregar</td>
            <td>{brl(faltaTotal * propV)}</td>
            <td>{brl(faltaTotal * propT)}</td>
            <td>{brl(faltaTotal)}</td>
            <td>{brl(metaGeral)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
