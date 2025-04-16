---
title: "Obtener Control Fitosanitario"
description: "Obtener los datos de un control fitosanitario ya registrado en el sistema."
---

## Descripción:

Solicitud utilizada para la obtener los datos de un control fitosanitario registrado en el sistema.

---

## Metodo:
```
 GET
```
---
## **Cabecera de la solicitud**
Incluye los siguientes encabezados en la solicitud:
```
Content-Type: application/json
Authorization: Bearer "tu_token_aquí"
```
|Encabezado	Requerido | Descripción  |
|-------------------- |--------------|
|Content-Type	      |✅	Indica que el cuerpo de la solicitud es JSON.
|Authorization        |❌	Token de autenticación si es necesario.


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/control_fitosanitario/
```
### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fecha_control": "2024-03-26",
    "descripcion": "Aplicación de fungicida ecológico",
    "fk_id_cultivo": "maiz",
    "fk_id_pea": "plaga"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|-----------------|--------|-----------------------------|
| fecha_plantacion| string | Fecha del control (YYYY-MM-DD)|
| descripcion     | string |  Descripcion del control   |
| fk_id_cultivo   | integer|  Id del cultivo al que se le realiza el control   |
| fk_id_pea       | integer|  Id del pea que afecta al cultivo  |
:::


### **Códigos de respuesta**
- **201**: Devuelve el array de los controles registrados.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden obtener la información de los controles fitosanitarios. Los usuarios sin permisos adecuados no podrán realizar esta acción.
