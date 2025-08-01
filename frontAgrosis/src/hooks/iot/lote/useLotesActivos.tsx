import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;


export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

export interface Lotes {
  id: number;
  dimencion: string;
  nombre_lote: string;
  estado: boolean;
}

const useLotesActivos = () => {
  const [lotes, setLotes] = useState<Lotes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get<Lotes[]>(`${apiUrl}lote/lotesActivos`);
        setLotes(response.data);
      } catch (err: any) {
        setError(err?.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchLotes();
  }, []);

  return { lotes, loading, error };
};

export default useLotesActivos;
