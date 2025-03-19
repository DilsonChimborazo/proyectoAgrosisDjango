import { Eras } from '@/hooks/iot/eras/useCrearEras';
import { useCrearEras } from '../../../hooks/iot/eras/useCrearEras';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearEras = () => {
    const mutation = useCrearEras();
    const navigate = useNavigate();
    
    const formFields = [
        { id: 'fk_id_lote', label: 'Lote', type: 'number' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
    ];
    
    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaEra: Eras = {
            id: 0,  
            fk_id_lote: Number(formData.fk_id_lote), 
            descripcion: formData.descripcion,
        };

        mutation.mutate(nuevaEra, {
            onSuccess: () => {
                navigate('/Eras'); 
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
                title="Crear Era"  
            />
        </div>
    );
};

export default CrearEras;
