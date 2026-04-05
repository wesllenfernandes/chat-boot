# 🎤 Processamento de Áudio 100% Local

## Como Funciona

O chatbot usa o modelo **Whisper do Ollama** para transcrição de áudio, que funciona **100% localmente** e **sem APIs externas**.

## Instalação

### 1. Instalar o Ollama

```bash
# Windows
winget install Ollama.Ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# macOS
brew install ollama
```

### 2. Baixar o Modelo Whisper

```bash
ollama pull whisper
```

### 3. Verificar Instalação

```bash
# Listar modelos instalados
ollama list

# Testar transcrição (requer arquivo de áudio)
# Este teste está disponível no script npm run testar-ia
npm run testar-ia
```

## Tecnologias

- **Whisper (Ollama)**: Modelo de reconhecimento de fala open-source da OpenAI, executado localmente via Ollama
- **Sem APIs Externas**: Toda a transcrição é feita no servidor local
- **Formatos Suportados**: MP3, OGG, WAV, e outros formatos de áudio comuns

## Arquitetura

```
Mensagem de Áudio (WhatsApp)
         ↓
   ┌─────────────┐
   │ Download do│
   │   áudio     │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ Converte    │
   │ para Base64 │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │   Ollama    │
   │   Whisper   │
   │   (Local)   │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ Transcrição │
   │    em Texto │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ Processa    │
   │ mensagem    │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │  Envia      │
   │  resposta   │
   └─────────────┘
```

## Vantagens

✅ **100% Offline** - Funciona sem internet
✅ **Sem Custos** - Não paga por transcrição
✅ **Privacidade** - Áudio nunca sai do servidor
✅ **Sem APIs** - Não precisa configurar nada externo
✅ **Rápido** - Processamento local, sem latência de rede

## Exemplos de Uso

### Exemplo 1: Pedido Simples

```
Cliente: [Envia áudio dizendo "quero uma pizza de calabresa"]
Bot: 🎤 Áudio transcrito: "quero uma pizza de calabresa"
     Processando sua mensagem...
     ✅ Entendi seu pedido!

     ✅ 1x Pizza Calabresa

     Deseja adicionar mais itens?
```

### Exemplo 2: Pedido Complexo

```
Cliente: [Envia áudio dizendo "quero duas pizzas de quatro queijos e um refrigerante"]
Bot: 🎤 Áudio transcrito: "quero duas pizzas de quatro queijos e um refrigerante"
     Processando sua mensagem...
     ✅ Entendi seu pedido!

     ✅ 2x Pizza Quatro Queijos
     ✅ 1x Refrigerante

     Deseja adicionar mais itens?
```

### Exemplo 3: Pergunta

```
Cliente: [Envia áudio perguntando "qual o horário de funcionamento?"]
Bot: 🎤 Áudio transcrito: "qual o horário de funcionamento?"
     Processando sua mensagem...
     Nossa pizzaria funciona de terça a domingo, das 18h às 23h! 🕐
```

## Troubleshooting

### Erro: "Não foi possível transcrever o áudio"

**Causa 1**: Modelo Whisper não instalado

```bash
# Instalar o modelo
ollama pull whisper

# Verificar se está instalado
ollama list
```

**Causa 2**: Ollama não está rodando

```bash
# Iniciar o Ollama
ollama serve
```

**Causa 3**: Formato de áudio não suportado

- O WhatsApp geralmente envia áudios em formato OGG ou MP3
- Se o cliente tiver problemas, peça para enviar novamente

### Áudio não é transcrito

**Verificar**:
1. Ollama está rodando?
2. Modelo Whisper está instalado?
3. Formato do áudio é suportado?

```bash
# Testar manualmente
npm run verificar-ollama
```

### Transcrição muito lenta

**Soluções**:
1. Usar hardware mais potente
2. Usar GPU (se disponível)
3. Usar modelo menor (se houver variantes do Whisper)

## Configuração Avançada

### Alterar Modelo

Se houver outras variantes do Whisper disponíveis no Ollama:

```javascript
// Em src/services/OllamaService.js
async transcreverAudio(audioBuffer) {
  const response = await this.makeRequest('/api/generate', {
    model: 'whisper-base', // ou 'whisper-small', 'whisper-medium'
    prompt: audioBuffer.toString('base64')
  });
  return response.response;
}
```

### Personalizar Transcrição

Você pode adicionar contexto para melhorar a precisão:

```javascript
// Em src/services/OllamaService.js
async transcreverAudio(audioBuffer) {
  const response = await this.makeRequest('/api/generate', {
    model: 'whisper',
    prompt: audioBuffer.toString('base64'),
    options: {
      temperature: 0,
      // Outras opções do Whisper...
    }
  });
  return response.response;
}
```

## Comparação com APIs Externas

| Característica | Whisper (Ollama) | APIs Externas |
|---------------|----------------|---------------|
| Custo | Gratuito | Por uso |
| Privacidade | 100% local | Dados na nuvem |
| Offline | Sim | Não |
| Latência | Baixa (local) | Alta (rede) |
| Setup | Ollama + Whisper | API Key |
| Manutenção | Atualizações Ollama | Dependência do provedor |

## Referências

- [Ollama](https://ollama.ai/)
- [Whisper](https://github.com/openai/whisper)
- [Modelos Whisper no Ollama](https://ollama.ai/library/whisper)

---

**🎤 Processamento de áudio 100% local, sem APIs externas!**