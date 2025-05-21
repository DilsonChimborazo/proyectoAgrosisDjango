import ListarInsumosCompuestos from '@/components/inventario/insumocompuesto/InsumoCompuesto';
import Insumos from '@/components/inventario/insumos/Insumos';



const InsumoPage = () =>{
    return (
        <div>
            <Insumos />
            <ListarInsumosCompuestos/>

        </div>        
    );
};
export default InsumoPage;