import { useState, useEffect } from "react";
import { useResetearContrasena } from "../../hooks/usuarios/useResetearContrasena";
import { useSearchParams } from "react-router-dom";

const ResetearContrasena = () => {
  const [searchParams] = useSearchParams();
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
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Restablecer Contraseña</h2>

      {!token || !id ? (
        <p className="text-red-500">
          Enlace inválido o expirado. Solicita otro correo de recuperación.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full mt-3 bg-green-500 text-white py-2 rounded"
            disabled={isPending}
          >
            {isPending ? "Restableciendo..." : "Restablecer Contraseña"}
          </button>
        </form>
      )}

      {isSuccess && <p className="text-green-500 mt-2">¡Contraseña actualizada con éxito!</p>}
      {isError && <p className="text-red-500 mt-2">{(error as any)?.message}</p>}
    </div>
  );
};

export default ResetearContrasena;
