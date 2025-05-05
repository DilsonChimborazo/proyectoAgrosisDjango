import { useState, useEffect } from "react";
import { Pencil, Hammer, TestTube2, List, MoveRight, Plus, PackagePlus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

// Componentes
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import CrearHerramientas from "../herramientas/CrearHerramientas";
import ActualizarHerramienta from "../herramientas/ActualizarHerramientas";
import CrearInsumos from "../insumos/CrearInsumos";
import RegistrarSalidaBodega from "./CrearBodega";

// Hooks
import { useHerramientas } from "@/hooks/inventario/herramientas/useHerramientas";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";
import { useAsignacion } from "@/hooks/trazabilidad/asignacion/useAsignacion";
import { useInsumoCompuesto } from '@/hooks/inventario/insumocompuesto/useInsumoCompuesto';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces 
interface UnidadMedida {
    id: number;
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';
    factor_conversion: number;
}

interface Herramienta {
    id: number;
    nombre_h: string;
    cantidad_herramienta: number;
    estado: 'Disponible' | 'Prestado' | 'En reparacion';
}

interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    precio_por_base: number;
    cantidad_en_base: string | null; 
    cantidad_insumo: number | null;
    fecha_vencimiento: string;
    img: string | null | undefined;
    fk_unidad_medida: UnidadMedida;
}

interface Asignacion {
    id: number;
    estado: string;
    fecha_programada: string;
    observaciones: string;
    fk_id_realiza: number | null;
    fk_identificacion: number | null;
}

interface MovimientoBodega {
    id: number;
    fk_id_herramientas: Herramienta | null;
    fk_id_insumo: Insumo | null;
    fk_id_asignacion: Asignacion | null;
    cantidad_herramienta: number;
    cantidad_insumo: number;
    fecha: string;
    movimiento: 'Entrada' | 'Salida';
    fk_unidad_medida: UnidadMedida | null;
    cantidad_en_base: number | null;
    costo_insumo: number | null;
}

interface DetalleInsumoCompuesto {
    id: number;
    cantidad_utilizada: number;
    insumo: Insumo; 
}

interface InsumoCompuesto {
    id: number;
    nombre: string;
    fk_unidad_medida: UnidadMedida | null;
    unidad_medida_info: UnidadMedida | null;
    precio_unidad: number | null;
    detalles: DetalleInsumoCompuesto[];
    cantidad_insumo?: number;
    nombre_h?: never;
}

// Type guards
function isHerramienta(item: Herramienta | Insumo | InsumoCompuesto): item is Herramienta {
    return 'nombre_h' in item && !('detalles' in item);
}

function isInsumo(item: Herramienta | Insumo | InsumoCompuesto): item is Insumo {
    return 'nombre' in item && !('detalles' in item);
}

function isInsumoCompuesto(item: Herramienta | Insumo | InsumoCompuesto): item is InsumoCompuesto {
    return 'detalles' in item;
}

// Componente SafeImage
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
        return `${apiUrl}/${imgPath.replace(/^\/+/, '')}`;
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

    return <img src={imageSrc} alt={alt} className={className} onError={() => setHasError(true)} />;
};

