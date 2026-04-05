const http = require('http');

class OllamaService {
  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async gerarResposta(mensagem, contexto = {}) {
    try {
      const cardapio = this.formatarCardapioParaPrompt();

      const systemPrompt = `Você é um atendente de balcão da Pizzaria Otaliva 🍕.

INFORMAÇÕES DA PIZZARIA:
- Nome: Pizzaria Otaliva
- Horário de funcionamento: Terça a domingo, das 18h às 23h
- Formas de pagamento: Dinheiro, Pix, Cartão de crédito e débito
- Taxa de entrega: R$ 5,00
- Tempo estimado de entrega: 40-50 minutos
- Localização: Rua Example, 123 - Centro

${cardapio}

Sua função principal:
1. Responder saudações de forma natural e amigável
2. Responder perguntas sobre a pizzaria (preços, horários, formas de pagamento, etc.)
3. Interpretar pedidos em linguagem natural
4. Ajudar o cliente a fazer pedidos quando ele demonstrar interesse
5. Oferecer o cardápio quando o cliente perguntar sobre opções ou quando apropriado

COMPORTAMENTO:
- Seja cordial, profissional e amigável
- Use emojis quando apropriado (🍕, 👋, 😊, etc.)
- Use português brasileiro natural e conversacional
- Mantenha respostas breves e diretas
- NÃO repita o cardápio inteiro a cada resposta
- Mostre o cardápio apenas quando:
  * O cliente pedir explicitamente ("quero ver o cardápio")
  * O cliente perguntar sobre opções/sabores
  * For apropriado para a conversação

INSTRUÇÕES ESPECIAIS:
- Quando o cliente quer fazer um pedido, diga: "Você pode fazer o pedido digitando o número do produto ou descrevendo o que deseja. Digite 'cardápio' para ver todas as opções."
- Para perguntas diretas (preços, horários, etc.), responda diretamente
- Seja útil e prestativo, como um atendente real`;

      console.log('📤 Enviando requisição para Ollama...');
      console.log(`📝 Mensagem: "${mensagem.substring(0, 50)}..."`);

      const response = await this.makeRequest('/api/chat', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mensagem }
        ],
        stream: false
      });

      console.log('✅ Resposta do Ollama recebida');
      console.log(`📦 Tipo de resposta: ${typeof response}`);
      console.log(`📦 Chaves da resposta: ${Object.keys(response)}`);

      if (!response || !response.message || !response.message.content) {
        console.error('❌ Resposta do Ollama em formato inválido:', response);
        return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
      }

      return response.message.content;
    } catch (error) {
      console.error('❌ Erro ao chamar Ollama:', error);
      console.error('Detalhes:', error.message);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
    }
  }

  async interpretarPedido(mensagem, contexto = {}) {
    try {
      const cardapio = this.formatarCardapioParaPrompt();

      const systemPrompt = `Você é um assistente que interpreta pedidos em linguagem natural para uma pizzaria.

${cardapio}

Sua tarefa: Analise a mensagem do cliente e retorne um JSON com a estrutura:
{
  "ePedido": true/false,
  "produtos": [
    {
      "id": número (se identificável),
      "nome": "nome do produto",
      "quantidade": número
    }
  ],
  "resposta": "resposta ao cliente se não for um pedido claro"
}

EXEMPLOS:
1. Mensagem: "quero duas pizzas de calabresa"
   {"ePedido": true, "produtos": [{"id": 1, "nome": "Pizza Calabresa", "quantidade": 2}], "resposta": ""}

2. Mensagem: "qual o horário de funcionamento?"
   {"ePedido": false, "produtos": [], "resposta": "Nossa pizzaria funciona de terça a domingo, das 18h às 23h."}

3. Mensagem: "quero uma pizza de quatro queijos e um refrigerante"
   {"ePedido": true, "produtos": [{"id": 5, "nome": "Pizza Quatro Queijos", "quantidade": 1}, {"id": 7, "nome": "Refrigerante", "quantidade": 1}], "resposta": ""}

Retorne APENAS o JSON, sem formatação markdown.`;

      const response = await this.makeRequest('/api/chat', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mensagem }
        ],
        stream: false,
        format: 'json'
      });

      return JSON.parse(response.message.content);
    } catch (error) {
      console.error('Erro ao interpretar pedido:', error);
      return { ePedido: false, produtos: [], resposta: null };
    }
  }

  async interpretarIntencao(mensagem, itensNoCarrinho) {
    try {
      const systemPrompt = `Você é um assistente que interpreta a intenção do cliente em uma pizzaria.

CONTEXTO: O cliente acabou de adicionar itens ao pedido. O bot perguntou ao cliente: "Gostaria de adicionar mais itens ao pedido ou deseja finalizar o pedido?"

Sua tarefa: Analise a resposta do cliente e retorne um JSON com a estrutura:
{
  "intencao": "adicionar" ou "finalizar" ou "nenhuma",
  "ePedido": true/false,
  "produtos": [
    {
      "id": número (se identificável),
      "nome": "nome do produto",
      "quantidade": número
    }
  ]
}

EXEMPLOS:
1. Mensagem: "não, quero finalizar o pedido"
   {"intencao": "finalizar", "ePedido": false, "produtos": []}

2. Mensagem: "está bom, pode finalizar"
   {"intencao": "finalizar", "ePedido": false, "produtos": []}

3. Mensagem: "só isso por enquanto"
   {"intencao": "finalizar", "ePedido": false, "produtos": []}

4. Mensagem: "sim, quero adicionar uma pizza de frango"
   {"intencao": "adicionar", "ePedido": true, "produtos": [{"id": 2, "nome": "Pizza Frango", "quantidade": 1}]}

5. Mensagem: "quero mais uma pizza"
   {"intencao": "adicionar", "ePedido": false, "produtos": []}

6. Mensagem: "sim"
   {"intencao": "adicionar", "ePedido": false, "produtos": []}

7. Mensagem: "quero ver o cardápio"
   {"intencao": "adicionar", "ePedido": false, "produtos": []}

8. Mensagem: "cardápio"
   {"intencao": "adicionar", "ePedido": false, "produtos": []}

9. Mensagem: "não, obrigado"
   {"intencao": "finalizar", "ePedido": false, "produtos": []}

10. Mensagem: "está bom assim, pode fechar"
   {"intencao": "finalizar", "ePedido": false, "produtos": []}

11. Mensagem: "não quero mais nada"
   {"intencao": "finalizar", "ePedido": false, "produtos": []}

12. Mensagem: "sim, quero mais"
   {"intencao": "adicionar", "ePedido": false, "produtos": []}

REGRAS IMPORTANTES:
- A pergunta foi: "Gostaria de adicionar mais itens ou deseja finalizar o pedido?"
- Primeira opção: "adicionar mais itens"
- Segunda opção: "finalizar o pedido"
- Se o cliente disser "sim" → Significa que escolheu a PRIMEIRA opção (adicionar itens)
- Se o cliente mencionar "finalizar", "encerrar", "fechar", "só isso", "está bom", "não quer mais", "não quero mais", "obrigado", "está bom assim" → intencao = "finalizar"
- Se o cliente mencionar "adicionar", "mais", "ver cardápio", "cardápio", "ver opções", "opções", "sim" → intencao = "adicionar"
- Se o cliente fizer um pedido explícito → ePedido = true e extraia os produtos
- Se não for claro → intencao = "nenhuma"

ATENÇÃO: "sim" SEMPRE significa "adicionar mais itens" neste contexto!

Retorne APENAS o JSON, sem formatação markdown.`;

      const response = await this.makeRequest('/api/chat', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mensagem }
        ],
        stream: false,
        format: 'json'
      });

      return JSON.parse(response.message.content);
    } catch (error) {
      console.error('Erro ao interpretar intenção:', error);
      return { intencao: 'nenhuma', ePedido: false, produtos: [] };
    }
  }

  async transcreverAudio(audioBuffer) {
    try {
      const response = await this.makeRequest('/api/generate', {
        model: 'whisper',
        prompt: audioBuffer.toString('base64'),
        stream: false
      });

      return response.response;
    } catch (error) {
      console.error('Erro ao transcrever áudio:', error);
      throw new Error('Não foi possível transcrever o áudio. Certifique-se de que o modelo whisper está instalado no Ollama.');
    }
  }

  formatarCardapioParaPrompt() {
    const cardapio = require('../config/cardapio').cardapio;
    let texto = 'CARDÁPIO DISPONÍVEL:\n';
    cardapio.forEach(item => {
      const emoji = item.tipo === 'pizza' ? '🍕' : item.tipo === 'bebida' ? '🥤' : '🍟';
      texto += `${item.id} - ${emoji} ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });
    return texto;
  }

  makeRequest(endpoint, data, method = 'POST') {
    return new Promise((resolve, reject) => {
      const postData = method === 'POST' ? JSON.stringify(data) : '';

      const options = {
        hostname: new URL(this.baseUrl).hostname,
        port: new URL(this.baseUrl).port,
        path: endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(method === 'POST' && { 'Content-Length': Buffer.byteLength(postData) })
        }
      };

      const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (method === 'POST' && postData) {
        req.write(postData);
      }
      req.end();
    });
  }

  async verificarOllamaDisponivel() {
    try {
      await this.makeRequest('/api/tags', {}, 'GET');
      return true;
    } catch (error) {
      console.error('Erro ao verificar Ollama:', error.message);
      return false;
    }
  }

  async listaModelosDisponiveis() {
    try {
      const response = await this.makeRequest('/api/tags', {}, 'GET');
      return response.models.map(model => model.name);
    } catch (error) {
      console.error('Erro ao listar modelos:', error);
      return [];
    }
  }
}

module.exports = new OllamaService();