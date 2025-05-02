import { useState } from 'react';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useRealiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { useCultivo} from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useActividad } from '@/hooks/trazabilidad/actividad/useActividad';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import { useSemilleros } from '@/hooks/trazabilidad/semillero/useSemilleros';
import { useTipoCultivo} from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import { useUsuarios } from '@/hooks/usuarios/usuario/useUsuarios';
import { Asignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import Formulario from '../../globales/Formulario';
import VentanaModal from '../../globales/VentanasModales';
import CrearRealiza from '../realiza/CrearRealiza';
import CrearCultivo from '../cultivos/CrearCultivos';
import CrearActividad from '../actividad/CrearAsignacion';
import CrearEspecie from '../especie/CrearEspecie';
import CrearSemillero from '../semillero/CrearSemillero';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';
import CrearUsuario from '../../usuarios/usuario/crearUsuario';
import { useNavigate } from 'react-router-dom';

const CrearAsignacion = () => {
  const mutation = useCrearAsignacion();
  const navigate = useNavigate();
  const { data: realizaList = [], isLoading: isLoadingRealiza } = useRealiza();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const { data: actividades = [], isLoading: isLoadingActividades } = useActividad();
  const { data: especies = [], isLoading: isLoadingEspecies } = useEspecie();
  const { data: semilleros = [], isLoading: isLoadingSemilleros } = useSemilleros();
  const { data: tiposCultivo = [], isLoading: isLoadingTiposCultivo } = useTipoCultivo();
  const { data: usuarios = [], isLoading: isLoadingUsuarios } = useUsuarios();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados para controlar los modales
  const [modalRealizaOpen, setModalRealizaOpen] = useState(false);
  const [modalCultivoOpen, setModalCultivoOpen] = useState(false);
  const [modalActividadOpen, setModalActividadOpen] = useState(false);
  const [modalEspecieOpen, setModalEspecieOpen] = useState(false);
  const [modalSemilleroOpen, setModalSemilleroOpen] = useState(false);
  const [modalTipoCultivoOpen, setModalTipoCultivoOpen] = useState(false);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);

  // Mapeo de opciones para el select de realiza
  const realizaOptions = realizaList.map((realiza) => {
    const especieNombre = realiza.fk_id_cultivo.fk_id_especie.nombre_comun || 'Sin especie';
    const cultivoNombre = realiza.fk_id_cultivo.nombre_cultivo || 'Sin cultivo';
    const nombreCompuesto = `${especieNombre} ${cultivoNombre}`.trim();
    return {
      value: realiza.id.toString(),
      label: nombreCompuesto || 'Sin nombre',
    };
  });

  // Mapeo de opciones para el select de usuarios
  const usuarioOptions = usuarios.map((usuario) => ({
    value: usuario.id.toString(),
    label: `${usuario.nombre} ${usuario.apellido}`,
  }));

  // Opciones para el select de estado
  const estadoOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' },
    { value: 'Reprogramada', label: 'Reprogramada' },
  ];

  // Definición de los campos del formulario
  const formFields = [
    {
      id: 'estado',
      label: 'Estado',
      type: 'select',
      options: estadoOptions,
    },
    { id: 'fecha_programada', label: 'Fecha Programada', type: 'date' },
    { id: 'observaciones', label: 'Observaciones', type: 'textarea' },
    {
      id: 'fk_id_realiza',
      label: 'Fk id realiza',
      type: 'select',
      options: realizaOptions.length > 0
        ? realizaOptions
        : [{ value: '', label: 'No hay opciones disponibles' }],
    },
    {
      id: 'fk_identificacion',
      label: 'Fk identificacion',
      type: 'select',
      options: usuarioOptions.length > 0
        ? usuarioOptions
        : [{ value: '', label: 'No hay usuarios disponibles' }],
    },
  ];

  // Manejo del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    const estado = formData.estado;
    const fechaProgramada = formData.fecha_programada;
    const observaciones = formData.observaciones;
    const fkIdRealiza = formData.fk_id_realiza;
    const fkIdentificacion = formData.fk_identificacion;

    // Validaciones
    if (
      typeof estado !== 'string' ||
      typeof fechaProgramada !== 'string' ||
      typeof observaciones !== 'string' ||
      typeof fkIdRealiza !== 'string' ||
      typeof fkIdentificacion !== 'string'
    ) {
      setErrorMessage('❌ Todos los campos deben ser de tipo texto');
      return;
    }

    if (!estado || !fechaProgramada || !fkIdRealiza || !fkIdentificacion) {
      setErrorMessage('❌ Los campos Estado, Fecha Programada, Fk id realiza y Fk identificacion son obligatorios');
      return;
    }

    if (fkIdRealiza === '' || fkIdentificacion === '') {
      setErrorMessage('❌ Debes seleccionar un realiza y un usuario válidos');
      return;
    }

    const nuevaAsignacion: Omit<Asignacion, 'id'> = {
      estado: estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
      fecha_programada: fechaProgramada,
      observaciones: observaciones.trim() || '',
      fk_id_realiza: parseInt(fkIdRealiza, 10),
      fk_identificacion: parseInt(fkIdentificacion, 10),
    };

    console.log('🚀 Enviando asignación al backend:', nuevaAsignacion);

    mutation.mutate(nuevaAsignacion, {
      onSuccess: () => {
        console.log('✅ Asignación creada exitosamente');
        navigate('/asignaciones'); // Redirige a la lista de asignaciones
      },
      onError: (error: any) => {
        const errorMsg = error.message || 'Error desconocido al crear la asignación';
        console.error('❌ Error al crear asignación:', errorMsg);
        setErrorMessage(`❌ Error: ${errorMsg}`);
      },
    });
  };

  if (
    isLoadingRealiza ||
    isLoadingCultivos ||
    isLoadingActividades ||
    isLoadingEspecies ||
    isLoadingSemilleros ||
    isLoadingTiposCultivo ||
    isLoadingUsuarios
  ) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Asignación"
      />

      {/* Botones para abrir modales */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setModalRealizaOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {realizaOptions.length > 0 ? 'Agregar nuevo Realiza' : 'Crear Realiza'}
        </button>
        <button
          onClick={() => setModalUsuarioOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {usuarioOptions.length > 0 ? 'Agregar nuevo Usuario' : 'Crear Usuario'}
        </button>
      </div>

      {/* Modal para Crear Realiza */}
      <VentanaModal
        isOpen={modalRealizaOpen}
        onClose={() => setModalRealizaOpen(false)}
        title="Crear Realiza"
      >
        <CrearRealiza
          onSuccess={() => setModalRealizaOpen(false)}
          cultivos={cultivos}
          actividades={actividades}
        />
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setModalCultivoOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={modalCultivoOpen}
          >
            {cultivos.length > 0 ? 'Agregar nuevo Cultivo' : 'Crear Cultivo'}
          </button>
          <button
            onClick={() => setModalActividadOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={modalActividadOpen}
          >
            {actividades.length > 0 ? 'Agregar nueva Actividad' : 'Crear Actividad'}
          </button>
        </div>
      </VentanaModal>

      {/* Modal para Crear Cultivo */}
      <VentanaModal
        isOpen={modalCultivoOpen}
        onClose={() => setModalCultivoOpen(false)}
        title="Crear Cultivo"
      >
        <CrearCultivo
          onSuccess={() => setModalCultivoOpen(false)}
          especies={especies}
          semilleros={semilleros}
        />
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setModalEspecieOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={modalEspecieOpen}
          >
            {especies.length > 0 ? 'Agregar nueva Especie' : 'Crear Especie'}
          </button>
          <button
            onClick={() => setModalSemilleroOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={modalSemilleroOpen}
          >
            {semilleros.length > 0 ? 'Agregar nuevo Semillero' : 'Crear Semillero'}
          </button>
        </div>
      </VentanaModal>

      {/* Modal para Crear Actividad */}
      <VentanaModal
        isOpen={modalActividadOpen}
        onClose={() => setModalActividadOpen(false)}
        title="Crear Actividad"
      >
        <CrearActividad onSuccess={() => setModalActividadOpen(false)} />
      </VentanaModal>

      {/* Modal para Crear Especie */}
      <VentanaModal
        isOpen={modalEspecieOpen}
        onClose={() => setModalEspecieOpen(false)}
        title="Crear Especie"
      >
        <CrearEspecie
          onSuccess={() => setModalEspecieOpen(false)}
          tiposCultivo={tiposCultivo}
        />
        <div className="mt-4">
          <button
            onClick={() => setModalTipoCultivoOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={modalTipoCultivoOpen}
          >
            {tiposCultivo.length > 0 ? 'Agregar nuevo Tipo de Cultivo' : 'Crear Tipo de Cultivo'}
          </button>
        </div>
      </VentanaModal>

      {/* Modal para Crear Semillero */}
      <VentanaModal
        isOpen={modalSemilleroOpen}
        onClose={() => setModalSemilleroOpen(false)}
        title="Crear Semillero"
      >
        <CrearSemillero onSuccess={() => setModalSemilleroOpen(false)} />
      </VentanaModal>

      {/* Modal para Crear Tipo de Cultivo */}
      <VentanaModal
        isOpen={modalTipoCultivoOpen}
        onClose={() => setModalTipoCultivoOpen(false)}
        title="Crear Tipo de Cultivo"
      >
        <CrearTipoCultivo onSuccess={() => setModalTipoCultivoOpen(false)} />
      </VentanaModal>

      {/* Modal para Crear Usuario */}
      <VentanaModal
        isOpen={modalUsuarioOpen}
        onClose={() => setModalUsuarioOpen(false)}
        title="Crear Usuario"
      >
        <CrearUsuario onSuccess={() => setModalUsuarioOpen(false)} />
      </VentanaModal>
    </div>
  );
};

export default CrearAsignacion;