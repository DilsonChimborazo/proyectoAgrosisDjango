import { useState } from 'react';
import { useEspecie, Especie } from '../../../hooks/trazabilidad/especie/useEspecie';
import { useTipoCultivo, TipoCultivo } from '../../../hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import { useCrearEspecie } from '../../../hooks/trazabilidad/especie/useCrearEspecie';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import Formulario from '../../globales/Formulario';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';
import { FaLeaf } from 'react-icons/fa';

// Tipo específico para los datos de la tabla
interface EspecieTabla extends Omit<Especie, 'fk_id_tipo_cultivo'> {
    tipo_cultivo: string;
}

const DetalleEspecieModal = ({ item, tiposCultivo }: { item: Especie; tiposCultivo: TipoCultivo[] }) => {
    const tipoCultivoNombre = tiposCultivo.find(tipo => tipo.id === item.fk_id_tipo_cultivo)?.nombre || 'Sin tipo de cultivo';

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Detalles de la Especie</h2>
            <div className="space-y-3">
                <p><span className="font-semibold">Nombre Común:</span> {item.nombre_comun || 'Sin nombre común'}</p>
                <p><span className="font-semibold">Nombre Científico:</span> {item.nombre_cientifico || 'Sin nombre científico'}</p>
                <p><span className="font-semibold">Descripción:</span> {item.descripcion || 'Sin descripción'}</p>
                <p><span className="font-semibold">Tipo de Cultivo:</span> {tipoCultivoNombre}</p>
            </div>
        </div>
    );
};

const CrearEspecieModal = ({ onSuccess, tiposCultivo }: { onSuccess: () => void; tiposCultivo: TipoCultivo[] }) => {
    const mutation = useCrearEspecie();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formFields = [
        { id: 'nombre_comun', label: 'Nombre Común', type: 'text' },
        { id: 'nombre_cientifico', label: 'Nombre Científico', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'textarea' },
        {
            id: 'fk_id_tipo_cultivo',
            label: 'Tipo de Cultivo',
            type: 'select',
            options: tiposCultivo.length > 0
                ? tiposCultivo.map((tipo) => ({
                      value: tipo.id.toString(),
                      label: tipo.nombre,
                  }))
                : [{ value: '', label: 'No hay tipos de cultivo disponibles' }],
        },
    ];

    const handleSubmit = (formData: { [key: string]: string | File }) => {
        setErrorMessage(null);

        const nombreComun = formData.nombre_comun;
        const nombreCientifico = formData.nombre_cientifico;
        const descripcion = formData.descripcion;
        const fkIdTipoCultivo = formData.fk_id_tipo_cultivo;

        if (
            typeof nombreComun !== 'string' ||
            typeof nombreCientifico !== 'string' ||
            typeof descripcion !== 'string' ||
            typeof fkIdTipoCultivo !== 'string'
        ) {
            setErrorMessage("❌ Todos los campos deben ser de tipo texto");
            return;
        }

        if (!nombreComun || !nombreCientifico || !fkIdTipoCultivo) {
            setErrorMessage("❌ Los campos Nombre Común, Nombre Científico y Tipo de Cultivo son obligatorios");
            return;
        }

        if (fkIdTipoCultivo === '') {
            setErrorMessage("❌ Debes crear un tipo de cultivo primero");
            return;
        }

        const nuevaEspecie: Omit<Especie, 'id'> = {
            nombre_comun: nombreComun.trim(),
            nombre_cientifico: nombreCientifico.trim(),
            descripcion: descripcion || '',
            fk_id_tipo_cultivo: parseInt(fkIdTipoCultivo, 10),
        };

        mutation.mutate(nuevaEspecie, {
            onSuccess: () => {
                console.log("✅ Especie creada, refetching especies...");
                onSuccess();
            },
            onError: (error: any) => {
                const errorMsg = error.message || "Error desconocido al crear la especie";
                console.error("❌ Error al crear especie:", errorMsg);
                setErrorMessage(`❌ Error al crear especie: ${errorMsg}`);
            },
        });
    };

    return (
        <div className="p-4">
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Crear Nueva Especie"
            />
        </div>
    );
};

