import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificacionProps {
  message: string | null | { mensaje: string } | null; 
  errorSocket: string | null;
}

const Notificacion: React.FC<NotificacionProps> = ({ message, errorSocket }) => {
const displayMessage = message && typeof message === 'object' ? message.mensaje : message;

  useEffect(() => {
    if (errorSocket) {
      toast.error(errorSocket); 
    }
    if (displayMessage) {
      toast.success(displayMessage); 
    }
  }, [errorSocket, displayMessage]); 

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Notificacion;
