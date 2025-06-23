import { useCrearBodega, Herramientas, Insumo } from "@/hooks/inventario/bodega/useCrearBodega";
import { Asignacion } from "@/hooks/trazabilidad/asignacion/useAsignacion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Formulario from "@/components/globales/Formulario";
import VentanaModal from "@/components/globales/VentanasModales";

interface Props {
  herramientas: Herramientas[];
  insumos: Insumo[];
  asignaciones: Asignacion[];
  onSuccess?: () => void;
}

interface ItemSeleccionado {
  id: number;
  cantidad: number;
}

const isInsumo = (item: Herramientas | Insumo): item is Insumo => {
  return 'fk_unidad_medida' in item;
};

const RegistrarSalidaBodega = ({
  herramientas,
  insumos: insumosIniciales = [],
  asignaciones = [],
  onSuccess,
}: Props) => {
  const { mutate: crearMovimientoBodega } = useCrearBodega();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' | 'info' } | null>(null);
  const [insumos] = useState<Insumo[]>(insumosIniciales);
  const [herramientasSeleccionadas, setHerramientasSeleccionadas] = useState<ItemSeleccionado[]>([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<ItemSeleccionado[]>([]);
  const [mostrarModalHerramienta, setMostrarModalHerramienta] = useState(false);
  const [mostrarModalInsumo, setMostrarModalInsumo] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<number | null>(null);
  const [herramientasDisponibles, setHerramientasDisponibles] = useState<Herramientas[]>([]);
  const [insumosDisponibles, setInsumosDisponibles] = useState<Insumo[]>([]);

  // Filtrar asignaciones pendientes
  const asignacionesPendientes = asignaciones.filter((a) => a.estado === 'Pendiente');


  // Actualizar herramientas e insumos disponibles según la asignación seleccionada
  useEffect(() => {
    if (asignacionSeleccionada) {
      const asignacion = asignaciones.find((a) => a.id === asignacionSeleccionada);
      if (asignacion) {
        // Obtener IDs de herramientas e insumos asignados desde todos los elementos de recursos_asignados
        const herramientasAsignadasIds = new Set<number>();
        const insumosAsignadosIds = new Set<number>();

        // Iterar sobre todos los elementos de recursos_asignados
        (asignacion.recursos_asignados || []).forEach((recursos) => {
          // Verificar si recursos es un objeto RecursosAsignados
          if (typeof recursos !== 'string') {
            recursos.herramientas?.forEach((h) => herramientasAsignadasIds.add(h.id));
            recursos.insumos?.forEach((i) => insumosAsignadosIds.add(i.id));
          }
        });

        // Filtrar herramientas e insumos disponibles
        const herramientasFiltradas = herramientas.filter((h) =>
          herramientasAsignadasIds.has(h.id)
        );
        const insumosFiltrados = insumos.filter((i) =>
          insumosAsignadosIds.has(i.id)
        );

        setHerramientasDisponibles(herramientasFiltradas);
        setInsumosDisponibles(insumosFiltrados);

        // Resetear selecciones para que solo incluyan ítems de la nueva asignación
        setHerramientasSeleccionadas((prev) =>
          prev.filter((h) => herramientasAsignadasIds.has(h.id))
        );
        setInsumosSeleccionados((prev) =>
          prev.filter((i) => insumosAsignadosIds.has(i.id))
        );
      } else {
        setHerramientasDisponibles([]);
        setInsumosDisponibles([]);
        setHerramientasSeleccionadas([]);
        setInsumosSeleccionados([]);
      }
    } else {
      setHerramientasDisponibles([]);
      setInsumosDisponibles([]);
      setHerramientasSeleccionadas([]);
      setInsumosSeleccionados([]);
    }
  }, [asignacionSeleccionada, asignaciones, herramientas, insumos]);

  const agregarHerramienta = (herramienta: Herramientas) => {
    if (!herramientasSeleccionadas.some((h) => h.id === herramienta.id)) {
      setHerramientasSeleccionadas((prev) => [
        ...prev,
        { id: herramienta.id, cantidad: 1 },
      ]);
      setMensaje(null);
    }
  };

  const agregarInsumo = (insumo: Insumo) => {
    if (!insumosSeleccionados.some((i) => i.id === insumo.id)) {
      setInsumosSeleccionados((prev) => [
        ...prev,
        { id: insumo.id, cantidad: 1 },
      ]);
      setMensaje(null);
    }
  };

  const eliminarItem = <T extends ItemSeleccionado>(
    _items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number
  ) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = <T extends ItemSeleccionado>(
    _items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number,
    cantidad: number,
    maxDisponible?: number
  ) => {
    const cantidadFinal = Math.min(Math.max(1, cantidad), maxDisponible || Infinity);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad: cantidadFinal } : item))
    );
  };

  const formFields = [
    {
      id: "fk_id_asignacion",
      label: "Asignación relacionada",
      type: "select",
      options: [
        ...asignacionesPendientes.map((a) => ({
          value: a.id.toString(),
          label: `Asignación ${a.fecha_programada} - ${a.fk_identificacion[0]?.nombre || 'Usuario desconocido'}`,
        })),
      ],
      onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const value = e.target.value;
        setAsignacionSeleccionada(value ? parseInt(value) : null);
      },
    },
  ];

  const handleSubmit = (formData: any) => {
    if (herramientasSeleccionadas.length === 0 && insumosSeleccionados.length === 0) {
      setMensaje({
        texto: "Debes seleccionar al menos una herramienta o un insumo.",
        tipo: "error",
      });
      return;
    }

    const errores: string[] = [];

    // Validar que la fecha de salida no sea anterior a la fecha de asignación
    if (formData.fk_id_asignacion) {
      const asignacion = asignaciones.find((a) => a.id === parseInt(formData.fk_id_asignacion));
      if (asignacion) {
        const fechaSalida = new Date(formData.fecha);
        const fechaAsignacion = new Date(asignacion.fecha_programada);
        if (fechaSalida < fechaAsignacion) {
          errores.push(
            `La fecha de salida no puede ser anterior a la fecha de asignación (${asignacion.fecha_programada}).`
          );
        }
      }
    }

    // Validar cantidades de herramientas
    for (const h of herramientasSeleccionadas) {
      const herramienta = herramientasDisponibles.find((her) => her.id === h.id);
      if (herramienta && h.cantidad > herramienta.cantidad_herramienta) {
        errores.push(
          `La cantidad de ${herramienta.nombre_h} excede el stock disponible (${herramienta.cantidad_herramienta})`
        );
      }
    }

    // Validar cantidades de insumos
    for (const i of insumosSeleccionados) {
      const insumo = insumosDisponibles.find((ins) => ins.id === i.id);
      if (insumo && isInsumo(insumo)) {
        const stockDisponible = insumo.cantidad_en_base || 0;
        if (String(i.cantidad) > stockDisponible) {
          errores.push(
            `La cantidad de ${insumo.nombre} excede el stock disponible (${stockDisponible} ${insumo.fk_unidad_medida?.unidad_base || 'unidades'})`
          );
        }
      }
    }

    if (errores.length > 0) {
      setMensaje({ texto: errores.join("\n"), tipo: "error" });
      return;
    }

    const payload = {
      fk_id_asignacion: formData.fk_id_asignacion ? parseInt(formData.fk_id_asignacion) : null,
      fecha: formData.fecha || new Date().toISOString().split("T")[0],
      movimiento: "Salida" as const,
      herramientas: herramientasSeleccionadas.map((h) => ({
        id: h.id,
        cantidad: h.cantidad,
      })),
      insumos: insumosSeleccionados.map((i) => ({
        id: i.id,
        cantidad: i.cantidad,
      })),
    };

    crearMovimientoBodega(payload, {
      onSuccess: () => {
        setMensaje({ texto: "Salida registrada exitosamente.", tipo: "exito" });
        onSuccess?.();
        setTimeout(() => navigate("/bodega"), 1500);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.non_field_errors?.join("\n") ||
          error.message ||
          "Error desconocido al registrar la salida";
        setMensaje({
          texto: `Error al registrar salida: ${errorMessage}`,
          tipo: "error",
        });
      },
    });
  };

  const renderListaItems = (
    items: ItemSeleccionado[],
    allItems: Array<Herramientas | Insumo>,
    onUpdateCantidad: (id: number, cantidad: number, maxDisponible?: number) => void,
    onRemove: (id: number) => void,
    tipo: "herramienta" | "insumo"
  ) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">
        {tipo === "herramienta" ? "Herramientas" : "Insumos"} seleccionados:
      </h3>
      <div className="space-y-2">
        {items.map((item) => {
          const originalItem = allItems.find((i) => i.id === item.id);
          if (!originalItem) return null;

          const isHerramienta = !isInsumo(originalItem);
          const stockDisponible = isHerramienta
            ? originalItem.cantidad_herramienta
            : originalItem.cantidad_en_base || 0;

          const unidadMedida = isInsumo(originalItem)
            ? originalItem.fk_unidad_medida?.unidad_base || "unidades"
            : "unidades";

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-2 sm:p-3 border rounded-md bg-white"
            >
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm sm:text-base break-words">
                  {isHerramienta ? originalItem.nombre_h : originalItem.nombre}
                </span>
                <span className="text-gray-600 text-xs sm:text-sm ml-0 sm:ml-2 block sm:inline">
                  (Disponibles: {stockDisponible} {unidadMedida})
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  max={stockDisponible}
                  value={item.cantidad}
                  onChange={(e) =>
                    onUpdateCantidad(item.id, parseInt(e.target.value) || 1, Number(stockDisponible))
                  }
                  className="w-24 sm:w-20 p-1.5 sm:p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Cantidad de ${isHerramienta ? originalItem.nombre_h : originalItem.nombre}`}
                />
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-base font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded hover:bg-red-50 transition-colors"
                  aria-label={`Eliminar ${isHerramienta ? originalItem.nombre_h : originalItem.nombre}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl text-center font-bold mb-6">Registrar Salida de Bodega</h2>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-md ${
            mensaje.tipo === "error"
              ? "bg-red-100 text-red-800"
              : mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="mb-6 flex justify-center gap-4 flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          onClick={() => setMostrarModalHerramienta(true)}
          disabled={!asignacionSeleccionada}
        >
          + Agregar Herramientas
        </button>

        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          onClick={() => setMostrarModalInsumo(true)}
          disabled={!asignacionSeleccionada}
        >
          + Agregar Insumos
        </button>
      </div>

      {herramientasSeleccionadas.length > 0 &&
        renderListaItems(
          herramientasSeleccionadas,
          herramientasDisponibles,
          (id, cantidad, maxDisponible) =>
            actualizarCantidad(
              herramientasSeleccionadas,
              setHerramientasSeleccionadas,
              id,
              cantidad,
              maxDisponible
            ),
          (id) => eliminarItem(herramientasSeleccionadas, setHerramientasSeleccionadas, id),
          "herramienta"
        )}

      {insumosSeleccionados.length > 0 &&
        renderListaItems(
          insumosSeleccionados,
          insumosDisponibles,
          (id, cantidad, maxDisponible) =>
            actualizarCantidad(
              insumosSeleccionados,
              setInsumosSeleccionados,
              id,
              cantidad,
              maxDisponible
            ),
          (id) => eliminarItem(insumosSeleccionados, setInsumosSeleccionados, id),
          "insumo"
        )}

      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        title="Confirmar Salida"
      />

      {/* Modal para seleccionar herramientas */}
      <VentanaModal
        isOpen={mostrarModalHerramienta}
        onClose={() => setMostrarModalHerramienta(false)}
        titulo="Seleccionar Herramientas"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
          {herramientasDisponibles.length === 0 ? (
            <p className="text-gray-500">
              {asignacionSeleccionada
                ? "No hay herramientas asignadas disponibles."
                : "Seleccione una asignación primero."}
            </p>
          ) : (
            herramientasDisponibles.map((h) => (
              <div
                key={h.id}
                className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                  herramientasSeleccionadas.some((sel) => sel.id === h.id)
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => agregarHerramienta(h)}
              >
                <h4 className="font-semibold text-lg">{h.nombre_h}</h4>
                <p className="text-gray-600">Disponibles: {h.cantidad_herramienta}</p>
                <p className="text-sm mt-1">Estado: {h.estado}</p>
                {herramientasSeleccionadas.some((sel) => sel.id === h.id) && (
                  <div className="mt-2 text-green-600 font-medium">✓ Seleccionada</div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end border-t pt-4">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            onClick={() => setMostrarModalHerramienta(false)}
          >
            Cerrar
          </button>
        </div>
      </VentanaModal>

      {/* Modal para seleccionar insumos */}
      <VentanaModal
        titulo="Seleccionar Insumos"
        isOpen={mostrarModalInsumo}
        onClose={() => setMostrarModalInsumo(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
          {insumosDisponibles.length === 0 ? (
            <p className="text-gray-500">
              {asignacionSeleccionada
                ? "No hay insumos asignados disponibles."
                : "Seleccione una asignación primero."}
            </p>
          ) : (
            insumosDisponibles.map((i) => (
              <div
                key={i.id}
                className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                  insumosSeleccionados.some((sel) => sel.id === i.id)
                    ? "bg-green-100 border-green-300"
                    : "hover:bg-green-50"
                }`}
                onClick={() => agregarInsumo(i)}
              >
                <h4 className="font-semibold text-lg">{i.nombre}</h4>
                <p className="text-gray-600">
                  Disponibles: {i.cantidad_en_base || 0} {i.fk_unidad_medida?.unidad_base || "unidades"}
                </p>
                {"tipo" in i && <p className="text-sm mt-1">Tipo: {i.tipoEnglis}</p>}
                {insumosSeleccionados.some((sel) => sel.id === i.id) && (
                  <div className="mt-2 text-green-600 font-medium">✓ Seleccionado</div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end border-t pt-4">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            onClick={() => setMostrarModalInsumo(false)}
          >
            Cerrar
          </button>
        </div>
      </VentanaModal>
    </div>
  );
};

export default RegistrarSalidaBodega;