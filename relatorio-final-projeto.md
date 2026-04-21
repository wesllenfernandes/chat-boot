# RELATÓRIO FINAL DO PROJETO

## 1. Capa

**Nome da Instituição/Empresa:** Unidade Curricular de Extensão / Pizzaria Otaliva  
**Título:** Relatório Final do Projeto OtalivaBot: chatbot conversacional para atendimento e pedidos da Pizzaria Otaliva  
**Autores:** Willian Fernandes Paiva; Francisco Jucinery Alves Vieira; Wesllen Fernandes Paiva  
**Local e Ano:** Major Sales - RN, 2026

## 2. Resumo

Este relatório apresenta o desenvolvimento do OtalivaBot, chatbot criado para apoiar o atendimento da Pizzaria Otaliva pelo WhatsApp. O projeto surgiu da necessidade de reduzir o tempo de resposta, diminuir erros no registro manual dos pedidos e organizar melhor a comunicação com os clientes. Para isso, foi construída uma solução local com Node.js, Express, `whatsapp-web.js`, SQLite, Sequelize e Ollama com o modelo `llama3.2`.

O trabalho envolveu levantamento do problema, definição do fluxo conversacional, implementação do sistema e validação prática. Em 20 de abril de 2026, foram realizados testes locais de conexão com o Ollama, respostas a perguntas frequentes, exibição do cardápio, interpretação de pedidos em linguagem natural e simulação completa de um pedido com gravação no SQLite. Os resultados mostram que a solução é adequada para automatizar boa parte do atendimento e manter um fluxo claro de compra. Como limitações, a versão validada depende de execução local com autenticação via QR Code do WhatsApp e não possui suporte operacional a mensagens de áudio.

## 3. Introdução

O WhatsApp se tornou um dos principais canais de contato entre empresas e clientes. Na Pizzaria Otaliva, esse canal já fazia parte da rotina de atendimento, mas o processo era manual. Com o aumento do volume de mensagens, surgiram problemas como demora nas respostas, maior chance de erro no registro dos pedidos e falta de padronização no atendimento.

Diante desse cenário, o projeto OtalivaBot foi desenvolvido com foco prático. A proposta foi criar um chatbot capaz de receber o cliente, responder dúvidas, apresentar o cardápio, registrar pedidos e conduzir o atendimento até a confirmação da compra. Ao mesmo tempo, a equipe buscou avaliar a viabilidade de uma solução 100% local, sem dependência de APIs externas pagas.

O objetivo principal foi construir e validar um chatbot conversacional para a Pizzaria Otaliva, integrado ao WhatsApp e capaz de atender de forma clara, organizada e natural. Como objetivos específicos, o projeto buscou: estruturar o atendimento por etapas, permitir pedidos por número e por linguagem natural, registrar os pedidos em banco de dados e verificar, por meio de testes, se a solução atende às necessidades do contexto analisado.

## 4. Metodologia

O desenvolvimento do projeto foi dividido em etapas. Primeiro, a equipe analisou o contexto da pizzaria e identificou os principais problemas do atendimento manual. Em seguida, foram produzidos os documentos de Design Conversacional Completo, High-Level Design Conversacional e Low-Level Design Conversacional. Esses materiais serviram para definir a persona do chatbot, o tom de comunicação, os fluxos principais, os requisitos do sistema e os cenários de teste.

Na etapa de implementação, foi adotada uma arquitetura em camadas. O servidor foi desenvolvido em Node.js com Express. A integração com o WhatsApp foi feita com a biblioteca `whatsapp-web.js`. O banco de dados escolhido foi o SQLite, com uso do Sequelize ORM. Para a inteligência artificial, foi utilizado o Ollama com o modelo `llama3.2`, executado localmente. Essa escolha permitiu manter baixo custo, simplicidade de manutenção e maior controle sobre os dados.

O fluxo do chatbot foi organizado como uma máquina de estados finitos. O estado `MENU` funciona como ponto central da conversa. A partir dele, o cliente pode ver o cardápio, fazer perguntas, iniciar um pedido ou finalizar a compra. Quando escolhe um item por número, o sistema avança para `QUANTIDADE`; depois retorna ao `MENU`, permitindo adicionar novos itens ou seguir para `PAGAMENTO`, `ENDERECO` e `CONFIRMACAO`. Esse modelo torna o atendimento mais previsível e evita confusão entre conversas de clientes diferentes.

Outro ponto importante da metodologia foi o uso combinado de regras fixas e IA local. As etapas mais sensíveis, como pagamento, endereço e confirmação do pedido, foram tratadas com lógica determinística. Já as mensagens abertas, como saudações, dúvidas e pedidos em linguagem natural, foram encaminhadas para a camada de IA. Com isso, o sistema manteve controle nas etapas críticas e ganhou flexibilidade nas respostas.

Na implementação, foram utilizados os serviços `ChatbotService`, `ClienteService`, `PedidoService`, `AIService`, `OllamaService` e `TimeoutService`, além do controlador `WhatsAppController` e dos modelos `Cliente`, `Pedido` e `ItemPedido`. Também foram usados scripts auxiliares para verificar a disponibilidade do Ollama e testar o fluxo do chatbot.

