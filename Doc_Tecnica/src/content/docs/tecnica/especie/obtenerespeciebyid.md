---
title: "Obtener Especie"
description: "Obtiene un registro de especie específico en el sistema mediante su ID."
---

## Descripción:
Solicitud utilizada para obtener un registro de especie específico en el sistema mediante su ID.

---

## Método: 
```
GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/especie/{id_especie}
```

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **201** con la siguiente estructura:

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
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| id_especie      | integer | Identificación de la especie                    |
| nombre_comun    | string  | Nombre común de la especie                      |
| nombre_cientifico | string  | Nombre científico de la especie                 |
| descripcion     | string  | Descripción de la especie                        |
| fk_id_tipo_cultivo | integer | Identificación del tipo de cultivo asociado   |
:::

### **Códigos de respuesta**
- **201**: Consulta exitosa, devuelve los datos de la especie.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre las especies en el sistema.

