---
title: "Obtener sensor"
description: "Obtener los sensores registrados en el sistema"
---


## Descripción:
Solicitud utilizada para obtener los sensores que estan registrados dentro del sistema.

---



## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/sensores/
```

### **Cuerpo de la solicitud**


## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_sensor": "Sensor de temperatura",
    "tipo_sensor": "DHT22",
    "unidad_medida": "°C",
    "descripcion": "Sensor de temperatura y humedad",
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
- **201**: Devuelve el array de los sensores registrados.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden obtener informacion de un sensor en el sistema.



