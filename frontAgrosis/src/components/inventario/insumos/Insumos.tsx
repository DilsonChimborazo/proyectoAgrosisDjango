import { useInsumo } from '@/hooks/inventario/insumos/useInsumo';
import Tabla from '@/components/globales/Tabla';
import VentanaModal from '@/components/globales/VentanasModales';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ListarInsumos = () => {
  const { data: insumos, isLoading, error } = useInsumo();
  const [selectedInsumo, setSelectedInsumo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const SafeImage = ({ src, alt, className, placeholderText = 'Sin imagen' }: { 
    src: string | null | undefined, 
    alt: string, 
    className: string,
    placeholderText?: string 
  }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      if (src) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const cleanPath = src.startsWith('http') ? src : `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
        const img = new Image();
        img.src = cleanPath;
        img.onload = () => setImageSrc(cleanPath);
        img.onerror = () => setHasError(true);
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
      <img src={imageSrc} alt={alt} className={className} onError={() => setHasError(true)} />
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
      src={typeof i.img === 'string' ? i.img : null} 
      alt={`Imagen de ${i.nombre}`} 
      className="w-12 h-12 object-cover rounded-full"
    />,
    nombre: i.nombre,
    tipo: i.tipo,
    precio_unidad: i.precio_unidad ? `$${i.precio_unidad.toLocaleString()}` : '$0',
    stock: i.cantidad_insumo,
    fecha_vencimiento: i.fecha_vencimiento,
    unidad_medida: i.fk_unidad_medida 
    ? `${i.fk_unidad_medida.nombre_medida} (${i.fk_unidad_medida.unidad_base})` 
    : 'N/A'
  })) || [];

  console.log("prueba",mappedInsumos)

  return (
    <div className="container mx-auto p-4">
      <Tabla
        title="Insumos"
        headers={["ID", "Imagen", "Nombre", "Tipo", "Precio Unidad", "Stock","Fecha vencimiento", "Unidad Medida"]}
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
                  src={typeof selectedInsumo.img === 'string' ? selectedInsumo.img : null} 
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
                  <p>{selectedInsumo.fk_unidad_medida?.nombre_medida || 'No especificada'}</p>
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
