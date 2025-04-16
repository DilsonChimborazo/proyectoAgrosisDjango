---
title: "Crear semillero"
description: "Registra nuevos semilleros en el sistema."
---

## Descripción:
Solicitud utilizada para el registro de nuevos semilleros.

---

## Metodo: 
```
 POST
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/semilleros/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_semilla": "Café",
    "fecha_siembra": "2025-03-26",
    "fecha_estimada": "2025-09-26",
    "cantidad": 100
}
```

| Campo          | Tipo    | Requerido | Descripción                          |
|---------------|---------|-----------|--------------------------------------|
| id_semillero  | integer | ✅        | Identificador del semillero         |
| nombre_semilla| string  | ✅        | Nombre de la semilla                |
| fecha_siembra | date    | ✅        | Fecha de siembra                    |
| fecha_estimada| date    | ✅        | Fecha estimada de cosecha           |
| cantidad      | integer | ✅        | Cantidad de semillas sembradas      |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_semillero": 1,
    "nombre_semilla": "Café",
    "fecha_siembra": "2025-03-26",
    "fecha_estimada": "2025-09-26",
    "cantidad": 100
}
```

:::markdown
| Campo          | Tipo    | Descripción                          |
|---------------|---------|--------------------------------------|
| id_semillero  | integer | Identificador del semillero         |
| nombre_semilla| string  | Nombre de la semilla                |
| fecha_siembra | date    | Fecha de siembra                    |
| fecha_estimada| date    | Fecha estimada de cosecha           |
| cantidad      | integer | Cantidad de semillas sembradas      |
:::

### **Códigos de respuesta**
- **201**: Semillero creado con éxito, devuelve el array del semillero registrado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información de los semilleros. Los usuarios normales solo pueden visualizarlos.

