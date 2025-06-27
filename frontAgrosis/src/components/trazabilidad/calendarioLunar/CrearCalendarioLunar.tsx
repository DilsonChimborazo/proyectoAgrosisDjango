import React, { useState } from 'react';
import { useCrearCalendarioLunar } from '@/hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar';

interface CrearCalendarioLunarProps {
  closeModal: () => void;
  fechaInicial?: string;
}

const CrearCalendarioLunar: React.FC<CrearCalendarioLunarProps> = ({ closeModal, fechaInicial }) => {
  const mutation = useCrearCalendarioLunar();

  const [formData, setFormData] = useState({
    fecha: fechaInicial || '',
    descripcion_evento: '',
    evento: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        closeModal();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 font-bold"
          onClick={closeModal}
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-4">Registra un evento en el calendario</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            Fecha:
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1"
            />
          </label>

          <label className="flex flex-col">
            Evento:
            <input
              type="text"
              name="evento"
              value={formData.evento}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1"
              placeholder="Nombre del evento"
            />
          </label>

          <label className="flex flex-col">
            Descripción:
            <textarea
              name="descripcion_evento"
              value={formData.descripcion_evento}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1"
              placeholder="Detalles del evento"
            />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearCalendarioLunar;
