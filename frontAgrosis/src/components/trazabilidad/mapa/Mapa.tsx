import React, { useEffect, useState } from "react";
import Map, { Marker, Popup, ViewStateChangeEvent } from "react-map-gl";
import maplibregl from "maplibre-gl"; // ✅ Importación correcta
import "maplibre-gl/dist/maplibre-gl.css";
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

const DEFAULT_CENTER = {
  latitude: 1.892074,
  longitude: -76.090376,
  zoom: 10,
};

const Mapa: React.FC<MapaProps> = ({ nuevaPlantacion }) => {
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<Plantacion | null>(null);
  const [viewState, setViewState] = useState(DEFAULT_CENTER);

  useEffect(() => {
    axios
      .get<Plantacion[]>(`plantacion/`)
      .then((res) => {
        setPlantaciones(res.data);
      })
      .catch((err) => console.error("Error cargando plantaciones:", err));
  }, []);

  useEffect(() => {
    if (
      nuevaPlantacion &&
      nuevaPlantacion.latitud &&
      nuevaPlantacion.longitud &&
      !plantaciones.some((p) => p.id === nuevaPlantacion.id)
    ) {
      setPlantaciones((prev) => [...prev, nuevaPlantacion]);
      setSelectedPlantacion(nuevaPlantacion);
      setViewState({
        ...viewState,
        latitude: nuevaPlantacion.latitud,
        longitude: nuevaPlantacion.longitud,
      });
    }
  }, [nuevaPlantacion]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Map
        {...viewState}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapLib={maplibregl as unknown as any}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {plantaciones.map((plantacion) =>
          plantacion.latitud && plantacion.longitud ? (
            <Marker
              key={plantacion.id}
              longitude={plantacion.longitud}
              latitude={plantacion.latitud}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedPlantacion(plantacion);
                setViewState({
                  ...viewState,
                  longitude: plantacion.longitud!,
                  latitude: plantacion.latitud!,
                });
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="marker"
                style={{ width: 30, height: 30 }}
              />
            </Marker>
          ) : null
        )}

        {selectedPlantacion && selectedPlantacion.latitud && selectedPlantacion.longitud && (
          <Popup
            longitude={selectedPlantacion.longitud}
            latitude={selectedPlantacion.latitud}
            anchor="top"
            onClose={() => setSelectedPlantacion(null)}
          >
            <div>
              <h4>Plantación #{selectedPlantacion.id}</h4>
              <p><strong>Cultivo:</strong> {selectedPlantacion.fk_id_cultivo?.nombre_cultivo || "N/A"}</p>
              <p><strong>Ubicación:</strong> {selectedPlantacion.latitud}, {selectedPlantacion.longitud}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default Mapa;
