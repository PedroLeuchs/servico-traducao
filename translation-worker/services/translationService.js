// Serviço de tradução simulado
// Em um ambiente real, este serviço poderia integrar com APIs como Google Translate, DeepL, etc.

class TranslationService {
  // Dicionário simulado para tradução
  constructor() {
    this.translations = {
      en: {
        pt: {
          hello: "olá",
          "good morning": "bom dia",
          "good afternoon": "boa tarde",
          "good night": "boa noite",
          "how are you?": "como você está?",
          "thank you": "obrigado",
          goodbye: "adeus",
          welcome: "bem-vindo",
          please: "por favor",
          "excuse me": "com licença",
          sorry: "desculpe",
          yes: "sim",
          no: "não",
          maybe: "talvez",
          today: "hoje",
          tomorrow: "amanhã",
          yesterday: "ontem",
        },
        es: {
          hello: "hola",
          "good morning": "buenos días",
          "good afternoon": "buenas tardes",
          "good night": "buenas noches",
          "how are you?": "¿cómo estás?",
          "thank you": "gracias",
          goodbye: "adiós",
          welcome: "bienvenido",
          please: "por favor",
          "excuse me": "disculpe",
          sorry: "lo siento",
          yes: "sí",
          no: "no",
          maybe: "tal vez",
          today: "hoy",
          tomorrow: "mañana",
          yesterday: "ayer",
        },
      },
      pt: {
        en: {
          olá: "hello",
          "bom dia": "good morning",
          "boa tarde": "good afternoon",
          "boa noite": "good night",
          "como você está?": "how are you?",
          obrigado: "thank you",
          adeus: "goodbye",
          "bem-vindo": "welcome",
          "por favor": "please",
          "com licença": "excuse me",
          desculpe: "sorry",
          sim: "yes",
          não: "no",
          talvez: "maybe",
          hoje: "today",
          amanhã: "tomorrow",
          ontem: "yesterday",
        },
        es: {
          olá: "hola",
          "bom dia": "buenos días",
          "boa tarde": "buenas tardes",
          "boa noite": "buenas noches",
          "como você está?": "¿cómo estás?",
          obrigado: "gracias",
          adeus: "adiós",
          "bem-vindo": "bienvenido",
          "por favor": "por favor",
          "com licença": "disculpe",
          desculpe: "lo siento",
          sim: "sí",
          não: "no",
          talvez: "tal vez",
          hoje: "hoy",
          amanhã: "mañana",
          ontem: "ayer",
        },
      },
    };
  }

  /**
   * Método para traduzir texto
   * @param {string} sourceText - Texto a ser traduzido
   * @param {string} sourceLanguage - Idioma de origem (código ISO: en, pt, es, etc)
   * @param {string} targetLanguage - Idioma de destino (código ISO: en, pt, es, etc)
   * @returns {Promise<string>} - Texto traduzido
   */
  async translateText(sourceText, sourceLanguage, targetLanguage) {
    // Simular um delay para parecer uma chamada assíncrona real
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verifica se temos suporte para o par de idiomas
    if (
      !this.translations[sourceLanguage] ||
      !this.translations[sourceLanguage][targetLanguage]
    ) {
      throw new Error(
        `Não há suporte para tradução de ${sourceLanguage} para ${targetLanguage}`
      );
    }

    // Verificar se o texto está no dicionário
    const dictionary = this.translations[sourceLanguage][targetLanguage];
    const lowerText = sourceText.toLowerCase();

    if (dictionary[lowerText]) {
      return dictionary[lowerText];
    }

    // Se o texto não estiver no dicionário, simulamos uma tradução simples
    // Em um caso real, aqui faria uma chamada para uma API de tradução
    return `[${targetLanguage}] ${sourceText}`;
  }
}

module.exports = new TranslationService();
