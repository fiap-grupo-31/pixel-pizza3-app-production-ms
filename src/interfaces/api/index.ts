/* eslint-disable @typescript-eslint/no-misused-promises */
import { ProductionController } from '../controllers/production';

import { type DbConnection } from '../../domain/interfaces/dbconnection';
import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import { Global } from '../adapters';
import { swaggerSpec } from '../../infrastructure/swagger/swagger';
import path from 'path';

export class FastfoodApp {
  private readonly _dbconnection: DbConnection;
  private readonly _app = express();

  constructor (dbconnection: DbConnection) {
    this._dbconnection = dbconnection;
    this._app = express();
  }

  start (): void {
    this._app.use(bodyParser.json());
    this._app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Keep-Alive', 'timeout=30');
      if (err instanceof SyntaxError && err.message.includes('JSON')) {
        const errorGlobal: any = Global.error('O body não esta em formato JSON, verifique e tente novamente.', 400);
        return res.status(errorGlobal.statusCode || 404).send(errorGlobal);
      } else {
        next();
      }
    });

    const port = process.env.PORT ?? 8080;

    this._app.get('/swagger.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require('swagger-ui-express');
    this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.routes();
    const server = this._app.listen(port, () => {
      if (process.env.CI) {
        process.exit(0)
      }
    });
    server.keepAliveTimeout = 30 * 1000;
    server.headersTimeout = 35 * 1000;
  }

  routes (): void {
    this.routesProduction();
  }

  routesApp (): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this._app.get('/', async (_req: Request, res: Response) => {
      const filePath = path.join(path.resolve(__dirname, '../../'), 'SimulationPage.html');
      res.sendFile(filePath);
    });
  }

  routesProduction (): void {
    /**
        * @swagger
        * /production:
        *   get:
        *     summary: retorna lista de todos os pedidos da lista de produção
        *     tags:
        *       - Production
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: array
        *                   items:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _orderId:
        *                         type: string
        *                       _protocol:
        *                         type: string
        *                       _orderDescription:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _created_at:
        *                         type: string
        *                       _updated_at:
        *                         type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.get('/production', async (req: Request, res: Response) => {
      res.setHeader('Content-type', 'application/json');

      const products = await ProductionController.getProduction(
        this._dbconnection
      );
      res.send(products);
    });

    /**
        * @swagger
        * /production/:id:
        *   get:
        *     summary: retorna um pedidos da lista de produção por id
        *     tags:
        *       - Production
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: id do pedido
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _orderId:
        *                         type: string
        *                       _protocol:
        *                         type: string
        *                       _orderDescription:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _created_at:
        *                         type: string
        *                       _updated_at:
        *                         type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.get('/production/:id', async (req: Request, res: Response) => {
      res.setHeader('Content-type', 'application/json');
      const { id } = req.params;

      const production = await ProductionController.getPaymentsById(
        BigInt(id),
        this._dbconnection
      );
      res.send(production);
    });

    /**
        * @swagger
        * /production/status/:status:
        *   get:
        *     summary: retorna uma lista de pedidos da lista de produção por status
        *     tags:
        *       - Production
        *     parameters:
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: status do pedido
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: array
        *                   items:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _orderId:
        *                         type: string
        *                       _protocol:
        *                         type: string
        *                       _orderDescription:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _created_at:
        *                         type: string
        *                       _updated_at:
        *                         type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.get('/production/status/:status', async (req: Request, res: Response) => {
      res.setHeader('Content-type', 'application/json');
      const { status } = req.params;

      const production = await ProductionController.getProductionByStatus(
        status,
        this._dbconnection
      );
      res.send(production);
    });

    /**
        * @swagger
        * /production:
        *   post:
        *     summary: Efetua um pedido para da lista de produção
        *     tags:
         *       - Production
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               orderId:
        *                 type: string
        *               protocol:
        *                 type: string
        *               orderDescription:
        *                 type: string
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _orderId:
        *                         type: string
        *                       _protocol:
        *                         type: string
        *                       _orderDescription:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _created_at:
        *                         type: string
        *                       _updated_at:
        *                         type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.post('/production', async (req: Request, res: Response) => {
      res.setHeader('Content-type', 'application/json');
      const { orderId, protocol, orderDescription } = req.body;
      const payment = await ProductionController.setProduction(
        orderId,
        protocol,
        orderDescription,
        'WAITING',
        this._dbconnection
      );
      res.send(payment);
    });

    /**
        * @swagger
        * /production/:id:
        *   put:
        *     summary: Atualiza um pedido para da lista de produção por id
        *     tags:
        *       - Production
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: id do pedido de pagamento
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               status:
        *                 type: string
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _orderId:
        *                         type: string
        *                       _protocol:
        *                         type: string
        *                       _orderDescription:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _created_at:
        *                         type: string
        *                       _updated_at:
        *                         type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.put('/production/:id', async (req: Request, res: Response) => {
      res.setHeader('Content-type', 'application/json');
      const { id } = req.params;
      const { status } = req.body;
      const payment = await ProductionController.updateProduction(
        BigInt(id),
        status,
        this._dbconnection
      );
      res.send(payment);
    });
  }
}