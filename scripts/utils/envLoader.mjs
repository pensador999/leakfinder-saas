// ==============================================================================
// 🛡️ ADSHIELD SECURE ENVIRONMENT LOADER (Zero-Secret Leakage Architecture)
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads .env file safely into process.env without relying on external dependencies
 * or exposing credentials in repository code.
 */
export function ensureEnvLoaded() {
  // If already loaded in execution environment, skip
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    return;
  }

  // Attempt native Node.js 20+ loadEnvFile
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
      if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
        return;
      }
    } catch {
      // Fall through to manual parser
    }
  }

  const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const rawLine of content.split('\n')) {
          const line = rawLine.trim();
          if (line && !line.startsWith('#')) {
            const eqIdx = line.indexOf('=');
            if (eqIdx !== -1) {
              const key = line.slice(0, eqIdx).trim();
              let val = line.slice(eqIdx + 1).trim();
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
              }
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        }
        break;
      } catch {
        // Continue to next path
      }
    }
  }
}

// Auto-execute on import
ensureEnvLoaded();
