# Configuração do Chatbot com Ollama (100% Local)

Este chatbot funciona de forma totalmente local, utilizando um modelo de linguagem local (Ollama) para processar interações fora do contexto de pedidos, atuando como um atendente de balcão inteligente.

**⚠️ IMPORTANTE**: Este sistema funciona 100% offline e não requer nenhuma API externa!

## Funcionalidades

### 🤖 Atendente de Balcão Inteligente

- **Respostas contextuais**: O chatbot responde perguntas sobre a pizzaria de forma natural
- **Interpretação de pedidos em linguagem natural**: Pede "quero duas pizzas de calabresa" e o bot entende
- **Transcrição de áudio**: Mensagens de áudio são transcritas automaticamente usando Whisper do Ollama
- **100% Local**: Todas as operações são executadas localmente, sem APIs externas

### 🎤 Suporte a Mensagens de Áudio

O chatbot pode receber mensagens de áudio (notas de voz ou áudios do WhatsApp) e:

1. Transcrever o áudio para texto usando Whisper do Ollama (100% local)
2. Processar a mensagem transcrita normalmente
3. Responder ao cliente normalmente

## Instalação e Configuração do Ollama

### 1. Instalar Ollama

**Windows:**
```bash
# Baixe o instalador em https://ollama.ai/download
# Ou use winget:
winget install Ollama.Ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**macOS:**
```bash
# Baixe o instalador em https://ollama.ai/download
# Ou use Homebrew:
brew install ollama
```

### 2. Baixar Modelos

Após instalar o Ollama, baixe os modelos necessários:

```bash
# Modelo principal para respostas (recomendado)
ollama pull llama3.2

# Modelo para transcrição de áudio
ollama pull whisper
```

### 3. Verificar Instalação

```bash
# Verificar se o Ollama está rodando
ollama list

# Testar o modelo
ollama run llama3.2 "Olá, como você está?"
```

### 4. Configurar Variáveis de Ambiente

Edite o arquivo `.env` e configure as seguintes variáveis:

```env
# URL do Ollama (padrão é localhost:11434)
OLLAMA_BASE_URL=http://localhost:11434

# Modelo a ser usado para respostas
OLLAMA_MODEL=llama3.2
```

**⚠️ IMPORTANTE**: Não é necessário configurar nenhuma API externa. O sistema funciona 100% localmente com o Ollama.

## Como Usar

### Perguntas e Dúvidas

O chatbot agora responde a perguntas sobre a pizzaria:

```
Cliente: Qual o horário de funcionamento?
Bot: Nossa pizzaria funciona de terça a domingo, das 18h às 23h! 🕐

Cliente: Vocês aceitam cartão?
Bot: Sim! Aceitamos cartão de crédito, débito, Pix e dinheiro em espécie! 💳
```

### Pedidos em Linguagem Natural

O chatbot pode interpretar pedidos descritos em linguagem natural:

```
Cliente: Quero duas pizzas de calabresa
Bot: ✅ Entendi seu pedido!

✅ 2x Pizza Calabresa

Deseja adicionar mais itens?

Digite o número de outro produto, descreva outro pedido ou "finalizar" para continuar com o pagamento.
```

```
Cliente: Me dá uma pizza de quatro queijos e um refrigerante
Bot: ✅ Entendi seu pedido!

✅ 1x Pizza Quatro Queijos
✅ 1x Refrigerante

Deseja adicionar mais itens?

Digite o número de outro produto, descreva outro pedido ou "finalizar" para continuar com o pagamento.
```

### Mensagens de Áudio

O cliente pode enviar mensagens de áudio:

1. Cliente envia uma nota de voz
2. Bot transcreve: "🎤 Áudio transcrito: 'Quero uma pizza de margherita' Processando sua mensagem..."
3. Bot processa o pedido normalmente

## Modelos Disponíveis

### Modelos de Linguagem (para respostas e interpretação)

- **llama3.2** (Recomendado) - Equilíbrio entre performance e velocidade
- **llama3.1** - Modelo mais antigo, mas estável
- **mistral** - Alternativa eficiente
- **gemma** - Modelo compacto e rápido

Para usar outro modelo, altere a variável `OLLAMA_MODEL` no `.env`:

```env
OLLAMA_MODEL=mistral
```

### Modelos de Transcrição (áudio)

- **whisper** - Modelo padrão para transcrição de áudio
- **whisper-large** - Mais preciso, mas mais lento

## Personalização

### Alterar o Comportamento da IA

Edite o arquivo `src/services/OllamaService.js` para modificar o prompt do sistema:

```javascript
const systemPrompt = `Você é um atendente de balcão da Pizzaria Otaliva 🍕. 
Sua função é:
- Responder perguntas sobre a pizzaria de forma cordial e profissional
- Ajudar com informações sobre produtos, horários, formas de pagamento, etc.
- ...`;
```

### Adicionar Informações da Pizzaria

Você pode personalizar as respostas da IA para incluir informações específicas:

```javascript
const systemPrompt = `Você é um atendente de balcão da Pizzaria Otaliva 🍕.

INFORMAÇÕES DA PIZZARIA:
- Horário: Terça a Domingo, 18h às 23h
- Telefone: (11) 99999-9999
- Endereço: Rua Example, 123
- Taxa de entrega: R$ 5,00
- Tempo de entrega: 40-50 minutos

...`;
```

## 📌 Importante

### Sem APIs Externas

Este sistema funciona 100% localmente e **não requer nenhuma API externa**:

- ❌ **Não usa OpenAI**
- ❌ **Não usa Google Cloud**
- ❌ **Não usa Azure**
- ❌ **Não usa qualquer serviço pago de IA**

Todas as funções (respostas, interpretação de pedidos, transcrição de áudio) são executadas localmente usando o Ollama.

### Dependências Removidas

A dependência do OpenAI foi removida do `package.json` para garantir que o sistema funcione 100% offline.

## Troubleshooting

### Ollama não está conectando

**Problema:** Erro ao conectar com Ollama

**Soluções:**

1. Verificar se o Ollama está rodando:
```bash
# Windows
Get-Process ollama

