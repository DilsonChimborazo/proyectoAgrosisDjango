import { useState } from "react";
import { useRecuperarContrasena } from "../../hooks/usuarios/useRecuperarContrasena";

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isError, error, isSuccess } = useRecuperarContrasena(); // ✅ Cambié isLoading por isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full mt-3 bg-blue-500 text-white py-2 rounded"
          disabled={isPending}
        >
          {isPending ? "Enviando..." : "Enviar correo"}
        </button>
      </form>

      {isSuccess && <p className="text-green-500 mt-2">Correo enviado con éxito.</p>}
      {isError && <p className="text-red-500 mt-2">{(error as any)?.message}</p>}
    </div>
  );
};

export default SolicitarRecuperacion;
