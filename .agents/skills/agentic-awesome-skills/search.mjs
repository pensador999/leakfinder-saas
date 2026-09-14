import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'skills_index.json');

if (!fs.existsSync(indexPath)) {
  console.error("skills_index.json nao encontrado em " + indexPath);
  process.exit(1);
}

const query = process.argv.slice(2).join(' ').trim().toLowerCase();

if (!query) {
  console.log("Uso: node search.mjs <termo_de_busca>");
  console.log("Exemplo: node search.mjs shopify");
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const skills = Array.isArray(data) ? data : data.skills || [];
  
  const matches = skills.filter(s => {
    const name = (s.name || s.id || '').toLowerCase();
    const desc = (s.description || '').toLowerCase();
    const cat = (s.category || '').toLowerCase();
    return name.includes(query) || desc.includes(query) || cat.includes(query);
  });

  console.log(`\n🔍 Encontradas ${matches.length} skills para "${query}":\n`);

  matches.slice(0, 15).forEach((s, idx) => {
    console.log(`[${idx + 1}] ${s.name || s.id}`);
    if (s.category) console.log(`   🏷️ Categoria: ${s.category}`);
    if (s.description) console.log(`   📝 Descricao: ${s.description.slice(0, 140)}...`);
    console.log(`   📂 Caminho: .agents/skills/agentic-awesome-skills/library/${s.name || s.id}/SKILL.md\n`);
  });

  if (matches.length > 15) {
    console.log(`... e mais ${matches.length - 15} skills encontradas.`);
  }
} catch (err) {
  console.error("Erro ao buscar no indice:", err.message);
}
