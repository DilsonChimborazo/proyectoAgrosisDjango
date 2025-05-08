import { useState, FormEvent } from 'react';
import { useCrearTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';

interface CrearTipoCultivoProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearTipoCultivo = ({ onSuccess, onCancel }: CrearTipoCultivoProps) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { mutate: createTipoCultivo, isPending } = useCrearTipoCultivo();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      alert('El nombre es obligatorio.');
      return;
    }
    createTipoCultivo({ nombre, descripcion: descripcion || '' }, {
      onSuccess: () => {
        setNombre('');
        setDescripcion('');
        onSuccess();
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Tipo de Cultivo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            disabled={isPending}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearTipoCultivo;