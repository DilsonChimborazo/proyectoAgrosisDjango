export const generarAnalisisDiferencias = (datosViejo: any, datosNuevo: any) => {
  const diffBC = datosNuevo.beneficio_costo_acumulado - datosViejo.beneficio_costo_acumulado;
  const diffIngresos = datosNuevo.ingresos_ventas_acumulado - datosViejo.ingresos_ventas_acumulado;
  const diffEgresos = (
    datosNuevo.costo_mano_obra_acumulado +
    datosNuevo.egresos_insumos_acumulado +
    datosNuevo.depreciacion_herramientas_acumulada
  ) - (
    datosViejo.costo_mano_obra_acumulado +
    datosViejo.egresos_insumos_acumulado +
    datosViejo.depreciacion_herramientas_acumulada
  );

  let analisis = [];

  if (diffBC > 0) {
    analisis.push(`La relación Beneficio/Costo mejoró en ${diffBC.toFixed(2)} puntos.`);
  } else if (diffBC < 0) {
    analisis.push(`La relación Beneficio/Costo empeoró en ${Math.abs(diffBC).toFixed(2)} puntos.`);
  } else {
    analisis.push('La relación Beneficio/Costo se mantuvo estable.');
  }

  if (diffIngresos > 0) {
    analisis.push(`Los ingresos aumentaron en $${diffIngresos.toLocaleString('es-CO')}.`);
  } else if (diffIngresos < 0) {
    analisis.push(`Los ingresos disminuyeron en $${Math.abs(diffIngresos).toLocaleString('es-CO')}.`);
  } else {
    analisis.push('Los ingresos se mantuvieron iguales.');
  }

  if (diffEgresos > 0) {
    analisis.push(`Los egresos aumentaron en $${diffEgresos.toLocaleString('es-CO')}.`);
  } else if (diffEgresos < 0) {
    analisis.push(`Los egresos disminuyeron en $${Math.abs(diffEgresos).toLocaleString('es-CO')}.`);
  } else {
    analisis.push('Los egresos se mantuvieron iguales.');
  }

  return analisis.join(' ');
};

export const cargarImagenComoBase64 = (url: string): Promise<string> => {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
};