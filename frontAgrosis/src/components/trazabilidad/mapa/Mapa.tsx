import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

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

const DEFAULT_CENTER: LatLngExpression = [1.892074, -76.090376];

const MapUpdater = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const Mapa: React.FC<MapaProps> = ({ nuevaPlantacion }) => {
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<Plantacion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(DEFAULT_CENTER);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer && (mapContainer as any)._leaflet_id != null) {
      (mapContainer as any)._leaflet_id = null;
    }
  }, []);

  useEffect(() => {
    axios
      .get<Plantacion[]>(`${import.meta.env.VITE_API_URL}plantacion/`)
      .then((response) => {
        setPlantaciones(response.data);
      })
      .catch((error) => {
        console.error("Error cargando plantaciones:", error);
      });
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
      setMapCenter([
        nuevaPlantacion.latitud || DEFAULT_CENTER[0],
        nuevaPlantacion.longitud || DEFAULT_CENTER[1],
      ]);
      setShowModal(true);
    }
  }, [nuevaPlantacion]);

  const handleMarkerClick = (plantacion: Plantacion) => {
    setSelectedPlantacion(plantacion);
    setShowModal(true);
    setMapCenter([
      plantacion.latitud || DEFAULT_CENTER[0],
      plantacion.longitud || DEFAULT_CENTER[1],
    ]);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlantacion(null);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <MapContainer
        id="map"
        center={mapCenter}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {plantaciones.map(
          (plantacion) =>
            plantacion.latitud &&
            plantacion.longitud && (
              <Marker
                key={plantacion.id}
                position={[plantacion.latitud, plantacion.longitud]}
                eventHandlers={{
                  click: () => handleMarkerClick(plantacion),
                }}
              />
            )
        )}

        <MapUpdater center={mapCenter} />
      </MapContainer>

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
