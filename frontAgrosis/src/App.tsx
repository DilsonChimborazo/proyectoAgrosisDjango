import { Routes, Route } from 'react-router-dom';
import Login from './components/InicioSesion'
import Principal from './components/Principal'; 
import HomePage from './pages/HomePage'; 
import UsersPage from './pages/UsersPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/principal" element={<Principal><HomePage /></Principal>} />
      <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
      <Route path="/calendario" element={<Principal><CalendarPage /></Principal>} />
    </Routes>
  );
}

export default App;
