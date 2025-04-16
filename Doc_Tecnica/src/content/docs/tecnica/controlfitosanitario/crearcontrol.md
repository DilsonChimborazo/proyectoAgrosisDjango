---
title: "Crear Control Fitosanitario"
description: "Crea un nuevo control fitosanitario y registralo en el sistema."
---

## Descripción:

Solicitud utilizada para el resgistro de nuevos controles fitosanitarios.

---

## Metodo:
```
 POST
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
Envía un objeto JSON con los siguientes campos:

```json
{
    "fecha_control": "2024-03-26",
    "descripcion": "Aplicación de fungicida ecológico",
    "fk_id_cultivo": 3,
    "fk_id_pea": 2
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|---------------- |--------|-----------|-----------------------------|
| fecha_control   | string | ✅       | Fecha del control (YYYY-MM-DD)|
| descripcion     | string | ✅       | Descripcion del control|
| fk_id_cultivo   | integer| ✅       | Id del cultivo al que se le realiza el control   |
| fk_id_pea       | integer| ✅       | Id del pea que afecta al cultivo  |


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
| fk_id_cultivo   | integer| Id del cultivo al que se le realiza el control   |
| fk_id_pea       | integer|  Id del pea que afecta al cultivo  |
:::


### **Códigos de respuesta**
- **201**: Control fitosanitario creado exitosamente en el sistema.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden crear un nuevo control fitosanitario. Los usuarios sin permisos adecuados no podrán realizar esta acción.
