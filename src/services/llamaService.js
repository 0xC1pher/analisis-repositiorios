import { getClient, resetClient } from './llamaConnection';

const chatFlow = async (message, history, useDeepResearch) => {
  try {
    const client = await getClient();
    
    // 1. Obtener respuesta del modelo
    const response = await client.predict("/query_deepseek_streaming", {
      message: message,
      history: history,
      use_deep_research: useDeepResearch
    });

    // 2. Procesar respuesta
    const newHistory = response.data[0];
    const markdownContent = response.data[1];

    // 3. Resetear conexión periódicamente
    if (Math.random() > 0.8) { // Ejemplo: resetear el 20% de las veces
      await resetClient();
    }

    return {
      success: true,
      history: newHistory,
      content: markdownContent
    };
  } catch (error) {
    console.error("Error en chatFlow:", error);
    await resetClient();
    return {
      success: false,
      error: "Error al conectar con el servicio de IA"
    };
  }
};

export default chatFlow;