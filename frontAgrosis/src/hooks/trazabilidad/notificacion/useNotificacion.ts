import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';


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
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  try {
    const response = await axios.get(`/api/notificaciones/`, {
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
    throw new Error(errorMessage);
  }
};

const markNotificacionAsRead = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  try {
    await axios.put(`/api/notificaciones/${id}/`, { leida: true }, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'Error al marcar la notificación como leída';
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
  });

  useEffect(() => {
    setUnreadCount(notificaciones.filter((n) => !n.leida).length);
  }, [notificaciones]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const ws = new WebSocket(`/api/notificaciones/?token=${token}`);

    ws.onopen = () => {};
    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
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
      }
    };
    ws.onclose = () => {};
    ws.onerror = () => {};
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