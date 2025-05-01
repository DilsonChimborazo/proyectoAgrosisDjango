import { useState, useEffect } from 'react';
import { useEras } from '../../../hooks/iot/eras/useEras';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import CrearEras from './CrearEras';
import EditarEras from './EditarEras';
import Switch from 'react-switch';
import { useNavigate } from 'react-router-dom';

const Eras = () => {
    const { data: eras, isLoading, error, refetch } = useEras();
    const [selectedEra, setSelectedEra] = useState<any | null>(null);
    const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
    const [esAdministrador, setEsAdministrador] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const navigate = useNavigate();

    // Verificar si el usuario es administrador
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("user");
        const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
        setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
    }, []);

    const handleToggleStatus = async (era: any) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMensaje('Debes iniciar sesión para realizar esta acción.');
            setTimeout(() => {
                setMensaje(null);
                navigate('/login');
            }, 3000);
            return;
        }

        const action = era.estado ? "desactivar" : "activar";
        const url = `http://localhost:8000/api/eras/${era.id}/${action}/`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al ${action} la era`);
            }

            refetch();
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            
            setTimeout(() => setMensaje(null), 3000);
            console.error(`Error al ${action} la era:`, error);
        }
    };

    const openModalHandler = (era: object, type: "details" | "update") => {
        setSelectedEra(era);
        setModalType(type);

        if (type === "details") {
            setModalContenido(null);
        } else if (type === "update" && "id" in era) {
            setModalContenido(
                <EditarEras
                    id={(era as any).id.toString()}
                    onSuccess={handleSuccess}
                />
            );
        }

        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        if (!esAdministrador) {
            setMensaje("No tienes permisos para crear eras.");
            setTimeout(() => setMensaje(null), 3000);
            return;
        }
        setSelectedEra(null);
        setModalType("create");
        setModalContenido(<CrearEras onSuccess={handleSuccess} />);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEra(null);
        setModalType(null);
        setModalContenido(null);
        setIsModalOpen(false);
    };

    const handleSuccess = () => {
        refetch();
        closeModal();
    };

    const handleRowClick = (era: { id: number }) => {
        const originalEra = eras?.find((e: any) => e.id === era.id);
        if (originalEra) {
            openModalHandler(originalEra, "details");
        }
    };

    const handleUpdateClick = (era: { id: number }) => {
        if (!esAdministrador) {
            setMensaje("No tienes permisos para editar eras.");
            setTimeout(() => setMensaje(null), 3000);
            return;
        }
        const originalEra = eras?.find((e: any) => e.id === era.id);
        if (originalEra) {
            openModalHandler(originalEra, "update");
        }
    };

    const headers = ['ID', 'Nombre', 'Descripcion', 'Lote', 'Estado'];

    if (isLoading) return <div>Cargando eras...</div>;
    if (error instanceof Error) {
        return (
            <div>
                Error al cargar eras: {error.message}
                {error.message.includes('inicia sesión') && (
                    <button
                        onClick={() => navigate('/login')}
                        className="ml-4 text-blue-600 hover:underline"
                    >
                        Iniciar sesión
                    </button>
                )}
            </div>
        );
    }

    const erasList = Array.isArray(eras) ? eras : [];

    const mappedEras = erasList.map((item) => ({
        id: item.id,
        nombre: item.nombre || 'Sin nombre',
        descripcion: item.descripcion || '-',
        lote: item.fk_id_lote?.nombre_lote || 'Sin nombre de lote',
        estado: esAdministrador ? (
            <Switch
                onChange={() => handleToggleStatus(item)}
                checked={item.estado}
                onColor="#2563EB"
                offColor="#D1D5DB"
                uncheckedIcon={false}
                checkedIcon={false}
                height={20}
                width={40}
                handleDiameter={16}
            />
        ) : (
            <span className="text-sm text-gray-500">
                {item.estado ? "Activo" : "Inactivo"}
            </span>
        ),
    }));

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            {mensaje && (
                <div className="mb-2 p-2 bg-yellow-500 text-white text-center rounded-md">
                    {mensaje}
                </div>
            )}
            <Tabla
                title="Eras Registradas"
                headers={headers}
                data={mappedEras}
                onClickAction={handleRowClick}
                onUpdate={handleUpdateClick}
                onCreate={openCreateModal}
                createButtonTitle="Crear"
            />

            {isModalOpen && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo={
                        modalType === "details"
                            ? "Detalles de la Era"
                            : modalType === "create"
                            ? ""
                            : ""
                    }
                    contenido={
                        modalType === "details" && selectedEra ? (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>ID:</strong> {selectedEra.id}</p>
                                <p><strong>Nombre:</strong> {selectedEra.nombre || "Sin nombre"}</p>
                                <p><strong>Descripción:</strong> {selectedEra.descripcion || "-"}</p>
                                <p><strong>Lote:</strong> {selectedEra.fk_id_lote?.nombre_lote || "Sin nombre de lote"}</p>
                                <p><strong>Estado:</strong> {selectedEra.estado ? "Activo" : "Inactivo"}</p>
                            </div>
                        ) : (
                            modalContenido
                        )
                    }
                />
            )}
        </div>
    );
};

export default Eras;