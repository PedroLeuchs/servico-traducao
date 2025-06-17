const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  sourceText: {
    type: String,
    required: true,
  },
  translatedText: {
    type: String,
    default: null,
  },
  sourceLanguage: {
    type: String,
    required: true,
  },
  targetLanguage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["queued", "processing", "completed", "failed"],
    default: "queued",
  },
  error: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Atualizar o campo updatedAt antes de salvar
translationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Translation = mongoose.model("Translation", translationSchema);

module.exports = Translation;
