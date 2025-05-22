import { useState, useEffect } from "react";
import { useActualizarPea } from "../../../hooks/trazabilidad/pea/useActualizarPea";
import { usePeaPorId } from "../../../hooks/trazabilidad/pea/usePeaPorId";
import Formulario from "../../globales/Formulario";
import { showToast } from '@/components/globales/Toast';

interface ActualizarPea {
  id: string | number;
  onSuccess: () => void;
}

const ActualizarPea = ({ id, onSuccess }: ActualizarPea) => {
  const { data: pea, isLoading, error } = usePeaPorId(String(id));
  const actualizarPea = useActualizarPea();

  const [formData, setFormData] = useState<{ [key: string]: string }>({
    nombre_pea: "",
    descripcion: "",
    tipo_pea: "",
  });

  useEffect(() => {
    if (pea) {
      console.log("🔄 Cargando datos de la PEA:", pea);
      setFormData({
        nombre_pea: pea.nombre_pea ?? "",
        descripcion: pea.descripcion ?? "",
        tipo_pea: pea.tipo_pea ?? "",
      });
    }
  }, [pea]);

  const handleSubmit = (data: { [key: string]: string | File }) => {
    const nombre_pea = data.nombre_pea as string;
    const descripcion = data.descripcion as string;
    const tipo_pea = data.tipo_pea as string;

    const peaActualizada = {
      id: Number(id),
      nombre_pea: nombre_pea.trim(),
      descripcion: descripcion.trim(),
      tipo_pea,
    };

    console.log("🚀 Enviando PEA actualizada al backend:", peaActualizada);

    actualizarPea.mutate(peaActualizada, {
      onSuccess: () => {
        console.log("✅ PEA actualizada correctamente");
        showToast({
          title: 'PEA actualizado exitosamente',
          description: 'El PEA ha sido actualizado en el sistema.',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess(); 
      },
      onError: (error) => {
        console.error("❌ Error al actualizar PEA:", error);
        showToast({
          title: 'Error al actualizar PEA',
          description: error.message || 'No se pudo actualizar el PEA. Intenta de nuevo.',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };


  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) {
    showToast({
      title: 'Error al cargar PEA',
      description: error.message || 'No se pudo cargar la información del PEA.',
      timeout: 5000,
      variant: 'error',
    });
    return <div className="text-red-500">Error al cargar la PEA</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario 
        fields={[
          { id: 'nombre_pea', label: 'Nombre del PEA', type: 'text' },
          { id: 'descripcion', label: 'Descripción', type: 'text' },
          { 
            id: 'tipo_pea', 
            label: 'Tipo de PEA', 
            type: 'select',
            options: [
              { value: 'Plaga', label: 'Plaga' },
              { value: 'Enfermedad', label: 'Enfermedad' },
              { value: 'Arvense', label: 'Arvense' }
            ]
          },
        ]}
        onSubmit={handleSubmit}  
        isError={actualizarPea.isError} 
        isSuccess={actualizarPea.isSuccess}
        title="Actualizar PEA"
        initialValues={formData}  
        key={JSON.stringify(formData)}
      />
    </div>
  );
};

export default ActualizarPea;