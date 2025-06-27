import { useState, useEffect } from 'react';
import { useCrearProgramacion } from '@/hooks/trazabilidad/programacion/useCrearProgramacion';
import { useActualizarAsignacion } from '@/hooks/trazabilidad/asignacion/useActualizarAsignacion';
import { showToast } from '@/components/globales/Toast';

// Definir tipos locales compatibles con useProgramacion
interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

interface Cultivo {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: {
      id: number;
      nombre: string;
      descripcion: string;
      ciclo_duracion?: string;
    };
  };
}

interface Plantacion {
  id: number;
  descripcion: string;
  fk_id_cultivo: Cultivo;
  cantidad_transplante?: number;
  fk_id_semillero?: Semillero;
  fecha_plantacion: string;
}

interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

interface Realiza {
  id: number;
  fk_id_plantacion?: Plantacion;
  fk_id_actividad?: Actividad;
}

interface Insumo {
  id: number;
  nombre: string;
}

interface Herramienta {
  id: number;
  nombre_h: string;
}

interface RecursosAsignados {
  insumos?: Insumo[];
  herramientas?: Herramienta[];
}

interface Rol {
  id: number;
  rol: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fk_id_rol: Rol;
  identificacion: string;
  is_active: boolean;
  ficha: {
    id: number;
    numero_ficha: number;
    nombre_ficha: string;
    abreviacion: string;
    fecha_inicio: string;
    fecha_salida: string;
    is_active: boolean;
  } | null;
  img: string | null;
  img_url: string;
}

interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';
  factor_conversion: number;
}

interface LocalAsignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number | Realiza;
  fk_identificacion: (number | { id: number } | Usuario)[];
  recursos_asignados: (string | RecursosAsignados)[];
}

interface LocalProgramacion {
  id?: number;
  fk_id_asignacionActividades: number | LocalAsignacion;
  fecha_realizada?: string;
  duracion?: number;
  cantidad_insumo?: number;
  img?: string | File | null;
  fk_unidad_medida?: UnidadMedida;
  estado?: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

interface CrearProgramacionModalProps {
  asignacionId: number;
  existingProgramacion?: LocalProgramacion;
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearProgramacion: React.FC<CrearProgramacionModalProps> = ({
  asignacionId,
  existingProgramacion,
  onSuccess,

}) => {
  const { mutate: createProgramacion, isLoading: isLoadingProgramacion } = useCrearProgramacion() as any;
  const { mutate: actualizarAsignacion, isLoading: isLoadingAsignacion } = useActualizarAsignacion() as any;

  const [formData, setFormData] = useState<Partial<LocalProgramacion>>({
    fk_id_asignacionActividades: asignacionId,
    fecha_realizada: existingProgramacion?.fecha_realizada || '',
    duracion: existingProgramacion?.duracion || undefined,
    img: existingProgramacion?.img || null,
    estado: existingProgramacion?.estado || 'Completada',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isCompleted = existingProgramacion?.estado === 'Completada';

  useEffect(() => {
    if (existingProgramacion) {
      setFormData({
        ...existingProgramacion,
        fk_id_asignacionActividades: asignacionId,
        img: existingProgramacion.img || null,
      });
    } else {
      setFormData((prev) => ({ ...prev, fk_id_asignacionActividades: asignacionId }));
    }
  }, [existingProgramacion, asignacionId]);

  useEffect(() => {
    if (formData.img instanceof File) {
      const url = URL.createObjectURL(formData.img);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof formData.img === 'string') {
      setPreviewUrl(formData.img);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.img]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (isCompleted) {
      showToast({
        title: 'Acción no permitida',
        description: 'No se puede editar una asignación ya finalizada.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'img' && files) {
      setFormData((prev) => ({ ...prev, img: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (
      !formData.fecha_realizada ||
      !formData.duracion ||
      Number(formData.duracion) <= 0 ||
      !formData.img
    ) {
      return 'Todos los campos son obligatorios';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCompleted) {
      showToast({
        title: 'Acción no permitida',
        description: 'No se puede editar una asignación ya finalizada.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      showToast({
        title: 'Error al crear programación',
        description: validationError,
        timeout: 3000,
        variant: 'error',
      });
      return;
    }

    if (typeof asignacionId === 'undefined' || asignacionId === null) {
      showToast({
        title: 'Error al crear programación',
        description: 'ID de asignación no proporcionado. Asegúrate de que el componente padre pase un ID válido.',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('estado', formData.estado || 'Completada');
    formDataToSend.append('fecha_realizada', formData.fecha_realizada || '');
    formDataToSend.append('duracion', String(formData.duracion || ''));
    formDataToSend.append('fk_id_asignacionActividades', asignacionId.toString());
    if (formData.img instanceof File) {
      formDataToSend.append('img', formData.img);
    }

    try {
      await createProgramacion(formDataToSend, {
        onSuccess: async () => {
          await actualizarAsignacion(
            {
              id: asignacionId,
              estado: 'Completada',
            },
            {
              onSuccess: () => {
                showToast({
                  title: 'Actividad finalizada con éxito',
                  timeout: 3000,
                  variant: 'success',
                });
                onSuccess();
              },
              onError: () => {
                showToast({
                  title: 'Error al actualizar asignación',
                  description: 'Por favor, intenta de nuevo.',
                  timeout: 3000,
                  variant: 'error',
                });
              },
            }
          );
        },
        onError: () => {
          showToast({
            title: 'Error al crear programación',
            description: 'Por favor, intenta de nuevo.',
            timeout: 3000,
            variant: 'error',
          });
        },
      });
    } catch {
      showToast({
        title: 'Error al crear programación',
        description: 'Error inesperado al crear la programación.',
        timeout: 3000,
        variant: 'error',
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">(Finalizar Asignación)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fecha_realizada" className="block text-sm font-medium text-gray-700">
            Fecha Realizada
          </label>
          <input
            type="date"
            id="fecha_realizada"
            name="fecha_realizada"
            value={formData.fecha_realizada || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            id="duracion"
            name="duracion"
            value={formData.duracion || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="img" className="block text-sm font-medium text-gray-700">
            Imagen
          </label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            accept="image/*"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
        <div className="flex justify-center space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-white text-green-700 rounded-md hover:bg-green-700 hover:text-white border border-green-700"
            disabled={isLoadingProgramacion || isLoadingAsignacion}
          >
            {isLoadingProgramacion || isLoadingAsignacion ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearProgramacion;