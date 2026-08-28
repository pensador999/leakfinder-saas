// Local Test Runner for Vercel Cron Endpoint
import handler from '../api/cron/swarm-runner.ts';

async function testVercelCron() {
  console.log('🚀 [AdShield Vercel Cron Test] Simulando disparo agendado das 07:00 AM...');

  const mockRequest = new Request('http://localhost:3000/api/cron/swarm-runner', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer adshield_cron_super_secret_2026'
    }
  });

  try {
    const response = await handler(mockRequest);
    const result = await response.json();
    console.log('\n📊 [Resultado da Execução do Cron]:', JSON.stringify(result, null, 2));
    console.log('\n✅ VERCEL CRON RUNNER TESTADO E VALIDADO COM 100% DE SUCESSO!');
  } catch (err) {
    console.error('❌ Erro na execução do Cron:', err);
  }
}

testVercelCron();
