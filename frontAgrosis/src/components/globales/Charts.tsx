import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Dataset {
  label?: string; // Hacer label opcional
  data: number[];
  backgroundColor: string | string[]; // Permitir string o string[]
  borderColor?: string | string[];
  borderWidth?: number;
}

interface ChartProps {
  data: {
    labels: string[];
    datasets: Dataset[];
  };
  options?: any;
  height?: number;
  width?: number;
}

export const ChartBar = ({ data, options, height, width }: ChartProps) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: options?.title || '',
      },
    },
    ...options,
  };

  return (
    <div style={{ height: height || 400, width: width || '100%' }}>
      <Bar data={data} options={defaultOptions} />
    </div>
  );
};

export const ChartPie = ({ data, options, height, width }: ChartProps) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: options?.title || '',
      },
    },
    ...options,
  };

  return (
    <div style={{ height: height || 400, width: width || '100%' }}>
      <Pie data={data} options={defaultOptions} />
    </div>
  );
};

export const ChartLine = ({ data, options, height, width }: ChartProps) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: options?.title || '',
      },
    },
    ...options,
  };

  return (
    <div style={{ height: height || 400, width: width || '100%' }}>
      <Line data={data} options={defaultOptions} />
    </div>
  );
};