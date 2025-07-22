import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';
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
    LineElement,
    ScatterController
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
    LineElement,
    ScatterController
);

interface Dataset {
    label?: string;
    data: number[] | { x: number; y: number }[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    yAxisID?: string;
    pointRadius?: number;
}

interface ChartProps {
    data: {
        labels?: string[];
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
            legend: { position: 'top' as const },
            title: { display: true, text: options?.title?.text || '', font: { size: 16 } }
        },
        ...options
    };

    return (
        <div style={{ height: height || 400, width: width || '100%' }} className="bg-white p-4 rounded-lg shadow-sm">
            <Bar data={data} options={defaultOptions} />
        </div>
    );
};

export const ChartPie = ({ data, options, height, width }: ChartProps) => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' as const },
            title: { display: true, text: options?.title?.text || '', font: { size: 16 } }
        },
        ...options
    };

    return (
        <div style={{ height: height || 400, width: width || '100%' }} className="bg-white p-4 rounded-lg shadow-sm">
            <Pie data={data} options={defaultOptions} />
        </div>
    );
};

export const ChartLine = ({ data, options, height, width }: ChartProps) => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: options?.title?.text || '', font: { size: 16 } }
        },
        ...options
    };

    return (
        <div style={{ height: height || 400, width: width || '100%' }} className="bg-white p-4 rounded-lg shadow-sm">
            <Line data={data} options={defaultOptions} />
        </div>
    );
};

export const ChartScatter = ({ data, options, height, width }: ChartProps) => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: options?.title?.text || '', font: { size: 16 } }
        },
        ...options
    };

    return (
        <div style={{ height: height || 400, width: width || '100%' }} className="bg-white p-4 rounded-lg shadow-sm">
            <Scatter data={data} options={defaultOptions} />
        </div>
    );
};