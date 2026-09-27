import React from 'react';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'success' | 'alert';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  const icons = {
    info: <Info className="h-4 w-4 text-cyan-400" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    alert: <AlertTriangle className="h-4 w-4 text-amber-400" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded border border-cyan-800/60 bg-[#0d172e] px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-xs font-mono text-slate-200 tracking-wide">{message}</p>
    </div>
  );
};
