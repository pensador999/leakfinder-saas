import fs from 'fs';
import path from 'path';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 🧪 BATERIA DE TESTES AUTOMATIZADOS • ADSHIELD CHROME/EDGE EXTENSION V3     ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let passedTests = 0;
let totalTests = 0;

function assertTest(condition, testName, errorMsg) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} - ${errorMsg}`);
  }
}

const extDir = path.resolve('public/chrome-extension');

// TEST 1: Manifest existence and V3 compliance
const manifestPath = path.join(extDir, 'manifest.json');
assertTest(fs.existsSync(manifestPath), 'manifest.json deve existir', 'Arquivo não encontrado');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assertTest(manifest.manifest_version === 3, 'manifest_version deve ser 3 (Manifest V3)', `Versão atual: ${manifest.manifest_version}`);
assertTest(manifest.name && manifest.name.includes('AdShield'), 'Nome deve conter AdShield', `Nome: ${manifest.name}`);
assertTest(Array.isArray(manifest.permissions) && manifest.permissions.includes('activeTab'), 'Deve ter permissão activeTab', 'Permissão ausente');
assertTest(manifest.action && manifest.action.default_popup === 'popup.html', 'Action popup deve ser popup.html', 'Popup incorreto');

// TEST 2: Content script and Popup files existence
assertTest(fs.existsSync(path.join(extDir, 'content.js')), 'content.js deve existir', 'Arquivo ausente');
assertTest(fs.existsSync(path.join(extDir, 'popup.html')), 'popup.html deve existir', 'Arquivo ausente');
assertTest(fs.existsSync(path.join(extDir, 'popup.js')), 'popup.js deve existir', 'Arquivo ausente');

// TEST 3: Icon assets existence and PNG signature validation
const iconSizes = ['16', '48', '128'];
for (const size of iconSizes) {
  const iconPath = path.join(extDir, `icons/icon${size}.png`);
  assertTest(fs.existsSync(iconPath), `Ícone icon${size}.png deve existir`, 'Ícone não encontrado');
  
  if (fs.existsSync(iconPath)) {
    const buf = fs.readFileSync(iconPath);
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
    assertTest(isPng, `Ícone icon${size}.png deve ter assinatura PNG válida`, 'Assinatura inválida');
  }
}

// TEST 4: Zero-Trust Security Check (No private shopify admin slugs in extension)
const bannedSlugs = ['k1y01s-5r', '54cea3-73', 'zaevym-aj'];
const contentJsCode = fs.readFileSync(path.join(extDir, 'content.js'), 'utf8');
const popupJsCode = fs.readFileSync(path.join(extDir, 'popup.js'), 'utf8');

for (const slug of bannedSlugs) {
  assertTest(!contentJsCode.includes(slug), `content.js não deve conter slug privado (${slug})`, 'Slug vazado');
  assertTest(!popupJsCode.includes(slug), `popup.js não deve conter slug privado (${slug})`, 'Slug vazado');
}

// TEST 5: Packaging ZIP validation
const zipPath = path.resolve('public/adshield-inspector-extension.zip');
assertTest(fs.existsSync(zipPath), 'Arquivo ZIP public/adshield-inspector-extension.zip deve existir', 'ZIP ausente');

if (fs.existsSync(zipPath)) {
  const stat = fs.statSync(zipPath);
  assertTest(stat.size > 1024, 'Arquivo ZIP deve ter tamanho maior que 1KB', `Tamanho: ${stat.size} bytes`);
}

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log(`║ 📊 BALANÇO: ${passedTests}/${totalTests} TESTES APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
if (passedTests === totalTests) {
  console.log('║ 🏆 RESULTADO: EXTENSÃO HOMOLOGADA PARA GOOGLE CHROME E MICROSOFT EDGE!     ║');
} else {
  console.log('║ ⚠️ RESULTADO: HOUVE FALHA EM TESTES!                                        ║');
}
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
