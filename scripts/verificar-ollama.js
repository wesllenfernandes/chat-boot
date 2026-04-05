require('dotenv').config();
const OllamaService = require('../src/services/OllamaService');

async function verificarOllama() {
  console.log('🔍 Verificando conexão com Ollama...\n');
  
  const disponivel = await OllamaService.verificarOllamaDisponivel();
  
  if (disponivel) {
    console.log('✅ Ollama está disponível e conectado!\n');
    
    const modelos = await OllamaService.listaModelosDisponiveis();
    console.log('📦 Modelos disponíveis:');
    if (modelos.length === 0) {
      console.log('   Nenhum modelo instalado.');
      console.log('\n💡 Para instalar modelos, execute:');
      console.log('   ollama pull llama3.2');
      console.log('   ollama pull whisper');
    } else {
      modelos.forEach(modelo => {
        console.log(`   - ${modelo}`);
      });
    }
    
    console.log('\n🎉 Configuração do Ollama:');
    console.log(`   URL: ${OllamaService.baseUrl}`);
    console.log(`   Modelo: ${OllamaService.model}`);
  } else {
    console.log('❌ Ollama não está disponível!\n');
    console.log('Possíveis causas:');
    console.log('1. Ollama não está instalado');
    console.log('2. Ollama não está em execução');
    console.log('3. URL do Ollama está incorreta no arquivo .env\n');
    console.log('💡 Para instalar o Ollama:');
    console.log('   - Windows: Baixe em https://ollama.ai/download');
    console.log('   - Linux: curl -fsSL https://ollama.com/install.sh | sh');
    console.log('   - macOS: brew install ollama\n');
    console.log('💡 Para iniciar o Ollama:');
    console.log('   - Execute o comando: ollama serve');
  }
  
  console.log('\n📝 Variáveis de ambiente:');
  console.log(`   OLLAMA_BASE_URL: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);
  console.log(`   OLLAMA_MODEL: ${process.env.OLLAMA_MODEL || 'llama3.2'}`);
  console.log(`   USAR_OLLAMA: ${process.env.USAR_OLLAMA || 'true'}`);
}

verificarOllama().catch(error => {
  console.error('❌ Erro ao verificar Ollama:', error);
  process.exit(1);
});