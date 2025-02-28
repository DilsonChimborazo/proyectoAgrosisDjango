// AsignacionActividades.tsx
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Notificacion from './Notificacion'; // Importa el componente de notificación

interface Actividad {
  id: number;
  nombre_actividad: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface AsignacionActividad {
  id: number;
  fecha: string;
  observaciones: string;
  fk_id_actividad: Actividad;
  id_identificacion: Usuario;
}

const fetchAsignaciones = async (): Promise<AsignacionActividad[]> => {
  const { data } = await axios.get('http://localhost:8000/api/asignaciones_actividades/');
  return data;
};

const AsignacionActividades = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [errorSocket, setErrorSocket] = useState<string | null>(null);
  
    const { data, error, isLoading } = useQuery({
      queryKey: ['asignaciones'],
      queryFn: fetchAsignaciones,
    });
  
    useEffect(() => {
      const connectWebSocket = () => {
        const newSocket = new WebSocket('ws://localhost:8000/ws/asignacion_actividades/');
        setSocket(newSocket);
  
        newSocket.onopen = () => {
          console.log('Conexión WebSocket abierta');
        };
  
        newSocket.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            console.log('Mensaje recibido:', data);
            if (data.message) {
              setMessage(data.message); 
            }
            if (data.error) {
              setErrorSocket(data.error);
              console.error(data.error);
            }
          } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            setErrorSocket('Error al procesar el mensaje');
          }
        };
  
        newSocket.onerror = (e) => {
          console.error('Error en WebSocket:', e);
          setErrorSocket('Error en la conexión WebSocket');
        };
  
        newSocket.onclose = (e) => {
          console.log('Conexión WebSocket cerrada:', e);
          if (e.code !== 1000) {
            setTimeout(connectWebSocket, 3000);
          }
        };
      };
  
      connectWebSocket();
  
      return () => {
        socket?.close(); 
      };
    }, []);
  
    const enviarDatos = (fecha: string, fk_id_actividad: number, id_identificacion: number) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          fecha,
          fk_id_actividad,
          id_identificacion,
        };
        socket.send(JSON.stringify(data));
      } else {
        console.log('Socket no está abierto');
      }
    };
  
    if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;
  
    if (error instanceof Error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;
  
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Asignaciones de Actividades</h1>
        <Notificacion message={message} errorSocket={errorSocket} />
  
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Observaciones</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actividad</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Usuario</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((asignacion) => (
              <tr key={asignacion.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">{asignacion.id}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{asignacion.fecha}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{asignacion.observaciones}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{asignacion.fk_id_actividad.nombre_actividad}</td>
                <td className="py-3 px-6 text-sm text-gray-800">
                  {asignacion.id_identificacion.nombre} {asignacion.id_identificacion.apellido}
                </td>
                <td className="py-3 px-6 text-sm text-center">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                    onClick={() => {
                      enviarDatos('2025-02-28', asignacion.fk_id_actividad.id, asignacion.id_identificacion.id);
                      alert(`
                        Detalles enviados:
                        Actividad: ${asignacion.fk_id_actividad.nombre_actividad}
                        Usuario: ${asignacion.id_identificacion.nombre} ${asignacion.id_identificacion.apellido}
                        Fecha: ${asignacion.fecha}
                        Observaciones: ${asignacion.observaciones}
                      `);
                    }}
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AsignacionActividades;