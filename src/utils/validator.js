/**
 * validator Utility
 * Função utilitária para processamento de dados
 * @module utils/validator
 */

/**
 * Processa input e retorna resultado formatado
 * @param {*} input - Valor de entrada para processamento
 * @returns {*} Valor processado ou null se inválido
 * @example
 * const result = validator({ id: 1 });
 * console.log(result); // { id: 1 }
 */
const validator = (input) => {
  // Validate input exists
  if (input === null || input === undefined) {
    return null;
  }
  
  // Return processed value
  return input;
};

module.exports = validator;
