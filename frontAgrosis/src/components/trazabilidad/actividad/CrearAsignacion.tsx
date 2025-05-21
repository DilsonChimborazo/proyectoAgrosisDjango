import { useState } from 'react';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { Realiza, useRealiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { Usuario } from '@/hooks/usuarios/usuario/useUsuarios';
import VentanaModal from '../../globales/VentanasModales';
import CrearRealiza from '../realiza/CrearRealiza';
import CrearUsuario from '../../usuarios/usuario/crearUsuario';
import { showToast } from '@/components/globales/Toast';

interface CrearAsignacionModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  usuarios: Usuario[];
  onCreateUsuario: () => void;
}

const CrearAsignacion = ({
  onSuccess,
  onCancel,
  usuarios,
  onCreateUsuario,
}: CrearAsignacionModalProps) => {
  const { mutate: createAsignacion, isPending } = useCrearAsignacion();
  const { data: realizaList = [], isLoading: isLoadingRealiza, error: errorRealiza, refetch: refetchRealiza } = useRealiza();
  const [formData, setFormData] = useState({
    fk_id_realiza: '',
    fk_identificacion: '',
    estado: 'Pendiente',
    fecha_programada: '',
    observaciones: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      showToast({
        title: 'Error al crear asignación',
        description: validationError,
        timeout: 5000,
        variant: 'error',
      });
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
            showToast({
              title: 'Asignación creada exitosamente',
              description: 'La asignación ha sido registrada en el sistema',
              timeout: 4000,
              variant: 'success',
            });
            onSuccess();
          },
          onError: (err) => {
            showToast({
              title: 'Error al crear asignación',
              description: err.message || 'Ocurrió un error al registrar la asignación',
              timeout: 5000,
              variant: 'error',
            });
          },
        }
      );
    } catch (err: any) {
      showToast({
        title: 'Error al crear asignación',
        description: err.message || 'Error inesperado al crear la asignación',
        timeout: 5000,
        variant: 'error',
      });
    }
  };

  const openCreateRealizaModal = () => {
    setModalContent(
      <CrearRealiza
        onSuccess={async () => {
          await refetchRealiza();
          setIsModalOpen(false);
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

  if (isLoadingRealiza) {
    return <div className="text-center text-gray-500">Cargando realiza...</div>;
  }

  if (errorRealiza) {
    showToast({
      title: 'Error al cargar realiza',
      description: 'No se pudieron cargar los datos de realiza',
      timeout: 5000,
      variant: 'error',
    });
    return <div className="text-center text-red-500">Error al cargar realiza</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Asignación</h2>
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
              {realizaList.map((realiza: Realiza) => (
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
            className="mt-6 bg-green-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-900 border border-green-800"
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
                  {`${usuario.nombre} ${usuario.apellido} - Ficha: ${usuario.numero_ficha || 'Sin ficha'}`}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openCreateUsuarioModal}
            className="mt-6 bg-green-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-900 border border-green-800"
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
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-white text-[#2e7d32] px-4 py-2 rounded-md border border-[#2e7d32] hover:bg-[#2e7d32] hover:text-white"
            disabled={isPending}
          >
            Registrar
          </button>
        </div>
      </form>
      {isModalOpen && modalContent && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titulo=""
          contenido={modalContent}
        />
      )}
    </div>
  );
};

export default CrearAsignacion;