import { Droplets } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center">
      <Droplets size={24} className="mr-2 text-primary-500" />
      <div>
        <span className="text-lg font-bold text-slate-900">Aqua</span>
        <span className="text-lg font-bold text-primary-500">Guard</span>
      </div>
    </div>
  );
};