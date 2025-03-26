---
title: "Actualizar Especie"
description: "Actualiza los datos de una especie ya registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización de los datos de una especie previamente registrada.

---

## Método: 
```
PUT
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/especie/{id_especie}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id_especie": 1,
    "nombre_comun": "Café",
    "nombre_cientifico": "Coffea arabica",
    "descripcion": "Planta de cultivo para la producción de café.",
    "fk_id_tipo_cultivo": 5
}
```

:::markdown
| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| id_especie      | integer | ✅        | Identificación de la especie                    |
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
- **201**: Actualización exitosa, devuelve los datos de la especie actualizada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información de las especies en el sistema.

