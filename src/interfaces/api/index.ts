import { ProductionController } from '../controllers/production';
import { ProductionRabbitmqController } from '../controllers/productionRabbitmq';

import { type DbConnection } from '../../domain/interfaces/dbconnection';
import express, { type Request, type RequestHandler, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Global } from '../adapters';
import { swaggerSpec } from '../../infrastructure/swagger/swagger';

export class FastfoodApp {
  private readonly _dbconnection: DbConnection;
  private readonly _rabbitMqService: any;
  public readonly _app = express();
  private server: any = null;

  constructor (dbconnection: DbConnection, rabbitMQService: any) {
    this._dbconnection = dbconnection;
    this._rabbitMqService = rabbitMQService;

    void ProductionRabbitmqController.startConsuming(this._dbconnection, this._rabbitMqService);
    this._app = express();
  }

  start (): void {
    this._app.use(bodyParser.json());
    this._app.disable('x-powered-by');
    this._app.use(cors());
    this._app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Keep-Alive', 'timeout=30');
      res.setHeader('Content-Security-Policy', "default-src 'self'");
      res.setHeader('X-Content-Type-Options', 'nosniff');
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
    this._app.get('/production', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');

      const products = await ProductionController.getProduction(
        this._dbconnection
      );
      res.send(products);
    }) as RequestHandler);

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
    this._app.get('/production/:id', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { id } = req.params;

      const production = await ProductionController.getPaymentsById(
        BigInt(id),
        this._dbconnection
      );
      res.send(production);
    }) as RequestHandler);

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
    this._app.get('/production/status/:status', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { status } = req.params;

      const production = await ProductionController.getProductionByStatus(
        status,
        this._dbconnection
      );
      res.send(production);
    }) as RequestHandler);

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
    this._app.post('/production', (async (req: Request, res: Response): Promise<void> => {
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
    }) as RequestHandler);

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
    this._app.put('/production/:id', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { id } = req.params;
      const { status } = req.body;
      const payment = await ProductionController.updateProduction(
        BigInt(id),
        status,
        this._rabbitMqService,
        this._dbconnection
      );
      res.send(payment);
    }) as RequestHandler);

    this._app.use((req, res) => {
      res.status(200).send('');
    });
    this.server = this._app.listen(port, () => {
    });
    this.server.keepAliveTimeout = 30 * 1000;
    this.server.headersTimeout = 35 * 1000;
  }

  stop (): void {
    this.server.close();
  }
}
