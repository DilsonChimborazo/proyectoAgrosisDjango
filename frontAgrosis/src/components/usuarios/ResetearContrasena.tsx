import { useState, useEffect } from "react";
import { useResetearContrasena } from "../../hooks/usuarios/useResetearContrasena";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetearContrasena = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  useEffect(() => {
    console.log("Token recibido:", token);
    console.log("ID recibido:", id);
  }, [token, id]);

  const [password, setPassword] = useState("");
  const { mutate, isPending, isSuccess, isError, error } = useResetearContrasena();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) {
      alert("El enlace es inválido o ha expirado. Intenta nuevamente.");
      return;
    }
    mutate({ token, id, password });
    navigate("/");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Restablecer Contraseña</h2>

        {!token || !id ? (
          <p className="text-red-500 text-center mt-4">
            Enlace inválido o expirado. Solicita otro correo de recuperación.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-md"
              disabled={isPending}
            >
              {isPending ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}

        {isSuccess && <p className="text-green-500 text-center mt-4">¡Contraseña actualizada con éxito!</p>}
        {isError && <p className="text-red-500 text-center mt-4">{(error as any)?.message}</p>}
      </div>
    </div>
  );
};

export default ResetearContrasena;
