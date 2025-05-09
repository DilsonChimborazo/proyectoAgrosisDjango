import { useState, useEffect, FormEvent } from "react";
import { useActualizarEspecie } from "../../../hooks/trazabilidad/especie/useActualizarEspecie";
import { useEspeciePorId } from "../../../hooks/trazabilidad/especie/useEspeciePorId";
import { useTipoCultivo } from "@/hooks/trazabilidad/tipoCultivo/useTipoCultivo";
import CrearTipoCultivo from "../tipocultivo/CrearTipoCultivo";

interface ActualizarEspecieProps {
    id: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const ActualizarEspecie = ({ id, onSuccess, onCancel }: ActualizarEspecieProps) => {
    const { data: especie, isLoading, error } = useEspeciePorId(id);
    const { mutate: actualizarEspecie, isPending } = useActualizarEspecie();
    const { data: tiposCultivo = [], refetch: refetchTiposCultivo, isLoading: isLoadingTiposCultivo } = useTipoCultivo();
    
    const [formData, setFormData] = useState({
        nombre_comun: "",
        nombre_cientifico: "",
        descripcion: "",
        fk_id_tipo_cultivo: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Cargar datos de la especie en el formulario
    useEffect(() => {
        if (especie) {
            setFormData({
                nombre_comun: especie.nombre_comun || "",
                nombre_cientifico: especie.nombre_cientifico || "",
                descripcion: especie.descripcion || "",
                fk_id_tipo_cultivo: especie.fk_id_tipo_cultivo?.toString() || "",
            });
        }
    }, [especie]);

    // Validar y enviar la actualización
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.nombre_comun || !formData.nombre_cientifico || !formData.fk_id_tipo_cultivo) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        const tipoCultivoExists = tiposCultivo.some((tipo) => tipo.id === Number(formData.fk_id_tipo_cultivo));
        if (!tipoCultivoExists) {
            setErrorMessage("El tipo de cultivo seleccionado no es válido.");
            return;
        }

        const especieActualizada = {
            id,
            nombre_comun: formData.nombre_comun.trim(),
            nombre_cientifico: formData.nombre_cientifico.trim(),
            descripcion: formData.descripcion.trim() || "",
            fk_id_tipo_cultivo: Number(formData.fk_id_tipo_cultivo),
        };

        actualizarEspecie(especieActualizada, {
            onSuccess: () => {
                console.log("✅ Especie actualizada correctamente.");
                onSuccess();
            },
            onError: (err: any) => {
                const errorDetail = err.response?.data?.detail || err.message || "Error desconocido";
                setErrorMessage(`Error al actualizar la especie: ${errorDetail}`);
            },
        });
    };

    const openCreateTipoCultivoModal = () => {
        setModalContent(<CrearTipoCultivo onSuccess={() => { setIsModalOpen(false); refetchTiposCultivo(); }} onCancel={() => setIsModalOpen(false)} />);
        setIsModalOpen(true);
    };

    if (isLoading || isLoadingTiposCultivo) {
        return <div className="text-center text-gray-500">Cargando datos...</div>;
    }
    if (error) {
        return <div className="text-center text-red-500">Error al cargar los datos de la especie.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Actualizar Especie</h2>
            {(errorMessage) && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nombre_comun" className="block text-sm font-medium text-gray-700">
                        Nombre Común
                    </label>
                    <input
                        type="text"
                        id="nombre_comun"
                        value={formData.nombre_comun}
                        onChange={(e) => setFormData({ ...formData, nombre_comun: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label htmlFor="nombre_cientifico" className="block text-sm font-medium text-gray-700">
                        Nombre Científico
                    </label>
                    <input
                        type="text"
                        id="nombre_cientifico"
                        value={formData.nombre_cientifico}
                        onChange={(e) => setFormData({ ...formData, nombre_cientifico: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        disabled={isPending}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex-1">
                        <label htmlFor="fk_id_tipo_cultivo" className="block text-sm font-medium text-gray-700">
                            Tipo de Cultivo
                        </label>
                        <select
                            id="fk_id_tipo_cultivo"
                            value={formData.fk_id_tipo_cultivo}
                            onChange={(e) => setFormData({ ...formData, fk_id_tipo_cultivo: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                            disabled={isPending}
                        >
                            <option value="">Seleccione un tipo de cultivo</option>
                            {tiposCultivo.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateTipoCultivoModal}
                        className="mt-6 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900"
                        title="Crear nuevo tipo de cultivo"
                        disabled={isPending}
                    >
                        +
                    </button>
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                        {isPending ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActualizarEspecie;