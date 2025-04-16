import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

interface ReporteResiduo {
  fecha: string
  tipo_residuo: string
  cultivo: string
}

const fetchReporteResiduos = async (): Promise<ReporteResiduo[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}residuos/reporte-residuos/`)
    return data.reporte
  } catch (error) {
    console.error('Error al obtener el reporte de residuos:', error)
    throw new Error('No se pudo obtener el reporte de residuos')
  }
}

export const useReporteResiduos = () => {
  return useQuery<ReporteResiduo[], Error>({
    queryKey: ['reporteResiduos'],
    queryFn: fetchReporteResiduos,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}