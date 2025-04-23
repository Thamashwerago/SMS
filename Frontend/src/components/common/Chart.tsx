import React, { useMemo, useRef } from "react";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ChartOptions,
  ChartData,
  ActiveElement,
  ChartEvent,
} from "chart.js";
import merge from "lodash.merge";
import {
  CHART_TYPE_LINE,
  CHART_TYPE_PIE,
  CHART_TYPE_BAR,
  CHART_TYPE_DOUGHNUT,
  CHART_TYPE_NOT_SUPPORTED,
} from "../../constants/components/chartStrings";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

export type ChartType = "line" | "pie" | "bar" | "doughnut";

export interface ChartProps {
  type: ChartType;
  data: ChartData<ChartType, unknown, unknown>;
  options?: ChartOptions<ChartType>;
  className?: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  height?: number;
  width?: number;
  maintainAspectRatio?: boolean;
  onElementClick?: (
    event: ChartEvent,
    elements: ActiveElement[],
    chart: ChartJS
  ) => void;
}

const defaultOptions: ChartOptions<ChartType> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: "top", labels: { boxWidth: 12, padding: 16 } },
    title: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  interaction: { mode: "nearest", axis: "x", intersect: false },
};

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  options,
  className = "",
  title,
  subtitle,
  loading = false,
  height,
  width,
  maintainAspectRatio = true,
  onElementClick,
}) => {
  const chartRef = useRef<ChartJS | null>(null);

  // Merge default options, user options, and dynamic title plugin
  const mergedOptions = useMemo(
    () =>
      merge({}, defaultOptions, options, {
        maintainAspectRatio,
        plugins: {
          title: title
            ? { display: true, text: title, font: { size: 18 } }
            : { display: false },
        },
      }),
    [options, title, maintainAspectRatio]
  );

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64 ${className}`}
      />
    );
  }

  // Choose the right chart component
  let ChartComponent: React.ElementType | null = null;
  switch (type) {
    case CHART_TYPE_LINE:
      ChartComponent = Line;
      break;
    case CHART_TYPE_PIE:
      ChartComponent = Pie;
      break;
    case CHART_TYPE_BAR:
      ChartComponent = Bar;
      break;
    case CHART_TYPE_DOUGHNUT:
      ChartComponent = Doughnut;
      break;
    default:
      console.warn(CHART_TYPE_NOT_SUPPORTED);
  }

  // Fallback for unsupported chart types
  if (!ChartComponent) {
    return <div className={className}>{CHART_TYPE_NOT_SUPPORTED}</div>;
  }

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {subtitle}
        </p>
      )}

      <ChartComponent
        ref={chartRef}
        data={data}
        options={mergedOptions}
        height={height}
        width={width}
        onClick={(event: React.MouseEvent<HTMLCanvasElement>) => {
          if (onElementClick && chartRef.current) {
            const elements = chartRef.current.getElementsAtEventForMode(
              event.nativeEvent,
              "nearest",
              { intersect: true },
              false
            );
            onElementClick(
              event as unknown as ChartEvent,
              elements,
              chartRef.current
            );
          }
        }}
      />
    </div>
  );
};

export default Chart;
