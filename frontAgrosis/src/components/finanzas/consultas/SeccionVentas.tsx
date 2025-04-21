import { ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import Tabla from '@/components/globales/Tabla';

interface SeccionVentasProps {
    ventas: any[];
    isOpen: boolean;
    onToggle: () => void;
    onRowClick: (row: any) => void;
}

const SeccionVentas = ({
    ventas,
    isOpen,
    onToggle,
    onRowClick
}: SeccionVentasProps) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Ventas realizadas</h3>
                    <span className="text-sm text-gray-500 ml-2">
                        ({ventas?.length || 0})
                    </span>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {isOpen && (
                <div>
                    {ventas?.length > 0 ? (
                        <Tabla
                            title=""
                            headers={['Fecha', 'Cantidad', 'Precio Unidad', 'Total']}
                            data={ventas.map(v => ({
                                fecha: v.fecha,
                                cantidad: `${v.cantidad} ${v.unidad_medida || ''}`,
                                precio_unidad: `$${v.precio_unidad.toLocaleString()}`,
                                total: `$${v.ingreso_total.toLocaleString()}`
                            }))}
                            onClickAction={onRowClick}
                            onUpdate={() => {}}
                            onCreate={() => {}}
                            rowsPerPageOptions={[5, 10]}
                            hiddenColumnsByDefault={[]}
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeccionVentas;