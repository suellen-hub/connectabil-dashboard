export const brl = (v) =>
  (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const brlK = (v) => {
  if (!v) return 'R$ 0'
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`
  return brl(v)
}

export const pct = (v) => `${((v || 0) * 100).toFixed(1)}%`

export const dtBR = (s) => {
  if (!s) return ''
  const d = new Date(s + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export const monthName = (n) => [
  '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
][n] || ''

export const getDiasUteisAte = (ano, mes, ateDay) => {
  let n = 0
  let d = new Date(ano, mes - 1, 1)
  const ate = new Date(ano, mes - 1, ateDay)
  while (d <= ate) {
    if (d.getDay() !== 0 && d.getDay() !== 6) n++
    d.setDate(d.getDate() + 1)
  }
  return n
}

export const getProximosDiasUteis = (n = 6) => {
  const dias = []
  const hoje = new Date()
  let d = new Date(hoje)
  d.setDate(d.getDate() + 1)
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  while (dias.length < n) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dias.push({
        dia: diasSemana[d.getDay()],
        data: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
        dateStr: d.toISOString().split('T')[0]
      })
    }
    d.setDate(d.getDate() + 1)
  }
  return dias
}
