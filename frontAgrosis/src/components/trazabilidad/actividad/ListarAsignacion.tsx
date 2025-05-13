import { useState, useMemo, memo } from 'react';
import { useAsignacion, Asignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import { useRealiza, Realiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { useUsuarios, Usuario } from '@/hooks/usuarios/usuario/useUsuarios';
import { useProgramacion } from '@/hooks/trazabilidad/programacion/useProgramacion';
import { useUnidadMedida } from '@/hooks/inventario/unidadMedida/useCrearMedida';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearAsignacionModal from './CrearAsignacion';
import CrearProgramacion from '../programacion/CrearProgramacion';

// Interfaz para los datos de la tabla
interface AsignacionTabla {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  plantacion: string; // Reemplaza especie
  actividad: string;
  usuario: string;
  fecha_realizada: string | null;
  duracion: number | null;
  cantidad_insumo: number | null;
  img: string | null;
  unidad_medida: string;
}

// Componente para mostrar detalles de la asignación
const DetalleAsignacionModal = memo(({ item, realizaList, usuarios }: { item: Asignacion; realizaList: Realiza[]; usuarios: Usuario[] }) => {
  const realiza = realizaList.find((r) => r.id === (typeof item.fk_id_realiza === 'object' ? item.fk_id_realiza?.id : item.fk_id_realiza));
  const usuario = usuarios.find((u) => u.id === (typeof item.fk_identificacion === 'object' ? item.fk_identificacion?.id : item.fk_identificacion));

  const realizaNombre = realiza
    ? `${realiza.fk_id_actividad?.nombre_actividad || 'Sin actividad'} (${realiza.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'})`
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

// Componente principal para listar asignaciones
const ListarAsignacion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProgramacionModalOpen, setIsProgramacionModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  // Hooks para obtener datos
  const { data: asignaciones = [], isLoading: isLoadingAsignaciones, error: errorAsignaciones, refetch: refetchAsignaciones } = useAsignacion();
  const { data: realizaList = [], isLoading: isLoadingRealiza, error: errorRealiza } = useRealiza();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: errorUsuarios } = useUsuarios();
  const { data: programaciones = [], isLoading: isLoadingProgramaciones, error: errorProgramaciones, refetch: refetchProgramaciones } = useProgramacion();
  const { data: unidadesMedida = [], isLoading: isLoadingUnidadesMedida, error: errorUnidadesMedida } = useUnidadMedida();

  // Manejar clic en una fila para ver detalles
  const handleItemClick = (item: AsignacionTabla) => {
    const asignacion = asignaciones.find((a) => a.id === item.id) ?? null;
    setSelectedAsignacion(asignacion);
    setIsDetailModalOpen(true);
  };

  // Manejar actualización de programación
  const handleUpdateClick = (item: AsignacionTabla) => {
    const asignacion = asignaciones.find((a) => a.id === item.id);
    if (!asignacion) return;
    setSelectedAsignacion(asignacion);
    setIsProgramacionModalOpen(true);
  };

  // Cerrar modales
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsProgramacionModalOpen(false);
    setModalContenido(null);
    setSelectedAsignacion(null);
  };

  // Crear nueva asignación
  const handleCreateAsignacion = () => {
    setModalContenido(
      <CrearAsignacionModal
        onSuccess={() => {
          refetchAsignaciones();
          closeModal();
        }}
        onCancel={closeModal}
        realizaList={realizaList}
        usuarios={usuarios}
        onCreateRealiza={() => refetchAsignaciones()}
        onCreateUsuario={() => refetchAsignaciones()}
      />
    );
    setIsModalOpen(true);
  };

  // Mapear datos para la tabla
  const tablaData: AsignacionTabla[] = useMemo(() => {
    return asignaciones.map((asignacion) => {
      const realizaId = typeof asignacion.fk_id_realiza === 'object' ? asignacion.fk_id_realiza?.id : asignacion.fk_id_realiza;
      const usuarioId = typeof asignacion.fk_identificacion === 'object' ? asignacion.fk_identificacion?.id : asignacion.fk_identificacion;

      const realiza = realizaList.find((r) => r.id === realizaId);
      const usuario = usuarios.find((u) => u.id === usuarioId);
      const programacion = programaciones.find((p) => {
        const programacionId = typeof p.fk_id_asignacionActividades === 'object'
          ? p.fk_id_asignacionActividades?.id
          : p.fk_id_asignacionActividades;
        return programacionId === asignacion.id;
      });

      let unidadMedida = 'No asignada';
      if (programacion?.fk_unidad_medida) {
        const unidad = unidadesMedida.find((um) => um.id === Number(programacion.fk_unidad_medida));
        unidadMedida = unidad ? `${unidad.nombre_medida} (${unidad.abreviatura})` : 'Unidad no encontrada';
      }

      return {
        id: asignacion.id,
        estado: asignacion.estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
        fecha_programada: asignacion.fecha_programada,
        observaciones: asignacion.observaciones || 'Sin observaciones',
        plantacion: realiza?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo', // Reemplaza especie
        actividad: realiza?.fk_id_actividad?.nombre_actividad || 'Sin actividad',
        usuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sin usuario',
        fecha_realizada: programacion?.fecha_realizada || null,
        duracion: programacion?.duracion ?? null,
        cantidad_insumo: programacion?.cantidad_insumo ?? null,
        img: programacion?.img || null,
        unidad_medida: unidadMedida,
      };
    });
  }, [asignaciones, realizaList, usuarios, programaciones, unidadesMedida]);

  // Estado de carga y errores
  const loading = isLoadingAsignaciones || isLoadingRealiza || isLoadingUsuarios || isLoadingProgramaciones || isLoadingUnidadesMedida;
  const error = errorAsignaciones || errorRealiza || errorUsuarios || errorProgramaciones || errorUnidadesMedida;

  if (loading) return <div className="text-center text-gray-500">Cargando asignaciones...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar datos: {error.message || 'Intenta de nuevo.'}</div>;

  // Encabezados de la tabla
  const headers = [
    'ID',
    'Fecha Programada',
    'Usuario',
    'Actividad',
    'Plantacion', // Reemplaza Especie
    'Observaciones',
    'Fecha Realizada',
    'Duracion',
    'Cantidad Insumo',
    'Imagen',
    'Unidad Medida',
    'Estado',
  ];

  // Renderizar filas de la tabla
  const renderRow = (item: AsignacionTabla) => (
    <tr key={item.id} className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3">{item.id}</td>
      <td className="p-3">{item.fecha_programada}</td>
      <td className="p-3">{item.usuario}</td>
      <td className="p-3">{item.actividad}</td>
      <td className="p-3">{item.plantacion}</td> {/* Reemplaza especie */}
      <td className="p-3">{item.observaciones}</td>
      <td className="p-3">{item.fecha_realizada || '-'}</td>
      <td className="p-3">{item.duracion ?? '-'}</td>
      <td className="p-3">{item.cantidad_insumo ?? '-'}</td>
      <td className="p-3">
        {item.img ? (
          <a href={item.img} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Ver imagen
          </a>
        ) : (
          '-'
        )}
      </td>
      <td className="p-3">{item.unidad_medida}</td>
      <td className="p-3">{item.estado}</td>
    </tr>
  );

  return (
    <div className="p-4 space-y-6">
      <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="" contenido={modalContenido} />
      {selectedAsignacion && (
        <>
          <VentanaModal
            isOpen={isDetailModalOpen}
            onClose={closeModal}
            titulo="Detalles de Asignación"
            contenido={<DetalleAsignacionModal item={selectedAsignacion} realizaList={realizaList} usuarios={usuarios} />}
          />
          <VentanaModal
            isOpen={isProgramacionModalOpen}
            onClose={closeModal}
            titulo="Actualizar Programación"
            contenido={
              <CrearProgramacion
                asignacionId={selectedAsignacion.id}
                existingProgramacion={programaciones.find((p) => {
                  const programacionId = typeof p.fk_id_asignacionActividades === 'object'
                    ? p.fk_id_asignacionActividades?.id
                    : p.fk_id_asignacionActividades;
                  return programacionId === selectedAsignacion.id;
                })}
                onSuccess={() => {
                  refetchProgramaciones();
                  refetchAsignaciones();
                  closeModal();
                }}
                onCancel={closeModal}
              />
            }
          />
        </>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <Tabla
          title="Lista de Asignaciones"
          headers={headers}
          data={tablaData}
          onClickAction={handleItemClick}
          onUpdate={handleUpdateClick}
          onCreate={handleCreateAsignacion}
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