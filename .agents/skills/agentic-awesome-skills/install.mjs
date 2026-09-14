import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillName = process.argv[2]?.trim();

if (!skillName) {
  console.log("Uso: node install.mjs <nome_da_skill>");
  console.log("Exemplo: node install.mjs sankhya-dashboard-html-jsp-custom-best-pratices");
  process.exit(0);
}

const sourceDir = path.join(__dirname, 'library', skillName);
const targetDir = path.join(__dirname, '..', skillName);

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Skill "${skillName}" nao encontrada na biblioteca.`);
  console.log(`Dica: use "node search.mjs ${skillName}" para encontrar o nome exato.`);
  process.exit(1);
}

try {
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log(`✅ Skill "${skillName}" instalada com sucesso em .agents/skills/${skillName}!`);
} catch (err) {
  console.error("Erro ao instalar skill:", err.message);
}
