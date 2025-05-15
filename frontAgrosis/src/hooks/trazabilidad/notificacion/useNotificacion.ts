import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/api/';

export interface Notificacion {
  id: number;
  usuario: number;
  titulo: string;
  mensaje: string;
  fecha_notificacion: string;
  leida: boolean;
}

const fetchNotificaciones = async (): Promise<Notificacion[]> => {
  const token = localStorage.getItem('token');
  console.log('Token usado:', token);
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  try {
    const response = await axios.get(`${apiUrl}notificaciones/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!Array.isArray(response.data)) {
      throw new Error('La API no devolvió un array válido.');
    }
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.statusText ||
      'Error al obtener la lista de notificaciones';
    console.error('Error al obtener notificaciones:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      error,
    });
    throw new Error(errorMessage);
  }
};

const markNotificacionAsRead = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  try {
    await axios.put(`${apiUrl}notificaciones/${id}/`, { leida: true }, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'Error al marcar la notificación como leída';
    console.error('Error detallado:', error.response?.data, errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const useNotificacion = () => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notificaciones = [], isLoading, error } = useQuery({
    queryKey: ['notificaciones'],
    queryFn: fetchNotificaciones,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificacionAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Notificacion[]>(['notificaciones'], (old) =>
        old ? old.map((n) => (n.id === id ? { ...n, leida: true } : n)) : old
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    },
    onError: (error: Error) => {
      console.error('Error al marcar como leída:', error.message);
    },
  });

  useEffect(() => {
    setUnreadCount(notificaciones.filter((n) => !n.leida).length);
  }, [notificaciones]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token para conectar al WebSocket');
      return;
    }

    console.log('Conectando a WebSocket:', `${wsBaseUrl}notificaciones/?token=${token}`);
    const ws = new WebSocket(`${wsBaseUrl}notificaciones/?token=${token}`);

    ws.onopen = () => console.log('WebSocket de notificaciones conectado');
    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensaje WebSocket recibido:', data);
        if (data.type === 'notification') {
          const newNotification: Notificacion = data.notification;
          queryClient.setQueryData<Notificacion[]>(['notificaciones'], (old) =>
            old ? [newNotification, ...old] : [newNotification]
          );
          if (!newNotification.leida) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      } catch (error) {
        console.error('Error al procesar mensaje WebSocket:', error);
      }
    };
    ws.onclose = () => console.log('WebSocket de notificaciones desconectado');
    ws.onerror = (error) => console.error('Error en WebSocket:', error);

    return () => ws.close();
  }, [queryClient]);

  return {
    notificaciones,
    unreadCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
  };
};