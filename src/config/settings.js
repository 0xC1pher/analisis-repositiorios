export const ROLES = {
  DEVELOPER: {
    name: 'Desarrollador',
    description: 'Acceso completo a análisis de código y sugerencias',
    permissions: ['analyze', 'configure', 'chat']
  },
  ARCHITECT: {
    name: 'Arquitecto',
    description: 'Enfoque en estructura y patrones de diseño',
    permissions: ['analyze', 'diagrams', 'standards']
  },
  QA: {
    name: 'Control Calidad',
    description: 'Revisión de estándares y vulnerabilidades',
    permissions: ['standards', 'vulnerabilities']
  }
};

export const AI_PERSONAS = {
  STRICT: {
    name: 'Estricto',
    prompt: 'Eres un revisor de código estricto que sigue al pie de la letra los estándares de la industria. Sé directo y profesional en tus análisis.'
  },
  HELPFUL: {
    name: 'Colaborador',
    prompt: 'Eres un asistente útil que explica los problemas de código de forma didáctica y sugiere mejoras constructivas.'
  },
  DETAILED: {
    name: 'Detallista',
    prompt: 'Proporciona análisis exhaustivos con ejemplos de código, explicaciones técnicas detalladas y referencias a documentación.'
  }
};