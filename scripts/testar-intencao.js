require('dotenv').config();
const AIService = require('../src/services/AIService');

async function testarInterpretacaoIntencao() {
  console.log('🧪 Testando interpretação de intenção...\n');

  const testes = [
    'não, quero finalizar o pedido',
    'está bom, pode finalizar',
    'só isso por enquanto',
    'não, obrigado',
    'sim, quero adicionar uma pizza de frango',
    'quero mais uma pizza',
    'sim',
    'não quero mais nada',
    'quero ver o cardápio',
    'está bom assim, pode fechar'
  ];

  for (const teste of testes) {
    console.log(`\n1️⃣ Testando: "${teste}"`);
    try {
      const resultado = await AIService.interpretarIntencao(teste, ['Pizza Calabresa']);
      console.log(`   Intenção: ${resultado.intencao}`);
      console.log(`   É pedido: ${resultado.ePedido}`);
      console.log(`   Produtos: ${JSON.stringify(resultado.produtos)}`);
    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}`);
    }
  }

  console.log('\n✅ Testes concluídos!');
}

testarInterpretacaoIntencao().catch(error => {
  console.error('❌ Erro nos testes:', error);
  process.exit(1);
});