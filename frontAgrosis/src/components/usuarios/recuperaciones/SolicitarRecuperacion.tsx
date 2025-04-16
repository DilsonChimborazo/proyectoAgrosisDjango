import { useState } from "react";
import { useRecuperarContrasena } from "@/hooks/usuarios/recuperaciones/useRecuperarContrasena";
import logoAgrosis from "../../../../public/logo_proyecto-removebg-preview.png";

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isError, error, isSuccess } = useRecuperarContrasena();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  return (
    <div className="relative w-screen h-screen">
      <img src="/fondo.jpg" alt="Fondo" className="absolute inset-0 w-full object-cover z-0"/>
      <div className="absolute inset-0 bg-black opacity-70  z-10"></div>
      <div className="relative z-20 flex h-full w-full items-center justify-center ">
        <div className="flex w-3/5 h-4/5 backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Sección izquierda con formulario */}
          <div className="w-1/2 flex flex-col justify-center p-8">
            <h2 className="text-2xl font-bold text-gray-500 text-center">Recuperar Contraseña</h2>
            <p className="w-full px-4 py-2 bg-transparent border-b border-white placeholder">Ingrese su correo para recuperar acceso</p>
            {isSuccess && <p className="text-green-500 text-center mb-4">Correo enviado con éxito.</p>}
            {isError && <p className="text-red-500 text-center mb-4">{(error as any)?.message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border-b border-white placeholder"
                required
              />
              <p className="text-sm text-gray-500 text-center">
                <a href="/" className="text-green-600">
                  volver al incio
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

          <div className="w-[1px] bg-white/30 h-4/5 self-center"></div>

          {/* Sección derecha con logo */}
          <div className="w-1/2 flex flex-col items-center justify-center p-6">
            <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
            <p className="text-gray-300 text-center">Te enviaremos un enlace para recuperar tu cuenta.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitarRecuperacion;
