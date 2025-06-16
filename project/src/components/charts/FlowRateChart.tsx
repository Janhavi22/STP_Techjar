import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FlowChartProps {
  data: { date: string; value: number }[];
  siteCapacity?: number;
  height?: number;
}

export const FlowRateChart = ({ data = [], siteCapacity = 500, height = 300 }: FlowChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  useEffect(() => {
    // Update chart on data change
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [data]);
  
  // Ensure data is valid before processing
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-gray-500">No flow rate data available</div>;
  }
  
  // Format dates for display
  const labels = data.map(item => dayjs(item.date).format('MMM D'));
  const values = data.map(item => item.value);
  
  // Calculate warning level at 50% of capacity
  const warningLevel = siteCapacity * 0.5;
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Flow Rate (L/min)',
        data: values,
        fill: 'start',
        backgroundColor: 'rgba(8, 145, 178, 0.1)',
        borderColor: 'rgba(8, 145, 178, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(8, 145, 178, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(8, 145, 178, 1)',
        pointRadius: 4,
        tension: 0.4,
      },
      {
        label: 'Warning Level',
        data: Array(labels.length).fill(warningLevel),
        borderColor: 'rgba(239, 68, 68, 0.7)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#334155',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += `: ${context.parsed.y} L/min`;
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: Math.max(...values, siteCapacity) * 1.1,
        ticks: {
          callback: function(value: any) {
            return value + ' L/min';
          },
        },
      },
    },
  };
  
  return (
    <div style={{ height: `${height}px` }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};