import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Formulario from "@/components/globales/Formulario";
import VentanaModal from "@/components/globales/VentanasModales";
import { Herramientas, Insumo, Asignacion } from "@/hooks/inventario/bodega/useCrearBodega";
import CrearInsumoCompuesto from "@/components/inventario/insumocompuesto/CrearInsumoCompuesto";

interface Props {
  herramientas: Herramientas[];
  insumos: Insumo[];
  insumosCompuestos?: Insumo[];
  asignaciones: Asignacion[];
  onSuccess?: () => void;
  onClick?: (nuevo: Insumo) => void;
}

interface ItemSeleccionado {
  id: number;
  cantidad: number;
  esInsumoSimple?: boolean; 
}

const RegistrarSalidaBodega = ({
  herramientas,
  insumos: insumosIniciales = [],
  insumosCompuestos: insumosCompuestosIniciales = [],
  asignaciones = [],
  onSuccess,
  onClick
}: Props) => {
  const { mutate: crearMovimientoBodega } = useCrearBodega();
  const navigate = useNavigate();

  console.log("Insumos Compuestos:", insumosCompuestosIniciales);

  const [mensaje, setMensaje] = useState<{texto: string, tipo: 'exito' | 'error' | 'info'} | null>(null);
  const [tipoInsumo, setTipoInsumo] = useState<"simple" | "compuesto">("simple");
  const [insumos] = useState<Insumo[]>(insumosIniciales);
  const [insumosCompuestos] = useState<Insumo[]>(insumosCompuestosIniciales);
  const [herramientasSeleccionadas, setHerramientasSeleccionadas] = useState<ItemSeleccionado[]>([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<ItemSeleccionado[]>([]);
  const [mostrarModalHerramienta, setMostrarModalHerramienta] = useState(false);
  const [mostrarModalInsumo, setMostrarModalInsumo] = useState(false);
  const [mostrarCrearCompuesto, setMostrarCrearCompuesto] = useState(false);
  const [tabActual, setTabActual] = useState<"simples" | "compuestos">("simples");

  const agregarNuevoInsumo = (nuevo: Insumo) => {
    setInsumosSeleccionados(prev => [...prev, { id: nuevo.id, cantidad: 1, esInsumoSimple: false }]);
    onClick?.(nuevo);
    setMostrarCrearCompuesto(false);
    setMensaje({texto: "Insumo compuesto agregado correctamente", tipo: 'exito'});
  };

  const agregarHerramienta = (herramienta: Herramientas) => {
    if (!herramientasSeleccionadas.some(h => h.id === herramienta.id)) {
      setHerramientasSeleccionadas(prev => [
        ...prev,
        { id: herramienta.id, cantidad: 1 }
      ]);
      setMensaje(null);
    }
  };

  const agregarInsumo = (insumo: Insumo, esSimple: boolean) => {
    if (!insumosSeleccionados.some(i => i.id === insumo.id)) {
      setInsumosSeleccionados(prev => [
        ...prev,
        { id: insumo.id, cantidad: 1, esInsumoSimple: esSimple }
      ]);
      setMensaje(null);
    }
  };

  const eliminarItem = <T extends ItemSeleccionado>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number
  ) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const actualizarCantidad = <T extends ItemSeleccionado>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number, 
    cantidad: number,
    maxDisponible?: number
  ) => {
    const cantidadFinal = Math.min(
      Math.max(1, cantidad),
      maxDisponible || Infinity
    );
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, cantidad: cantidadFinal } : item
    ));
  };

  const formFields = [
    {
      id: "fk_id_asignacion",
      label: "Asignación relacionada",
      type: "select",
      options: [
        { value: "", label: "Ninguna" },
        ...asignaciones.map((a) => ({
          value: a.id.toString(),
          label: `Asignación ${new Date(a.fecha_programada).toLocaleDateString()}`,
        })),
      ],
    },
    {
      id: "fecha",
      label: "Fecha de salida",
      type: "date",
      required: true,
      defaultValue: new Date().toISOString().split('T')[0]
    },
  ];

  const handleSubmit = (formData: any) => {
    if (herramientasSeleccionadas.length === 0 && insumosSeleccionados.length === 0) {
      setMensaje({texto: "Debes seleccionar al menos una herramienta o un insumo.", tipo: 'error'});
      return;
    }

    const errores = [];
    
    for (const h of herramientasSeleccionadas) {
      const herramienta = herramientas.find(her => her.id === h.id);
      if (herramienta && h.cantidad > herramienta.cantidad_herramienta) {
        errores.push(`La cantidad de ${herramienta.nombre_h} excede el stock disponible`);
      }
    }

    for (const i of insumosSeleccionados) {
      const insumo = [...insumos, ...insumosCompuestos].find(ins => ins.id === i.id);
      if (insumo) {
        const stockDisponible = i.esInsumoSimple && insumo.cantidad_en_base
          ? parseFloat(insumo.cantidad_en_base)
          : insumo.cantidad_insumo || 0;
        if (i.cantidad > stockDisponible) {
          errores.push(`La cantidad de ${insumo.nombre} excede el stock disponible`);
        }
      }
    }

    if (errores.length > 0) {
      setMensaje({texto: errores.join('\n'), tipo: 'error'});
      return;
    }

    const payload = {
      fk_id_asignacion: formData.fk_id_asignacion ? parseInt(formData.fk_id_asignacion) : null,
      fecha: formData.fecha || new Date().toISOString().split('T')[0],
      movimiento: "Salida" as const,
      herramientas: herramientasSeleccionadas.map(h => ({
        id: h.id,
        cantidad: h.cantidad
      })),
      insumos: insumosSeleccionados.map(i => ({
        id: i.id,
        cantidad: i.cantidad
      })),
    };

    crearMovimientoBodega(payload, {
      onSuccess: () => {
        setMensaje({texto: "Salida registrada exitosamente.", tipo: 'exito'});
        onSuccess?.();
        setTimeout(() => navigate("/bodega"), 1500);
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.non_field_errors?.join('\n') || 
                            error.message;
        setMensaje({texto: `Error al registrar salida: ${errorMessage}`, tipo: 'error'});
      },
    });
  };

  const renderListaItems = (
    items: ItemSeleccionado[],
    allItems: Array<Herramientas | Insumo>,
    onUpdateCantidad: (id: number, cantidad: number, maxDisponible?: number) => void,
    onRemove: (id: number) => void,
    tipo: 'herramienta' | 'insumo'
  ) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">
        {tipo === 'herramienta' ? 'Herramientas' : 'Insumos'} seleccionados:
      </h3>
      <div className="space-y-2">
        {items.map((item) => {
          const originalItem = allItems.find(i => i.id === item.id);
          if (!originalItem) return null;

          const esInsumoSimple = item.esInsumoSimple ?? false;
          const stockDisponible = tipo === 'herramienta' 
            ? ('cantidad_herramienta' in originalItem ? originalItem.cantidad_herramienta : 0)
            : esInsumoSimple && originalItem.cantidad_en_base
              ? parseFloat(originalItem.cantidad_en_base)
              : originalItem.cantidad_insumo || 0;

          const unidadMedida = tipo === 'insumo' && 'fk_unidad_medida' in originalItem 
            ? originalItem.fk_unidad_medida?.unidad_base || 'unidades'
            : 'unidades';

          return (
            <div key={item.id} className="flex items-center gap-4 p-2 border rounded">
              <div className="flex-1">
                <span className="font-medium">{
                  'nombre_h' in originalItem ? originalItem.nombre_h : originalItem.nombre
                }</span>
                <span className="text-gray-600 ml-2">
                  (Disponibles: {tipo === 'herramienta' 
                    ? stockDisponible 
                    : esInsumoSimple && originalItem.cantidad_en_base
                      ? `${Math.round(parseFloat(originalItem.cantidad_en_base))} ${unidadMedida}`
                      : `${stockDisponible} ${unidadMedida}`})
                </span>
              </div>
              <input
                type="number"
                min="1"
                max={stockDisponible}
                value={item.cantidad}
                onChange={(e) => onUpdateCantidad(
                  item.id, 
                  parseInt(e.target.value) || 1,
                  stockDisponible
                )}
                className="w-20 p-1 border rounded"
              />
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Eliminar"
              >
                Eliminar
              </button>
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
        <div className={`mb-4 p-3 rounded-md ${
          mensaje.tipo === 'error' ? 'bg-red-100 text-red-800' :
          mensaje.tipo === 'exito' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <div className="mb-6 flex justify-center gap-4 flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          onClick={() => setMostrarModalHerramienta(true)}
        >
          + Agregar Herramientas
        </button>

        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          onClick={() => {
            setMostrarModalInsumo(true);
            setTabActual(tipoInsumo === "compuesto" ? "compuestos" : "simples");
          }}
        >
          + Agregar Insumos
        </button>
      </div>

      {herramientasSeleccionadas.length > 0 && renderListaItems(
        herramientasSeleccionadas,
        herramientas,
        (id, cantidad, max) => actualizarCantidad(
          herramientasSeleccionadas,
          setHerramientasSeleccionadas,
          id, 
          cantidad,
          max
        ),
        (id) => eliminarItem(herramientasSeleccionadas, setHerramientasSeleccionadas, id),
        'herramienta'
      )}

      {insumosSeleccionados.length > 0 && renderListaItems(
        insumosSeleccionados,
        [...insumos, ...insumosCompuestos],
        (id, cantidad, max) => actualizarCantidad(
          insumosSeleccionados,
          setInsumosSeleccionados,
          id, 
          cantidad,
          max
        ),
        (id) => eliminarItem(insumosSeleccionados, setInsumosSeleccionados, id),
        'insumo'
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
          {herramientas.length === 0 ? (
            <p className="text-gray-500">No hay herramientas disponibles.</p>
          ) : (
            herramientas.map((h) => (
              <div
                key={h.id}
                className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                  herramientasSeleccionadas.some(sel => sel.id === h.id) 
                    ? "bg-blue-100 border-blue-300" 
                    : "hover:bg-blue-50"
                }`}
                onClick={() => agregarHerramienta(h)}
              >
                <h4 className="font-semibold text-lg">{h.nombre_h}</h4>
                <p className="text-gray-600">Disponibles: {h.cantidad_herramienta}</p>
                <p className="text-sm mt-1">Estado: {h.estado}</p>
                {herramientasSeleccionadas.some(sel => sel.id === h.id) && (
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
        <div className="mb-4 flex border-b">
          <button
            className={`px-4 py-2 font-medium ${tabActual === "simples" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
            onClick={() => {
              setTabActual("simples");
              setTipoInsumo("simple");
            }}
          >
            Insumos Simples
          </button>
          <button
            className={`px-4 py-2 font-medium ${tabActual === "compuestos" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
            onClick={() => {
              setTabActual("compuestos");
              setTipoInsumo("compuesto");
            }}
          >
            Insumos Compuestos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
          {tabActual === "compuestos" && insumosCompuestos.length === 0 ? (
            <p className="text-gray-500">No hay insumos compuestos disponibles.</p>
          ) : tabActual === "simples" && insumos.length === 0 ? (
            <p className="text-gray-500">No hay insumos simples disponibles.</p>
          ) : (
            (tabActual === "simples" ? insumos : insumosCompuestos).map((i) => (
              <div
                key={i.id}
                className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                  insumosSeleccionados.some(sel => sel.id === i.id) 
                    ? "bg-green-100 border-green-300" 
                    : "hover:bg-green-50"
                }`}
                onClick={() => agregarInsumo(i, tabActual === "simples")}
              >
                <h4 className="font-semibold text-lg">{i.nombre}</h4>
                <p className="text-gray-600">
                  Disponibles: {tabActual === "simples" && i.cantidad_en_base 
                    ? `${Math.round(parseFloat(i.cantidad_en_base))} ${i.fk_unidad_medida?.unidad_base || 'unidades'}`
                    : `${i.cantidad_insumo || 0} ${i.fk_unidad_medida?.unidad_base || 'unidades'}`}
                </p>
                {'tipo' in i && <p className="text-sm mt-1">Tipo: {i.tipo}</p>}
                {insumosSeleccionados.some(sel => sel.id === i.id) && (
                  <div className="mt-2 text-green-600 font-medium">✓ Seleccionado</div>
                )}
              </div>
            ))
          )}
        </div>

        {tabActual === "compuestos" && (
          <div className="mt-4 text-center">
            <button
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md transition-colors"
              onClick={() => {
                setMostrarModalInsumo(false);
                setMostrarCrearCompuesto(true);
              }}
            >
              + Crear Nuevo Insumo Compuesto
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-end border-t pt-4">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            onClick={() => setMostrarModalInsumo(false)}
          >
            Cerrar
          </button>
        </div>
      </VentanaModal>

      {/* Modal para crear insumo compuesto */}
      <VentanaModal
        titulo="Crear Insumo Compuesto"
        isOpen={mostrarCrearCompuesto}
        onClose={() => setMostrarCrearCompuesto(false)}
      >
        <CrearInsumoCompuesto 
          onSuccess={agregarNuevoInsumo} 
          onClose={() => setMostrarCrearCompuesto(false)} 
        />
      </VentanaModal>
    </div>
  );
};

export default RegistrarSalidaBodega;