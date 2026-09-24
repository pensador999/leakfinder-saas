import React, { useState } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { 
  fetchSankhyaInventoryAudit, 
  saveSankhyaConfig, 
  SankhyaConnectionConfig 
} from '../../services/integrations/sankhyaErpService';
import { SankhyaAuditedProduct } from '../../../api/sankhya/inventory';

interface SankhyaConnectTabProps {
  initialConfig: SankhyaConnectionConfig | null;
  onConnected?: (config: SankhyaConnectionConfig) => void;
}

export const SankhyaConnectTab: React.FC<SankhyaConnectTabProps> = ({
  initialConfig,
  onConnected
}) => {
  const [urlInput, setUrlInput] = useState(initialConfig?.baseUrl || '');
  const [userInput, setUserInput] = useState(initialConfig?.username || '');
  const [passInput, setPassInput] = useState(initialConfig?.password || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [products, setProducts] = useState<SankhyaAuditedProduct[]>([]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    try {
      const config: SankhyaConnectionConfig = {
        baseUrl: urlInput.trim() || 'https://erp.brkagro.com.br:8180',
        username: userInput.trim() || 'ADSHIELD_SYNC',
        password: passInput.trim(),
        isConnected: true,
        lastSyncAt: new Date().toISOString()
      };
      saveSankhyaConfig(config);
      if (onConnected) onConnected(config);

      const res = await fetchSankhyaInventoryAudit({
        baseUrl: config.baseUrl,
        username: config.username,
        password: config.password
      });

      setProducts(res.products || []);
    } catch (err) {
      console.error('[Sankhya Tab Error]:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#0E100F] border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs text-[#FFFCE1]">Sankhya ERP Gateway (MGE Java)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30">
            TABELAS: TGFEST • TGFPRO
          </span>
        </div>
        <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
          Conexão direta ao banco de dados do galpão físico e PCP. Extrai saldo disponível real (`ESTOQUE - RESERVADO`) por grade de tamanho no campo `CONTROLE`.
        </p>

        <form onSubmit={handleAudit} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">URL da Instância Sankhya</label>
              <input
                type="text"
                placeholder="https://erp.brkagro.com.br:8180"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#141716] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">Usuário de Integração</label>
              <input
                type="text"
                placeholder="INTEGRA_ADSHIELD"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#141716] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">Senha do Usuário Sankhya</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#141716] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isAuditing}
              className="flex-1 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Consultando TGFEST...' : 'Auditar Saldo Físico Sankhya'}</span>
            </button>
          </div>
        </form>
      </div>

      {products.length > 0 && (
        <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#FFFCE1] font-mono">
              Inventário Auditado no ERP ({products.length} Produtos)
            </span>
            <span className="text-[10px] font-mono text-[#0AE448] bg-[#0AE448]/10 px-2 py-0.5 rounded border border-[#0AE448]/30">
              [DADO REAL AUDITADO]
            </span>
          </div>

          <div className="space-y-3">
            {products.map((prod) => (
              <div key={prod.codprod} className="p-3 bg-[#0E100F] border border-white/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#FFFCE1]">{prod.descrprod}</span>
                    <div className="text-[10px] text-[#BBBAA6] font-mono">Cód: {prod.codprod} • Ref: {prod.referencia}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.emRupturaGeral ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30'
                  }`}>
                    {prod.emRupturaGeral ? 'RUPTURA NO PCP' : 'DISPONÍVEL'}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 pt-1 text-center font-mono text-[10px]">
                  {prod.grade.map((g) => (
                    <div key={g.controle} className={`p-1.5 rounded-lg border ${
                      g.emRuptura ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    }`}>
                      <div className="font-bold text-[#FFFCE1]">{g.controle}</div>
                      <div>Disp: {g.estoqueDisponivel}</div>
                    </div>
                  ))}
                </div>

                {prod.sugestaoAcao && (
                  <div className={`p-2 rounded-lg text-[10px] font-mono mt-1 ${
                    prod.emRupturaGeral ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20'
                  }`}>
                    ⚡ {prod.sugestaoAcao}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