# Linux/Mac
ps aux | grep ollama
```

2. Reiniciar o Ollama:
```bash
# Windows
# Feche o terminal e abra novamente

# Linux/Mac
pkill ollama
ollama serve
```

3. Verificar se a porta 11434 está disponível:
```bash
# Testar conexão
curl http://localhost:11434/api/tags
```

### Transcrição de áudio não funciona

**Problema:** Erro ao transcrever mensagens de áudio

**Soluções:**

1. Verificar se o modelo whisper está instalado:
```bash
ollama list
```

2. Baixar o modelo whisper:
```bash
ollama pull whisper
```

3. Verificar se o formato de áudio é suportado (MP3, OGG, etc.)

### Interpretação de pedidos incorreta

**Problema:** O bot não interpreta corretamente pedidos em linguagem natural

**Soluções:**

1. Verificar se o modelo está configurado corretamente no `.env`
2. Testar a interpretação manualmente:
```bash
ollama run llama3.2 "Quero duas pizzas de calabresa"
```
3. Ajustar o prompt no `OllamaService.js` se necessário

### Ollama está lento

**Problema:** Respostas demoradas

**Soluções:**

1. Usar um modelo menor:
```env
OLLAMA_MODEL=llama3.2:3b
```

2. Aumentar o número de threads do Ollama:
```bash
# Windows - Editar variável de ambiente OLLAMA_NUM_THREAD
setx OLLAMA_NUM_THREAD 4

# Linux/Mac
export OLLAMA_NUM_THREAD=4
```

3. Usar GPU (se disponível)

## Arquitetura 100% Local

O sistema funciona da seguinte maneira (100% local, sem APIs externas):

```
Mensagem do Cliente
        ↓
   ┌─────────┐
   │ WhatsApp │
   │ Controller │
   └────┬────┘
        ↓
   ┌─────────┐
   │Chatbot │
   │Service │
   └────┬────┘
        ↓
   ┌─────────┐
   │ É pedido │
   │numerado? │
   └────┬────┘
     SIM │   │ NÃO
        ↓   ↓
   ┌───────┐ ┌─────────────┐
   │ Processar│ │ Interpretar │
   │ normally│ │ pedido com │
   │  (fluxo) │ │    IA       │
   └───────┘ └──────┬──────┘
                    ↓
              ┌──────────┐
              │  Ollama  │
              │ (Local)  │
              └──────────┘
```

## Exemplos de Uso

### Exemplo 1 - Pergunta simples
```
Cliente: Vocês têm pizza vegetariana?
Bot: Sim! Temos a Pizza Vegetariana por R$ 38,00 🥗 É feita com legumes frescos e muito sabor!
```

### Exemplo 2 - Pedido em linguagem natural
```
Cliente: Quero uma pizza de calabresa e uma água mineral
Bot: ✅ Entendi seu pedido!

✅ 1x Pizza Calabresa
✅ 1x Água Mineral

Deseja adicionar mais itens?

Digite o número de outro produto, descreva outro pedido ou "finalizar" para continuar com o pagamento.
```

### Exemplo 3 - Mensagem de áudio
```
[Cliente envia áudio dizendo "quero pedir uma pizza de pepperoni"]
Bot: 🎤 Áudio transcrito: "quero pedir uma pizza de pepperoni"
     Processando sua mensagem...

Bot: ✅ Entendi seu pedido!

✅ 1x Pizza Pepperoni

Deseja adicionar mais itens?

Digite o número de outro produto, descreva outro pedido ou "finalizar" para continuar com o pagamento.
```

### Exemplo 4 - Informações gerais
```
Cliente: Qual a forma de pagamento?
Bot: Aceitamos várias formas de pagamento! 💳
     
     • Dinheiro em espécie
     • Pix
     • Cartão de crédito e débito
     
     Qualquer uma dessas opções é válida na hora do pagamento! 😊
```

## Próximos Passos

- Treinar um modelo específico para sua pizzaria
- Adicionar mais informações ao prompt (promocões, eventos, etc.)
- Implementar contexto de conversa multi-turno
- Adicionar suporte a múltiplos idiomas
- Implementar reconhecimento de sentimentos

## Suporte

Para problemas ou dúvidas:
- Verifique a documentação do Ollama: https://github.com/ollama/ollama
- Verifique a documentação do Whisper: https://github.com/openai/whisper
- Abra uma issue no repositório do projeto