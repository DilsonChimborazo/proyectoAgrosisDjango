import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react'; // Agregar useMemo

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws/api/evapotranspiracion/';

export interface EvapoData {
  id: number;
  plantacion_id: number;
  nombre_plantacion: string;
  era_id: number | null;
  nombre_era: string;
  cultivo: string;
  eto: number;
  etc: number;
  fecha: string;
}

export function useEvapotranspiracion(plantacionId: number) {
  const [wsData, setWsData] = useState<EvapoData[]>([]);

  const fetchEvapotranspiracion = async () => {
    if (plantacionId === 0) {
      return [];
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }

    console.log('Cargando evapotranspiración desde:', `${apiUrl}evapotranspiracion/`, 'con plantacionId:', plantacionId);

    const response = await fetch(`${apiUrl}evapotranspiracion/?fk_id_plantacion=${plantacionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📥 Datos de evapotranspiración recibidos:", data);

    const processedData: EvapoData[] = data.map((item: any) => ({
      id: item.id || Date.now(),
      plantacion_id: item.fk_id_plantacion.id,
      nombre_plantacion: item.fk_id_plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin plantación',
      era_id: item.fk_id_plantacion.fk_id_eras?.id || null,
      nombre_era: item.fk_id_plantacion.fk_id_eras?.nombre || 'Sin era',
      cultivo: item.fk_id_plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
      eto: Number(item.eto) || 0,
      etc: Number(item.etc) || 0,
      fecha: new Date(item.fecha).toISOString(),
    }));

    return processedData;
  };

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['evapotranspiracion', plantacionId],
    queryFn: fetchEvapotranspiracion,
    enabled: plantacionId !== 0,
  });

  // WebSocket para datos en tiempo real
  useEffect(() => {
    if (plantacionId === 0) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✅ Conectado al WebSocket de evapotranspiracion');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📡 Datos recibidos del WebSocket:', message);

        if (message.error) {
          console.error('Error en WebSocket:', message.error);
          return;
        }

        // Procesar datos recibidos
        const newData: EvapoData = {
          id: message.id || Date.now(), // Usar id del backend si está disponible
          plantacion_id: message.plantacion_id,
          nombre_plantacion: message.cultivo || 'Sin plantación',
          era_id: message.era_id || null,
          nombre_era: message.era_id ? `Era ${message.era_id}` : 'Sin era',
          cultivo: message.cultivo || 'Sin cultivo',
          eto: Number(message.eto) || 0,
          etc: Number(message.etc) || 0,
          fecha: new Date(message.fecha).toISOString(),
        };

        // Filtrar datos por plantacionId
        if (newData.plantacion_id === plantacionId) {
          setWsData((prev) => {
            // Evitar duplicados por fecha y plantación
            const exists = prev.some(
              (item) => item.fecha === newData.fecha && item.plantacion_id === newData.plantacion_id
            );
            if (exists) return prev;
            return [...prev, newData].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
          });
        }
      } catch (err) {
        console.error('Error al procesar mensaje WebSocket:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('⚠️ WebSocket de evapotranspiracion cerrado');
    };

    return () => {
      ws.close();
    };
  }, [plantacionId]);

  // Combinar datos de la API y WebSocket
  const combinedData = useMemo(() => {
    const apiData = data || [];
    const mergedData = [...apiData, ...wsData].reduce((acc: EvapoData[], curr: EvapoData) => {
      const exists = acc.some(
        (item) => item.fecha === curr.fecha && item.plantacion_id === curr.plantacion_id
      );
      if (!exists) {
        acc.push(curr);
      }
      return acc;
    }, []);

    return mergedData.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [data, wsData]);

  const latestData = combinedData.length > 0 ? combinedData[combinedData.length - 1] : null;

  return {
    data: combinedData,
    latestData,
    loading: isLoading,
    error: error ? (error.message || 'Error al obtener datos de evapotranspiración') : null,
    fetchData: refetch,
  };
}