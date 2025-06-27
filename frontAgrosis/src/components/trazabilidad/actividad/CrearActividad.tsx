import { useState } from "react";
import axios from "axios";
import { showToast } from '@/components/globales/Toast';

const apiUrl = import.meta.env.VITE_API_URL;

interface CrearActividadProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const CrearActividad = ({ onSuccess }: CrearActividadProps) => {
  const [nombreActividad, setNombreActividad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreActividad.trim().length < 3) {
      showToast({
        title: 'Error al crear actividad',
        description: 'El nombre debe tener al menos 3 caracteres.',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${apiUrl}actividad/`, {
        nombre_actividad: nombreActividad.trim(),
        descripcion: descripcion.trim(),
      });
      setNombreActividad("");
      setDescripcion("");
      showToast({
        title: 'Actividad creada exitosamente',
        description: 'La actividad ha sido registrada en el sistema',
        timeout: 4000,
        variant: 'success',
      });
      onSuccess();
    } catch (err: any) { 
      showToast({
        title: 'Error al crear actividad',
        description: err.response?.data?.detail || 'Error al crear la actividad. Inténtalo nuevamente.',
        timeout: 5000,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Crear Nueva Actividad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold">Nombre de la Actividad:</label>
          <input
            type="text"
            value={nombreActividad}
            onChange={(e) => setNombreActividad(e.target.value)}
            required
            className="border px-2 py-1 w-full rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="border px-2 py-1 w-full rounded"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-white text-[#2e7d32] px-4 py-2 rounded-md border border-[#2e7d32] hover:bg-[#2e7d32] hover:text-white ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearActividad;