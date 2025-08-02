import Button from '@/components/globales/Button';
import { History, GitCompare, FileText } from 'lucide-react';
import { Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';

interface PlantacionSelectorProps {
    plantaciones: Plantacion[] | undefined;
    loadingPlantaciones: boolean;
    plantacionSeleccionada: number | null;
    onPlantacionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onVerResumen: () => void;
    onVerEvolucion: () => void;
    onCompararVersiones: () => void;
    onVerReportes: () => void; // Nuevo callback
    historialDisponible: boolean;
}

const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const PlantacionSelector = ({
    plantaciones,
    loadingPlantaciones,
    plantacionSeleccionada,
    onPlantacionChange,
    onVerEvolucion,
    onCompararVersiones,
    onVerReportes, // Añadido
    historialDisponible
}: PlantacionSelectorProps) => {
    return (
        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-md p-6 h-fit">
            <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
                Trazabilidad Histórica
            </h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Plantación
                    </label>
                    {loadingPlantaciones ? (
                        <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
                    ) : (
                        <select
                            value={plantacionSeleccionada || ''}
                            onChange={onPlantacionChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        >
                            <option value="">Seleccione una plantación</option>
                            {plantaciones?.map((plantacion) => (
                                <option key={plantacion.id} value={plantacion.id}>
                                    {(plantacion.fecha_plantacion)} - {plantacion.fk_id_cultivo.nombre_cultivo}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                
                {plantacionSeleccionada && (
                    <div className="mt-6 space-y-2">
                        <Button 
                            text="Ver Evolución" 
                            variant="success" 
                            onClick={onVerEvolucion}
                            className="w-full flex justify-center items-center gap-2"
                            icon={History}
                        />
                        <Button 
                            text="Comparar Versiones" 
                            variant="primary" 
                            onClick={onCompararVersiones}
                            className="w-full flex justify-center items-center gap-2"
                            icon={GitCompare}
                            disabled={!historialDisponible}
                        />
                        <Button 
                            text="Reportes" 
                            variant="outline" 
                            onClick={onVerReportes}
                            className="w-full flex justify-center items-center gap-2"
                            icon={FileText}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlantacionSelector;