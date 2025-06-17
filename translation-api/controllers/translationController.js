const { v4: uuidv4 } = require("uuid");
const Translation = require("../models/Translation");
const messageService = require("../services/messageService");

// Criar nova tradução
exports.createTranslation = async (req, res) => {
  try {
    const { sourceText, sourceLanguage, targetLanguage } = req.body;

    // Validação básica
    if (!sourceText || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        message:
          "Texto de origem, idioma de origem e idioma de destino são obrigatórios",
      });
    }

    // Gerar um ID único para a requisição
    const requestId = uuidv4();

    // Criar um novo registro de tradução
    const translation = new Translation({
      requestId,
      sourceText,
      sourceLanguage,
      targetLanguage,
      status: "queued",
    });

    // Salvar no banco de dados
    await translation.save();

    // Enviar para a fila de mensagens
    await messageService.sendToQueue({
      requestId,
      sourceText,
      sourceLanguage,
      targetLanguage,
    });

    // Responder ao cliente
    res.status(202).json({
      message: "Tradução em processamento",
      requestId,
    });
  } catch (error) {
    console.error("Erro ao criar tradução:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Obter status da tradução
exports.getTranslationStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Buscar a tradução pelo requestId
    const translation = await Translation.findOne({ requestId });

    if (!translation) {
      return res.status(404).json({ message: "Tradução não encontrada" });
    }

    // Preparar a resposta baseada no status
    const response = {
      requestId: translation.requestId,
      status: translation.status,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    };

    // Incluir texto traduzido se a tradução estiver completa
    if (translation.status === "completed") {
      response.translatedText = translation.translatedText;
    }

    // Incluir erro se houver falha
    if (translation.status === "failed") {
      response.error = translation.error;
    }

    res.json(response);
  } catch (error) {
    console.error("Erro ao obter status da tradução:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Listar todas as traduções
exports.getAllTranslations = async (req, res) => {
  try {
    const translations = await Translation.find(
      {},
      {
        requestId: 1,
        sourceLanguage: 1,
        targetLanguage: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      }
    );

    res.json(translations);
  } catch (error) {
    console.error("Erro ao listar traduções:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
