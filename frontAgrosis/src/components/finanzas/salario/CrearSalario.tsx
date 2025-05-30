import { useCrearSalario } from '@/hooks/finanzas/salario/useCrearSalario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

interface CrearSalarioProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface Rol {
  id: number;
  rol: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const CrearSalario = ({ onClose, onSuccess }: CrearSalarioProps) => {
  const mutation = useCrearSalario();
  const navigate = useNavigate();

  // Cargar roles desde la API
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se ha encontrado un token de autenticación');

      const response = await axios.get(`${apiUrl}rol/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as Rol[];
    },
  });

  // Definir los campos del formulario
  const formFields = [
    {
      id: 'fk_id_rol',
      label: 'Rol',
      type: 'select',
      options: roles.map((rol) => ({
        value: rol.id.toString(),
        label: rol.rol,
      })),
      required: true,
      disabled: isLoadingRoles, // Deshabilitar mientras se cargan los roles
    },
    {
      id: 'precio_jornal',
      label: 'Precio por Jornal',
      type: 'number',
      step: '0.01',
      required: true,
    },
    {
      id: 'horas_por_jornal',
      label: 'Horas por Jornal',
      type: 'number',
      step: '0.1',
      required: true,
    },
    {
      id: 'fecha_inicio',
      label: 'Fecha de Inicio',
      type: 'date',
      required: true,
    },
    {
      id: 'fecha_fin',
      label: 'Fecha de Fin (Opcional)',
      type: 'date',
      required: false,
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
  ];

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    const nuevoSalario = new FormData();

    nuevoSalario.append('fk_id_rol', formData.fk_id_rol as string); // Agregar fk_id_rol
    nuevoSalario.append('precio_jornal', formData.precio_jornal as string);
    nuevoSalario.append('horas_por_jornal', formData.horas_por_jornal as string);
    nuevoSalario.append('fecha_inicio', formData.fecha_inicio as string);

    if (formData.fecha_fin) {
      nuevoSalario.append('fecha_fin', formData.fecha_fin as string);
    }

    nuevoSalario.append('activo', formData.activo as string);

    mutation.mutate(nuevoSalario, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/principal');
        }
        onClose?.();
      },
      onError: (error: any) => {
        console.error('Error al crear el salario:', error.message);
      },
    });
  };

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