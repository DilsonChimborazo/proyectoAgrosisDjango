import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { Realiza, useRealiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import VentanaModal from '../../globales/VentanasModales';
import CrearRealiza from '../realiza/CrearRealiza';
import CrearUsuario from '../../usuarios/usuario/crearUsuario';
import { showToast } from '@/components/globales/Toast';
import axios from 'axios';

interface Rol {
  id: number;
  rol: string;
}

interface Ficha {
  id: number;
  numero_ficha: number;
  nombre_ficha: string;
  abreviacion: string;
  fecha_inicio: string;
  fecha_salida: string;
  is_active: boolean;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  ficha?: Ficha | string;
  fk_id_rol?: Rol;
}

interface Cultivo {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: any; // Simplificado, ajusta según necesidad
}

interface Plantacion {
  id: number;
  descripcion: string;
  fk_id_cultivo?: Cultivo; // Opcional
  cantidad_transplante?: number;
  fk_id_semillero?: any; // Hacer opcional para alinear con useRealiza
  fecha_plantacion: string;
}

interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion;
  fk_id_actividad: Actividad;
}

interface Herramienta {
  id: number;
  nombre_h: string; // Ajusta según tu modelo
}

interface Insumo {
  id: number;
  nombre: string; // Ajusta según tu modelo
}

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

