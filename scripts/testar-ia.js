require('dotenv').config();
const AIService = require('../src/services/AIService');

async function testarSistema() {
  console.log('🧪 Testando sistema de IA híbrida...\n');
  
  // Testar conexão com Ollama
  console.log('1️⃣ Testando conexão com Ollama...');
  try {
    const resposta = await AIService.gerarResposta('Olá!');
    console.log('✅ Ollama está funcionando!');
    console.log(`   Resposta: "${resposta.substring(0, 50)}..."\n`);
  } catch (error) {
    console.log('❌ Ollama não está disponível');
    console.log(`   Erro: ${error.message}\n`);
  }
  
  // Testar interpretação de pedidos
  console.log('2️⃣ Testando interpretação de pedidos...');
  try {
    const interpretacao = await AIService.interpretarPedido('quero duas pizzas de calabresa');
    console.log('✅ Interpretação funcionou!');
    console.log(`   É pedido: ${interpretacao.ePedido}`);
    console.log(`   Produtos: ${JSON.stringify(interpretacao.produtos)}\n`);
  } catch (error) {
    console.log('❌ Interpretação de pedidos falhou');
    console.log(`   Erro: ${error.message}\n`);
  }
  
  // Testar respostas
  console.log('3️⃣ Testando respostas a perguntas...');
  try {
    const resposta1 = await AIService.gerarResposta('Qual o horário de funcionamento?');
    console.log('✅ Pergunta 1 processada!');
    console.log(`   "${resposta1.substring(0, 60)}..."\n`);
  } catch (error) {
    console.log('❌ Resposta a perguntas falhou');
    console.log(`   Erro: ${error.message}\n`);
  }
  
  try {
    const resposta2 = await AIService.gerarResposta('Vocês aceitam cartão?');
    console.log('✅ Pergunta 2 processada!');
    console.log(`   "${resposta2.substring(0, 60)}..."\n`);
  } catch (error) {
    console.log('❌ Resposta a perguntas falhou');
    console.log(`   Erro: ${error.message}\n`);
  }
  
  // Testar transcrição de áudio (simulado)
  console.log('4️⃣ Testando transcrição de áudio...');
  try {
    console.log('⚠️  Este teste requer um arquivo de áudio real');
    console.log('💡 Para testar, envie uma mensagem de áudio pelo WhatsApp\n');
  } catch (error) {
    console.log('❌ Transcrição de áudio falhou');
    console.log(`   Erro: ${error.message}\n`);
  }
  
  console.log('✅ Testes concluídos!');
  console.log('\n💡 Dicas:');
  console.log('   - Se Ollama não está conectando, execute: ollama serve');
  console.log('   - Para instalar modelos: ollama pull llama3.2 && ollama pull whisper');
  console.log('   - Para verificar instalação: npm run verificar-ollama\n');
}

testarSistema().catch(error => {
  console.error('❌ Erro nos testes:', error);
  process.exit(1);
});