import { useState } from 'react';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useRealiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { useUsuarios } from '@/hooks/usuarios/usuario/useUsuarios';
import { Asignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearAsignacion = () => {
  const mutation = useCrearAsignacion();
  const navigate = useNavigate();
  const { data: realizaList = [], isLoading: isLoadingRealiza } = useRealiza();
  const { data: usuarios = [], isLoading: isLoadingUsuarios } = useUsuarios();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mapeo de opciones para el select de realiza
  const realizaOptions = realizaList.map((realiza) => {
    // Construimos el nombre compuesto: "especie.nombre_comun nombre_cultivo"
    const especieNombre = realiza.fk_id_cultivo.fk_id_especie.nombre_comun || 'Sin especie';
    const cultivoNombre = realiza.fk_id_cultivo.nombre_cultivo || 'Sin cultivo';
    const nombreCompuesto = `${especieNombre} ${cultivoNombre}`.trim();
    return {
      value: realiza.id.toString(),
      label: nombreCompuesto || 'Sin nombre',
    };
  });

  // Mapeo de opciones para el select de usuarios
  const usuarioOptions = usuarios.map((usuario) => ({
    value: usuario.id.toString(),
    label: `${usuario.nombre} ${usuario.apellido}`,
  }));

  // Opciones para el select de estado
  const estadoOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' },
    { value: 'Reprogramada', label: 'Reprogramada' },
  ];

  // Definición de los campos del formulario
  const formFields = [
    {
      id: 'estado',
      label: 'Estado',
      type: 'select',
      options: estadoOptions,
    },
    { id: 'fecha_programada', label: 'Fecha Programada', type: 'date' },
    { id: 'observaciones', label: 'Observaciones', type: 'textarea' },
    {
      id: 'fk_id_realiza',
      label: 'Fk id realiza',
      type: 'select',
      options: realizaOptions.length > 0
        ? realizaOptions
        : [{ value: '', label: 'No hay opciones disponibles' }],
    },
    {
      id: 'fk_identificacion',
      label: 'Fk identificacion',
      type: 'select',
      options: usuarioOptions.length > 0
        ? usuarioOptions
        : [{ value: '', label: 'No hay usuarios disponibles' }],
    },
  ];

  // Manejo del formulario
  const handleSubmit = (formData: { [key: string]: string |File }) => {
    setErrorMessage(null);

    const estado = formData.estado;
    const fechaProgramada = formData.fecha_programada;
    const observaciones = formData.observaciones;
    const fkIdRealiza = formData.fk_id_realiza;
    const fkIdentificacion = formData.fk_identificacion;

    // Validaciones
    if (
      typeof estado !== 'string' ||
      typeof fechaProgramada !== 'string' ||
      typeof observaciones !== 'string' ||
      typeof fkIdRealiza !== 'string' ||
      typeof fkIdentificacion !== 'string'
    ) {
      setErrorMessage('❌ Todos los campos deben ser de tipo texto');
      return;
    }

    if (!estado || !fechaProgramada || !fkIdRealiza || !fkIdentificacion) {
      setErrorMessage('❌ Los campos Estado, Fecha Programada, Fk id realiza y Fk identificacion son obligatorios');
      return;
    }

    if (fkIdRealiza === '' || fkIdentificacion === '') {
      setErrorMessage('❌ Debes seleccionar un realiza y un usuario válidos');
      return;
    }

    const nuevaAsignacion: Omit<Asignacion, 'id'> = {
      estado: estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
      fecha_programada: fechaProgramada,
      observaciones: observaciones.trim() || '',
      fk_id_realiza: parseInt(fkIdRealiza, 10),
      fk_identificacion: parseInt(fkIdentificacion, 10),
    };

    console.log('🚀 Enviando asignación al backend:', nuevaAsignacion);

    mutation.mutate(nuevaAsignacion, {
      onSuccess: () => {
        console.log('✅ Asignación creada exitosamente');
        navigate('/asignaciones_actividades');
      },
      onError: (error: any) => {
        const errorMsg = error.message || 'Error desconocido al crear la asignación';
        console.error('❌ Error al crear asignación:', errorMsg);
        setErrorMessage(`❌ Error: ${errorMsg}`);
      },
    });
  };

  if (isLoadingRealiza || isLoadingUsuarios) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
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