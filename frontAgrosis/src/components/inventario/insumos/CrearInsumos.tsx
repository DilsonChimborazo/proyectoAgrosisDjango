import { Insumo } from '@/hooks/inventario/insumos/useCrearInsumos';
import { useCrearInsumos } from '../../../hooks/inventario/insumos/useCrearInsumos';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';




const CrearInsumos = () => {
  const mutation = useCrearInsumos();
  const navigate = useNavigate();

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
    navigate('/insumos');
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
      {/* Botón para regresar a la lista de insumos */}
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => navigate('/insumos')}
      >
        Volver a Insumos
      </button>
    </div>
  );
};

export default CrearInsumos;
