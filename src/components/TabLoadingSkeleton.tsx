import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface TabLoadingSkeletonProps {
  message?: string;
}

export const TabLoadingSkeleton: React.FC<TabLoadingSkeletonProps> = ({ 
  message = 'Carregando módulo analítico sob demanda...' 
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-6 animate-pulse font-sans text-[#FFFCE1]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0AE448]">
            <RefreshCw className="w-5 h-5 animate-spin text-[#0AE448]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-48 bg-white/10 rounded-md" />
            <div className="h-3 w-32 bg-white/5 rounded-md" />
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#BBBAA6] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#0AE448] animate-pulse" />
          {message}
        </span>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#141716] border border-white/5 space-y-2">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-6 w-28 bg-white/15 rounded" />
        </div>
        <div className="p-4 rounded-2xl bg-[#141716] border border-white/5 space-y-2">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-6 w-32 bg-white/15 rounded" />
        </div>
        <div className="p-4 rounded-2xl bg-[#141716] border border-white/5 space-y-2">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-6 w-24 bg-white/15 rounded" />
        </div>
      </div>

      {/* Main Body Skeleton */}
      <div className="p-6 rounded-2xl bg-[#141716] border border-white/5 space-y-3">
        <div className="h-4 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-5/6 bg-white/5 rounded" />
      </div>
    </div>
  );
};
