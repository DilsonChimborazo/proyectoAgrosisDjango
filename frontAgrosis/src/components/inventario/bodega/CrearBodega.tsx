import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Formulario from "@/components/globales/Formulario";
import VentanaModal from "@/components/globales/VentanasModales";
import { Herramientas, Insumo, Asignacion } from "@/hooks/inventario/bodega/useCrearBodega";
import CrearInsumoCompuesto from "@/components/inventario/insumocompuesto/CrearInsumoCompuesto";

interface Props {
  id: string;
  herramientas: Herramientas[];
  insumos: Insumo[];
  insumosCompuestos?: Insumo[];
  asignaciones: Asignacion[];
  onSuccess?: () => void;
  onClick: (nuevo: Insumo) => void;
}

interface ItemSeleccionado {
  id: number;
  cantidad: number;
}

const RegistrarSalidaBodega = ({
  herramientas,
  insumos: insumosIniciales = [],
  insumosCompuestos: insumosCompuestosIniciales = [],
  asignaciones = [],
  onClick
}: Props) => {
  const { mutate: crearMovimientoBodega } = useCrearBodega();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");
  const [tipoInsumo, setTipoInsumo] = useState<"simple" | "compuesto">("simple");
  const [insumos] = useState<Insumo[]>(insumosIniciales);
  const [insumosCompuestos, setInsumosCompuestos] = useState<Insumo[]>(insumosCompuestosIniciales);
  const [herramientasSeleccionadas, setHerramientasSeleccionadas] = useState<ItemSeleccionado[]>([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<ItemSeleccionado[]>([]);
  const [mostrarModalHerramienta, setMostrarModalHerramienta] = useState(false);
  const [mostrarModalInsumo, setMostrarModalInsumo] = useState(false);
  const [mostrarCrearCompuesto, setMostrarCrearCompuesto] = useState(false);
  const [tabActual, setTabActual] = useState<"simples" | "compuestos">("simples");

  const agregarNuevoInsumo = (nuevo: Insumo) => {
    setInsumosCompuestos([...insumosCompuestos, nuevo]);
    setInsumosSeleccionados([...insumosSeleccionados, { id: nuevo.id, cantidad: 1 }]);
    onClick(nuevo);
  };

  const agregarHerramienta = (herramienta: Herramientas) => {
    if (!herramientasSeleccionadas.some(h => h.id === herramienta.id)) {
      setHerramientasSeleccionadas([
        ...herramientasSeleccionadas,
        { id: herramienta.id, cantidad: 1 }
      ]);
    }
  };

  const agregarInsumo = (insumo: Insumo) => {
    if (!insumosSeleccionados.some(i => i.id === insumo.id)) {
      setInsumosSeleccionados([
        ...insumosSeleccionados,
        { id: insumo.id, cantidad: 1 }
      ]);
    }
  };

  const eliminarHerramienta = (id: number) => {
    setHerramientasSeleccionadas(
      herramientasSeleccionadas.filter(h => h.id !== id)
    );
  };

  const eliminarInsumo = (id: number) => {
    setInsumosSeleccionados(
      insumosSeleccionados.filter(i => i.id !== id)
    );
  };

  const actualizarCantidadHerramienta = (id: number, cantidad: number) => {
    setHerramientasSeleccionadas(
      herramientasSeleccionadas.map(h => 
        h.id === id ? { ...h, cantidad } : h
      )
    );
  };

  const actualizarCantidadInsumo = (id: number, cantidad: number) => {
    setInsumosSeleccionados(
      insumosSeleccionados.map(i => 
        i.id === id ? { ...i, cantidad } : i
      )
    );
  };

  const formFields = [
    {
      id: "fk_id_asignacion",
      label: "Asignación relacionada",
      type: "select",
      options: asignaciones.map((a) => ({
        value: a.id.toString(),
        label: `Asignación ${a.fecha_programada}`,
      })),
    },
    {
      id: "fecha",
      label: "Fecha de salida",
      type: "date",
    },
  ];

  const handleSubmit = (formData: any) => {
    if (herramientasSeleccionadas.length === 0 && insumosSeleccionados.length === 0) {
      setMensaje("Debes seleccionar al menos una herramienta o un insumo.");
      return;
    }
  
    // Transformar los datos al formato esperado por la API
    const salida = {
      herramientas: herramientasSeleccionadas.map(h => ({
        id: h.id,
        cantidad: h.cantidad
      })),
      insumos: insumosSeleccionados.map(i => ({
        id: i.id,
        cantidad: i.cantidad
      })),
      fk_id_asignacion: formData.fk_id_asignacion ? parseInt(formData.fk_id_asignacion) : null,
      fecha: formData.fecha,
      movimiento: "Salida" as const,
    };
  
    crearMovimientoBodega(salida, {
      onSuccess: () => {
        setMensaje("Salida registrada exitosamente.");
        setTimeout(() => navigate("/bodega"), 1500);
      },
      onError: (err) => {
        setMensaje(`Error al registrar salida: ${err.message}`);
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl text-center font-bold mb-6">Registrar Salida de Bodega</h2>

      {mensaje && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          {mensaje}
        </div>
      )}

      <div className="mb-6 flex justify-center gap-4 flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={() => setMostrarModalHerramienta(true)}
        >
          + Agregar Herramientas
        </button>

        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          onClick={() => {
            setMostrarModalInsumo(true);
            setTabActual(tipoInsumo === "compuesto" ? "compuestos" : "simples");
          }}
        >
          + Agregar Insumos
        </button>
      </div>

      {/* Lista de herramientas seleccionadas */}
      {herramientasSeleccionadas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Herramientas seleccionadas:</h3>
          <div className="space-y-2">
            {herramientasSeleccionadas.map((h) => {
              const herramienta = herramientas.find(her => her.id === h.id);
              return (
                <div key={h.id} className="flex items-center gap-4 p-2 border rounded">
                  <div className="flex-1">
                    <span className="font-medium">{herramienta?.nombre_h}</span>
                    <span className="text-gray-600 ml-2">(Disponibles: {herramienta?.cantidad_herramienta})</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={herramienta?.cantidad_herramienta}
                    value={h.cantidad}
                    onChange={(e) => actualizarCantidadHerramienta(h.id, parseInt(e.target.value) || 1)}
                    className="w-20 p-1 border rounded"
                  />
                  <button
                    onClick={() => eliminarHerramienta(h.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de insumos seleccionados */}
      {insumosSeleccionados.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Insumos seleccionados:</h3>
          <div className="space-y-2">
            {insumosSeleccionados.map((i) => {
              const insumo = [...insumos, ...insumosCompuestos].find(ins => ins.id === i.id);
              return (
                <div key={i.id} className="flex items-center gap-4 p-2 border rounded">
                  <div className="flex-1">
                    <span className="font-medium">{insumo?.nombre}</span>
                    <span className="text-gray-600 ml-2">(Disponibles: {insumo?.cantidad_insumo})</span>
                  </div>
                  {tipoInsumo === "simple" && (
                    <input
                      type="number"
                      min="1"
                      max={insumo?.cantidad_insumo}
                      value={i.cantidad}
                      onChange={(e) => actualizarCantidadInsumo(i.id, parseInt(e.target.value) || 1)}
                      className="w-20 p-1 border rounded"
                    />
                  )}
                  <button
                    onClick={() => eliminarInsumo(i.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Formulario 
        fields={formFields} 
        onSubmit={handleSubmit} 
        title="Registrar Salida"
      />

      <VentanaModal
        isOpen={mostrarModalHerramienta}
        onClose={() => setMostrarModalHerramienta(false)}
        titulo="Seleccionar Herramientas"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {herramientas.map((h) => (
            <div
              key={h.id}
              className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                herramientasSeleccionadas.some(sel => sel.id === h.id) 
                  ? "bg-blue-100" 
                  : "hover:bg-blue-50"
              }`}
              onClick={() => agregarHerramienta(h)}
            >
              <h4 className="font-semibold text-lg">{h.nombre_h}</h4>
              <p className="text-gray-600">Disponibles: {h.cantidad_herramienta}</p>
              {herramientasSeleccionadas.some(sel => sel.id === h.id) && (
                <div className="mt-2 text-green-600">Seleccionada</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => setMostrarModalHerramienta(false)}
          >
            Cerrar
          </button>
        </div>
      </VentanaModal>

      <VentanaModal
        titulo="Seleccionar Insumos"
        isOpen={mostrarModalInsumo}
        onClose={() => setMostrarModalInsumo(false)}
      >
        <div className="mb-4 flex border-b">
          <button
            className={`px-4 py-2 font-medium ${tabActual === "simples" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => {
              setTabActual("simples");
              setTipoInsumo("simple");
            }}
          >
            Insumos Simples
          </button>
          <button
            className={`px-4 py-2 font-medium ${tabActual === "compuestos" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => {
              setTabActual("compuestos");
              setTipoInsumo("compuesto");
            }}
          >
            Insumos Compuestos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(tabActual === "simples" ? insumos : insumosCompuestos).map((i) => (
            <div
              key={i.id}
              className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                insumosSeleccionados.some(sel => sel.id === i.id) 
                  ? "bg-green-100" 
                  : "hover:bg-green-50"
              }`}
              onClick={() => agregarInsumo(i)}
            >
              <h4 className="font-semibold text-lg">{i.nombre}</h4>
              <p className="text-gray-600">Disponibles: {i.cantidad_insumo}</p>
              {insumosSeleccionados.some(sel => sel.id === i.id) && (
                <div className="mt-2 text-green-600">Seleccionado</div>
              )}
            </div>
          ))}
        </div>

        {tabActual === "compuestos" && (
          <div className="mt-4 text-center">
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              onClick={() => {
                setMostrarModalInsumo(false);
                setMostrarCrearCompuesto(true);
              }}
            >
              + Crear Nuevo Insumo Compuesto
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => setMostrarModalInsumo(false)}
          >
            Cerrar
          </button>
        </div>
      </VentanaModal>

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