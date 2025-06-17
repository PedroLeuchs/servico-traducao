const express = require("express");
const router = express.Router();
const translationController = require("../controllers/translationController");

// Criar nova tradução
router.post("/translations", translationController.createTranslation);

// Obter status da tradução
router.get(
  "/translations/:requestId",
  translationController.getTranslationStatus
);

// Listar todas as traduções
router.get("/translations", translationController.getAllTranslations);

module.exports = router;
