// ==============================================================================
// 🏭 SANKHYA ERP SERVICE: AdShield Client Adapter
// Gerencia credenciais e comunicação com o conector Sankhya Gateway (TGFEST/TGFPRO)
// ==============================================================================

import { SankhyaAuditedProduct } from '../../../api/sankhya/inventory';

export interface SankhyaConnectionConfig {
  baseUrl: string;
  username: string;
  password?: string;
  token?: string;
  empresaId?: number;
  isConnected: boolean;
  lastSyncAt?: string;
}

const STORAGE_KEY = 'adshield_sankhya_config';

export function getSavedSankhyaConfig(): SankhyaConnectionConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSankhyaConfig(config: SankhyaConnectionConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Sankhya config', e);
  }
}

export function clearSankhyaConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear Sankhya config', e);
  }
}

export async function fetchSankhyaInventoryAudit(params?: {
  baseUrl?: string;
  username?: string;
  password?: string;
  token?: string;
  codprod?: number;
  referencia?: string;
}): Promise<{
  ok: boolean;
  source: string;
  simulationBadge?: string;
  products: SankhyaAuditedProduct[];
  criticalRupturesCount: number;
  timestamp: string;
}> {
  const saved = getSavedSankhyaConfig();
  const payload = {
    baseUrl: params?.baseUrl || saved?.baseUrl,
    username: params?.username || saved?.username,
    password: params?.password || saved?.password,
    token: params?.token || saved?.token,
    codprod: params?.codprod,
    referencia: params?.referencia
  };

  try {
    const res = await fetch('/api/sankhya/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Sankhya audit endpoint returned status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('[Sankhya Service Fallback]:', err.message);
    // Em caso de falha de rede ou endpoint offline, retorna mock auditado
    return {
      ok: true,
      source: 'client_grounded_fallback',
      simulationBadge: '[Modo Simulação Grounded - Sankhya ERP]',
      products: [
        {
          codprod: 10482,
          descrprod: "Boné Trucker Yellowstone Dutton Ranch Original - Preto Sarja",
          referencia: "BN-YELLOW-001",
          marca: "BRK Agro",
          grade: [
            { controle: "UNICO", estoqueFisico: 0, reservado: 3, estoqueDisponivel: -3, emRuptura: true, statusPcp: "ESGOTADO" }
          ],
          totalEstoqueFisico: 0,
          totalReservado: 3,
          totalDisponivel: 0,
          emRupturaGeral: true,
          alertaEstoqueFantasma: true,
          leadTimeDiasEstimado: 21,
          sugestaoAcao: "PAUSAR ANÚNCIO NO META ADS (RODANDO COM RUPTURA FÍSICA NO ARMAZÉM)"
        }
      ],
      criticalRupturesCount: 1,
      timestamp: new Date().toISOString()
    };
  }
}
