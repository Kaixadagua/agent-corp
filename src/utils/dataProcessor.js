/**
 * dataProcessor Utility
 * Função utilitária para processamento de dados
 * @module utils/dataProcessor
 */

/**
 * Processa input e retorna resultado formatado
 * @param {*} input - Valor de entrada para processamento
 * @returns {*} Valor processado ou null se inválido
 * @example
 * const result = dataProcessor({ id: 1 });
 * console.log(result); // { id: 1 }
 */
const dataProcessor = (input) => {
  // Validate input exists
  if (input === null || input === undefined) {
    return null;
  }
  
  // Return processed value
  return input;
};

module.exports = dataProcessor;
