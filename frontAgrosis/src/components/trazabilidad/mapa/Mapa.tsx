import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import axios from "axios"; // Para realizar la solicitud al backend
import "leaflet/dist/leaflet.css";

interface Lote {
  id: number;
  fk_id_ubicacion: number;
  dimencion: string;
  nombre_lote: string;
  estado: string;
}

const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (position: LatLngExpression) => void }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onLocationSelect([lat, lng]); // Pasa las coordenadas seleccionadas al componente padre
    },
  });

  return null;
};

const Mapa: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null); // Coordenadas seleccionadas
  const [lote, setLote] = useState<Lote | null>(null); // Datos del lote

  const handleLocationSelect = (newPosition: LatLngExpression) => {
    setPosition(newPosition);
    console.log("Ubicación seleccionada:", newPosition);

    // Hacer la solicitud a la API para obtener los datos del lote con las coordenadas seleccionadas
    axios
      .get(`http://127.0.0.1:8000/lote?lat=${newPosition[0]}&lng=${newPosition[1]}`)
      .then((response) => {
        setLote(response.data); // Guardar los datos del lote
        console.log("Datos del lote:", response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del lote:", error);
      });
  };

  return (
    <div style={{ height: "700px", width: "100%" }}>
      <MapContainer
        center={position || [1.8667, -76.0145]} // Si no hay posición seleccionada, usa la inicial
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Capa de mosaicos de OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Si hay una ubicación seleccionada, mostrar un marcador */}
        {position && (
          <Marker position={position}>
            <Popup>
              {lote ? (
                <>
                  <h3>{lote.nombre_lote}</h3>
                  <p>{lote.dimencion}</p>
                  <p>{lote.estado}</p>
                  {/* Puedes agregar más información sobre el lote aquí */}
                </>
              ) : (
                <p>Cargando información del lote...</p>
              )}
            </Popup>
          </Marker>
        )}

        {/* Componente para manejar la selección de ubicación */}
        <LocationPicker onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default Mapa;
