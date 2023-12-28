import { expect } from 'chai';
import { Production } from './Production';

const dateCurrent = new Date();

describe('Classe Production', () => {
  let producao: Production;

  beforeEach(() => {
    producao = new Production(
      1,
      'order123',
      '5',
      'Descrição do pedido',
      'WAITING',
      dateCurrent,
      dateCurrent
    );
  });

  describe('getters', () => {
    it('deve retornar orderId', () => {
      expect(producao.orderId).to.equal('order123');
    });

    it('deve retornar id', () => {
      expect(producao.id).to.equal(1);
    });

    it('deve retornar statusCheck como verdadeiro para status válido', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(producao.statusCheck).to.be.true;
    });

    it('deve retornar protocol', () => {
      expect(producao.protocol).to.equal('5');
    });

    it('deve retornar orderDescription', () => {
      expect(producao.orderDescription).to.equal('Descrição do pedido');
    });

    it('deve retornar status', () => {
      expect(producao.status).to.equal('WAITING');
    });

    it('deve retornar statusCheck', () => {
      expect(producao.statusCheck).to.equal(true);
    });

    it('deve retornar created_at', () => {
      expect(producao.created_at).to.equal(dateCurrent);
    });

    it('deve retornar updated_at', () => {
      expect(producao.updated_at).to.equal(dateCurrent);
    });

    it('deve retornar statusCheck como falso para status inválido', () => {
      const producaoInvalida = new Production(
        2,
        'order456',
        'protocol456',
        'Descrição do pedido',
        'STATUS_INVALIDO', // Um status inválido
        new Date(),
        new Date()
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(producaoInvalida.statusCheck).to.be.false;
    });
  });
});
