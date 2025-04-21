import Button from '@/components/globales/Button';
import { Cultivos } from '@/hooks/trazabilidad/cultivo/useCultivo';

interface CultivoSelectorProps {
    cultivos: Cultivos[] | undefined; // Añade undefined
    loadingCultivos: boolean;
    cultivoSeleccionado: number | null;
    onCultivoChange: (cultivoId: number) => void;
    onVerResumen: () => void;
    onVerGraficos: () => void;
  }

const CultivoSelector = ({
    cultivos,
    loadingCultivos,
    cultivoSeleccionado,
    onCultivoChange,
    onVerResumen,
    onVerGraficos
}: CultivoSelectorProps) => {
    return (
        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-md p-6 h-fit">
            <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
                Análisis por Cultivo
            </h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Cultivo
                    </label>
                    {loadingCultivos ? (
                        <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
                    ) : (
                        <select
                            value={cultivoSeleccionado || ''}
                            onChange={(e) => onCultivoChange(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        >
                            <option value="">Seleccione un cultivo</option>
                            {cultivos?.map((cultivo) => (
                                <option key={cultivo.id} value={cultivo.id}>
                                    {cultivo.nombre_cultivo}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                
                {cultivoSeleccionado && (
                    <div className="mt-6 space-y-2">
                        <Button 
                            text="Ver Resumen" 
                            variant="green" 
                            onClick={onVerResumen}
                            className="w-full flex justify-center items-center gap-2"
                        />
                        <Button 
                            text="Ver Gráficos" 
                            variant="success" 
                            onClick={onVerGraficos}
                            className="w-full flex justify-center items-center gap-2"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CultivoSelector;