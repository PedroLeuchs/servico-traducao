const amqp = require("amqplib");
require("dotenv").config();

class MessageService {
  constructor() {
    this.channel = null;
    this.queueName = process.env.QUEUE_NAME || "translations";
  }

  async connect() {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost"
      );
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log("Conectado ao RabbitMQ");
      return this.channel;
    } catch (error) {
      console.error("Erro ao conectar ao RabbitMQ:", error);
      throw error;
    }
  }

  async sendToQueue(message) {
    if (!this.channel) {
      await this.connect();
    }

    try {
      const messageStr = JSON.stringify(message);
      this.channel.sendToQueue(this.queueName, Buffer.from(messageStr), {
        persistent: true,
      });
      console.log(`Mensagem enviada para a fila: ${messageStr}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem para a fila:", error);
      throw error;
    }
  }
}

module.exports = new MessageService();
