require('dotenv').config();
const ChatbotService = require('../src/services/ChatbotService');

async function testarFluxo() {
  console.log('🧪 Testando fluxo do Chatbot...\n');

  const telefoneTeste = '5511999999999';

  // Teste 1: Saudação
  console.log('1️⃣ Testando saudação "Olá"');
  try {
    const resultado = await ChatbotService.processarMensagem(telefoneTeste, 'Olá');
    console.log('✅ Saudação processada com sucesso!');
    console.log(`📝 Resposta: "${resultado.resposta.substring(0, 100)}..."`);
    console.log(`📋 Próxima etapa: ${resultado.proximaEtapa}\n`);
  } catch (error) {
    console.error('❌ Erro ao processar saudação:', error);
  }

  // Teste 2: Pergunta sobre horário
  console.log('2️⃣ Testando pergunta "Qual o horário?"');
  try {
    const resultado = await ChatbotService.processarMensagem(telefoneTeste, 'Qual o horário?');
    console.log('✅ Pergunta processada com sucesso!');
    console.log(`📝 Resposta: "${resultado.resposta.substring(0, 100)}..."`);
    console.log(`📋 Próxima etapa: ${resultado.proximaEtapa}\n`);
  } catch (error) {
    console.error('❌ Erro ao processar pergunta:', error);
  }

  // Teste 3: Pergunta sobre preço
  console.log('3️⃣ Testando pergunta "Quanto custa a pizza de calabresa?"');
  try {
    const resultado = await ChatbotService.processarMensagem(telefoneTeste, 'Quanto custa a pizza de calabresa?');
    console.log('✅ Pergunta processada com sucesso!');
    console.log(`📝 Resposta: "${resultado.resposta.substring(0, 100)}..."`);
    console.log(`📋 Próxima etapa: ${resultado.proximaEtapa}\n`);
  } catch (error) {
    console.error('❌ Erro ao processar pergunta:', error);
  }

  // Teste 4: Cardápio
  console.log('4️⃣ Testando comando "cardápio"');
  try {
    const resultado = await ChatbotService.processarMensagem(telefoneTeste, 'cardápio');
    console.log('✅ Comando processado com sucesso!');
    console.log(`📝 Resposta: "${resultado.resposta.substring(0, 100)}..."`);
    console.log(`📋 Próxima etapa: ${resultado.proximaEtapa}\n`);
  } catch (error) {
    console.error('❌ Erro ao processar comando:', error);
  }

  // Teste 5: Pedido em linguagem natural
  console.log('5️⃣ Testando pedido "Quero uma pizza de frango"');
  try {
    const resultado = await ChatbotService.processarMensagem(telefoneTeste, 'Quero uma pizza de frango');
    console.log('✅ Pedido processado com sucesso!');
    console.log(`📝 Resposta: "${resultado.resposta.substring(0, 100)}..."`);
    console.log(`📋 Próxima etapa: ${resultado.proximaEtapa}\n`);
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error);
  }

  console.log('✅ Testes concluídos!');
}

testarFluxo().catch(error => {
  console.error('❌ Erro nos testes:', error);
  process.exit(1);
});