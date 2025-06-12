// src/components/usuarios/CargaMasivaUsuarios.tsx
import React, { useState } from 'react';
import { useCargaMasivaUsuarios } from '@/hooks/usuarios/usuario/useCargaMasiva'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/globales/Toast'; 
import { useNavigate } from 'react-router-dom';

interface CargaMasivaUsuariosProps {
  onClose: () => void;
}

const CargaMasivaUsuarios: React.FC<CargaMasivaUsuariosProps> = ({ onClose }) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const mutation = useCargaMasivaUsuarios();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo) {
      showToast({
        title: 'Archivo requerido',
        description: 'Debes seleccionar un archivo .csv o .xlsx',
        variant: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    mutation.mutate(formData, {
      onSuccess: (data) => {
        showToast({
          title: 'Carga exitosa',
          description: `Usuarios cargados: ${data?.creados?.length || 0}`,
          variant: 'success',
        });

        navigate('/usuarios');
      },
      onError: () => {
        showToast({
          title: 'Error en la carga',
          description: 'Ocurrió un error al cargar el archivo',
          variant: 'error',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
      <div className="flex gap-2 flex-wrap">
        <Button type="submit" className="bg-green-600 text-white hover:bg-green-700" disabled={mutation.isPending}>
          {mutation.isPending ? 'Cargando...' : 'Subir Archivo'}
        </Button>

        {/* Botón para descargar el formato Excel */}
        <a
          href="/plantillas/plantilla_usuarios.xlsx"
          download
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
        >
          Descargar Formato Excel
        </a>

        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default CargaMasivaUsuarios;
