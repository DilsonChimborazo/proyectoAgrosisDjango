import Datos from "../components/iot/Datos";

const HomePage = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Sección de Bienvenida */}
      
      <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Dashboard de Sensores y Mediciones
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Tarjeta para mostrar sensores */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Sensores</h2>
          <p className="text-gray-600">Aquí se mostrarán los sensores activos en el sistema.</p>
        </div>

        {/* Tarjeta para mostrar las últimas mediciones */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Mediciones</h2>
          <p className="text-gray-600">Datos recientes registrados por los sensores.</p>
        </div>
      </div>

      {/* Sección para mostrar las mediciones en detalle */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Gráfico de Mediciones</h2>
        <Datos />
        
      </div>
    </div>
  );
};

export default HomePage;
