---
title: "Actualizar Especie"
description: "Actualiza parcialmente los datos de una especie registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización parcial de una especie previamente registrada.

---

## Método:
```
PATCH
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/especie/{id_especie}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los campos que deseas actualizar:

```json
{
    "nombre_comun": "Tomate",
    "nombre_cientifico": "Solanum lycopersicum",
    "descripcion": "Planta herbácea de frutos comestibles",
    "fk_id_tipo_cultivo": 2
}
```

| Campo              | Tipo    | Requerido | Descripción                                      |
|-------------------|---------|-----------|--------------------------------------------------|
| nombre_comun     | string  | ❌        | Nombre común de la especie                      |
| nombre_cientifico | string  | ❌        | Nombre científico de la especie                 |
| descripcion      | string  | ❌        | Descripción breve de la especie                 |
| fk_id_tipo_cultivo | integer | ❌        | Identificador del tipo de cultivo asociado      |

## **Respuesta**

Si los datos son correctos, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_especie": 1,
    "nombre_comun": "Tomate",
    "nombre_cientifico": "Solanum lycopersicum",
    "descripcion": "Planta herbácea de frutos comestibles",
    "fk_id_tipo_cultivo": 2
}
```

:::markdown
| Campo            | Tipo    | Descripción                                   |
|-----------------|---------|-----------------------------------------------|
| id_especie      | integer | Identificador único de la especie            |
| nombre_comun    | string  | Nombre común de la especie                    |
| nombre_cientifico | string  | Nombre científico de la especie               |
| descripcion     | string  | Descripción breve de la especie               |
| fk_id_tipo_cultivo | integer | Identificador del tipo de cultivo asociado  |
:::

### **Códigos de respuesta**
- **200**: Actualización exitosa, devuelve los datos de la especie actualizada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información de las especies en el sistema.