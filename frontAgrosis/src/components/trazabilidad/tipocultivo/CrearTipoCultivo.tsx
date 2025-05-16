import { useState, FormEvent } from 'react';
import { useCrearTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';

interface CrearTipoCultivoProps {
  onSuccess: () => void;
}

const CICLO_OPCIONES = [
  { value: '', label: 'Seleccione el tipo de cultivo' },
  { value: 'Perennes', label: 'Perennes' },
  { value: 'Semiperennes', label: 'Semiperennes' },
  { value: 'Transitorios', label: 'Transitorios' },
];

const CrearTipoCultivo = ({ onSuccess }: CrearTipoCultivoProps) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cicloDuracion, setCicloDuracion] = useState('');
  const { mutate: createTipoCultivo, isPending } = useCrearTipoCultivo();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      alert('El nombre es obligatorio.');
      return;
    }
    if (!cicloDuracion) {
      alert('Debe seleccionar un ciclo de duración.');
      return;
    }

    createTipoCultivo(
      { nombre, descripcion: descripcion || '', ciclo_duracion: cicloDuracion },
      {
        onSuccess: () => {
          setNombre('');
          setDescripcion('');
          setCicloDuracion('');
          onSuccess(); // Esto cerrará el modal desde el componente padre
        },
      }
    );
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
        <div>
          <label htmlFor="cicloDuracion" className="block text-sm font-medium text-gray-700">
            Ciclo de Duración
          </label>
          <select
            id="cicloDuracion"
            value={cicloDuracion}
            onChange={(e) => setCicloDuracion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            disabled={isPending}
          >
            {CICLO_OPCIONES.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white"
            disabled={isPending}
          >
            {isPending ? 'Creando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearTipoCultivo;