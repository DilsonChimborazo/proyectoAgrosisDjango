import React, { useState, useMemo } from 'react';
import { usePagosDetallados, useMarcarPago } from '@/hooks/finanzas/nomina/useNomina';
import Tabla from '@/components/globales/Tabla';
import DescargarTablaPDF from '@/components/globales/DescargarTablaPDF';
import { CheckCircle2, XCircle, Filter, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CrearSalario from "@/components/finanzas/salario/CrearSalario";
import VentanaModal from '@/components/globales/VentanasModales';

type Filtros = {
  persona: string;
  actividad: string;
  estado: 'todos' | 'pagado' | 'pendiente';
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
  usuario?: {
    id?: number;
    nombre?: string | null;
    apellido?: string | null;
  } | null;
  salario?: {
    jornal?: number | null;
    horas_por_jornal?: number | null;
  } | null;
};

const TablaPagosDetallados: React.FC = () => {
  const { data, isLoading, error, refetch } = usePagosDetallados();
  const { mutate: marcarPago, isPending } = useMarcarPago();
  const [filtros, setFiltros] = useState<Filtros>({
    persona: '',
    actividad: '',
    estado: 'todos'
  });
  const [pagoAMarcar, setPagoAMarcar] = useState<number | null>(null);
  const [isSalarioModalOpen, setIsSalarioModalOpen] = useState(false);

  const cerrarModalConExito = () => {
    setIsSalarioModalOpen(false);
    refetch();
  };

  const handleConfirmarPago = () => {
    if (!pagoAMarcar) return;

    toast.promise(
      new Promise((resolve, reject) => {
        marcarPago(pagoAMarcar, {
          onSuccess: () => {
            refetch();
            resolve(null);
          },
          onError: reject
        });
      }),
      {
        loading: 'Actualizando estado de pago...',
        success: 'Pago marcado como completado',
        error: 'Error al marcar el pago'
      }
    );
    setPagoAMarcar(null);
  };

  const datosFiltrados = useMemo(() => {
    if (!data) return [];
    return data.filter((pago: PagoDetallado) => {
      const cumplePersona = filtros.persona === '' ||
        `${pago.usuario?.nombre} ${pago.usuario?.apellido}`
          .toLowerCase()
          .includes(filtros.persona.toLowerCase());

      const cumpleActividad = filtros.actividad === '' ||
        (pago.actividad || '').toLowerCase().includes(filtros.actividad.toLowerCase());

      const cumpleEstado = filtros.estado === 'todos' ||
        (filtros.estado === 'pagado' && pago.pagado) ||
        (filtros.estado === 'pendiente' && !pago.pagado);

      return cumplePersona && cumpleActividad && cumpleEstado;
    });
  }, [data, filtros]);

  const personasUnicas = useMemo(() => {
    const personas = new Set<string>();
    data?.forEach((pago: PagoDetallado) => {
      if (pago.usuario) {
        const nombreCompleto = `${pago.usuario.nombre} ${pago.usuario.apellido}`.trim();
        if (nombreCompleto) personas.add(nombreCompleto);
      }
    });
    return Array.from(personas).sort();
  }, [data]);

  const actividadesUnicas = useMemo(() => {
    const actividades = new Set<string>();
    data?.forEach((pago: PagoDetallado) => {
      if (pago.actividad) {
        actividades.add(pago.actividad);
      }
    });
    return Array.from(actividades).sort();
  }, [data]);

  const headers = ['ID', 'Fecha', 'Usuario', 'Actividad', 'Tipo', 'Pago Total', 'Estado'];
  const rows: FilaPago[] = datosFiltrados.map((pago: PagoDetallado) => ({
    id: pago.id,
    fecha: pago.fecha_pago || 'No especificada',
    usuario: `${pago.usuario?.nombre || 'N/A'} ${pago.usuario?.apellido || ''}`.trim(),
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
    `${pago.usuario?.nombre || 'N/A'} ${pago.usuario?.apellido || ''}`.trim(),
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
                if (row.id) setPagoAMarcar(row.id);
              }}
              disabled={isPending}
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
      {/* Modal de confirmación */}
      <VentanaModal
        isOpen={!!pagoAMarcar}
        onClose={() => setPagoAMarcar(null)}
        titulo="Confirmar pago"
        contenido={
          <div className="space-y-4">
            <p>¿Estás seguro de marcar este pago como completado?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setPagoAMarcar(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPago}
                disabled={isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center gap-2"
              >
                {isPending && <Loader2 className="animate-spin" size={16} />}
                Confirmar
              </button>
            </div>
          </div>
        }
      />

      {/* Encabezado Responsivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsSalarioModalOpen(true)}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-3 md:px-4 rounded mr-0 md:mr-4 text-sm md:text-base"
          >
            Registrar Salario
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

      {/* Filtros Responsivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
        <div className="w-full">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Filtrar por persona</label>
          <select
            value={filtros.persona}
            onChange={(e) => setFiltros({ ...filtros, persona: e.target.value })}
            className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todas las personas</option>
            {personasUnicas.map((persona, index) => (
              <option key={index} value={persona}>{persona}</option>
            ))}
          </select>
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
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Filtrar por estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as 'todos' | 'pagado' | 'pendiente' })}
            className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="pagado">Solo pagados</option>
            <option value="pendiente">Solo pendientes</option>
          </select>
        </div>
      </div>

      {/* Resumen Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 text-sm md:text-base">Total pagos</h3>
          <p className="text-xl md:text-2xl font-bold text-green-600">
            {datosFiltrados.length}
          </p>
        </div>
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 text-sm md:text-base">Total valor pagado</h3>
          <p className="text-xl md:text-2xl font-bold text-blue-600">
            ${datosFiltrados.reduce((sum, pago) => sum + (pago.pago_total || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 text-sm md:text-base">Personas únicas</h3>
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            {new Set(datosFiltrados.map(pago => pago.usuario?.id)).size}
          </p>
        </div>
      </div>

      {/* Tabla Responsiva */}
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