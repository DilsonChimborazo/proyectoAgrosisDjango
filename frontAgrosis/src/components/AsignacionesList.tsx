import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table } from '@net-ui/react';

// Tipos para las asignaciones (estos deben coincidir con la estructura de tu API)
interface Asignacion {
  id: number;
  fk_id_actividad: { nombre_actividad: string };
  id_identificacion: { nombre: string };
  fecha: string;
  observaciones: string;
}

const fetchAsignaciones = async (): Promise<Asignacion[]> => {
  const response = await fetch('http://localhost:8000/api/asignaciones/');  // URL de tu API
  if (!response.ok) {
    throw new Error('Error fetching asignaciones');
  }
  return response.json();
};

const AsignacionesList: React.FC = () => {
  const { data, error, isLoading } = useQuery<Asignacion[]>(['asignaciones'], fetchAsignaciones);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>Actividad</th>
          <th>Usuario</th>
          <th>Fecha</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((asignacion) => (
          <tr key={asignacion.id}>
            <td>{asignacion.fk_id_actividad.nombre_actividad}</td>
            <td>{asignacion.id_identificacion.nombre}</td>
            <td>{asignacion.fecha}</td>
            <td>{asignacion.observaciones}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AsignacionesList;
