import { useState, useEffect } from "react";
import axios from "axios";

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

export interface Lotes {
  id: number;
  fk_id_ubicacion: Ubicacion | null;
  dimencion: string;
  nombre_lote: string;
  estado: string;
}

const useLotesActivos = () => {
  const [lotes, setLotes] = useState<Lotes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get<Lotes[]>("http://127.0.0.1:8000/api/lote/lotesActivos");
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
