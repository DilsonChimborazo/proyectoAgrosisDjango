import { useCrearInsumos } from '../../hooks/inventario/herramientas/useCrearInsumos';
import { Insumo } from '@/hooks/inventario/herramientas/useCrearInsumos';
import Formulario from '../globales/Formulario';

const CrearInsumos = () => {
  const mutation = useCrearInsumos();

  const formFields = [
    { id: 'nombre', label: 'Nombre del Insumo', type: 'text' },
    { id: 'tipo', label: 'Tipo', type: 'text' },
    { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
    { id: 'cantidad', label: 'Cantidad', type: 'number' },
    { id: 'unidad_medida', label: 'Unidad de Medida', type: 'text' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const nuevoInsumo: Insumo = {
      nombre: formData.nombre,
      tipo: formData.tipo,
      precio_unidad: parseFloat(formData.precio_unidad),
      cantidad: parseInt(formData.cantidad),
      unidad_medida: formData.unidad_medida,
    };
    mutation.mutate(nuevoInsumo);
  };

  return (
    <div className="p-10">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Insumo"
      />
    </div>
  );
};

export default CrearInsumos;
