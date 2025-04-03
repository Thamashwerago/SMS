// src/components/common/Chart.tsx
import React from 'react';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions, 
  ChartData,
} from 'chart.js';

// Register required Chart.js components.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export type ChartType = 'line' | 'pie' | 'bar' | 'doughnut';

export interface ChartProps {
  type: ChartType;
  data: ChartData; // You can extend this type for more specific data shapes.
  options?: ChartOptions;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ type, data, options, className = '' }) => {
  switch (type) {
    case 'line':
      return <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} className={className} />;
    case 'pie':
      return <Pie data={data as ChartData<'pie'>} options={options as ChartOptions<'pie'>} className={className} />;
    case 'bar':
      return <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} className={className} />;
    case 'doughnut':
      return <Doughnut data={data as ChartData<'doughnut'>} options={options as ChartOptions<'doughnut'>} className={className} />;
    default:
      return null;
  }
};

export default React.memo(Chart);
