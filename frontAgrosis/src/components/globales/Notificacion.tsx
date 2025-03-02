import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificacionProps {
  message: string | null | { mensaje: string } | null; // Allow message to be an object with 'mensaje' key
  errorSocket: string | null;
}

const Notificacion: React.FC<NotificacionProps> = ({ message, errorSocket }) => {
  // Extract 'mensaje' if the message is an object
  const displayMessage = message && typeof message === 'object' ? message.mensaje : message;

  useEffect(() => {
    if (errorSocket) {
      toast.error(errorSocket); // Show error toast
    }
    if (displayMessage) {
      toast.success(displayMessage); // Show success toast
    }
  }, [errorSocket, displayMessage]); // This effect will run when errorSocket or displayMessage change

  return (
    <div>
      {/* Toast container will manage the placement of toasts */}
      <ToastContainer />

      {/* Optional, you can still show the messages as HTML for custom UI */}
    </div>
  );
};

export default Notificacion;
