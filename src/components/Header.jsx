import { useState, useEffect } from 'react'

export function Header({ diasPassados, diasUteis }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const ts = now.toLocaleString('pt-BR', {
    day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'
  })
  const mes = now.toLocaleString('pt-BR', { month: 'long' })
  const ano = now.getFullYear()
  const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1)

  return (
    <header style={{
      background: 'var(--header)', padding: '14px 32px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill="none" stroke="white" strokeWidth="3.5" strokeDasharray="44 15" strokeDashoffset="0"/>
            <circle cx="22" cy="6" r="4" fill="#07C86F"/>
          </svg>
          <span style={{ color:'white', fontWeight:800, fontSize:17 }}>
            Painel Comercial Connectabil
          </span>
        </div>
        <div style={{ color:'#9CA3AF', fontSize:11 }}>Transacional · SaaS · Roleta</div>
        <div style={{ color:'#07C86F', fontSize:11, marginTop:2, display:'flex', alignItems:'center', gap:5 }}>
          <span className="pulse" style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#07C86F' }}/>
          Atualizado {ts}
        </div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div style={{ color:'white', fontWeight:700, fontSize:15 }}>{mesCap} / {ano}</div>
        <div style={{ color:'#9CA3AF', fontSize:12, marginTop:2 }}>
          Mês ativo · {diasPassados} de {diasUteis} dias úteis
        </div>
        <div style={{ color:'#9CA3AF', fontSize:11, marginTop:2 }}>3 tabelas conectadas</div>
      </div>
    </header>
  )
}
