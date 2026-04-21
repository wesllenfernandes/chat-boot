const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const css = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.7;
    color: #000;
    background: #fff;
  }

  .cover {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 60px;
    page-break-after: always;
  }
  .cover .instituicao {
    font-size: 13pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .cover .curso {
    font-size: 12pt;
    font-weight: bold;
    margin-bottom: 60px;
  }
  .cover .titulo-doc {
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .cover .subtitulo {
    font-size: 13pt;
    margin-bottom: 80px;
  }
  .cover .autores {
    text-align: left;
    width: 100%;
    max-width: 520px;
    font-size: 12pt;
    margin-bottom: 60px;
    line-height: 2;
  }
  .cover .trello-link {
    text-align: left;
    width: 100%;
    max-width: 520px;
    font-size: 10pt;
    margin-bottom: 40px;
    word-break: break-all;
    line-height: 1.6;
  }
  .cover .cidade-ano {
    font-size: 12pt;
    font-weight: bold;
    margin-top: auto;
  }

  .page {
    padding: 60px 70px;
  }

  .doc-title {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 6px;
    border-bottom: 1px solid #000;
  }

  h2 {
    font-size: 12pt;
    font-weight: bold;
    margin: 26px 0 8px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    margin: 18px 0 6px;
    page-break-after: avoid;
  }
  h4 {
    font-size: 12pt;
    font-weight: bold;
    margin: 14px 0 4px;
    page-break-after: avoid;
  }

  p {
    margin-bottom: 10px;
    text-align: justify;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 18px;
    font-size: 11pt;
    page-break-inside: avoid;
  }
  thead tr { background: #000; color: #fff; }
  thead th {
    padding: 6px 10px;
    text-align: left;
    font-weight: bold;
    font-size: 11pt;
    border: 1px solid #000;
  }
  tbody td {
    padding: 5px 10px;
    border: 1px solid #000;
    vertical-align: top;
    line-height: 1.5;
  }
  tbody tr:nth-child(even) { background: #f5f5f5; }

  ul, ol {
    margin: 6px 0 12px 30px;
    line-height: 1.9;
  }
  li { margin-bottom: 3px; }

  pre, .flow-box, .dialog-block {
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-left: 3px solid #000;
    border-radius: 2px;
    padding: 12px 16px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.8;
    margin: 10px 0 16px;
    page-break-inside: avoid;
    white-space: pre-wrap;
  }

  .info-box {
    border: 1px solid #000;
    padding: 10px 14px;
    margin: 12px 0 16px;
    font-size: 11pt;
    page-break-inside: avoid;
  }

  .macro-step {
    border: 1px solid #000;
    padding: 10px 14px;
    margin: 8px 0;
    page-break-inside: avoid;
    font-size: 11pt;
  }
  .macro-step .ms-title { font-weight: bold; margin-bottom: 4px; }
  .macro-step .ms-trigger { font-style: italic; }
  .macro-step .ms-out { font-weight: bold; }

  .footer {
    margin-top: 40px;
    padding-top: 10px;
    border-top: 1px solid #000;
    text-align: center;
    font-size: 10pt;
  }

  strong { font-weight: bold; }
  em { font-style: italic; }
  code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10pt;
    background: #f0f0f0;
    padding: 1px 4px;
    border: 1px solid #ccc;
  }

  .page-break { page-break-before: always; }
`;

// ─── CAPA COMPARTILHADA (função) ─────────────────────────────────────────────
function capa(numDoc, titulo, subtitulo) {
  return `
  <div class="cover">
    <div class="instituicao">Unidade Curricular de Extensão</div>
    <div class="curso">Criação de Chatbot</div>

    <div class="titulo-doc">Documento ${numDoc} de 3</div>
    <div class="subtitulo">${titulo}<br>${subtitulo}</div>

    <div class="autores">
      Aluno: Willian Fernandes Paiva<br>
      Aluno: Francisco Jucinery Alves Vieira<br>
      Aluno: Wesllen Fernandes Paiva (LÍDER)<br>
      POLO: LUIS GOMES
    </div>

    <div class="trello-link">
      <strong>Ferramenta de gestão (Trello):</strong><br>
      https://trello.com/invite/b/69d26191a6b4d32caad42389/ATTI66e5abbfdba663c329a047c1f2ff6743668A9BE4/chatbot-pizzaria
    </div>

    <div class="cidade-ano">Major Sales — RN, Abril de 2026</div>
  </div>`;
}

// ─── DOCUMENTO 1 ─────────────────────────────────────────────────────────────
const doc1HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>${css}</style></head>
<body>

${capa('1', 'Design Conversacional Completo', 'Chatbot OtalivaBot — Pizzaria Otaliva')}

<div class="page">
  <div class="doc-title">Design Conversacional Completo</div>

  <h2>1. Identificação do Chatbot</h2>

  <p>O chatbot desenvolvido para a Pizzaria Otaliva recebeu o nome de <strong>OtalivaBot</strong> e funciona exclusivamente pelo WhatsApp. A escolha por esse canal não foi por acaso: praticamente todos os clientes da pizzaria já utilizam o aplicativo no dia a dia, o que elimina qualquer barreira de acesso. Para o avatar do bot, optou-se pela foto do banner da própria empresa, transmitindo identidade visual já conhecida pelos clientes.</p>

  <p>Do ponto de vista técnico, o sistema roda de forma completamente local, sem depender de serviços externos pagos. A inteligência artificial utilizada é o modelo LLaMA 3.2, executado pelo Ollama diretamente no servidor da pizzaria. Os pedidos são armazenados num banco de dados SQLite, leve e fácil de manter, e toda a lógica de servidor é feita em Node.js com Express.</p>

  <table>
    <thead><tr><th>Atributo</th><th>Valor</th></tr></thead>
    <tbody>
      <tr><td>Nome do chatbot</td><td>OtalivaBot</td></tr>
      <tr><td>Canal de atendimento</td><td>WhatsApp (via whatsapp-web.js)</td></tr>
      <tr><td>Inteligência artificial</td><td>Ollama com LLaMA 3.2 — 100% local</td></tr>
      <tr><td>Banco de dados</td><td>SQLite com Sequelize ORM</td></tr>
      <tr><td>Servidor</td><td>Node.js + Express</td></tr>
      <tr><td>Localização da pizzaria</td><td>Major Sales — RN</td></tr>
    </tbody>
  </table>

  <h2>2. Por que este chatbot foi criado</h2>

  <p>A Pizzaria Otaliva chegou a receber até 130 pedidos por dia, todos atendidos manualmente pelo WhatsApp. Qualquer pessoa que já trabalhou com atendimento sabe que esse volume é alto demais para uma equipe pequena lidar sem cometer erros. Os problemas que apareceram com o tempo foram: demora nas respostas, pedidos anotados errado, clientes esperando muito antes de serem atendidos e um padrão de atendimento que variava de acordo com quem estava respondendo.</p>

  <p>O objetivo do OtalivaBot é simples: assumir esse processo de ponta a ponta. Desde o momento em que o cliente manda uma mensagem até a confirmação do pedido no banco de dados, tudo acontece de forma automática. A equipe da pizzaria fica livre para se concentrar na produção e na entrega, sem precisar ficar com o celular na mão o tempo todo.</p>

  <p>Além de automatizar o atendimento, o sistema também resolve a questão da privacidade: como tudo roda localmente, os dados dos clientes nunca saem do servidor da própria pizzaria.</p>

  <h2>3. Persona do Chatbot</h2>

  <h3>3.1 Quem é o OtalivaBot</h3>

  <p>O OtalivaBot foi pensado para se comportar como um atendente de balcão simpático e direto ao ponto. Não é aquele bot que responde de forma robótica, nem aquele que tenta parecer humano demais a ponto de confundir o cliente. O tom é amigável, mas sem rodeios — afinal, quem está pedindo uma pizza na sexta à noite quer confirmar o pedido rápido, não ficar trocando gentilezas.</p>

  <p>A linguagem é simples e acessível. Emojis aparecem de vez em quando para deixar a conversa mais leve, mas com moderação. Mensagens longas foram evitadas propositalmente: o cardápio, por exemplo, só é exibido quando o cliente pede — não na primeira mensagem que ele manda.</p>

  <h3>3.2 Tom e estilo de comunicação</h3>

  <p>O chatbot usa frases curtas e confirma cada ação antes de avançar. Quando o cliente adiciona um item ao carrinho, o bot mostra exatamente o que foi adicionado. Quando algo dá errado — como um endereço muito curto ou uma opção de pagamento inválida —, a mensagem de erro é gentil e já indica como resolver, sem culpar o usuário.</p>

  <p>Alguns exemplos do estilo adotado:</p>
  <ul>
    <li>"Olá! Seja bem-vindo à Pizzaria Otaliva 🍕"</li>
    <li>"Perfeito! Você escolheu: Pizza Calabresa por R$ 30,00. Quantas unidades?"</li>
    <li>"Ótimo! Pedido confirmado. Já estamos preparando tudo por aqui 🍕"</li>
  </ul>

  <h2>4. Para quem o chatbot foi desenvolvido</h2>

  <p>O público principal são moradores de Major Sales e região que já têm o hábito de pedir comida pelo WhatsApp. A faixa etária é bem variada — desde jovens até pessoas mais velhas — e o nível de familiaridade com tecnologia também. Por isso, a interface foi pensada para não exigir nenhum conhecimento prévio: basta mandar uma mensagem e o bot conduz o resto.</p>

  <p>Para representar bem esse público, foi criada a seguinte persona:</p>

  <div class="info-box">
    <strong>Persona: Roger</strong> — 30 anos, trabalhador, pouco familiarizado com tecnologia. Usa o WhatsApp todos os dias, mas não gosta de aplicativos complicados. Quando quer pedir comida, quer fazer isso rápido, sem precisar criar conta em nenhum lugar ou aprender a usar uma plataforma nova. Não tem paciência para esperar atendimento humano e prefere resolver tudo de forma autônoma.
  </div>

  <h2>5. Canal de atendimento</h2>

  <p>O OtalivaBot funciona exclusivamente pelo WhatsApp, que é o canal onde os clientes da Pizzaria Otaliva já estão. Mensagens de texto são o meio principal de interação. Mensagens de áudio não são processadas pelo sistema — quando um cliente tenta enviar um áudio, o bot pede gentilmente que ele escreva a mensagem.</p>

  <table>
    <thead><tr><th>Tipo de mídia</th><th>Suporte</th></tr></thead>
    <tbody>
      <tr><td>Mensagens de texto</td><td>Sim — canal principal de interação</td></tr>
      <tr><td>Mensagens de áudio</td><td>Não suportado — bot solicita texto</td></tr>
      <tr><td>Imagens</td><td>Não suportado — fora do escopo do projeto</td></tr>
    </tbody>
  </table>

  <h2>6. Classificação do chatbot</h2>

  <p>O OtalivaBot é um <strong>chatbot híbrido</strong>. Isso significa que ele combina dois modelos: o de regras fixas, onde cada etapa do pedido segue um fluxo bem definido, e o de inteligência artificial, que entra em cena quando o cliente escreve de forma livre — por exemplo, "quero duas pizzas de calabresa e um refrigerante".</p>

  <p>Essa combinação foi uma escolha deliberada. O fluxo estruturado garante previsibilidade e controle nas etapas críticas, como pagamento e confirmação de pedido. Já a IA cuida das situações mais abertas, onde o cliente pode escrever o que quiser e o sistema ainda assim precisa entender a intenção dele.</p>

  <h2>7. Como o cliente percorre o atendimento</h2>

  <p>A jornada do cliente tem oito momentos principais. O fluxo é linear, mas o cliente pode voltar ao início a qualquer momento digitando "menu" ou "cancelar".</p>

  <ol>
    <li><strong>Saudação inicial:</strong> qualquer mensagem serve para iniciar o atendimento. O bot responde com boas-vindas e apresenta as opções disponíveis.</li>
    <li><strong>Menu principal:</strong> o cliente decide se quer ver o cardápio, fazer um pedido ou tirar uma dúvida.</li>
    <li><strong>Seleção do produto:</strong> pode ser feita pelo número do item no cardápio ou em linguagem natural.</li>
    <li><strong>Definição da quantidade:</strong> o bot pergunta quantas unidades o cliente quer de cada produto.</li>
    <li><strong>Revisão do carrinho:</strong> após cada adição, o bot mostra o que já foi pedido e pergunta se o cliente quer adicionar mais alguma coisa.</li>
    <li><strong>Forma de pagamento:</strong> o cliente escolhe entre dinheiro, Pix ou cartão.</li>
    <li><strong>Endereço de entrega:</strong> o cliente informa o endereço completo para entrega.</li>
    <li><strong>Confirmação final:</strong> o bot exibe um resumo completo do pedido antes de registrar. O cliente confirma com "sim" ou cancela com "não".</li>
  </ol>

  <h2>8. Intenções do usuário mapeadas</h2>

  <p>Durante o levantamento de requisitos, foram identificadas as principais formas como os clientes interagem com o sistema. Cada intenção representa um tipo de mensagem que o bot precisa saber reconhecer e responder adequadamente.</p>

  <table>
    <thead><tr><th>Intenção</th><th>O que o cliente quer</th><th>Exemplos reais de fala</th></tr></thead>
    <tbody>
      <tr><td>Iniciar conversa</td><td>Começar o atendimento</td><td>"oi", "olá", "boa noite", "eai"</td></tr>
      <tr><td>Ver cardápio</td><td>Conhecer os produtos e preços</td><td>"cardápio", "o que tem?", "quais as opções?"</td></tr>
      <tr><td>Fazer pedido por número</td><td>Pedir pelo número do item</td><td>"1", "quero o 3", "pode ser o 5"</td></tr>
      <tr><td>Fazer pedido por texto</td><td>Descrever o que quer em linguagem natural</td><td>"quero duas pizzas de calabresa", "me dá uma margherita"</td></tr>
      <tr><td>Adicionar item</td><td>Incluir mais produtos ao carrinho</td><td>"quero também um refrigerante", "e uma batata frita"</td></tr>
      <tr><td>Finalizar pedido</td><td>Encerrar a seleção de produtos</td><td>"finalizar", "só isso", "pode fechar", "é isso"</td></tr>
      <tr><td>Informar pagamento</td><td>Escolher a forma de pagamento</td><td>"1", "2", "3", "quero pagar no pix"</td></tr>
      <tr><td>Informar endereço</td><td>Dizer onde entregar</td><td>"Rua das Flores, 123, Centro"</td></tr>
      <tr><td>Confirmar pedido</td><td>Dar o ok final</td><td>"sim", "confirmar", "ok", "s"</td></tr>
      <tr><td>Cancelar</td><td>Desistir do pedido atual</td><td>"não", "cancelar", "reiniciar", "deixa pra lá"</td></tr>
      <tr><td>Tirar dúvida</td><td>Perguntar sobre a pizzaria</td><td>"qual o horário?", "vocês entregam aqui?"</td></tr>
    </tbody>
  </table>

  <h2>9. Exemplos de conversa</h2>

  <h3>9.1 Pedido em linguagem natural</h3>
  <div class="dialog-block">Cliente: boa noite
Bot:     Olá! Seja bem-vindo à Pizzaria Otaliva 🍕
         Em que posso te ajudar hoje?
         • Fazer um pedido
         • Ver o cardápio
         • Tirar dúvidas

Cliente: quero uma pizza de calabresa e um refrigerante
Bot:     Excelente escolha! ✅
         1x Pizza Calabresa
         1x Refrigerante
         Gostaria de adicionar mais alguma coisa ou prefere finalizar?</div>

  <h3>9.2 Pedido pelo número do cardápio</h3>
  <div class="dialog-block">Cliente: cardápio
Bot:     🍕 CARDÁPIO DA PIZZARIA
         1 - Pizza Calabresa — R$ 30,00
         2 - Pizza Frango — R$ 28,00
         3 - Pizza Margherita — R$ 26,00
         ... (outros itens)

Cliente: 1
Bot:     Você escolheu Pizza Calabresa por R$ 30,00.
         Quantas unidades você quer?

Cliente: 2
Bot:     ✅ Adicionamos 2x Pizza Calabresa ao seu pedido.
         Quer adicionar mais alguma coisa ou prefere finalizar?</div>

  <h3>9.3 Dúvida sobre a pizzaria</h3>
  <div class="dialog-block">Cliente: vocês funcionam no domingo?
Bot:     Funcionamos de terça a domingo, das 18h às 23h! 🕐

Cliente: aceitam cartão?
Bot:     Sim! Trabalhamos com cartão de crédito e débito, Pix e dinheiro. 💳</div>

  <h2>10. Tratamento quando algo dá errado</h2>

  <p>Em qualquer sistema de atendimento, o cliente vai eventualmente responder algo fora do esperado. O OtalivaBot foi preparado para esses momentos — os chamados fallbacks — sem travar ou deixar o usuário sem resposta.</p>

  <h3>10.1 Mensagem não reconhecida</h3>
  <p>Quando o bot não entende o que o cliente escreveu, ele repassa a mensagem para o modelo de IA (Ollama). Se nem assim for possível dar uma resposta adequada, a mensagem padrão é:</p>
  <div class="dialog-block">Bot: Desculpe, não entendi muito bem. 😕
     Você pode:
     • Digitar o número do produto desejado
     • Descrever o que quer pedir
     • Escrever "cardápio" para ver as opções disponíveis</div>

  <h3>10.2 Quantidade fora do padrão</h3>
  <div class="dialog-block">Bot: Por favor, informe uma quantidade válida — precisa ser um número maior que zero. 😊</div>

  <h3>10.3 Opção de pagamento inválida</h3>
  <div class="dialog-block">Bot: Essa opção não está disponível. Por favor, escolha:
     1 - Dinheiro   2 - Pix   3 - Cartão</div>

  <h3>10.4 Endereço muito curto</h3>
  <div class="dialog-block">Bot: O endereço ficou muito curto. Informe a rua, o número e o bairro para conseguirmos te localizar. 😊</div>

  <h3>10.5 Resposta fora do esperado na confirmação</h3>
  <div class="dialog-block">Bot: Não consegui entender sua resposta.
     Digite "sim" se quiser confirmar o pedido, ou "não" para cancelar.</div>

  <h3>10.6 Cliente demora para responder</h3>
  <p>Se o cliente ficar mais de dois minutos sem responder, o bot manda um aviso antes de encerrar a sessão. Isso evita que o sistema fique preso esperando indefinidamente:</p>
  <div class="dialog-block">Bot: ⏰ Percebemos que você parou de responder.
     Ainda temos mais 3 minutos antes de encerrar o atendimento automaticamente.
     Basta mandar qualquer mensagem para continuar.
     Se quiser recomeçar do zero, é só digitar "menu".</div>

  <h2>11. Quando o cliente escreve de formas diferentes</h2>

  <p>Um dos desafios do design conversacional é que as pessoas nunca falam exatamente do mesmo jeito. Para lidar com isso, o OtalivaBot usa algumas estratégias de desambiguação — maneiras de descobrir o que o cliente realmente quer, mesmo quando a mensagem é ambígua.</p>

  <p>Por exemplo: se o cliente tem itens no carrinho e manda uma nova mensagem, o sistema não sabe de imediato se ele quer adicionar mais coisas ou finalizar o pedido. Nesse caso, a IA analisa o contexto da mensagem e classifica a intenção antes de qualquer ação. Se a mensagem for "só isso" ou "tá bom", o sistema interpreta como intenção de finalizar. Se for "também quero uma batata", interpreta como adição.</p>

  <p>Outra situação comum: o número que o cliente digitou poderia ser tanto um item do cardápio quanto uma quantidade. Nesses casos, a etapa atual do atendimento — que fica salva no banco de dados — é quem define o que fazer com esse número.</p>

  <h2>12. Boas práticas aplicadas no projeto</h2>

  <p>Algumas escolhas de UX Writing foram tomadas conscientemente ao longo do projeto. A principal delas foi não exibir o cardápio inteiro logo na primeira mensagem. Muitos chatbots de pizzaria fazem isso, mas a experiência mostra que o cliente se sente sobrecarregado com tanta informação de uma vez. No OtalivaBot, o cardápio aparece só quando pedido.</p>

  <p>Outra decisão importante foi sempre confirmar o que foi feito antes de avançar. Quando um item é adicionado ao carrinho, o bot mostra o que foi adicionado e o que já estava lá. Isso dá ao cliente a sensação de controle sobre o pedido.</p>

  <p>Os comandos de emergência — "menu", "cancelar" e "reiniciar" — funcionam em qualquer momento, independente de qual etapa o cliente estiver. Isso é fundamental para que o usuário nunca se sinta preso num fluxo sem saída.</p>

  <div class="footer">
    OtalivaBot · Documento 1 — Design Conversacional Completo · Polo Luis Gomes · Abril de 2026
  </div>
</div>
</body>
</html>`;

// ─── DOCUMENTO 2 ─────────────────────────────────────────────────────────────
const doc2HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>${css}</style></head>
<body>

${capa('2', 'High-Level Design Conversacional', 'Chatbot OtalivaBot — Pizzaria Otaliva')}

<div class="page">
  <div class="doc-title">High-Level Design Conversacional</div>

  <h2>1. Como o sistema foi estruturado</h2>

  <p>A arquitetura do OtalivaBot é baseada em uma <strong>máquina de estados finitos</strong> — um modelo bastante comum em chatbots de atendimento porque garante previsibilidade. A ideia é simples: a conversa de cada cliente é dividida em etapas, e em cada etapa o sistema sabe exatamente o que esperar e como reagir.</p>

  <p>Cada cliente tem um registro no banco de dados com a sua etapa atual. Quando uma nova mensagem chega, o sistema verifica em qual etapa aquele cliente está e processa a mensagem de acordo. Isso resolve um problema clássico de chatbots: dois clientes mandando mensagens ao mesmo tempo nunca se misturam, porque cada um tem seu próprio estado salvo.</p>

  <div class="info-box">
    O sistema combina regras fixas com inteligência artificial local (Ollama/LLaMA 3.2). As regras cuidam das etapas críticas — pagamento, confirmação, endereço. A IA entra quando o cliente escreve livremente ou faz perguntas abertas sobre a pizzaria.
  </div>

  <p>Em termos de fluxo geral, o caminho do cliente passa pelos seguintes estados:</p>
  <div class="flow-box">MENU → QUANTIDADE → MENU (pode repetir) → PAGAMENTO → ENDEREÇO → CONFIRMAÇÃO → [Pedido registrado]</div>

  <h2>2. Os grandes blocos do sistema</h2>

  <p>O sistema é composto por onze blocos de interação principais. Cada um tem uma responsabilidade bem definida dentro do fluxo de atendimento:</p>

  <table>
    <thead><tr><th>Bloco</th><th>Estado correspondente</th><th>O que faz</th></tr></thead>
    <tbody>
      <tr><td>Hub central / Boas-vindas</td><td>MENU</td><td>Recebe toda mensagem e decide para onde encaminhar</td></tr>
      <tr><td>Seleção por número</td><td>MENU → QUANTIDADE</td><td>Identifica o produto pelo número digitado (1 a 10)</td></tr>
      <tr><td>Interpretação por IA</td><td>MENU</td><td>Entende pedidos escritos em linguagem natural</td></tr>
      <tr><td>Confirmação de quantidade</td><td>QUANTIDADE → MENU</td><td>Valida o número e adiciona o item ao carrinho</td></tr>
      <tr><td>Finalização do carrinho</td><td>MENU → PAGAMENTO</td><td>Lista os itens e aciona a etapa de pagamento</td></tr>
      <tr><td>Escolha de pagamento</td><td>PAGAMENTO → ENDEREÇO</td><td>Valida a opção (1, 2 ou 3) e avança</td></tr>
      <tr><td>Captura do endereço</td><td>ENDEREÇO → CONFIRMAÇÃO</td><td>Salva o endereço e gera o resumo do pedido</td></tr>
      <tr><td>Resumo e confirmação</td><td>CONFIRMAÇÃO → MENU</td><td>Mostra tudo e aguarda o "sim" ou "não" do cliente</td></tr>
      <tr><td>Registro do pedido</td><td>Interno</td><td>Grava o pedido e os itens no banco SQLite</td></tr>
      <tr><td>Atendente por IA</td><td>MENU</td><td>Responde perguntas abertas sobre a pizzaria</td></tr>
      <tr><td>Controle de inatividade</td><td>Paralelo</td><td>Manda aviso em 2 min e encerra em 5 min sem resposta</td></tr>
    </tbody>
  </table>

  <h2>3. As quatro grandes etapas da conversa</h2>

  <p>Do ponto de vista do cliente, o atendimento pode ser dividido em quatro momentos principais. Cada um tem um gatilho claro e uma saída esperada:</p>

  <div class="macro-step">
    <div class="ms-title">ETAPA 1 — RECEPÇÃO</div>
    <div class="ms-trigger">Como começa: o cliente manda qualquer saudação ("oi", "olá", "boa noite", "eai"...)</div>
    <div class="ms-out">O que o cliente recebe: mensagem de boas-vindas com as opções disponíveis (fazer pedido, ver cardápio, tirar dúvidas)</div>
  </div>

  <div class="macro-step">
    <div class="ms-title">ETAPA 2 — MONTAGEM DO PEDIDO</div>
    <div class="ms-trigger">Como começa: cliente indica o que quer pedir, por número ou texto livre</div>
    <div class="ms-out">O que acontece: loop de adição de itens ao carrinho até o cliente decidir finalizar</div>
  </div>

  <div class="macro-step">
    <div class="ms-title">ETAPA 3 — CHECKOUT</div>
    <div class="ms-trigger">Como começa: cliente digita "finalizar" ou indica que não quer mais nada</div>
    <div class="ms-out">O que o sistema coleta: forma de pagamento e endereço de entrega</div>
  </div>

  <div class="macro-step">
    <div class="ms-title">ETAPA 4 — CONFIRMAÇÃO E REGISTRO</div>
    <div class="ms-trigger">Como começa: cliente responde "sim" para o resumo do pedido</div>
    <div class="ms-out">O que acontece: pedido gravado no banco de dados; cliente recebe o número do pedido e o tempo estimado de entrega (40 a 50 minutos)</div>
  </div>

  <h2>4. Fluxo de decisão simplificado</h2>

  <p>O diagrama abaixo mostra, de forma resumida, como o sistema toma decisões a cada mensagem recebida:</p>

  <div class="flow-box">[Nova mensagem chega]
        |
        ├── É "menu", "cancelar" ou "reiniciar"?
        │       └── Sim → Limpa a sessão → Mostra cardápio → Estado: MENU
        |
        ├── Estado atual = MENU (cliente já tem itens no carrinho)
        │       ├── IA detecta intenção de finalizar  → vai para PAGAMENTO
        │       ├── IA detecta novo pedido            → adiciona itens → volta ao MENU
        │       └── IA detecta intenção de adicionar  → mostra cardápio
        |
        ├── Estado atual = MENU (carrinho vazio)
        │       ├── Número entre 1 e 10  → confirma produto → vai para QUANTIDADE
        │       ├── Texto com pedido     → IA interpreta → adiciona → MENU
        │       └── Qualquer outra coisa → IA responde como atendente → MENU
        |
        ├── Estado atual = QUANTIDADE
        │       ├── Número válido (≥ 1)  → adiciona item → volta ao MENU
        │       └── Inválido             → pede de novo → permanece em QUANTIDADE
        |
        ├── Estado atual = PAGAMENTO
        │       ├── Opção 1, 2 ou 3      → salva e vai para ENDEREÇO
        │       └── Qualquer outra coisa → pede de novo → permanece em PAGAMENTO
        |
        ├── Estado atual = ENDEREÇO
        │       ├── Texto com 5+ chars   → salva e vai para CONFIRMAÇÃO
        │       └── Texto muito curto    → pede de novo → permanece em ENDEREÇO
        |
        └── Estado atual = CONFIRMAÇÃO
                ├── "sim" / "s" / "ok"   → registra pedido → MENU
                ├── "não" / "n"          → cancela → MENU
                └── Outra resposta       → pede esclarecimento → permanece em CONFIRMAÇÃO</div>

  <h2>5. O que entra e o que sai do sistema</h2>

  <table>
    <thead><tr><th>O que o cliente manda</th><th>Formato</th><th>O que o sistema responde</th></tr></thead>
    <tbody>
      <tr><td>Saudação qualquer</td><td>Texto livre</td><td>Mensagem de boas-vindas com opções</td></tr>
      <tr><td>Número do cardápio (1 a 10)</td><td>Inteiro</td><td>Confirmação do produto escolhido + pergunta de quantidade</td></tr>
      <tr><td>Quantidade de itens</td><td>Inteiro positivo</td><td>Item adicionado ao carrinho com resumo atualizado</td></tr>
      <tr><td>Pedido em texto livre</td><td>Texto → IA → JSON</td><td>Itens identificados e adicionados automaticamente</td></tr>
      <tr><td>"finalizar" ou equivalente</td><td>Comando</td><td>Lista dos itens + opções de pagamento</td></tr>
      <tr><td>Opção de pagamento (1, 2 ou 3)</td><td>Inteiro</td><td>Confirmação da forma + solicitação de endereço</td></tr>
      <tr><td>Endereço de entrega</td><td>Texto (mín. 5 chars)</td><td>Resumo completo do pedido</td></tr>
      <tr><td>"sim" ou equivalente</td><td>Confirmação</td><td>Pedido registrado + número + tempo estimado</td></tr>
      <tr><td>"não" ou equivalente</td><td>Cancelamento</td><td>Sessão encerrada + mensagem amigável</td></tr>
      <tr><td>Pergunta aberta</td><td>Texto → IA</td><td>Resposta gerada pelo modelo de linguagem</td></tr>
    </tbody>
  </table>

  <h2>6. Condições e decisões do sistema</h2>

  <p>Abaixo estão as principais regras de decisão do sistema — as condições que determinam o comportamento do bot em cada situação:</p>

  <table>
    <thead><tr><th>Situação</th><th>O que o sistema faz</th></tr></thead>
    <tbody>
      <tr><td>Estado MENU com carrinho não vazio</td><td>Consulta a IA para interpretar a intenção antes de qualquer outra ação</td></tr>
      <tr><td>Número digitado entre 1 e 10</td><td>Trata como seleção de produto do cardápio</td></tr>
      <tr><td>Mensagem com "quero", "gostaria", "me dá"...</td><td>Passa para o interpretador de pedidos da IA</td></tr>
      <tr><td>IA retorna intenção "finalizar"</td><td>Avança para a etapa de pagamento</td></tr>
      <tr><td>Cliente digita "menu", "cancelar" ou "reiniciar"</td><td>Reseta a sessão independente do estado atual</td></tr>
      <tr><td>Endereço com menos de 5 caracteres</td><td>Rejeita e pede o endereço completo novamente</td></tr>
      <tr><td>Mais de 2 minutos sem resposta</td><td>Envia aviso de inatividade</td></tr>
      <tr><td>Mais de 5 minutos sem resposta</td><td>Encerra a sessão automaticamente</td></tr>
      <tr><td>Erro no modelo de IA</td><td>Exibe mensagem de fallback padrão</td></tr>
    </tbody>
  </table>

  <h2>7. Ferramentas e integrações</h2>

  <p>O sistema foi construído com ferramentas de código aberto, sem custos de licença ou uso de APIs pagas. Cada componente tem uma função bem definida:</p>

  <table>
    <thead><tr><th>Ferramenta</th><th>Função no projeto</th></tr></thead>
    <tbody>
      <tr><td>SQLite com Sequelize</td><td>Armazenar clientes, pedidos e itens — banco local, sem servidor separado</td></tr>
      <tr><td>Ollama com LLaMA 3.2</td><td>Interpretar linguagem natural e responder perguntas abertas</td></tr>
      <tr><td>whatsapp-web.js</td><td>Integração com o WhatsApp via automação de navegador</td></tr>
      <tr><td>Express.js</td><td>API REST para consultas de status e histórico de pedidos</td></tr>
      <tr><td>TimeoutService</td><td>Processo paralelo que monitora inatividade dos clientes</td></tr>
    </tbody>
  </table>

  <div class="footer">
    OtalivaBot · Documento 2 — High-Level Design Conversacional · Polo Luis Gomes · Abril de 2026
  </div>
</div>
</body>
</html>`;

// ─── DOCUMENTO 3 ─────────────────────────────────────────────────────────────
const doc3HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>${css}</style></head>
<body>

${capa('3', 'Low-Level Design Conversacional', 'Chatbot OtalivaBot — Pizzaria Otaliva')}

<div class="page">
  <div class="doc-title">Low-Level Design Conversacional</div>

  <h2>1. O estado MENU — o coração do sistema</h2>

  <p>O estado MENU é, na prática, o ponto central de toda a conversa. Toda vez que o cliente termina uma ação — adiciona um item, volta do cardápio, recomeça o atendimento —, ele volta para cá. É também nesse estado que o sistema precisa tomar as decisões mais complexas, porque a mesma mensagem pode significar coisas diferentes dependendo do contexto.</p>

  <p>O processamento funciona assim: quando uma mensagem chega, o primeiro passo é verificar se é um comando global ("menu", "cancelar", "reiniciar"). Se for, a sessão é limpa e o cardápio é exibido, independente do estado atual. Se não for, o sistema verifica o estado do cliente e roteia a mensagem para a função adequada.</p>

  <div class="flow-box">ENTRADA DE MENSAGEM
  1. Atualizar horário da última interação (para o sistema de timeout)
  2. Normalizar o texto: converter para minúsculas e remover espaços extras
  3. Buscar o registro do cliente no banco (ou criar se for a primeira vez)
  4. Verificar se é comando global → se sim, resetar e mostrar cardápio
  5. Caso contrário → rotear pela etapa atual do cliente

DENTRO DO ESTADO MENU (sem itens no carrinho):
  - Número entre 1 e 10         → confirmar produto → ir para QUANTIDADE
  - Mensagem com indicador de pedido ("quero", "gostaria"...)
                                → IA interpreta → adiciona itens → permanece em MENU
  - "finalizar" ou equivalente  → vai para PAGAMENTO (se carrinho vazio: avisa)
  - Qualquer outra mensagem     → IA responde como atendente → permanece em MENU
  - IA com erro                 → exibe mensagem de fallback

DENTRO DO ESTADO MENU (com itens no carrinho):
  - IA classifica intenção:
      "finalizar"  → vai para PAGAMENTO
      novo pedido  → adiciona itens → permanece em MENU
      "adicionar"  → mostra cardápio → permanece em MENU</div>

  <h2>2. Etapa de quantidade</h2>

  <p>Essa etapa é ativada quando o cliente seleciona um produto pelo número do cardápio. O sistema guarda qual produto foi escolhido e espera o cliente informar quantas unidades quer. A validação aqui é direta: precisa ser um número inteiro maior que zero. Qualquer outra coisa gera um aviso e o sistema permanece aguardando a quantidade correta.</p>

  <div class="flow-box">PROCESSAMENTO DA QUANTIDADE
  1. Tentar converter a mensagem para número inteiro
  2. Se não for número ou for menor que 1:
       → "Por favor, informe uma quantidade válida — precisa ser maior que zero."
       → permanece em QUANTIDADE
  3. Recuperar o produto que estava salvo temporariamente
  4. Montar o item: { produto, quantidade, preço }
  5. Adicionar o item ao carrinho do cliente no banco
  6. Buscar o carrinho atualizado para montar a resposta
  7. Mudar estado para MENU
  8. Retornar confirmação com o carrinho atual</div>

  <h3>Como fica a mensagem dependendo do contexto</h3>

  <h4>Quando é o primeiro item do pedido:</h4>
  <div class="dialog-block">Bot: ✅ Adicionamos 2x Pizza Calabresa ao seu pedido.
     Quer adicionar mais alguma coisa ou prefere finalizar?</div>

  <h4>Quando já existem outros itens no carrinho:</h4>
  <div class="dialog-block">Bot: ✅ Adicionamos 1x Refrigerante ao seu pedido.

     Seu pedido até agora:
     • 2x Pizza Calabresa
     • 1x Refrigerante

     Quer adicionar mais alguma coisa ou prefere finalizar?</div>

  <h4>Quando o cliente manda algo inválido:</h4>
  <div class="dialog-block">Cliente: bastante
Bot:     Por favor, informe uma quantidade válida — precisa ser um número maior que zero. 😊
         [sistema permanece aguardando a quantidade]</div>

  <h2>3. Finalização do carrinho</h2>

  <p>Quando o cliente indica que terminou de escolher — seja digitando "finalizar", "só isso", "é isso" ou qualquer variação que a IA reconheça —, o sistema verifica se há ao menos um item no carrinho. Se estiver vazio, o bot avisa e permanece no estado MENU. Se tiver itens, avança para o pagamento.</p>

  <div class="flow-box">FINALIZAR PEDIDO
  1. Verificar se o carrinho tem pelo menos um item
     → Se vazio: "Você ainda não escolheu nenhum item. Quer ver o cardápio?"
     → Permanece em MENU
  2. Mudar estado para PAGAMENTO
  3. Listar os itens do carrinho
  4. Apresentar as opções de pagamento</div>

  <div class="dialog-block">Bot: Certo! Vamos fechar o pedido. 💳

     O que você pediu:
     • 1x Pizza Quatro Queijos
     • 1x Refrigerante

     Como você vai pagar?
     1 - Dinheiro
     2 - Pix
     3 - Cartão

     Digite só o número da opção:</div>

  <h2>4. Etapa de pagamento</h2>

  <p>Nessa etapa, apenas as opções 1, 2 e 3 são aceitas. O sistema tenta converter a mensagem para número e verifica se está dentro do intervalo esperado. Se não estiver, repete a pergunta. Quando válida, a forma de pagamento é salva e o sistema avança para a captura do endereço.</p>

  <div class="flow-box">PROCESSAMENTO DO PAGAMENTO
  1. Converter mensagem para inteiro
  2. Mapear: 1 = Dinheiro / 2 = Pix / 3 = Cartão
  3. Se o número não estiver entre 1 e 3:
       → "Essa opção não está disponível. Escolha: 1-Dinheiro  2-Pix  3-Cartão"
       → permanece em PAGAMENTO
  4. Salvar a forma de pagamento no registro do cliente
  5. Mudar estado para ENDEREÇO
  6. Pedir o endereço de entrega</div>

  <div class="info-box">
    <strong>Regra importante:</strong> o campo "produto_selecionado" no banco de dados é reutilizado temporariamente para guardar a forma de pagamento e o endereço durante o checkout. Isso evita a criação de campos extras na tabela enquanto o pedido ainda não foi confirmado.
  </div>

  <h2>5. Etapa de endereço</h2>

  <p>O endereço é coletado em texto livre — o cliente escreve como quiser. A única validação feita é o tamanho mínimo de 5 caracteres, para evitar que alguém mande apenas "rua" ou uma única letra. Não há validação de CEP nem conferência de geolocalização. O endereço é salvo como o cliente digitou e será exibido no resumo do pedido.</p>

  <div class="flow-box">PROCESSAMENTO DO ENDEREÇO
  1. Verificar se o texto tem pelo menos 5 caracteres
     → Se não tiver: "O endereço ficou muito curto. Informe a rua, número e bairro."
     → Permanece em ENDEREÇO
  2. Salvar o endereço no registro temporário do cliente
  3. Mudar estado para CONFIRMAÇÃO
  4. Calcular o total: somar (preço × quantidade) de cada item
  5. Montar e exibir o resumo completo do pedido</div>

  <div class="dialog-block">Bot: 📋 Veja o resumo do seu pedido antes de confirmar:

     O que você pediu:
     • 1x Pizza Quatro Queijos — R$ 35,00
     • 1x Refrigerante — R$ 6,00

     Total: R$ 41,00
     Pagamento: Pix
     Endereço: Av. Brasil, 450, Apto 12, Jardim América

     Está tudo certo? Digite "sim" para confirmar ou "não" para cancelar.</div>

  <h2>6. Etapa de confirmação</h2>

  <p>Essa é a última etapa antes do registro. O sistema aguarda uma resposta clara do cliente. Qualquer variação de "sim" confirma o pedido; qualquer variação de "não" cancela tudo e limpa o carrinho. Respostas fora desse padrão fazem o bot repetir a pergunta.</p>

  <div class="flow-box">PROCESSAMENTO DA CONFIRMAÇÃO
  1. Converter resposta para minúsculas

  SE "sim", "s", "confirmar" ou "ok":
    - Recuperar todos os dados: itens, total, pagamento, endereço
    - Criar o registro do pedido no banco (tabelas: pedidos + itens_pedido)
    - Limpar o carrinho e resetar o estado para MENU
    - Enviar a mensagem de confirmação com número do pedido e ETA

  SE "não", "nao", "n" ou "cancelar":
    - Limpar o carrinho e resetar o estado
    - "Pedido cancelado. Se quiser recomeçar, é só me chamar!"

  QUALQUER OUTRA RESPOSTA:
    - "Não entendi. Digite 'sim' para confirmar ou 'não' para cancelar."
    - Permanece em CONFIRMAÇÃO</div>

  <div class="dialog-block">Cliente: sim
Bot:     🎉 Pedido confirmado!

         Número do pedido: #47
         Total: R$ 41,00
         Pagamento: Pix
         Endereço: Av. Brasil, 450, Apto 12, Jardim América

         Tempo estimado de entrega: 40 a 50 minutos.
         Obrigado pela preferência! 🍕</div>

  <h2>7. Sistema de controle de inatividade</h2>

  <p>O TimeoutService roda em paralelo ao fluxo principal, sem interferir no atendimento. Ele verifica periodicamente o horário da última interação de cada cliente ativo. Quando passa de dois minutos, manda um aviso. Se chegar em cinco minutos, a sessão é encerrada automaticamente e o carrinho é limpo.</p>

  <p>Essa funcionalidade é importante para liberar recursos do sistema e evitar que pedidos incompletos fiquem presos na memória indefinidamente. Do ponto de vista do cliente, o aviso chega de forma amigável e dá tempo suficiente para ele retomar o atendimento se quiser.</p>

  <div class="flow-box">TIMEOUT SERVICE (processo paralelo)

A cada intervalo de verificação:
  → Para cada cliente com etapa diferente de MENU:
       Calcular tempo desde a última interação

  Se passou 2 minutos:
    → Enviar: "⏰ Percebemos que você parou de responder.
               Ainda dá tempo de continuar — basta mandar qualquer mensagem.
               Se quiser recomeçar do zero, escreva 'menu'."

  Se passou 5 minutos:
    → Encerrar a sessão, limpar o carrinho
    → Enviar: "Encerramos seu atendimento por inatividade.
               Quando quiser pedir, é só me chamar de novo!"</div>

  <h2>8. Exemplos de conversa completos</h2>

  <h3>8.1 Fluxo completo sem erros — pedido em texto + Pix</h3>
  <div class="dialog-block">[18:32] Cliente: boa noite
[18:32] Bot:     Olá! Seja bem-vindo à Pizzaria Otaliva 🍕
                 Em que posso te ajudar?
                 • Fazer um pedido  • Ver o cardápio  • Tirar uma dúvida

[18:33] Cliente: quero uma pizza de quatro queijos e um refrigerante
[18:33] Bot:     Excelente escolha! ✅
                 1x Pizza Quatro Queijos
                 1x Refrigerante
                 Quer adicionar mais alguma coisa ou prefere finalizar?

[18:33] Cliente: é isso, pode finalizar
[18:33] Bot:     Certo! Vamos fechar o pedido. 💳
                 • 1x Pizza Quatro Queijos  • 1x Refrigerante
                 Como você vai pagar? 1-Dinheiro  2-Pix  3-Cartão

[18:34] Cliente: 2
[18:34] Bot:     Pix! Ótimo. 📍 Agora me manda o endereço completo de entrega:

[18:34] Cliente: Av. Brasil, 450, Apto 12, Jardim América
[18:34] Bot:     📋 Resumo do pedido:
                 1x Pizza Q.Queijos — R$35  |  1x Refrigerante — R$6
                 Total: R$41,00  |  Pix  |  Av. Brasil, 450
                 "sim" para confirmar ou "não" para cancelar.

[18:35] Cliente: sim
[18:35] Bot:     🎉 Pedido confirmado! #47 | R$41,00 | Pix | ETA: 40–50 min 🍕</div>

  <h3>8.2 Cliente erra várias vezes — sistema corrige sem travar</h3>
  <div class="dialog-block">[21:00] Cliente: quero 3 pizzas de calabresa
[21:00] Bot:     ✅ 3x Pizza Calabresa adicionada! Quer mais alguma coisa?

[21:01] Cliente: finalizar
[21:01] Bot:     Seu pedido: • 3x Pizza Calabresa
                 Como vai pagar? 1-Dinheiro  2-Pix  3-Cartão

[21:01] Cliente: 5
[21:01] Bot:     Essa opção não existe. Escolha: 1-Dinheiro  2-Pix  3-Cartão

[21:02] Cliente: 1
[21:02] Bot:     Dinheiro! Agora me manda o endereço:

[21:02] Cliente: rua
[21:02] Bot:     O endereço ficou muito curto. Me manda a rua, o número e o bairro. 😊

[21:03] Cliente: Rua Sete de Setembro, 88, Vila Nova
[21:03] Bot:     📋 3x Pizza Calabresa — R$90,00 | Dinheiro | Rua 7 de Setembro, 88
                 "sim" para confirmar ou "não" para cancelar.

[21:03] Cliente: talvez
[21:03] Bot:     Não entendi. Escreva "sim" para confirmar ou "não" para cancelar.

[21:04] Cliente: sim
[21:04] Bot:     🎉 Pedido confirmado! #52 | R$90,00 | Dinheiro | Rua 7 de Setembro, 88</div>

  <h3>8.3 Cliente para de responder e depois retoma</h3>
  <div class="dialog-block">[20:05] Cliente: quero uma pizza margherita
[20:05] Bot:     ✅ 1x Pizza Margherita. Quer mais alguma coisa ou prefere finalizar?

[20:06] Cliente: vocês entregam no centro?
[20:06] Bot:     Entregamos sim! Nossa área de entrega cobre o centro e bairros próximos. 😊

[20:08] Bot:     ⏰ Ei, parece que você parou de responder.
                 Ainda tem mais 3 minutos antes de encerrarmos o atendimento.
                 Manda qualquer mensagem para continuar, tá?

[20:09] Cliente: desculpa, pode finalizar
[20:09] Bot:     Tranquilo! 💳 Seu pedido: • 1x Pizza Margherita
                 Como vai pagar? 1-Dinheiro  2-Pix  3-Cartão</div>

  <h2>9. Estrutura de dados da sessão do cliente</h2>

  <p>Cada cliente tem um único registro na tabela <em>clientes</em> do banco SQLite. Esse registro funciona como o "estado de memória" daquele atendimento — tudo que o sistema precisa saber sobre o andamento do pedido está ali.</p>

  <div class="flow-box">// Tabela: clientes (SQLite)
{
  id                  → número identificador único (gerado automaticamente)
  telefone            → número do WhatsApp do cliente (chave única)
  etapa_atual         → onde o cliente está: MENU | QUANTIDADE | PAGAMENTO | ENDERECO | CONFIRMACAO
  produto_selecionado → JSON temporário: produto escolhido + pagamento + endereço (durante checkout)
  itens_pedido        → JSON com a lista de itens: [ { produto, quantidade, preco } ]
  ultima_interacao    → data e hora do último contato (usado pelo sistema de timeout)
}</div>

  <h2>10. Regras de negócio do sistema</h2>

  <p>Durante o desenvolvimento, algumas regras de negócio precisaram ser definidas para garantir consistência no atendimento. Elas estão descritas abaixo com seu respectivo impacto no comportamento do sistema:</p>

  <table>
    <thead><tr><th>Código</th><th>Regra</th><th>Consequência prática</th></tr></thead>
    <tbody>
      <tr><td>RN-01</td><td>Cardápio com 10 itens numerados de 1 a 10</td><td>Qualquer número fora desse intervalo não é reconhecido como produto</td></tr>
      <tr><td>RN-02</td><td>Quantidade mínima: 1 unidade por item</td><td>Zero e números negativos são rejeitados pelo sistema</td></tr>
      <tr><td>RN-03</td><td>Endereço precisa ter no mínimo 5 caracteres</td><td>Textos muito curtos são bloqueados — sem validação de CEP</td></tr>
      <tr><td>RN-04</td><td>Pagamento: apenas opções 1, 2 ou 3</td><td>Qualquer outro valor gera mensagem de erro e nova solicitação</td></tr>
      <tr><td>RN-05</td><td>Aviso de inatividade após 2 minutos sem resposta</td><td>Bot manda uma mensagem proativa antes de encerrar</td></tr>
      <tr><td>RN-06</td><td>Encerramento automático após 5 minutos sem resposta</td><td>Sessão e carrinho são limpos pelo sistema</td></tr>
      <tr><td>RN-07</td><td>Tempo estimado de entrega fixo: 40 a 50 minutos</td><td>Não varia por distância ou volume de pedidos — valor padrão</td></tr>
      <tr><td>RN-08</td><td>Número do pedido gerado pelo banco automaticamente</td><td>Sequência numérica única garantida pelo auto-increment do SQLite</td></tr>
      <tr><td>RN-09</td><td>Comandos "menu", "cancelar" e "reiniciar" têm prioridade absoluta</td><td>Funcionam em qualquer etapa, sem exceção</td></tr>
      <tr><td>RN-10</td><td>A IA só é chamada quando as regras fixas não dão conta</td><td>Reduz o tempo de resposta e evita erros de interpretação em etapas críticas</td></tr>
      <tr><td>RN-11</td><td>Processamento 100% local com Ollama</td><td>Nenhum dado de cliente é enviado para servidores externos</td></tr>
      <tr><td>RN-12</td><td>Mensagens de áudio não são suportadas</td><td>Bot solicita que o cliente escreva a mensagem em texto</td></tr>
    </tbody>
  </table>

  <h2>11. Testes previstos</h2>

  <p>Para garantir que o chatbot funciona como esperado em situações reais, foram definidos três categorias de teste:</p>

  <h3>Testes funcionais</h3>
  <p>Esses testes verificam se cada etapa do atendimento funciona corretamente de forma isolada e no fluxo completo. Incluem: pedido por número, pedido por texto, adição de múltiplos itens, troca de pagamento, cancelamento no meio do processo e confirmação final com registro no banco.</p>

  <h3>Testes de usabilidade</h3>
  <p>Aqui o foco é entender como clientes reais interagem com o bot. Coisas como: as mensagens estão claras para alguém que nunca usou um chatbot antes? Os fallbacks ajudam o usuário a se recuperar quando erra? O fluxo parece natural ou parece mecânico?</p>

  <h3>Testes de desempenho</h3>
  <p>Como a pizzaria pode receber até 130 pedidos por dia, o sistema precisa suportar múltiplos usuários simultâneos sem degradação. Os testes avaliam o tempo de resposta, o comportamento do timeout com vários clientes ativos ao mesmo tempo e a consistência dos dados no banco após múltiplos pedidos paralelos.</p>

  <div class="footer">
    OtalivaBot · Documento 3 — Low-Level Design Conversacional · Polo Luis Gomes · Abril de 2026
  </div>
</div>
</body>
</html>`;

// ─── Geração ─────────────────────────────────────────────────────────────────
async function gerarPDF(html, nomeArquivo) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.pdf({
      path: nomeArquivo,
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '25mm' },
      printBackground: true
    });
    console.log(`✅ PDF gerado: ${path.basename(nomeArquivo)}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  console.log('🚀 Gerando PDFs...\n');
  await gerarPDF(doc1HTML, path.join(outputDir, 'Doc1_Design_Conversacional_Completo.pdf'));
  await gerarPDF(doc2HTML, path.join(outputDir, 'Doc2_High_Level_Design.pdf'));
  await gerarPDF(doc3HTML, path.join(outputDir, 'Doc3_Low_Level_Design.pdf'));
  console.log('\n🎉 PDFs gerados em /docs');
}

main().catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });
