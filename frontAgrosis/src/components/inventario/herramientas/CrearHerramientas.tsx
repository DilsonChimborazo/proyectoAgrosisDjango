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
        { id: "cantidad", label: "Cantidad", type: "number" },
    ];

    const handleSubmit = (formData: any) => {
        const nuevaHerramienta = {
            nombre_h: formData.nombre_h,
            estado: formData.estado,
            cantidad: Number(formData.cantidad),
        };

        // Primero creamos la herramienta
        mutation.mutate(nuevaHerramienta, {
            onSuccess: (data) => {
                console.log("Herramienta creada exitosamente:", nuevaHerramienta);

                // Crear movimiento de entrada en la bodega después de la creación de la herramienta
                const movimientoEntrada = {
                    fk_id_herramientas: data.data.id, // Usamos el ID de la herramienta creada
                    cantidad: nuevaHerramienta.cantidad,
                    movimiento: 'Entrada', // Movimiento tipo entrada
                    fecha: new Date().toISOString(),
                    fk_id_asignacion: null,  // O el ID de la asignación correspondiente si lo tienes
                    fk_id_insumo: null,  // Si también trabajas con insumos, usa el ID del insumo
                };

                // Registrar el movimiento de entrada en la bodega
                mutate(movimientoEntrada, {
                    onSuccess: () => {
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
