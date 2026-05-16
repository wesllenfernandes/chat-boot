const Empresa = require('../models/Empresa');
const CidadeEntrega = require('../models/CidadeEntrega');

class EmpresaService {
  static async inicializar() {
    const count = await Empresa.count();
    if (count === 0) {
      await Empresa.create({
        nome: 'Pizzaria Otaliva',
        cidade: '',
        estado: '',
        telefone: '',
        endereco: '',
        cnpj: '',
        descricao: ''
      });
    }
  }

  static async getEmpresa() {
    return await Empresa.findOne();
  }

  static normalizarParaComparacao(cidade) {
    return (cidade || '').trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  static async validarCidade(cidadeInput) {
    if (!cidadeInput || !cidadeInput.trim()) {
      return { valida: false, listaCidades: [] };
    }

    const normalizado = this.normalizarParaComparacao(cidadeInput);
    const empresa = await this.getEmpresa();
    const cidadesDB = await CidadeEntrega.findAll({ where: { ativa: true } });

    // Mapa: nome normalizado → { taxa, nomeOriginal, isSede }
    const mapa = {};

    // Cidade sede sempre no mapa com taxa padrão 0
    if (empresa && empresa.cidade) {
      const sedeNorm = this.normalizarParaComparacao(empresa.cidade);
      mapa[sedeNorm] = { taxa: 0, nome: empresa.cidade, isSede: true };
    }

    // Cidades do banco (podem sobrescrever taxa da sede)
    for (const c of cidadesDB) {
      const norm = this.normalizarParaComparacao(c.cidade);
      const isSede = empresa ? this.normalizarParaComparacao(empresa.cidade) === norm : false;
      mapa[norm] = { taxa: Number(c.taxa_entrega), nome: c.cidade, isSede };
    }

    // Se nenhuma configuração feita, aceita qualquer cidade
    if (!empresa || !empresa.cidade) {
      return { valida: true, taxa: 0, cidadeNome: cidadeInput.trim() };
    }

    if (mapa[normalizado]) {
      const { taxa, nome } = mapa[normalizado];
      return { valida: true, taxa, cidadeNome: nome };
    }

    // Montar lista de cidades disponíveis para exibir no erro
    const listaCidades = Object.values(mapa).map(c => {
      const partes = [c.nome];
      if (c.isSede) partes.push('(sede)');
      if (c.taxa > 0) partes.push(`taxa: R$ ${c.taxa.toFixed(2)}`);
      return partes.join(' ');
    });

    return { valida: false, listaCidades };
  }
}

module.exports = EmpresaService;
