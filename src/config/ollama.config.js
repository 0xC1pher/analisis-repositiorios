const ollamaConfig = {
  baseUrl: 'http://localhost:11434',
  defaultModel: 'llama2',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: `Eres un asistente de programación especializado en análisis de código.
  Debes:
  1. Analizar proyectos completos
  2. Identificar errores y posibles mejoras
  3. Calcular progreso del desarrollo
  4. Sugerir implementaciones faltantes
  5. Mantener Clean Code y buenas prácticas`,
  
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
    fallbackResponse: "Lo siento, encontré un problema. Revisando la solución..."
  }
};

export default ollamaConfig;