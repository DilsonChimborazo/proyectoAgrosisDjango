import { useState } from 'react';
import { FaLeaf, FaPlus } from 'react-icons/fa';
import { useCrearAsignacion} from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useAsignacion, Asignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import { useRealiza, Realiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useActividad } from '@/hooks/trazabilidad/actividad/useActividad';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import { useSemilleros } from '@/hooks/trazabilidad/semillero/useSemilleros';
import { useTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import { useUsuarios, Usuario } from '@/hooks/usuarios/usuario/useUsuarios';
import Formulario from '../../globales/Formulario';
import VentanaModal from '../../globales/VentanasModales';
import CrearRealiza from '../realiza/CrearRealiza';
import CrearCultivo from '../cultivos/CrearCultivos';
import CrearActividad from '../actividad/CrearActividad';
import CrearEspecie from '../especie/CrearEspecie';
import CrearSemillero from '../semillero/CrearSemillero';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';
import CrearUsuario from '../../usuarios/usuario/crearUsuario';
import Tabla from '../../globales/Tabla';

interface AsignacionTabla extends Omit<Asignacion, 'fk_id_realiza' | 'fk_identificacion'> {
  especie: string;
  actividad: string;
  cultivo: string;
  usuario: string;
}

const DetalleAsignacionModal = ({ item, realizaList, usuarios }: { item: Asignacion; realizaList: Realiza[]; usuarios: Usuario[] }) => {
  const realiza = realizaList.find((r) => r.id === item.fk_id_realiza);
  const usuario = usuarios.find((u) => u.id === item.fk_identificacion);
  const realizaNombre = realiza
    ? `${realiza.fk_id_cultivo?.fk_id_especie?.nombre_comun || 'Sin especie'} ${realiza.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'}`
    : 'Sin realiza';
  const usuarioNombre = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sin usuario';

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Detalles de la Asignación</h2>
      <div className="space-y-3">
        <p><span className="font-semibold">ID:</span> {item.id}</p>
        <p><span className="font-semibold">Estado:</span> {item.estado}</p>
        <p><span className="font-semibold">Fecha Programada:</span> {item.fecha_programada}</p>
        <p><span className="font-semibold">Observaciones:</span> {item.observaciones || 'Sin observaciones'}</p>
        <p><span className="font-semibold">Realiza:</span> {realizaNombre}</p>
        <p><span className="font-semibold">Usuario:</span> {usuarioNombre}</p>
      </div>
    </div>
  );
};

