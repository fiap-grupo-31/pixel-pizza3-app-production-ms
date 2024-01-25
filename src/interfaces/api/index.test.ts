import request from 'supertest';
import { FastfoodApp } from './index';
import { ProductionController } from '../controllers/production';

jest.mock('../controllers/production');

describe('FastfoodApp', () => {
  let fastfoodApp: FastfoodApp;
  let mockDbConnection: any;

  beforeAll(() => {
    mockDbConnection = {};
    process.env.PORT = '9010';
    fastfoodApp = new FastfoodApp(mockDbConnection);
    fastfoodApp.start();
  });

  afterAll(() => {
    fastfoodApp.stop();
  });

  describe('Configuração da Aplicação', () => {
    it('deve configurar a aplicação corretamente', () => {
      expect(fastfoodApp).toBeInstanceOf(FastfoodApp);
    });

    it('deve configurar os middlewares corretamente', () => {
    });
  });

  describe('Endpoints', () => {
    it('deve fornecer a especificação Swagger em /swagger.json', async () => {
      const response = await request(fastfoodApp._app).get('/swagger.json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve fornecer a documentação Swagger em /api-docs', async () => {
      const response = await request(fastfoodApp._app).get('/api-docs');
      expect(response.headers['content-type']).toContain('text/html; charset=UTF-8');
    });

    it('deve responder corretamente ao endpoint /production', async () => {
      const mockProductionData = '[]';
      (ProductionController.getProduction as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/production');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /production/:id', async () => {
      const mockProductionData = '{}';
      (ProductionController.getPaymentsById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/production/123');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /production/status/:status', async () => {
      const mockProductionData = '[]';
      (ProductionController.getProductionByStatus as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/production/status/DONE');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /production ( post )', async () => {
      const mockProductionData = '[]';
      (ProductionController.setProduction as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/production');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /production/:id ( put )', async () => {
      const mockProductionData = '[]';
      (ProductionController.updateProduction as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).put('/production/1');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});
