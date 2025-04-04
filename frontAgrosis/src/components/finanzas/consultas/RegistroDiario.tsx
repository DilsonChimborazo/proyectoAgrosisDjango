import { useState } from 'react';
import { useReporteProgramacion } from '../../../hooks/finanzas/consultas/useRegistroDiarioWebHook';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const TablaProgramacion = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  const { data, isLoading, error } = useReporteProgramacion(year, month);

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calcular total de todas las actividades
  const totalGeneral = data?.reduce((acc, row) => acc + (row.total || 0), 0) || 0;

  return (
    <Card className="p-6 shadow-2xl rounded-3xl bg-white border border-gray-200">
      <CardContent>
        {/* Título y Selectores */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <h2 className="text-2xl font-bold text-black uppercase tracking-wide">
            Registro Diario de Campo (Agrícola)
          </h2>

          <div className="flex gap-4">
            <Select onValueChange={(value) => setYear(Number(value))} value={year.toString()}>
              <SelectTrigger className="w-28 bg-green-800 text-white font-semibold rounded-xl px-3 py-2 shadow-md hover:bg-green-800 transition-all">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setMonth(Number(value))} value={month.toString()}>
              <SelectTrigger className="w-32 bg-green-800 text-white font-semibold rounded-xl px-3 py-2 shadow-md hover:bg-green-800 transition-all">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <SelectItem key={m} value={m.toString()}>{format(new Date(2023, m - 1, 1), 'MMMM')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : error ? (
          <p className="text-red-500 text-center font-medium">Error al cargar los datos</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <TableHeader className="bg-green-800 text-white">
                <TableRow>
                  <TableHead className="text-center px-4 py-3 font-bold text-white">Actividad</TableHead>
                  {days.map(day => (
                    <TableHead key={day} className="text-center px-2 py-3 font-bold text-white">{day}</TableHead>
                  ))}
                  <TableHead className="font-bold bg-green-800 text-white text-center px-4 py-3">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow key={index} className="hover:bg-green-100 transition-all">
                    <TableCell className="font-medium text-gray-900 text-center px-4 py-2 border border-gray-300">
                      {row.fk_id_asignacionActividades__fk_id_actividad__nombre_actividad}
                    </TableCell>
                    {days.map(day => (
                      <TableCell key={day} className="text-center px-2 py-2 border border-gray-300">{row[`day_${day}`] || 0}</TableCell>
                    ))}
                    <TableCell className="font-bold bg-green-800 text-white text-center px-4 py-2 border border-gray-300">{row.total}</TableCell>
                  </TableRow>
                ))}

                {/* Fila de Total General */}
                <TableRow className="bg-green-800 text-white font-bold hover:bg-green-800">
                  <TableCell className="text-right px-4 py-2 border border-gray-300" colSpan={days.length + 1}>Total General:</TableCell>
                  <TableCell className="text-center px-4 py-2 border border-gray-300">{totalGeneral}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TablaProgramacion;