const DetalleItemModal = ({ item, tipo }: { 
    item: Herramienta | Insumo | InsumoCompuesto, 
    tipo: 'Herramienta' | 'Insumo', 
    onClose: () => void 
}) => {
    const esInsumoCompuesto = isInsumoCompuesto(item);
    
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {esInsumoCompuesto ? 'Detalles del Insumo Compuesto' : `Detalles del ${tipo}`}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    {!esInsumoCompuesto && isInsumo(item) && item.img && (
                        <SafeImage 
                            src={item.img}
                            alt={`Imagen de ${item.nombre}`}
                            className="w-full h-48 object-contain rounded-lg"
                        />
                    )}
                </div>
                
                <div className="col-span-1 space-y-3">
                    <p><span className="font-semibold">Nombre:</span> {
                        isHerramienta(item) ? item.nombre_h : 
                        isInsumo(item) ? item.nombre : 
                        item.nombre
                    }</p>
                    
                    <p><span className="font-semibold">Cantidad:</span> {
                        isHerramienta(item) ? item.cantidad_herramienta :
                        isInsumo(item) ? item.cantidad_insumo :
                        item.cantidad_insumo ?? 'N/A'
                    }</p>
                    
                    {esInsumoCompuesto && item.unidad_medida_info && (
                        <p>
                            <span className="font-semibold">Unidad de medida:</span> 
                            {` ${item.unidad_medida_info.nombre_medida} (${item.unidad_medida_info.unidad_base})`}
                        </p>
                    )}
                    
                    {isInsumo(item) && item.fecha_vencimiento && (
                        <p><span className="font-semibold">Fecha de vencimiento:</span> {new Date(item.fecha_vencimiento).toLocaleDateString()}</p>
                    )}
                    
                    {isInsumo(item) && item.fk_unidad_medida && (
                        <p><span className="font-semibold">Unidad de medida:</span> {item.fk_unidad_medida.nombre_medida}</p>
                    )}
                    
                    {isHerramienta(item) && item.estado && (
                        <p><span className="font-semibold">Estado:</span> {item.estado}</p>
                    )}
                    
                    {esInsumoCompuesto && (
                        <div>
                            <p className="font-semibold">Componentes:</p>
                            <ul className="list-disc list-inside pl-2 space-y-1">
                                {item.detalles.map((detalle) => (
                                    <li key={detalle.id}>
                                        {detalle.insumo?.nombre || 'Insumo desconocido'} - {detalle.cantidad_utilizada} {detalle.insumo?.fk_unidad_medida?.unidad_base || ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const useMovimientosBodega = () => {
    return useQuery<MovimientoBodega[], Error>({
        queryKey: ['movimientosBodega'],
        queryFn: async () => {
            const { data } = await axios.get(`${apiUrl}bodega/`);
            return data;
        },
        gcTime: 1000 * 60 * 10,
    });
};

const ListarBodega = () => {
    const { data: movimientos, refetch: refetchMovimientos } = useMovimientosBodega();
    const { data: herramientas, refetch: refetchHerramientas } = useHerramientas();
    const { data: insumos, refetch: refetchInsumos } = useInsumo();
    const { data: asignaciones, refetch: refetchAsignacion } = useAsignacion();
    const { data: insumosCompuestos } = useInsumoCompuesto();

    const [, setSelectedMovimiento] = useState<MovimientoBodega | null>(null);
    const [selectedItem, setSelectedItem] = useState<Herramienta | Insumo | InsumoCompuesto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [tipoSeleccionado, setTipoSeleccionado] = useState<'Herramienta' | 'Insumo'>('Herramienta');
    const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
    const [viewMode, setViewMode] = useState<'items' | 'movimientos'>('items');
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [terminoDebounced] = useDebounce(terminoBusqueda, 300);
    const [filtroInsumo, setFiltroInsumo] = useState<'todos' | 'normales' | 'compuestos'>('todos');

    const handleRowClick = (movimiento: MovimientoBodega) => {
        setSelectedMovimiento(movimiento);

        if (tipoSeleccionado === "Herramienta" && movimiento.fk_id_herramientas) {
            setModalContenido(
                <ActualizarHerramienta 
                    id={movimiento.fk_id_herramientas.id} 
                    onSuccess={() => {
                        refetchHerramientas();
                        refetchMovimientos();
                        closeModal();       
                    }}
                />
            );
        }
        setIsModalOpen(true);
    };

    const handleItemClick = (item: Herramienta | Insumo | InsumoCompuesto) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMovimiento(null);
        setSelectedItem(null);
        setModalContenido(null);
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
    };

    const handleCreateMovimiento = () => {
        setModalContenido(
            <RegistrarSalidaBodega 
                herramientas={herramientas || []}
                insumos={insumos || []}
                asignaciones={asignaciones || []}
                onSuccess={() => {
                    refetchHerramientas();
                    refetchInsumos();
                    refetchMovimientos();
                    refetchAsignacion();
                    closeModal();
                }}
            />
        );
        setIsModalOpen(true); 
    };

    const handleCreateItem = () => {
        if (tipoSeleccionado === "Herramienta") {
            setModalContenido(
                <CrearHerramientas 
                    onSuccess={() => {
                        refetchHerramientas();
                        closeModal();
                    }} 
                />
            );
        } else {
            setModalContenido(
                <CrearInsumos 
                    onSuccess={() => {
                        refetchInsumos();
                        closeModal();
                    }} 
                />
            );
        }
        setIsModalOpen(true);
    };

    const filtrarItems = (items: (Herramienta | Insumo)[]) => {
        if (!terminoDebounced) return items || [];
        
        return items.filter(item => {
            const nombre = isHerramienta(item) ? item.nombre_h : item.nombre;
            const tipo = isInsumo(item) ? item.tipo : '';
            return (
                nombre?.toLowerCase().includes(terminoDebounced.toLowerCase()) ||
                tipo?.toLowerCase().includes(terminoDebounced.toLowerCase())
            );
        });
    };

    const filteredMovimientos = movimientos?.filter(item =>
        tipoSeleccionado === "Herramienta" 
            ? item.fk_id_herramientas !== null 
            : item.fk_id_insumo !== null
    );
    
    // Depuración: Verificar los datos originales y filtrados
    console.log("Datos originales de movimientos:", movimientos);
    console.log("Movimientos filtrados:", filteredMovimientos);
    
    const mappedMovimientos = filteredMovimientos?.map(item => {
        // Extraer el nombre según el tipo seleccionado
        const nombreHerramienta = item.fk_id_herramientas?.nombre_h || "N/A";
        const nombreInsumo = item.fk_id_insumo?.nombre || "N/A";
        const nombre = tipoSeleccionado === "Herramienta" ? nombreHerramienta : nombreInsumo;
    
        // Depuración: Verificar qué nombre se está mapeando
        console.log(`ID ${item.id} - Nombre mapeado: ${nombre} (Tipo: ${tipoSeleccionado})`);
    
        const movimiento = item.movimiento;
        const colorMovimiento = movimiento === "Entrada" 
            ? "text-green-700 font-bold" 
            : "text-red-700 font-bold";
    
        const cantidad = item.cantidad_herramienta ?? item.cantidad_insumo ?? 0;
        let bgCantidad = "bg-gray-300 text-black font-bold rounded px-2";
        if (cantidad < 10) bgCantidad = "bg-red-300 text-red-900 font-bold rounded px-2";
        else if (cantidad >= 10) bgCantidad = "bg-green-300 text-green-900 font-bold rounded px-2";
    
        // Calcular cantidad_base como número entero con la unidad base (para insumos, si aplica)
        let cantidadBase;
        if (tipoSeleccionado === "Insumo" && item.fk_id_insumo?.cantidad_en_base) {
            cantidadBase = `${Math.round(parseFloat(item.fk_id_insumo.cantidad_en_base))} ${item.fk_id_insumo.fk_unidad_medida?.unidad_base || ''}`;
        } else if (tipoSeleccionado === "Insumo" && item.cantidad_insumo && item.fk_id_insumo?.fk_unidad_medida?.factor_conversion) {
            const factor = item.fk_id_insumo.fk_unidad_medida.factor_conversion;
            cantidadBase = `${Math.round(item.cantidad_insumo * factor)} ${item.fk_id_insumo.fk_unidad_medida?.unidad_base || ''}`;
        } else {
            cantidadBase = "No Aplica";
        }
    
        return {
            id: item.id,
            // Usar 'herramienta' o 'insumo' según el tipo seleccionado
            [tipoSeleccionado === "Herramienta" ? "herramienta" : "insumo"]: nombre,
            asignacion: item.fk_id_asignacion?.fecha_programada 
                ? new Date(item.fk_id_asignacion.fecha_programada).toLocaleDateString() 
                : "N/A",
            cantidad: <span className={bgCantidad}>{cantidad}</span>,
            unidad_medida: tipoSeleccionado === "Insumo" ? item.fk_id_insumo?.fk_unidad_medida?.nombre_medida || "No Aplica" : "No Aplica",
            cantidad_base: cantidadBase,
            costo: item.costo_insumo ? `$${(Number(item.costo_insumo)).toFixed(2)
            }` : "No Aplica",
            fecha: new Date(item.fecha).toLocaleDateString(),
            movimiento: <span className={colorMovimiento}>{movimiento}</span>,
            rawData: item
        };
    }) || [];
    
    // Depuración: Verificar los datos finales mapeados
    console.log("Datos mapeados para la tabla:", mappedMovimientos);

    
    
    const itemsFiltrados = filtrarItems(tipoSeleccionado === 'Herramienta' ? herramientas || [] : insumos || []);

    // Filtrar insumos compuestos según el término de búsqueda
    const insumosCompuestosFiltrados = insumosCompuestos?.filter(ic => 
        ic.nombre.toLowerCase().includes(terminoDebounced.toLowerCase())
    ) || [];

    return (
        <div className="p-4 mt-5 rounded-3xl space-y-6">
            <VentanaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                titulo=""
                contenido={modalContenido}
            />
            
            <VentanaModal
                isOpen={isDetailModalOpen}
                onClose={closeModal}
                titulo=""
                contenido={
                    selectedItem && (
                        <DetalleItemModal 
                            item={selectedItem} 
                            tipo={tipoSeleccionado} 
                            onClose={closeModal} 
                        />
                    )
                }
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('items')}
                            className={`flex items-center px-4 py-2 rounded-lg ${viewMode === 'items' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                        >
                            <List className="mr-2" size={18} />
                            {tipoSeleccionado === 'Herramienta' ? 'Herramientas' : 'Insumos'}
                        </button>
                        
                        <button
                            onClick={() => setViewMode('movimientos')}
                            className={`flex items-center px-4 py-2 rounded-lg ${viewMode === 'movimientos' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                        >
                            <MoveRight className="mr-2" size={18} />
                            Movimientos
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <div className="relative">
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder={`Buscar ${tipoSeleccionado === 'Herramienta' ? 'herramientas...' : 'insumos...'}`}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setTipoSeleccionado('Herramienta');
                                setTerminoBusqueda('');
                                setFiltroInsumo('todos');
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg ${tipoSeleccionado === 'Herramienta' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            <Hammer className="mr-2" size={18} />
                            Herramientas
                        </button>
                        
                        <button
                            onClick={() => {
                                setTipoSeleccionado('Insumo');
                                setTerminoBusqueda('');
                                setFiltroInsumo('todos');
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg ${tipoSeleccionado === 'Insumo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            <TestTube2 className="mr-2" size={18} />
                            Insumos
                        </button>
                    </div>

                    
                    {tipoSeleccionado === 'Insumo' && viewMode === 'items' && (
                        <div className="relative">
                            <select
                                value={filtroInsumo}
                                onChange={(e) => setFiltroInsumo(e.target.value as 'todos' | 'normales' | 'compuestos')}
                                className="appearance-none bg-white  rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2"
                            >
                                <option value="todos">Todos los insumos</option>
                                <option value="normales">Insumos normales</option>
                                <option value="compuestos">Insumos compuestos</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {viewMode === 'items' && (
                        <button
                            onClick={handleCreateItem}
                            title="Crear"
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="" size={18} />
                            Agregar {tipoSeleccionado === 'Herramienta' ? 'Herramienta' : 'Insumo'}
                        </button>
                    )}
                    
                    {viewMode === 'movimientos' && (
                        <button
                            onClick={handleCreateMovimiento}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <PackagePlus className="mr-2" size={18} />
                            Registrar Movimiento
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'items' ? (
                <div className="space-y-8">
                    {/* Sección de Herramientas/Insumos normales */}
                    {(tipoSeleccionado === 'Herramienta' || filtroInsumo !== 'compuestos') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {itemsFiltrados.length > 0 ? (
                                itemsFiltrados.map((item) => {
                                    const esHerramienta = isHerramienta(item);
                                    const esInsumo = isInsumo(item);

                                    let cantidad = 0;
                                    if (esHerramienta) {
                                        cantidad = Number(item.cantidad_herramienta) || 0;
                                    } else if (esInsumo) {
                                        cantidad = item.cantidad_insumo !== null ? Number(item.cantidad_insumo) : 0;
                                    }

                                    const fechaVencimiento = esInsumo ? item.fecha_vencimiento : null;

                                    let cantidadClass = "text-white font-bold rounded-full px-3 py-1 text-center ";
                                    if (cantidad <= 5) {
                                        cantidadClass += "bg-red-500";
                                    } else if (cantidad <= 10) {
                                        cantidadClass += "bg-yellow-500";
                                    } else {
                                        cantidadClass += "bg-green-500";
                                    }

                                    return (
                                        <div 
                                            key={item.id} 
                                            className="shadow-lg rounded-lg p-4 flex flex-col justify-between cursor-pointer bg-white hover:bg-blue-50 transition-colors hover:shadow-xl border border-gray-200"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="flex flex-col h-full">
                                                {esInsumo && item.img && (
                                                    <SafeImage 
                                                        src={item.img}
                                                        alt={`Imagen de ${item.nombre}`}
                                                        className="w-full h-32 object-contain rounded-t-lg mb-3"
                                                    />
                                                )}

                                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                                    {esHerramienta ? item.nombre_h : item.nombre}
                                                </h3>

                                                <div className="mt-2 mb-3">
                                                    <p className="text-sm text-gray-600">Cantidad en stock:</p>
                                                    <div className={cantidadClass}>
                                                        {cantidad} unidades
                                                    </div>
                                                </div>

                                                {fechaVencimiento && (
                                                    <div className="mt-auto">
                                                        <p className="text-sm text-gray-600">Vence:</p>
                                                        <p className="text-sm font-medium">
                                                            {new Date(fechaVencimiento).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const movimientoRelacionado = movimientos?.find(m => 
                                                                esHerramienta 
                                                                    ? m.fk_id_herramientas?.id === item.id 
                                                                    : m.fk_id_insumo?.id === item.id
                                                            );
                                                            if (movimientoRelacionado) {
                                                                handleRowClick(movimientoRelacionado);
                                                            }
                                                        }}
                                                        className="p-1 rounded-full hover:bg-gray-200"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} className="text-white bg-green-600 rounded-full p-1.5 w-7 h-7" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                tipoSeleccionado === 'Herramienta' || filtroInsumo !== 'compuestos' ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No se encontraron {tipoSeleccionado === 'Herramienta' ? 'herramientas' : 'insumos'} que coincidan con "{terminoDebounced}"
                                    </div>
                                ) : null
                            )}
                        </div>
                    )}

                    {/* Sección para Insumos Compuestos */}
                    {tipoSeleccionado === 'Insumo' && (filtroInsumo === 'todos' || filtroInsumo === 'compuestos') && insumosCompuestosFiltrados.length > 0 && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {insumosCompuestosFiltrados.map((insumoCompuesto) => {
                                    const cantidad = insumoCompuesto.cantidad_insumo || 0;
                                    
                                    let cantidadClass = "text-white font-bold rounded-full px-3 py-1 text-center ";
                                    if (cantidad <= 5) {
                                        cantidadClass += "bg-red-500";
                                    } else if (cantidad <= 10) {
                                        cantidadClass += "bg-yellow-500";
                                    } else {
                                        cantidadClass += "bg-green-500";
                                    }

                                    return (
                                        <div 
                                            key={insumoCompuesto.id} 
                                            className="shadow-lg rounded-lg p-4 flex flex-col justify-between cursor-pointer bg-white hover:bg-purple-50 transition-colors hover:shadow-xl border border-gray-200"
                                            onClick={() => handleItemClick(insumoCompuesto)}
                                        >
                                            <div className="flex flex-col h-full">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                                    {insumoCompuesto.nombre}
                                                </h3>

                                                <div className="mt-2 mb-3">
                                                    <p className="text-sm text-gray-600">Cantidad en stock:</p>
                                                    <div className={cantidadClass}>
                                                        {cantidad} unidades
                                                    </div>
                                                </div>

                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Lógica para editar si es necesario
                                                        }}
                                                        className="p-1 rounded-full hover:bg-gray-200"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} className="text-white bg-green-600 rounded-full p-1.5 w-7 h-7" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {tipoSeleccionado === 'Insumo' && filtroInsumo === 'compuestos' && insumosCompuestosFiltrados.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No se encontraron insumos compuestos que coincidan con "{terminoDebounced}"
                        </div>
                    )}
                </div>
            ) : (
                <Tabla
                    title={`Movimientos de ${tipoSeleccionado === 'Herramienta' ? 'Herramientas' : 'Insumos'}`}
                    headers={[
                        "ID", 
                        tipoSeleccionado === "Herramienta" ? "Herramienta" : "Insumo", 
                        "Asignación", 
                        "Cantidad", 
                        "Unidad Medida",
                        "Cantidad Base",
                        "Costo",
                        "Fecha", 
                        "Movimiento"
                    ]}
                    data={mappedMovimientos}
                    onClickAction={(item) => handleRowClick(item.rawData)}
                    onUpdate={(row) => handleRowClick(row.rawData)} 
                    onCreate={handleCreateMovimiento}
                    createButtonTitle="Registrar Movimiento"
                />
            )}
        </div>
    );
};

export default ListarBodega;