const CrearAsignacionModal = ({ onSuccess, realizaList, usuarios }: { onSuccess: () => void; realizaList: Realiza[]; usuarios: Usuario[] }) => {
  const mutation = useCrearAsignacion();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<'realiza' | 'usuario' | null>(null);

  const realizaOptions = realizaList.map((realiza) => ({
    value: realiza.id.toString(),
    label: `${realiza.fk_id_cultivo?.fk_id_especie?.nombre_comun || 'Sin especie'} ${realiza.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'}`.trim() || 'Sin nombre',
  }));

  const usuarioOptions = usuarios.map((usuario) => ({
    value: usuario.id.toString(),
    label: `${usuario.nombre} ${usuario.apellido}`,
  }));

  const estadoOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' },
    { value: 'Reprogramada', label: 'Reprogramada' },
  ];

  const formFields = [
    { id: 'estado', label: 'Estado', type: 'select', options: estadoOptions, placeholder: 'Seleccione una opción' },
    { id: 'fecha_programada', label: 'Fecha Programada', type: 'date', placeholder: 'Seleccione una fecha' },
    { id: 'observaciones', label: 'Observaciones', type: 'textarea', placeholder: 'Ingrese observaciones' },
    {
      id: 'fk_id_realiza',
      label: 'Realiza',
      type: 'select',
      options: realizaOptions.length > 0 ? realizaOptions : [{ value: '', label: 'No hay opciones disponibles' }],
      placeholder: 'Seleccione una opción',
      addon: (
        <button
          type="button"
          onClick={() => {
            setCreateType('realiza');
            setIsCreateModalOpen(true);
          }}
          className="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          title="Crear nuevo realiza"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      ),
    },
    {
      id: 'fk_identificacion',
      label: 'Usuario',
      type: 'select',
      options: usuarioOptions.length > 0 ? usuarioOptions : [{ value: '', label: 'No hay usuarios disponibles' }],
      placeholder: 'Seleccione un usuario',
      addon: (
        <button
          type="button"
          onClick={() => {
            setCreateType('usuario');
            setIsCreateModalOpen(true);
          }}
          className="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          title="Crear nuevo usuario"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    const { estado, fecha_programada, observaciones, fk_id_realiza, fk_identificacion } = formData;

    if (
      typeof estado !== 'string' ||
      typeof fecha_programada !== 'string' ||
      typeof observaciones !== 'string' ||
      typeof fk_id_realiza !== 'string' ||
      typeof fk_identificacion !== 'string'
    ) {
      setErrorMessage('❌ Todos los campos deben ser del tipo correcto');
      return;
    }

    if (!estado || !fecha_programada || !fk_id_realiza || !fk_identificacion) {
      setErrorMessage('❌ Los campos Estado, Fecha Programada, Realiza y Usuario son obligatorios');
      return;
    }

    if (fk_id_realiza === '' || fk_identificacion === '') {
      setErrorMessage('❌ Debes seleccionar un realiza y un usuario válidos');
      return;
    }

    const nuevaAsignacion: CrearAsignacionDTO = {
      estado: estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
      fecha_programada,
      observaciones: observaciones.trim(),
      fk_id_realiza: parseInt(fk_id_realiza, 10),
      fk_identificacion: parseInt(fk_identificacion, 10),
    };

    mutation.mutate(nuevaAsignacion, { onSuccess });
  };

  return (
    <div className="p-4">
      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Nueva Asignación"
      />
      <VentanaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        titulo=""
        contenido={
          createType === 'realiza' ? (
            <CrearRealiza onSuccess={() => { onSuccess(); setIsCreateModalOpen(false); }} cultivos={[]} actividades={[]} />
          ) : (
            <CrearUsuario onSuccess={() => { onSuccess(); setIsCreateModalOpen(false); }} />
          )
        }
      />
    </div>
  );
};

const ListarAsignacion = () => {
  const { data: asignaciones, isLoading: isLoadingAsignaciones, refetch: refetchAsignaciones } = useAsignacion();
  const { data: realizaList, isLoading: isLoadingRealiza, refetch: refetchRealiza } = useRealiza();
  const { data: cultivos, isLoading: isLoadingCultivos, refetch: refetchCultivos } = useCultivo();
  const { data: actividades, isLoading: isLoadingActividades, refetch: refetchActividades } = useActividad();
  const { data: especies, isLoading: isLoadingEspecies, refetch: refetchEspecies } = useEspecie();
  const { data: semilleros, isLoading: isLoadingSemilleros, refetch: refetchSemilleros } = useSemilleros();
  const { data: tiposCultivo, isLoading: isLoadingTiposCultivo, refetch: refetchTiposCultivo } = useTipoCultivo();
  const { data: usuarios, isLoading: isLoadingUsuarios, refetch: refetchUsuarios } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  const handleItemClick = (item: AsignacionTabla) => {
    const asignacion: Asignacion = {
      ...item,
      fk_id_realiza: realizaList?.find((r) => `${r.fk_id_cultivo?.fk_id_especie?.nombre_comun || 'Sin especie'} ${r.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'}` === `${item.especie} ${item.cultivo}`)?.id ?? -1,
      fk_identificacion: usuarios?.find((u) => `${u.nombre} ${u.apellido}` === item.usuario)?.id ?? -1,
    };
    setSelectedAsignacion(asignacion);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setModalContenido(null);
    setSelectedAsignacion(null);
  };

  const createHandlers = {
    asignacion: () => {
      setModalContenido(
        <CrearAsignacionModal
          onSuccess={() => {
            refetchAsignaciones();
            refetchRealiza();
            refetchUsuarios();
            closeModal();
          }}
          realizaList={realizaList || []}
          usuarios={usuarios || []}
        />
      );
      setIsModalOpen(true);
    },
    cultivo: () => {
      setModalContenido(<CrearCultivo onSuccess={() => { refetchCultivos(); closeModal(); }} especies={especies || []} semilleros={semilleros || []} />);
      setIsModalOpen(true);
    },
    actividad: () => {
      setModalContenido(<CrearActividad onSuccess={() => { refetchActividades(); closeModal(); }} />);
      setIsModalOpen(true);
    },
    especie: () => {
      setModalContenido(<CrearEspecie onSuccess={() => { refetchEspecies(); closeModal(); }} tiposCultivo={tiposCultivo || []} />);
      setIsModalOpen(true);
    },
    semillero: () => {
      setModalContenido(<CrearSemillero onSuccess={() => { refetchSemilleros(); closeModal(); }} />);
      setIsModalOpen(true);
    },
    tipoCultivo: () => {
      setModalContenido(<CrearTipoCultivo onSuccess={() => { refetchTiposCultivo(); closeModal(); }} />);
      setIsModalOpen(true);
    },
    usuario: () => {
      setModalContenido(<CrearUsuario onSuccess={() => { refetchUsuarios(); closeModal(); }} />);
      setIsModalOpen(true);
    },
  };

  if ([isLoadingAsignaciones, isLoadingRealiza, isLoadingCultivos, isLoadingActividades, isLoadingEspecies, isLoadingSemilleros, isLoadingTiposCultivo, isLoadingUsuarios].some(Boolean)) {
    return <div className="text-center text-gray-500">Cargando...</div>;
  }

  const tablaData: AsignacionTabla[] = (asignaciones ?? []).map((asignacion) => {
    const fkIdRealiza = typeof asignacion.fk_id_realiza === 'number' ? asignacion.fk_id_realiza : (asignacion.fk_id_realiza as any)?.id ?? -1;
    const fkIdIdentificacion = typeof asignacion.fk_identificacion === 'number' ? asignacion.fk_identificacion : (asignacion.fk_identificacion as any)?.id ?? -1;
    const realiza = realizaList?.find((r) => r.id === fkIdRealiza);
    const usuario = usuarios?.find((u) => u.id === fkIdIdentificacion);

    return {
      id: asignacion.id ?? 0,
      estado: asignacion.estado || 'Sin estado',
      fecha_programada: asignacion.fecha_programada || 'Sin fecha',
      observaciones: asignacion.observaciones || 'Sin observaciones',
      especie: realiza?.fk_id_cultivo?.fk_id_especie?.nombre_comun || (fkIdRealiza !== -1 ? `Especie no encontrada (ID: ${fkIdRealiza})` : 'Sin especie'),
      actividad: realiza?.fk_id_actividad?.nombre_actividad || (fkIdRealiza !== -1 ? `Actividad no encontrada (ID: ${fkIdRealiza})` : 'Sin actividad'),
      cultivo: realiza?.fk_id_cultivo?.nombre_cultivo || (fkIdRealiza !== -1 ? `Cultivo no encontrado (ID: ${fkIdRealiza})` : 'Sin cultivo'),
      usuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : (fkIdIdentificacion !== -1 ? `Usuario no encontrado (ID: ${fkIdIdentificacion})` : 'Sin usuario'),
    };
  });

  const headers = ['ID', 'Estado', 'Fecha Programada', 'Observaciones', 'Actividad', 'Cultivo', 'Especie', 'Usuario'];

  return (
    <div className="p-4 space-y-6">
      <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="" contenido={modalContenido} />
      <VentanaModal
        isOpen={isDetailModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={<DetalleAsignacionModal item={selectedAsignacion!} realizaList={realizaList || []} usuarios={usuarios || []} />}
      />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex items-center space-x-4">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="border border-gray-300 rounded-md p-2">
            <option value="">Selecciona un tipo</option>
            <option value="cultivo">Cultivo</option>
            <option value="actividad">Actividad</option>
          </select>
          {selectedType && (
            <button
              title={`Crear ${selectedType}`}
              onClick={createHandlers[selectedType as keyof typeof createHandlers]}
              className="bg-green-700 text-white px-3 font-bold py-1 rounded hover:bg-green-900"
            >
              Crear {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </button>
          )}
        </div>
        <div>
          {selectedType === 'cultivo' && cultivos?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cultivos.map((cultivo) => (
                <div key={cultivo.id} className="bg-white border border-gray-200 rounded-lg shadow flex items-center p-4 hover:bg-gray-50 transition">
                  <FaLeaf className="text-green-600 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{cultivo.nombre_cultivo || 'Sin nombre'}</h3>
                    <p className="text-gray-600 text-sm">Cultivo</p>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedType === 'actividad' && actividades?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {actividades.map((actividad) => (
                <div key={actividad.id} className="bg-white border border-gray-200 rounded-lg shadow flex items-center p-4 hover:bg-gray-50 transition">
                  <FaLeaf className="text-green-600 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{actividad.nombre_actividad || 'Sin nombre'}</h3>
                    <p className="text-gray-600 text-sm">Actividad</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">{selectedType ? 'No hay registros disponibles.' : 'Selecciona un tipo para ver los registros.'}</div>
          )}
        </div>
      </div>
      <Tabla
        title="Lista de Asignaciones"
        headers={headers}
        data={tablaData}
        onClickAction={handleItemClick}
        onUpdate={() => {}}
        onCreate={createHandlers.asignacion}
        createButtonTitle="Crear Asignación"
      />
    </div>
  );
};

export default ListarAsignacion;