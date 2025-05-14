import { useState } from 'react';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { Realiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { Usuario } from '@/hooks/usuarios/usuario/useUsuarios';
import VentanaModal from '../../globales/VentanasModales';
import CrearRealiza from '../realiza/CrearRealiza';
import CrearUsuario from '../../usuarios/usuario/crearUsuario';

interface CrearAsignacionModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  realizaList: Realiza[];
  usuarios: Usuario[];
  onCreateRealiza: () => void;
  onCreateUsuario: () => void;
}

const CrearAsignacion = ({
  onSuccess,
  onCancel,
  realizaList,
  usuarios,
  onCreateRealiza,
  onCreateUsuario,
}: CrearAsignacionModalProps) => {
  const { mutate: createAsignacion, isPending, error: mutationError } = useCrearAsignacion();
  const [formData, setFormData] = useState({
    fk_id_realiza: '',
    fk_identificacion: [] as number[],
    estado: 'Pendiente',
    fecha_programada: '',
    observaciones: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'fk_identificacion') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions).map((option) =>
        Number(option.value)
      );
      console.log('Usuarios seleccionados:', selectedOptions); // Depuración
      setFormData((prev) => ({ ...prev, fk_identificacion: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  // Alternativa con checkboxes (descomentar si prefieres)
  /*
  const handleCheckboxChange = (userId: number) => {
    setFormData((prev) => {
      const newSelection = prev.fk_identificacion.includes(userId)
        ? prev.fk_identificacion.filter((id) => id !== userId)
        : [...prev.fk_identificacion, userId];
      console.log('Usuarios seleccionados (checkbox):', newSelection); // Depuración
      return { ...prev, fk_identificacion: newSelection };
    });
    setError(null);
  };
  */

  const validateForm = () => {
    if (!formData.fk_id_realiza) return 'Debe seleccionar un realiza';
    if (formData.fk_identificacion.length === 0) return 'Debe seleccionar al menos un usuario';
    if (!formData.fecha_programada) return 'Debe ingresar una fecha programada';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    console.log('Enviando asignaciones con datos:', formData); // Depuración
    try {
      const promises = formData.fk_identificacion.map((usuarioId) =>
        createAsignacion(
          {
            fk_id_realiza: Number(formData.fk_id_realiza),
            fk_identificacion: usuarioId,
            estado: formData.estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
            fecha_programada: formData.fecha_programada,
            observaciones: formData.observaciones || '',
          },
          {
            onError: (err) => {
              throw new Error(`Error al crear asignación para usuario ${usuarioId}: ${err.message}`);
            },
          }
        )
      );

      await Promise.all(promises);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error inesperado al crear las asignaciones.');
      console.error('Unexpected error:', err);
    }
  };

  const openCreateRealizaModal = () => {
    setModalContent(
      <CrearRealiza
        onSuccess={() => {
          setIsModalOpen(false);
          onCreateRealiza();
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const openCreateUsuarioModal = () => {
    setModalContent(
      <CrearUsuario
        isOpen={true}
        onClose={() => {
          setIsModalOpen(false);
          onCreateUsuario();
        }}
      />
    );
    setIsModalOpen(true);
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
                  {`Plantación: ${realiza.fk_id_plantacion?.fk_id_semillero?.nombre_semilla || 'Sin semilla'} - Actividad: ${
                    realiza.fk_id_actividad?.nombre_actividad || 'Sin actividad'
                  }`}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openCreateRealizaModal}
            className="mt-6 bg-green-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-900"
            title="Crear nuevo realiza"
            disabled={isPending}
          >
            +
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_identificacion" className="block text-sm font-medium text-gray-700">
              Usuarios
            </label>
            <select
              id="fk_identificacion"
              name="fk_identificacion"
              multiple
              value={formData.fk_identificacion.map(String)}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              required
              disabled={isPending}
            >
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {`${usuario.nombre} ${usuario.apellido}`}
                </option>
              ))}
            </select>
            {/* Alternativa con checkboxes */}
            {/*
            <div className="mt-1 border border-gray-300 rounded-md shadow-sm p-2 max-h-32 overflow-y-auto">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`usuario-${usuario.id}`}
                    checked={formData.fk_identificacion.includes(usuario.id)}
                    onChange={() => handleCheckboxChange(usuario.id)}
                    className="mr-2"
                    disabled={isPending}
                  />
                  <label htmlFor={`usuario-${usuario.id}`}>
                    {`${usuario.nombre} ${usuario.apellido}`}
                  </label>
                </div>
              ))}
            </div>
            */}
          </div>
          <button
            type="button"
            onClick={openCreateUsuarioModal}
            className="mt-6 bg-green-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-900"
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
      <VentanaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        titulo=""
        contenido={modalContent}
      />
    </div>
  );
};

export default CrearAsignacion;