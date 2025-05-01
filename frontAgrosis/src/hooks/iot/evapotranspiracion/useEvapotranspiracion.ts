import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

export interface EvapoData {
  id: number;
  era_id: number;
  nombre_era: string;
  cultivo: string;
  eto: number;
  etc: number;
  fecha: string;
}
export interface Eras {
    id: number;
    nombre: string;
    fk_id_lote: { id: number; nombre_lote: string } | null;
    descripcion: string;
    estado: boolean;
}

export function useEvapotranspiracion(eraId: number = 2) {
  const [data, setData] = useState<EvapoData[]>([]);
  const [latestData, setLatestData] = useState<EvapoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación.');
      }

      const response = await axios.get(`${apiUrl}mide/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          tipo: 'EVAPOTRANSPIRACION',
          fk_id_era_id: eraId,
        },
      });

      console.log("📥 Datos de evapotranspiración recibidos:", response.data);

      // Mapear los datos al formato esperado
      const kc = 0.6; // Coeficiente del cultivo (tomate, como usamos el 18 de abril de 2025)
      const processedData: EvapoData[] = response.data.map((item: any) => ({
        id: item.id,
        era_id: item.fk_id_era_id,
        nombre_era: item.era?.descripcion || 'Sin nombre de era',
        cultivo: item.era?.cultivo?.nombre_cultivo || 'Sin cultivo',
        eto: Number(item.valor_medicion), // ETo es el valor_medicion directo
        etc: Number(item.valor_medicion) * kc, // ETc = ETo * kc
        fecha: new Date(item.fecha_medicion).toISOString(),
      }));

      setData(processedData);
      setLatestData(processedData[processedData.length - 1] || null);
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos de evapotranspiración');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eraId]);

  return { data, latestData, loading, error, fetchData };
}