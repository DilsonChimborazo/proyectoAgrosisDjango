import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "@/hooks/inteceptor/axiosInstance"; 

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowAlert(true); 
        setTimeout(() => {
          setShowAlert(false); 
          navigate("/"); 
        }, 3000);
      }
    };

    checkToken(); // Verifica al cargar

    const interval = setInterval(checkToken, 5 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
            Inicio de sesión expirado, vuelva a iniciar sesión
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default AuthChecker;