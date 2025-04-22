import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import Tabla from '@/components/globales/Tabla';

interface SeccionInsumosProps {
    insumos: any[];
    isOpen: boolean;
    onToggle: () => void;
    onRowClick: (row: any) => void;
}

const SeccionInsumos = ({
    insumos,
    isOpen,
    onToggle,
    onRowClick
}: SeccionInsumosProps) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Insumos utilizados</h3>
                    <span className="text-sm text-gray-500 ml-2">
                        ({insumos?.length || 0})
                    </span>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {isOpen && (
                <div>
                    {insumos?.length > 0 ? (
                        <Tabla
                            title=""
                            headers={['Insumo', 'Tipo', 'Cantidad', 'Costo']}
                            data={insumos.map(i => ({
                                insumo: i.nombre,
                                tipo: i.tipo_insumo,
                                cantidad: `${i.cantidad} ${i.unidad_medida || ''}`,
                                costo: `$${i.costo_total?.toLocaleString() || '0'}`
                            }))}
                            onClickAction={onRowClick}
                            onUpdate={() => {}}
                            onCreate={() => {}}
                            rowsPerPageOptions={[5, 10]}
                            hiddenColumnsByDefault={[]}
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay insumos registrados</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeccionInsumos;