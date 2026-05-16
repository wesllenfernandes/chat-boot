const express = require('express');
const path = require('path');
const router = express.Router();
const Produto = require('../models/Produto');
const HorarioFuncionamento = require('../models/HorarioFuncionamento');
const { recarregar } = require('../config/cardapio');

const autenticar = (req, res, next) => {
  const senha = process.env.ADMIN_PASSWORD || 'admin123';
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${senha}`) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  next();
};

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.post('/api/login', (req, res) => {
  const { senha } = req.body;
  const senhaCorreta = process.env.ADMIN_PASSWORD || 'admin123';
  if (senha === senhaCorreta) {
    res.json({ token: senha });
  } else {
    res.status(401).json({ erro: 'Senha incorreta' });
  }
});

router.get('/api/produtos', autenticar, async (req, res) => {
  try {
    const produtos = await Produto.findAll({ order: [['id', 'ASC']] });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post('/api/produtos', autenticar, async (req, res) => {
  try {
    const { nome, preco, tipo, descricao } = req.body;
    if (!nome || preco == null || !tipo) {
      return res.status(400).json({ erro: 'Nome, preço e tipo são obrigatórios' });
    }
    const produto = await Produto.create({ nome, preco, tipo, descricao: descricao || '', ativo: true });
    await recarregar();
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put('/api/produtos/:id', autenticar, async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    const { nome, preco, tipo, descricao, ativo } = req.body;
    await produto.update({ nome, preco, tipo, descricao, ativo });
    await recarregar();
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/api/horarios', autenticar, async (req, res) => {
  try {
    const horarios = await HorarioFuncionamento.findAll({ order: [['dia_semana', 'ASC']] });
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put('/api/horarios', autenticar, async (req, res) => {
  try {
    const { horarios } = req.body; // array de { dia_semana, aberto, hora_abertura, hora_fechamento }
    for (const h of horarios) {
      await HorarioFuncionamento.update(
        { aberto: h.aberto, hora_abertura: h.hora_abertura, hora_fechamento: h.hora_fechamento },
        { where: { dia_semana: h.dia_semana } }
      );
    }
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/api/whatsapp/status', autenticar, (req, res) => {
  const ctrl = req.app.locals.whatsappController;
  if (!ctrl) return res.json({ status: 'initializing', qrCode: null, numero: null });
  res.json(ctrl.getWhatsAppStatus());
});

router.post('/api/whatsapp/disconnect', autenticar, async (req, res) => {
  const ctrl = req.app.locals.whatsappController;
  if (!ctrl) return res.status(503).json({ erro: 'Controller não disponível' });
  try {
    await ctrl.desconectar();
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post('/api/whatsapp/reconnect', autenticar, async (req, res) => {
  const ctrl = req.app.locals.whatsappController;
  if (!ctrl) return res.status(503).json({ erro: 'Controller não disponível' });
  try {
    await ctrl.reconectar();
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/api/pedidos', autenticar, async (req, res) => {
  try {
    const { Cliente, Pedido, ItemPedido } = require('../models');
    const pedidos = await Pedido.findAll({
      include: [
        { model: Cliente, as: 'cliente', attributes: ['telefone'] },
        { model: ItemPedido, as: 'itens' }
      ],
      order: [['createdAt', 'DESC']],
      limit: 500
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put('/api/pedidos/:id/status', autenticar, async (req, res) => {
  try {
    const { Pedido } = require('../models');
    const { status } = req.body;
    const validos = ['pendente', 'confirmado', 'em_preparo', 'enviado', 'entregue', 'cancelado'];
    if (!validos.includes(status)) return res.status(400).json({ erro: 'Status inválido' });
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    await pedido.update({ status });
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
