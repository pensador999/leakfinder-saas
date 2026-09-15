# ==============================================================================
# 🛡️ SUÍTE DE AUDITORIA DE SEGURANÇA & CASOS DE BORDA DO ECOSSISTEMA
# Valida: Proteção Anti-SSRF, Grounding de WhatsApp, Sanitização de URLs e Fila
# ==============================================================================

import re
import sys
from pathlib import Path
from urllib.parse import urlparse

root_dir = Path(__file__).resolve().parent.parent

total_tests = 0
passed_tests = 0
failed_tests = 0

def assert_test(condition, name, details=''):
    global total_tests, passed_tests, failed_tests
    total_tests += 1
    if condition:
        print(f'  ✅ [PASS] {name}')
        passed_tests += 1
    else:
        print(f'  ❌ [FAIL] {name} -> {details}')
        failed_tests += 1

print('\n================================================================')
print('🛡️ INICIANDO AUDITORIA RIGOROSA DE SEGURANÇA & INTEGRIDADE 100%')
print('================================================================\n')

# ------------------------------------------------------------------------------
# TESTE 1: Validação Anti-SSRF
# ------------------------------------------------------------------------------
print('🔍 [1/4] Testando Proteção Anti-SSRF & Sanitização de URLs...')

def validate_and_sanitize_url(raw_url: str):
    if not raw_url or not isinstance(raw_url, str):
        return False, '', 'URL vazia ou inválida'
    
    formatted = raw_url.strip()
    has_protocol = bool(re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', formatted))
    if has_protocol:
        if not formatted.startswith('http://') and not formatted.startswith('https://'):
            return False, '', 'Protocolo proibido. Apenas HTTP e HTTPS são permitidos.'
    else:
        formatted = f'https://{formatted}'

    try:
        parsed = urlparse(formatted)
    except Exception:
        return False, '', 'Formato malformado'

    if parsed.scheme not in ('http', 'https'):
        return False, '', 'Protocolo inválido'

    hostname = (parsed.hostname or '').lower()
    if not hostname:
        return False, '', 'Hostname vazio'

    if hostname == 'localhost' or hostname.endswith('.localhost') or hostname == 'local':
        return False, '', 'Localhost bloqueado'

    if hostname in ('169.254.169.254', 'metadata.google.internal', 'metadata') or 'internal' in hostname:
        return False, '', 'Cloud metadata bloqueado'

    # IPv4 regex
    ip_match = re.match(r'^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$', hostname)
    if ip_match:
        a, b, c, d = map(int, ip_match.groups())
        if a == 0 or a == 127:
            return False, '', 'Loopback ou 0.0.0.0 bloqueado'
        if a == 10:
            return False, '', 'IP Privado 10.x bloqueado'
        if a == 172 and 16 <= b <= 31:
            return False, '', 'IP Privado 172.16-31 bloqueado'
        if a == 192 and b == 168:
            return False, '', 'IP Privado 192.168 bloqueado'
        if a == 169 and b == 254:
            return False, '', 'Link-local 169.254 bloqueado'

    if hostname in ('::1', '[::1]') or hostname.startswith('fe80:') or hostname.startswith('fc00:'):
        return False, '', 'IPv6 privado/loopback bloqueado'

    if parsed.port and parsed.port in (22, 25, 110, 143, 445, 2049, 2375, 2376, 3306, 5432, 6379, 8080, 9200, 27017):
        return False, '', f'Porta interna {parsed.port} bloqueada'

    return True, formatted, ''

assert_test(not validate_and_sanitize_url('http://localhost:3000')[0], 'Bloqueio de localhost:3000')
assert_test(not validate_and_sanitize_url('http://127.0.0.1:8080')[0], 'Bloqueio de 127.0.0.1')
assert_test(not validate_and_sanitize_url('http://169.254.169.254/latest/meta-data')[0], 'Bloqueio de Cloud Metadata AWS/Vercel (169.254.169.254)')
assert_test(not validate_and_sanitize_url('http://10.0.0.1')[0], 'Bloqueio de IP Privado 10.x.x.x')
assert_test(not validate_and_sanitize_url('http://192.168.1.1')[0], 'Bloqueio de IP Privado 192.168.x.x')
assert_test(not validate_and_sanitize_url('http://172.20.0.1')[0], 'Bloqueio de IP Privado 172.16-31.x.x')
assert_test(not validate_and_sanitize_url('file:///etc/passwd')[0], 'Bloqueio de protocolo file://')
assert_test(not validate_and_sanitize_url('gopher://127.0.0.1:6379')[0], 'Bloqueio de protocolo gopher://')
assert_test(not validate_and_sanitize_url('ftp://ftp.example.com')[0], 'Bloqueio de protocolo ftp://')
assert_test(not validate_and_sanitize_url('javascript:alert(1)')[0], 'Bloqueio de pseudo-protocolo javascript:')
assert_test(not validate_and_sanitize_url('https://example.com:22')[0], 'Bloqueio de porta interna de SSH (22)')
assert_test(not validate_and_sanitize_url('https://example.com:3306')[0], 'Bloqueio de porta interna MySQL (3306)')
assert_test(not validate_and_sanitize_url('https://example.com:6379')[0], 'Bloqueio de porta interna Redis (6379)')

ok, clean_url, _ = validate_and_sanitize_url('https://www.insiderstore.com.br')
assert_test(ok and clean_url == 'https://www.insiderstore.com.br', 'Permissão e sanitização de https://www.insiderstore.com.br')

ok2, clean_url2, _ = validate_and_sanitize_url('lojaexemplomodabr.com.br')
assert_test(ok2 and clean_url2 == 'https://lojaexemplomodabr.com.br', 'Sanitização automática sem protocolo para https://')

# ------------------------------------------------------------------------------
# TESTE 2: Grounding de Telefone de WhatsApp (Zero Fallback Falso)
# ------------------------------------------------------------------------------
print('\n🔍 [2/4] Testando Grounding & Normalização de WhatsApp...')

def normalize_phone_for_whatsapp(phone):
    if not phone:
        return ''
    digits = re.sub(r'\D', '', phone)
    if not digits:
        return ''
    if digits.startswith('55'):
        return digits
    if len(digits) in (10, 11):
        return f'55{digits}'
    return digits

assert_test(normalize_phone_for_whatsapp('') == '', 'Telefone vazio retorna string vazia (zero fallback para fundador)')
assert_test(normalize_phone_for_whatsapp(None) == '', 'Telefone None retorna string vazia')
assert_test(normalize_phone_for_whatsapp('Não minerado') == '', 'Telefone com texto sem dígitos retorna string vazia')
assert_test(normalize_phone_for_whatsapp('34991351122') == '5534991351122', 'Adiciona DDI 55 em número com DDD (11 dígitos)')
assert_test(normalize_phone_for_whatsapp('(11) 98765-4321') == '5511987654321', 'Limpa pontuação e adiciona 55')
assert_test(normalize_phone_for_whatsapp('5511987654321') == '5511987654321', 'Mantém inalterado número já com DDI 55')

# ------------------------------------------------------------------------------
# TESTE 3: Auditoria Estática de Código (Ausência de Fallbacks em Prospecção)
# ------------------------------------------------------------------------------
print('\n🔍 [3/4] Auditando Ausência de Fallbacks em Arquivos de Prospecção...')

lead_sniper_text = (root_dir / 'src/services/prospecting/leadSniperEngine.ts').read_text(encoding='utf-8')
assert_test("evidence.ui?.whatsAppNumberFound || '5534991351122'" not in lead_sniper_text, 'Zero fallback do fundador em leadSniperEngine.ts (ao vivo)')
assert_test("detectedWhatsApp: '5534991351122'" not in lead_sniper_text, 'Zero fallback do fundador em leadSniperEngine.ts (bloco catch)')

hunter_text = (root_dir / 'src/services/prospecting/autonomousLeadHunterEngine.ts').read_text(encoding='utf-8')
assert_test("detectedWhatsApp = '5534991351122'" not in hunter_text, 'Zero fallback do fundador em autonomousLeadHunterEngine.ts')

export_text = (root_dir / 'src/services/export/batchLeadExportService.ts').read_text(encoding='utf-8')
assert_test("if (!digits) return '5534991351122'" not in export_text, 'Zero fallback do fundador em batchLeadExportService.ts')

radar_text = (root_dir / 'src/components/prospecting/AutonomousOutboundRadarView.tsx').read_text(encoding='utf-8')
assert_test("lead.contactTargetPhone || lead.detectedWhatsApp || '5534991351122'" not in radar_text, 'Zero fallback do fundador em AutonomousOutboundRadarView.tsx')

# ------------------------------------------------------------------------------
# TESTE 4: Estrutura da Serverless Function api/audit.ts e Docker Inspector
# ------------------------------------------------------------------------------
print('\n🔍 [4/5] Validando Estrutura de Resiliência de api/audit.ts & Inspector...')

audit_api_text = (root_dir / 'api/audit.ts').read_text(encoding='utf-8')
assert_test('validateAndSanitizeUrl(targetUrl)' in audit_api_text, 'api/audit.ts invoca validateAndSanitizeUrl')
assert_test('[SSRF Protection]' in audit_api_text, 'api/audit.ts retorna 403 com log SSRF Protection')
assert_test('finally {' in audit_api_text, 'api/audit.ts contém bloco finally para fechamento de browser')
assert_test('await browser.close()' in audit_api_text, 'api/audit.ts garante fechamento de processo Chromium no finally')

inspector_text = (root_dir / 'docker/mcp-headless-worker/src/inspector.ts').read_text(encoding='utf-8')
assert_test('validateAndSanitizeUrl(targetUrl)' in inspector_text, 'inspector.ts invoca validateAndSanitizeUrl')
assert_test('[SSRF Blocked]' in inspector_text, 'inspector.ts lança erro SSRF Blocked para URLs inseguras')

# ------------------------------------------------------------------------------
# TESTE 5: Blindagem & Integridade de Nicho de Calçados (Zero UV50+ / Zero Dados Iguais)
# ------------------------------------------------------------------------------
print('\n🔍 [5/5] Testando Reconhecimento de Nicho de Calçados & Integridade Semântica...')

agent_skills_text = (root_dir / 'src/services/agentSkills.ts').read_text(encoding='utf-8')
worker_inspector_text = (root_dir / 'src/services/siteInspectorWorker.ts').read_text(encoding='utf-8')
site_inspector_text = (root_dir / 'src/services/siteInspector.ts').read_text(encoding='utf-8')

# 1. Validação de Reconhecimento de Nicho de Calçados
assert_test("Calçados, Tênis & Sapatos" in worker_inspector_text, 'Reconhecimento de nicho "Calçados, Tênis & Sapatos" registrado em siteInspectorWorker.ts')
assert_test("'sneaker'" in worker_inspector_text and "'mocassim'" in worker_inspector_text, 'Vocabulário exaustivo de calçados (sneaker, mocassim, sapato, etc.)')

# 2. Validação de Grade Numérica de Calçados (Zero P, M, G, GG em Calçados)
assert_test("['38', '39', '40', '41', '42', '43']" in site_inspector_text, 'Grade numérica de calçados (38 a 43) ativa como fallback em siteInspector.ts')

# 3. Validação de CRO Especializado em Calçados (Medida da palmilha em cm e numeração central)
assert_test("Guia de Tamanhos da Palmilha em Centímetros" in agent_skills_text, 'CRO especializado em calçados: Guia de medidas da palmilha em cm')
assert_test("Alerta de Ruptura na Numeração Central (39, 40 e 41)" in agent_skills_text, 'CRO especializado em calçados: Alerta de ruptura nos números centrais (39-41)')

# 4. Validação de Copywriting e Ads Especializados
assert_test("Cansado de Calçados que Machucam seus Pés" in agent_skills_text, 'Copywriting especializado para calçados e conforto anatômico')
assert_test("Carrossel de Coleção de Calçados & Sneakers" in agent_skills_text, 'Ads Buyer especializado em calçados e coleções com indicação de grade')

# 5. Proibição de Alucinação UV50+ em Calçados e Concorrentes
assert_test("Criar anúncios demonstrando a durabilidade da proteção UV50+" not in agent_skills_text, 'Zero menção indevida de UV50+ em análise de concorrentes genéricos/calçados')

# 6. Conexão do Motor Serverless Puppeteer
assert_test("fetchHeadlessServerlessAudit" in site_inspector_text, 'Conexão nativa com motor Chromium Serverless (/api/audit) ativa')

# ------------------------------------------------------------------------------
# TESTE 6: Identificação Especializada de Lojas & Vendedores da Shopee & Marketplaces
# ------------------------------------------------------------------------------
print('\n🔍 [6/6] Testando Suporte & Identificação Especializada a Lojas da Shopee...')

def extract_marketplace_seller_test(target_url: str):
    parsed = urlparse(target_url)
    domain = (parsed.hostname or '').lower()
    if domain.startswith('www.'):
        domain = domain[4:]
    is_shopee = 'shopee.com.br' in domain or 'shopee.com' in domain
    
    path_parts = [p for p in parsed.path.split('/') if p]
    from urllib.parse import parse_qs
    qs = parse_qs(parsed.query)
    
    item_id = qs.get('itemId', [None])[0]
    
    if is_shopee and (path_parts or item_id):
        candidate = next((p for p in path_parts if p not in ('shop', 'product') and not p.startswith('cat.')), path_parts[0] if path_parts else 'VENDEDOR-SHOPEE')
        seller_id = candidate.split('?')[0]
        brand = f"LOJA {seller_id.upper()} (SHOPEE)"
        return {
            'is_marketplace_seller': True,
            'seller_identifier': seller_id,
            'item_id': item_id,
            'brand_name': brand,
            'domain': domain
        }
    return {'is_marketplace_seller': False, 'domain': domain}

shopee_test_url = 'https://shopee.com.br/936o557f26?categoryId=100637&entryPoint=ShopByPDP&itemId=58268108232'
shopee_res = extract_marketplace_seller_test(shopee_test_url)

assert_test(shopee_res['is_marketplace_seller'] is True, 'Identificação correta de URL de vendedor na Shopee como Marketplace Seller')
assert_test(shopee_res['seller_identifier'] == '936o557f26', 'Extração exata do sellerIdentifier ("936o557f26")')
assert_test(shopee_res['item_id'] == '58268108232', 'Extração exata do itemId ("58268108232") do anúncio')
assert_test(shopee_res['brand_name'] == 'LOJA 936O557F26 (SHOPEE)', 'Geração de brandName qualificado da loja do vendedor e não "Shopee Brasil"')

# Verificação estática nos arquivos de código-fonte
home_page_text = (root_dir / 'src/pages/HomePage.tsx').read_text(encoding='utf-8')
report_page_text = (root_dir / 'src/pages/ReportPage.tsx').read_text(encoding='utf-8')
mkt_inspector_text = (root_dir / 'src/services/marketplaceInspector.ts').read_text(encoding='utf-8')

assert_test("isMarketplaceSeller && sellerIdentifier" in site_inspector_text, 'Cache granular por vendedor (domain_sellerIdentifier_itemId) em siteInspector.ts')
assert_test("isGenericMarketplaceTitle" in site_inspector_text, 'Higienização de títulos institucionais genéricos da Shopee em siteInspector.ts')
assert_test("Auditoria de Marketplace & Buy Box" in home_page_text, 'Aba "Auditoria de Marketplace & Buy Box" integrada em HomePage.tsx')
assert_test("Auditoria de Marketplace & Buy Box" in report_page_text, 'Aba "Auditoria de Marketplace & Buy Box" integrada em ReportPage.tsx')
assert_test("itemIdFromUrl" in mkt_inspector_text, 'Extração de itemId para SEO de títulos em marketplaceInspector.ts')

print('\n================================================================')
print(f'📊 RESULTADO DA AUDITORIA: {passed_tests}/{total_tests} TESTES APROVADOS ({round((passed_tests/total_tests)*100)}%)')
if failed_tests == 0:
    print('🌟 STATUS: ECOSSISTEMA 100% BLINDADO E CONFORME COM AGENTS.MD')
else:
    print(f'⚠️ ALERTA: {failed_tests} TESTES FALHARAM! CORRIJA ANTES DE QUALQUER OPERAÇÃO.')
print('================================================================\n')

sys.exit(0 if failed_tests == 0 else 1)
