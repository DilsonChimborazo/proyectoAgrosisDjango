import { useInsumo } from '@/hooks/inventario/insumos/useInsumo';
import Tabla from '@/components/globales/Tabla';
import VentanaModal from '@/components/globales/VentanasModales';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListarInsumos = () => {
  const { data: insumos, isLoading, error } = useInsumo();
  const [selectedInsumo, setSelectedInsumo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Componente de imagen seguro
  const SafeImage = ({ src, alt, className, placeholderText = 'Sin imagen' }: { 
    src: string | null | undefined, 
    alt: string, 
    className: string,
    placeholderText?: string 
  }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    // Función para construir la URL de la imagen
    const getImageUrl = (imgPath: string | null | undefined): string | null => {
      if (!imgPath) return null;
      
      // Si ya es una URL completa
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        return imgPath;
      }
      
      // Construir URL completa para rutas relativas
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const cleanPath = imgPath.replace(/^\/+/, ''); // Eliminar barras iniciales
      
      return `${baseUrl}/${cleanPath}`;
    };
    // Efecto para cargar la URL de la imagen
    useState(() => {
      if (src) {
        const url = getImageUrl(src);
        if (url) {
          // Verificar si la imagen existe antes de establecerla
          const img = new Image();
          img.src = url;
          img.onload = () => setImageSrc(url);
          img.onerror = () => setHasError(true);
        } else {
          setHasError(true);
        }
      } else {
        setHasError(true);
      }
    }, [src]);

    if (hasError || !imageSrc) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <span className="text-xs text-gray-500">{placeholderText}</span>
        </div>
      );
    }

    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
      />
    );
  };

  const handleRowClick = (insumo: any) => {
    setSelectedInsumo(insumo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInsumo(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (insumo: { id: number }) => {
    navigate(`/ActualizarInsumos/${insumo.id}`);
  };

  const handleCreate = () => {
    navigate("/CrearInsumos");
  };

  if (isLoading) return <div className="text-center p-4 text-gray-500">Cargando insumos...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error al cargar los insumos: {error.message}</div>;

  const mappedInsumos = insumos?.map((i) => ({
    id: i.id,
    imagen: <SafeImage 
      src={i.img} 
      alt={`Imagen de ${i.nombre}`} 
      className="w-12 h-12 object-cover rounded-full"
    />,
    nombre: i.nombre,
    tipo: i.tipo,
    precio_unidad: i.precio_unidad ? `$${i.precio_unidad.toLocaleString()}` : '$0',
    stock: i.cantidad,
    unidad_medida: i.fk_unidad_medida?.abreviatura || 'N/A',
  })) || [];

  return (
    <div className="container mx-auto p-4">
      <Tabla
        title="Insumos"
        headers={["ID", "Imagen", "Nombre", "Tipo", "Precio Unidad", "Stock", "Unidad Medida"]}
        data={mappedInsumos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Insumo"
      />
      
      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        titulo={`Detalles: ${selectedInsumo?.nombre || 'Insumo'}`}
        contenido={
          selectedInsumo && (
            <div className="p-4">
              <div className="flex items-center mb-4">
                <SafeImage 
                  src={selectedInsumo.imagen} 
                  alt={`Imagen de ${selectedInsumo.nombre}`}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                  placeholderText="Imagen no disponible"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedInsumo.nombre}</h3>
                  <p className="text-gray-600">{selectedInsumo.tipo}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">Precio por unidad:</p>
                  <p>{selectedInsumo.precio_unidad ? `$${selectedInsumo.precio_unidad.toLocaleString()}` : 'No especificado'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">Stock disponible:</p>
                  <p>{selectedInsumo.cantidad || '0'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">Unidad de medida:</p>
                  <p>
                    {selectedInsumo.unidad_medida?.nombre || 'No especificada'} 
                    {selectedInsumo.unidad_medida?.abreviatura && ` (${selectedInsumo.unidad_medida.abreviatura})`}
                  </p>
                </div>
                
                {selectedInsumo.fecha_vencimiento && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">Fecha de vencimiento:</p>
                    <p>{new Date(selectedInsumo.fecha_vencimiento).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      />
    </div>
  );
};

export default ListarInsumos;