Na etapa de validação, a equipe realizou testes funcionais locais. Em 20 de abril de 2026, o script `node scripts/verificar-ollama.js` confirmou que o Ollama estava disponível em `http://localhost:11434` e que o modelo `llama3.2` estava configurado para uso. Na mesma data, o script `node scripts/testar-fluxo-chatbot.js` validou cenários como saudação, pergunta sobre horário, pergunta sobre preço, exibição do cardápio e pedido em linguagem natural. Além disso, foi feita uma simulação completa de compra, do menu até a confirmação, com gravação de pedido no banco SQLite.

## 5. Resultados e Discussão

Os resultados obtidos mostram que o OtalivaBot atendeu à maior parte dos objetivos definidos para a versão final do projeto. O chatbot conseguiu responder saudações e perguntas frequentes, exibir o cardápio, interpretar pedidos em linguagem natural, registrar itens no carrinho, solicitar pagamento e endereço, e confirmar o pedido com persistência em banco de dados.

Na prática, a validação local indicou os seguintes resultados:

| Cenário validado | Evidência observada |
| --- | --- |
| Verificação da IA local | O script `verificar-ollama.js` confirmou conexão com o Ollama e listou os modelos `karanchopda333/whisper:latest`, `llama3.2:latest`, `qwen2.5:3b` e `qwen3:1.7b`. |
| Fluxo conversacional básico | O script `testar-fluxo-chatbot.js` processou com sucesso saudação, pergunta de horário, pergunta de preço, comando `cardapio` e pedido em linguagem natural. |
| Persistência ponta a ponta | Uma simulação completa gerou um pedido confirmado no banco SQLite, com total de R$ 60,00, pagamento via Pix e item vinculado ao pedido. |

Do ponto de vista do atendimento, o principal ganho foi a padronização do processo. O cliente pode seguir um fluxo mais claro, com menos dependência de resposta humana imediata para ações repetitivas, como consultar o cardápio, informar a forma de pagamento e confirmar o pedido. Além disso, por funcionar localmente, a solução evita o envio de dados para serviços externos e reduz custos recorrentes.

Do ponto de vista técnico, a organização em camadas facilitou a separação de responsabilidades. O uso de estados ajudou a manter o fluxo sob controle, e o SQLite se mostrou suficiente para o porte do projeto. A combinação entre regras fixas e IA também foi positiva, porque deixou as etapas críticas mais estáveis sem tornar a conversa engessada.

Mesmo com os resultados positivos, algumas limitações precisam ser registradas. A primeira é que o chatbot não possui, até o fechamento deste relatório, um link público de acesso. A solução funciona localmente e depende de autenticação por QR Code no WhatsApp Web. A segunda limitação é o suporte a áudio. Embora essa possibilidade tenha sido mencionada em documentos anteriores, a versão operacional validada responde a mensagens de áudio pedindo que o cliente envie texto. Por isso, esse recurso não pode ser tratado como funcionalidade entregue.

Quanto ao uso da solução, a reprodução dos testes depende de instalação local das dependências com `npm install`, configuração do arquivo `.env`, inicialização do sistema com `npm start`, execução do Ollama e leitura do QR Code do WhatsApp. Também não havia, até o fechamento deste relatório, um vídeo demonstrativo público do sistema, o que pode ser complementado em uma etapa posterior.

## 6. Conclusão

O projeto OtalivaBot alcançou seu objetivo principal de desenvolver um chatbot conversacional para apoiar o atendimento da Pizzaria Otaliva. A solução implementada foi capaz de automatizar etapas importantes do processo de compra, responder dúvidas frequentes, interpretar pedidos em linguagem natural e registrar informações no banco de dados de forma organizada.

O trabalho também mostrou que é possível aplicar conhecimentos de desenvolvimento de software e design conversacional em uma necessidade real de uma pequena empresa. Nesse sentido, o projeto cumpriu bem sua proposta de extensão, ao unir aprendizado técnico e aplicação prática em um contexto de uso concreto.

Em relação ao planejamento inicial, a maior parte do fluxo principal foi entregue e validada. No entanto, nem todos os recursos previstos nas etapas de documentação chegaram à versão final operacional. O suporte a mensagens de áudio, por exemplo, não foi mantido como funcionalidade efetiva. Além disso, o sistema não foi publicado em um ambiente público de fácil acesso, permanecendo dependente de execução local e autenticação manual.

Como continuidade do trabalho, recomenda-se avançar em três pontos principais: retomar a integração de áudio com transcrição local, preparar um ambiente de demonstração mais simples de verificar e ampliar o sistema com funções como painel administrativo, acompanhamento de status dos pedidos, histórico de clientes e métricas de atendimento. Esses passos podem tornar o OtalivaBot uma solução mais completa e mais próxima de um uso real em produção.

## 7. Referências Bibliográficas

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. NBR 10719: Informação e documentação - Relatório técnico e/ou científico - Apresentação.

CHATBOT OTALIVABOT. Documento 1 de 3: Design Conversacional Completo. Major Sales - RN, 2026.

CHATBOT OTALIVABOT. Documento 2 de 3: High-Level Design Conversacional. Major Sales - RN, 2026.

CHATBOT OTALIVABOT. Documento 3 de 3: Low-Level Design Conversacional. Major Sales - RN, 2026.

CHATBOT DE PEDIDOS PARA PIZZARIA. README do projeto. Documentação interna do sistema, 2026.
