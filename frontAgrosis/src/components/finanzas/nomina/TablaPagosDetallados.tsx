import React, { useState, useMemo } from 'react';
import { usePagosDetallados, useMarcarPago, useMarcarPagosPorUsuario } from '@/hooks/finanzas/nomina/useNomina';
import Tabla from '@/components/globales/Tabla';
import DescargarTablaPDF from '@/components/globales/DescargarTablaPDF';
import { CheckCircle2, XCircle, Filter, Check, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import CrearSalario from "@/components/finanzas/salario/CrearSalario";
import VentanaModal from '@/components/globales/VentanasModales';
import { useNavigate } from 'react-router-dom';

type Filtros = {
  persona: string;
  actividad: string;
  estado: 'todos' | 'pagado' | 'pendiente';
  fecha_inicio: string;
  fecha_fin: string;
};

type FilaPago = {
  id: number | undefined;
  fecha: string;
  usuario: string;
  actividad: string;
  tipo: string;
  pago_total: string;
  estado: JSX.Element;
  esPagado: boolean;
};

type PagoDetallado = {
  id?: number;
  fecha_pago?: string | null;
  pagado?: boolean;
  pago_total?: number | null;
  actividad?: string | null;
  tipo_actividad?: string | null;
  usuarios?: Array<{
    id?: number;
    nombre?: string | null;
    apellido?: string | null;
  }> | null;
  salario?: {
    jornal?: number | null;
    horas_por_jornal?: number | null;
  } | null;
};

const TablaPagosDetallados: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<Filtros>({
    persona: '',
    actividad: '',
    estado: 'todos',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const { data, isLoading, error, refetch } = usePagosDetallados(filtros);
  const { mutate: marcarPago, isPending: isPendingSingle } = useMarcarPago();
  const { mutate: marcarPagosPorUsuario, isPending: isPendingBulk } = useMarcarPagosPorUsuario();
  const [pagoIndividual, setPagoIndividual] = useState<number | null>(null);
  const [pagoMasivo, setPagoMasivo] = useState<{ usuario_id: number; nombre: string } | null>(null);
  const [isSalarioModalOpen, setIsSalarioModalOpen] = useState(false);

  const cerrarModalConExito = () => {
    setIsSalarioModalOpen(false);
    refetch();
  };

  const handleConfirmarPagoIndividual = () => {
    if (!pagoIndividual) return;

    toast.promise(
      new Promise((resolve, reject) => {
        marcarPago(pagoIndividual, {
          onSuccess: () => {
            refetch();
            resolve(null);
          },
          onError: (error) => reject(error)
        });
      }),
      {
        loading: 'Actualizando estado de pago...',
        success: 'Pago marcado como completado',
        error: (error) => error.message || 'Error al marcar el pago'
      }
    );
    setPagoIndividual(null);
  };

  const handleConfirmarPagoMasivo = () => {
    if (!pagoMasivo) return;

    toast.promise(
      new Promise((resolve, reject) => {
        marcarPagosPorUsuario(
          {
            usuario_id: pagoMasivo.usuario_id,
            fecha_inicio: filtros.fecha_inicio || undefined,
            fecha_fin: filtros.fecha_fin || undefined
          },
          {
            onSuccess: (data) => {
              refetch();
              resolve(null);
            },
            onError: (error) => reject(error)
          }
        );
      }),
      {
        loading: 'Marcando pagos como completados...',
        success: (data: any) => `${data.updated_count} pagos marcados como completados`,
        error: (error) => error.message || 'Error al marcar los pagos'
      }
    );
    setPagoMasivo(null);
  };

  const datosFiltrados = useMemo(() => {
    if (!data) return [];
    return data.filter((pago: PagoDetallado) => {
      const cumplePersona = filtros.persona === '' ||
        (pago.usuarios || []).some(usuario =>
          `${usuario.nombre || ''} ${usuario.apellido || ''}`
            .toLowerCase()
            .includes(filtros.persona.toLowerCase())
        );

      const cumpleActividad = filtros.actividad === '' ||
        (pago.actividad || '').toLowerCase().includes(filtros.actividad.toLowerCase());

      const cumpleEstado = filtros.estado === 'todos' ||
        (filtros.estado === 'pagado' && pago.pagado) ||
        (filtros.estado === 'pendiente' && !pago.pagado);

      const cumpleFechaInicio = !filtros.fecha_inicio ||
        (pago.fecha_pago || '9999-12-31') >= filtros.fecha_inicio;

      const cumpleFechaFin = !filtros.fecha_fin ||
        (pago.fecha_pago || '9999-12-31') <= filtros.fecha_fin;

      return cumplePersona && cumpleActividad && cumpleEstado && cumpleFechaInicio && cumpleFechaFin;
    });
  }, [data, filtros]);

  const personasUnicas = useMemo(() => {
    const personas = new Map<number, string>();
    data?.forEach((pago: PagoDetallado) => {
      (pago.usuarios || []).forEach(usuario => {
        if (usuario.id) {
          const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
          if (nombreCompleto) personas.set(usuario.id, nombreCompleto);
        }
      });
    });
    return Array.from(personas.entries()).map(([id, nombre]) => ({ id, nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [data]);

  const actividadesUnicas = useMemo(() => {
    const actividades = new Set<string>();
    data?.forEach((pago: PagoDetallado) => {
      if (pago.actividad) actividades.add(pago.actividad);
    });
    return Array.from(actividades).sort();
  }, [data]);

  const headers = ['ID', 'Fecha', 'Usuario', 'Actividad', 'Tipo', 'Pago Total', 'Estado'];

  const rows: FilaPago[] = datosFiltrados.map((pago: PagoDetallado) => ({
    id: pago.id,
    fecha: pago.fecha_pago || 'No especificada',
    usuario: (pago.usuarios || [])
      .map(usuario => `${usuario.nombre || 'N/A'} ${usuario.apellido || ''}`.trim())
      .join(', ') || 'Desconocido',
    actividad: pago.actividad || 'Desconocida',
    tipo: pago.tipo_actividad || 'No especificado',
    pago_total: pago.pago_total ? `$${pago.pago_total.toLocaleString()}` : '$0',
    estado: pago.pagado ? (
      <span className="flex items-center text-green-600">
        <CheckCircle2 size={18} className="mr-1" /> Pagado
      </span>
    ) : (
      <span className="flex items-center text-red-600">
        <XCircle size={18} className="mr-1" /> Pendiente
      </span>
    ),
    esPagado: !!pago.pagado
  }));

  const pdfColumns = ['ID', 'Fecha', 'Usuario', 'Actividad', 'Tipo', 'Pago Total', 'Estado'];
  const pdfData = datosFiltrados.map((pago: PagoDetallado) => [
    pago.id?.toString() || 'N/A',
    pago.fecha_pago || 'No especificada',
    (pago.usuarios || [])
      .map(usuario => `${usuario.nombre || 'N/A'} ${usuario.apellido || ''}`.trim())
      .join(', ') || 'Desconocido',
    pago.actividad || 'Desconocida',
    pago.tipo_actividad || 'No especificado',
    pago.pago_total ? `$${pago.pago_total.toFixed(2)}` : '$0.00',
    pago.pagado ? 'Pagado' : 'Pendiente'
  ]);

  const renderCell = (row: FilaPago, columnKey: string): React.ReactNode => {
    if (columnKey === 'estado') {
      return (
        <div className="flex items-center gap-2">
          {row.estado}
          {!row.esPagado && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (row.id) setPagoIndividual(row.id);
              }}
              disabled={isPendingSingle || isPendingBulk}
              className="p-1 text-green-600 hover:bg-green-100 rounded-md transition"
              title="Marcar como pagado"
            >
              <Check size={16} />
            </button>
          )}
        </div>
      );
    }
    return row[columnKey as keyof Omit<FilaPago, 'esPagado'>];
  };

  if (isLoading) return <div className="text-center py-8">Cargando datos de pagos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      {/* Modal de confirmación para pago individual */}
      <VentanaModal
        isOpen={!!pagoIndividual}
        onClose={() => setPagoIndividual(null)}
        titulo="Confirmar pago individual"
        contenido={
          <div className="space-y-4">
            <p>¿Estás seguro de marcar este pago como completado?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setPagoIndividual(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPagoIndividual}
                disabled={isPendingSingle}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center gap-2"
              >
                {isPendingSingle && <Loader2 className="animate-spin" size={16} />}
                Confirmar
              </button>
            </div>
          </div>
        }
      />

      {/* Modal de confirmación para pago masivo */}
      <VentanaModal
        isOpen={!!pagoMasivo}
        onClose={() => setPagoMasivo(null)}
        titulo="Confirmar pago masivo"
        contenido={
          <div className="space-y-4">
            <p>¿Estás seguro de marcar todos los pagos pendientes de {pagoMasivo?.nombre} como completados?</p>
            {(filtros.fecha_inicio || filtros.fecha_fin) && (
              <p className="text-sm text-gray-600">
                Filtros de fecha aplicados: {filtros.fecha_inicio || 'Sin inicio'} a {filtros.fecha_fin || 'Sin fin'}
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setPagoMasivo(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPagoMasivo}
                disabled={isPendingBulk}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center gap-2"
              >
                {isPendingBulk && <Loader2 className="animate-spin" size={16} />}
                Confirmar
              </button>
            </div>
          </div>
        }
      />

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsSalarioModalOpen(true)}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-3 md:px-4 rounded text-sm md:text-base"
          >
            Registrar Salario
          </button>
          <button
            onClick={() => navigate('/salario')}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-3 md:px-4 rounded text-sm md:text-base"
          >
            Ver Salarios
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <Filter className="mr-2 w-4 h-4 md:w-6 md:h-6" /> Detalle de Pagos
          </h2>
        </div>
        
        <DescargarTablaPDF
          nombreArchivo="reporte_pagos.pdf"
          columnas={pdfColumns}
          datos={pdfData}
          titulo="Reporte de Pagos"
          className="bg-green-600 text-white hover:bg-green-700 text-sm md:text-base py-2 px-3 md:px-4"
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
        <div className="w-full">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Filtrar por persona</label>
          <div className="flex items-center gap-2">
            <select
              value={filtros.persona}
              onChange={(e) => setFiltros({ ...filtros, persona: e.target.value })}
              className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todas las personas</option>
              {personasUnicas.map(({ id, nombre }) => (
                <option key={id} value={nombre}>{nombre}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const selected = personasUnicas.find(p => p.nombre === filtros.persona);
                if (selected) {
                  setPagoMasivo({ usuario_id: selected.id, nombre: selected.nombre });
                } else {
                  toast.error('Seleccione una persona');
                }
              }}
              disabled={isPendingBulk || !filtros.persona}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
              title="Pagar todos los pendientes"
            >
              <DollarSign size={16} />
            </button>
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Filtrar por actividad</label>
          <select
            value={filtros.actividad}
            onChange={(e) => setFiltros({ ...filtros, actividad: e.target.value })}
            className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todas las actividades</option>
            {actividadesUnicas.map((actividad, index) => (
              <option key={index} value={actividad}>{actividad}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as 'todos' | 'pagado' | 'pendiente' })}
            className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="todos">Todos</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
            className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="w-full">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
            className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 text-sm md:text-base">Total pagos</h3>
          <p className="text-xl md:text-2xl font-bold text-green-600">
            {datosFiltrados.length}
          </p>
        </div>
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 text-sm md:text-base">Total de nóminas</h3>
          <p className="text-xl md:text-2xl font-bold text-blue-600">
            ${datosFiltrados.reduce((sum, pago) => sum + (pago.pago_total || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 text-sm md:text-base">Personas únicas</h3>
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            {new Set(datosFiltrados.flatMap(pago => (pago.usuarios || []).map(u => u.id)).filter(id => id)).size}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] md:min-w-0">
          <div className="[&_table]:w-full [&_th]:py-3 md:[&_th]:py-4 
                        [&_th]:bg-green-700 [&_th]:text-white [&_th]:font-bold
                        [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg
                        [&_td]:px-3 md:[&_td]:px-4 [&_td]:py-2 md:[&_td]:py-3">
            <Tabla
              title=""
              headers={headers}
              data={rows}
              hiddenColumnsByDefault={['id']}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              renderCell={renderCell}
              rowClassName={(row: { esPagado: any }) =>
                row.esPagado
                  ? 'bg-green-50 hover:bg-green-100'
                  : 'bg-red-50 hover:bg-red-100'
              }
            />
          </div>
        </div>
      </div>

      {isSalarioModalOpen && (
        <VentanaModal
          isOpen={isSalarioModalOpen}
          onClose={cerrarModalConExito}
          titulo="Registrar Salario"
          contenido={
            <CrearSalario
              onClose={cerrarModalConExito}
              onSuccess={cerrarModalConExito}
            />
          }
        />
      )}
    </div>
  );
};

export default TablaPagosDetallados;