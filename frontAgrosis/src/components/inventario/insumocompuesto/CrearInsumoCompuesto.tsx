import { useState } from "react";
import VentanaModal from "@/components/globales/VentanasModales";
import { useCreateInsumoCompuesto } from "@/hooks/inventario/insumocompuesto/useCrearInsumoCompuesto";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";

interface Props {
  onSuccess?: (nuevo: any) => void;
  onClose?: () => void;
}

const CrearInsumoCompuesto: React.FC<Props> = ({ onSuccess, onClose }) => {
  const { data: insumos } = useInsumo();
  const { data: unidades } = useMedidas();
  const { mutateAsync } = useCreateInsumoCompuesto();

  const [nombre, setNombre] = useState("");
  const [fkUnidadMedida, setFkUnidadMedida] = useState<number | "">("");
  const [detalles, setDetalles] = useState<{ insumo: number; cantidad_utilizada: number }[]>([]);
  const [selectedInsumos, setSelectedInsumos] = useState<{ insumoId: number; cantidad: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insumoErrors, setInsumoErrors] = useState<{ [key: number]: string }>({});

  const handleCantidadChange = (insumoId: number, cantidad: string) => {
    const cantidadNumero = parseFloat(cantidad);
    const insumo = insumos?.find((i) => i.id === insumoId);

    if (insumo) {
      if (cantidadNumero > insumo.cantidad_insumo) {
        setInsumoErrors((prev) => ({
          ...prev,
          [insumoId]: `Cantidad disponible: ${insumo.cantidad_insumo}`,
        }));
        return;
      } else {
        const { [insumoId]: _, ...rest } = insumoErrors;
        setInsumoErrors(rest);
      }

      setSelectedInsumos((prev) =>
        prev.map((item) =>
          item.insumoId === insumoId ? { ...item, cantidad: cantidadNumero } : item
        )
      );
    }
  };

  const handleDetalleCantidadChange = (insumoId: number, cantidad: string) => {
    const cantidadNumero = parseFloat(cantidad);
    setDetalles((prev) =>
      prev.map((detalle) =>
        detalle.insumo === insumoId
          ? { ...detalle, cantidad_utilizada: cantidadNumero }
          : detalle
      )
    );
  };

  const handleInsumoSelect = (insumoId: number) => {
    setSelectedInsumos((prev) => {
      if (prev.some((item) => item.insumoId === insumoId)) {
        return prev.filter((item) => item.insumoId !== insumoId);
      } else {
        return [...prev, { insumoId, cantidad: 0 }];
      }
    });
  };

  const handleAddDetalle = () => {
    setDetalles((prev) => {
      const nuevos = [...prev];
      selectedInsumos.forEach((item) => {
        const index = nuevos.findIndex((detalle) => detalle.insumo === item.insumoId);
        if (index !== -1) {
          nuevos[index].cantidad_utilizada = item.cantidad;
        } else {
          nuevos.push({ insumo: item.insumoId, cantidad_utilizada: item.cantidad });
        }
      });
      return nuevos;
    });

    setIsModalOpen(false);
    setSelectedInsumos([]);
    setInsumoErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !fkUnidadMedida || detalles.length === 0) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const datosAEnviar = {
        nombre,
        fk_unidad_medida: fkUnidadMedida,
        detalles,
      };

      const nuevoInsumo = await mutateAsync(datosAEnviar);
      alert("Insumo compuesto creado exitosamente");

      if (onSuccess) onSuccess(nuevoInsumo);
      if (onClose) onClose();

      // Reset form
      setNombre("");
      setFkUnidadMedida("");
      setDetalles([]);
      setSelectedInsumos([]);
      setInsumoErrors({});
    } catch (error) {
      console.error(error);
      alert("Error al crear el insumo compuesto.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Crear Insumo Compuesto</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Unidad de medida</label>
          <select
            value={fkUnidadMedida}
            onChange={(e) => setFkUnidadMedida(Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccione una unidad</option>
            {unidades?.map((unidad) => (
              <option key={unidad.id} value={unidad.id}>
                {unidad.nombre_medida} ({unidad.unidad_base})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-200 p-5">
          <label className="block mb-2 font-semibold">
            Detalles (Insumos usados)
          </label>
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Seleccionar Insumos
            </button>
          </div>

          {detalles.map((detalle, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded-2xl flex gap-2 mb-2"
            >
              <div className="w-1/2">
                <strong>Insumo: </strong>
                {insumos?.find((i) => i.id === detalle.insumo)?.nombre ||
                  detalle.insumo}
              </div>
              <div className="w-1/2">
                <input
                  type="number"
                  step="0.01"
                  value={detalle.cantidad_utilizada}
                  onChange={(e) =>
                    handleDetalleCantidadChange(detalle.insumo, e.target.value)
                  }
                  placeholder="Cantidad utilizada"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crear Insumo Compuesto
          </button>
        </div>
      </form>

      <VentanaModal titulo="" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-6 w-full max-h-[85vh] overflow-auto p-6 bg-white rounded shadow-lg">
          <div className="w-full overflow-y-auto">
            <h4 className="font-semibold text-xl mb-4 text-gray-700">
              Insumos disponibles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {insumos?.map((insumo) => {
                let cantidadClass = "bg-gray-100";
                if (insumo.cantidad_insumo < 10) cantidadClass = "bg-red-500";
                else if (insumo.cantidad_insumo <= 20) cantidadClass = "bg-orange-500";
                else cantidadClass = "bg-green-500";

                return (
                  <div
                    key={insumo.id}
                    className={`p-4 rounded-lg cursor-pointer border shadow-sm transition-all duration-200 ${
                      selectedInsumos.some((i) => i.insumoId === insumo.id)
                        ? "bg-blue-100 border-blue-400"
                        : "bg-white hover:bg-gray-100 border-gray-200"
                    }`}
                    onClick={() => handleInsumoSelect(insumo.id)}
                  >
                    <h5 className="font-semibold text-gray-800">
                      {insumo.nombre}
                    </h5>
                    <p
                      className={`mt-2 py-2 rounded text-white text-center text-sm ${cantidadClass}`}
                    >
                      Cantidad disponible: {insumo.cantidad_insumo}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Vencimiento: {insumo.fecha_vencimiento}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full">
            <h4 className="font-semibold text-xl mb-4 text-gray-700">
              Insumos seleccionados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedInsumos.map((item) => (
                <div
                  key={item.insumoId}
                  className="p-3 border rounded shadow-sm bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 block mb-2">
                    {insumos?.find((i) => i.id === item.insumoId)?.nombre}
                  </span>
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(item.insumoId, e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full text-sm"
                    placeholder="Cantidad"
                    required
                  />
                  {insumoErrors[item.insumoId] && (
                    <p className="text-red-500 text-xs mt-1">
                      {insumoErrors[item.insumoId]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleAddDetalle}
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
              >
                Confirmar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </VentanaModal>
    </div>
  );
};

export default CrearInsumoCompuesto;
