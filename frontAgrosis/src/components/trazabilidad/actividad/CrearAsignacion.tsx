import { useState, useEffect } from 'react';
import Select from 'react-select';
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
  onCreateUsuario: (newUser: Usuario) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const CrearAsignacion = ({ onSuccess, onCancel, usuarios: initialUsuarios, onCreateUsuario }: CrearAsignacionModalProps) => {
  const { mutate: createAsignacion, isPending } = useCrearAsignacion();
  const { data: realizaList = [], isLoading: isLoadingRealiza, error: errorRealiza, refetch: refetchRealiza } = useRealiza();
  const [formData, setFormData] = useState({
    fk_id_realiza: '',
    fk_identificacion: [] as string[],
    estado: 'Pendiente',
    fecha_programada: '',
    observaciones: '',
  });
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);

  // Sincronizar usuarios con initialUsuarios cuando cambie
  useEffect(() => {
    setUsuarios(initialUsuarios);
  }, [initialUsuarios]);

  // Obtener roles únicos de los usuarios
  const roleOptions: SelectOption[] = Array.from(
    new Set(usuarios.map((usuario) => usuario.fk_id_rol?.id || ''))
  )
    .filter((fk_id_rol) => fk_id_rol) // Excluir roles nulos
    .map((fk_id_rol) => {
      const usuario = usuarios.find((u) => u.fk_id_rol?.id === fk_id_rol);
      return {
        value: String(fk_id_rol),
        label: usuario?.fk_id_rol?.rol || 'Sin nombre de rol',
      };
    });

  // Filtrar usuarios según el rol seleccionado
  const usuarioOptions: SelectOption[] = usuarios
    .filter((usuario) => !selectedRole || String(usuario.fk_id_rol?.id) === selectedRole)
    .map((usuario) => ({
      value: String(usuario.id),
      label: `${usuario.nombre} ${usuario.apellido} - Ficha: ${usuario.ficha || 'Sin ficha'} - Rol: ${usuario.fk_id_rol?.rol || 'Sin rol'}`,
    }));

  // Manejar cambio en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de rol
  const handleRoleChange = (selectedOption: SelectOption | null) => {
    const newRole = selectedOption ? selectedOption.value : '';
    setSelectedRole(newRole);
    // Limpiar usuarios seleccionados si el rol cambia
    if (newRole !== selectedRole) {
      setFormData((prev) => ({ ...prev, fk_identificacion: [] }));
    }
  };

  // Manejar cambio de usuarios seleccionados
  const handleUsuariosChange = (selectedOptions: SelectOption[] | null) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, fk_identificacion: selectedIds }));
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.fk_id_realiza) return 'Debe seleccionar una gestión de cultivo';
    if (formData.fk_identificacion.length === 0) return 'Debe seleccionar al menos un usuario';
    if (!formData.fecha_programada) return 'Debe ingresar una fecha programada';
    return null;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.time('handleSubmitAsignacion'); // Depuración de tiempo

    const validationError = validateForm();
    if (validationError) {
      showToast({
        title: 'Error al crear asignación',
        description: validationError,
        timeout: 5000,
        variant: 'error',
      });
      console.timeEnd('handleSubmitAsignacion');
      return;
    }

    try {
      await createAsignacion(
        {
          fk_id_realiza: Number(formData.fk_id_realiza),
          fk_identificacion: formData.fk_identificacion.map(Number),
          estado: formData.estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
          fecha_programada: formData.fecha_programada,
          observaciones: formData.observaciones || '',
        },
        {
          onSuccess: () => {
            showToast({
              title: 'Asignación creada exitosamente',
              description: 'La asignación ha sido registrada en el sistema',
              timeout: 2000,
              variant: 'success',
            });
            setFormData({
              fk_id_realiza: '',
              fk_identificacion: [],
              estado: 'Pendiente',
              fecha_programada: '',
              observaciones: '',
            });
            setSelectedRole('');
            onSuccess();
            console.timeEnd('handleSubmitAsignacion');
          },
          onError: (err) => {
            showToast({
              title: 'Error al crear asignación',
              description: err.message || 'Ocurrió un error al registrar la asignación',
              timeout: 5000,
              variant: 'error',
            });
            console.timeEnd('handleSubmitAsignacion');
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
      console.timeEnd('handleSubmitAsignacion');
    }
  };

  // Abrir modal para crear realiza
  const openCreateRealizaModal = () => {
    console.log('Abriendo modal de CrearRealiza'); // Depuración
    setModalContent(
      <CrearRealiza
        onSuccess={async () => {
          console.log('Realiza creado, refetching realizaList');
          await refetchRealiza();
          setIsModalOpen(false);
          showToast({
            title: 'Gestión de cultivo creada',
            description: 'La gestión de cultivo ha sido registrada exitosamente.',
            timeout: 4000,
            variant: 'success',
          });
        }}
        onCancel={() => {
          console.log('Creación de realiza cancelada');
          setIsModalOpen(false);
          showToast({
            title: 'Creación cancelada',
            description: 'Se canceló la creación de la gestión de cultivo.',
            timeout: 4000,
            variant: 'info',
          });
        }}
      />
    );
    setIsModalOpen(true);
  };

  // Abrir modal para crear usuario
  const openCreateUsuarioModal = () => {
    console.log('Abriendo modal de CrearUsuario'); // Depuración
    setModalContent(
      <CrearUsuario
        isOpen={true}
        onClose={() => {
          console.log('Cerrando modal de CrearUsuario');
          setIsModalOpen(false);
          showToast({
            title: 'Creación de usuario cancelada',
            description: 'Se canceló la creación del usuario.',
            timeout: 4000,
            variant: 'info',
          });
        }}
        onSuccess={(newUser: Usuario) => {
          console.log('Usuario creado:', newUser);
          onCreateUsuario(newUser);
          setIsModalOpen(false);
          showToast({
            title: 'Usuario creado',
            description: 'El usuario ha sido registrado exitosamente.',
            timeout: 4000,
            variant: 'success',
          });
        }}
      />
    );
    setIsModalOpen(true);
  };

  if (isLoadingRealiza) {
    return (
      <div className="text-center text-gray-500">
        Cargando gestiones de cultivo...
        <div className="mt-2 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#2e7d32]"></div>
        </div>
      </div>
    );
  }

  if (errorRealiza) {
    return (
      <div className="text-center text-red-500">
        Error al cargar gestiones de cultivo
        <button
          onClick={() => {
            console.log('Reintentando cargar realizaList');
            refetchRealiza();
          }}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Gestión de Cultivo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_id_realiza" className="block text-sm font-medium text-gray-700">
              Gestión de Cultivo
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
              <option value="">Selecciona una gestión de cultivo</option>
              {realizaList.map((realiza: Realiza) => (
                <option key={realiza.id} value={realiza.id}>
                  {`Plantación: ${realiza.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'} - Actividad: ${
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
            title="Crear nueva gestión de cultivo"
            disabled={isPending}
          >
            +
          </button>
        </div>
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
            Rol
          </label>
          <Select
            id="rol"
            options={roleOptions}
            value={roleOptions.find((option) => option.value === selectedRole) || null}
            onChange={handleRoleChange}
            placeholder="Selecciona un rol..."
            isClearable
            isDisabled={isPending}
            className="mt-1"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#d1d5db',
                borderRadius: '0.375rem',
                padding: '0.25rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                '&:hover': { borderColor: '#9ca3af' },
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '0.375rem',
                marginTop: '0.25rem',
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? '#2e7d32' : isFocused ? '#e5e7eb' : 'white',
                color: isSelected ? 'white' : '#1f2937',
                '&:active': { backgroundColor: '#1e40af' },
              }),
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_identificacion" className="block text-sm font-medium text-gray-700">
              Usuarios
            </label>
            <Select
              id="fk_identificacion"
              isMulti
              options={usuarioOptions}
              value={usuarioOptions.filter((option) => formData.fk_identificacion.includes(option.value))}
              onChange={handleUsuariosChange}
              placeholder="Selecciona usuarios..."
              isDisabled={isPending}
              className="mt-1"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.25rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  '&:hover': { borderColor: '#9ca3af' },
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  marginTop: '0.25rem',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#2e7d32' : isFocused ? '#e5e7eb' : 'white',
                  color: isSelected ? 'white' : '#1f2937',
                  '&:active': { backgroundColor: '#1e40af' },
                }),
              }}
            />
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
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-white text-[#2e7d32] px-4 py-2 rounded-md border border-[#2e7d32] hover:bg-[#2e7d32] hover:text-white disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#2e7d32] mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrar'
            )}
          </button>
        </div>
      </form>
      {isModalOpen && modalContent && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log('Cerrando modal');
            setIsModalOpen(false);
          }}
          titulo=""
          contenido={modalContent}
        />
      )}
    </div>
  );
};

export default CrearAsignacion;