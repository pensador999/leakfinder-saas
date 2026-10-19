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

/**
 * Compacta o objeto de diagnóstico exclusivamente para persistência em disco (localStorage < 5MB),
 * preservando 100% dos produtos e SKUs na memória RAM da sessão ativa.
 */
function compactDiagnosticForStorage(diag: AgentDiagnosticResult | null): AgentDiagnosticResult | null {
  if (!diag || !diag.realSiteData) return diag;
  try {
    const catalog = diag.realSiteData.catalogAudit;
    const deep = catalog?.deepSkuAudit;
    const needsCompaction =
      (diag.realSiteData.rawHtmlSnippet?.length || 0) > 5000 ||
      Boolean(diag.realSiteData.screenshotUrl) ||
      (catalog?.issues?.length || 0) > 250 ||
      (deep?.allProducts?.length || 0) > 250;

    if (!needsCompaction) return diag;

    return {
      ...diag,
      realSiteData: {
        ...diag.realSiteData,
        rawHtmlSnippet: '',
        screenshotUrl: undefined,
        catalogAudit: catalog
          ? {
              ...catalog,
              issues: Array.isArray(catalog.issues) ? catalog.issues.slice(0, 250) : [],
              deepSkuAudit: deep
                ? {
                    ...deep,
                    criticalProducts: Array.isArray(deep.criticalProducts) ? deep.criticalProducts.slice(0, 150) : [],
                    allProducts: Array.isArray(deep.allProducts) ? deep.allProducts.slice(0, 250) : [],
                  }
                : undefined,
            }
          : catalog,
      },
    };
  } catch {
    return diag;
  }
}

const quotaSafePersistStorage = {
  getItem: (name: string): any => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = window.localStorage.getItem(name);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any): void => {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(name, serialized);
    } catch (err) {
      console.warn('[auditStore] localStorage quota exceeded, pruning old cache keys and retrying:', err);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && (k.startsWith('adshield_audit_history_') || k.startsWith('adshield_store_memory_') || k === 'latestAudit')) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach((k) => window.localStorage.removeItem(k));
          window.localStorage.setItem(name, serialized);
        }
      } catch {
        // Ignora silenciosamente se o storage do navegador estiver bloqueado ou cheio (mantém 100% em RAM)
      }
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(name);
    } catch {
      // Ignora erro de remoção
    }
  },
};

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
      storage: quotaSafePersistStorage,
      // Only persist diagnostic data and tab state, NOT transient UI states
      partialize: (state) => ({
        diagnostic: compactDiagnosticForStorage(state.diagnostic),
        activeTab: state.activeTab,
        isAdvancedMode: state.isAdvancedMode,
      }),
    }
  )
);
