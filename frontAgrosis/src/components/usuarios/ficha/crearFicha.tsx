import { useNavigate } from 'react-router-dom';
import { useCreateFicha } from '@/hooks/usuarios/ficha/useCreateFicha';
import { Ficha } from '@/hooks/usuarios/ficha/useFicha';
import Formulario from '@/components/globales/Formulario';

const CrearFicha = () => {
  const navigate = useNavigate();
  const mutation = useCreateFicha();

  const formFields = [
    { id: 'numero_ficha', label: 'Número de ficha', type: 'text' },
    { id: 'nombre_ficha', label: 'Nombre de la ficha', type: 'text' },
    { id: 'abreviacion', label: 'Abreviación', type: 'text' },
    { id: 'fecha_inicio', label: 'Fecha de inicio', type: 'date' },
    { id: 'fecha_salida', label: 'Fecha de salida', type: 'date' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const { numero_ficha, nombre_ficha, abreviacion, fecha_inicio, fecha_salida } = formData;

    if (!numero_ficha || !nombre_ficha || !abreviacion || !fecha_inicio || !fecha_salida) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    const newFicha: Ficha = {
      numero_ficha,
      nombre_ficha,
      abreviacion,
      fecha_inicio,
      fecha_salida,
    };

    mutation.mutate(newFicha, {
      onSuccess: () => navigate('/fichas'), // redirige a la lista de fichas
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Nueva Ficha"
      />
    </div>
  );
};

export default CrearFicha;