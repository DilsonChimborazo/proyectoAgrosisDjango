import React, { useState, useEffect } from "react";
import axios from "axios";

// Definir la interfaz para Era
interface Era {
  id: number;
  descripcion: string;
  fk_id_lote_id: number; // ID del lote al que pertenece la era
}

// Definir la interfaz para Lote
interface Lote {
  id: number;
  nombre_lote: string;
  dimencion: string;
  estado: string;
  eras: Era[]; // Relación de eras con el lote
}

// Componente que muestra los cartas de los lotes con sus respectivas eras
const LotesCards: React.FC = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);

  // Función para obtener los lotes y las eras desde la API
  const fetchData = async () => {
    try {
      // Obtener los lotes
      const lotesResponse = await axios.get("http://127.0.0.1:8000/api/lote");
      const erasResponse = await axios.get("http://127.0.0.1:8000/api/eras");

      const lotesData: Lote[] = lotesResponse.data || [];
      const erasData: Era[] = erasResponse.data || [];
      console.log(lotesData)
      console.log(erasData)

      // Mapear los lotes y agregarles las eras correspondientes
      const lotesConEras = lotesData.map((lote) => ({
        ...lote,
        eras: erasData.filter((era) => Number(era.fk_id_lote_id) === Number(lote.id)),
      }));
      console.log("Lotes con eras agrupadas:", lotesConEras);


      // Actualizar el estado con los lotes agrupados
      setLotes(lotesConEras);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotes.map((lote) => (
          <div key={lote.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
            <h3 className="text-xl font-semibold mb-2">{lote.nombre_lote}</h3>
            <p className="text-sm text-gray-600">Dimensión: {lote.dimencion}</p>
            <p className="text-sm text-gray-600">Estado: {lote.estado}</p>

            {/* Mostrar las Eras del Lote */}
            <div className="mt-4 ">
              <h4 className="font-medium text-lg">Eras</h4>
              {lote.eras.length > 0 ? (
                <ul className="mt-2 bg-gray-500 ">
                  {lote.eras.map((era) => (
                    <li key={era.id} className="text-sm text-gray-600">
                      {era.descripcion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No hay eras registradas.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LotesCards;
