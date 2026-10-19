// ==============================================================================
// 🗄️ ZUSTAND AUDIT STORE — Estado Centralizado do Diagnóstico
// Substitui o prop drilling de HomePage → 33+ componentes
// Persiste o último diagnóstico em localStorage para sobreviver a F5
// ==============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgentDiagnosticResult } from '../types';

export interface AuditStoreState {
  // Diagnostic data
  diagnostic: AgentDiagnosticResult | null;
  isAnalyzing: boolean;
  analyzingUrl: string;
  auditError: string | null;
  
  // Navigation
  activeTab: string;
  isAdvancedMode: boolean;
  
  // Actions
  setDiagnostic: (result: AgentDiagnosticResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalyzingUrl: (url: string) => void;
  setAuditError: (error: string | null) => void;
  setActiveTab: (tab: string) => void;
  setIsAdvancedMode: (advanced: boolean) => void;
  clearAudit: () => void;
}

export const useAuditStore = create<AuditStoreState>()(
  persist(
    (set) => ({
      // Initial state
      diagnostic: null,
      isAnalyzing: false,
      analyzingUrl: '',
      auditError: null,
      activeTab: 'summary',
      isAdvancedMode: false,

      // Actions
      setDiagnostic: (result) => set({ diagnostic: result, auditError: null }),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      setAnalyzingUrl: (url) => set({ analyzingUrl: url }),
      setAuditError: (error) => set({ auditError: error, isAnalyzing: false }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsAdvancedMode: (advanced) => set({ isAdvancedMode: advanced }),
      clearAudit: () => set({ 
        diagnostic: null, 
        auditError: null, 
        isAnalyzing: false, 
        analyzingUrl: '',
        activeTab: 'summary'
      }),
    }),
    {
      name: 'adshield-audit-store',
      version: 2,
      // Only persist diagnostic data and tab state, NOT transient UI states
      partialize: (state) => ({
        diagnostic: state.diagnostic,
        activeTab: state.activeTab,
        isAdvancedMode: state.isAdvancedMode,
      }),
    }
  )
);
