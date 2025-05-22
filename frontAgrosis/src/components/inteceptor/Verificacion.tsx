import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "@/hooks/inteceptor/axiosInstance"; 
import { showToast } from "../globales/Toast";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        showToast({
          title: "Sesión expirada",
          description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          variant: "error",
        });

        setTimeout(() => {
          navigate("/");
        }, 3000); 
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 5 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [navigate]);

  return <>{children}</>;
};

export default AuthChecker;
