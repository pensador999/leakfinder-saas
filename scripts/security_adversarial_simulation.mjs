// ==============================================================================
// 🛡️ ADSHIELD ADVERSARIAL PENETRATION TEST & DEFENSIVE SECURITY AUDIT SUITE
// Simulates Offensive Hacker Attack Vectors & Asserts Zero-Trust Hardening
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './utils/envLoader.mjs';
import handler from '../api/cron/swarm-runner.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, failureDetail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} ${failureDetail ? `-> ${failureDetail}` : ''}`);
  }
}

async function runSecurityAdversarialSuite() {
  console.log('================================================================');
  console.log('🛡️ [ADSHIELD ZERO-TRUST] AUDITORIA ADVERSARIAL & SIMULAÇÃO HACKER');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // ATAQUE 1: Invasão de Endpoint sem Credenciais (Unauthenticated Access)
  // --------------------------------------------------------------------------
  console.log('🚨 [SIMULAÇÃO DE ATAQUE 1] Tentativa hacker de invocar /api/cron sem Authorization Header...');
  {
    const attackReq = new Request('http://localhost:3000/api/cron/swarm-runner', {
      method: 'GET'
    });
    const res = await handler(attackReq);
    assert(res.status === 401, 'Endpoint serverless bloqueia invasão sem token com HTTP 401');
    const body = await res.json();
    assert(body.error === 'Unauthorized', 'Payload de resposta declara recusa de autorização (Unauthorized)');
  }

  // --------------------------------------------------------------------------
  // ATAQUE 2: Invasão com Token Forjado / Fake Bearer Token
  // --------------------------------------------------------------------------
  console.log('\n🚨 [SIMULAÇÃO DE ATAQUE 2] Tentativa hacker de bypass com Bearer Token malicioso forjado...');
  {
    const attackReq = new Request('http://localhost:3000/api/cron/swarm-runner', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer hacker_evil_crafted_token_xyz987_bypass'
      }
    });
    const res = await handler(attackReq);
    assert(res.status === 401, 'Endpoint serverless bloqueia token forjado com HTTP 401');
    const body = await res.json();
    assert(body.error === 'Unauthorized', 'Token forjado não consegue acionar a função serverless');
  }

  // --------------------------------------------------------------------------
  // ATAQUE 3: Ataque de Negação de Serviço / Flooding DoS (Resource Exhaustion)
  // --------------------------------------------------------------------------
  console.log('\n🚨 [SIMULAÇÃO DE ATAQUE 3] Tentativa de derrubar o servidor com flood de requisições rápidas (DoS)...');
  {
    const validToken = process.env.CRON_SECRET || 'adshield_cron_super_secret_2026';
    
    // Primeiro disparo válido
    const req1 = new Request('http://localhost:3000/api/cron/swarm-runner', {
      method: 'GET',
      headers: { 'authorization': `Bearer ${validToken}` }
    });
    const res1 = await handler(req1);
    
    // Segundo disparo imediato tentando exaurir os recursos da Vercel / Supabase
    const floodReq = new Request('http://localhost:3000/api/cron/swarm-runner', {
      method: 'GET',
      headers: { 'authorization': `Bearer ${validToken}` }
    });
    const resFlood = await handler(floodReq);
    
    assert(resFlood.status === 429, 'Limitador Anti-DoS intercepta rajada de requisições com HTTP 429 Too Many Requests');
    const floodBody = await resFlood.json();
    assert(floodBody.error === 'Too Many Requests', 'Resposta confirma bloqueio por proteção de taxa (Rate Limit Active)');
    assert(typeof floodBody.retryAfterSeconds === 'number', 'Servidor informa tempo de espera defensivo (retryAfterSeconds)');
  }

  // --------------------------------------------------------------------------
  // ATAQUE 4: Abuso de Métodos HTTP (DELETE, PUT, PATCH maliciosos)
  // --------------------------------------------------------------------------
  console.log('\n🚨 [SIMULAÇÃO DE ATAQUE 4] Tentativa de adulteração com métodos HTTP proibidos (DELETE / PUT)...');
  {
    const deleteReq = new Request('http://localhost:3000/api/cron/swarm-runner', {
      method: 'DELETE',
      headers: { 'authorization': `Bearer ${process.env.CRON_SECRET || ''}` }
    });
    const resDelete = await handler(deleteReq);
    assert(resDelete.status === 405, 'Método DELETE é expressamente proibido com HTTP 405 Method Not Allowed');

    const putReq = new Request('http://localhost:3000/api/cron/swarm-runner', {
      method: 'PUT',
      headers: { 'authorization': `Bearer ${process.env.CRON_SECRET || ''}` }
    });
    const resPut = await handler(putReq);
    assert(resPut.status === 405, 'Método PUT é expressamente proibido com HTTP 405 Method Not Allowed');
  }

  // --------------------------------------------------------------------------
  // ATAQUE 5: Varredura de Segredos no Código-Fonte (Secret Leakage Scanner)
  // --------------------------------------------------------------------------
  console.log('\n🔍 [AUDITORIA DE SEGREDOS] Varredura profunda contra credenciais expostas no código...');
  {
    const filesToScan = [
      'api/cron/swarm-runner.ts',
      'src/services/swarm/masterAutonomousPipeline.ts',
      'scripts/autonomous_swarm_daemon.mjs',
      'scripts/check_morning_telemetry.mjs',
      'scripts/coordinated_attack_brk_agro.mjs',
      'scripts/coordinated_attack_brk_fishing.mjs',
      'scripts/coordinated_attack_brk_motors.mjs',
      'scripts/full_swarm_stress_test.mjs',
      'scripts/migrate_database.mjs',
      'scripts/run_today_morning_cycle.mjs',
      'scripts/test_supabase_live.mjs',
      'scripts/test_vercel_cron_local.mjs'
    ];

    let leakFound = false;
    for (const relPath of filesToScan) {
      const fullPath = path.join(rootDir, relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('sb_secret_iziVMX78wmE0Duxc59_sXQ_sbjmmQ6i')) {
          leakFound = true;
          console.error(`    ❌ Vazamento detectado em: ${relPath}`);
        }
        if (content.includes('adshield_cron_super_secret_2026') && !relPath.includes('security_adversarial_simulation')) {
          leakFound = true;
          console.error(`    ❌ Cron secret fixo detectado em: ${relPath}`);
        }
      }
    }
    assert(!leakFound, 'Zero chaves mestras ou segredos hardcoded nos arquivos de produção e scripts');
  }

  // --------------------------------------------------------------------------
  // ATAQUE 6: Engenharia Reversa do Bundle do Cliente (dist/assets Scanner)
  // --------------------------------------------------------------------------
  console.log('\n🔍 [ENGENHARIA REVERSA DE CLIENTE] Inspecionando bundle compilado em dist/ por credenciais...');
  {
    const distDir = path.join(rootDir, 'dist', 'assets');
    let bundleHasSecret = false;

    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir);
      for (const file of files) {
        if (file.endsWith('.js')) {
          const content = fs.readFileSync(path.join(distDir, file), 'utf8');
          if (content.includes('iziVMX78wmE0Duxc59')) {
            bundleHasSecret = true;
            console.error(`    ❌ SERVICE_ROLE_KEY vazada no bundle JS do navegador: ${file}`);
          }
        }
      }
      assert(!bundleHasSecret, 'Zero chaves privadas (SUPABASE_SERVICE_ROLE_KEY) embutidas nos pacotes JavaScript públicos');
    } else {
      console.log('    ℹ️ dist/assets não encontrado (verificação pós-build validará)');
    }
  }

  // --------------------------------------------------------------------------
  // AUDITORIA 7: Análise de Cabeçalhos HTTP de Segurança no vercel.json
  // --------------------------------------------------------------------------
  console.log('\n🛡️ [AUDITORIA DE HEADERS HTTP] Avaliando vercel.json contra diretrizes OWASP...');
  {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
    assert(Array.isArray(vercelConfig.headers) && vercelConfig.headers.length >= 2, 'vercel.json define lista de headers de segurança');

    const globalHeadersObj = vercelConfig.headers.find(h => h.source === '/(.*)') || { headers: [] };
    const headerMap = {};
    for (const item of globalHeadersObj.headers) {
      headerMap[item.key.toLowerCase()] = item.value;
    }

    assert(headerMap['x-frame-options'] === 'DENY', 'X-Frame-Options configurado como DENY (Proteção contra Clickjacking)');
    assert(headerMap['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options configurado como nosniff (Anti-MIME Sniffing)');
    assert(headerMap['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy protege caminhos e privacidade de URLs');
    assert(headerMap['permissions-policy']?.includes('camera=()'), 'Permissions-Policy desativa sensores do dispositivo (câmera, microfone)');
    assert(headerMap['strict-transport-security']?.includes('max-age='), 'Strict-Transport-Security força tráfego criptografado HTTPS estrito');
    assert(headerMap['content-security-policy']?.includes("frame-ancestors 'none'"), 'Content-Security-Policy proíbe embedding em iframes maliciosos');

    const apiHeadersObj = vercelConfig.headers.find(h => h.source === '/api/(.*)') || { headers: [] };
    const apiHeaderMap = {};
    for (const item of apiHeadersObj.headers) {
      apiHeaderMap[item.key.toLowerCase()] = item.value;
    }
    assert(apiHeaderMap['cache-control']?.includes('no-store'), 'Rotas /api/* configuradas com Cache-Control: no-store para evitar cache de dados sensíveis');
  }

  // --------------------------------------------------------------------------
  // AUDITORIA 8: Blindagem do .gitignore contra Arquivos Sensíveis
  // --------------------------------------------------------------------------
  console.log('\n🔒 [BLINDAGEM .GITIGNORE] Checando filtros de arquivos sensíveis...');
  {
    const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
    assert(gitignoreContent.includes('.env'), '.gitignore protege arquivos .env');
    assert(gitignoreContent.includes('*.sql'), '.gitignore bloqueia dumps de banco de dados (*.sql)');
    assert(gitignoreContent.includes('*.dump'), '.gitignore bloqueia backups binários (*.dump)');
    assert(gitignoreContent.includes('*.pem'), '.gitignore bloqueia chaves criptográficas e certificados (*.pem)');
    assert(gitignoreContent.includes('*.key'), '.gitignore bloqueia arquivos de chave privada (*.key)');
    assert(gitignoreContent.includes('*.p12'), '.gitignore bloqueia certificados PKCS#12 (*.p12)');
  }

  // --------------------------------------------------------------------------
  // BALANÇO FINAL
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 [RESULTADO GERAL]: ${passedTests}/${totalTests} Testes de Segurança Aprovados (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (failedTests === 0) {
    console.log('🏆 IMUNIDADE DEFENSIVA CONFIRMADA: O AdShield está 100% blindado contra os vetores simulados!');
  } else {
    console.error(`⚠️ ATENÇÃO: ${failedTests} falha(s) de segurança detectadas!`);
  }
  console.log('================================================================\n');

  return { totalTests, passedTests, failedTests };
}

runSecurityAdversarialSuite().catch(console.error);
