import { useState, useEffect, useMemo } from 'react';
import { useEvapotranspiracion } from '../../../hooks/iot/evapotranspiracion/useEvapotranspiracion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData } from 'chart.js';
import 'chart.js/auto';
import { Button, Select, SelectItem } from '@heroui/react';
import axios from 'axios';

// Registrar componentes de chart.js
ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

// URL base para la API
const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.101.7:8000/api/';

export interface Plantacion {
    id: number;
    fk_id_eras: { id: number; nombre: string; descripcion: string } | null;
    fk_id_cultivo: { id: number; nombre_cultivo: string } | null;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: { id: number } | null;
}

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

interface MappedEvapoData {
    id: number;
    fecha: string;
    plantacion: string;
    era: string;
    cultivo: string;
    eto: string;
    etc: string;
}

const Evapotranspiracion = () => {
    const [plantacionId, setPlantacionId] = useState<number>(0);
    const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
    const [errorPlantaciones, setErrorPlantaciones] = useState<string | null>(null);
    const { data, latestData, error, loading } = useEvapotranspiracion(plantacionId);
    const [selectedEvapo, setSelectedEvapo] = useState<EvapoData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
    const [range, setRange] = useState<'24h' | '7d'>('24h');
    const navigate = useNavigate();

    useEffect(() => {
        const loadPlantaciones = async () => {
            try {
                console.log('Cargando plantaciones desde:', `${apiUrl}plantacion/`);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró un token de autenticación');
                }
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`${apiUrl}plantacion/`, { headers });
                const plantacionesData = response.data;
                console.log('Plantaciones recibidas:', plantacionesData);
                setPlantaciones(plantacionesData);
                if (plantacionesData.length > 0 && plantacionId === 0) {
                    setPlantacionId(plantacionesData[0].id);
                }
            } catch (err: any) {
                console.error('Error al cargar plantaciones:', err);
                setErrorPlantaciones(err.response?.data?.error || err.message || 'No se pudo cargar la lista de plantaciones');
            }
        };
        loadPlantaciones();
    }, []);

    const chartData: ChartData<"line"> = useMemo(() => {
        console.log('Datos para la gráfica:', data); // Depuración
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { labels: [], datasets: [] };
        }

        // Filtrado por plantacionId
        const filteredByPlantacion = data.filter(d => d.plantacion_id === plantacionId);
        console.log('Datos filtrados por plantacionId:', filteredByPlantacion);

        // Filtrado por rango de tiempo
        const now = new Date().getTime();
        const filteredData = range === '24h'
            ? filteredByPlantacion.filter(d => {
                const dataDate = new Date(d.fecha).getTime();
                return dataDate >= now - 24 * 60 * 60 * 1000;
            })
            : filteredByPlantacion.filter(d => {
                const dataDate = new Date(d.fecha).getTime();
                return dataDate >= now - 7 * 24 * 60 * 60 * 1000;
            });

        console.log('Datos filtrados por rango:', filteredData); // Depuración

        if (filteredData.length === 0) {
            console.log('No hay datos filtrados para la gráfica');
            return { labels: [], datasets: [] };
        }

        const labels: string[] = filteredData.map(d => new Date(d.fecha).toLocaleString());
        const etoData: number[] = filteredData.map(d => Number(d.eto) || 0);
        const etcData: number[] = filteredData.map(d => Number(d.etc) || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'ETo (mm/día)',
                    data: etoData,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'ETc (mm/día)',
                    data: etcData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: false,
                    tension: 0.3,
                },
            ],
        };
    }, [data, range, plantacionId]);

    const openModalHandler = (evapo: EvapoData) => {
        setSelectedEvapo(evapo);
        setModalContenido(
            <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {evapo.id}</p>
                <p><strong>Plantación:</strong> {evapo.nombre_plantacion || 'Sin plantación'}</p>
                <p><strong>Era:</strong> {evapo.nombre_era || 'Sin era'}</p>
                <p><strong>Cultivo:</strong> {evapo.cultivo || 'Sin cultivo'}</p>
                <p><strong>ETo:</strong> {evapo.eto.toFixed(2)} mm/día</p>
                <p><strong>ETc:</strong> {evapo.etc.toFixed(2)} mm/día</p>
                <p><strong>Fecha:</strong> {new Date(evapo.fecha).toLocaleString()}</p>
            </div>
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEvapo(null);
        setModalContenido(null);
        setIsModalOpen(false);
    };

    const handleUpdate = (evapo: { id: number }) => {
        navigate(`/EditarEvapotranspiracion/${evapo.id}`);
    };

    const handleCreate = () => {
        navigate("/crear-evapotranspiracion");
    };

    const headers = [
        'Fecha',
        'Plantacion',
        'Era',
        'Cultivo',
        'Eto',
        'Etc',
    ];

    const handleRowClick = (row: MappedEvapoData) => {
        const originalEvapo = data.find((evapo: EvapoData) => evapo.id === row.id);
        if (originalEvapo) {
            openModalHandler(originalEvapo);
        }
    };

    const mappedData = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return [];
        }
        // Filtrado por plantacionId para la tabla
        const filteredData = data.filter(d => d.plantacion_id === plantacionId);
        return filteredData.map((evapo: EvapoData) => ({
            id: evapo.id,
            fecha: new Date(evapo.fecha).toLocaleString(),
            plantacion: evapo.nombre_plantacion,
            era: evapo.nombre_era,
            cultivo: evapo.cultivo,
            eto: evapo.eto.toFixed(2),
            etc: evapo.etc.toFixed(2),
        }));
    }, [data, plantacionId]);

    return (
        <div className="p-6 min-h-screen">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center">
                    Evapotranspiración
                </h1>
                <div className="flex items-center space-x-4">
                    <Select
                        placeholder="Seleccionar Plantación"
                        value={plantacionId.toString()}
                        onChange={(e) => setPlantacionId(Number(e.target.value))}
                        className="w-48"
                        disabled={plantaciones.length === 0}
                        aria-label="Seleccionar una plantación"
                    >
                        {plantaciones.map((plantacion) => (
                            <SelectItem
                                key={plantacion.id}
                                id={plantacion.id.toString()}
                                textValue={`${plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'} - ${plantacion.fk_id_eras?.nombre || 'Sin era'}`}
                            >
                                {plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'} - {plantacion.fk_id_eras?.nombre || 'Sin era'}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Estado */}
            {loading && <p className="text-gray-600 mb-4">Cargando datos históricos...</p>}
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            {errorPlantaciones && <p className="text-red-500 mb-4">Error en plantaciones: {errorPlantaciones}</p>}
            {plantaciones.length === 0 && !errorPlantaciones && (
                <p className="text-gray-600 mb-4">No hay plantaciones disponibles.</p>
            )}
            {!loading && !error && (!data || data.length === 0) && plantaciones.length > 0 && (
                <p className="text-gray-600 mb-4">No hay datos de evapotranspiración disponibles.</p>
            )}

            {/* Evapotranspiración */}
            {latestData && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">ETo</h3>
                        <p className="text-3xl font-bold text-green-600">{latestData.eto.toFixed(2)} mm/día</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">ETc</h3>
                        <p className="text-3xl font-bold text-green-600">{latestData.etc.toFixed(2)} mm/día</p>
                    </div>
                    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recomendación de Riego</h3>
                        <p className="text-xl font-semibold text-blue-600">
                            Aplica {latestData.cantidad_agua.toFixed(2)} L de agua hoy
                        </p>
                    </div>
                </div>
            )}

            {/* Gráfica */}
            {data && data.length > 0 && !error && !loading && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Tendencia de Evapotranspiración</h2>
                        <div className="space-x-2">
                            <Button
                                variant={range === '24h' ? 'solid' : 'light'}
                                onClick={() => setRange('24h')}
                                aria-label="Mostrar datos de las últimas 24 horas"
                            >
                                Últimas 24h
                            </Button>
                            <Button
                                variant={range === '7d' ? 'solid' : 'light'}
                                onClick={() => setRange('7d')}
                                aria-label="Mostrar datos de los últimos 7 días"
                            >
                                Últimos 7 días
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-80">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: { display: true, text: 'Evapotranspiración (mm/día)' },
                                        grid: { color: 'rgba(0, 0, 0, 0.1)' }
                                    },
                                    x: {
                                        title: { display: true, text: 'Tiempo' },
                                        grid: { color: 'rgba(0, 0, 0, 0.1)' }
                                    },
                                },
                                plugins: {
                                    legend: { position: 'top' },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.dataset.label}: ${context.raw} mm/día`,
                                            title: (tooltipItems) => {
                                                return new Date(tooltipItems[0].label).toLocaleString();
                                            }
                                        }
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Tabla */}
            {data && data.length > 0 && !error && !loading && (
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <Tabla
                        title="Histórico de Mediciones"
                        headers={headers}
                        data={mappedData}
                        onClickAction={handleRowClick}
                        onUpdate={handleUpdate}
                        onCreate={handleCreate}
                        createButtonTitle="Crear"
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo="Detalles de la Medición"
                    contenido={modalContenido}
                />
            )}
        </div>
    );
};

export default Evapotranspiracion;