const CrearAsignacion = ({ onSuccess, usuarios: initialUsuarios, onCreateUsuario }: CrearAsignacionModalProps) => {
  const { mutate: createAsignacion, isPending } = useCrearAsignacion();
  const { data: realizaList = [], isLoading: isLoadingRealiza, error: errorRealiza, refetch: refetchRealiza } = useRealiza();
  const [formData, setFormData] = useState({
    fk_id_realiza: '',
    fk_identificacion: [] as string[],
    estado: 'Pendiente' as 'Pendiente',
    fecha_programada: '',
    observaciones: '',
    herramientas: [] as SelectOption[],
    insumos: [] as SelectOption[],
  });
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedFicha, setSelectedFicha] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    console.log('Usuarios iniciales:', JSON.stringify(initialUsuarios, null, 2));
    setUsuarios(initialUsuarios);
  }, [initialUsuarios]);

  useEffect(() => {
    console.log('realizaList:', JSON.stringify(realizaList, null, 2));
  }, [realizaList]);

  // Cargar herramientas e insumos con depuración
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [herramientasResp, insumosResp] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'}herramientas/`),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'}insumo/`),
        ]);
        console.log('Respuesta herramientas:', herramientasResp.data);
        console.log('Respuesta insumos:', insumosResp.data);
        if (Array.isArray(herramientasResp.data)) {
          setHerramientas(herramientasResp.data);
        } else {
          console.error('Datos de herramientas no es un array:', herramientasResp.data);
          setHerramientas([]);
        }
        if (Array.isArray(insumosResp.data)) {
          setInsumos(insumosResp.data);
        } else {
          console.error('Datos de insumos no es un array:', insumosResp.data);
          setInsumos([]);
        }
      } catch (error: any) {
        console.error('Error al cargar recursos:', error.response?.data || error.message);
        showToast({
          title: 'Error',
          description: 'No se pudieron cargar los recursos. Revisa la consola para más detalles.',
          timeout: 5000,
          variant: 'error',
        });
      }
    };
    fetchResources();
  }, []);

  const roleOptions: SelectOption[] = Array.from(
    new Set(usuarios.map((usuario) => usuario.fk_id_rol?.id || 0).filter((id) => id !== 0))
  ).map((fk_id_rol) => {
    const usuario = usuarios.find((u) => u.fk_id_rol?.id === fk_id_rol);
    return {
      value: String(fk_id_rol),
      label: usuario?.fk_id_rol?.rol || 'Sin nombre de rol',
    };
  });

  const fichaOptions: SelectOption[] = Array.from(
    new Set(
      usuarios
        .filter((usuario) => {
          const userRoleId = usuario.fk_id_rol?.id ? String(usuario.fk_id_rol.id) : '';
          return !selectedRole || userRoleId === selectedRole;
        })
        .map((usuario) => {
          if (usuario.ficha) {
            return typeof usuario.ficha === 'object' && 'numero_ficha' in usuario.ficha
              ? String(usuario.ficha.numero_ficha)
              : String(usuario.ficha);
          }
          return 'Sin ficha';
        })
    )
  ).map((ficha) => ({
    value: ficha,
    label: ficha === 'Sin ficha' ? 'Sin ficha' : `Ficha ${ficha}`,
  }));

  const usuarioOptions: SelectOption[] = usuarios
    .filter((usuario) => {
      const userRoleId = usuario.fk_id_rol?.id ? String(usuario.fk_id_rol.id) : '';
      const matchesRole = !selectedRole || userRoleId === selectedRole;
      const userFicha =
        usuario.ficha
          ? typeof usuario.ficha === 'object' && 'numero_ficha' in usuario.ficha
            ? String(usuario.ficha.numero_ficha)
            : String(usuario.ficha)
          : 'Sin ficha';
      const matchesFicha = !selectedFicha || userFicha === selectedFicha;
      console.log(
        `Usuario: ${usuario.nombre} ${usuario.apellido}, ID: ${usuario.id}, Ficha: ${JSON.stringify(
          usuario.ficha,
          null,
          2
        )}, Rol ID: ${userRoleId}, Selected Role: ${selectedRole}, Selected Ficha: ${selectedFicha}, Matches Role: ${matchesRole}, Matches Ficha: ${matchesFicha}`
      );
      return matchesRole && matchesFicha;
    })
    .map((usuario) => ({
      value: String(usuario.id),
      label: `${usuario.nombre} ${usuario.apellido} - Ficha: ${
        usuario.ficha && typeof usuario.ficha === 'object' && 'numero_ficha' in usuario.ficha
          ? usuario.ficha.numero_ficha || 'Sin ficha'
          : usuario.ficha || 'Sin ficha'
      } - Rol: ${usuario.fk_id_rol?.rol || 'Sin rol'}`,
    }));

  const opcionesHerramientas: SelectOption[] = herramientas.map((h) => ({
    value: String(h.id),
    label: h.nombre_h,
  }));

  const opcionesInsumos: SelectOption[] = insumos.map((i) => ({
    value: String(i.id),
    label: i.nombre,
  }));

  console.log('Opciones herramientas:', opcionesHerramientas);
  console.log('Opciones insumos:', opcionesInsumos);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedOption: SelectOption | null) => {
    const newRole = selectedOption ? selectedOption.value : '';
    setSelectedRole(newRole);
    setSelectedFicha('');
    setFormData((prev) => ({
      ...prev,
      fk_identificacion: prev.fk_identificacion.filter((id) => {
        const user = usuarios.find((u) => String(u.id) === id);
        return newRole ? String(user?.fk_id_rol?.id) === newRole : true;
      }),
    }));
  };

  const handleFichaChange = (selectedOption: SelectOption | null) => {
    const newFicha = selectedOption ? selectedOption.value : '';
    setSelectedFicha(newFicha);
    setFormData((prev) => ({
      ...prev,
      fk_identificacion: prev.fk_identificacion.filter((id) => {
        const user = usuarios.find((u) => String(u.id) === id);
        const userFicha =
          user?.ficha
            ? typeof user.ficha === 'object' && 'numero_ficha' in user.ficha
              ? String(user.ficha.numero_ficha)
              : String(user.ficha)
            : 'Sin ficha';
        return newFicha ? userFicha === newFicha : true;
      }),
    }));
  };

  const handleUsuariosChange = (selectedOptions: SelectOption[] | null) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, fk_identificacion: selectedIds }));
  };

  const handleHerramientasChange = (selectedOptions: SelectOption[] | null) => {
    setFormData((prev) => ({ ...prev, herramientas: selectedOptions || [] }));
  };

  const handleInsumosChange = (selectedOptions: SelectOption[] | null) => {
    setFormData((prev) => ({ ...prev, insumos: selectedOptions || [] }));
  };

  const validateForm = () => {
    if (!formData.fk_id_realiza) return 'Debe seleccionar una gestión de cultivo';
    if (formData.fk_identificacion.length === 0) return 'Debe seleccionar al menos un usuario';
    if (!formData.fecha_programada) return 'Debe ingresar una fecha programada';
    if (new Date(formData.fecha_programada) < new Date(today)) {
      return 'La fecha programada no puede ser anterior a hoy';
    }
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

    createAsignacion(
      {
        fk_id_realiza: Number(formData.fk_id_realiza),
        fk_identificacion: formData.fk_identificacion.map(Number),
        estado: formData.estado,
        fecha_programada: formData.fecha_programada,
        observaciones: formData.observaciones,
      },
      {
        onSuccess: async (data) => {
          const asignacionId = data.id;

          // Asignar recursos después de crear la asignación
          const herramientasIds = formData.herramientas.map((h) => Number(h.value));
          const insumosIds = formData.insumos.map((i) => Number(i.value));

          if (herramientasIds.length > 0 || insumosIds.length > 0) {
            try {
              // Llamada a asignar_recursos
              await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'}asignaciones_actividades/${asignacionId}/asignar-recursos/`,
                {
                  herramientas_ids: herramientasIds,
                  insumos_ids: insumosIds,
                },
                { headers: { 'Content-Type': 'application/json' } }
              );

              showToast({
                title: 'Éxito',
                description: 'Asignación y recursos registrados correctamente.',
                timeout: 3000,
                variant: 'success',
              });
            } catch (error: any) {
              showToast({
                title: 'Error',
                description:
                  error.response?.data?.detail || 'No se pudieron asignar los recursos.',
                timeout: 5000,
                variant: 'error',
              });
            }
          } else {
            showToast({
              title: 'Éxito',
              description: 'Asignación registrada correctamente.',
              timeout: 3000,
              variant: 'success',
            });
          }

          setFormData({
            fk_id_realiza: '',
            fk_identificacion: [],
            estado: 'Pendiente',
            fecha_programada: '',
            observaciones: '',
            herramientas: [],
            insumos: [],
          });
          setSelectedRole('');
          setSelectedFicha('');
          onSuccess();
        },
        onError: (error) => {
          showToast({
            title: 'Error',
            description: error.message || 'Ocurrió un error al crear la asignación.',
            timeout: 5000,
            variant: 'error',
          });
        },
      }
    );
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
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newUser: Usuario) => {
          onCreateUsuario(newUser);
          setUsuarios((prev) => [...prev, newUser]);
          setIsModalOpen(false);
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
        <button onClick={() => refetchRealiza()} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Registrar Nueva Asignación</h2>
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
                  {`Plantación: ${
                    realiza.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'
                  } - Actividad: ${realiza.fk_id_actividad?.nombre_actividad || 'Sin actividad'}`}
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
            Rol (Opcional)
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
          />
        </div>
        <div>
          <label htmlFor="ficha" className="block text-sm font-medium text-gray-700">
            Ficha (Opcional)
          </label>
          <Select
            id="ficha"
            options={fichaOptions}
            value={fichaOptions.find((option) => option.value === selectedFicha) || null}
            onChange={handleFichaChange}
            placeholder="Selecciona una ficha..."
            isClearable
            isDisabled={isPending}
            className="mt-1"
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
            disabled
          >
            <option value="Pendiente">Pendiente</option>
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
            min={today}
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
        <div>
          <label htmlFor="herramientas" className="block text-sm font-medium text-gray-700">
            Herramientas
          </label>
          <Select
            id="herramientas"
            isMulti
            options={opcionesHerramientas}
            value={formData.herramientas}
            onChange={handleHerramientasChange}
            placeholder="Selecciona herramientas..."
            isDisabled={isPending}
          />
          {opcionesHerramientas.length === 0 && (
            <p className="text-red-500 text-sm mt-1">No se cargaron herramientas.</p>
          )}
        </div>
        <div>
          <label htmlFor="insumos" className="block text-sm font-medium text-gray-700">
            Insumos
          </label>
          <Select
            id="insumos"
            isMulti
            options={opcionesInsumos}
            value={formData.insumos}
            onChange={handleInsumosChange}
            placeholder="Selecciona insumos..."
            isDisabled={isPending}
          />
          {opcionesInsumos.length === 0 && (
            <p className="text-red-500 text-sm mt-1">No se cargaron insumos.</p>
          )}
        </div>
        <div className="flex justify-center">
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
          onClose={() => setIsModalOpen(false)}
          titulo=""
          contenido={modalContent}
        />
      )}
    </div>
  );
};

export default CrearAsignacion;