// App.jsx
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Importa tus componentes
import Login from "./components/usuarios/InicioSesion";
import Principal from "./components/globales/Principal";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import CalendarPage from "./pages/CalendarPage";

// Crear el cliente de React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Ruta para el inicio de sesión */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas, todas envueltas por el Layout Principal */}
        <Route path="/principal" element={<Principal><HomePage /></Principal>} />
        <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
        <Route path="/calendario" element={<Principal><CalendarPage /></Principal>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
