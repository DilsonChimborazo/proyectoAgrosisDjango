import { useState, useEffect } from "react";
import { useRecuperarContrasena } from "@/hooks/usuarios/recuperaciones/useRecuperarContrasena";
import logoAgrosis from "../../../../public/def_AGROSIS_LOGOTIC4.png";
import { showToast } from "@/components/globales/Toast";

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isError, error, isSuccess } = useRecuperarContrasena();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  useEffect(() => {
    if (isSuccess) {
      showToast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para recuperar tu cuenta.",
        variant: "success",
      });
    }

    if (isError) {
      showToast({
        title: "Error al enviar",
        description: (error as any)?.message || "Ocurrió un error al intentar enviar el correo.",
        variant: "error",
      });
    }
  }, [isSuccess, isError, error]);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      <img
        src="/fondo.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-11/12 md:w-3/5 h-auto md:h-4/5 backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Sección izquierda con formulario */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 overflow-auto">
            <h2 className="text-2xl font-bold text-white text-center p-10">
              Recuperar Contraseña
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 login-register">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border-b border-white placeholder:text-white focus:outline-none"
                required
              />
              <p className="text-sm text-gray-300 text-center">
                <a href="/" className="text-green-500 hover:underline">
                  Volver al inicio
                </a>
              </p>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-full"
                disabled={isPending}
              >
                {isPending ? "Enviando..." : "Enviar correo"}
              </button>
            </form>
          </div>

          {/* Separador vertical */}
          <div className="hidden md:block w-[1px] bg-white/30 h-4/5 self-center"></div>

          {/* Sección derecha con logo */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
            <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
            <p className="text-gray-300 text-center">
              Te enviaremos un enlace para recuperar tu cuenta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitarRecuperacion;
