import { useState } from 'react';
import { useCreateInsumoCompuesto } from '@/hooks/inventario/insumocompuesto/useCrearInsumoCompuesto';
import { useInsumo } from '@/hooks/inventario/insumos/useInsumo';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';


const CrearInsumoCompuesto = () => {
  const { data: insumos } = useInsumo();
  const { data: unidades } = useMedidas();
  const { mutateAsync } = useCreateInsumoCompuesto();


  const [nombre, setNombre] = useState('');
  const [fkUnidadMedida, setFkUnidadMedida] = useState<number | ''>('');
  const [detalles, setDetalles] = useState<{ insumo: number; cantidad_utilizada: number }[]>([]);
  const [selectedInsumos, setSelectedInsumos] = useState<{ insumoId: number; cantidad: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insumoErrors, setInsumoErrors] = useState<{ [key: number]: string }>({});

  const handleCantidadChange = (insumoId: number, cantidad: string) => {
    const cantidadNumero = parseFloat(cantidad);
    const insumo = insumos?.find((i) => i.id === insumoId);

    if (insumo) {
      if (cantidadNumero > insumo.cantidad_insumo) {
        setInsumoErrors((prevErrors) => ({
          ...prevErrors,
          [insumoId]: `No hay suficiente cantidad de ${insumo.nombre}. Solo hay ${insumo.cantidad_insumo} disponibles.`,
        }));
        return; 
      } else {

        setInsumoErrors((prevErrors) => {
          const { [insumoId]: removed, ...rest } = prevErrors;
          return rest;
        });
      }

      setSelectedInsumos((prevSelected) =>
        prevSelected.map((item) =>
          item.insumoId === insumoId ? { ...item, cantidad: cantidadNumero } : item
        )
      );
    }
  };

  const handleDetalleCantidadChange = (insumoId: number, cantidad: string) => {
    const cantidadNumero = parseFloat(cantidad);
    setDetalles((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.insumo === insumoId ? { ...detalle, cantidad_utilizada: cantidadNumero } : detalle
      )
    );
  };

  const handleInsumoSelect = (insumoId: number) => {
    setSelectedInsumos((prevSelected) => {
      if (prevSelected.some((item) => item.insumoId === insumoId)) {
        return prevSelected.filter((item) => item.insumoId !== insumoId);
      } else {
        return [...prevSelected, { insumoId, cantidad: 0 }];
      }
    });
  };

  const handleAddDetalle = () => {
    const nuevosDetalles = selectedInsumos.map((item) => ({
      insumo: item.insumoId,
      cantidad_utilizada: item.cantidad,
    }));
    setDetalles((prev) => [...prev, ...nuevosDetalles]);
    setIsModalOpen(false);
    setSelectedInsumos([]);
  };

  const handleUnidadMedidaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFkUnidadMedida(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !fkUnidadMedida || detalles.length === 0) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    try {
      await mutateAsync({
        nombre,
        fk_unidad_medida: fkUnidadMedida,
        detalles,
      });
      alert('Insumo compuesto creado exitosamente');
      
      // Cerrar el modal después de la creación exitosa
      setIsModalOpen(false);
  
    } catch (error) {
      console.error(error);
      alert('Error al crear el insumo compuesto');
    }
  };
  

  return (
    <div className="bg-white mt-6 rounded-2xl container mx-auto w-1/3 p-4">
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
            onChange={handleUnidadMedidaChange}
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

        <div className='bg-gray-200 p-5'>
          <label className="block  mb-2 font-semibold">Detalles (Insumos usados)</label>
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
            <div key={index} className="bg-white p-2 rounded-2xl flex gap-2 mb-2">
              <div className="w-1/2">
                <strong>Insumo: </strong>
                {insumos?.find((i) => i.id === detalle.insumo)?.nombre || detalle.insumo}
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
                  className="border p-2 rounded w-full "
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

      {/* Modal para selección de insumos */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-4/5 h-4/5 flex flex-row">
            <div className="w-4/5 h-full pr-4 overflow-y-auto">
              <h4 className="font-semibold text-lg mb-2">Insumos disponibles</h4>
              <div className="grid grid-cols-4 gap-2 max-h-full overflow-y-auto">
                {insumos?.map((insumo) => {
                  let cantidadClass = 'bg-gray-100'; 
                  // Lógica para establecer el color de fondo
                  if (insumo.cantidad_insumo < 10) {
                    cantidadClass = 'bg-red-500'; 
                  } else if (insumo.cantidad_insumo >= 10 && insumo.cantidad_insumo <= 20) {
                    cantidadClass = 'bg-orange-500';
                  } else {
                    cantidadClass = 'bg-green-500'; 
                  }

                  return (
                    <div
                      key={insumo.id}
                      className={`p-3 rounded-lg cursor-pointer border ${
                        selectedInsumos.some((item) => item.insumoId === insumo.id)
                          ? 'bg-blue-100 border-blue-400'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleInsumoSelect(insumo.id)}
                    >
                      <h5 className="font-semibold">{insumo.nombre}</h5>
                      <p className={`p-2 rounded text-white ${cantidadClass}`}>
                        Cantidad disponible: {insumo.cantidad_insumo}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna de insumos seleccionados (20%) */}
            <div className="w-1/5 h-full pl-4 overflow-y-auto">
              <h4 className="font-semibold text-lg mb-2">Insumos seleccionados</h4>
              <div className="space-y-2">
                {selectedInsumos.map((item) => (
                    <div key={item.insumoId} className="mb-2">
                        <div className="flex flex-col gap-2">
                            <span className="w-full font-semibold">
                            {insumos?.find((insumo) => insumo.id === item.insumoId)?.nombre}
                            </span>
                            <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) =>
                                handleCantidadChange(item.insumoId, e.target.value)
                            }
                            className="border p-2 rounded w-full"
                            placeholder="Cantidad"
                            required
                            />
                            {/* Mostrar mensaje de error debajo del insumo seleccionado */}
                            {insumoErrors[item.insumoId] && (
                            <p className="text-red-500 text-sm mt-2">{insumoErrors[item.insumoId]}</p>
                            )}
                        </div>
                        </div>

                ))}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={handleAddDetalle}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearInsumoCompuesto;
