import { createContext, useContext, useState, useMemo } from 'react'

const FiltroContext = createContext(null)

const hoje = new Date()
const inicioMes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
const fimMes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-31`

export function FiltroProvider({ children }) {
  const [periodo, setPeriodo] = useState('mes')
  const [dataInicio, setDataInicio] = useState(inicioMes)
  const [dataFim, setDataFim] = useState(hoje.toISOString().split('T')[0])
  const [selectedIS, setSelectedIS] = useState([
    'Vanuza', 'Thalita', 'Vitória Boss', 'Daiane', 'Outros', null
  ])

  const isFilter = useMemo(() => {
    return selectedIS.map(is =>
      is === null ? 'inside_sales.is.null' : `inside_sales.eq.${is}`
    ).join(',')
  }, [selectedIS])

  const toggleIS = (is) => {
    setSelectedIS(prev =>
      prev.includes(is) ? prev.filter(x => x !== is) : [...prev, is]
    )
  }

  const setPeriodoPreset = (preset) => {
    setPeriodo(preset)
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()

    if (preset === 'hoje') {
      const d = now.toISOString().split('T')[0]
      setDataInicio(d); setDataFim(d)
    } else if (preset === 'semana') {
      const mon = new Date(now)
      mon.setDate(now.getDate() - ((now.getDay() + 6) % 7))
      setDataInicio(mon.toISOString().split('T')[0])
      setDataFim(now.toISOString().split('T')[0])
    } else if (preset === 'mes') {
      setDataInicio(`${y}-${String(m + 1).padStart(2, '0')}-01`)
      setDataFim(now.toISOString().split('T')[0])
    } else if (preset === 'anterior') {
      const pm = m === 0 ? 12 : m
      const py = m === 0 ? y - 1 : y
      const lastDay = new Date(y, m, 0).getDate()
      setDataInicio(`${py}-${String(pm).padStart(2, '0')}-01`)
      setDataFim(`${py}-${String(pm).padStart(2, '0')}-${lastDay}`)
    }
  }

  return (
    <FiltroContext.Provider value={{
      periodo, dataInicio, dataFim, selectedIS, isFilter,
      setPeriodoPreset, setDataInicio, setDataFim, toggleIS
    }}>
      {children}
    </FiltroContext.Provider>
  )
}

export const useFiltro = () => useContext(FiltroContext)
