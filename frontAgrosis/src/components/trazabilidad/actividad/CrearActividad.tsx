import { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface CrearActividadProps {
  onSuccess: () => void;
}

const CrearActividad = ({ onSuccess }: CrearActividadProps) => {
  const [nombreActividad, setNombreActividad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreActividad.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
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
      setError("");
      onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Error al crear la actividad. Inténtalo nuevamente.";
      setError(errorMessage);
      console.error("Error al crear actividad:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Crear Nueva Actividad</h2>

      {error && <p className="text-red-500">{error}</p>}

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

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-green-700 text-white px-4 py-2 rounded hover:bg-green-900 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Guardando..." : "Guardar Actividad"}
        </button>
      </form>
    </div>
  );
};

export default CrearActividad;