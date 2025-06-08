import { useState, useEffect, useMemo } from "react";
import {
  Pencil,
  Hammer,
  TestTube2,
  List,
  Plus,
  MoveRight,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Search,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";

// Componentes
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import CrearHerramientas from "../herramientas/CrearHerramientas";
import ActualizarHerramienta from "../herramientas/ActualizarHerramientas";
import CrearInsumos from "../insumos/CrearInsumos";
import RegistrarSalidaBodega from "./CrearBodega";
import ActualizarInsumos from "../insumos/ActualizarInsumos";

// Hooks
import { useHerramientas } from "@/hooks/inventario/herramientas/useHerramientas";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";
import { useAsignacion } from "@/hooks/trazabilidad/asignacion/useAsignacion";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Interfaces
interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: "g" | "ml" | "u";
  factor_conversion: number;
}

interface Herramienta {
  id: number;
  nombre_h: string;
  cantidad_herramienta: number;
  estado: "Disponible" | "Prestado" | "En reparacion";
}

interface Insumo {
  id: number;
  nombre: string;
  tipo: string;
  precio_unidad: number;
  precio_por_base: number;
  cantidad_en_base: string | null;
  cantidad_insumo: number | null;
  fecha_vencimiento: string;
  img: string | null | undefined;
  fk_unidad_medida: UnidadMedida;
}

interface Asignacion {
  id: number;
  estado: string;
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number | null;
  fk_identificacion: number | null;
}

interface MovimientoBodega {
  id: number;
  fk_id_herramientas: Herramienta | null;
  fk_id_insumo: Insumo | null;
  fk_id_asignacion: Asignacion | null;
  cantidad_herramienta: number;
  cantidad_insumo: number;
  fecha: string;
  movimiento: "Entrada" | "Salida";
  fk_unidad_medida: UnidadMedida | null;
  cantidad_en_base: number | null;
  costo_insumo: number | null;
}

// Type Guards
const isHerramienta = (item: Herramienta | Insumo): item is Herramienta => "nombre_h" in item;

const isInsumo = (item: Herramienta | Insumo): item is Insumo => "nombre" in item;

// SafeImage Component
const SafeImage = ({
  src,
  alt,
  className,
  placeholderText = "Sin imagen",
}: {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholderText?: string;
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    return path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${apiUrl}/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    if (src) {
      const url = getImageUrl(src);
      if (url) {
        const img = new Image();
        img.src = url;
        img.onload = () => setImageSrc(url);
        img.onerror = () => setHasError(true);
      } else {
        setHasError(true);
      }
    } else {
      setHasError(true);
    }
  }, [src]);

  if (hasError || !imageSrc) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-xs text-gray-500">{placeholderText}</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

