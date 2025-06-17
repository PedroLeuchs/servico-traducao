const amqp = require("amqplib");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Translation = require("./models/Translation");
const translationService = require("./services/translationService");

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Função para processar mensagens da fila
async function processMessage(message) {
  let requestId;
  try {
    // Parsear a mensagem
    const content = JSON.parse(message.content.toString());
    requestId = content.requestId;

    console.log(`Processando mensagem: ${JSON.stringify(content)}`);

    // Buscar tradução no banco de dados
    const translation = await Translation.findOne({ requestId });

    if (!translation) {
      console.error(`Tradução não encontrada para o ID: ${requestId}`);
      return;
    }

    // Atualizar status para "processing"
    translation.status = "processing";
    await translation.save();

    // Realizar a tradução
    const translatedText = await translationService.translateText(
      content.sourceText,
      content.sourceLanguage,
      content.targetLanguage
    );

    // Atualizar tradução como "completed"
    translation.translatedText = translatedText;
    translation.status = "completed";
    await translation.save();

    console.log(`Tradução concluída: ${requestId}`);
  } catch (error) {
    console.error(`Erro ao processar tradução: ${error.message}`);

    // Se temos o ID da requisição, atualizar status para "failed"
    if (requestId) {
      try {
        const translation = await Translation.findOne({ requestId });
        if (translation) {
          translation.status = "failed";
          translation.error = error.message;
          await translation.save();
        }
      } catch (dbError) {
        console.error(
          `Erro ao atualizar status no banco de dados: ${dbError.message}`
        );
      }
    }
  }
}

// Conectar ao RabbitMQ e iniciar consumo de mensagens
async function startConsumer() {
  try {
    // Conectar ao RabbitMQ
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    const channel = await connection.createChannel();

    // Nome da fila
    const queueName = process.env.QUEUE_NAME || "translations";

    // Garantir que a fila existe
    await channel.assertQueue(queueName, { durable: true });

    // Configurar prefetch (número de mensagens que o worker pode processar simultaneamente)
    channel.prefetch(1);

    console.log(`Aguardando mensagens na fila ${queueName}...`);

    // Consumir mensagens da fila
    channel.consume(queueName, async (message) => {
      if (message) {
        await processMessage(message);
        // Confirmar que a mensagem foi processada
        channel.ack(message);
      }
    });

    // Manipular eventos de conexão
    connection.on("error", (err) => {
      console.error("Erro na conexão com RabbitMQ:", err);
      setTimeout(startConsumer, 5000); // Tentar reconectar após 5 segundos
    });

    connection.on("close", () => {
      console.warn("Conexão com RabbitMQ fechada. Tentando reconectar...");
      setTimeout(startConsumer, 5000); // Tentar reconectar após 5 segundos
    });
  } catch (error) {
    console.error("Falha ao iniciar consumidor:", error);
    setTimeout(startConsumer, 5000); // Tentar reconectar após 5 segundos
  }
}

// Iniciar o consumidor
startConsumer();
