import { useState, useEffect } from 'react';
import { useEvapotranspiracion } from '../../../hooks/iot/evapotranspiracion/useEvapotranspiracion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData } from 'chart.js';
import 'chart.js/auto';
import { Button, Select, SelectItem } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import axios from 'axios'; // Añadimos axios

// Registrar componentes de chart.js
ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

// URL base para la API
const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

// Interfaz para las eras
export interface Eras {
  id: number;
  nombre: string;
  fk_id_lote: { id: number; nombre_lote: string } | null;
  descripcion: string;
  estado: boolean;
}

interface EvapoData {
  id: number;
  era_id: number;
  nombre_era: string;
  cultivo: string;
  eto: number;
  etc: number;
  fecha: string;
}

const Evapotranspiracion = () => {
  const [eraId, setEraId] = useState<number>(0); // Inicializa en 0 o un valor por defecto
  const [eras, setEras] = useState<Eras[]>([]); // Estado para almacenar las eras
  const [errorEras, setErrorEras] = useState<string | null>(null); // Estado para errores de eras
  const { data, latestData, loading, error, fetchData } = useEvapotranspiracion(eraId);
  const [selectedEvapo, setSelectedEvapo] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [range, setRange] = useState<'24h' | '7d'>('24h');
  const navigate = useNavigate();

  // Cargar las eras al montar el componente
  useEffect(() => {
    const loadEras = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${apiUrl}eras/`, { headers });
        const erasData = response.data;
        setEras(erasData);
        // Opcional: Establecer una era por defecto si eraId es 0
        if (erasData.length > 0 && eraId === 0) {
          setEraId(erasData[0].id);
        }
      } catch (err: any) {
        console.error('Error al cargar eras:', err);
        setErrorEras(err.message || 'No se pudo cargar la lista de eras');
      }
    };
    loadEras();
  }, []);

  // Preparar datos para el gráfico
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const now = Date.now();
      const filteredData = range === '24h'
        ? data.filter(d => new Date(d.fecha).getTime() > now - 24 * 60 * 60 * 1000)
        : data.filter(d => new Date(d.fecha).getTime() > now - 7 * 24 * 60 * 60 * 1000);

      if (filteredData.length === 0) {
        setChartData({
          labels: [],
          datasets: [],
        });
        return;
      }

      const labels: string[] = filteredData.map(d => new Date(d.fecha).toLocaleTimeString());
      const etoData: number[] = filteredData.map(d => Number(d.eto) || 0);
      const etcData: number[] = filteredData.map(d => Number(d.etc) || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: 'ETo (mm/día)',
            data: etoData,
            borderColor: '#3B82F6',
            fill: false,
            tension: 0.3,
          },
          {
            label: 'ETc (mm/día)',
            data: etcData,
            borderColor: '#10B981',
            fill: false,
            tension: 0.3,
          },
        ],
      });
    } else {
      setChartData({
        labels: [],
        datasets: [],
      });
    }
  }, [data, range]);

  const openModalHandler = (evapo: object) => {
    setSelectedEvapo(evapo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvapo(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (evapo: { id: number }) => {
    navigate(`/EditarEvapotranspiracion/${evapo.id}`);
  };

  const handleCreate = () => {
    navigate("/crear-evapotranspiracion");
  };

  const handleRefresh = () => {
    fetchData();
  };

  const headers = [
    'Fecha',
    'Era',
    'Cultivo',
    'ETo (mm/día)',
    'ETc (mm/día)',
  ];

  const handleRowClick = (evapo: object) => {
    openModalHandler(evapo);
  };

  const mappedData = data?.map((evapo: EvapoData) => ({
    id: evapo.id,
    fecha: new Date(evapo.fecha).toLocaleString(),
    era: evapo.nombre_era,
    cultivo: evapo.cultivo,
    eto: evapo.eto.toFixed(2),
    etc: evapo.etc.toFixed(2),
  })) || [];

  return (
    <div className="p-6  min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center">
          Evapotranspiración
        </h1>

        <div className="flex items-center space-x-4">
          <Select
            placeholder="Seleccionar Era"
            value={eraId}
            onChange={(e) => setEraId(Number(e.target.value))}
            className="w-48"
            disabled={eras.length === 0} // Deshabilitar si no hay eras
          >
            {eras.map((era) => (
              <SelectItem key={era.id} value={era.id}>
                {era.nombre}
              </SelectItem>
            ))}
          </Select>
          <Button
            variant="light"
            className="text-gray-600 hover:text-blue-500"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="ml-2">Refrescar</span>
          </Button>
        </div>
      </div>

      {/* Estado */}
      {loading && <p className="text-gray-600 mb-4">Cargando datos...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {errorEras && <p className="text-red-500 mb-4">{errorEras}</p>}
      {!loading && !error && data?.length === 0 && (
        <p className="text-gray-600 mb-4">No hay datos disponibles.</p>
      )}

      {/* Evapotranspiración */}
      {latestData && !loading && !error && (
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
              Aplica {latestData.etc.toFixed(2)} mm de agua hoy
            </p>
          </div>
        </div>
      )}

      {/* Gráfico */}
      {data?.length > 0 && !loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Tendencia de Evapotranspiración</h2>
            <div className="space-x-2">
              <Button
                variant={range === '24h' ? 'solid' : 'light'}
                onClick={() => setRange('24h')}
              >
                Últimas 24h
              </Button>
              <Button
                variant={range === '7d' ? 'solid' : 'light'}
                onClick={() => setRange('7d')}
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
                  y: { beginAtZero: true, title: { display: true, text: 'Evapotranspiración (mm/día)' } },
                  x: { title: { display: true, text: 'Tiempo' } },
                },
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw} mm/día` } },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Tabla */}
      {data?.length > 0 && !loading && !error && (
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
      {selectedEvapo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de la Medición"
          contenido={selectedEvapo}
        />
      )}
    </div>
  );
};

export default Evapotranspiracion;