// src/pages/bodega/RegistrarSalidaBodega.tsx

import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { useNavigate } from "react-router-dom";
import Formulario from "../../globales/Formulario";
import { useState } from "react";
import { Herramientas, Insumos, Asignacion } from "@/hooks/inventario/bodega/useCrearBodega";

interface Props {
    id: number;
    herramientas: Herramientas[];
    insumos: Insumos[];
    asignaciones: Asignacion[];
    onSuccess?: () => void;
}

const RegistrarSalidaBodega = ({ herramientas, insumos, asignaciones }: Props) => {
    const { mutate: crearMovimientoBodega } = useCrearBodega();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState("");

    const formFields = [
        {
            id: "fk_id_herramientas",
            label: "Herramienta",
            type: "select",
            options: [{ value: "", label: "Ninguna" }, ...herramientas.map((h) => ({
                value: h.id.toString(),
                label: `${h.nombre_h}`,
            }))],
        },
        {
            id: "fk_id_insumo",
            label: "Insumo",
            type: "select",
            options: [{ value: "", label: "Ninguno" }, ...insumos.map((i) => ({
                value: i.id.toString(),
                label: `${i.nombre}`,
            }))],
        },
        {
            id: "fk_id_asignacion",
            label: "Asignación relacionada",
            type: "select",
            options: asignaciones.map((a, idx) => ({
                value: idx.toString(),
                label: `Asignación ${a.fecha_programada}`,
            })),
        },
        { id: "cantidad", label: "Cantidad a retirar", type: "number" },
        { id: "fecha", label: "Fecha de salida", type: "date" },
    ];

    const handleSubmit = (formData: any) => {
        const salida = {
            fk_id_herramientas: formData.fk_id_herramientas ? parseInt(formData.fk_id_herramientas) : null,
            fk_id_insumo: formData.fk_id_insumo ? parseInt(formData.fk_id_insumo) : null,
            fk_id_asignacion: formData.fk_id_asignacion ? parseInt(formData.fk_id_asignacion) : null,
            cantidad: Number(formData.cantidad),
            fecha: formData.fecha,
            movimiento: "Salida" as const,
        };

        if (!salida.fk_id_herramientas && !salida.fk_id_insumo) {
            setMensaje("Debes seleccionar al menos una herramienta o un insumo.");
            return;
        }

        crearMovimientoBodega(salida, {
            onSuccess: () => {
                setMensaje("Salida registrada exitosamente.");
                setTimeout(() => {
                    navigate("/bodega");
                    window.location.reload(); // ✅ Recarga la página automáticamente
                }, 1000);
            },
            onError: (err) => {
                setMensaje(`Error al registrar salida: ${err.message}`);
            },
        });
    };

    return (
        <div className="container">
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                title="Registrar Salida de Bodega"
            />
            {mensaje && (
                <div className="mt-3 text-sm text-center text-blue-600">{mensaje}</div>
            )}
        </div>
    );
};

export default RegistrarSalidaBodega;