const Especies = () => {
    const { data: especies, error: errorEspecies, isLoading: isLoadingEspecies, refetch: refetchEspecies } = useEspecie();
    const { data: tiposCultivo, error: errorTiposCultivo, isLoading: isLoadingTiposCultivo, refetch: refetchTiposCultivo } = useTipoCultivo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedEspecie, setSelectedEspecie] = useState<Especie | null>(null);
    const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

    console.log("📋 Especies recibidas del backend:", especies);
    console.log("📋 Tipos de cultivo recibidos:", tiposCultivo);

    const handleItemClick = (item: EspecieTabla) => {
        const especie: Especie = {
            id: item.id,
            nombre_comun: item.nombre_comun,
            nombre_cientifico: item.nombre_cientifico,
            descripcion: item.descripcion,
            fk_id_tipo_cultivo: tiposCultivo?.find(tipo => tipo.nombre === item.tipo_cultivo)?.id ?? -1,
        };
        setSelectedEspecie(especie);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEspecie(null);
        setModalContenido(null);
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
    };

    const handleCreateEspecie = () => {
        setModalContenido(<CrearEspecieModal 
            onSuccess={() => {
                console.log("📋 Refetching especies después de crear...");
                refetchEspecies();
                closeModal();
            }}
            tiposCultivo={tiposCultivo || []}
        />);
        setIsModalOpen(true);
    };

    const handleCreateTipoCultivo = () => {
        setModalContenido(<CrearTipoCultivo 
            onSuccess={(nombre: string) => {
                console.log("📋 Refetching tipos de cultivo después de crear...");
                refetchTiposCultivo();
                closeModal();
            }}
        />);
        setIsModalOpen(true);
    };

    if (isLoadingEspecies || isLoadingTiposCultivo) return <div className="text-center text-gray-500">Cargando...</div>;

    if (errorEspecies) return (
        <div className="text-center text-red-500">
            Error al cargar las especies: {errorEspecies.message}
        </div>
    );

    if (errorTiposCultivo) return (
        <div className="text-center text-red-500">
            Error al cargar los tipos de cultivo: {errorTiposCultivo.message}
        </div>
    );

    const tablaData: EspecieTabla[] = (especies ?? []).map((especie) => {
        console.log("📋 Procesando especie:", especie);

        // Inspeccionamos el valor de fk_id_tipo_cultivo
        console.log("🔍 Valor de fk_id_tipo_cultivo:", especie.fk_id_tipo_cultivo);
        console.log("🔍 Tipo de fk_id_tipo_cultivo:", typeof especie.fk_id_tipo_cultivo);

        // Aseguramos que fk_id_tipo_cultivo sea un número
        const fkIdTipoCultivo = typeof especie.fk_id_tipo_cultivo === 'number'
            ? especie.fk_id_tipo_cultivo
            : (typeof especie.fk_id_tipo_cultivo === 'object' && especie.fk_id_tipo_cultivo !== null && 'id' in especie.fk_id_tipo_cultivo
                ? (especie.fk_id_tipo_cultivo as any).id
                : -1);

        // Buscamos el tipo de cultivo correspondiente
        const tipoCultivo = tiposCultivo?.find(tipo => tipo.id === fkIdTipoCultivo);

        console.log(`🔍 Buscando tipo de cultivo para fk_id_tipo_cultivo: ${fkIdTipoCultivo}`);
        console.log(`🔍 Tipos de cultivo disponibles (IDs):`, tiposCultivo?.map(tipo => tipo.id));

        const tipoCultivoNombre = tipoCultivo?.nombre || 
            (fkIdTipoCultivo !== -1 
                ? `Tipo de cultivo no encontrado (ID: ${fkIdTipoCultivo})` 
                : 'Sin tipo de cultivo asignado');

        return {
            id: especie.id ?? 0,
            nombre_comun: especie.nombre_comun || 'Sin nombre común',
            nombre_cientifico: especie.nombre_cientifico || 'Sin nombre científico',
            descripcion: especie.descripcion || 'Sin descripción',
            tipo_cultivo: tipoCultivoNombre,
        };
    });

    console.log("📋 Datos para la tabla:", tablaData);

    const headers = [
        'Nombre Comun',
        'Nombre Cientifico',
        'Descripcion',
        'Tipo Cultivo',
    ];

    return (
        <div className="p-4 space-y-6">
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
                contenido={<DetalleEspecieModal item={selectedEspecie!} tiposCultivo={tiposCultivo || []} />}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                    <button
                        title="Crear Tipo de Cultivo"
                        onClick={handleCreateTipoCultivo}
                        className="bg-green-700 text-white px-3 font-bold py-1 rounded hover:bg-green-900"
                    >
                        Crear Tipo Cultivo
                    </button>
                </div>
                <div>
                    {tiposCultivo && tiposCultivo.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tiposCultivo.map((tipo) => (
                                <div
                                    key={tipo.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow flex items-center p-4 hover:bg-gray-50 transition"
                                >
                                    <div className="flex-shrink-0 mr-4">
                                        <FaLeaf className="text-green-600 text-3xl" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{tipo.nombre || 'Sin nombre'}</h3>
                                        <p className="text-gray-600 text-sm">{tipo.descripcion || 'Sin descripción'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            No hay tipos de cultivo registrados. Haz clic en "Crear Tipo Cultivo" para agregar uno.
                        </div>
                    )}
                </div>
            </div>
            <Tabla
                title="Lista de Especies"
                headers={headers}
                data={tablaData}
                onClickAction={handleItemClick}
                onUpdate={(row) => {}}
                onCreate={handleCreateEspecie}
                createButtonTitle="Crear Especie"
                
            />
        </div>
    );
};

export default Especies;