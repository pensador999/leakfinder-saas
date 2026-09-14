import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('📦 ADSHIELD EXTENSION PACKAGER 2.0 • MANIFEST V3');
console.log('--------------------------------------------------');

const extDir = path.resolve('public/chrome-extension');
const zipOutPublic = path.resolve('public/adshield-inspector-extension.zip');
const zipOutDist = path.resolve('dist/adshield-inspector-extension.zip');

if (!fs.existsSync(extDir)) {
  console.error('❌ Diretório não encontrado:', extDir);
  process.exit(1);
}

// Check essential files
const requiredFiles = [
  'manifest.json',
  'content.js',
  'popup.html',
  'popup.js',
  'icons/icon16.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

for (const relFile of requiredFiles) {
  const fullPath = path.join(extDir, relFile);
  if (!fs.existsSync(fullPath)) {
    console.error('❌ Arquivo obrigatório ausente:', relFile);
    process.exit(1);
  }
}

// Validate manifest.json
const manifestRaw = fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8');
try {
  const manifest = JSON.parse(manifestRaw);
  if (manifest.manifest_version !== 3) {
    throw new Error('Manifest version must be 3');
  }
  console.log(`✅ manifest.json validado (V3 compliant: ${manifest.name} v${manifest.version})`);
} catch (e) {
  console.error('❌ Erro no manifest.json:', e.message);
  process.exit(1);
}

// Compress using powershell Compress-Archive
console.log('📦 Compactando pacote para distribuição...');
try {
  const psCmd = `Compress-Archive -Path '${extDir}/*' -DestinationPath '${zipOutPublic}' -Force`;
  execSync(`powershell -Command "${psCmd}"`, { stdio: 'pipe' });

  if (fs.existsSync('dist')) {
    fs.copyFileSync(zipOutPublic, zipOutDist);
  }

  const stat = fs.statSync(zipOutPublic);
  console.log('🎉 Extensão empacotada com sucesso!');
  console.log('📁 Destino:', zipOutPublic);
  console.log('📊 Tamanho do pacote:', (stat.size / 1024).toFixed(2), 'KB');
} catch (err) {
  console.error('❌ Falha na compactação:', err.message);
  process.exit(1);
}
