import { useState, useEffect } from 'react';

export const useWebSocket = (url: string) => {
const [socket, setSocket] = useState<WebSocket | null>(null);
const [message, setMessage] = useState<string | null>(null);
const [errorSocket, setErrorSocket] = useState<string | null>(null);

useEffect(() => {
    const connectWebSocket = () => {
        const newSocket = new WebSocket(url);
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
}, [url]);

const sendData = (data: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    } else {
        console.log('Socket no está abierto');
    }
};

return {
    socket,
    message,
    errorSocket,
    sendData,
};
};
