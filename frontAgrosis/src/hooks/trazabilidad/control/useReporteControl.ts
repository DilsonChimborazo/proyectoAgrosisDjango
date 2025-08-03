import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


interface ReporteControl {
  fecha_control: Date
  plantacion: string
  cultivo: string
  pea: string
  tipo_control: string
  descripcion:string
}

const fetchReporteControles = async (): Promise<ReporteControl[]> => {
  try {
    const { data } = await axios.get(`/api/control_fitosanitario/reporte-controles/`)
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
