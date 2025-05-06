import { useState } from 'react';
import { useCrearProgramacion } from '@/hooks/trazabilidad/programacion/useCrearProgramacion';
import { useActualizarAsignacion } from '@/hooks/trazabilidad/asignacion/useActualizarAsignacion';

interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada?: string;
  duracion?: number;
  cantidad_insumo?: number;
  img?: string;
  fk_unidad_medida?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

interface UnidadMedida {
  id: number;
  nombre_medida: string;
  abreviatura: string;
}

interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones?: string;
  fk_id_realiza: number | { id: number };
  fk_identificacion: number | { id: number };
}

interface CrearProgramacionModalProps {
  asignacionId: number;
  existingProgramacion?: Programacion;
  unidadesMedida: UnidadMedida[];
  asignacion?: Asignacion;
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearProgramacionModal = ({ asignacionId, existingProgramacion, unidadesMedida, asignacion, onSuccess, onCancel }: CrearProgramacionModalProps) => {
  const { mutate: createProgramacion, isLoading: isLoadingProgramacion, error: mutationErrorProgramacion } = useCrearProgramacion();
  const { mutate: actualizarAsignacion, isLoading: isLoadingAsignacion, error: mutationErrorAsignacion } = useActualizarAsignacion();
  const [formData, setFormData] = useState({
    estado: asignacion?.estado || 'Pendiente', // Default to lowercase
    fecha_realizada: existingProgramacion?.fecha_realizada || '',
    duracion: existingProgramacion?.duracion?.toString() || '',
    cantidad_insumo: existingProgramacion?.cantidad_insumo?.toString() || '',
    fk_unidad_medida: existingProgramacion?.fk_unidad_medida?.toString() || '',
    img: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'img' && files) {
      setFormData((prev) => ({ ...prev, img: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() })); // Convert to lowercase
    }
    setError(null);
  };

  const validateForm = () => {
    if (!formData.fecha_realizada) return 'Debe ingresar la fecha realizada';
    if (!formData.duracion || Number(formData.duracion) <= 0) return 'Debe ingresar una duración válida';
    if (!formData.cantidad_insumo || Number(formData.cantidad_insumo) <= 0) return 'Debe ingresar una cantidad de insumo válida';
    if (!formData.fk_unidad_medida) return 'Debe seleccionar una unidad de medida';
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
      const formDataToSend = new FormData();
      formDataToSend.append('fk_id_asignacionActividades', asignacionId.toString());
      formDataToSend.append('fecha_realizada', formData.fecha_realizada);
      formDataToSend.append('duracion', formData.duracion);
      formDataToSend.append('cantidad_insumo', formData.cantidad_insumo);
      formDataToSend.append('fk_unidad_medida', formData.fk_unidad_medida);
      if (formData.img) {
        formDataToSend.append('img', formData.img);
      }

      await createProgramacion(formDataToSend, {
        onSuccess: (data: Programacion) => {
          if (data) {
            actualizarAsignacion(
              { id: asignacionId, estado: formData.estado }, // Use lowercase estado
              {
                onSuccess: () => {
                  onSuccess();
                },
                onError: (err: any) => {
                  setError(`Error al actualizar la asignación: ${err.response?.data?.estado?.[0] || err.message || 'Por favor, intenta de nuevo.'}`);
                },
              }
            );
          } else {
            setError('No se recibió datos válidos de la programación creada.');
          }
        },
        onError: (err: any) => {
          setError(`Error al crear la programación: ${err.message || 'Por favor, intenta de nuevo.'}`);
        },
      });
    } catch (err) {
      setError('Error inesperado al crear la programación.');
      console.error('Unexpected error:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registrar Programación (Finalizar Asignación)</h2>
      {(error || mutationErrorProgramacion || mutationErrorAsignacion) && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error || mutationErrorProgramacion?.message || mutationErrorAsignacion?.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Reprogramada">Reprogramada</option>
          </select>
        </div>
        <div>
          <label htmlFor="fecha_realizada" className="block text-sm font-medium text-gray-700">
            Fecha Realizada
          </label>
          <input
            type="date"
            id="fecha_realizada"
            name="fecha_realizada"
            value={formData.fecha_realizada}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            id="duracion"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="cantidad_insumo" className="block text-sm font-medium text-gray-700">
            Cantidad de Insumo
          </label>
          <input
            type="number"
            id="cantidad_insumo"
            name="cantidad_insumo"
            value={formData.cantidad_insumo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="fk_unidad_medida" className="block text-sm font-medium text-gray-700">
            Unidad de Medida
          </label>
          <select
            id="fk_unidad_medida"
            name="fk_unidad_medida"
            value={formData.fk_unidad_medida}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Selecciona una unidad</option>
            {unidadesMedida.map((unidad) => (
              <option key={unidad.id} value={unidad.id}>
                {unidad.nombre_medida} ({unidad.abreviatura})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="img" className="block text-sm font-medium text-gray-700">
            Imagen (opcional)
          </label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            accept="image/*"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isLoadingProgramacion || isLoadingAsignacion}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900"
            disabled={isLoadingProgramacion || isLoadingAsignacion}
          >
            {isLoadingProgramacion || isLoadingAsignacion ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearProgramacionModal;