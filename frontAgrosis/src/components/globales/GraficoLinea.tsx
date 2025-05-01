// components/globales/GraficoLinea.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraficoLineaProps {
  datos: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      yAxisID?: string;
    }[];
  };
  titulo: string;
  opciones?: any;
}

const GraficoLinea = ({ datos, titulo, opciones }: GraficoLineaProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: titulo,
      },
    },
    ...opciones
  };

  return <Line options={options} data={datos} />;
};

export default GraficoLinea;