import { Asignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useCrearAsignacion } from '../../../hooks/trazabilidad/asignacion/useCrearAsignacion';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearAsignacion = () => {
  const mutation = useCrearAsignacion(); // Hook para manejar la mutación de creación
  const navigate = useNavigate();
   // Lista de usuarios disponible

  // Definición de los campos del formulario
  const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'date' }, // Corregido el tipo de dato
    { id: 'observaciones', label: 'Observaciones', type: 'text' },
    { id: 'fk_id_actividad', label: 'Actividad', type: 'number' },
    {
      id: 'id_identificacion',
      label: 'Usuario',
      type: 'select',
    },
  ];

  // Manejo del envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fecha || !formData.observaciones || !formData.fk_id_actividad || !formData.id_identificacion) {
      console.error('❌ Campos faltantes. Verifica todos los campos.');
      return;
    }

    const newAsignacion: Asignacion = {
      fecha: new Date(formData.fecha).toISOString().split('T')[0], // Convertir a formato ISO
      observaciones: formData.observaciones,
      fk_id_actividad: parseInt(formData.fk_id_actividad),
      id_identificacion: parseInt(formData.id_identificacion),
    };

    console.log('🟢 Enviando nueva asignación:', newAsignacion);

    mutation.mutate(newAsignacion, {
      onSuccess: () => {
        console.log('✅ Asignación creada exitosamente. Redirigiendo...');
        navigate('/actividad'); // Redirigir al listado de actividades
      },
      onError: (error) => {
        console.error('❌ Error al crear la asignación:', error);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields} // Campos del formulario
        onSubmit={handleSubmit} // Función de envío
        isError={mutation.isError} // Indicador de error
        isSuccess={mutation.isSuccess} // Indicador de éxito
        title="Crear Asignación" // Título del formulario
      />
    </div>
  );
};

export default CrearAsignacion;