import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/InicioSesion';
import Principal from './components/Principal'; 
import HomePage from './pages/HomePage'; 
import UsersPage from './pages/UsersPage';
import CalendarPage from './pages/CalendarPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<Principal><HomePage /></Principal>} />
        <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
        <Route path="/calendario" element={<Principal><CalendarPage /></Principal>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
