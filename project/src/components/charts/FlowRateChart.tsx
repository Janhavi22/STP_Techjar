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
  warningLevel?: number;
  height?: number;
}

export const FlowRateChart = ({ data = [], warningLevel = 80, height = 300 }: FlowChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [data]);
  
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-gray-500">No flow rate data available</div>;
  }
  
  const labels = data.map(item => dayjs(item.date).format('MMM D'));
  const values = data.map(item => item.value);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Flow Rate (m³/day)',
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
              label += `: ${context.parsed.y.toFixed(1)} m³/day`;
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
        max: 200,
        ticks: {
          stepSize: 20,
          callback: function(value: any) {
            return value + ' m³/day';
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