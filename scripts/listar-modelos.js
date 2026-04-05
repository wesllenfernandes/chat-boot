require('dotenv').config();
const OllamaService = require('../src/services/OllamaService');

async function listarModelos() {
  console.log('📦 Listando modelos disponíveis no Ollama...\n');
  
  try {
    const modelos = await OllamaService.listaModelosDisponiveis();
    
    if (modelos.length === 0) {
      console.log('❌ Nenhum modelo instalado.\n');
      console.log('💡 Para instalar modelos, execute um dos seguintes comandos:\n');
      console.log('   # Modelo principal (recomendado)');
      console.log('   ollama pull llama3.2\n');
      console.log('   # Modelos alternativos');
      console.log('   ollama pull mistral');
      console.log('   ollama pull gemma\n');
      console.log('   # Modelo para transcrição de áudio');
      console.log('   ollama pull whisper\n');
      console.log('   # Modelos mais antigos');
      console.log('   ollama pull llama3.1');
      console.log('   ollama pull llama3');
    } else {
      console.log(`✅ Encontrados ${modelos.length} modelo(s):\n`);
      
      modelos.forEach((modelo, index) => {
        console.log(`${index + 1}. ${modelo}`);
      });
      
      console.log('\n💡 Para usar um modelo específico, edite o arquivo .env:');
      console.log('   OLLAMA_MODEL=nome_do_modelo\n');
      
      const modeloAtual = process.env.OLLAMA_MODEL || 'llama3.2';
      console.log(`🎯 Modelo atual configurado: ${modeloAtual}`);
      
      if (modelos.includes(modeloAtual)) {
        console.log('   ✅ Modelo configurado está instalado');
      } else {
        console.log('   ⚠️  Modelo configurado NÃO está instalado');
        console.log(`   💡 Execute: ollama pull ${modeloAtual}`);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao listar modelos:', error.message);
    console.log('\n💡 Certifique-se de que o Ollama está em execução:');
    console.log('   ollama serve');
  }
  
  console.log('\n🔗 Mais informações:');
  console.log('   https://ollama.ai/library');
}

listarModelos().catch(error => {
  console.error('❌ Erro ao listar modelos:', error);
  process.exit(1);
});