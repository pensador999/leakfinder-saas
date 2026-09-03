import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface TabLoadingSkeletonProps {
  message?: string;
}

export const TabLoadingSkeleton: React.FC<TabLoadingSkeletonProps> = ({ 
  message = 'Carregando módulo analítico sob demanda...' 
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-pulse font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-48 bg-slate-200 rounded-md" />
            <div className="h-3 w-32 bg-slate-100 rounded-md" />
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          {message}
        </span>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-6 w-28 bg-slate-300 rounded" />
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-6 w-32 bg-slate-300 rounded" />
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-6 w-24 bg-slate-300 rounded" />
        </div>
      </div>

      {/* Main Body Skeleton */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-5/6 bg-slate-100 rounded" />
      </div>
    </div>
  );
};
