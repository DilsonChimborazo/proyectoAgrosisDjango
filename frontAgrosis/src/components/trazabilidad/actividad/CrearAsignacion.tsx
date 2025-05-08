import { useState } from 'react';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { Realiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { Usuario } from '@/hooks/usuarios/usuario/useUsuarios';

interface CrearAsignacionModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  realizaList: Realiza[];
  usuarios: Usuario[];
  onCreateRealiza: () => void;
  onCreateUsuario: () => void;
}

const CrearAsignacion = ({ onSuccess, onCancel, realizaList, usuarios, onCreateRealiza, onCreateUsuario }: CrearAsignacionModalProps) => {
  const { mutate: createAsignacion, isPending, error: mutationError } = useCrearAsignacion();
  const [formData, setFormData] = useState({
    fk_id_realiza: '',
    fk_identificacion: '',
    estado: 'Pendiente',
    fecha_programada: '',
    observaciones: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.fk_id_realiza) return 'Debe seleccionar un realiza';
    if (!formData.fk_identificacion) return 'Debe seleccionar un usuario';
    if (!formData.fecha_programada) return 'Debe ingresar una fecha programada';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createAsignacion(
        {
          fk_id_realiza: Number(formData.fk_id_realiza),
          fk_identificacion: Number(formData.fk_identificacion),
          estado: formData.estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
          fecha_programada: formData.fecha_programada,
          observaciones: formData.observaciones || '',
        },
        {
          onSuccess: () => {
            onSuccess();
          },
          onError: (err) => {
            setError('Error al crear la asignación. Por favor, intenta de nuevo.');
            console.error('Error creating asignacion:', err.message);
          },
        }
      );
    } catch (err) {
      setError('Error inesperado al crear la asignación.');
      console.error('Unexpected error:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Asignación</h2>
      {(error || mutationError) && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error || mutationError?.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_id_realiza" className="block text-sm font-medium text-gray-700">
              Realiza
            </label>
            <select
              id="fk_id_realiza"
              name="fk_id_realiza"
              value={formData.fk_id_realiza}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={isPending}
            >
              <option value="">Selecciona un realiza</option>
              {realizaList.map((realiza) => (
                <option key={realiza.id} value={realiza.id}>
                  {`${realiza.fk_id_cultivo?.fk_id_especie?.nombre_comun || 'Sin especie'} - ${
                    realiza.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'
                  } - ${realiza.fk_id_actividad?.nombre_actividad || 'Sin actividad'}`}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onCreateRealiza}
            className="mt-6 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900"
            title="Crear nuevo realiza"
            disabled={isPending}
          >
            +
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_identificacion" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <select
              id="fk_identificacion"
              name="fk_identificacion"
              value={formData.fk_identificacion}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={isPending}
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {`${usuario.nombre} ${usuario.apellido}`}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onCreateUsuario}
            className="mt-6 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900"
            title="Crear nuevo usuario"
            disabled={isPending}
          >
            +
          </button>
        </div>
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={isPending}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Reprogramada">Reprogramada</option>
          </select>
        </div>
        <div>
          <label htmlFor="fecha_programada" className="block text-sm font-medium text-gray-700">
            Fecha Programada
          </label>
          <input
            type="date"
            id="fecha_programada"
            name="fecha_programada"
            value={formData.fecha_programada}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
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
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900"
            disabled={isPending}
          >
            {isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearAsignacion;