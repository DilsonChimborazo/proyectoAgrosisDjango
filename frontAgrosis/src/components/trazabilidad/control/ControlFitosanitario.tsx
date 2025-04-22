import { useState } from 'react';
import { useControlFitosanitario } from '../../../hooks/trazabilidad/control/useControlFitosanitario';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearControlFitosanitario from './CrearControlFitosanitario';
import ActualizarControlFitosanitario from './ActualizarControlFitosanitario';

const ControlFitosanitario = () => {
  const { data: controles, isLoading, error, refetch: refetchControles } = useControlFitosanitario();
  const [selectedControl, setSelectedControl] = useState<null | object>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null); 

  const openModalHandler = (control: object, type: "details" | "update") => {
    setSelectedControl(control);
    setModalType(type);

    if (type === "details") {
      setModalContenido(null);
    } else if (type === "update" && "id" in control) {
      setModalContenido(
        <ActualizarControlFitosanitario
          id={(control as any).id}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedControl(null);
    setModalType("create");
    setModalContenido(<CrearControlFitosanitario onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedControl(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetchControles();
    closeModal();
  };

  const handleRowClick = (control: { id: number }) => {
    const originalControl = controles?.find((c: any) => c.id === control.id);
    if (originalControl) {
      openModalHandler(originalControl, "details");
    }
  };

  const handleUpdateClick = (control: { id: number }) => {
    const originalControl = controles?.find((c: any) => c.id === control.id);
    if (originalControl) {
      openModalHandler(originalControl, "update");
    }
  };

  if (isLoading) return <div>Cargando Controles Fitosanitarios...</div>;
  if (error instanceof Error) return <div>Error al cargar los controles: {error.message}</div>;

  const controlesList = Array.isArray(controles) ? controles : [];

  const mappedControles = controlesList.map((control: any) => ({
    id: control.id,
    fecha_control: new Date(control.fecha_control).toLocaleDateString(),
    duracion: control.duracion,
    descripcion: control.descripcion,
    tipo_control: control.tipo_control,
    cultivo: control.fk_id_cultivo ? control.fk_id_cultivo.nombre_cultivo : "Sin cultivo",
    pea: control.fk_id_pea ? control.fk_id_pea.nombre_pea : "Sin PEA",
    insumo: control.fk_id_insumo ? control.fk_id_insumo.nombre : "Sin insumo",
    cantidad_insumo: control.cantidad_insumo,
    usuario: control.fk_identificacion ? control.fk_identificacion.identificacion : "Sin usuario",
    img: control.img ? (
      <img
        src={control.img || '/placeholder.png'}
        alt="Imagen del control"
        className="min-w-[3rem] w-12 h-12 rounded-full object-cover mx-auto cursor-pointer hover:scale-105 transition-transform"
        onClick={() => control.img && setImagenAmpliada(control.img)}
      />

    ) : "Sin imagen"
  }));

  const headers = [
    'ID',
    'Fecha Control',
    'Duracion',
    'Descripcion',
    'Tipo Control',
    'Cultivo',
    'PEA',
    'Insumo',
    'Cantidad Insumo',
    'Usuario',
    'img'
  ];

  return (
    <div className="overflow-x-auto rounded-lg">
      <Tabla
        title="Controles Fitosanitarios"
        headers={headers}
        data={mappedControles}
        onClickAction={handleRowClick}
        onUpdate={handleUpdateClick}
        onCreate={openCreateModal}
        rowsPerPageOptions={[5, 10, 20, 50, 100]} 
        createButtonTitle="Crear"
      />

      {isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo={
            modalType === "details"
              ? "Detalles del Control Fitosanitario"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedControl ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {(selectedControl as any).id}</p>
                <p>
                  <strong>Fecha Control:</strong>{" "}
                  {new Date((selectedControl as any).fecha_control).toLocaleDateString()}
                </p>
                <p><strong>Duración:</strong> {(selectedControl as any).duracion || "0"} minutos</p>
                <p><strong>Descripción:</strong> {(selectedControl as any).descripcion || "Sin descripción"}</p>
                <p><strong>Tipo Control:</strong> {(selectedControl as any).tipo_control || "Sin tipo"}</p>
                <p>
                  <strong>Cultivo:</strong>{" "}
                  {(selectedControl as any).fk_id_cultivo?.nombre_cultivo || "Sin cultivo"}
                </p>
                <p>
                  <strong>PEA:</strong>{" "}
                  {(selectedControl as any).fk_id_pea?.nombre_pea || "Sin PEA"}
                </p>
                <p>
                  <strong>Insumo:</strong>{" "}
                  {(selectedControl as any).fk_id_insumo?.nombre || "Sin insumo"}
                </p>
                <p>
                  <strong>Cantidad Insumo:</strong>{" "}
                  {(selectedControl as any).cantidad_insumo || "0"}
                </p>
                <p>
                  <strong>Usuario:</strong>{" "}
                  {(selectedControl as any).fk_identificacion?.nombre || "Sin usuario"}
                </p>
                {(selectedControl as any).img && (
                  <p className="col-span-2">
                    <strong>Imagen:</strong><br />
                    <img
                      src={(selectedControl as any).img}
                      alt="Control Fitosanitario"
                      className="w-48 h-48 object-cover mt-2 rounded cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setImagenAmpliada((selectedControl as any).img)}
                    />
                  </p>
                )}
              </div>
            ) : (
              modalContenido
            )
          }
        />
      )}

      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={imagenAmpliada}
            alt="Imagen ampliada"
            className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};

export default ControlFitosanitario;
