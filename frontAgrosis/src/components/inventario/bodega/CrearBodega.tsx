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

const RegistrarSalidaBodega = ({
  herramientas,
  insumos: insumosIniciales = [],
  insumosCompuestos: insumosCompuestosIniciales = [],
  asignaciones = [],
  onClick
}: Props) => {
  const { mutate: crearMovimientoBodega } = useCrearBodega();
  const navigate = useNavigate();

  const [, setMensaje] = useState("");
  const [tipoInsumo, setTipoInsumo] = useState<"simple" | "compuesto">("simple");
  const [insumos] = useState<Insumo[]>(insumosIniciales);
  const [insumosCompuestos, setInsumosCompuestos] = useState<Insumo[]>(insumosCompuestosIniciales);
  const [herramientaSeleccionada, setHerramientaSeleccionada] = useState<Herramientas | null>(null);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);
  const [mostrarModalHerramienta, setMostrarModalHerramienta] = useState(false);
  const [mostrarModalInsumo, setMostrarModalInsumo] = useState(false);
  const [mostrarCrearCompuesto, setMostrarCrearCompuesto] = useState(false);
  const [tabActual, setTabActual] = useState<"simples" | "compuestos">("simples");
  const agregarNuevoInsumo = (nuevo: Insumo) => {
    setInsumosCompuestos([...insumosCompuestos, nuevo]);
    setInsumoSeleccionado(nuevo);
    onClick(nuevo);
  };
  

  const formFields = [
    {
      id: "fk_id_herramientas",
      label: "Herramienta (opcional)",
      type: "select",
      options: herramientas.map((h) => ({
        value: h.id.toString(),
        label: h.nombre_h,
      })),
      hasExtraButton: true,
      onExtraButtonClick: () => setMostrarModalHerramienta(true),
      onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (e.target instanceof HTMLSelectElement) {
          const selected = herramientas.find((h) => h.id.toString() === e.target.value);
          setHerramientaSeleccionada(selected || null);
        }
      }
    },
    {
      id: "cantidad_herramienta",
      label: "Cantidad de Herramienta",
      type: "number",
    },
    {
      id: "fk_id_insumo",
      label: tipoInsumo === "simple" ? "Insumo Simple" : "Insumo Compuesto",
      type: "select",
      options: (tipoInsumo === "simple" ? insumos : insumosCompuestos).map((i) => ({
        value: i.id.toString(),
        label: i.nombre,
      })),
      hasExtraButton: tipoInsumo === "compuesto",
      onExtraButtonClick: () => setMostrarCrearCompuesto(true),
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        const allInsumos = tipoInsumo === "simple" ? insumos : insumosCompuestos;
        const selected = allInsumos.find((i) => i.id.toString() === e.target.value);
        setInsumoSeleccionado(selected || null);
      }      
    },
    ...(tipoInsumo === "simple"
      ? [
          {
            id: "cantidad_insumo",
            label: "Cantidad de Insumo",
            type: "number",
          },
        ]
      : []),
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
    const salida = {
      fk_id_herramientas: herramientaSeleccionada ? herramientaSeleccionada.id : null,
      fk_id_insumo: insumoSeleccionado ? insumoSeleccionado.id : null,
      fk_id_asignacion: formData.fk_id_asignacion ? parseInt(formData.fk_id_asignacion) : null,
      cantidad_herramienta: Number(formData.cantidad_herramienta) || 0,
      cantidad_insumo: tipoInsumo === "simple" ? Number(formData.cantidad_insumo) || 0 : 0,
      fecha: formData.fecha,
      movimiento: "Salida" as const,
    };

    if (!salida.fk_id_herramientas && !salida.fk_id_insumo) {
      setMensaje("Debes seleccionar al menos una herramienta o un insumo.");
      return;
    }

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

      <div className="mb-6 flex justify-center gap-4 flex-wrap">
        <button
          className={`px-4 py-2 rounded-md ${herramientaSeleccionada ? 'bg-blue-700' : 'bg-blue-600'} text-white`}
          onClick={() => setMostrarModalHerramienta(true)}
        >
          {herramientaSeleccionada ? `Herramienta: ${herramientaSeleccionada.nombre_h}` : "Seleccionar Herramienta"}
        </button>

        <button
          className={`px-4 py-2 rounded-md ${insumoSeleccionado ? 'bg-green-700' : 'bg-green-600'} text-white`}
          onClick={() => {
            setMostrarModalInsumo(true);
            setTabActual(tipoInsumo === "compuesto" ? "compuestos" : "simples");
          }}
        >
          {insumoSeleccionado ? `Insumo: ${insumoSeleccionado.nombre}` : "Seleccionar Insumo"}
        </button>
      </div>

      <Formulario 
        fields={formFields} 
        onSubmit={handleSubmit} 
        title="Registrar Salida"
      >
      </Formulario>

      {tipoInsumo === "compuesto" && (
        <div className="mt-6 text-center">
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            onClick={() => setMostrarCrearCompuesto(true)}
          >
            + Crear Nuevo Insumo Compuesto
          </button>
        </div>
      )}

      <VentanaModal
        isOpen={mostrarModalHerramienta}
        onClose={() => setMostrarModalHerramienta(false)}
        titulo="Seleccionar Herramienta"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {herramientas.map((h) => (
            <div
              key={h.id}
              className="border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => {
                setHerramientaSeleccionada(h);
                setMostrarModalHerramienta(false);
              }}
            >
              <h4 className="font-semibold text-lg">{h.nombre_h}</h4>
              <p className="text-gray-600">Disponibles: {h.cantidad_herramienta}</p>
            </div>
          ))}
        </div>
      </VentanaModal>

      <VentanaModal
        titulo="Seleccionar Insumo"
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
              className="border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-green-50 transition-colors"
              onClick={() => {
                setInsumoSeleccionado(i);
                setMostrarModalInsumo(false);
              }}
            >
              <h4 className="font-semibold text-lg">{i.nombre}</h4>
              <p className="text-gray-600">Disponibles: {i.cantidad_insumo}</p>
            </div>
          ))}
        </div>
      </VentanaModal>

      <VentanaModal
        titulo="Crear Insumo Compuesto"
        isOpen={mostrarCrearCompuesto}
        onClose={() => setMostrarCrearCompuesto(false)}
      >
        <CrearInsumoCompuesto 
        onSuccess={agregarNuevoInsumo} 
        onClose={() => setMostrarCrearCompuesto(false)} />
      </VentanaModal>
    </div>
  );
};

export default RegistrarSalidaBodega;