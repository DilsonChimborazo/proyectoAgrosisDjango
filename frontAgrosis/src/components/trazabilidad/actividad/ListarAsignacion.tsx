import { useState, useMemo, memo } from 'react';
import { FaLeaf } from 'react-icons/fa';
import { useAsignacion, Asignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import { useRealiza, Realiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useActividad } from '@/hooks/trazabilidad/actividad/useActividad';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import { useTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import { useUsuarios, Usuario } from '@/hooks/usuarios/usuario/useUsuarios';
import { useProgramacion } from '@/hooks/trazabilidad/programacion/useProgramacion';
import { UnidadMedida } from '@/hooks/inventario/unidadMedida/useMedidad'; // Nuevo hook
import VentanaModal from '../../globales/VentanasModales';
import CrearCultivo from '../cultivos/CrearCultivos';
import CrearActividad from '../actividad/CrearActividad';
import CrearEspecie from '../especie/CrearEspecie';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';
import CrearUsuario from '../../usuarios/usuario/crearUsuario';
import Tabla from '../../globales/Tabla';
import CrearRealiza from '../realiza/CrearRealiza';
import CrearAsignacionModal from './CrearAsignacion';
import CrearProgramacionModal from '../programacion/CrearProgramacion';
import { useUnidadMedida } from '@/hooks/inventario/unidadMedida/useCrearMedida';

interface AsignacionTabla extends Omit<Asignacion, 'fk_id_realiza' | 'fk_identificacion'> {
  especie: string;
  actividad: string;
  cultivo: string;
  usuario: string;
  fecha_realizada: string | null;
  duracion: number | null;
  cantidad_insumo: number | null;
  img: string | null; // Nueva propiedad para la imagen
  unidad_medida: string; // Nueva propiedad para la unidad de medida
}

const DetalleAsignacionModal = memo(({ item, realizaList, usuarios }: { item: Asignacion; realizaList: Realiza[]; usuarios: Usuario[] }) => {
  const realiza = realizaList.find((r) => r.id === (typeof item.fk_id_realiza === 'object' ? item.fk_id_realiza?.id : item.fk_id_realiza));
  const usuario = usuarios.find((u) => u.id === (typeof item.fk_identificacion === 'object' ? item.fk_identificacion?.id : item.fk_identificacion));
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
});

const ListarAsignacion = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProgramacionModalOpen, setIsProgramacionModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const { data: asignaciones, isLoading: isLoadingAsignaciones, error: errorAsignaciones, refetch: refetchAsignaciones } = useAsignacion();
  const { data: realizaList, isLoading: isLoadingRealiza, error: errorRealiza, refetch: refetchRealiza } = useRealiza();
  const { data: usuarios, isLoading: isLoadingUsuarios, error: errorUsuarios, refetch: refetchUsuarios } = useUsuarios();
  const { data: programaciones, isLoading: isLoadingProgramaciones, error: errorProgramaciones, refetch: refetchProgramaciones } = useProgramacion();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, error: errorUnidadesMedida } = useUnidadMedida();

  const { data: cultivos, isLoading: isLoadingCultivos, error: errorCultivos, refetch: refetchCultivos } = useCultivo({
    enabled: selectedType === 'cultivo' || isModalOpen,
  });
  const { data: actividades, isLoading: isLoadingActividades, error: errorActividades, refetch: refetchActividades } = useActividad({
    enabled: selectedType === 'actividad' || isModalOpen,
  });
  const { data: especies, isLoading: isLoadingEspecies, error: errorEspecies, refetch: refetchEspecies } = useEspecie({
    enabled: isModalOpen,
  });
  const { data: tiposCultivo, isLoading: isLoadingTiposCultivo, error: errorTiposCultivo, refetch: refetchTiposCultivo } = useTipoCultivo({
    enabled: isModalOpen,
  });

  const handleItemClick = (item: AsignacionTabla) => {
    const asignacion = asignaciones?.find((a) => a.id === item.id) ?? null;
    setSelectedAsignacion(asignacion);
    setIsDetailModalOpen(true);
  };

  const handleEstadoClick = (item: AsignacionTabla) => {
    if (item.estado === 'Pendiente') {
      const asignacion = asignaciones?.find((a) => a.id === item.id) ?? null;
      setSelectedAsignacion(asignacion);
      setIsProgramacionModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsProgramacionModalOpen(false);
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
          onCancel={closeModal}
          realizaList={realizaList || []}
          usuarios={usuarios || []}
        />
      );
      setIsModalOpen(true);
    },
    cultivo: () => {
      setModalContenido(
        <CrearCultivo
          onSuccess={() => {
            refetchCultivos();
            refetchEspecies();
            closeModal();
          }}
        />
      );
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
    tipoCultivo: () => {
      setModalContenido(<CrearTipoCultivo onSuccess={() => { refetchTiposCultivo(); closeModal(); }} />);
      setIsModalOpen(true);
    },
    realiza: () => {
      setModalContenido(
        <CrearRealiza
          onSuccess={() => {
            refetchRealiza();
            closeModal();
          }}
        />
      );
      setIsModalOpen(true);
    },
    usuario: () => {
      setModalContenido(<CrearUsuario onSuccess={() => { refetchUsuarios(); closeModal(); }} />);
      setIsModalOpen(true);
    },
  };

  const tablaData: AsignacionTabla[] = useMemo(() => {
    const data = (asignaciones ?? []).map((asignacion) => {
      const realizaId = typeof asignacion.fk_id_realiza === 'object' ? asignacion.fk_id_realiza?.id : asignacion.fk_id_realiza;
      const usuarioId = typeof asignacion.fk_identificacion === 'object' ? asignacion.fk_identificacion?.id : asignacion.fk_identificacion;

      const realiza = realizaList?.find((r) => r.id === realizaId);
      const usuario = usuarios?.find((u) => u.id === usuarioId);
      const programacion = programaciones?.find((p) => p.fk_id_asignacionActividades === asignacion.id);

      // Mapear fk_unidad_medida al nombre de la unidad
      const unidadMedida = programacion?.fk_unidad_medida
        ? unidadesMedida?.find((um) => um.id === programacion.fk_unidad_medida)?.nombre || 'Desconocida'
        : (asignacion.estado === 'Pendiente' ? 'Nulo' : 'Sin registro');

      // Depuración: Mostrar el estado de cada asignación
      console.log(`Asignación ID ${asignacion.id} - Estado: ${asignacion.estado}`);

      return {
        id: asignacion.id,
        estado: asignacion.estado,
        fecha_programada: asignacion.fecha_programada,
        observaciones: asignacion.observaciones || 'Sin observaciones',
        especie: realiza?.fk_id_cultivo?.fk_id_especie?.nombre_comun || 'Sin especie',
        actividad: realiza?.fk_id_actividad?.nombre_actividad || 'Sin actividad',
        cultivo: realiza?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
        usuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sin usuario',
        fecha_realizada: programacion?.fecha_realizada || (asignacion.estado === 'Pendiente' ? 'Nulo' : 'Sin registro'),
        duracion: programacion?.duracion || (asignacion.estado === 'Pendiente' ? null : 0),
        cantidad_insumo: programacion?.cantidad_insumo || (asignacion.estado === 'Pendiente' ? null : 0),
        img: programacion?.img || (asignacion.estado === 'Pendiente' ? null : 'Sin imagen'), // Nueva propiedad
        unidad_medida: unidadMedida, // Nueva propiedad
      };
    });
    console.log('tablaData:', data);
    return data;
  }, [asignaciones, realizaList, usuarios, programaciones, unidadesMedida]);

  const isLoading = isLoadingAsignaciones || isLoadingRealiza || isLoadingUsuarios || isLoadingProgramaciones || isLoadingUnidadesMedida;
  const hasError = errorAsignaciones || errorRealiza || errorUsuarios || errorProgramaciones || errorUnidadesMedida;

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando asignaciones...</div>;
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500">
        Error al cargar datos: {hasError.message || 'Por favor, intenta de nuevo.'}
        <br />
        {errorProgramaciones && (
          <span>
            No se pudo cargar las programaciones. Verifica que el endpoint /api/programaciones/ esté disponible.
          </span>
        )}
        {errorUnidadesMedida && (
          <span>
            No se pudo cargar las unidades de medida. Verifica que el endpoint /api/unidades_medida/ esté disponible.
          </span>
        )}
      </div>
    );
  }

  const headers = [
    'ID',
    'Fecha Programada',
    'Usuario',
    'Actividad',
    'Cultivo',
    'Especie',
    'Observaciones',
    'Fecha Realizada',
    'Duración (min)',
    'Cantidad Insumo',
    'Imagen', // Nueva columna
    'Unidad de Medida', // Nueva columna
    'Estado',
  ];

  const renderRow = (item: AsignacionTabla) => (
    <tr key={item.id} className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3">{item.id}</td>
      <td className="p-3">{item.fecha_programada}</td>
      <td className="p-3">{item.usuario}</td>
      <td className="p-3">{item.actividad}</td>
      <td className="p-3">{item.cultivo}</td>
      <td className="p-3">{item.especie}</td>
      <td className="p-3">{item.observaciones}</td>
      <td className="p-3">{item.fecha_realizada}</td>
      <td className="p-3">{item.duracion ?? 'Nulo'}</td>
      <td className="p-3">{item.cantidad_insumo ?? 'Nulo'}</td>
      <td className="p-3">
        {item.img && item.img !== 'Sin imagen' ? (
          <a href={item.img} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Ver imagen
          </a>
        ) : (
          'Sin imagen'
        )}
      </td>
      <td className="p-3">{item.unidad_medida}</td>
      <td className="p-3">
        {item.estado.toLowerCase() === 'pendiente' ? (
          <button
            onClick={() => handleEstadoClick(item)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Finalizar
          </button>
        ) : (
          item.estado
        )}
      </td>
    </tr>
  );

  return (
    <div className="p-4 space-y-6">
      <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="" contenido={modalContenido} />
      <VentanaModal
        isOpen={isDetailModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={<DetalleAsignacionModal item={selectedAsignacion!} realizaList={realizaList || []} usuarios={usuarios || []} />}
      />
      <VentanaModal
        isOpen={isProgramacionModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={
          <CrearProgramacionModal
            asignacionId={selectedAsignacion?.id!}
            onSuccess={() => {
              refetchAsignaciones();
              refetchProgramaciones();
              closeModal();
            }}
            onCancel={closeModal}
          />
        }
      />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex items-center space-x-4">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="border border-gray-300 rounded-md p-2">
            <option value="">Selecciona un tipo</option>
            <option value="cultivo">Cultivo</option>
            <option value="actividad">Actividad</option>
            <option value="realiza">Realiza</option>
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
          ) : selectedType === 'realiza' && realizaList?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {realizaList.map((realiza) => (
                <div key={realiza.id} className="bg-white border border-gray-200 rounded-lg shadow flex items-center p-4 hover:bg-gray-50 transition">
                  <FaLeaf className="text-green-600 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {`${realiza.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'} - ${realiza.fk_id_actividad?.nombre_actividad || 'Sin actividad'}`}
                    </h3>
                    <p className="text-gray-600 text-sm">Realiza</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">{selectedType ? 'No hay registros disponibles.' : 'Selecciona un tipo para ver los registros.'}</div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <Tabla
          title="Lista de Asignaciones"
          headers={headers}
          data={tablaData}
          onClickAction={handleItemClick}
          onUpdate={() => {}}
          onCreate={createHandlers.asignacion}
          createButtonTitle="Crear Asignación"
          renderRow={renderRow}
        />
        {tablaData.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No hay asignaciones para mostrar.</div>
        )}
      </div>
    </div>
  );
};

export default ListarAsignacion;