import { Lotes } from "../../../hooks/iot/lote/useCrearLote";
import { useCrearLote } from "../../../hooks/iot/lote/useCrearLote";
import Formulario from "../../globales/Formulario";
import { useNavigate } from "react-router-dom";

const CrearLote = () => {
    const mutation = useCrearLote();
    const navigate = useNavigate();
    
    const formFields = [
        { id: "fk_id_ubicacion", label: "Ubicación", type: "number" },
        { id: "dimencion", label: "Dimensión", type: "text" },
        { id: "nombre_lote", label: "Nombre del Lote", type: "text" },
        { id: "estado", label: "Estado", type: "text" },
    ];
    
    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevoLote: Lotes = {
            id: 0, 
            fk_id_ubicacion: Number(formData.fk_id_ubicacion),
            dimencion: Number(formData.dimencion),
            nombre_lote: formData.nombre_lote,
            estado: formData.estado,
        };

        mutation.mutate(nuevoLote, {
            onSuccess: () => {
                navigate("/Lotes"); 
            }
        });
    };
    
    return (
        <div className="p-10">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Crear Lote"  
            />
        </div>
    );
};

export default CrearLote;
