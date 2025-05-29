import React, { useEffect, useState, useMemo } from 'react';
import { obtenerFaseLunar } from '@/hooks/trazabilidad/calendarioLunar/apiLunar';
import CrearCalendarioLunar from './CrearCalendarioLunar';
import { useCalendarioLunar, CalendarioLunar as EventoCalendario } from '@/hooks/trazabilidad/calendarioLunar/useCalendarioLunar';

interface DiaLunar {
  fecha: string;
  fase: string;
}

const traducirFase = (fase: string): string => {
  const traducciones: Record<string, string> = {
    'New Moon': 'Luna nueva',
    'Waxing Crescent': 'Luna creciente',
    'First Quarter': 'Cuarto creciente',
    'Waxing Gibbous': 'Gibosa creciente',
    'Full Moon': 'Luna llena',
    'Waning Gibbous': 'Gibosa menguante',
    'Last Quarter': 'Cuarto menguante',
    'Waning Crescent': 'Luna menguante',
  };
  return traducciones[fase] || fase;
};

const colorFase = (fase: string): string => {
  const colores: Record<string, string> = {
    'New Moon': 'bg-gray-800',
    'Waxing Crescent': 'bg-green-500',
    'First Quarter': 'bg-yellow-400',
    'Waxing Gibbous': 'bg-blue-400',
    'Full Moon': 'bg-purple-500',
    'Waning Gibbous': 'bg-indigo-400',
    'Last Quarter': 'bg-pink-400',
    'Waning Crescent': 'bg-red-400',
  };
  return colores[fase] || 'bg-gray-300';
};

const CalendarioLunar: React.FC = () => {
  const [datos, setDatos] = useState<DiaLunar[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const fechaActual = new Date();
  const anio = fechaActual.getFullYear();
  const mes = fechaActual.getMonth(); // 0-indexed
  const nombreMes = fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const { data: eventos, refetch } = useCalendarioLunar();

  useEffect(() => {
    const obtenerDatos = async () => {
      const diasEnMes = new Date(anio, mes + 1, 0).getDate();
      const promesas = [];

      for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = `${anio}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        promesas.push(obtenerFaseLunar(fecha).then(fase => ({ fecha, fase })));
      }

      const resultados = await Promise.all(promesas);
      setDatos(resultados);
    };

    obtenerDatos();
  }, [anio, mes]);

  // Agrupar eventos por fecha para mostrar varios en el mismo día
  const eventosPorFecha = useMemo(() => {
    const agrupados: Record<string, EventoCalendario[]> = {};
    eventos?.forEach(evento => {
      if (!agrupados[evento.fecha]) {
        agrupados[evento.fecha] = [];
      }
      agrupados[evento.fecha].push(evento);
    });
    return agrupados;
  }, [eventos]);

  const primerDiaSemana = new Date(anio, mes, 1).getDay();
  const diasVacios = Array(primerDiaSemana).fill(null);

  const abrirModal = (fecha: string) => {
    setFechaSeleccionada(fecha);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFechaSeleccionada('');
    refetch();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gray-100 rounded-2xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 capitalize text-gray-700">{nombreMes}</h2>

        <div className="grid grid-cols-7 gap-2 mb-3 text-center font-semibold text-gray-500">
          <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {diasVacios.map((_, index) => (
            <div key={`vacio-${index}`} className="h-24"></div>
          ))}

          {datos.map(dia => {
            const eventosDelDia = eventosPorFecha[dia.fecha] || [];

            return (
              <div
                key={dia.fecha}
                className="bg-white h-24 p-2 rounded-xl shadow-md flex flex-col justify-between border border-gray-200 cursor-pointer hover:bg-gray-200 relative"
                onClick={() => abrirModal(dia.fecha)}
                title={`Fase lunar: ${traducirFase(dia.fase)}${eventosDelDia.length > 0 ? ` - ${eventosDelDia.length} evento(s)` : ''}`}
              >
                <span className="text-gray-800 font-bold z-20 relative">
                  {Number(dia.fecha.split('-')[2])}
                </span>

                {/* Eventos sobre la fase lunar */}
                <div className="absolute top-6 left-2 right-2 max-h-12 overflow-y-auto text-[10px] text-blue-700 z-30">
                  {eventosDelDia.map(evento => (
                    <span key={evento.id} title={evento.descripcion_evento} className="block truncate">
                      📌 {evento.evento}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-600 mt-auto z-10 relative">
                  <span
                    className={`w-3 h-3 rounded-full ${colorFase(dia.fase)}`}
                    title={traducirFase(dia.fase)}
                  ></span>
                  <span className="truncate">{traducirFase(dia.fase)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalAbierto && (
        <CrearCalendarioLunar
          closeModal={cerrarModal}
          fechaInicial={fechaSeleccionada}
        />
      )}
    </div>
  );
};

export default CalendarioLunar;
