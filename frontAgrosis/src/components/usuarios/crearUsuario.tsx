import { Usuario } from '@/hooks/usuarios/useCreateUsuarios';
import { useCreateUsuarios } from '@/hooks/usuarios/useCreateUsuarios';
import Formulario from '../globales/Formulario';
import { useRoles } from '@/hooks/usuarios/useRol';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = () => {
    const mutation = useCreateUsuarios();
    const navigate = useNavigate();
    const { data: roles = [] } = useRoles();

    const formFields = [
        { id: 'identificacion', label: 'Identificación', type: 'text' }, 
        { id: 'email', label: 'Email', type: 'text' },
        { id: 'nombre', label: 'Nombre', type: 'text' },
        { id: 'apellido', label: 'Apellido', type: 'text' },
        { id: 'password', label: 'Contraseña', type: 'password' },
        { 
            id: "fk_id_rol", 
            label: "Rol", 
            type: "select", 
            options: Array.isArray(roles) ? roles.map((rol) => ({ value: String(rol.id), label: rol.rol })) : []
        }
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!formData.identificacion || !formData.email || !formData.nombre || !formData.apellido || !formData.password || !formData.fk_id_rol) {
            console.error('Campos faltantes');
            return;
        }

        const identificacion = parseInt(formData.identificacion, 10);
        const fk_id_rol = parseInt(formData.fk_id_rol, 10);

        if (isNaN(identificacion) || isNaN(fk_id_rol)) {
            console.error('Identificación o rol inválido');
            return;
        }

        const newUsuario: Usuario = {
            identificacion,
            email: formData.email,
            nombre: formData.nombre,
            apellido: formData.apellido,
            password: formData.password,
            fk_id_rol
        };

        mutation.mutate(newUsuario, {
            onSuccess: () => navigate('/usuarios') 
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Crear Nuevo Usuario" 
            />
        </div>
    );
};

export default CrearUsuario;
