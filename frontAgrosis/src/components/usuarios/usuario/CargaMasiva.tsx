// src/components/usuarios/CargaMasivaUsuarios.tsx
import React, { useState } from 'react';
import { useCargaMasivaUsuarios } from '@/hooks/usuarios/usuario/useCargaMasiva'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CargaMasivaUsuariosProps {
  onClose: () => void;
}

const CargaMasivaUsuarios: React.FC<CargaMasivaUsuariosProps> = ({ onClose }) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const mutation = useCargaMasivaUsuarios();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo) {
      console.error("Debes seleccionar un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);
    mutation.mutate(formData, {
      onSuccess: () => {
        console.log("Carga masiva exitosa");
        onClose(); // Cierra la ventana al finalizar
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Cargando...' : 'Subir Archivo'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </div>

      {mutation.isError && (
        <p className="text-red-500 text-sm">Error al cargar archivo.</p>
      )}
      {mutation.isSuccess && (
        <p className="text-green-500 text-sm">Usuarios cargados exitosamente.</p>
      )}
    </form>
  );
};

export default CargaMasivaUsuarios;
