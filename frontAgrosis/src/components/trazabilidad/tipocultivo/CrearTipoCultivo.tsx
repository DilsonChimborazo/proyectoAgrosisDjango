import { useCrearTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface CrearTipoCultivoProps {
  onSuccess: () => void;
}

const CICLO_OPCIONES = [
  { value: 'Perennes', label: 'Perennes' },
  { value: 'Semiperennes', label: 'Semiperennes' },
  { value: 'Transitorios', label: 'Transitorios' },
];

const NOMBRE_OPCIONES = [
  { value: 'Cereales', label: 'Cereales' },
  { value: 'Hortalizas', label: 'Hortalizas' },
  { value: 'Leguminosas', label: 'Leguminosas' },
  { value: 'Árboles Frutales', label: 'Árboles Frutales' },
  { value: 'Tubérculos', label: 'Tubérculos' },
  { value: 'Cultivos Forrajeros', label: 'Cultivos Forrajeros' },
];

const CrearTipoCultivo = ({ onSuccess }: CrearTipoCultivoProps) => {
  const { mutate: createTipoCultivo, isError } = useCrearTipoCultivo();

  const formFields = [
    {
      id: 'nombre',
      label: 'Nombre del Tipo de Cultivo',
      type: 'select',
      options: NOMBRE_OPCIONES,
      required: true,
    },
    { id: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
    {
      id: 'ciclo_duracion',
      label: 'Ciclo de Duración',
      type: 'select',
      options: CICLO_OPCIONES,
      required: true,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | File | string[] }) => {
    // Convertimos los valores a string, manejando string[] si es necesario
    const nombre = Array.isArray(formData.nombre)
      ? formData.nombre[0] // Tomamos el primer valor si es un array
      : typeof formData.nombre === 'string'
      ? formData.nombre
      : '';
    const descripcion = Array.isArray(formData.descripcion)
      ? formData.descripcion[0]
      : typeof formData.descripcion === 'string'
      ? formData.descripcion
      : '';
    const cicloDuracion = Array.isArray(formData.ciclo_duracion)
      ? formData.ciclo_duracion[0]
      : typeof formData.ciclo_duracion === 'string'
      ? formData.ciclo_duracion
      : '';

    // Validamos que los campos no estén vacíos
    if (!nombre || !descripcion || !cicloDuracion) {
      showToast({
        title: 'Aviso',
        description: 'Todos los campos son obligatorios',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }

    // Verificamos que no se hayan recibido Files, ya que no los esperamos
    if (
      formData.nombre instanceof File ||
      formData.descripcion instanceof File ||
      formData.ciclo_duracion instanceof File
    ) {
      showToast({
        title: 'Aviso',
        description: 'Los campos no pueden contener archivos',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }

    createTipoCultivo(
      { nombre: nombre.trim(), descripcion: descripcion.trim(), ciclo_duracion: cicloDuracion },
      {
        onSuccess: () => {
          showToast({
            title: 'Tipo de cultivo creado exitosamente',
            description: 'El tipo de cultivo ha sido registrado en el sistema',
            timeout: 3000,
            variant: 'success',
          });
          onSuccess();
        },
        onError: (error: any) => {
          showToast({
            title: 'Error al crear tipo de cultivo',
            description:
              error.response?.data?.detail || 'Ocurrió un error al registrar el tipo de cultivo',
            timeout: 3000,
            variant: 'error',
          });
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={isError}
        isSuccess={false}
        title="Crear Nuevo Tipo de Cultivo"
      />
    </div>
  );
};

export default CrearTipoCultivo;