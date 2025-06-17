const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const translationRoutes = require("./routes/translationRoutes");
const messageService = require("./services/messageService");

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar aplicação Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Conectar ao RabbitMQ
messageService
  .connect()
  .then(() => console.log("Serviço de mensagens inicializado"))
  .catch((err) =>
    console.error("Erro ao inicializar serviço de mensagens:", err)
  );

// Rota básica
app.get("/", (req, res) => {
  res.json({ message: "API de Tradução funcionando!" });
});

// Rotas da API
app.use("/api", translationRoutes);

// Manipulação de erros
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
