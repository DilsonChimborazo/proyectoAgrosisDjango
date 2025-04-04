---
title: "Actulaizar sensores"
description: "Actualiza los datos de los sensores ya registrados en el sistema."
---


## Descripción:
Solicitud utilizada, la actualizacion de los datos de un sensor ya registrado previamente.

---


## Metodo: 
```
 PATCH
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/sensores/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_sensor": "Sensor de humedad",
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre_sensor  | string | ✅       | Nombre del sensor |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_sensor": "Sensor de Humedad",
    "tipo_sensor": "DHT22",
    "unidad_medida": "°C",
    "descripcion": "Sensor de humedad",
    "medida_minima": -40,
    "medida_maxima": 80
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_sensor  | string | Nombre del sensor |
| tipo_sensor    | string | Tipo de sensor    |
| unidad_medida  | string | Unidad de medida del sensor |
| descripcion    | string | Descripcion del sensor | 
| medida_minima  | integer| Medida minima del sensor| 
| medida_maxima  | integer| Medida maxima del sensor| 
:::


### **Códigos de respuesta**
- **201**: Actualizacion exitosa, devuelve el array del sensor actualizado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden actualizar los sensores en el sistema.



