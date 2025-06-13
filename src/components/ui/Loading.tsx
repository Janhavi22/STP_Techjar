import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: number;
  text?: string;
}

export const Loading = ({ size = 40, text = 'Loading...' }: LoadingProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Loader2 size={size} className="animate-spin text-primary-500" />
      <p className="mt-4 text-lg text-slate-600">{text}</p>
    </div>
  );
};