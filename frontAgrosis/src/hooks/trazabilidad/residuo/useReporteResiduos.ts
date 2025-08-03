import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


interface ReporteResiduo {
  fecha: string
  cultivo: string
  residuo: string
}

const fetchReporteResiduos = async (): Promise<ReporteResiduo[]> => {
  try {
    const { data } = await axios.get(`/api/residuos/reporte-residuos/`)
    return data.reporte
  } catch (error) {
    console.error('Error al obtener el reporte de residuos:', error)
    throw new Error('No se pudo obtener el reporte')
  }
}

export const useReporteResiduos = () => {
  return useQuery<ReporteResiduo[], Error>({
    queryKey: ['reporteResiduos'],
    queryFn: fetchReporteResiduos,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}