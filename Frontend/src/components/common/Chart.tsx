import React from "react";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
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
  BarElement,
} from "chart.js";
ChartJS.register(BarElement);
import {
  CHART_TYPE_LINE,
  CHART_TYPE_PIE,
  CHART_TYPE_BAR,
  CHART_TYPE_DOUGHNUT,
  CHART_TYPE_NOT_SUPPORTED,
} from "../../constants/components/chartStrings";

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

/**
 * ChartType
 * ----------
 * Defines the supported types of charts.
 */
export type ChartType = "line" | "pie" | "bar" | "doughnut";

/**
 * ChartProps
 * ----------
 * Props accepted by the Chart component.
 * - type: Determines which type of chart to render.
 * - data: Chart data formatted as required by react-chartjs-2.
 * - options: Optional configuration for the chart.
 * - className: Optional additional CSS classes for custom styling.
 */
export interface ChartProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  className?: string;
}

/**
 * Chart Component
 * ----------------
 * A generic chart component that supports line, pie, bar, and doughnut charts.
 * It wraps react-chartjs-2 components and is optimized for reuse across the application.
 *
 * @param {ChartProps} props - The properties for configuring the chart.
 * @returns A rendered chart element or a fallback message if the type is not supported.
 */
const Chart: React.FC<ChartProps> = ({
  type,
  data,
  options,
  className = "",
}) => {
  // Render the appropriate chart based on the type prop.
  switch (type) {
    case CHART_TYPE_LINE:
      return (
        <Line
          data={data as ChartData<"line">}
          options={options as ChartOptions<"line">}
          className={className}
        />
      );
    case CHART_TYPE_PIE:
      return (
        <Pie
          data={data as ChartData<"pie">}
          options={options as ChartOptions<"pie">}
          className={className}
        />
      );
    case CHART_TYPE_BAR:
      return (
        <Bar
          data={data as ChartData<"bar">}
          options={options as ChartOptions<"bar">}
          className={className}
        />
      );
    case CHART_TYPE_DOUGHNUT:
      return (
        <Doughnut
          data={data as ChartData<"doughnut">}
          options={options as ChartOptions<"doughnut">}
          className={className}
        />
      );
    default:
      // If the chart type is not supported, log a warning and show a fallback message.
      console.warn(CHART_TYPE_NOT_SUPPORTED);
      return <div className={className}>{CHART_TYPE_NOT_SUPPORTED}</div>;
  }
};

export default React.memo(Chart);
