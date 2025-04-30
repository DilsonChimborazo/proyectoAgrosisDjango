import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Formulario from "../../globales/Formulario";
import { Herramientas, Insumo, Asignacion } from "@/hooks/inventario/bodega/useCrearBodega";
import CrearInsumoCompuesto from "@/components/inventario/insumocompuesto/CrearInsumoCompuesto";

interface Props {
  id: number;
  herramientas: Herramientas[];
  insumos: Insumo[];
  asignaciones: Asignacion[];
  onSuccess?: () => void;
}

const RegistrarSalidaBodega = ({ herramientas, insumos: insumosIniciales, asignaciones }: Props) => {
  const { mutate: crearMovimientoBodega } = useCrearBodega();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");
  const [tipoInsumo, setTipoInsumo] = useState<"simple" | "compuesto">("simple");
  const [insumos, setInsumos] = useState<Insumo[]>(insumosIniciales);
  const [herramientaSeleccionada, setHerramientaSeleccionada] = useState<Herramientas | null>(null);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);
  const [mostrarModalHerramienta, setMostrarModalHerramienta] = useState(false);
  const [mostrarModalInsumo, setMostrarModalInsumo] = useState(false);
  const [isCrearCompuesto, setIsCrearCompuesto] = useState(false); // Aquí agregamos el estado

  const agregarNuevoInsumo = (nuevo: Insumo) => {
    setInsumos([...insumos, nuevo]);
  };

  const formFields = [
    {
      id: "cantidad_herramienta",
      label: "Cantidad de Herramienta",
      type: "number",
    },
    {
      id: "tipo_insumo",
      label: "Tipo de Insumo",
      type: "select",
      options: [
        { value: "simple", label: "Simple" },
        { value: "compuesto", label: "Compuesto" },
      ],
      onChange: (e: any) => setTipoInsumo(e.target.value),
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
      options: asignaciones.map((a, idx) => ({
        value: idx.toString(),
        label: `Asignación ${a.fecha_programada}`,
      })),
    },
    { id: "fecha", label: "Fecha de salida", type: "date" },
  ];

  const handleSubmit = (formData: any) => {
    const salida = {
      fk_id_herramientas: herramientaSeleccionada ? herramientaSeleccionada.id : null,
      fk_id_insumo: tipoInsumo === "simple" && insumoSeleccionado ? insumoSeleccionado.id : null,
      fk_id_asignacion: formData.fk_id_asignacion ? parseInt(formData.fk_id_asignacion) : null,
      cantidad_herramienta: Number(formData.cantidad_herramienta) || 0,
      cantidad_insumo: tipoInsumo === "simple" ? Number(formData.cantidad_insumo) || 0 : 0,
      fecha: formData.fecha,
      movimiento: "Salida" as const,
    };

    if (!salida.fk_id_herramientas && !salida.fk_id_insumo && tipoInsumo === "simple") {
      setMensaje("Debes seleccionar al menos una herramienta o un insumo.");
      return;
    }

    crearMovimientoBodega(salida, {
      onSuccess: () => {
        setMensaje("Salida registrada exitosamente.");
        setTimeout(() => {
          navigate("/bodega");
          window.location.reload();
        }, 1000);
      },
      onError: (err) => {
        setMensaje(`Error al registrar salida: ${err.message}`);
      },
    });
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Registrar Salida de Bodega</h2>

      {/* Botón para seleccionar herramienta */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setMostrarModalHerramienta(true)}
        >
          {herramientaSeleccionada ? `Herramienta: ${herramientaSeleccionada.nombre_h}` : "Seleccionar Herramienta"}
        </button>

        {tipoInsumo === "simple" && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setMostrarModalInsumo(true)}
          >
            {insumoSeleccionado ? `Insumo: ${insumoSeleccionado.nombre}` : "Seleccionar Insumo"}
          </button>
        )}
      </div>

      <Formulario fields={formFields} onSubmit={handleSubmit} />

      {tipoInsumo === "compuesto" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Crear Insumo Compuesto</h3>
          <CrearInsumoCompuesto onClick={agregarNuevoInsumo} />
        </div>
      )}

      {mensaje && (
        <div className="mt-3 text-sm text-center text-blue-600">{mensaje}</div>
      )}

      {/* Modal Herramientas */}
      {mostrarModalHerramienta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Seleccionar Herramienta</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {herramientas.map((h) => (
                <div
                  key={h.id}
                  className="border p-4 rounded shadow cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setHerramientaSeleccionada(h);
                    setMostrarModalHerramienta(false);
                  }}
                >
                  <h4 className="font-semibold">{h.nombre_h}</h4>
                  <p>Cantidad disponible: {h.cantidad_herramienta}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setMostrarModalHerramienta(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Insumos */}
      {mostrarModalInsumo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Seleccionar Insumo</h3>

            {/* Alternar entre lista y creación */}
            <div className="mb-4 flex justify-end">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => setIsCrearCompuesto((prev) => !prev)}
              >
                {isCrearCompuesto ? "Volver a Lista de Insumos" : "Crear Insumo Compuesto"}
              </button>
            </div>

            {isCrearCompuesto ? (
              <CrearInsumoCompuesto
                onClick={(nuevoInsumo: Insumo) => {
                  agregarNuevoInsumo(nuevoInsumo);
                  setInsumoSeleccionado(nuevoInsumo);
                  setIsCrearCompuesto(false);
                  setMostrarModalInsumo(false);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {insumos.map((i) => (
                  <div
                    key={i.id}
                    className="border p-4 rounded shadow cursor-pointer hover:bg-green-100"
                    onClick={() => {
                      setInsumoSeleccionado(i);
                      setMostrarModalInsumo(false);
                    }}
                  >
                    <h4 className="font-semibold">{i.nombre}</h4>
                    <p>Cantidad disponible: {i.cantidad_insumo}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  setMostrarModalInsumo(false);
                  setIsCrearCompuesto(false); // Reset view
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegistrarSalidaBodega;
