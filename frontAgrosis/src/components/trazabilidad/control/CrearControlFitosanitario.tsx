import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import Formulario from '../../globales/Formulario';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { usePea } from '@/hooks/trazabilidad/pea/usePea';
import { useInsumo } from '@/hooks/inventario/insumos/useInsumo';
import { useUsuarios } from '@/hooks/usuarios/usuario/useUsuarios';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';
import CrearCultivo from '../cultivos/CrearCultivos';
import CrearPea from '../peas/CrearPea'; 
import CrearInsumo from '../../inventario/insumos/CrearInsumos'; 
import CrearUsuario from '../../usuarios/usuario/crearUsuario'; 

interface CrearControlFitosanitarioProps {
  onSuccess: () => void;
}

const CrearControlFitosanitario = ({ onSuccess }: CrearControlFitosanitarioProps) => {
  const mutation = useCrearControlFitosanitario();
  const { data: cultivos = [], isLoading: isLoadingCultivos, refetch: refetchCultivos } = useCultivo();
  const { data: peas = [], isLoading: isLoadingPeas, refetch: refetchPeas } = usePea();
  const { data: insumos = [], isLoading: isLoadingInsumos, refetch: refetchInsumos } = useInsumo();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: errorUsuarios, refetch: refetchUsuarios } = useUsuarios();

  const [mostrarModalCultivo, setMostrarModalCultivo] = useState(false);
  const [mostrarModalPea, setMostrarModalPea] = useState(false);
  const [mostrarModalInsumo, setMostrarModalInsumo] = useState(false);
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);

  console.log("Usuarios recibidos:", usuarios);
  if (errorUsuarios) {
    console.error("Error al cargar usuarios:", errorUsuarios);
  }

  const tipoControlOptions = [
    { value: 'Control Biologico', label: 'Control Biologico' },
    { value: 'Control Fisico', label: 'Control Fisico' },
    { value: 'Control Quimico', label: 'Control Quimico' },
    { value: 'Control Cultural', label: 'Control Cultural' },
    { value: 'Control Genetico', label: 'Control Genetico' },
  ];

  const cultivoOptions = cultivos.map((cultivo) => ({
    value: String(cultivo.id),
    label: cultivo.nombre_cultivo,
  }));

  const peaOptions = peas.map((pea) => ({
    value: String(pea.id),
    label: pea.nombre_pea,
  }));

  const insumoOptions = insumos.map((insumo) => ({
    value: String(insumo.id),
    label: insumo.nombre,
  }));

  const usuarioOptions = usuarios.length > 0
    ? usuarios.map((usuario) => ({
        value: String(usuario.id),
        label: `${usuario.identificacion} ${usuario.nombre}`,
      }))
    : [{ value: '', label: 'No hay usuarios disponibles' }];

  const formFields = [
    { id: 'fecha_control', label: 'Fecha del Control', type: 'date', required: true },
    { id: 'duracion', label: 'Duración (minutos)', type: 'number', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'text', required: true },
    { id: 'tipo_control', label: 'Tipo de Control', type: 'select', options: tipoControlOptions, required: true },
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo',
      type: 'select',
      options: cultivoOptions,
      required: true,
      hasExtraButton: true,
      extraButtonText: 'Crear Cultivo',
      onExtraButtonClick: () => setMostrarModalCultivo(true),
    },
    {
      id: 'fk_id_pea',
      label: 'PEA',
      type: 'select',
      options: peaOptions,
      required: true,
      hasExtraButton: true,
      extraButtonText: 'Crear PEA',
      onExtraButtonClick: () => setMostrarModalPea(true),
    },
    {
      id: 'fk_id_insumo',
      label: 'Insumo',
      type: 'select',
      options: insumoOptions,
      required: true,
      hasExtraButton: true,
      extraButtonText: 'Crear Insumo',
      onExtraButtonClick: () => setMostrarModalInsumo(true),
    },
    {
      id: 'cantidad_insumo',
      label: 'Cantidad de Insumo',
      type: 'number',
      required: true,
    },
    {
      id: 'fk_identificacion',
      label: 'Usuario',
      type: 'select',
      options: usuarioOptions,
      hasExtraButton: true,
      extraButtonText: 'Crear Usuario',
      onExtraButtonClick: () => setMostrarModalUsuario(true),
    },
    { id: 'img', label: 'Imagen', type: 'file', accept: 'image/*', required: true },
  ];

  const handleControlSubmit = (formData: { [key: string]: string | File }) => {
    console.log("Datos del formulario recibidos:", formData);

    if (
      !formData.fecha_control ||
      !formData.duracion ||
      !formData.descripcion ||
      !formData.tipo_control ||
      !formData.fk_id_cultivo ||
      !formData.fk_id_pea ||
      !formData.fk_id_insumo ||
      !formData.cantidad_insumo ||
      !formData.img
    ) {
      console.error(" Los campos obligatorios no están completos:", formData);
      return;
    }

    const nuevoControl = {
      fecha_control: new Date(formData.fecha_control as string).toISOString().split('T')[0],
      duracion: Number(formData.duracion),
      descripcion: (formData.descripcion as string).trim(),
      tipo_control: formData.tipo_control as string,
      fk_id_cultivo: Number(formData.fk_id_cultivo),
      fk_id_pea: Number(formData.fk_id_pea),
      fk_id_insumo: Number(formData.fk_id_insumo),
      cantidad_insumo: Number(formData.cantidad_insumo),
      fk_identificacion: formData.fk_identificacion ? Number(formData.fk_identificacion) : null,
      img: formData.img as File,
    };

    console.log("🚀 Enviando control fitosanitario al backend:", nuevoControl);

    mutation.mutate(nuevoControl, {
      onSuccess: () => {
        console.log("✅ Control fitosanitario creado exitosamente");
        onSuccess();
      },
      onError: (error) => {
        console.error("❌ Error al crear control fitosanitario:", error.message);
      },
    });
  };

  const cerrarYActualizar = async () => {
    setMostrarModalCultivo(false);
    setMostrarModalPea(false);
    setMostrarModalInsumo(false);
    setMostrarModalUsuario(false);
    await Promise.all([
      refetchCultivos(),
      refetchPeas(),
      refetchInsumos(),
      refetchUsuarios(),
    ]);
  };

  if (isLoadingCultivos || isLoadingPeas || isLoadingInsumos || isLoadingUsuarios) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (errorUsuarios) {
    return <div className="text-red-500">Error al cargar usuarios: {errorUsuarios.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario 
        fields={formFields}
        onSubmit={handleControlSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo Control Fitosanitario"
        multipart={true}
      />

      <VentanaModal
        isOpen={mostrarModalCultivo}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearCultivo onSuccess={cerrarYActualizar} />}
      />

      <VentanaModal
        isOpen={mostrarModalPea}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearPea onSuccess={cerrarYActualizar} />}
      />

      <VentanaModal
        isOpen={mostrarModalInsumo}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearInsumo onSuccess={cerrarYActualizar} />}
      />

      <VentanaModal
        isOpen={mostrarModalUsuario}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearUsuario onSuccess={cerrarYActualizar} />}
      />
    </div>
  );
};

export default CrearControlFitosanitario;