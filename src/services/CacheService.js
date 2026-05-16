class CacheService {
  constructor() {
    // L1: memória RAM para respostas rápidas
    this.memoria = new Map();
  }

  _normalizar(mensagem) {
    return mensagem
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  _chave(tipo, mensagem) {
    return `${tipo}::${this._normalizar(mensagem)}`;
  }

  _modelo() {
    // Importação tardia para evitar dependência circular no boot
    return require('../models/CacheIA');
  }

  async get(tipo, mensagem) {
    const chave = this._chave(tipo, mensagem);

    // L1: checar memória primeiro
    if (this.memoria.has(chave)) {
      console.log(`⚡ Cache L1 (RAM): ${chave.substring(0, 60)}`);
      return this.memoria.get(chave);
    }

    // L2: checar banco de dados
    try {
      const CacheIA = this._modelo();
      const entrada = await CacheIA.findOne({ where: { chave } });
      if (entrada) {
        const valor = JSON.parse(entrada.valor);
        // Promover para L1
        this.memoria.set(chave, valor);
        // Incrementar contador de uso
        entrada.increment('hits').catch(() => {});
        console.log(`⚡ Cache L2 (DB): ${chave.substring(0, 60)} [hits: ${entrada.hits + 1}]`);
        return valor;
      }
    } catch (err) {
      console.error('Cache DB erro (get):', err.message);
    }

    return null;
  }

  async set(tipo, mensagem, valor) {
    const chave = this._chave(tipo, mensagem);

    // Salvar em L1
    this.memoria.set(chave, valor);

    // Salvar em L2 (criar ou atualizar)
    try {
      const CacheIA = this._modelo();
      await CacheIA.upsert({
        tipo,
        chave,
        valor: JSON.stringify(valor)
      });
    } catch (err) {
      console.error('Cache DB erro (set):', err.message);
    }
  }

  async estatisticas() {
    try {
      const CacheIA = this._modelo();
      const total = await CacheIA.count();
      const { sequelize } = require('../config/database');
      const [resultado] = await sequelize.query(
        'SELECT SUM(hits) as total_hits FROM cache_ia'
      );
      return {
        entradas_no_banco: total,
        entradas_na_memoria: this.memoria.size,
        total_hits: resultado[0]?.total_hits ?? 0
      };
    } catch (err) {
      return { entradas_na_memoria: this.memoria.size, erro: err.message };
    }
  }

  async listar(tipo = null) {
    try {
      const CacheIA = this._modelo();
      const where = tipo ? { tipo } : {};
      return await CacheIA.findAll({
        where,
        order: [['hits', 'DESC']],
        attributes: ['id', 'tipo', 'chave', 'hits', 'createdAt']
      });
    } catch (err) {
      return [];
    }
  }

  async limparTudo() {
    this.memoria.clear();
    try {
      const CacheIA = this._modelo();
      await CacheIA.destroy({ where: {} });
    } catch (err) {
      console.error('Cache DB erro (limpar):', err.message);
    }
  }

  async limparEntrada(id) {
    try {
      const CacheIA = this._modelo();
      const entrada = await CacheIA.findByPk(id);
      if (entrada) {
        this.memoria.delete(entrada.chave);
        await entrada.destroy();
        return true;
      }
    } catch (err) {
      console.error('Cache DB erro (limparEntrada):', err.message);
    }
    return false;
  }
}

module.exports = new CacheService();
