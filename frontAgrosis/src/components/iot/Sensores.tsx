import { useState } from 'react';
import { useSensores } from '../../hooks/iot/useSensores';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';
import Button from "@/components/globales/Button";
import { useNavigate } from "react-router-dom";

const Sensores = () => {
const navigate = useNavigate();
const { data: sensores, error, isLoading } = useSensores();
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedAsignacion, setSelectedAsignacion] = useState<any>(null);

  // Función para abrir el modal con una asignación seleccionada
const openModal = (sensores: any) => {
    setSelectedAsignacion(sensores);
    setIsModalOpen(true);
};

  // Función para cerrar el modal
const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsignacion(null);
};

  // Si los datos aún están cargando
if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

const tablaData = (sensores ?? []).map((sensores) => ({
    id: sensores.id,
    nombre_sensor: sensores.nombre_sensor,
    tipo_sensor: sensores.tipo_sensor,
    unidad_medida: sensores.unidad_medida,
    descripcion: sensores.descripcion,
    medida_minima: sensores.medida_minima,
    medida_maxima: sensores.medida_maxima
}));

const headers = ['ID', 'Nombre', 'Tipo_sensor', 'Unidad_medida', 'Descripcion', 'Medida_minima', 'medida_maxima'];

return (
    <div className=" mx-auto p-4">
                  <Button 
                text="Crear Sensor" 
                onClick={() => navigate("/Crear-Sensor")} 
                variant="success" 
            />
    
    <Tabla
        title="Lista de Sensores"
        headers={headers}
        data={tablaData} 
        onClickAction={openModal} 
    />
    <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contenido={selectedAsignacion} 
        tipo="sensores" 
        />
    </div>
    );
};

export default Sensores;
