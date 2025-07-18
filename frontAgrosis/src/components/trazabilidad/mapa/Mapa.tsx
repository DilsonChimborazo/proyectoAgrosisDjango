import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

// Interfaces como las tienes
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

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const DEFAULT_CENTER = {
  lat: 1.892074,
  lng: -76.090376,
};

const Mapa: React.FC<MapaProps> = ({ nuevaPlantacion }) => {
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<Plantacion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    axios
      .get<Plantacion[]>(`${import.meta.env.VITE_API_URL}plantacion/`)
      .then((res) => setPlantaciones(res.data))
      .catch((err) => console.error("Error cargando plantaciones:", err));
  }, []);

  useEffect(() => {
    if (nuevaPlantacion) {
      setPlantaciones((prev) => {
        if (!prev.some((p) => p.id === nuevaPlantacion.id)) {
          return [...prev, nuevaPlantacion];
        }
        return prev;
      });
      setSelectedPlantacion(nuevaPlantacion);
      setMapCenter({
        lat: nuevaPlantacion.latitud || DEFAULT_CENTER.lat,
        lng: nuevaPlantacion.longitud || DEFAULT_CENTER.lng,
      });
      setShowModal(true);
    }
  }, [nuevaPlantacion]);

  const handleMarkerClick = (plantacion: Plantacion) => {
    setSelectedPlantacion(plantacion);
    setMapCenter({
      lat: plantacion.latitud || DEFAULT_CENTER.lat,
      lng: plantacion.longitud || DEFAULT_CENTER.lng,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlantacion(null);
  };

  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
      >
        {plantaciones.map(
          (plantacion) =>
            plantacion.latitud &&
            plantacion.longitud && (
              <Marker
                key={plantacion.id}
                position={{
                  lat: plantacion.latitud,
                  lng: plantacion.longitud,
                }}
                onClick={() => handleMarkerClick(plantacion)}
              />
            )
        )}
      </GoogleMap>

      {showModal && selectedPlantacion && (
        <>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              padding: "40px",
              boxShadow: "0 0 15px rgba(0,0,0,0.5)",
              zIndex: 1000,
              maxWidth: "800px",
              minWidth: "600px",
              borderRadius: "12px",
              overflowY: "auto",
              maxHeight: "80vh",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#666",
              }}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <h3 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
              Plantación #{selectedPlantacion.id}
            </h3>
            <p><strong>Cantidad Transplante:</strong> {selectedPlantacion.cantidad_transplante}</p>
            <p><strong>Fecha Plantación:</strong> {selectedPlantacion.fecha_plantacion}</p>
            <p><strong>Cultivo:</strong> {selectedPlantacion.fk_id_cultivo?.nombre_cultivo || "Sin Cultivo"}</p>
            <p><strong>Era:</strong> {selectedPlantacion.fk_id_eras?.nombre || "Sin Era"}</p>
            <p><strong>Semillero:</strong> {selectedPlantacion.fk_id_semillero?.nombre_semilla || "Sin Semillero"}</p>
            <p><strong>Latitud:</strong> {selectedPlantacion.latitud || "No definida"}</p>
            <p><strong>Longitud:</strong> {selectedPlantacion.longitud || "No definida"}</p>
          </div>

          <div
            onClick={closeModal}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
              pointerEvents: showModal ? "auto" : "none",
            }}
          />
        </>
      )}
    </div>
  );
};

export default Mapa;