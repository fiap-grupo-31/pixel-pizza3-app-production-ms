import * as amqp from 'amqplib/callback_api';

export class RabbitMQService {
  private connection: amqp.Connection | undefined;
  private channel?: amqp.Channel;

  async init (): Promise<void> {
    this.connection = await new Promise<amqp.Connection>((resolve, reject) => {
      amqp.connect(process.env.AMQPURI ?? '', (err, conn) => {
        if (err) reject(err);
        resolve(conn);
      });
    });

    this.channel = await new Promise<amqp.Channel>((resolve, reject) => {
      if (!this.connection) {
        throw new Error('Failed to initialize connection');
      }
      this.connection.createChannel((err, ch) => {
        if (err) reject(err);
        resolve(ch);
      });
    });
  }

  async sendMessage (queue: string, message: any): Promise<any> {
    if (!this.connection) {
      await this.init();
    }
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    this.channel.assertQueue(queue, {
      durable: true,
      arguments: { 'x-queue-type': 'classic' }
    });
    return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume (queue: string, callback: (message: any) => void): Promise<any> {
    if (!this.connection) {
      await this.init();
    }
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    this.channel.assertQueue(queue, {
      durable: true,
      arguments: { 'x-queue-type': 'classic' }
    });

    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(JSON.parse(msg.content.toString()));
        if (!this.channel) {
          throw new Error('Channel not initialized');
        }
        this.channel.ack(msg);
      }
    });
  }
}
