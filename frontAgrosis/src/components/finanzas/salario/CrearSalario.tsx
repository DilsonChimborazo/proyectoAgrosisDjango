import { useCrearSalario } from '@/hooks/finanzas/salario/useCrearSalario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '@/hooks/usuarios/rol/useRol';
import { useCallback } from 'react';

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
      min: '1',
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

  const handleSubmit = useCallback((formData: { [key: string]: string | File }) => {
    const payload = {
      fk_id_rol: parseInt(formData.fk_id_rol as string),
      precio_jornal: parseFloat(formData.precio_jornal as string),
      horas_por_jornal: parseFloat(formData.horas_por_jornal as string),
      activo: formData.activo === 'true',
      fecha_inicio: formData.fecha_inicio as string || new Date().toISOString().split('T')[0], // Formato ISO
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        else navigate('/principal');
        onClose?.();
      },
      onError: (error: any) => {
        console.error('Error al crear el salario:', error.response?.data || error.message);
      },
    });
  }, [mutation, navigate, onClose, onSuccess]);

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
          title="Crear Salario"
        />
      )}
    </div>
  );
};

export default CrearSalario;