import { useReporteEgresos } from "../../../hooks/finanzas/consultas/useReporteInsumos";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TablaEgresos = () => {
  const { data, isLoading, error } = useReporteEgresos();

  // Calcular el total general de egresos
  const totalGeneral = data?.reduce((acc, row) => acc + row.total, 0) || 0;

  return (
    <Card className="p-6 shadow-2xl rounded-3xl bg-white border border-gray-200">
      <CardContent>
        <h2 className="text-2xl font-bold text-black text-center mb-6 uppercase tracking-wide">
          Reporte de Egresos por Insumos
        </h2>

        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : error ? (
          <p className="text-red-500 text-center font-medium">Error al cargar los datos</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <TableHeader className="bg-green-800 text-white">
                <TableRow>
                  <TableHead className="text-center text-white px-4 py-3 font-bold">Tipo</TableHead>
                  <TableHead className="text-center text-white px-4 py-3 font-bold">Nombre</TableHead>
                  <TableHead className="text-center text-white px-4 py-3 font-bold">Insumos</TableHead>
                  <TableHead className="text-center text-white px-4 py-3 font-bold">Costos</TableHead>
                  <TableHead className="font-bold bg-green-800 text-white text-center px-4 py-3">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow key={index} className="hover:bg-green-100 transition-all">
                    <TableCell className="text-center px-4 py-2 border border-gray-300">{row.tipo}</TableCell>
                    <TableCell className="text-center px-4 py-2 border border-gray-300">{row.nombre}</TableCell>
                    <TableCell className="text-center px-4 py-2 border border-gray-300">{row.insumos}</TableCell>
                    <TableCell className="text-center px-4 py-2 border border-gray-300">{row.costos}</TableCell>
                    <TableCell className="font-bold bg-green-800 text-white text-center px-4 py-2 border border-gray-300">
                      {row.total}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Fila de Total General */}
                <TableRow className="bg-green-800 text-white font-bold hover:bg-green-800">
                  <TableCell className="text-right px-4 py-2 border border-gray-300" colSpan={4}>
                    Total General:
                  </TableCell>
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

export default TablaEgresos;
