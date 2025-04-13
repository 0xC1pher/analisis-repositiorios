class ErrorHandler {
  static handle(error, setErrorState) {
    const errorMessages = {
      'URL_INVALID': 'URL de repositorio inválida',
      'NETWORK_ERROR': 'Error de conexión',
      'IMPORT_FAILED': 'Importación fallida',
      'DIRECTORY_UNSUPPORTED': 'Su navegador no soporta importación de directorios',
      'DEFAULT': 'Ha ocurrido un error inesperado'
    };

    const message = errorMessages[error.code] || error.message || errorMessages['DEFAULT'];
    
    console.error('Error:', error);
    
    if (setErrorState) {
      setErrorState({
        hasError: true,
        message: message,
        originalError: error
      });
    }

    return message;
  }
}

export default ErrorHandler;