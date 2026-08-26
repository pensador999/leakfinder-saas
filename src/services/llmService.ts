import { WorkerInspectionResult } from './siteInspectorWorker';
import { AuditInput } from '../types';

export const GEMINI_LOCAL_STORAGE_KEY = 'AGENTS_GEMINI_API_KEY';

export function getGeminiApiKey(): string | null {
  return localStorage.getItem(GEMINI_LOCAL_STORAGE_KEY);
}

export function setGeminiApiKey(key: string) {
  localStorage.setItem(GEMINI_LOCAL_STORAGE_KEY, key);
}

let hasWarnedNoApiKey = false;

export async function askGeminiAgent<T>(
  systemPrompt: string,
  input: AuditInput,
  visionAnalysis: WorkerInspectionResult['visionAnalysis'],
  scrapedMarkdown?: string
): Promise<T | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    if (!hasWarnedNoApiKey) {
      console.info('ℹ️ Modo Heurístico Local Ativo (Sem Chave Gemini configurada)');
      hasWarnedNoApiKey = true;
    }
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const userMessage = `
DADOS DO CLIENTE:
URL: ${input.siteUrl}
Nicho: ${input.niche}
Ticket Médio (AOV): R$ ${input.averageOrderValue}
Margem Bruta: ${input.grossMargin}%
Alvo Concorrente: ${input.competitorsUrl || 'N/A'}

VISÃO COMPUTACIONAL DO SITE:
${JSON.stringify(visionAnalysis, null, 2)}

CONTEÚDO REAL DO SITE (MARKDOWN EXTRAÍDO):
${scrapedMarkdown || 'N/A'}

Siga RIGOROSAMENTE as suas Rules of Engagement (System Prompt).
Responda EXCLUSIVAMENTE com um array JSON válido, sem markdown (\`\`\`json), contendo os findings estruturados (id, category, title, description, impact, effort, recommendation). Se houver campos adicionais esperados (como iceMatrix ou budgetAllocation), retorne um objeto JSON que englobe as propriedades exigidas.
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return null;
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    // Resiliência: O Gemini às vezes ignora o comando "sem markdown" e devolve blocos de código
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    }

    try {
      const parsed = JSON.parse(cleanText);
      return parsed as T;
    } catch {
      console.error('Failed to parse Gemini JSON:', cleanText);
      return null;
    }
  } catch (error) {
    console.error('Network Error calling Gemini:', error);
    return null;
  }
}
