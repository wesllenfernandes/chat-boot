const OpenAI = require('openai');

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.AI_API_KEY || '',
      baseURL: 'https://open.bigmodel.cn/api/paas/v4'
    });
  }

  async gerarResposta(mensagem, contexto = {}) {
    try {
      const systemPrompt = `Você é um assistente de atendimento da Pizzaria Otaliva 🍕. 
Sua função é:
- Responder perguntas sobre a pizzaria
- Ajudar com informações sobre produtos
- Ser cordial e profissional
- Usar emojis quando apropriado

Cardápio disponível:
1. Pizza Margherita - R$ 35,00
2. Pizza Calabresa - R$ 38,00
3. Pizza Quatro Queijos - R$ 42,00
4. Pizza Portuguesa - R$ 40,00
5. Pizza Frango com Catupiry - R$ 45,00
6. Pizza Pepperoni - R$ 48,00
7. Pizza Vegetariana - R$ 38,00
8. Pizza Camarão - R$ 55,00
9. Pizza Chocolate - R$ 40,00
10. Pizza Romeu e Julieta - R$ 38,00

Para fazer pedidos, o usuário deve digitar o número do produto ou "menu" para ver o cardápio.
Para finalizar pedido, digite "finalizar".
Para cancelar, digite "cancelar".`;

      const completion = await this.client.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mensagem }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
    }
  }
}

module.exports = new AIService();
