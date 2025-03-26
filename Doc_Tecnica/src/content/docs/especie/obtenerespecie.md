---
title: "Obtener Especies"
description: "Obtiene todos los registros de especies registrados en el sistema."
---

## Descripción:
Solicitud utilizada para obtener todos los registros de especies registrados en el sistema.

---

## Método: 
```
GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/especie/
```

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **201** con la siguiente estructura:

```json
[
    {
        "id_especie": 1,
        "nombre_comun": "Maíz",
        "nombre_cientifico": "Zea mays",
        "descripcion": "Planta utilizada en la producción de granos.",
        "fk_id_tipo_cultivo": 3
    }
]
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
- **201**: Consulta exitosa, devuelve los datos de las especies.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre las especies en el sistema.

