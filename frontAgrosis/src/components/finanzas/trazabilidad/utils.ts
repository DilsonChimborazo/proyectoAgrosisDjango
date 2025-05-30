// utils.ts

export const generarAnalisisDiferencias = (datosViejo: any, datosNuevo: any) => {
    const diffBC = datosNuevo.beneficio_costo - datosViejo.beneficio_costo;
    const diffIngresos = datosNuevo.ingresos_ventas - datosViejo.ingresos_ventos;
    const diffEgresos = (datosNuevo.costo_mano_obra + datosNuevo.egresos_insumos) - 
                        (datosViejo.costo_mano_obra + datosViejo.egresos_insumos);
    
    let analisis = [];
    
    if (diffBC > 0) {
        analisis.push(`La relación Beneficio/Costo mejoró en ${diffBC.toFixed(2)} puntos.`);
    } else if (diffBC < 0) {
        analisis.push(`La relación Beneficio/Costo empeoró en ${Math.abs(diffBC).toFixed(2)} puntos.`);
    } else {
        analisis.push("La relación Beneficio/Costo se mantuvo estable.");
    }
    
    if (diffIngresos > 0) {
        analisis.push(`Los ingresos aumentaron en $${diffIngresos.toLocaleString()}.`);
    } else if (diffIngresos < 0) {
        analisis.push(`Los ingresos disminuyeron en $${Math.abs(diffIngresos).toLocaleString()}.`);
    } else {
        analisis.push("Los ingresos se mantuvieron iguales.");
    }
    
    if (diffEgresos > 0) {
        analisis.push(`Los egresos aumentaron en $${diffEgresos.toLocaleString()}.`);
    } else if (diffEgresos < 0) {
        analisis.push(`Los egresos disminuyeron en $${Math.abs(diffEgresos).toLocaleString()}.`);
    } else {
        analisis.push("Los egresos se mantuvieron iguales.");
    }
    
    return analisis.join(' ');
};