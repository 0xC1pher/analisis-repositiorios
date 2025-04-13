class LlamaClient {
  constructor() {
    this.client = null;
    this.history = [];
    this.useDeepResearch = true;
    this.isInitializing = false;
  }

  async initialize() {
    if (this.client) return this.client;
    if (this.isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.initialize();
    }

    this.isInitializing = true;
    
    try {
      // Simulación de conexión al modelo (en producción usaría la conexión real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.client = {
        predict: async (endpoint, data) => {
          return new Promise(resolve => {
            setTimeout(() => {
              const responses = [
                "He analizado tu código y encontré oportunidades de mejora en la estructura.",
                "Basado en los patrones detectados, te recomiendo implementar este diseño:",
                "El análisis muestra que este módulo podría optimizarse para mejor rendimiento."
              ];
              const randomResponse = responses[Math.floor(Math.random() * responses.length)];
              
              resolve({
                data: [
                  [...(data.history || []), {role: 'bot', content: randomResponse}],
                  randomResponse
                ]
              });
            }, 800);
          });
        }
      };
      
      return this.client;
    } catch (error) {
      console.error("Error initializing Llama client:", error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  async sendMessage(message) {
    try {
      if (!this.client) {
        await this.initialize();
      }

      const response = await this.client.predict("/query_deepseek_streaming", {
        message: message,
        history: this.history,
        use_deep_research: this.useDeepResearch
      });

      this.history = response.data[0];
      return {
        success: true,
        history: this.history,
        content: response.data[1]
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        success: false,
        error: "Error communicating with AI model"
      };
    }
  }

  reset() {
    this.client = null;
    this.history = [];
  }
}

const llamaClientInstance = new LlamaClient();
export default llamaClientInstance;