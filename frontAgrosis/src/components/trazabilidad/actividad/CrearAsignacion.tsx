import { Asignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useCrearAsignacion } from '../../../hooks/trazabilidad/asignacion/useCrearAsignacion';
import Formulario from '../../globales/Formulario';
import { useUsuarios } from '@/hooks/usuarios/useUsuarios';
import { useAsignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion'; // Hook para obtener actividades
import { useNavigate } from 'react-router-dom';

const CrearAsignacion = () => {
  const mutation = useCrearAsignacion(); // Hook para manejar la creación
  const navigate = useNavigate();
  const { data: usuarios = [] } = useUsuarios(); // Hook para obtener usuarios
  const { data: asignaciones = [], isLoading: isLoadingAsignaciones } = useAsignacion(); // Hook para obtener actividades relacionadas con asignaciones

  // Mapeo de opciones para el select de actividades
  const actividadOptions = asignaciones
    .map((asignacion) => ({
      value: asignacion.fk_id_actividad.id, // ID de la actividad
      label: asignacion.fk_id_actividad.nombre_actividad, // Nombre de la actividad
    }));

  // Mapeo de opciones para el select de usuarios
  const usuarioOptions = usuarios.map((usr) => ({
    value: usr.id,
    label: `${usr.nombre} ${usr.apellido}`, // Mostrar nombre completo del usuario
  }));

  // Definición de los campos del formulario
  const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'date' }, // Campo de tipo date
    { id: 'observaciones', label: 'Observaciones', type: 'text' }, // Observaciones
    {
      id: 'fk_id_actividad',
      label: 'Actividad',
      type: 'select',
      options: actividadOptions, // Opciones dinámicas basadas en actividades
    },
    {
      id: 'id_identificacion',
      label: 'Usuario',
      type: 'select',
      options: usuarioOptions, // Opciones dinámicas basadas en usuarios
    },
  ];

  // Manejo del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.fecha ||
      !formData.observaciones ||
      !formData.fk_id_actividad ||
      !formData.id_identificacion
    ) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const newAsignacion: Asignacion = {
      fecha: new Date(formData.fecha).toISOString().split('T')[0], // Convertir la fecha al formato ISO
      observaciones: formData.observaciones.trim(),
      fk_id_actividad: formData.fk_id_actividad,
      id_identificacion:formData.id_identificacion
    };

    console.log("🚀 Enviando asignación al backend:", newAsignacion);

    mutation.mutate(newAsignacion, {
      onSuccess: () => {
        console.log("✅ Asignación creada exitosamente");
        navigate("/actividad"); // Redirigir al listado de actividades
      },
      onError: (error) => {
        console.error("❌ Error al crear asignación:", error);
      },
    });
  };

  if (isLoadingAsignaciones) {
    return <div className="text-center text-gray-500">Cargando actividades...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Asignación"
      />
    </div>
  );
};

export default CrearAsignacion;