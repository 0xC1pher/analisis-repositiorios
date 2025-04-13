let gradioClient = null;
let isConnecting = false;
const maxRetries = 3;
const retryDelay = 2000;

const connectClient = async (retryCount = 0) => {
  if (gradioClient) return gradioClient;
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return connectClient(retryCount);
  }

  isConnecting = true;
  
  try {
    // Simulación de conexión (en producción usaría fetch API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulamos un cliente con métodos básicos
    gradioClient = {
      predict: async (endpoint, data) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: [
                [...(data.history || []), {role: 'bot', content: 'Respuesta simulada del modelo'}],
                'Este es un contenido de respuesta en markdown simulada'
              ]
            });
          }, 800);
        });
      },
      disconnect: () => {
        gradioClient = null;
      }
    };
    
    return gradioClient;
  } catch (error) {
    if (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectClient(retryCount + 1);
    }
    throw new Error(`Failed to connect after ${maxRetries} attempts: ${error.message}`);
  } finally {
    isConnecting = false;
  }
};

const getClient = async () => {
  if (!gradioClient) {
    gradioClient = await connectClient();
  }
  return gradioClient;
};

const resetClient = () => {
  if (gradioClient) {
    gradioClient.disconnect();
    gradioClient = null;
  }
};

export { getClient, resetClient };