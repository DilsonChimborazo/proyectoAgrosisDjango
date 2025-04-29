import { useCrearHerramientas } from "@/hooks/inventario/herramientas/useCrearHerramientas";
import { useNavigate } from "react-router-dom";
import Formulario from "../../globales/Formulario";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";  

const CrearHerramientas = ({ onSuccess }: { onSuccess?: () => void }) => {
    const mutation = useCrearHerramientas();
    const { mutate } = useCrearBodega();  
    const navigate = useNavigate();

    const formFields = [
        { id: "nombre_h", label: "Nombre", type: "text" },
        {
            id: "estado", label: "Estado", type: "select", options: [
                { value: "Prestado", label: "Prestado" },
                { value: "En_reparacion", label: "En reparación" },
                { value: "Disponible", label: "Disponible" },
            ]
        },
        { id: "cantidad_herramienta", label: "Cantidad", type: "number" },
    ];

    const handleSubmit = (formData: any) => {
        const nuevaHerramienta = {
            nombre_h: formData.nombre_h,
            estado: formData.estado,
            cantidad_herramienta: Number(formData.cantidad_herramienta),
        };

        // Primero creamos la herramienta
        mutation.mutate(nuevaHerramienta, {
            onSuccess: (data) => {
                console.log("Herramienta creada exitosamente:", nuevaHerramienta);

                // Crear movimiento de entrada en la bodega después de la creación de la herramienta
                const movimientoEntrada = {
                    fk_id_herramientas: data.data.id, 
                    cantidad: nuevaHerramienta.cantidad_herramienta,
                    movimiento: 'Entrada'as const, 
                    fecha: new Date().toISOString(),
                    fk_id_asignacion: null, 
                    fk_id_insumo: null,  
                };

                // Registrar el movimiento de entrada en la bodega
                mutate(movimientoEntrada, {
                    onSuccess: (response) => {
                        console.log("este es el movimiento de entrada",response)
                        if (onSuccess) {
                            onSuccess(); 
                        }
                        navigate("/bodega"); // Redirigir a la página de bodega
                    },
                    onError: (error) => {
                        console.error("Error al registrar el movimiento en la bodega:", error?.response?.data || error?.message);
                    },
                });
            },
            onError: (error) => {
                console.error("Error al crear la herramienta:", error?.response?.data || error?.message);
            },
        });
    };

    return (
        <div className="container">
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Crear Herramienta"
            />
            {mutation.isError && (
                <div className="text-red-500 mt-2">Hubo un error al crear la herramienta. Intenta nuevamente.</div>
            )}
            {mutation.isSuccess && (
                <div className="text-green-500 mt-2">Herramienta creada exitosamente!</div>
            )}
        </div>
    );
};

export default CrearHerramientas;
