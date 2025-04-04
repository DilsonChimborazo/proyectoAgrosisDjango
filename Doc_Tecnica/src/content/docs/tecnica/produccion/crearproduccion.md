---
title: "Crear producción"
description: "Registra una nueva producción dentro del sistema."
---

## Descripción:
Solicitud utilizada para el registro de nuevas producciones.

---

## Método: 
```
 POST
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/produccion/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "fk_id": 5,
    "cantidad_produccion": "150.5000000000",
    "fecha": "2025-03-26"
}
```

| Campo               | Tipo     | Requerido |Descripción                         |
|---------------------|----------------------|-------------------------------------|
| fk_id               | integer  | ✅       | Identificador del cultivo asociado  |
| cantidad_produccion | decimal  | ✅       | Cantidad producida                  |
| fecha               | date     | ✅       | Fecha del registro de producción    |

## **Respuesta**

Si el registro es exitoso, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_produccion": 1,
    "fk_id": 5,
    "cantidad_produccion": "150.5000000000",
    "fecha": "2025-03-26"
}
```

---

| Campo               | Tipo     | Descripción                         |
|---------------------|----------|-------------------------------------|
| id_produccion      | integer  | Identificador único de la producción |
| fk_id              | integer  | Identificador del cultivo asociado  |
| cantidad_produccion | decimal  | Cantidad producida                  |
| fecha              | date     | Fecha del registro de producción    |

---

### **Códigos de respuesta**
- **201**: Producción creada con éxito, devuelve los datos del registro.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden registrar o modificar la producción en el sistema.

