import { useState } from "react";
import { useRecuperarContrasena } from "../../hooks/usuarios/useRecuperarContrasena";
import logoAgrosis from "../../../public/logo_proyecto-removebg-preview.png";

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isError, error, isSuccess } = useRecuperarContrasena();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white relative">
      <div className="flex w-3/5 h-4/5 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Sección izquierda con formulario */}
        <div className="w-1/2 flex flex-col justify-center p-8 bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Recuperar Contraseña</h2>
          <p className="text-center text-gray-500 mb-6">Ingrese su correo para recuperar acceso</p>
          {isSuccess && <p className="text-green-500 text-center mb-4">Correo enviado con éxito.</p>}
          {isError && <p className="text-red-500 text-center mb-4">{(error as any)?.message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-md"
              disabled={isPending}
            >
              {isPending ? "Enviando..." : "Enviar correo"}
            </button>
          </form>
        </div>
        
        {/* Sección derecha con logo */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white p-6">
          <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
          <p className="text-gray-600 text-center">Te enviaremos un enlace para recuperar tu cuenta.</p>
        </div>
      </div>
    </div>
  );
};

export default SolicitarRecuperacion;
