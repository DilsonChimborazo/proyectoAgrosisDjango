import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

interface ReporteControl {
  cultivo: string
  pea: string
  tipo_control: string
}

const fetchReporteControles = async (): Promise<ReporteControl[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}control_fitosanitario/reporte-controles/`)
    return data.reporte
  } catch (error) {
    console.error('Error al obtener el reporte de controles fitosanitarios:', error)
    throw new Error('No se pudo obtener el reporte')
  }
}

export const useReporteControles = () => {
  return useQuery<ReporteControl[], Error>({
    queryKey: ['reporteControles'],
    queryFn: fetchReporteControles,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}
