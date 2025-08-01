import { useState, useEffect, useMemo } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

export interface EvapoData {
    id: number;
    plantacion_id: number;
    nombre_plantacion: string;
    era_id: number | null;
    nombre_era: string;
    cultivo: string;
    cantidad_agua:number;
    eto: number;
    etc: number;
    fecha: string;
}

export function useEvapotranspiracion(plantacionId: number) {
    const [historicalData, setHistoricalData] = useState<EvapoData[]>([]); // Datos históricos de la API
    const [wsData, setWsData] = useState<EvapoData[]>([]); // Datos en tiempo real del WebSocket
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Obtener datos históricos desde la API
    const fetchEvapotranspiracion = async () => {
        if (plantacionId === 0) {
            setHistoricalData([]);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró un token de autenticación.');
            }


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

            if (!data || !Array.isArray(data)) {
                throw new Error('Datos de evapotranspiración inválidos');
            }

            const processedData: EvapoData[] = data.map((item: any) => ({
                id: item.id || Date.now(),
                plantacion_id: item.fk_id_plantacion?.id || plantacionId,
                nombre_plantacion: item.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin plantación',
                era_id: item.fk_id_plantacion?.fk_id_eras?.id || null,
                cantidad_agua: Number(item.cantidad_agua) || 0,
                nombre_era: item.fk_id_plantacion?.fk_id_eras?.nombre || 'Sin era',
                cultivo: item.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
                eto: Number(item.eto) || 0,
                etc: Number(item.etc) || 0,
                fecha: item.fecha ? new Date(item.fecha).toISOString() : new Date().toISOString(),
            }));

            setHistoricalData(processedData);
        } catch (err: any) {
            console.error('Error al cargar datos históricos:', err);
            setError(err.message || 'Error al obtener datos históricos');
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos históricos al montar el componente o al cambiar plantacionId
    useEffect(() => {
        fetchEvapotranspiracion();
    }, [plantacionId]);

    // Configurar el WebSocket para datos en tiempo real
    useEffect(() => {
        if (plantacionId === 0) {
            setWsData([]);
            return;
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.error) {
                    console.error('Error en WebSocket:', message.error);
                    setError(message.error);
                    return;
                }

                if (!message.id || !message.plantacion_id || !message.eto || !message.etc || !message.fecha) {
                    console.error('Mensaje incompleto:', message);
                    return;
                }

                const newData: EvapoData = {
                    id: message.id || Date.now(),
                    plantacion_id: message.plantacion_id,
                    nombre_plantacion: message.nombre_plantacion || 'Sin plantación',
                    era_id: message.era_id || null,
                    nombre_era: message.nombre_era || 'Sin era',
                    cultivo: message.cultivo || 'Sin cultivo',
                    cantidad_agua: Number(message.cantidad_agua) || 0,
                    eto: Number(message.eto) || 0,
                    etc: Number(message.etc) || 0,
                    fecha: new Date(message.fecha).toISOString(),
                };
                setWsData((prev) => {
                    const exists = prev.some((item) => item.id === newData.id);
                    if (!exists) {
                        const newDataArray = [...prev, newData].sort(
                            (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                        );
                        return newDataArray;
                    }
                    return prev;
                });
            } catch (err) {
                console.error('Error al procesar mensaje WebSocket:', err);
                setError('Error al procesar datos del WebSocket');
            }
        };

        ws.onerror = (error) => {
            console.error('Error en WebSocket:', error);
            setError('Error de conexión con el WebSocket');
        };

        ws.onclose = () => {
            setTimeout(() => {
                const newWs = new WebSocket(wsUrl);
                newWs.onopen = ws.onopen;
                newWs.onmessage = ws.onmessage;
                newWs.onerror = ws.onerror;
                newWs.onclose = ws.onclose;
            }, 5000);
        };

        return () => {
            ws.close();
        };
    }, [plantacionId]);

    // Combinar datos históricos y en tiempo real
    const combinedData = useMemo(() => {
        const allData = [...historicalData, ...wsData]
            .filter(item => Number.isFinite(item.eto) && Number.isFinite(item.etc) && item.eto >= 0 && item.etc >= 0)
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        
        // Eliminar duplicados basados en el id
        const uniqueData = Array.from(
            new Map(allData.map(item => [item.id, item])).values()
        );

        return uniqueData;
    }, [historicalData, wsData]);

    const latestData = combinedData.length > 0 ? combinedData[combinedData.length - 1] : null;

    return {
        data: combinedData, // Combinación de datos históricos y en tiempo real
        latestData,
        loading,
        error,
    };
}