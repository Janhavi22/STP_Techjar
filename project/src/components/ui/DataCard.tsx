import React from 'react';
import { BarChart, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  footer?: string;
}

export const DataCard = ({
  title,
  value,
  change,
  icon = <BarChart />,
  status = 'neutral',
  footer,
}: DataCardProps) => {
  // Determine color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-success-50 text-success-700';
      case 'warning':
        return 'bg-warning-50 text-warning-700';
      case 'error':
        return 'bg-error-50 text-error-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  // Determine change indicator
  const renderChange = () => {
    if (change === undefined) return null;
    
    if (change > 0) {
      return (
        <div className="flex items-center text-success-600">
          <TrendingUp size={16} className="mr-1" />
          <span className="text-sm font-medium">{change}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-error-600">
          <TrendingDown size={16} className="mr-1" />
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-slate-500">
          <span className="text-sm font-medium">0%</span>
        </div>
      );
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className={`rounded-full p-2 ${getStatusColor()}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {renderChange()}
      </div>
      {footer && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">{footer}</p>
        </div>
      )}
    </div>
  );
};