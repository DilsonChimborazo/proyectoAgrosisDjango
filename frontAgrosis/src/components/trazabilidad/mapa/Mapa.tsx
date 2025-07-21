import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Cultivo {
  id: number;
  nombre_cultivo: string;
}

interface Eras {
  id: number;
  nombre: string;
}

interface Semillero {
  id: number;
  nombre_semilla: string;
}

interface Plantacion {
  id: number;
  cantidad_transplante: number;
  fecha_plantacion: string;
  fk_id_cultivo: Cultivo | null;
  fk_id_eras: Eras | null;
  fk_id_semillero: Semillero | null;
  latitud: number | null;
  longitud: number | null;
}

interface MapaProps {
  nuevaPlantacion?: Plantacion;
}

const DEFAULT_CENTER = { lat: 1.892074, lng: -76.090376 };

const Mapa: React.FC<MapaProps> = ({ nuevaPlantacion }) => {
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<Plantacion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Cargar la API de Google Maps dinámicamente
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Inicializar el mapa
  const initMap = () => {
    if (mapRef.current && window.google) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 10,
      });
      loadPlantaciones();
    }
  };

  // Cargar plantaciones desde la API
  const loadPlantaciones = () => {
    axios
      .get<Plantacion[]>(`${import.meta.env.VITE_API_URL}plantacion/`)
      .then((response) => {
        setPlantaciones(response.data);
        updateMarkers(response.data);
      })
      .catch((error) => {
        console.error("Error cargando plantaciones:", error);
      });
  };

  // Actualizar marcadores en el mapa
  const updateMarkers = (plantaciones: Plantacion[]) => {
    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (!mapInstance.current) return;

    // Añadir nuevos marcadores
    plantaciones.forEach((plantacion) => {
      if (plantacion.latitud && plantacion.longitud) {
        const marker = new google.maps.Marker({
          position: { lat: plantacion.latitud, lng: plantacion.longitud },
          map: mapInstance.current,
          title: `Plantación #${plantacion.id}`,
        });

        marker.addListener("click", () => handleMarkerClick(plantacion));
        markersRef.current.push(marker);
      }
    });
  };

  // Efecto para nueva plantación
  useEffect(() => {
    if (nuevaPlantacion) {
      const updatedPlantaciones = [...plantaciones];
      if (!plantaciones.some((p) => p.id === nuevaPlantacion.id)) {
        updatedPlantaciones.push(nuevaPlantacion);
        setPlantaciones(updatedPlantaciones);
      }
      setSelectedPlantacion(nuevaPlantacion);
      setMapCenter({
        lat: nuevaPlantacion.latitud || DEFAULT_CENTER.lat,
        lng: nuevaPlantacion.longitud || DEFAULT_CENTER.lng,
      });
      setShowModal(true);
    }
  }, [nuevaPlantacion]);

  // Mover el mapa al centro actual
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(mapCenter);
    }
  }, [mapCenter]);

  const handleMarkerClick = (plantacion: Plantacion) => {
    setSelectedPlantacion(plantacion);
    setShowModal(true);
    setMapCenter({
      lat: plantacion.latitud || DEFAULT_CENTER.lat,
      lng: plantacion.longitud || DEFAULT_CENTER.lng,
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlantacion(null);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Contenedor del mapa */}
      <div
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
      />

      {/* Modal de detalles */}
      {showModal && selectedPlantacion && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            maxWidth: "400px",
          }}
        >
          <h3>Plantación #{selectedPlantacion.id}</h3>
          <p><strong>Cultivo:</strong> {selectedPlantacion.fk_id_cultivo?.nombre_cultivo || "N/A"}</p>
          <p><strong>Ubicación:</strong> {selectedPlantacion.latitud}, {selectedPlantacion.longitud}</p>
          <button onClick={closeModal}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default Mapa;