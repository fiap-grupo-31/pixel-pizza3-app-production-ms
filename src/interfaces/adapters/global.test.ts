import { Global } from './global';

describe('Global', () => {
  it('Deve retornar um objeto de erro com statusCode padrão se nenhum dado for fornecido', () => {
    const errorResult = Global.error(null);
    expect(errorResult).toEqual({
      statusCode: 200,
      status: 'success',
      data: []
    });
  });

  it('Deve retornar um objeto de erro com statusCode e mensagem especificados', () => {
    const errorMessage = 'Not found';
    const errorResult = Global.error(errorMessage, 404);
    expect(errorResult).toEqual({
      statusCode: 404,
      status: 'error',
      message: errorMessage
    });
  });

  it('Deve retornar um objeto de sucesso padrão se nenhum dado for fornecido', () => {
    const successResult = Global.success(null);
    expect(successResult).toEqual({
      statusCode: 200,
      status: 'success',
      data: []
    });
  });

  it('Deve retornar um objeto de sucesso com os dados fornecidos', () => {
    const data = { key: 'value' };
    const successResult = Global.success(data);
    expect(successResult).toEqual({
      statusCode: 200,
      status: 'success',
      data
    });
  });

  it('Deve converter dados para objeto corretamente', () => {
    const jsonData = '{"key": "value"}';
    const convertedData = Global.convertToObject(jsonData);
    expect(convertedData).toEqual({ key: 'value' });
  });

  it('Deve retornar um objeto vazio para dados inválidos na conversão', () => {
    const invalidData = 'invalidJSON';
    const convertedData = Global.convertToObject(invalidData);
    expect(convertedData).toEqual({});
  });

  it('Deve retornar um objeto vazio para dado null na conversão', () => {
    const invalidData = null;
    const convertedData = Global.convertToObject(invalidData);
    expect(convertedData).toEqual({});
  });

  it('Deve formatar a data com o fuso horário correto', () => {
    const date = new Date('2023-12-26T12:00:00Z');
    const formattedDate = Global.formatISOWithTimezone(date);
    expect(formattedDate).toMatch('2023-12-26T12:00:00.000-00:00');
  });
});
