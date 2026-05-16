const HorarioFuncionamento = require('../models/HorarioFuncionamento');

const SEMENTE = [
  { dia_semana: 0, nome: 'Domingo',       aberto: true,  hora_abertura: '18:00', hora_fechamento: '23:00' },
  { dia_semana: 1, nome: 'Segunda-feira', aberto: false, hora_abertura: '18:00', hora_fechamento: '23:00' },
  { dia_semana: 2, nome: 'Terça-feira',   aberto: true,  hora_abertura: '18:00', hora_fechamento: '23:00' },
  { dia_semana: 3, nome: 'Quarta-feira',  aberto: true,  hora_abertura: '18:00', hora_fechamento: '23:00' },
  { dia_semana: 4, nome: 'Quinta-feira',  aberto: true,  hora_abertura: '18:00', hora_fechamento: '23:00' },
  { dia_semana: 5, nome: 'Sexta-feira',   aberto: true,  hora_abertura: '18:00', hora_fechamento: '23:00' },
  { dia_semana: 6, nome: 'Sábado',        aberto: true,  hora_abertura: '18:00', hora_fechamento: '23:00' },
];

class HorarioService {
  static async inicializar() {
    const count = await HorarioFuncionamento.count();
    if (count === 0) await HorarioFuncionamento.bulkCreate(SEMENTE);
  }

  static _minutosHoje(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
  }

  static async isAberto() {
    const agora = new Date();
    const horario = await HorarioFuncionamento.findOne({ where: { dia_semana: agora.getDay() } });
    if (!horario || !horario.aberto) return false;
    const atual = agora.getHours() * 60 + agora.getMinutes();
    return atual >= this._minutosHoje(horario.hora_abertura) && atual < this._minutosHoje(horario.hora_fechamento);
  }

  static async proximaAbertura() {
    const horarios = await HorarioFuncionamento.findAll();
    const agora = new Date();

    for (let i = 0; i <= 7; i++) {
      const data = new Date(agora);
      data.setDate(data.getDate() + i);
      const diaSemana = data.getDay();
      const horario = horarios.find(h => h.dia_semana === diaSemana);
      if (!horario || !horario.aberto) continue;

      const [hAb, mAb] = horario.hora_abertura.split(':').map(Number);
      const abertura = new Date(data);
      abertura.setHours(hAb, mAb, 0, 0);

      if (abertura <= agora) continue; // já passou hoje

      const previsaoEntrega = new Date(abertura.getTime() + 50 * 60 * 1000);
      return { data: abertura, previsaoEntrega };
    }
    return null;
  }

  static formatarDataHora(data) {
    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(amanha.getDate() + 1);

    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const nomes = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

    if (data.toDateString() === agora.toDateString()) return `hoje às ${hora}`;
    if (data.toDateString() === amanha.toDateString()) return `amanhã às ${hora}`;
    return `${nomes[data.getDay()]} às ${hora}`;
  }

  static async textoParaIA() {
    const horarios = await HorarioFuncionamento.findAll({ order: [['dia_semana', 'ASC']] });
    const abertos = horarios.filter(h => h.aberto);
    if (abertos.length === 0) return 'Horário de funcionamento: não definido.';
    const linhas = abertos.map(h => `${h.nome}: ${h.hora_abertura} às ${h.hora_fechamento}`);
    return `Horário de funcionamento:\n${linhas.join('\n')}`;
  }
}

module.exports = HorarioService;
