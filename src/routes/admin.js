const express = require('express');
const path = require('path');
const router = express.Router();
const Produto = require('../models/Produto');
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

module.exports = router;
