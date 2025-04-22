import { useState, useEffect } from "react";
import { Pencil } from 'lucide-react';

import { useBodega } from "@/hooks/inventario/bodega/useBodega";
import { useHerramientas } from "@/hooks/inventario/herramientas/useHerramientas";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";

import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";

import CrearHerramientas from "../herramientas/CrearHerramientas";
import ActualizarHerramienta from "../herramientas/ActualizarHerramientas";

import CrearInsumos from "../insumos/CrearInsumos";
// import ActualizarInsumos from "../insumos/ActualizarInsumos";


import RegistrarSalidaBodega from "./CrearBodega";
import { useAsignacion } from "@/hooks/trazabilidad/asignacion/useAsignacion";



const SafeImage = ({ src, alt, className, placeholderText = 'Sin imagen' }: { 
    src: string | null | undefined, 
    alt: string, 
    className: string,
    placeholderText?: string 
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    const getImageUrl = (imgPath: string | null | undefined): string | null => {
        if (!imgPath) return null;
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;

        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const cleanPath = imgPath.replace(/^\/+/, '');
        return `${baseUrl}/${cleanPath}`;
    };

    useEffect(() => {
        if (src) {
            const url = getImageUrl(src);
            if (url) {
                const img = new Image();
                img.src = url;
                img.onload = () => setImageSrc(url);
                img.onerror = () => setHasError(true);
            } else {
                setHasError(true);
            }
        } else {
            setHasError(true);
        }
    }, [src]);

    if (hasError || !imageSrc) {
        return (
            <div className={`${className} bg-gray-200 flex items-center justify-center`}>
                <span className="text-xs text-gray-500">{placeholderText}</span>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
};

const ListarBodega = () => {
    const { data: bodega, refetch: refetchBodega } = useBodega();  
    const { data: herramientas, refetch: refetchHerramientas } = useHerramientas();
    const { data: insumos, refetch: refetchInsumos } = useInsumo();
    const { data: asignaciones, refetch: refetchAsignacion } = useAsignacion();


    const [selectedMovimiento, setSelectedMovimiento] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tipoSeleccionado, setTipoSeleccionado] = useState<'Herramienta' | 'Insumo'>('Herramienta');
    const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);


    const handleRowClick = (movimiento: any) => {
        const id = movimiento.id;
        if (!id) {
            console.error("ID no encontrado");
            return;
        }

        setSelectedMovimiento(movimiento);

        if (tipoSeleccionado === "Herramienta") {
            setModalContenido(<ActualizarHerramienta id={id} onSuccess={closeModal} />);
        } else {
            // setModalContenido(<ActualizarInsumos id={id} onSuccess={closeModal} />);
        }

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMovimiento(null);
        setModalContenido(null);
        setIsModalOpen(false);
    };

    const handleCreate = () => {
        setModalContenido(<RegistrarSalidaBodega 
            herramientas={herramientas || []}
            insumos={insumos || []}
            asignaciones={asignaciones || []}
            onSuccess={handleNewEntry}
        />);
        setIsModalOpen(true); 
    };

    const handleNewEntry = () => {
        refetchHerramientas();
        refetchInsumos();
        refetchBodega();
        refetchAsignacion();
        closeModal();
    };

    const agregarASeleccionados = () => {
        if (tipoSeleccionado === "Herramienta") {
            setModalContenido(<CrearHerramientas onSuccess={handleNewEntry} />);
        } else {
            setModalContenido(<CrearInsumos onSuccess={handleNewEntry} />);
        }
        setIsModalOpen(true);
    };

    const items = tipoSeleccionado === 'Herramienta' ? herramientas : insumos;

    const filteredBodega = bodega?.filter((item) =>
        tipoSeleccionado === "Herramienta"
            ? item.fk_id_herramientas
            : item.fk_id_insumo
    );

    const mappedBodega = filteredBodega?.map((item) => {
        const movimiento = item.movimiento;
        const colorMovimiento =
            movimiento === "Entrada"
                ? "text-green-700 font-bold"
                : movimiento === "Salida"
                ? "text-red-700 font-bold"
                : "text-gray-700";

        return {
            id: item.id,
            herramienta: item.fk_id_herramientas?.nombre_h ?? "Sin herramienta",
            insumo: item.fk_id_insumo?.nombre ?? "Sin insumo",
            asignacion: item.fk_id_asignacion?.estado ?? "Sin asignación",
            cantidad: item.cantidad,
            fecha: new Date(item.fecha).toLocaleDateString(),
            movimiento: <span className={colorMovimiento}>{movimiento}</span>,
        };
    }) || [];

    return (
        <div className="p-4 space-y-6">
            <VentanaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                titulo=""
                contenido={modalContenido}
            />

            <div className="flex p-2 bg-white rounded-2xl py-6 mx-5">
                <div className="bg-white w-1/5">
                    <label className="font-bold mr-2">Seleccionar tipo:</label>
                    <select
                        value={tipoSeleccionado}
                        onChange={(e) => setTipoSeleccionado(e.target.value as 'Herramienta' | 'Insumo')}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="Herramienta">Herramienta</option>
                        <option value="Insumo">Insumo</option>
                    </select>
                    <button
                        title="Crear"
                        onClick={agregarASeleccionados}
                        className="bg-green-700 text-white px-3 font-bold py-1 rounded hover:bg-green-900 mx-2 mt-2"
                    >
                        +
                    </button>
                </div>

                <div className="grid grid-cols-4 ml-6 w-4/5 bg-white gap-4">
                    {items?.map((item) => (
                        <div key={item.id} className="border shadow-lg rounded p-3 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                {tipoSeleccionado === 'Insumo' && 'img' in item && (
                                    <SafeImage 
                                        src={item.img}
                                        alt={`Imagen de cada insumo`}
                                        className="w-12 h-12 object-cover rounded-full"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">
                                        {"nombre_h" in item ? item.nombre_h : item.nombre}
                                    </p>
                                    <p>Cantidad: {item.cantidad}</p>
                                    {"fecha_vencimiento" in item && item.fecha_vencimiento && (
                                        <p>Vence: {new Date(item.fecha_vencimiento).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => handleRowClick(item)}
                                    className="absolute bottom-0 right-0 px-1 py-1 rounded"
                                >
                                    <Pencil size={25} color="white" className="bg-green-700 hover:bg-green-900 p-1 rounded-md" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Tabla
                title="Movimientos de Bodega"
                headers={["ID", "Herramienta", "Insumo", "Asignación", "Cantidad", "Fecha", "Movimiento"]}
                data={mappedBodega}
                onClickAction={handleRowClick}
                onUpdate={selectedMovimiento}
                onCreate={handleCreate}
                createButtonTitle="Registrar Movimiento"
            />
        </div>
    );
};

export default ListarBodega;
