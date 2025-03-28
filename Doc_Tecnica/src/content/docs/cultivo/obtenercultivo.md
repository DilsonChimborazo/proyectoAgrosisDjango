---
title: "Obtener cultivos"
description: "Obtiene los cultivos que estan registrados dentro del sistema."
---


## Descripción:
Solicitud utilizada para obtener los cultivos que estan registrados dentro del sistema.

---


## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/cultivo/
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_cultivo": "Maíz",
    "fecha_plantacion": "2024-03-01",
    "descripcion": "Cultivo de maíz amarillo",
    "fk_id_especie": "Cereal",
    "fk_id_semillero": "Semillero Norte"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_cultivo | string | Identificación del usuario  |
| fecha_plantacion| string | 2024-03-26     |
| descripcion    | string | Cultivo de maíz amarillo|
| fk_id_especie  | string | Cereal  |
| fk_id_semillero| string | ISemillero Norte   |
:::


### **Códigos de respuesta**
- **201**: Consulta exitosa, devuelve la información de los cultivos.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden consultar cultivos. Los usuarios sin permisos adecuados no podrán realizar esta acción.



