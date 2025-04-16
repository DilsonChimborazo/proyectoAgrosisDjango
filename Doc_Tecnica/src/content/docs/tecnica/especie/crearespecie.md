---
title: "Crear Especie"
description: "Registra una nueva especie en el sistema."
---

## Descripción:
Solicitud utilizada para registrar una nueva especie en el sistema.

---

## Método: 
```
POST
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/especie
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_comun": "Café",
    "nombre_cientifico": "Coffea arabica",
    "descripcion": "Planta de cultivo para la producción de café.",
    "fk_id_tipo_cultivo": 5
}
```

:::markdown
| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| nombre_comun    | string  | ✅        | Nombre común de la especie                      |
| nombre_cientifico | string  | ✅        | Nombre científico de la especie                 |
| descripcion     | string  | ✅        | Descripción de la especie                        |
| fk_id_tipo_cultivo | integer | ✅        | Identificación del tipo de cultivo asociado   |
:::

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_especie": 1,
    "nombre_comun": "Café",
    "nombre_cientifico": "Coffea arabica",
    "descripcion": "Planta de cultivo para la producción de café.",
    "fk_id_tipo_cultivo": 5
}
```

### **Códigos de respuesta**
- **201**: Registro exitoso, devuelve los datos de la especie creada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden registrar nuevas especies en el sistema.