// DetalleItemModal Component
const DetalleItemModal = ({
  item,
  tipo,
}: {
  item: Herramienta | Insumo;
  tipo: "Herramienta" | "Insumo";
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Detalles del {tipo}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          {isInsumo(item) && item.img && (
            <SafeImage
              src={item.img}
              alt={`Imagen de ${item.nombre}`}
              className="w-full h-48 object-contain rounded-lg"
            />
          )}
        </div>
        <div className="col-span-1 space-y-3">
          <p>
            <span className="font-semibold">Nombre:</span>{" "}
            {isHerramienta(item) ? item.nombre_h : item.nombre}
          </p>
          <p>
            <span className="font-semibold">Cantidad:</span>{" "}
            {isHerramienta(item) ? item.cantidad_herramienta : item.cantidad_insumo}
          </p>
          {isInsumo(item) && item.fecha_vencimiento && (
            <p>
              <span className="font-semibold">Fecha de vencimiento:</span>{" "}
              {new Date(item.fecha_vencimiento).toLocaleDateString()}
            </p>
          )}
          {isInsumo(item) && item.fk_unidad_medida && (
            <p>
              <span className="font-semibold">Unidad de medida:</span>{" "}
              {item.fk_unidad_medida.nombre_medida}
            </p>
          )}
          {isHerramienta(item) && item.estado && (
            <p>
              <span className="font-semibold">Estado:</span> {item.estado}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// useMovimientosBodega Hook
const useMovimientosBodega = () => {
  return useQuery<MovimientoBodega[], Error>({
    queryKey: ["movimientosBodega"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}bodega/`);
      return data;
    },
    gcTime: 1000 * 60 * 5,
  });
};

// Main Component
const ListarBodega = () => {
  const { data: movimientos, refetch: refetchMovimientos } = useMovimientosBodega();
  const { data: herramientas, refetch: refetchHerramientas } = useHerramientas();
  const { data: insumos, refetch: refetchInsumos } = useInsumo();
  const { data: asignaciones, refetch: refetchAsignacion } = useAsignacion();

  const [selectedItem, setSelectedItem] = useState<Herramienta | Insumo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<"Herramienta" | "Insumo">("Insumo");
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [viewMode, setViewMode] = useState<"items" | "movimientos">("items");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [terminoDebounced] = useDebounce(terminoBusqueda, 300);

  const closeModal = () => {
    setSelectedItem(null);
    setModalContenido(null);
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
  };

  const handleCreateItem = () => {
    setModalContenido(
      tipoSeleccionado === "Herramienta" ? (
        <CrearHerramientas
          onSuccess={() => {
            refetchHerramientas();
            closeModal();
          }}
        />
      ) : (
        <CrearInsumos
          onSuccess={() => {
            refetchInsumos();
            closeModal();
          }}
        />
      )
    );
    setIsModalOpen(true);
  };

  const handleItemClick = (item: Herramienta | Insumo) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleRowClick = (movimiento: MovimientoBodega) => {
    setModalContenido(
      tipoSeleccionado === "Herramienta" && movimiento.fk_id_herramientas ? (
        <ActualizarHerramienta
          id={movimiento.fk_id_herramientas.id}
          onSuccess={() => {
            refetchHerramientas();
            refetchMovimientos();
            closeModal();
          }}
        />
      ) : tipoSeleccionado === "Insumo" && movimiento.fk_id_insumo ? (
        <ActualizarInsumos
          id={String(movimiento.fk_id_insumo.id)}
          onSuccess={() => {
            refetchInsumos();
            refetchMovimientos();
            closeModal();
          }}
        />
      ) : null
    );
    setIsModalOpen(true);
  };

  const filtrarItems = useMemo(() => {
    let items: (Herramienta | Insumo)[] = tipoSeleccionado === "Herramienta" ? herramientas || [] : insumos || [];
    if (!terminoDebounced) return items;
    return items.filter((item) => {
      const nombre = isHerramienta(item) ? item.nombre_h : item.nombre;
      const tipo = isInsumo(item) ? item.tipo : "";
      return (
        nombre?.toLowerCase().includes(terminoDebounced.toLowerCase()) ||
        tipo?.toLowerCase().includes(terminoDebounced.toLowerCase())
      );
    });
  }, [herramientas, insumos, terminoDebounced, tipoSeleccionado]);

  const filteredMovimientos = useMemo(() => {
    if (!movimientos) return [];
    return movimientos.filter((item) =>
      tipoSeleccionado === "Herramienta"
        ? item.fk_id_herramientas !== null
        : item.fk_id_insumo !== null
    );
  }, [movimientos, tipoSeleccionado]);

 // Datos que se van a mostrar en las tablas

  const mappedMovimientos = useMemo(() => {
  const formatDateWithoutTimezone = (dateInput: string | Date): string => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return "Fecha inválida";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "Fecha inválida";
    }
  };

  return filteredMovimientos.map((item) => {
    const nombreHerramienta = item.fk_id_herramientas?.nombre_h || "N/A";
    const nombreInsumo = item.fk_id_insumo?.nombre || "N/A";
    const nombre = tipoSeleccionado === "Herramienta" ? nombreHerramienta : nombreInsumo;
    const movimiento = item.movimiento;
    const colorMovimiento =
      movimiento === "Entrada" ? "text-green-700 font-bold" : "text-red-700 font-bold";
    
    // Cantidad principal
    const cantidadPrincipal = tipoSeleccionado === "Herramienta" 
      ? (item.cantidad_herramienta ?? 0)
      : (item.cantidad_insumo ?? 0);

    // Cantidad en base (solo para insumos)
    const cantidadBaseDisplay = tipoSeleccionado === "Insumo" && item.fk_id_insumo
      ? item.fk_id_insumo.cantidad_en_base
      : "No Aplica";

    console.log("esta es la cantidad base",cantidadBaseDisplay)

    const bgCantidad =
      movimiento === "Entrada" ? "bg-green-500 text-white font-bold rounded px-2" : "bg-red-500 text-white font-bold rounded px-2";

    const unidadMedida =
      tipoSeleccionado === "Insumo" && item.fk_id_insumo
        ? item.fk_id_insumo.fk_unidad_medida?.nombre_medida || "No Aplica"
        : "No Aplica";

    return {
      id: item.id,
      [tipoSeleccionado === "Herramienta" ? "herramienta" : "insumo"]: nombre,
      asignacion: item.fk_id_asignacion?.fecha_programada
        ? (item.fk_id_asignacion.fecha_programada)
        : "No aplica",
      cantidad: <span className={bgCantidad}>{cantidadPrincipal}</span>,
      cantidad_base: cantidadBaseDisplay,
      unidad_medida: unidadMedida,
      costo:
        tipoSeleccionado === "Herramienta"
          ? "No Aplica"
          : item.costo_insumo
            ? `$${parseFloat(item.costo_insumo.toString()).toFixed(2)}`
            : "—",
      fecha: formatDateWithoutTimezone(item.fecha),
      movimiento: <span className={colorMovimiento}>{movimiento}</span>,
      rawData: item,
    };
  });
  }, [filteredMovimientos, tipoSeleccionado]);
  return (
    <div className="p-4 mt-5 rounded-3xl space-y-6">
      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={modalContenido}
      />
      <VentanaModal
        isOpen={isDetailModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={selectedItem && <DetalleItemModal item={selectedItem} tipo={tipoSeleccionado} />}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode("items")}
            className={`flex items-center bg-green-600 text-white px-4 py-2 rounded-lg ${viewMode === "items" ? "text-black" : "bg-gray-200"}`}
            aria-label={`Ver ${tipoSeleccionado === "Herramienta" ? "herramientas" : "insumos"}`}
          >
            <List className="mr-2" size={18} />
            Items
          </button>
          <button
            onClick={() => setViewMode("movimientos")}
            className={`flex items-center px-4 py-2 rounded-lg ${viewMode === "movimientos" ? "bg-gray-400 text-white" : "bg-gray-200"}`}
            aria-label="Ver movimientos"
          >
            <MoveRight className="mr-2" size={18} />
            Movimientos
          </button>
          {viewMode === "items" && (
            <select
              value={tipoSeleccionado}
              onChange={(e) => {
                setTipoSeleccionado(e.target.value as "Herramienta" | "Insumo");
                setTerminoBusqueda("");
              }}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Seleccionar tipo de item"
            >
              <option value="Herramienta">Herramientas</option>
              <option value="Insumo">Insumos</option>
            </select>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Buscar ${tipoSeleccionado === "Herramienta" ? "herramientas..." : "insumos..."}`}
              className="pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80 lg:w-96 text-lg"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              aria-label="Buscar elementos"
            />
          </div>
        </div>
      </div>

      {viewMode === "items" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div
              onClick={handleCreateItem}
              style={{ backgroundColor: '#C8E6C9' }}
              className="shadow-lg rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors border border-gray-200 h-full min-h-[200px]"
            >
              <div className="flex flex-col items-center">
                {tipoSeleccionado === "Herramienta" ? (
                  <div className=" rounded-full p-3 mb-4">
                    <Hammer size={48} className="text-blue-600" />
                  </div>
                ) : (
                  <div className="rounded-full p-3 mb-4">
                    <TestTube2 size={48} className="text-blue-600" />
                  </div>
                )}
                <p className="text-center text-lg text-gray-900 font-semibold mb-4">
                  Agregar {tipoSeleccionado}
                </p>
                <button className="px-4  text-gray-900 ">
                  <Plus size={60} />
                </button>
              </div>
            </div>
{
  filtrarItems.length > 0 ? (
    filtrarItems.map((item) => {
      const esHerramienta = isHerramienta(item);
      const cantidad = esHerramienta
        ? Number(item.cantidad_herramienta) || 0
        : Number(item.cantidad_en_base) || 0; // Changed to use cantidad_en_base for insumos
      const fechaVencimiento = isInsumo(item) ? item.fecha_vencimiento : null;

      let cantidadClass = "font-bold rounded-full px-3 py-1 text-center flex items-center gap-1";
      let Icono = null;

      if (esHerramienta) {
        if (cantidad <= 5) {
          cantidadClass += " text-black";
          Icono = <AlertCircle className="text-white rounded-full bg-red-700 mx-2 w-6 h-6" />;
        } else if (cantidad <= 10) {
          cantidadClass += " text-black";
          Icono = <AlertTriangle className="text-yellow-600 font-bold mx-2 w-6 h-6" />;
        } else {
          cantidadClass += " text-black";
          Icono = <CheckCircle className="text-white rounded-full bg-green-700 mx-2 w-6 h-6" />;
        }
      } else {
        if (cantidad <= 1000) {
          cantidadClass += " text-black";
          Icono = <AlertCircle className="text-white rounded-full bg-red-700 mx-2 w-6 h-6" />;
        } else if (cantidad <= 2000) {
          cantidadClass += " text-black";
          Icono = <AlertTriangle className="text-yellow-600 font-bold mx-2 w-6 h-6" />;
        } else {
          cantidadClass += " text-black";
          Icono = <CheckCircle className="text-white rounded-full bg-green-700 mx-2 w-6 h-6" />;
        }
      }

      return (
        <div
          key={item.id}
          className="shadow-lg rounded-2xl p-4 flex flex-col justify-between cursor-pointer bg-white hover:bg-blue-50 transition-colors hover:shadow-xl border border-gray-200"
          onClick={() => handleItemClick(item)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleItemClick(item)}
        >
          <div className="flex flex-col h-full">
            <div className="w-full h-32 flex items-center justify-center mb-3 bg-gray-100 rounded-lg">
              {isInsumo(item) && item.img ? (
                <SafeImage
                  src={item.img}
                  alt={`Imagen de ${item.nombre}`}
                  className="w-full h-full object-contain rounded-t-lg"
                />
              ) : (
                <Hammer size={48} className="text-blue-600" />
              )}
            </div>

            <div className="flex items-center">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {esHerramienta ? item.nombre_h : item.nombre}
              </h3>
              <div className="">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const movimientoRelacionado = movimientos?.find(
                      (m) =>
                        esHerramienta
                          ? m.fk_id_herramientas?.id === item.id
                          : m.fk_id_insumo?.id === item.id
                    );
                    if (movimientoRelacionado) {
                      handleRowClick(movimientoRelacionado);
                    } else if (isInsumo(item)) {
                      setModalContenido(
                        <ActualizarInsumos
                          id={String(item.id)}
                          onSuccess={() => {
                            refetchInsumos();
                            closeModal();
                          }}
                        />
                      );
                      setIsModalOpen(true);
                    }
                  }}
                  className=" rounded-full px-2 font-bold hover:bg-gray-200"
                  title="Editar"
                  aria-label="Editar elemento"
                >
                  <Pencil
                    size={16}
                    className="text-green-600  p-1.5 w-8 h-8"
                  />
                </button>
              </div>
            </div>


            <div className="mt-2 mb-3">
              <p className="text-sm text-gray-600">Cantidad en stock:</p>
              <div className={cantidadClass}>
                {esHerramienta
                  ? `${cantidad} unidades`
                  : `${cantidad} ${item.fk_unidad_medida?.unidad_base || ""}`}
                {Icono}
              </div>
            </div>

            {fechaVencimiento && (
              <div className="mt-auto">
                <p className="text-sm text-gray-600">Vence:</p>
                <p className="text-sm font-medium">{fechaVencimiento}</p>
              </div>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div className="col-span-full text-center py-8 text-gray-500">
      No se encontraron {tipoSeleccionado === "Herramienta" ? "herramientas" : "insumos"} que coincidan con "{terminoDebounced}"
    </div>
  )
}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <Tabla
            title={`Movimientos de ${tipoSeleccionado === "Herramienta" ? "Herramientas" : "Insumos"}`}
            headers={[
              "ID",
              tipoSeleccionado === "Herramienta" ? "Herramienta" : "Insumo",
              "Asignacion",
              "Cantidad",
              "Unidad Medida",
              "cantidad base",
              "Costo",
              "Fecha",
              "Movimiento",
            ]}
            data={mappedMovimientos}
            onCreate={() => {
              setModalContenido(
                <RegistrarSalidaBodega 
                  herramientas={herramientas || []}
                  insumos={insumos || []}
                  asignaciones={asignaciones || []}
                  onSuccess={() => {
                    refetchHerramientas();
                    refetchInsumos();
                    refetchMovimientos();
                    refetchAsignacion();
                    closeModal();
                  }}
                />
              );
              setIsModalOpen(true);
            }}
            createButtonTitle="Registrar Movimiento"
          />
        </div>
      )}
    </div>
  );
};

export default ListarBodega;