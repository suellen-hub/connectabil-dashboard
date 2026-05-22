import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useFiltro } from '../context/FiltroContext'

export function useDashboard() {
  const { dataInicio, dataFim, isFilter } = useFiltro()
  const [loading, setLoading] = useState(true)
  const [snap, setSnap] = useState(null)
  const [snapList, setSnapList] = useState([])
  const [trans, setTrans] = useState([])
  const [saas, setSaas] = useState([])
  const [roleta, setRoleta] = useState([])
  const [meta, setMeta] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()
    const inicioMesAtual = `${anoAtual}-${String(mesAtual).padStart(2,'0')}-01`

    const [r1, r2, r3, r4, r5] = await Promise.all([
      // Snapshot do mês atual (sempre, independente do filtro)
      supabase.from('snapshot_diario')
        .select('*').gte('data', inicioMesAtual).order('data'),

      // Transacional filtrado
      supabase.from('transacional')
        .select('data,empresa,honorarios,inside_sales,tipo,origem,mes')
        .gte('data', dataInicio).lte('data', dataFim)
        .or(isFilter || 'inside_sales.neq.null'),

      // SaaS filtrado
      supabase.from('saas')
        .select('data,empresa,mrr,arr,tipo,inside_sales')
        .gte('data', dataInicio).lte('data', dataFim),

      // Roleta
      supabase.from('roleta')
        .select('*').order('data', { ascending: false }),

      // Meta do mês atual
      supabase.from('metas')
        .select('*').eq('mes', mesAtual).eq('ano', anoAtual).single(),
    ])

    const snaps = r1.data || []
    setSnapList(snaps)
    setSnap(snaps[snaps.length - 1] || null)
    setTrans(r2.data || [])
    setSaas(r3.data || [])
    setRoleta(r4.data || [])
    setMeta(r5.data || null)
    setLoading(false)
  }, [dataInicio, dataFim, isFilter])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Realtime
  useEffect(() => {
    const ch = supabase.channel('dash-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'snapshot_diario' },
        () => fetchAll())
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [fetchAll])

  // Derived metrics
  const totalTrans = trans.reduce((s, r) => s + (r.honorarios || 0), 0)
  const totalArr = saas.reduce((s, r) => s + (r.arr || 0), 0)
  const totalMrr = saas.reduce((s, r) => s + (r.mrr || 0), 0)
  const totalGeral = totalTrans + totalArr

  const novos = trans.filter(r => r.tipo === 'Novo')
  const rec = trans.filter(r => r.tipo === 'Recorrente')
  const ticketNovos = novos.length ? novos.reduce((s,r)=>s+r.honorarios,0)/novos.length : 0
  const ticketRec = rec.length ? rec.reduce((s,r)=>s+r.honorarios,0)/rec.length : 0
  const ticketGeral = trans.length ? totalTrans/trans.length : 0

  const metaGeral = meta?.meta_geral || 267000
  const diasUteis = meta?.dias_uteis || 20
  const metaDiaria = metaGeral / diasUteis
  const diasPassados = snap?.dias_uteis_passados || 0
  const diasRestantes = snap?.dias_uteis_restantes || 0
  const acumulado = snap?.total_acumulado_mes || 0
  const onTrack = snap?.on_track_acumulado || 0
  const delta = snap?.delta_vs_track || 0
  const pctAtingido = snap?.pct_atingido || 0
  const tendencia = diasPassados > 0 ? (acumulado / diasPassados) * diasUteis : 0

  // Ranking by IS
  const byIS = {}
  trans.forEach(r => {
    const k = r.inside_sales || '(em branco)'
    if (!byIS[k]) byIS[k] = { total: 0, vagas: 0 }
    byIS[k].total += r.honorarios || 0
    byIS[k].vagas++
  })
  const rankingIS = Object.entries(byIS)
    .map(([is, d]) => ({ is, ...d, ticket: d.total / d.vagas }))
    .sort((a, b) => b.total - a.total)

  // Roleta stats
  const roletaEmNeg = roleta.filter(r => r.status === 'Em negociação').length
  const roletaVendidos = roleta.filter(r => r.status === 'Vendidos').length
  const roletaPerdidos = roleta.filter(r => r.status === 'Perdidos').length
  const txConversao = (roletaVendidos + roletaPerdidos) > 0
    ? roletaVendidos / (roletaVendidos + roletaPerdidos) : 0

  // Daily chart data
  const chartData = snapList.map(s => ({
    data: s.data,
    dia: `D${s.dias_uteis_passados}`,
    trans: s.total_transacional_dia,
    saas: s.total_saas_dia,
    total: s.total_dia,
    meta: s.meta_diaria_ideal,
    acumulado: s.total_acumulado_mes,
    ontrack: s.on_track_acumulado,
  }))

  return {
    loading, snap, snapList, trans, saas, roleta, meta, chartData,
    totalTrans, totalArr, totalMrr, totalGeral,
    novos, rec, ticketNovos, ticketRec, ticketGeral,
    metaGeral, diasUteis, metaDiaria, diasPassados, diasRestantes,
    acumulado, onTrack, delta, pctAtingido, tendencia,
    rankingIS, byIS,
    roletaEmNeg, roletaVendidos, roletaPerdidos, txConversao,
    refetch: fetchAll,
  }
}
