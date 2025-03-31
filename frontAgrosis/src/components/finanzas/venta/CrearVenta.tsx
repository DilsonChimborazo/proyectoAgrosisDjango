import { NuevaVenta } from '@/hooks/finanzas/venta/useCrearVenta';
import { useCrearVenta } from '../../../hooks/finanzas/venta/useCrearVenta';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useProduccion } from '@/hooks/finanzas/produccion/useProduccion';

const CrearVenta = () => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();
  const { data: producciones = [], isLoading: isLoadingProducciones } = useProduccion();

  // Opciones de Producciones
  const produccionOptions = producciones.map((produccion) => ({
    value: String(produccion.id_produccion), // ✅ Convertir a string
    label: `${produccion.nombre_produccion} - ${produccion.fecha}`, // Formato: Producción - Fecha
  }));

  // Definición de los campos del formulario
  const formFields = [
    { id: 'fk_id_produccion', label: 'Producción', type: 'select', options: produccionOptions },
    { id: 'cantidad', label: 'Cantidad', type: 'number' },
    { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
    { id: 'fecha', label: 'Fecha', type: 'date' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fk_id_produccion || !formData.cantidad || !formData.precio_unidad || !formData.fecha) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion: Number(formData.fk_id_produccion), // Convertir a número
      cantidad: parseFloat(formData.cantidad),
      precio_unidad: parseFloat(formData.precio_unidad),
      total_venta: parseFloat(formData.cantidad) * parseFloat(formData.precio_unidad), 
      fecha: formData.fecha,
    };

    console.log("🚀 Enviando venta al backend:", nuevaVenta);

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        console.log("✅ Venta creada exitosamente");
        navigate("/ventas"); // Redirigir a la lista de ventas
      },
      onError: (error) => {
        console.error("❌ Error al crear la venta:", error);
      },
    });
  };

  if (isLoadingProducciones) {
    return <div className="text-center text-gray-500">Cargando producciones...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario 
        fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Venta"  
      />
    </div>
  );
};

export default CrearVenta;
