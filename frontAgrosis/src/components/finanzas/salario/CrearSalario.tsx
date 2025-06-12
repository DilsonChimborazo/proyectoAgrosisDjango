import { useCrearSalario } from '@/hooks/finanzas/salario/useCrearSalario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '@/hooks/usuarios/rol/useRol';
import { useCallback } from 'react';
import { showToast } from '@/components/globales/Toast';

interface CrearSalarioProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const CrearSalario = ({ onClose, onSuccess }: CrearSalarioProps) => {
  const mutation = useCrearSalario();
  const navigate = useNavigate();
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  const formFields = [
    {
      id: 'fk_id_rol',
      label: 'Rol',
      type: 'select',
      options: roles.map((rol) => ({
        value: rol.id?.toString() || '',
        label: rol.rol,
      })),
      required: true,
      disabled: isLoadingRoles,
    },
    {
      id: 'precio_jornal',
      label: 'Precio por Jornal',
      type: 'number',
      step: '0.01',
      min: '0',
      required: true,
    },
    {
      id: 'horas_por_jornal',
      label: 'Horas por Jornal',
      type: 'number',
      step: '0.1',
      min: '0',
      required: true,
    },
    {
      id: 'activo',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
      ],
      required: true,
      defaultValue: 'true',
    },
    {
      id: 'fecha_inicio',
      label: 'Fecha Inicio',
      type: 'date',
      required: false,
    },
  ];

  const handleSubmit = useCallback(
    (formData: { [key: string]: string | string[] | File }) => {
      const errors: string[] = [];

      const fkIdRol = Array.isArray(formData.fk_id_rol)
        ? formData.fk_id_rol[0]
        : formData.fk_id_rol;
      const precioJornal = Array.isArray(formData.precio_jornal)
        ? formData.precio_jornal[0]
        : formData.precio_jornal;
      const horasPorJornal = Array.isArray(formData.horas_por_jornal)
        ? formData.horas_por_jornal[0]
        : formData.horas_por_jornal;
      const activo = Array.isArray(formData.activo)
        ? formData.activo[0]
        : formData.activo;
      const fechaInicio = Array.isArray(formData.fecha_inicio)
        ? formData.fecha_inicio[0]
        : formData.fecha_inicio;

      if (!fkIdRol) errors.push('Rol es obligatorio');
      if (!precioJornal || parseFloat(precioJornal as string) < 0) {
        errors.push('Precio por Jornal no puede ser negativo');
      }
      if (!horasPorJornal || parseFloat(horasPorJornal as string) < 0) {
        errors.push('Horas por Jornal no puede ser negativo');
      }
      if (!activo) errors.push('Estado es obligatorio');

      if (errors.length > 0) {
        const mensajeError = errors.join(', ');
        showToast({
          title: 'Error al validar el formulario',
          description: mensajeError,
          timeout: 6000,
        });
        return;
      }

      const payload = {
        fk_id_rol: parseInt(fkIdRol as string),
        precio_jornal: parseFloat(precioJornal as string),
        horas_por_jornal: parseFloat(horasPorJornal as string),
        activo: activo === 'true',
        fecha_inicio: (fechaInicio as string) || new Date().toISOString().split('T')[0],
      };

      mutation.mutate(payload, {
        onSuccess: () => {
          showToast({
            title: 'Salario creado exitosamente',
            description: 'El salario ha sido registrado correctamente',
            timeout: 4000,
          });
          if (onSuccess) onSuccess();
          else navigate('/principal');
          onClose?.();
        },
        onError: (error: any) => {
          const mensajeError = error?.response?.data?.message || 'Ocurrió un error al crear el salario';
          showToast({
            title: 'Error al crear salario',
            description: mensajeError,
            timeout: 5000,
          });
          console.error('Error al crear el salario:', error.response?.data || error.message);
        },
      });
    },
    [mutation, navigate, onClose, onSuccess]
  );

  return (
    <div>
      {isLoadingRoles ? (
        <p>Cargando roles...</p>
      ) : (
        <Formulario
          fields={formFields}
          onSubmit={handleSubmit}
          isError={mutation.isError}
          isSuccess={mutation.isSuccess}
          title='Crear Salario'
        />
      )}
    </div>
  );
};

export default CrearSalario;