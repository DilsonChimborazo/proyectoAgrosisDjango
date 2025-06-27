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

    };
    
    newSocket.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            if (data.message) {
                setMessage(data.message);
        }
        if (data.error) {
            setErrorSocket(data.error);
            }
        } catch (error) {
            setErrorSocket('Error al procesar el mensaje');
        }
    };

    newSocket.onerror = () => {
        setErrorSocket('Error en la conexión WebSocket');
    };

    newSocket.onclose = (e) => {
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
    }
};

return {
    socket,
    message,
    errorSocket,
    sendData,
};
};
